import { fork } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { channelSelectionNames } from './channel-selection.js';
import { CHANNEL_DAEMON_WORKER_SENTINEL, CHANNEL_WORKER_HEARTBEAT_INTERVAL_MS, QWEN_DAEMON_TOKEN_ENV, QWEN_DAEMON_URL_ENV, QWEN_DAEMON_WORKSPACE_ENV, HOPCODE_SERVER_TOKEN_ENV, } from './channel-worker-env.js';
import { sanitizeLogText } from '@hoptrendy/channel-base';
import { CHANNEL_WORKER_KILL_GRACE_MS, CHANNEL_WORKER_STARTUP_TIMEOUT_MS, CHANNEL_WORKER_STOP_GRACE_MS, } from '@hoptrendy/acp-bridge/channelControlTimeouts';
import { CHANNEL_WEBHOOK_TASK_IPC_TIMEOUT_MS, ChannelWebhookEnqueueError, createChannelWebhookTaskMessage, isChannelWebhookEnqueueErrorCode, isChannelWebhookTaskResultMessage, } from './channel-webhook-ipc.js';
import { createWorkerDiagnosticRedactor, normalizeWorkerDiagnostic, sanitizeWorkerDiagnostic, } from './channel-worker-diagnostics.js';
import { isChannelStartupReportMessage, isChannelStartupReportType, MAX_CHANNEL_STARTUP_FAILURES, MAX_CHANNEL_STARTUP_FAILURE_CHANNEL_LENGTH, MAX_CHANNEL_STARTUP_FAILURE_CODE_LENGTH, MAX_CHANNEL_STARTUP_FAILURE_MESSAGE_LENGTH, } from './channel-worker-startup-ipc.js';
const DEFAULT_CHANNEL_WORKER_HEARTBEAT_TIMEOUT_MS = 45_000;
const MAX_WORKER_LOG_LINE_LENGTH = 4096;
const MAX_WORKER_LOG_BUFFER_LENGTH = 64 * 1024;
const MAX_WORKER_LOG_DISCARDED_REMAINDER_LENGTH = MAX_WORKER_LOG_BUFFER_LENGTH;
export class ChannelWorkerStopError extends Error {
    constructor(message = 'Channel worker did not exit after SIGKILL.') {
        super(message);
        this.name = 'ChannelWorkerStopError';
    }
}
export class ChannelWorkerStartupError extends Error {
    startupFailures;
    startupFailuresTruncated;
    constructor(message, details) {
        super(message);
        this.name = 'ChannelWorkerStartupError';
        this.startupFailures = details.startupFailures.map((failure) => ({
            ...failure,
            workspaceCwd: details.workspaceCwd,
        }));
        this.startupFailuresTruncated = details.startupFailuresTruncated === true;
    }
}
const DEFAULT_RESTART_POLICY = {
    maxRestarts: 3,
    windowMs: 5 * 60_000,
    delaysMs: [1_000, 5_000, 15_000],
};
function selectionChannelArgs(selection) {
    return channelSelectionNames(selection).flatMap((name) => [
        '--channel',
        name,
    ]);
}
function defaultSpawnWorker(execPath, argv, options) {
    const child = fork(argv[0], argv.slice(1), {
        execPath,
        cwd: options.cwd,
        env: options.env,
        stdio: options.stdio,
    });
    return child;
}
function isReadyMessage(message) {
    return (typeof message === 'object' &&
        message !== null &&
        message.type === 'ready');
}
function isHeartbeatMessage(message) {
    return (typeof message === 'object' &&
        message !== null &&
        message.type === 'heartbeat');
}
function requestedChannelNames(selection) {
    return selection.mode === 'names' ? [...selection.names] : undefined;
}
function workerLogRedactionOptions(daemonToken, workerEnv) {
    return {
        ...(daemonToken ? { daemonToken } : {}),
        workerEnv,
    };
}
function sanitizeWorkerError(error, redaction) {
    return redaction
        ? sanitizeWorkerDiagnostic(error, 512, redaction)
        : sanitizeLogText(normalizeWorkerDiagnostic(error), 512);
}
function notifyExit(onExit, snapshot) {
    try {
        onExit?.(snapshot);
    }
    catch {
        // onExit is bookkeeping; worker exit handling must not crash the daemon.
    }
}
function notifyReady(onReady, snapshot) {
    try {
        onReady?.(snapshot);
    }
    catch {
        // onReady is bookkeeping; worker readiness must not crash the daemon.
    }
}
function notifyLog(onLog, entry) {
    try {
        onLog?.(entry);
    }
    catch {
        // onLog is bookkeeping; worker log forwarding must not crash the daemon.
    }
}
function waitForExit(child, timeoutMs) {
    return new Promise((resolve) => {
        let settled = false;
        const onExit = () => done(true);
        const done = (exited) => {
            if (settled)
                return;
            settled = true;
            clearTimeout(timer);
            child.removeListener('exit', onExit);
            resolve(exited);
        };
        const timer = setTimeout(() => done(false), timeoutMs);
        timer.unref();
        child.once('exit', onExit);
    });
}
function hasObservedExit(snapshot) {
    return snapshot.exitCode !== undefined || snapshot.signal !== undefined;
}
function createWorkerEnv(opts) {
    const env = { ...(opts.baseEnv ?? process.env) };
    env['HOPCODE_CODE_NO_RELAUNCH'] = 'true';
    env[CHANNEL_DAEMON_WORKER_SENTINEL] = randomUUID();
    env[QWEN_DAEMON_URL_ENV] = opts.daemonUrl;
    env[QWEN_DAEMON_WORKSPACE_ENV] = opts.workspace;
    delete env[HOPCODE_SERVER_TOKEN_ENV];
    delete env[QWEN_DAEMON_TOKEN_ENV];
    if (opts.daemonToken) {
        env[QWEN_DAEMON_TOKEN_ENV] = opts.daemonToken;
    }
    return env;
}
function attachWorkerLogStream(stream, streamName, opts) {
    if (!stream)
        return () => { };
    let buffer = '';
    let discardingOversizedLineRemainder = false;
    let discardedOversizedLineRemainderLength = 0;
    const redactWorkerLogLineForStream = createWorkerDiagnosticRedactor({
        ...(opts.daemonToken ? { daemonToken: opts.daemonToken } : {}),
        workerEnv: opts.workerEnv,
    });
    const flushLine = (line) => {
        const displayLine = line.replace(/\t/gu, ' ');
        const redacted = redactWorkerLogLineForStream(normalizeWorkerDiagnostic(displayLine));
        notifyLog(opts.onLog, {
            stream: streamName,
            line: sanitizeLogText(redacted, MAX_WORKER_LOG_LINE_LENGTH),
        });
    };
    const flushPartial = () => {
        if (buffer.length === 0)
            return;
        flushLine(buffer);
        buffer = '';
    };
    const flushOversizedBuffer = () => {
        if (buffer.length <= MAX_WORKER_LOG_BUFFER_LENGTH)
            return;
        // Keep one truncated entry for the huge logical line, then drop its tail
        // until the next newline so a single worker write cannot flood daemon logs.
        flushLine(buffer);
        buffer = '';
        discardingOversizedLineRemainder = true;
        discardedOversizedLineRemainderLength = 0;
    };
    stream.on('data', (chunk) => {
        buffer +=
            typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
        for (;;) {
            const newlineIndex = buffer.search(/\r?\n/);
            if (newlineIndex < 0)
                break;
            const line = buffer.slice(0, newlineIndex);
            const newlineLength = buffer[newlineIndex] === '\r' && buffer[newlineIndex + 1] === '\n'
                ? 2
                : 1;
            buffer = buffer.slice(newlineIndex + newlineLength);
            if (!discardingOversizedLineRemainder) {
                flushLine(line);
            }
            discardingOversizedLineRemainder = false;
            discardedOversizedLineRemainderLength = 0;
        }
        if (discardingOversizedLineRemainder) {
            discardedOversizedLineRemainderLength += buffer.length;
            buffer = '';
            if (discardedOversizedLineRemainderLength >=
                MAX_WORKER_LOG_DISCARDED_REMAINDER_LENGTH) {
                discardingOversizedLineRemainder = false;
                discardedOversizedLineRemainderLength = 0;
            }
            return;
        }
        flushOversizedBuffer();
    });
    stream.on('end', flushPartial);
    stream.on('close', flushPartial);
    stream.on('error', () => {
        flushPartial();
    });
    return flushPartial;
}
export function createChannelWorkerSupervisor(opts) {
    const spawnWorker = opts.spawnWorker ?? defaultSpawnWorker;
    const restartPolicy = opts.restartPolicy ?? DEFAULT_RESTART_POLICY;
    if (restartPolicy.delaysMs.length === 0) {
        throw new Error('restartPolicy.delaysMs must be non-empty.');
    }
    const heartbeatTimeoutMs = opts.heartbeatTimeoutMs ?? DEFAULT_CHANNEL_WORKER_HEARTBEAT_TIMEOUT_MS;
    if (heartbeatTimeoutMs > 0 &&
        heartbeatTimeoutMs <= CHANNEL_WORKER_HEARTBEAT_INTERVAL_MS) {
        throw new Error(`heartbeatTimeoutMs (${heartbeatTimeoutMs}) must exceed the worker heartbeat interval (${CHANNEL_WORKER_HEARTBEAT_INTERVAL_MS}ms) or be 0 to disable.`);
    }
    let child;
    let snapshot = {
        enabled: true,
        state: 'disabled',
        channels: channelSelectionNames(opts.selection),
        restartCount: 0,
    };
    let stopping = false;
    let restartTimer;
    let staleHeartbeatTimer;
    let restartAttemptTimes = [];
    const pendingWebhookTasks = new Map();
    let restarting;
    let disposed = false;
    const snapshotCopy = () => ({
        ...snapshot,
        channels: [...snapshot.channels],
        ...(snapshot.requestedChannels
            ? { requestedChannels: [...snapshot.requestedChannels] }
            : {}),
        ...(snapshot.startupFailures
            ? {
                startupFailures: snapshot.startupFailures.map((failure) => ({
                    ...failure,
                })),
            }
            : {}),
    });
    const clearRestartTimer = () => {
        if (restartTimer) {
            clearTimeout(restartTimer);
            restartTimer = undefined;
        }
        if (snapshot.nextRestartAt) {
            const next = { ...snapshot };
            delete next.nextRestartAt;
            snapshot = next;
        }
    };
    const clearStaleHeartbeatTimer = () => {
        if (!staleHeartbeatTimer)
            return;
        clearTimeout(staleHeartbeatTimer);
        staleHeartbeatTimer = undefined;
    };
    const rejectPendingWebhookTasks = (code, message) => {
        for (const pending of pendingWebhookTasks.values()) {
            clearTimeout(pending.timer);
            pending.reject(new ChannelWebhookEnqueueError(code, message));
        }
        pendingWebhookTasks.clear();
    };
    const rejectPendingWebhookTask = (id, err) => {
        const pending = pendingWebhookTasks.get(id);
        if (!pending)
            return;
        pendingWebhookTasks.delete(id);
        clearTimeout(pending.timer);
        pending.reject(err);
    };
    const settleWebhookTask = (message) => {
        if (!isChannelWebhookTaskResultMessage(message))
            return false;
        const pending = pendingWebhookTasks.get(message.id);
        if (!pending)
            return true;
        if (message.ok) {
            pendingWebhookTasks.delete(message.id);
            clearTimeout(pending.timer);
            pending.resolve({ accepted: true });
        }
        else {
            const code = isChannelWebhookEnqueueErrorCode(message.code)
                ? message.code
                : 'channel_webhook_enqueue_failed';
            rejectPendingWebhookTask(message.id, new ChannelWebhookEnqueueError(code, message.error || 'Channel webhook task failed.'));
        }
        return true;
    };
    const pruneRestartAttempts = (nowMs) => {
        restartAttemptTimes = restartAttemptTimes.filter((attemptMs) => nowMs - attemptMs < restartPolicy.windowMs);
    };
    const canScheduleRestart = (nowMs) => {
        pruneRestartAttempts(nowMs);
        return restartAttemptTimes.length < restartPolicy.maxRestarts;
    };
    const nextRestartDelayMs = () => {
        const index = Math.min(restartAttemptTimes.length, restartPolicy.delaysMs.length - 1);
        return restartPolicy.delaysMs[index] ?? 0;
    };
    const setExited = (state, code, signal, error) => {
        const next = {
            ...snapshot,
            state,
            exitCode: code,
            signal,
            lastExitAt: new Date().toISOString(),
        };
        if (error) {
            next.error = error;
        }
        else {
            delete next.error;
        }
        snapshot = {
            ...next,
        };
    };
    const scheduleRestart = () => {
        if (stopping)
            return false;
        const nowMs = Date.now();
        if (!canScheduleRestart(nowMs)) {
            const lastError = snapshot.error;
            snapshot = {
                ...snapshot,
                state: 'failed',
                error: lastError
                    ? `Channel worker restart budget exhausted. Last error: ${lastError}`
                    : 'Channel worker restart budget exhausted.',
                nextRestartAt: undefined,
            };
            return false;
        }
        clearRestartTimer();
        const delayMs = nextRestartDelayMs();
        const nextRestartAt = new Date(nowMs + delayMs).toISOString();
        snapshot = {
            ...snapshot,
            nextRestartAt,
        };
        restartTimer = setTimeout(() => {
            restartTimer = undefined;
            void launch('restart').catch((err) => {
                handleRestartFailure(err instanceof Error ? err.message : String(err));
            });
        }, delayMs);
        restartTimer.unref();
        return true;
    };
    const handleRestartFailure = (error, redaction) => {
        snapshot = {
            ...snapshot,
            state: 'failed',
            error: sanitizeWorkerError(error, redaction),
        };
        scheduleRestart();
        notifyExit(opts.onExit, snapshotCopy());
    };
    const armStaleHeartbeatTimer = (startedChild) => {
        clearStaleHeartbeatTimer();
        if (heartbeatTimeoutMs <= 0)
            return;
        staleHeartbeatTimer = setTimeout(() => {
            if (child !== startedChild || stopping)
                return;
            snapshot = {
                ...snapshot,
                error: 'Channel worker heartbeat timed out.',
                staleHeartbeatAt: new Date().toISOString(),
            };
            startedChild.kill('SIGKILL');
        }, heartbeatTimeoutMs);
        staleHeartbeatTimer.unref();
    };
    const launch = async (kind) => {
        clearStaleHeartbeatTimer();
        const argv = [
            opts.cliEntryPath,
            'channel',
            'daemon-worker',
            ...selectionChannelArgs(opts.selection),
        ];
        const env = createWorkerEnv({
            daemonUrl: opts.daemonUrl,
            workspace: opts.workspace,
            ...(opts.daemonToken ? { daemonToken: opts.daemonToken } : {}),
            ...(opts.workerBaseEnv ? { baseEnv: opts.workerBaseEnv } : {}),
        });
        const redaction = workerLogRedactionOptions(opts.daemonToken, env);
        const requestedChannels = requestedChannelNames(opts.selection);
        const startedAt = new Date().toISOString();
        snapshot = {
            enabled: true,
            state: 'starting',
            channels: channelSelectionNames(opts.selection),
            ...(requestedChannels ? { requestedChannels } : {}),
            startedAt,
            restartCount: snapshot.restartCount ?? 0,
            ...(snapshot.lastExitAt ? { lastExitAt: snapshot.lastExitAt } : {}),
            ...(snapshot.lastHeartbeatAt
                ? { lastHeartbeatAt: snapshot.lastHeartbeatAt }
                : {}),
            ...(snapshot.staleHeartbeatAt
                ? { staleHeartbeatAt: snapshot.staleHeartbeatAt }
                : {}),
        };
        if (kind === 'restart') {
            const nowMs = Date.now();
            restartAttemptTimes.push(nowMs);
            snapshot = {
                ...snapshot,
                restartCount: (snapshot.restartCount ?? 0) + 1,
                lastRestartAt: new Date(nowMs).toISOString(),
                nextRestartAt: undefined,
            };
        }
        let startedChild;
        try {
            startedChild = spawnWorker(process.execPath, argv, {
                cwd: opts.workspace,
                env,
                stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            const error = sanitizeWorkerError(message, redaction);
            if (kind === 'initial') {
                snapshot = {
                    ...snapshot,
                    state: 'failed',
                    error,
                };
                throw new Error(error);
            }
            handleRestartFailure(message, redaction);
            return;
        }
        child = startedChild;
        attachWorkerLogStream(startedChild.stdout, 'stdout', {
            ...redaction,
            onLog: opts.onLog,
        });
        attachWorkerLogStream(startedChild.stderr, 'stderr', {
            ...redaction,
            onLog: opts.onLog,
        });
        if (startedChild.pid !== undefined) {
            snapshot = { ...snapshot, pid: startedChild.pid };
        }
        await new Promise((resolve, reject) => {
            let settled = false;
            let ready = false;
            let exitObserved = false;
            let terminatingBeforeReady = false;
            let startupTimer;
            const cleanupStartupTimer = () => {
                if (!startupTimer)
                    return;
                clearTimeout(startupTimer);
                startupTimer = undefined;
            };
            const cleanupLaunch = () => {
                cleanupStartupTimer();
                startedChild.removeListener('message', handleMessage);
                clearStaleHeartbeatTimer();
            };
            const terminateBeforeReady = () => {
                cleanupLaunch();
                if (terminatingBeforeReady)
                    return;
                terminatingBeforeReady = true;
                const exited = waitForExit(startedChild, CHANNEL_WORKER_KILL_GRACE_MS);
                startedChild.kill('SIGTERM');
                void exited.then(async (didExit) => {
                    if (!didExit && child === startedChild && !exitObserved) {
                        const killed = waitForExit(startedChild, CHANNEL_WORKER_KILL_GRACE_MS);
                        startedChild.kill('SIGKILL');
                        if (!(await killed) && child === startedChild && !exitObserved) {
                            stopping = true;
                            notifyLog(opts.onLog, {
                                stream: 'stderr',
                                line: 'Channel worker did not exit after SIGKILL; automatic restart is disabled.',
                            });
                            snapshot = {
                                ...snapshot,
                                state: 'failed',
                                error: snapshot.error ??
                                    'Channel worker did not exit after SIGKILL.',
                            };
                            notifyExit(opts.onExit, snapshotCopy());
                        }
                    }
                });
            };
            const failBeforeReady = (err) => {
                if (settled)
                    return;
                settled = true;
                cleanupStartupTimer();
                if (kind === 'initial') {
                    reject(err);
                }
                else {
                    resolve();
                }
            };
            const startupError = (message) => {
                const failures = snapshot.startupFailures;
                return failures && failures.length > 0
                    ? new ChannelWorkerStartupError(message, {
                        workspaceCwd: opts.workspace,
                        startupFailures: failures,
                        ...(snapshot.startupFailuresTruncated
                            ? { startupFailuresTruncated: true }
                            : {}),
                    })
                    : new Error(message);
            };
            const failStartupProtocol = (detail) => {
                if (settled || ready || child !== startedChild)
                    return;
                const error = sanitizeWorkerError(`Channel worker startup IPC protocol error: ${detail}`, redaction);
                snapshot = { ...snapshot, state: 'failed', error };
                failBeforeReady(startupError(error));
                terminateBeforeReady();
            };
            const acknowledgeStartupReport = () => {
                const send = startedChild.send;
                if (!send) {
                    failStartupProtocol('acknowledgement is unavailable.');
                    return;
                }
                try {
                    send.call(startedChild, { type: 'channel_startup_report_ack' }, (err) => {
                        if (err) {
                            failStartupProtocol('acknowledgement failed.');
                        }
                    });
                }
                catch {
                    failStartupProtocol('acknowledgement failed.');
                }
            };
            const handleStartupReport = (message) => {
                if (!isChannelStartupReportMessage(message)) {
                    failStartupProtocol('invalid startup report.');
                    return;
                }
                if (message.type === 'channel_startup_failures_truncated') {
                    if (snapshot.startupFailuresTruncated ||
                        snapshot.startupFailures?.length !== MAX_CHANNEL_STARTUP_FAILURES) {
                        failStartupProtocol('invalid truncation marker.');
                        return;
                    }
                    snapshot = { ...snapshot, startupFailuresTruncated: true };
                    acknowledgeStartupReport();
                    return;
                }
                if (snapshot.startupFailuresTruncated ||
                    (snapshot.startupFailures?.length ?? 0) >=
                        MAX_CHANNEL_STARTUP_FAILURES) {
                    failStartupProtocol('too many startup failures.');
                    return;
                }
                const safeChannel = sanitizeWorkerDiagnostic(message.failure.channel, MAX_CHANNEL_STARTUP_FAILURE_CHANNEL_LENGTH, redaction) || '<unnamed>';
                const safeMessage = sanitizeWorkerDiagnostic(message.failure.message, MAX_CHANNEL_STARTUP_FAILURE_MESSAGE_LENGTH, redaction) || 'Channel connection failed.';
                const safeCode = message.failure.code
                    ? sanitizeWorkerDiagnostic(message.failure.code, MAX_CHANNEL_STARTUP_FAILURE_CODE_LENGTH, redaction)
                    : undefined;
                const failure = {
                    channel: safeChannel,
                    phase: 'connect',
                    ...(safeCode ? { code: safeCode } : {}),
                    message: safeMessage,
                };
                snapshot = {
                    ...snapshot,
                    startupFailures: [...(snapshot.startupFailures ?? []), failure],
                };
                acknowledgeStartupReport();
            };
            const completeReady = (message) => {
                if (settled || child !== startedChild)
                    return;
                settled = true;
                ready = true;
                cleanupStartupTimer();
                const next = {
                    ...snapshot,
                    state: 'running',
                    pid: message.pid ?? startedChild.pid,
                    channels: message.channels && message.channels.length > 0
                        ? [...message.channels]
                        : [...snapshot.channels],
                };
                delete next.error;
                delete next.lastHeartbeatAt;
                delete next.nextRestartAt;
                delete next.staleHeartbeatAt;
                if (message.requestedChannels?.length) {
                    next.requestedChannels = [...message.requestedChannels];
                }
                snapshot = next;
                armStaleHeartbeatTimer(startedChild);
                notifyReady(opts.onReady, snapshotCopy());
                resolve();
            };
            const handleHeartbeat = (message) => {
                if (!ready || child !== startedChild)
                    return;
                const currentPid = snapshot.pid ?? startedChild.pid;
                if (message.pid !== undefined && currentPid !== undefined) {
                    if (message.pid !== currentPid)
                        return;
                }
                // Use daemon clock, not worker-supplied message.at — a compromised
                // adapter could inject arbitrary data via the IPC heartbeat.
                snapshot = {
                    ...snapshot,
                    lastHeartbeatAt: new Date().toISOString(),
                };
                armStaleHeartbeatTimer(startedChild);
            };
            function handleMessage(message) {
                if (child !== startedChild)
                    return;
                if (settleWebhookTask(message)) {
                    return;
                }
                if (!ready && isChannelStartupReportType(message)) {
                    handleStartupReport(message);
                }
                else if (!ready && isReadyMessage(message)) {
                    completeReady(message);
                }
                else if (isHeartbeatMessage(message)) {
                    handleHeartbeat(message);
                }
            }
            function settleExit(code, signal) {
                if (child !== startedChild)
                    return;
                exitObserved = true;
                cleanupLaunch();
                const state = ready ? 'exited' : 'failed';
                const message = `Channel worker exited before ready (code=${code ?? 'null'}, signal=${signal ?? 'null'}).`;
                setExited(state, code, signal, snapshot.error ??
                    (ready ? undefined : sanitizeWorkerError(message, redaction)));
                rejectPendingWebhookTasks('channel_worker_unavailable', 'Channel worker exited.');
                child = undefined;
                if ((ready || kind === 'restart') && !stopping) {
                    scheduleRestart();
                    notifyExit(opts.onExit, snapshotCopy());
                }
                if (!settled) {
                    failBeforeReady(startupError(snapshot.error ?? message));
                }
            }
            function settleError(err) {
                if (child !== startedChild || exitObserved)
                    return;
                if (settled && ready) {
                    snapshot = {
                        ...snapshot,
                        error: sanitizeWorkerError(err.message, redaction),
                    };
                    startedChild.kill('SIGTERM');
                    return;
                }
                snapshot = {
                    ...snapshot,
                    state: 'failed',
                    error: sanitizeWorkerError(err.message, redaction),
                };
                terminateBeforeReady();
                if (!settled) {
                    failBeforeReady(startupError(snapshot.error ?? 'Channel worker failed to start.'));
                }
            }
            startupTimer = setTimeout(() => {
                const timeoutMs = opts.startupTimeoutMs ?? CHANNEL_WORKER_STARTUP_TIMEOUT_MS;
                const error = `Channel worker did not become ready within ${timeoutMs}ms.`;
                snapshot = {
                    ...snapshot,
                    state: 'failed',
                    error: sanitizeWorkerError(error, redaction),
                };
                failBeforeReady(startupError(error));
                if (child === startedChild) {
                    terminateBeforeReady();
                }
            }, opts.startupTimeoutMs ?? CHANNEL_WORKER_STARTUP_TIMEOUT_MS);
            startupTimer.unref();
            startedChild.on('message', handleMessage);
            startedChild.once('exit', settleExit);
            startedChild.once('error', settleError);
        });
    };
    const supervisor = {
        async start() {
            // `disposed` is latched only by killAllSync() (hard shutdown), so the
            // supported stop()/start() reuse lifecycle is preserved; this guard just
            // prevents a relaunch into a daemon that is being force-torn-down.
            if (disposed)
                return;
            if (child) {
                if (stopping) {
                    throw new ChannelWorkerStopError('Channel worker stop is not yet confirmed.');
                }
                return;
            }
            stopping = false;
            clearRestartTimer();
            restartAttemptTimes = [];
            await launch('initial');
        },
        async stop() {
            clearRestartTimer();
            clearStaleHeartbeatTimer();
            rejectPendingWebhookTasks('channel_worker_unavailable', 'Channel worker stopped.');
            if (!child ||
                snapshot.state === 'exited' ||
                (snapshot.state === 'failed' && hasObservedExit(snapshot)) ||
                snapshot.state === 'stopped') {
                child = undefined;
                snapshot = { ...snapshot, state: 'stopped' };
                return;
            }
            const stoppingChild = child;
            const exited = waitForExit(stoppingChild, CHANNEL_WORKER_STOP_GRACE_MS);
            stopping = true;
            stoppingChild.kill('SIGTERM');
            if (!(await exited) && child === stoppingChild) {
                const killed = waitForExit(stoppingChild, CHANNEL_WORKER_KILL_GRACE_MS);
                stoppingChild.kill('SIGKILL');
                if (!(await killed)) {
                    snapshot = {
                        ...snapshot,
                        state: 'failed',
                        error: 'Channel worker did not exit after SIGKILL.',
                    };
                    throw new ChannelWorkerStopError();
                }
            }
            child = undefined;
            stopping = false;
            snapshot = { ...snapshot, state: 'stopped' };
        },
        async restart() {
            // A hard shutdown (killAllSync) latches `disposed`; a reload racing that
            // must not relaunch a worker into a tearing-down daemon.
            if (disposed)
                return snapshotCopy();
            // Coalesce concurrent reloads onto one stop+relaunch so a burst of
            // reload requests cannot fork multiple workers.
            restarting ??= (async () => {
                try {
                    await supervisor.stop();
                    // start() bails if a child is still attached (stop cleared it) or if
                    // killAllSync latched `disposed` mid-reload — avoiding an orphaned
                    // fork. It also resets the restart budget, so a worker previously
                    // parked in `failed` recovers on an explicit reload.
                    await supervisor.start();
                    return snapshotCopy();
                }
                finally {
                    restarting = undefined;
                }
            })();
            return restarting;
        },
        killAllSync() {
            disposed = true;
            rejectPendingWebhookTasks('channel_worker_unavailable', 'Channel worker stopped.');
            if (!child ||
                snapshot.state === 'exited' ||
                (snapshot.state === 'failed' && hasObservedExit(snapshot)) ||
                snapshot.state === 'stopped') {
                clearRestartTimer();
                clearStaleHeartbeatTimer();
                return;
            }
            const preserveFailure = snapshot.state === 'failed' && !hasObservedExit(snapshot);
            clearRestartTimer();
            clearStaleHeartbeatTimer();
            stopping = true;
            child.kill('SIGKILL');
            child = undefined;
            if (!preserveFailure) {
                snapshot = {
                    ...snapshot,
                    state: 'stopped',
                    signal: 'SIGKILL',
                };
            }
        },
        snapshot() {
            return snapshotCopy();
        },
        async enqueueWebhookTask(task) {
            const startedChild = child;
            if (!startedChild || snapshot.state !== 'running') {
                throw new ChannelWebhookEnqueueError('channel_worker_unavailable', 'Channel worker is not running.');
            }
            const send = startedChild.send;
            if (!send) {
                throw new ChannelWebhookEnqueueError('channel_worker_unavailable', 'Channel worker IPC send failed.');
            }
            const message = createChannelWebhookTaskMessage(task);
            return await new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    pendingWebhookTasks.delete(message.id);
                    reject(new ChannelWebhookEnqueueError('channel_webhook_enqueue_timeout', 'Channel webhook task IPC timed out.'));
                }, CHANNEL_WEBHOOK_TASK_IPC_TIMEOUT_MS);
                timer.unref();
                pendingWebhookTasks.set(message.id, { resolve, reject, timer });
                try {
                    send.call(startedChild, message, (err) => {
                        if (err) {
                            rejectPendingWebhookTask(message.id, new ChannelWebhookEnqueueError('channel_worker_unavailable', `Channel worker IPC send failed: ${err.message}`));
                        }
                    });
                }
                catch (err) {
                    rejectPendingWebhookTask(message.id, new ChannelWebhookEnqueueError('channel_worker_unavailable', `Channel worker IPC send failed: ${err instanceof Error ? err.message : String(err)}`));
                }
            });
        },
    };
    return supervisor;
}
//# sourceMappingURL=channel-worker-supervisor.js.map