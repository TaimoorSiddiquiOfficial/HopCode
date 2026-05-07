/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ToolResult, ToolResultDisplay } from '../tools/tools.js';
import type { ToolRegistry } from '../tools/tool-registry.js';
import type { ShellExecutionConfig } from '../services/shellExecutionService.js';
import { ToolErrorType } from '../tools/tool-error.js';
import { ApprovalMode } from '../config/approvalConfig.js';
import { ToolNames } from '../tools/tool-names.js';
import type { MessageBus } from '../confirmation-bus/message-bus.js';
import type { ConditionalRulesRegistry } from '../utils/rulesDiscovery.js';
import type { SkillManager } from '../skills/skill-manager.js';
import type { IznGateHandler } from '../confirmation-bus/iznGateHandler.js';
import { ShellToolInvocation } from '../tools/shell.js';
import { ToolNamesMigration } from '../tools/tool-names.js';
import { escapeXml } from '../utils/xml.js';
import { unescapePath, PATH_ARG_KEYS } from '../utils/paths.js';
import {
  generateToolUseId,
  firePreToolUseHook,
  firePostToolUseHook,
  firePostToolUseFailureHook,
  appendAdditionalContext,
} from './toolHookTriggers.js';
import {
  convertToFunctionResponse,
  extractToolFilePaths,
} from './coreToolScheduler.js';
import type { ToolCall, ScheduledToolCall } from './coreToolScheduler.js';
import type { ToolCallResponseInfo } from './turn.js';

// ── Helpers moved from coreToolScheduler.ts ──────────────────────────

function createErrorResponse(
  request: { callId: string; name: string },
  error: Error,
  errorType: ToolErrorType | undefined,
): ToolCallResponseInfo {
  return {
    callId: request.callId,
    error,
    responseParts: [
      {
        functionResponse: {
          id: request.callId,
          name: request.name,
          response: { error: error.message },
        },
      },
    ],
    resultDisplay: error.message,
    errorType,
    contentLength: error.message.length,
  };
}

/**
 * Closed allowlist mirror (see coreToolScheduler.ts for the source).
 */
const FS_PATH_TOOL_NAMES: ReadonlySet<string> = new Set<string>([
  ToolNames.READ_FILE,
  ToolNames.EDIT,
  ToolNames.WRITE_FILE,
  ToolNames.GREP,
  ToolNames.GLOB,
  ToolNames.LS,
  ToolNames.LSP,
]);

function canonicalToolName(toolName: string): string {
  return (ToolNamesMigration as Record<string, string>)[toolName] ?? toolName;
}

function isFilesystemPathTool(toolName: string): boolean {
  return FS_PATH_TOOL_NAMES.has(canonicalToolName(toolName));
}

// ── Dependencies ─────────────────────────────────────────────────────

export interface ToolExecutionHandlerDeps {
  iznGateHandler: IznGateHandler;
  toolRegistry: ToolRegistry;
  getMessageBus: () => MessageBus | undefined;
  getDisableAllHooks: () => boolean;
  getApprovalMode: () => ApprovalMode;
  getShellExecutionConfig: () => ShellExecutionConfig;
  getConditionalRulesRegistry: () => ConditionalRulesRegistry | undefined;
  getSkillManager: () => SkillManager | null;
  onStatus: (
    callId: string,
    status: 'executing' | 'success' | 'error' | 'cancelled',
    data?: unknown,
  ) => void;
  onLiveOutput?: (callId: string, output: ToolResultDisplay) => void;
  updateToolCalls: (fn: (calls: readonly ToolCall[]) => ToolCall[]) => void;
  notifyUpdate: () => void;
}

// ── Handler ──────────────────────────────────────────────────────────

export class ToolExecutionHandler {
  private readonly deps: ToolExecutionHandlerDeps;

  constructor(deps: ToolExecutionHandlerDeps) {
    this.deps = deps;
  }

  async execute(
    toolCall: ScheduledToolCall,
    signal: AbortSignal,
  ): Promise<void> {
    const { callId, name: toolName } = toolCall.request;
    const invocation = toolCall.invocation;
    const toolInput = toolCall.request.args as Record<string, unknown>;

    // Normalize shell-escaped path params so hooks operate on actual
    // filesystem paths, matching the normalization done in tool validation.
    for (const key of PATH_ARG_KEYS) {
      if (typeof toolInput[key] === 'string') {
        toolInput[key] = unescapePath(String(toolInput[key]).trim());
      }
    }

    // Generate unique tool_use_id for hook tracking
    const toolUseId = generateToolUseId();

    // Get MessageBus for hook execution
    const messageBus = this.deps.getMessageBus();
    const hooksEnabled = !this.deps.getDisableAllHooks();

    // PreToolUse Hook
    if (hooksEnabled && messageBus) {
      const permissionMode = this.deps.getApprovalMode();
      const preHookResult = await firePreToolUseHook(
        messageBus,
        toolName,
        toolInput,
        toolUseId,
        permissionMode,
      );

      if (!preHookResult.shouldProceed) {
        const blockMessage =
          preHookResult.blockReason || 'Tool execution blocked by hook';
        const errorResponse = createErrorResponse(
          toolCall.request,
          new Error(blockMessage),
          ToolErrorType.EXECUTION_DENIED,
        );
        this.deps.onStatus(callId, 'error', errorResponse);
        return;
      }
    }

    this.deps.onStatus(callId, 'executing');

    const liveOutputCallback = toolCall.tool.canUpdateOutput
      ? (outputChunk: ToolResultDisplay) => {
          this.deps.onLiveOutput?.(callId, outputChunk);
          this.deps.updateToolCalls((calls) =>
            calls.map((tc) =>
              tc.request.callId === callId && tc.status === 'executing'
                ? { ...tc, liveOutput: outputChunk }
                : tc,
            ),
          );
          this.deps.notifyUpdate();
        }
      : undefined;

    const shellExecutionConfig = this.deps.getShellExecutionConfig();

    let promise: Promise<ToolResult>;
    if (invocation instanceof ShellToolInvocation) {
      const setPidCallback = (pid: number) => {
        this.deps.updateToolCalls((calls) =>
          calls.map((tc) =>
            tc.request.callId === callId && tc.status === 'executing'
              ? { ...tc, pid }
              : tc,
          ),
        );
        this.deps.notifyUpdate();
      };
      promise = invocation.execute(
        signal,
        liveOutputCallback,
        shellExecutionConfig,
        setPidCallback,
      );
    } else {
      promise = invocation.execute(
        signal,
        liveOutputCallback,
        shellExecutionConfig,
      );
    }

    try {
      const toolResult: ToolResult = await promise;
      if (signal.aborted) {
        if (hooksEnabled && messageBus) {
          const failureHookResult = await firePostToolUseFailureHook(
            messageBus,
            toolUseId,
            toolName,
            toolInput,
            'User cancelled tool execution.',
            true,
            this.deps.getApprovalMode(),
          );

          let cancelMessage = 'User cancelled tool execution.';
          if (failureHookResult.additionalContext) {
            cancelMessage += `\n\n${failureHookResult.additionalContext}`;
          }
          this.deps.onStatus(callId, 'cancelled', cancelMessage);
        } else {
          this.deps.onStatus(
            callId,
            'cancelled',
            'User cancelled tool execution.',
          );
        }
        return;
      }

      if (toolResult.error === undefined) {
        let content = toolResult.llmContent;
        const contentLength =
          typeof content === 'string' ? content.length : undefined;

        // PostToolUse Hook
        if (hooksEnabled && messageBus) {
          const toolResponse = {
            llmContent: content,
            returnDisplay: toolResult.returnDisplay,
          };
          const permissionMode = this.deps.getApprovalMode();
          const postHookResult = await firePostToolUseHook(
            messageBus,
            toolName,
            toolInput,
            toolResponse,
            toolUseId,
            permissionMode,
          );

          if (postHookResult.additionalContext) {
            content = appendAdditionalContext(
              content,
              postHookResult.additionalContext,
            );
          }

          if (postHookResult.shouldStop) {
            const stopMessage =
              postHookResult.stopReason || 'Execution stopped by hook';
            const errorResponse = createErrorResponse(
              toolCall.request,
              new Error(stopMessage),
              ToolErrorType.EXECUTION_DENIED,
            );
            this.deps.onStatus(callId, 'error', errorResponse);
            return;
          }
        }

        // Collect filesystem paths the tool just touched.
        const inputPaths = extractToolFilePaths(toolName, toolInput);
        const resultPaths =
          isFilesystemPathTool(toolName) &&
          Array.isArray(toolResult.resultFilePaths)
            ? toolResult.resultFilePaths
            : [];
        const candidatePaths = Array.from(
          new Set([...inputPaths.map((p) => unescapePath(p)), ...resultPaths]),
        );

        if (candidatePaths.length > 0) {
          const rulesRegistry = this.deps.getConditionalRulesRegistry();
          const skillManager = this.deps.getSkillManager();

          const reminderBlocks: string[] = [];

          for (const candidatePath of candidatePaths) {
            const rulesCtx = rulesRegistry?.matchAndConsume(candidatePath);
            if (rulesCtx) reminderBlocks.push(rulesCtx);
          }

          const activatedSkills =
            await skillManager?.matchAndActivateByPaths(candidatePaths);
          if (activatedSkills && activatedSkills.length > 0) {
            const hasSkillTool = !!this.deps.toolRegistry.getTool(
              ToolNames.SKILL,
            );
            if (hasSkillTool) {
              const names = activatedSkills.map(escapeXml).join(', ');
              reminderBlocks.push(
                `The following skill(s) are now available via the Skill tool based on the file you just accessed: ${names}. Use them if relevant to the task.`,
              );
            }
          }

          if (reminderBlocks.length > 0) {
            const body = reminderBlocks
              .join('\n\n')
              .replace(/<\/system-reminder>/gi, '<\\/system-reminder>');
            content = appendAdditionalContext(
              content,
              `<system-reminder>\n${body}\n</system-reminder>`,
            );
          }
        }

        // Izn mode: inject post-execution scope-report context
        if (this.deps.getApprovalMode() === ApprovalMode.IZN) {
          const scopeContext = this.deps.iznGateHandler.buildScopeReport({
            toolName,
            toolArgs: toolInput,
          });
          if (scopeContext) {
            content = appendAdditionalContext(
              content,
              `<system-reminder>\n${scopeContext}\n</system-reminder>`,
            );
          }
        }

        const response = convertToFunctionResponse(toolName, callId, content);
        const successResponse: ToolCallResponseInfo = {
          callId,
          responseParts: response,
          resultDisplay: toolResult.returnDisplay,
          error: undefined,
          errorType: undefined,
          contentLength,
          ...('modelOverride' in toolResult
            ? { modelOverride: toolResult.modelOverride }
            : {}),
        };
        this.deps.onStatus(callId, 'success', successResponse);
      } else {
        let errorMessage = toolResult.error.message;
        if (hooksEnabled && messageBus) {
          const failureHookResult = await firePostToolUseFailureHook(
            messageBus,
            toolUseId,
            toolName,
            toolInput,
            toolResult.error.message,
            false,
            this.deps.getApprovalMode(),
          );

          if (failureHookResult.additionalContext) {
            errorMessage += `\n\n${failureHookResult.additionalContext}`;
          }
        }

        const error = new Error(errorMessage);
        const errorResponse = createErrorResponse(
          toolCall.request,
          error,
          toolResult.error.type,
        );
        this.deps.onStatus(callId, 'error', errorResponse);
      }
    } catch (executionError: unknown) {
      const errorMessage =
        executionError instanceof Error
          ? executionError.message
          : String(executionError);

      if (signal.aborted) {
        if (hooksEnabled && messageBus) {
          const failureHookResult = await firePostToolUseFailureHook(
            messageBus,
            toolUseId,
            toolName,
            toolInput,
            'User cancelled tool execution.',
            true,
            this.deps.getApprovalMode(),
          );

          let cancelMessage = 'User cancelled tool execution.';
          if (failureHookResult.additionalContext) {
            cancelMessage += `\n\n${failureHookResult.additionalContext}`;
          }
          this.deps.onStatus(callId, 'cancelled', cancelMessage);
        } else {
          this.deps.onStatus(
            callId,
            'cancelled',
            'User cancelled tool execution.',
          );
        }
        return;
      } else {
        let exceptionErrorMessage = errorMessage;
        if (hooksEnabled && messageBus) {
          const failureHookResult = await firePostToolUseFailureHook(
            messageBus,
            toolUseId,
            toolName,
            toolInput,
            errorMessage,
            false,
            this.deps.getApprovalMode(),
          );

          if (failureHookResult.additionalContext) {
            exceptionErrorMessage += `\n\n${failureHookResult.additionalContext}`;
          }
        }
        this.deps.onStatus(
          callId,
          'error',
          createErrorResponse(
            toolCall.request,
            executionError instanceof Error
              ? new Error(exceptionErrorMessage)
              : new Error(String(executionError)),
            ToolErrorType.UNHANDLED_EXCEPTION,
          ),
        );
      }
    }
  }
}
