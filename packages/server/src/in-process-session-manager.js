/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- gRPC proto-typed messages */
/* eslint-disable default-case -- agent status switch intentionally omits default */
/**
 * @fileoverview In-process gRPC session manager.
 *
 * Uses AgentInteractive + AgentCore directly in the server process
 * (no subprocess spawn). The CLI passes its fully-initialized Config
 * so auth, tool permissions and model settings are inherited.
 *
 * Lifecycle per session:
 *   createStreamingSession()
 *     → new AgentInteractive(AgentCore(config, …))
 *     → agent.start(context)
 *     → subscribe to AgentEventEmitter → write ServerMessage to gRPC stream
 *
 * Client messages are routed directly to AgentInteractive methods.
 */
import { randomUUID } from 'node:crypto';
import { AgentCore, AgentInteractive, AgentEventEmitter, AgentEventType, AgentStatus, ContextState, } from '@hoptrendy/hopcode-core';
import { ToolConfirmationOutcome } from '@hoptrendy/hopcode-core';
import { createDebugLogger } from '@hoptrendy/hopcode-core';
const debugLogger = createDebugLogger('GRPC_IN_PROCESS');
/**
 * In-process gRPC session manager.
 *
 * Each session wraps an AgentInteractive instance whose AgentEventEmitter
 * events are translated into gRPC ServerMessage proto objects and streamed
 * to the client.
 */
export class InProcessSessionManager {
    sessions = new Map();
    options;
    constructor(options) {
        this.options = options;
    }
    // ---------------------------------------------------------------------------
    // Session lifecycle
    // ---------------------------------------------------------------------------
    async createSession(request) {
        const sessionId = request.session_id || randomUUID();
        const now = Date.now();
        const model = request.model ||
            this.options.defaultModel ||
            this.options.runtimeConfig.getModel() ||
            'claude-sonnet-4-6';
        const cwd = request.cwd || this.options['cwd'] || process.cwd();
        const emitter = new AgentEventEmitter();
        const core = new AgentCore(`grpc-session-${sessionId.slice(0, 8)}`, this.options.runtimeConfig, { systemPrompt: undefined }, // uses default HOPCODE.md system prompt
        { model }, {
            max_turns: request.max_turns ?? undefined,
            max_time_minutes: request.max_time_minutes ?? undefined,
        }, request.allowed_tools?.length
            ? { tools: request.allowed_tools }
            : undefined, emitter);
        const agent = new AgentInteractive({
            agentId: sessionId,
            agentName: `grpc-${sessionId.slice(0, 8)}`,
            initialTask: request.initial_prompt || undefined,
        }, core);
        const session = {
            sessionId,
            status: AgentStatus.INITIALIZING,
            model,
            cwd,
            createdAt: now,
            updatedAt: now,
            agent,
            pendingApprovals: new Map(),
        };
        this.sessions.set(sessionId, session);
        debugLogger.info('Created in-process session', sessionId);
        return {
            session_id: sessionId,
            status: session.status,
            model,
            cwd,
            created_at: now,
            updated_at: now,
        };
    }
    async createStreamingSession(request, write) {
        const sessionInfo = await this.createSession(request);
        const sessionId = sessionInfo.session_id;
        const session = this.sessions.get(sessionId);
        session.writeCallback = write;
        // Wire event emitter → gRPC ServerMessage
        this.wireEvents(session);
        // Start the agent (initializes chat, registers tools)
        const context = new ContextState();
        context.set('cwd', session.cwd);
        try {
            await session.agent.start(context);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            write({ error: { type: 'AGENT_START_ERROR', message } });
            this.sessions.delete(sessionId);
            return sessionId;
        }
        // Send initial session_info to client
        write({
            session_info: {
                session_id: sessionId,
                status: 'running',
                model: session.model,
                cwd: session.cwd,
                created_at: session.createdAt,
                updated_at: session.updatedAt,
            },
        });
        return sessionId;
    }
    async handleClientMessage(sessionId, clientMessage) {
        const session = this.sessions.get(sessionId);
        if (!session)
            throw new Error(`Session ${sessionId} not found`);
        const payload = clientMessage.payload ?? clientMessage;
        if (payload.user_prompt) {
            session.agent.enqueueMessage(payload.user_prompt.text);
            session.updatedAt = Date.now();
        }
        else if (payload.tool_approval) {
            await this.handleToolApproval(session, payload.tool_approval);
        }
        else if (payload.tool_denial) {
            await this.handleToolDenial(session, payload.tool_denial);
        }
        else if (payload.cancel_round) {
            session.agent.cancelCurrentRound();
        }
        else if (payload.shutdown) {
            if (payload.shutdown.graceful) {
                await session.agent.shutdown();
            }
            else {
                session.agent.abort();
            }
            this.sessions.delete(sessionId);
        }
    }
    // ---------------------------------------------------------------------------
    // Session queries
    // ---------------------------------------------------------------------------
    listSessions() {
        return Array.from(this.sessions.values()).map((s) => ({
            session_id: s.sessionId,
            status: s.agent.getStatus(),
            model: s.model,
            cwd: s.cwd,
            created_at: s.createdAt,
            updated_at: s.updatedAt,
        }));
    }
    async getHistory(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            throw new Error(`Session ${sessionId} not found`);
        const messages = session.agent.getMessages().map((m, i) => ({
            id: String(i),
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
        }));
        return { session_id: sessionId, messages };
    }
    async closeSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return;
        debugLogger.info('Closing in-process session', sessionId);
        session.agent.abort();
        session.writeCallback?.({
            status: { status: 'finished', details: 'Session closed by server' },
        });
        this.sessions.delete(sessionId);
    }
    async executeTool(request) {
        debugLogger.info('Direct tool execution not yet supported in in-process mode', request.name);
        return {
            tool_use_id: randomUUID(),
            content: `Direct tool execution (${request.name}) is not supported in in-process mode. Use a streaming session.`,
            is_error: true,
        };
    }
    // ---------------------------------------------------------------------------
    // Event → gRPC translation
    // ---------------------------------------------------------------------------
    wireEvents(session) {
        const emitter = session.agent.getEventEmitter();
        if (!emitter)
            return;
        const write = (msg) => {
            session.writeCallback?.(msg);
        };
        // Streaming text deltas
        emitter.on(AgentEventType.STREAM_TEXT, (ev) => {
            if (ev.thought) {
                write({ thinking_chunk: { thinking: ev.text } });
            }
            else {
                write({ text_chunk: { text: ev.text } });
            }
        });
        // Full round text (fallback when streaming is not available)
        emitter.on(AgentEventType.ROUND_TEXT, (ev) => {
            if (ev.thoughtText) {
                write({ thinking_chunk: { thinking: ev.thoughtText } });
            }
            if (ev.text) {
                write({ text_chunk: { text: ev.text } });
            }
        });
        // Tool calls
        emitter.on(AgentEventType.TOOL_CALL, (ev) => {
            write({
                tool_call: {
                    tool_use_id: ev.callId,
                    name: ev.name,
                    input_json: JSON.stringify(ev.args),
                },
            });
        });
        // Tool live output
        emitter.on(AgentEventType.TOOL_OUTPUT_UPDATE, (ev) => {
            const output = typeof ev.outputChunk === 'string'
                ? ev.outputChunk
                : JSON.stringify(ev.outputChunk);
            write({ tool_output_update: { tool_use_id: ev.callId, output } });
        });
        // Tool results
        emitter.on(AgentEventType.TOOL_RESULT, (ev) => {
            const content = ev.resultDisplay !== undefined
                ? typeof ev.resultDisplay === 'string'
                    ? ev.resultDisplay
                    : JSON.stringify(ev.resultDisplay)
                : (ev.error ?? '');
            write({
                tool_result: {
                    tool_use_id: ev.callId,
                    content,
                    is_error: !ev.success,
                },
            });
        });
        // Permission requests (tool approval)
        emitter.on(AgentEventType.TOOL_WAITING_APPROVAL, (ev) => {
            session.pendingApprovals.set(ev.callId, {
                respond: ev.respond,
                callId: ev.callId,
            });
            write({
                permission_request: {
                    tool_use_id: ev.callId,
                    tool_name: ev.name,
                    input_json: JSON.stringify(ev.confirmationDetails),
                    description: ev.description,
                },
            });
        });
        // Token usage
        emitter.on(AgentEventType.USAGE_METADATA, (ev) => {
            const u = ev.usage;
            write({
                usage: {
                    input_tokens: u.promptTokenCount ?? 0,
                    output_tokens: u.candidatesTokenCount ?? 0,
                    cache_read_input_tokens: u.cachedContentTokenCount ?? 0,
                    cache_creation_input_tokens: 0,
                    total_tokens: u.totalTokenCount ?? 0,
                },
            });
        });
        // Round start/end status events
        emitter.on(AgentEventType.ROUND_START, () => {
            write({
                status: { status: 'round_start', details: 'Agent round started' },
            });
        });
        emitter.on(AgentEventType.ROUND_END, () => {
            write({
                status: { status: 'round_end', details: 'Agent round completed' },
            });
        });
        // Status changes (IDLE → finished, FAILED → error, CANCELLED → cancelled)
        emitter.on(AgentEventType.STATUS_CHANGE, (ev) => {
            session.status = ev.newStatus;
            session.updatedAt = Date.now();
            switch (ev.newStatus) {
                case AgentStatus.IDLE:
                    write({
                        status: {
                            status: 'idle',
                            details: 'Agent is idle, ready for next message',
                        },
                    });
                    break;
                case AgentStatus.COMPLETED:
                    write({
                        status: { status: 'finished', details: 'Agent session completed' },
                    });
                    this.sessions.delete(session.sessionId);
                    break;
                case AgentStatus.FAILED:
                    write({
                        error: {
                            type: 'AGENT_FAILED',
                            message: session.agent.getError() ?? 'Agent failed with unknown error',
                        },
                    });
                    this.sessions.delete(session.sessionId);
                    break;
                case AgentStatus.CANCELLED:
                    write({
                        status: { status: 'cancelled', details: 'Agent was cancelled' },
                    });
                    break;
            }
        });
        emitter.on(AgentEventType.ERROR, (ev) => {
            write({
                error: {
                    type: 'AGENT_ERROR',
                    message: ev.error ?? 'Unknown error',
                },
            });
        });
    }
    // ---------------------------------------------------------------------------
    // Tool approval helpers
    // ---------------------------------------------------------------------------
    async handleToolApproval(session, approval) {
        const callId = approval.tool_use_id;
        const pending = session.pendingApprovals.get(callId);
        if (!pending) {
            debugLogger.info('No pending approval for callId', callId);
            return;
        }
        session.pendingApprovals.delete(callId);
        await pending.respond(approval.allow
            ? ToolConfirmationOutcome.ProceedOnce
            : ToolConfirmationOutcome.Cancel);
    }
    async handleToolDenial(session, denial) {
        const callId = denial.tool_use_id;
        const pending = session.pendingApprovals.get(callId);
        if (!pending)
            return;
        session.pendingApprovals.delete(callId);
        await pending.respond(ToolConfirmationOutcome.Cancel);
    }
}
//# sourceMappingURL=in-process-session-manager.js.map