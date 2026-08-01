/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { getErrorMessage, isAbortError } from './errors.js';
import { isCacheableReadResult, processSingleFileContent, } from './fileUtils.js';
import { getFolderStructure } from './getFolderStructure.js';
const DEFAULT_OUTPUT_HEADER = '\n--- Content from referenced files ---';
const DEFAULT_OUTPUT_TERMINATOR = '\n--- End of content ---';
/**
 * Reads content from multiple files and directories specified by paths.
 *
 * For directories, returns the folder structure.
 * For text files, concatenates their content into a single string with separators.
 * For image and PDF files, returns base64-encoded data.
 *
 * @param config - The runtime configuration
 * @param options - Options for file reading (paths, filters, signal)
 * @returns Result containing content parts and processed files
 *
 * NOTE: This utility is invoked only by explicit user-triggered file reads.
 * Do not apply workspace filters or path restrictions here.
 */
export async function readManyFiles(config, options) {
    const { paths: inputPatterns, preserveUnsupportedImageForBridge, signal, } = options;
    const seenFiles = new Set();
    const contentParts = [];
    const files = [];
    try {
        const projectRoot = config.getProjectRoot();
        for (const rawPattern of inputPatterns) {
            signal?.throwIfAborted();
            const normalizedPattern = rawPattern.replace(/\\/g, '/');
            const fullPath = path.resolve(projectRoot, normalizedPattern);
            const stats = fs.existsSync(fullPath) ? fs.statSync(fullPath) : null;
            if (stats?.isDirectory()) {
                const { contentParts: dirParts, info } = await readDirectory(config, fullPath, signal);
                contentParts.push(...dirParts);
                files.push(info);
                continue;
            }
            if (stats?.isFile() && !seenFiles.has(fullPath)) {
                seenFiles.add(fullPath);
                const readResult = await readFileContent(config, fullPath, preserveUnsupportedImageForBridge, signal);
                if (readResult) {
                    contentParts.push(...readResult.contentParts);
                    files.push(readResult.info);
                }
            }
        }
    }
    catch (error) {
        if (signal?.aborted || isAbortError(error)) {
            throw error;
        }
        const errorMessage = `Error during file search: ${getErrorMessage(error)}`;
        return {
            contentParts: [errorMessage],
            files: [],
            error: errorMessage,
        };
    }
    if (contentParts.length > 0) {
        contentParts.unshift({ text: DEFAULT_OUTPUT_HEADER });
        contentParts.push({ text: DEFAULT_OUTPUT_TERMINATOR });
    }
    else {
        contentParts.push({
            text: 'No files matching the criteria were found or all were skipped.',
        });
    }
    return { contentParts: contentParts, files };
}
async function readDirectory(config, directoryPath, signal) {
    signal?.throwIfAborted();
    const structure = await getFolderStructure(directoryPath, {
        fileService: config.getFileService(),
        fileFilteringOptions: config.getFileFilteringOptions(),
    });
    signal?.throwIfAborted();
    const contentParts = [
        { text: `\nContent from ${directoryPath}:\n` },
        { text: structure },
    ];
    return {
        contentParts,
        info: {
            filePath: directoryPath,
            content: structure,
            isDirectory: true,
        },
    };
}
async function readFileContent(config, filePath, preserveUnsupportedImage = false, signal) {
    try {
        const fileReadResult = await processSingleFileContent(filePath, config, {
            preserveUnsupportedImage,
            ...(signal !== undefined ? { signal } : {}),
            largePdfBehavior: 'reference',
        });
        const prefixText = { text: `\nContent from ${filePath}:\n` };
        // Surface any error produced by processSingleFileContent instead of
        // silently skipping the file. This preserves actionable guidance
        // (e.g. "pdftotext is not installed, install poppler-utils...",
        // password-protected PDFs, file-too-large) across batch reads.
        if (fileReadResult.error) {
            const errorText = typeof fileReadResult.llmContent === 'string'
                ? fileReadResult.llmContent
                : `Failed to read ${filePath}: ${fileReadResult.error}`;
            return {
                contentParts: [prefixText, { text: errorText }],
                info: {
                    filePath,
                    content: errorText,
                    isDirectory: false,
                    error: fileReadResult.error,
                },
            };
        }
        // Record the successful read in the session FileReadCache so a later
        // Edit / WriteFile on an `@`-attached file passes prior-read enforcement
        // without a redundant read_file (issue #6289).
        recordAttachedFileRead(config, filePath, fileReadResult);
        if (typeof fileReadResult.llmContent === 'string') {
            let fileContentForLlm = '';
            if (fileReadResult.isTruncated &&
                fileReadResult.linesShown &&
                fileReadResult.originalLineCount !== undefined) {
                const [start, end] = fileReadResult.linesShown;
                const total = fileReadResult.originalLineCount;
                const totalLabel = fileReadResult.originalLineCountExact === false
                    ? `at least ${total}`
                    : total;
                fileContentForLlm = `Showing lines ${start}-${end} of ${totalLabel} total lines.\n---\n${fileReadResult.llmContent}`;
            }
            else {
                fileContentForLlm = fileReadResult.llmContent;
            }
            const contentParts = [prefixText, { text: fileContentForLlm }];
            return {
                contentParts,
                info: {
                    filePath,
                    content: fileContentForLlm,
                    isDirectory: false,
                },
            };
        }
        // For binary files (images, PDFs), add prefix text before the media
        // part(s). A page-rendered PDF yields an array of image parts (plus an
        // optional truncation note), so flatten it after the prefix.
        const mediaParts = fileReadResult.llmContent;
        const contentParts = Array.isArray(mediaParts)
            ? [prefixText, ...mediaParts]
            : [prefixText, mediaParts];
        return {
            contentParts,
            info: {
                filePath,
                content: fileReadResult.llmContent,
                isDirectory: false,
            },
        };
    }
    catch (error) {
        if (signal?.aborted || isAbortError(error)) {
            throw error;
        }
        return null;
    }
}
/**
 * Record an `@`-attached file read in the session {@link FileReadCache} so a
 * later Edit / WriteFile on the same file passes prior-read enforcement
 * without the model re-reading it via `read_file` (issue #6289). Without
 * this, `@`-mentions loaded content into context but never touched the
 * cache, so `checkPriorRead` saw `unknown` and rejected the edit with
 * `EDIT_REQUIRES_PRIOR_READ`.
 *
 * Although `@`-mentions pass no explicit offset / limit / pages,
 * `processSingleFileContent` applies `config.getTruncateToolOutputLines()`
 * as a default cap, so large attachments can still be truncated and
 * `full` may be `false` — mirroring `read-file.ts` so the two read paths
 * agree on what Edit / WriteFile may mutate. Binary media
 * (image / audio / native PDF) omit `stats` from the read result and are
 * skipped here; a later Edit on them is still correctly rejected as a
 * non-text payload by prior-read enforcement.
 *
 * Guards mirror `grepReadTracking.ts`: no-op when the cache is disabled or
 * unavailable, matching the other utility that records reads outside the
 * `read_file` tool.
 */
function recordAttachedFileRead(config, filePath, result) {
    if (config.getFileReadCacheDisabled?.()) {
        return;
    }
    const cache = config.getFileReadCache?.();
    if (!cache || !result.stats) {
        return;
    }
    const cacheable = isCacheableReadResult(result);
    cache.recordRead(filePath, result.stats, {
        full: !result.isTruncated,
        cacheable,
    });
}
//# sourceMappingURL=readManyFiles.js.map