/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
describe('package.json command metadata', () => {
    function readManifest() {
        return JSON.parse(readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8'));
    }
    it('describes focusChat as focusing the chat view', () => {
        const manifest = readManifest();
        const command = manifest.contributes.commands.find((item) => item.command === 'hopcode.focusChat');
        expect(command?.title).toBe('HopCode: Focus Chat View');
    });
    it('keeps the Activity Bar chat entry visible without runtime context', () => {
        const manifest = readManifest();
        const sidebarContainer = manifest.contributes.viewsContainers.activitybar.find((item) => item.id === 'hopcode-sidebar');
        const sidebarView = manifest.contributes.views['hopcode-sidebar']?.find((item) => item.id === 'hopcode.chatView.sidebar');
        expect(sidebarContainer?.when).toBeUndefined();
        expect(sidebarView?.when).toBeUndefined();
    });
});
//# sourceMappingURL=package.test.js.map