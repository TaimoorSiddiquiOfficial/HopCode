/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { EditorType } from '../utils/editor.js';
import type { ToolConfirmationPayload } from '../tools/tools.js';
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
export declare class InlineModificationHandler {
    private readonly getPreferredEditor;
    private readonly onEditorClose;
    constructor(getPreferredEditor: () => EditorType | undefined, onEditorClose: () => void);
    /**
     * Computes updated tool parameters and a regenerated diff when the user
     * provides modified content for a tool that is awaiting confirmation.
     *
     * Returns `null` when the tool is not a modifiable edit-type tool or when
     * no new content is provided — the caller should proceed with the original
     * parameters in that case.
     */
    applyInlineModify(toolCall: WaitingToolCall, payload: ToolConfirmationPayload, signal: AbortSignal): {
        updatedParams: object;
        updatedDiff: string;
    } | null;
    /**
     * Opens the user's preferred external editor so they can modify the
     * proposed tool content. Returns updated parameters and a regenerated diff
     * after the editor closes.
     *
     * Returns `null` when the tool is not modifiable or when no editor is
     * available — the caller should abort the modify flow in that case.
     */
    launchEditorForModify(toolCall: WaitingToolCall, signal: AbortSignal): Promise<{
        updatedParams: object;
        updatedDiff: string;
    } | null>;
}
