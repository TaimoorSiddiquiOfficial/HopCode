/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { spawn, type ChildProcess } from 'node:child_process';
import { createInterface } from 'node:readline';
import { randomUUID } from 'node:crypto';
import { createDebugLogger } from '@hoptrendy/hopcode-core';

const debugLogger = createDebugLogger('SERVER_SESSION_MANAGER');

export interface SessionManagerOptions {
  cwd?: string;
  defaultModel?: string;
  /** Path to the hopcode CLI executable. Defaults to "hopcode" in PATH. */
  cliPath?: string;
}

interface ActiveSession {
  sessionId: string;
  status: string;
  model: string;
  cwd: string;
  createdAt: number;
  updatedAt: number;
  child: ChildProcess | null;
  writeCallback?: (msg: Record<string, unknown>) => void;
  pendingApprovals: Map<
    string,
    { resolve: (allow: boolean, reason?: string) => void; reject: (err: Error) => void }
  >;
}

/**
 * Manages active agent sessions for the gRPC server.
 *
 * Each session spawns a `hopcode --input-format stream-json
 * --output-format stream-json` child process.  JSONL events from
 * the CLI's stdout are translated into gRPC ServerMessages, and
 * gRPC ClientMessages are serialized into JSONL lines written to
 * the CLI's stdin.
 */
export class HopCodeSessionManager {
  private sessions = new Map<string, ActiveSession>();
  private options: SessionManagerOptions;

  constructor(options: SessionManagerOptions = {}) {
    this.options = options;
  }

  // ---------------------------------------------------------------------------
  // Session lifecycle
  // ---------------------------------------------------------------------------

  async createSession(request: Record<string, any>): Promise<Record<string, any>> {
    const sessionId = request.sessionId || randomUUID();
    const now = Date.now();

    const session: ActiveSession = {
      sessionId,
      status: 'initializing',
      model: request.model || this.options.defaultModel || 'claude-sonnet-4-6',
      cwd: request.cwd || this.options.cwd || process.cwd(),
      createdAt: now,
      updatedAt: now,
      child: null,
      pendingApprovals: new Map(),
    };

    this.sessions.set(sessionId, session);
    debugLogger.info('Created session', sessionId);

    return {
      sessionId,
      status: session.status,
      model: session.model,
      cwd: session.cwd,
      createdAt: now,
      updatedAt: now,
    };
  }

  async createStreamingSession(
    request: Record<string, any>,
    write: (msg: Record<string, unknown>) => void,
  ): Promise<string> {
    const sessionInfo = await this.createSession(request);
    const session = this.sessions.get(sessionInfo.sessionId)!;
    session.writeCallback = write;

    // Spawn the HopCode CLI in stream-json mode
    await this.spawnAgent(session, request);
    session.status = 'running';

    write({
      sessionInfo: {
        sessionId: sessionInfo.sessionId,
        status: 'running',
        model: sessionInfo.model,
        cwd: sessionInfo.cwd,
        createdAt: sessionInfo.createdAt,
        updatedAt: sessionInfo.updatedAt,
      },
    });

    return sessionInfo.sessionId;
  }

  async handleClientMessage(
    sessionId: string,
    clientMessage: Record<string, any>,
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const payload = clientMessage.payload;
    if (!payload) return;

    if (payload.userPrompt) {
      await this.handleUserPrompt(session, payload.userPrompt);
    } else if (payload.toolApproval) {
      await this.handleToolApproval(session, payload.toolApproval);
    } else if (payload.toolDenial) {
      await this.handleToolDenial(session, payload.toolDenial);
    } else if (payload.cancelRound) {
      await this.handleCancelRound(session);
    } else if (payload.shutdown) {
      await this.handleShutdown(session, payload.shutdown);
    }
  }

  // ---------------------------------------------------------------------------
  // Agent process management
  // ---------------------------------------------------------------------------

  private async spawnAgent(
    session: ActiveSession,
    request: Record<string, any>,
  ): Promise<void> {
    const cliPath = this.options.cliPath ?? 'hopcode';
    const args: string[] = [
      '--input-format', 'stream-json',
      '--output-format', 'stream-json',
      '--model', session.model,
      '--permission-mode', request.permissionMode ?? 'default',
      '--cwd', session.cwd,
    ];

    if (request.allowedTools?.length) {
      args.push('--allowed-tools', request.allowedTools.join(','));
    }
    if (request.excludeTools?.length) {
      args.push('--exclude-tools', request.excludeTools.join(','));
    }
    if (request.authType) {
      args.push('--auth-type', request.authType);
    }

    debugLogger.info('Spawning agent', session.sessionId, cliPath, args.join(' '));

    const child = spawn(cliPath, args, {
      cwd: session.cwd,
      env: { ...process.env, HOPCODE_NONINTERACTIVE: '1' },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    session.child = child;

    // Parse stdout JSONL and translate to gRPC messages
    const rl = createInterface({ input: child.stdout!, crlfDelay: Infinity });
    rl.on('line', (line) => {
      try {
        const event = JSON.parse(line);
        this.translateAndEmit(session, event);
      } catch (err) {
        debugLogger.info('Failed to parse JSONL line:', line.slice(0, 200));
      }
    });

    child.stderr!.on('data', (chunk: Buffer) => {
      debugLogger.info('Agent stderr:', chunk.toString('utf8').slice(0, 200));
    });

    child.on('error', (err) => {
      debugLogger.info('Agent process error:', err.message);
      session.writeCallback?.({
        error: { type: 'AGENT_PROCESS_ERROR', message: err.message },
      });
    });

    child.on('exit', (code) => {
      debugLogger.info('Agent process exited with code', code);
      session.status = 'finished';
      session.writeCallback?.({
        status: {
          status: 'finished',
          details: code === 0 ? 'Agent completed' : `Agent exited with code ${code}`,
        },
      });
      session.child = null;
    });

    // Send initial prompt if provided
    if (request.initialPrompt || request.userPrompt?.text) {
      const prompt = request.initialPrompt ?? request.userPrompt.text;
      this.writeToAgent(session, {
        type: 'user',
        session_id: session.sessionId,
        message: { role: 'user', content: prompt },
        parent_tool_use_id: null,
      });
    }
  }

  private writeToAgent(session: ActiveSession, message: Record<string, unknown>): void {
    if (!session.child?.stdin?.writable) {
      debugLogger.info('Agent stdin not writable for session', session.sessionId);
      return;
    }
    const line = JSON.stringify(message) + '\n';
    session.child.stdin.write(line);
  }

  // ---------------------------------------------------------------------------
  // JSONL event translation
  // ---------------------------------------------------------------------------

  private translateAndEmit(session: ActiveSession, event: Record<string, unknown>): void {
    if (!session.writeCallback) return;

    const type = event.type as string;

    switch (type) {
      case 'message_start': {
        session.writeCallback({ status: { status: 'round_start', details: 'Assistant message started' } });
        break;
      }

      case 'content_block_delta': {
        const delta = (event as any).delta;
        if (delta?.type === 'text_delta') {
          session.writeCallback({ textChunk: { text: delta.text } });
        } else if (delta?.type === 'thinking_delta') {
          session.writeCallback({ thinkingChunk: { thinking: delta.thinking } });
        }
        break;
      }

      case 'assistant': {
        const msg = (event as any).message;
        if (msg?.content) {
          for (const block of msg.content) {
            if (block.type === 'text') {
              session.writeCallback({ textChunk: { text: block.text } });
            } else if (block.type === 'tool_use') {
              session.writeCallback({
                toolCall: {
                  toolUseId: block.id,
                  name: block.name,
                  inputJson: JSON.stringify(block.input),
                },
              });
            }
          }
        }
        break;
      }

      case 'tool_result': {
        const result = (event as any).content;
        session.writeCallback({
          toolResult: {
            toolUseId: (event as any).tool_use_id ?? '',
            content: typeof result === 'string' ? result : JSON.stringify(result),
            isError: false,
          },
        });
        break;
      }

      case 'control_request': {
        const subtype = (event as any).subtype;
        if (subtype === 'can_use_tool') {
          const data = (event as any).data ?? event;
          session.writeCallback({
            permissionRequest: {
              toolUseId: data.tool_use_id,
              toolName: data.tool_name,
              inputJson: JSON.stringify(data.input),
              description: `Tool: ${data.tool_name}`,
            },
          });
        }
        break;
      }

      case 'result': {
        const resultEvent = event as any;
        if (resultEvent.is_error) {
          session.writeCallback({
            error: {
              type: resultEvent.subtype ?? 'execution_error',
              message: resultEvent.error?.message ?? 'Unknown error',
            },
          });
        } else {
          session.writeCallback({
            status: {
              status: 'round_end',
              details: `Completed in ${resultEvent.num_turns} turns`,
            },
          });
        }
        break;
      }

      case 'system': {
        // System messages carry metadata; surface usage if present
        const data = (event as any).data;
        if (data?.usage) {
          session.writeCallback({
            usage: {
              inputTokens: data.usage.input_tokens ?? 0,
              outputTokens: data.usage.output_tokens ?? 0,
              cacheReadInputTokens: data.usage.cache_read_input_tokens ?? 0,
              cacheCreationInputTokens: data.usage.cache_creation_input_tokens ?? 0,
              totalTokens: data.usage.total_tokens ?? 0,
            },
          });
        }
        break;
      }

      default:
        debugLogger.info('Unhandled event type:', type);
    }
  }

  // ---------------------------------------------------------------------------
  // Message handlers
  // ---------------------------------------------------------------------------

  private async handleUserPrompt(
    session: ActiveSession,
    prompt: Record<string, any>,
  ): Promise<void> {
    debugLogger.info('User prompt in session', session.sessionId, prompt.text?.slice(0, 50));

    if (!session.child) {
      // If the agent hasn't been spawned yet, spawn it with this prompt as initial
      await this.spawnAgent(session, { ...session, initialPrompt: prompt.text });
      return;
    }

    this.writeToAgent(session, {
      type: 'user',
      session_id: session.sessionId,
      message: { role: 'user', content: prompt.text },
      parent_tool_use_id: null,
    });

    session.updatedAt = Date.now();
  }

  private async handleToolApproval(
    session: ActiveSession,
    approval: Record<string, any>,
  ): Promise<void> {
    const pending = session.pendingApprovals.get(approval.toolUseId);
    if (!pending) {
      // Write control response directly to agent stdin
      this.writeToAgent(session, {
        type: 'control_response',
        subtype: 'can_use_tool',
        tool_use_id: approval.toolUseId,
        approved: approval.allow ?? true,
        reason: approval.reason,
      });
      return;
    }
    pending.resolve(approval.allow ?? true, approval.reason);
    session.pendingApprovals.delete(approval.toolUseId);
  }

  private async handleToolDenial(
    session: ActiveSession,
    denial: Record<string, any>,
  ): Promise<void> {
    const pending = session.pendingApprovals.get(denial.toolUseId);
    if (!pending) {
      this.writeToAgent(session, {
        type: 'control_response',
        subtype: 'can_use_tool',
        tool_use_id: denial.toolUseId,
        approved: false,
        reason: denial.reason,
      });
      return;
    }
    pending.resolve(false, denial.reason);
    session.pendingApprovals.delete(denial.toolUseId);
  }

  private async handleCancelRound(session: ActiveSession): Promise<void> {
    debugLogger.info('Cancel round in session', session.sessionId);
    if (session.child?.stdin?.writable) {
      this.writeToAgent(session, {
        type: 'control_request',
        subtype: 'interrupt',
      });
    }
    session.writeCallback?.({
      status: {
        status: 'round_cancelled',
        details: 'Current round cancelled by client',
      },
    });
  }

  private async handleShutdown(
    session: ActiveSession,
    shutdown: Record<string, any>,
  ): Promise<void> {
    debugLogger.info('Shutdown session', session.sessionId, shutdown.graceful);
    if (session.child) {
      if (shutdown.graceful) {
        session.child.stdin?.end();
      } else {
        session.child.kill('SIGKILL');
      }
    }
    session.status = 'finished';
    session.writeCallback?.({
      status: {
        status: 'finished',
        details: shutdown.graceful ? 'Graceful shutdown' : 'Immediate abort',
      },
    });
    this.sessions.delete(session.sessionId);
  }

  // ---------------------------------------------------------------------------
  // Session queries
  // ---------------------------------------------------------------------------

  listSessions(): Array<Record<string, any>> {
    return Array.from(this.sessions.values()).map((s) => ({
      sessionId: s.sessionId,
      status: s.status,
      model: s.model,
      cwd: s.cwd,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  }

  async getHistory(sessionId: string): Promise<Record<string, any>> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    return {
      sessionId,
      messages: [],
    };
  }

  async closeSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    debugLogger.info('Closing session', sessionId);
    if (session.child) {
      session.child.kill('SIGTERM');
    }
    session.status = 'finished';
    session.writeCallback?.({
      status: {
        status: 'finished',
        details: 'Session closed by client or server',
      },
    });
    this.sessions.delete(sessionId);
  }

  async executeTool(request: Record<string, any>): Promise<Record<string, any>> {
    debugLogger.info('Execute tool', request.name);
    return {
      toolUseId: randomUUID(),
      content: `Tool ${request.name} executed (stub — full integration requires core tool registry access)`,
      isError: false,
    };
  }
}
