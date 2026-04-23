/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FinishReason,
  type Part,
  type PartListUnion,
  type GenerateContentResponse,
  type FunctionCall,
  type FunctionDeclaration,
  type GenerateContentResponseUsageMetadata,
} from '@google/genai';
import type {
  ToolCallConfirmationDetails,
  ToolResult,
  ToolResultDisplay,
} from '../tools/tools.js';
import type { ToolErrorType } from '../tools/tool-error.js';
import { getResponseText } from '../utils/partUtils.js';
import { reportError } from '../utils/errorReporting.js';
import {
  getErrorMessage,
  UnauthorizedError,
  toFriendlyError,
} from '../utils/errors.js';
import type { HopCodeChat } from './hopCodeChat.js';
import type { RetryInfo } from '../utils/rateLimit.js';
import {
  getThoughtText,
  parseThought,
  type ThoughtSummary,
} from '../utils/thoughtUtils.js';
import type { LoopType } from '../telemetry/types.js';

// Define a structure for tools passed to the server
export interface ServerTool {
  name: string;
  schema: FunctionDeclaration;
  // The execute method signature might differ slightly or be wrapped
  execute(
    params: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<ToolResult>;
}

export enum HopCodeEventType {
  Content = 'content',
  ToolCallRequest = 'tool_call_request',
  ToolCallResponse = 'tool_call_response',
  ToolCallConfirmation = 'tool_call_confirmation',
  UserCancelled = 'user_cancelled',
  Error = 'error',
  ChatCompressed = 'chat_compressed',
  Thought = 'thought',
  MaxSessionTurns = 'max_session_turns',
  SessionTokenLimitExceeded = 'session_token_limit_exceeded',
  Finished = 'finished',
  LoopDetected = 'loop_detected',
  Citation = 'citation',
  Retry = 'retry',
  HookSystemMessage = 'hook_system_message',
  UserPromptSubmitBlocked = 'user_prompt_submit_blocked',
  StopHookLoop = 'stop_hook_loop',
}

export type ServerHopCodeRetryEvent = {
  type: HopCodeEventType.Retry;
  retryInfo?: RetryInfo;
};

export interface StructuredError {
  message: string;
  status?: number;
}

export interface HopCodeErrorEventValue {
  error: StructuredError;
}

export interface SessionTokenLimitExceededValue {
  currentTokens: number;
  limit: number;
  message: string;
}

export interface GeminiFinishedEventValue {
  reason: FinishReason | undefined;
  usageMetadata: GenerateContentResponseUsageMetadata | undefined;
}

export interface ToolCallRequestInfo {
  callId: string;
  name: string;
  args: Record<string, unknown>;
  isClientInitiated: boolean;
  prompt_id: string;
  response_id?: string;
  /** Set to true when the LLM response was truncated due to max_tokens. */
  wasOutputTruncated?: boolean;
}

export interface ToolCallResponseInfo {
  callId: string;
  responseParts: Part[];
  resultDisplay: ToolResultDisplay | undefined;
  error: Error | undefined;
  errorType: ToolErrorType | undefined;
  contentLength?: number;
  modelOverride?: string;
}

export interface ServerToolCallConfirmationDetails {
  request: ToolCallRequestInfo;
  details: ToolCallConfirmationDetails;
}

export type ServerHopCodeContentEvent = {
  type: HopCodeEventType.Content;
  value: string;
};

export type ServerHopCodeThoughtEvent = {
  type: HopCodeEventType.Thought;
  value: ThoughtSummary;
};

export type ServerHopCodeToolCallRequestEvent = {
  type: HopCodeEventType.ToolCallRequest;
  value: ToolCallRequestInfo;
};

export type ServerHopCodeToolCallResponseEvent = {
  type: HopCodeEventType.ToolCallResponse;
  value: ToolCallResponseInfo;
};

export type ServerHopCodeToolCallConfirmationEvent = {
  type: HopCodeEventType.ToolCallConfirmation;
  value: ServerToolCallConfirmationDetails;
};

export type ServerHopCodeUserCancelledEvent = {
  type: HopCodeEventType.UserCancelled;
};

export type ServerHopCodeErrorEvent = {
  type: HopCodeEventType.Error;
  value: HopCodeErrorEventValue;
};

export enum CompressionStatus {
  /** The compression was successful */
  COMPRESSED = 1,

  /** The compression failed due to the compression inflating the token count */
  COMPRESSION_FAILED_INFLATED_TOKEN_COUNT,

  /** The compression failed due to an error counting tokens */
  COMPRESSION_FAILED_TOKEN_COUNT_ERROR,

  /** The compression failed due to receiving an empty or null summary */
  COMPRESSION_FAILED_EMPTY_SUMMARY,

  /** The compression was not necessary and no action was taken */
  NOOP,
}

export interface ChatCompressionInfo {
  originalTokenCount: number;
  newTokenCount: number;
  compressionStatus: CompressionStatus;
}

export type ServerHopCodeChatCompressedEvent = {
  type: HopCodeEventType.ChatCompressed;
  value: ChatCompressionInfo | null;
};

export type ServerHopCodeMaxSessionTurnsEvent = {
  type: HopCodeEventType.MaxSessionTurns;
};

export type ServerHopCodeSessionTokenLimitExceededEvent = {
  type: HopCodeEventType.SessionTokenLimitExceeded;
  value: SessionTokenLimitExceededValue;
};

export type ServerHopCodeFinishedEvent = {
  type: HopCodeEventType.Finished;
  value: GeminiFinishedEventValue;
};

export type ServerHopCodeLoopDetectedEvent = {
  type: HopCodeEventType.LoopDetected;
  // The loop type is optional so historical call sites that don't produce one
  // (tests, fixtures) stay valid. Real emissions in client.ts always populate
  // it so downstream consumers can surface a concrete reason to the user.
  value?: {
    loopType: LoopType;
  };
};

export type ServerHopCodeCitationEvent = {
  type: HopCodeEventType.Citation;
  value: string;
};

export type ServerHopCodeHookSystemMessageEvent = {
  type: HopCodeEventType.HookSystemMessage;
  value: string;
};

export type ServerHopCodeUserPromptSubmitBlockedEvent = {
  type: HopCodeEventType.UserPromptSubmitBlocked;
  value: {
    reason: string;
    originalPrompt: string;
  };
};

export type ServerHopCodeStopHookLoopEvent = {
  type: HopCodeEventType.StopHookLoop;
  value: {
    iterationCount: number;
    reasons: string[];
    stopHookCount: number;
  };
};

// The original union type, now composed of the individual types
export type ServerHopCodeStreamEvent =
  | ServerHopCodeChatCompressedEvent
  | ServerHopCodeCitationEvent
  | ServerHopCodeContentEvent
  | ServerHopCodeErrorEvent
  | ServerHopCodeFinishedEvent
  | ServerHopCodeHookSystemMessageEvent
  | ServerHopCodeUserPromptSubmitBlockedEvent
  | ServerHopCodeStopHookLoopEvent
  | ServerHopCodeLoopDetectedEvent
  | ServerHopCodeMaxSessionTurnsEvent
  | ServerHopCodeThoughtEvent
  | ServerHopCodeToolCallConfirmationEvent
  | ServerHopCodeToolCallRequestEvent
  | ServerHopCodeToolCallResponseEvent
  | ServerHopCodeUserCancelledEvent
  | ServerHopCodeSessionTokenLimitExceededEvent
  | ServerHopCodeRetryEvent;

// A turn manages the agentic loop turn within the server context.
export class Turn {
  readonly pendingToolCalls: ToolCallRequestInfo[] = [];
  private debugResponses: GenerateContentResponse[] = [];
  private pendingCitations = new Set<string>();
  finishReason: FinishReason | undefined = undefined;
  private currentResponseId?: string;

  constructor(
    private readonly chat: HopCodeChat,
    private readonly prompt_id: string,
  ) {}
  // The run method yields simpler events suitable for server logic
  async *run(
    model: string,
    req: PartListUnion,
    signal: AbortSignal,
  ): AsyncGenerator<ServerHopCodeStreamEvent> {
    try {
      // Note: This assumes `sendMessageStream` yields events like
      // { type: StreamEventType.RETRY } or { type: StreamEventType.CHUNK, value: GenerateContentResponse }
      const responseStream = await this.chat.sendMessageStream(
        model,
        {
          message: req,
          config: {
            abortSignal: signal,
          },
        },
        this.prompt_id,
      );

      for await (const streamEvent of responseStream) {
        if (signal?.aborted) {
          yield { type: HopCodeEventType.UserCancelled };
          return;
        }

        // Handle the new RETRY event: clear accumulated state from the
        // previous attempt to avoid duplicate tool calls and stale metadata.
        if (streamEvent.type === 'retry') {
          this.pendingToolCalls.length = 0;
          this.pendingCitations.clear();
          this.debugResponses = [];
          this.finishReason = undefined;
          yield {
            type: HopCodeEventType.Retry,
            retryInfo: streamEvent.retryInfo,
          };
          continue; // Skip to the next event in the stream
        }

        // Assuming other events are chunks with a `value` property
        const resp = streamEvent.value as GenerateContentResponse;
        if (!resp) continue; // Skip if there's no response body

        this.debugResponses.push(resp);

        // Track the current response ID for tool call correlation
        if (resp.responseId) {
          this.currentResponseId = resp.responseId;
        }

        const thoughtText = getThoughtText(resp);
        if (thoughtText) {
          yield {
            type: HopCodeEventType.Thought,
            value: parseThought(thoughtText),
          };
        }

        const text = getResponseText(resp);
        if (text) {
          yield { type: HopCodeEventType.Content, value: text };
        }

        // Handle function calls (requesting tool execution)
        const functionCalls = resp.functionCalls ?? [];
        for (const fnCall of functionCalls) {
          const event = this.handlePendingFunctionCall(fnCall);
          if (event) {
            yield event;
          }
        }

        for (const citation of getCitations(resp)) {
          this.pendingCitations.add(citation);
        }

        // Check if response was truncated or stopped for various reasons
        const finishReason = resp.candidates?.[0]?.finishReason;

        // This is the key change: Only yield 'Finished' if there is a finishReason.
        if (finishReason) {
          // Mark pending tool calls so downstream can distinguish
          // truncation from real parameter errors.
          if (finishReason === FinishReason.MAX_TOKENS) {
            for (const tc of this.pendingToolCalls) {
              tc.wasOutputTruncated = true;
            }
          }

          if (this.pendingCitations.size > 0) {
            yield {
              type: HopCodeEventType.Citation,
              value: `Citations:\n${[...this.pendingCitations].sort().join('\n')}`,
            };
            this.pendingCitations.clear();
          }

          this.finishReason = finishReason;
          yield {
            type: HopCodeEventType.Finished,
            value: {
              reason: finishReason,
              usageMetadata: resp.usageMetadata,
            },
          };
        }
      }
    } catch (e) {
      if (signal.aborted) {
        yield { type: HopCodeEventType.UserCancelled };
        // Regular cancellation error, fail gracefully.
        return;
      }

      const error = toFriendlyError(e);
      if (error instanceof UnauthorizedError) {
        throw error;
      }

      const contextForReport = [...this.chat.getHistory(/*curated*/ true), req];
      await reportError(
        error,
        'Error when talking to API',
        contextForReport,
        'Turn.run-sendMessageStream',
      );
      const status =
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        typeof (error as { status: unknown }).status === 'number'
          ? (error as { status: number }).status
          : undefined;
      const structuredError: StructuredError = {
        message: getErrorMessage(error),
        status,
      };
      await this.chat.maybeIncludeSchemaDepthContext(structuredError);
      yield { type: HopCodeEventType.Error, value: { error: structuredError } };
      return;
    }
  }

  private handlePendingFunctionCall(
    fnCall: FunctionCall,
  ): ServerHopCodeStreamEvent | null {
    const callId =
      fnCall.id ??
      `${fnCall.name}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const name = fnCall.name || 'undefined_tool_name';
    const args = (fnCall.args || {}) as Record<string, unknown>;

    const toolCallRequest: ToolCallRequestInfo = {
      callId,
      name,
      args,
      isClientInitiated: false,
      prompt_id: this.prompt_id,
      response_id: this.currentResponseId,
    };

    this.pendingToolCalls.push(toolCallRequest);

    // Yield a request for the tool call, not the pending/confirming status
    return { type: HopCodeEventType.ToolCallRequest, value: toolCallRequest };
  }

  getDebugResponses(): GenerateContentResponse[] {
    return this.debugResponses;
  }
}

function getCitations(resp: GenerateContentResponse): string[] {
  return (resp.candidates?.[0]?.citationMetadata?.citations ?? [])
    .filter((citation) => citation.uri !== undefined)
    .map((citation) => {
      if (citation.title) {
        return `(${citation.title}) ${citation.uri}`;
      }
      return citation.uri!;
    });
}
