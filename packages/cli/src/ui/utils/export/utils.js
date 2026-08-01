/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Generates a filename with timestamp for export files.
 */
export function generateExportFilename(extension) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `hopcode-export-${timestamp}.${extension}`;
}
//# sourceMappingURL=utils.js.map