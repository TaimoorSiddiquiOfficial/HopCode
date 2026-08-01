/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Tracks repeatedly denied tool calls and persists them across sessions so the
 * agent can avoid re-attempting blocked actions.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
const DENY_THRESHOLD = 2;
export class PermissionBlockerService {
    denials = new Map();
    persistPath;
    constructor(persistPath) {
        this.persistPath = persistPath;
        this.loadFromDisk();
    }
    loadFromDisk() {
        try {
            const raw = fs.readFileSync(this.persistPath, 'utf-8');
            const store = JSON.parse(raw);
            for (const [key, rec] of Object.entries(store.denials ?? {})) {
                this.denials.set(key, rec);
            }
        }
        catch {
            // File doesn't exist yet — start with empty store
        }
    }
    saveToDisk() {
        try {
            fs.mkdirSync(path.dirname(this.persistPath), { recursive: true });
            const store = {
                denials: Object.fromEntries(this.denials.entries()),
            };
            fs.writeFileSync(this.persistPath, JSON.stringify(store, null, 2), 'utf-8');
        }
        catch {
            // Non-fatal
        }
    }
    /**
     * Record a user-initiated denial for the given tool.
     * Once the denial count reaches the threshold the entry is persisted.
     */
    recordDenial(toolName) {
        const existing = this.denials.get(toolName) ?? { count: 0, lastSeenAt: 0 };
        const updated = {
            count: existing.count + 1,
            lastSeenAt: Date.now(),
        };
        this.denials.set(toolName, updated);
        if (updated.count >= DENY_THRESHOLD) {
            this.saveToDisk();
        }
    }
    /**
     * Returns tool names that have been denied at or above the threshold.
     */
    getBlockedTools() {
        const result = [];
        for (const [tool, rec] of this.denials.entries()) {
            if (rec.count >= DENY_THRESHOLD) {
                result.push({ tool, count: rec.count });
            }
        }
        return result.sort((a, b) => b.count - a.count);
    }
    /**
     * Returns a system prompt note listing blocked tools, or null if none.
     */
    buildPromptNote() {
        const blocked = this.getBlockedTools();
        if (blocked.length === 0)
            return null;
        const list = blocked
            .map(({ tool, count }) => `  • ${tool} (denied ${count}x)`)
            .join('\n');
        return `# Previously Blocked Actions\n\nThe user has repeatedly denied these tools in past sessions. Ask before attempting them again or propose an alternative:\n${list}`;
    }
    /**
     * Clears all denial records (for the current tool name or all).
     */
    clear(toolName) {
        if (toolName) {
            this.denials.delete(toolName);
        }
        else {
            this.denials.clear();
        }
        this.saveToDisk();
    }
}
//# sourceMappingURL=permissionBlockerService.js.map