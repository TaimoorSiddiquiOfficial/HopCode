/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { EditorType } from '../utils/editor.js';
import type { ModifyContext } from '../tools/modifiable-tool.js';
import {
  isModifiableDeclarativeTool,
  modifyWithEditor,
} from '../tools/modifiable-tool.js';
import type { ToolConfirmationPayload } from '../tools/tools.js';
import * as Diff from 'diff';
import { unescapePath, PATH_ARG_KEYS } from '../utils/paths.js';
import type { WaitingToolCall } from './coreToolScheduler.js';

/**
 * Handles inline user modifications to tool calls that are awaiting
 * confirmation. This includes:
 *
 * - **Inline content edits**: when a user provides new content via
 *   {@link ToolConfirmationPayload.newContent}, the handler computes updated
 *   tool parameters and a regenerated diff so the scheduler can refresh the
 *   confirmation prompt before execution.
 *
 * - **External editor launches**: when the user chooses "Modify with Editor",
 *   the handler opens the system editor, lets the user edit proposed content,
 *   and returns updated parameters and diff.
 *
 * Both methods are pure-computation: they return results to the caller
 * ({@link CoreToolScheduler}) which is responsible for applying them to tool
 * state via {@link CoreToolScheduler.setArgsInternal} and
 * {@link CoreToolScheduler.setStatusInternal}.
 */
export class InlineModificationHandler {
  constructor(
    private readonly getPreferredEditor: () => EditorType | undefined,
    private readonly onEditorClose: () => void,
  ) {}

  /**
   * Computes updated tool parameters and a regenerated diff when the user
   * provides modified content for a tool that is awaiting confirmation.
   *
   * Returns `null` when the tool is not a modifiable edit-type tool or when
   * no new content is provided — the caller should proceed with the original
   * parameters in that case.
   */
  applyInlineModify(
    toolCall: WaitingToolCall,
    payload: ToolConfirmationPayload,
    signal: AbortSignal,
  ): { updatedParams: object; updatedDiff: string } | null {
    const confirmDetails = toolCall.confirmationDetails;

    if (
      confirmDetails.type !== 'edit' ||
      !isModifiableDeclarativeTool(toolCall.tool) ||
      !payload.newContent
    ) {
      return null;
    }

    const currentContent = confirmDetails.originalContent ?? '';
    const modifyContext = toolCall.tool.getModifyContext(signal);

    const updatedParams = modifyContext.createUpdatedParams(
      currentContent,
      payload.newContent,
      toolCall.request.args,
    );
    const updatedDiff = Diff.createPatch(
      confirmDetails.filePath,
      currentContent,
      payload.newContent,
      'Current',
      'Proposed',
    );

    return { updatedParams, updatedDiff };
  }

  /**
   * Opens the user's preferred external editor so they can modify the
   * proposed tool content. Returns updated parameters and a regenerated diff
   * after the editor closes.
   *
   * Returns `null` when the tool is not modifiable or when no editor is
   * available — the caller should abort the modify flow in that case.
   */
  async launchEditorForModify(
    toolCall: WaitingToolCall,
    signal: AbortSignal,
  ): Promise<{ updatedParams: object; updatedDiff: string } | null> {
    if (!isModifiableDeclarativeTool(toolCall.tool)) {
      return null;
    }

    const editorType = this.getPreferredEditor();
    if (!editorType) {
      return null;
    }

    const modifyContext = toolCall.tool.getModifyContext(signal);

    // Normalize shell-escaped paths so the editor receives actual
    // filesystem paths (request.args may still hold escaped values
    // since buildInvocation normalizes a structuredClone).
    const normalizedArgs = {
      ...toolCall.request.args,
    } as typeof toolCall.request.args;
    for (const key of PATH_ARG_KEYS) {
      if (typeof normalizedArgs[key] === 'string') {
        (normalizedArgs as Record<string, unknown>)[key] = unescapePath(
          String(normalizedArgs[key]).trim(),
        );
      }
    }

    const { updatedParams, updatedDiff } = await modifyWithEditor<
      typeof toolCall.request.args
    >(
      normalizedArgs,
      modifyContext as ModifyContext<typeof toolCall.request.args>,
      editorType,
      signal,
      this.onEditorClose,
    );

    return { updatedParams, updatedDiff };
  }
}
