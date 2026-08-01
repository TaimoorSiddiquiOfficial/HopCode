/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export declare class PermissionBlockerService {
    private denials;
    private readonly persistPath;
    constructor(persistPath: string);
    private loadFromDisk;
    private saveToDisk;
    /**
     * Record a user-initiated denial for the given tool.
     * Once the denial count reaches the threshold the entry is persisted.
     */
    recordDenial(toolName: string): void;
    /**
     * Returns tool names that have been denied at or above the threshold.
     */
    getBlockedTools(): Array<{
        tool: string;
        count: number;
    }>;
    /**
     * Returns a system prompt note listing blocked tools, or null if none.
     */
    buildPromptNote(): string | null;
    /**
     * Clears all denial records (for the current tool name or all).
     */
    clear(toolName?: string): void;
}
