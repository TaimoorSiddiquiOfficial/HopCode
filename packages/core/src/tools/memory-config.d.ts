/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Lightweight re-export for memory/context file naming.
 * Kept outside memoryTool.ts so callers can read filename configuration
 * without loading the full tool module.
 */
export { AGENT_CONTEXT_FILENAME, DEFAULT_CONTEXT_FILENAME, MEMORY_SECTION_HEADER, getAllGeminiMdFilenames, getCurrentGeminiMdFilename, setGeminiMdFilename, } from '../memory/const.js';
