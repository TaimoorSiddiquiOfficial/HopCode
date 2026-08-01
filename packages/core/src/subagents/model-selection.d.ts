/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { AuthType } from '../core/contentGenerator.js';
export interface ParsedSubagentModelSelection {
    authType?: AuthType;
    modelId?: string;
    inherits: boolean;
    /**
     * True when the selector was `fast` — the runtime resolves this to
     * `Config.getFastModel()` if a valid fast model is configured, and
     * falls back to inheriting the parent model otherwise.
     */
    usesFastModel?: boolean;
}
/**
 * Parse a subagent model selector.
 *
 * Supported forms:
 * - omitted / inherit -> use parent conversation model
 * - fast -> use Config.getFastModel() if available, else inherit parent model
 * - modelId -> use parent authType with the provided modelId
 * - authType:modelId -> use explicit authType and modelId
 */
export declare function parseSubagentModelSelection(model: string | undefined): ParsedSubagentModelSelection;
