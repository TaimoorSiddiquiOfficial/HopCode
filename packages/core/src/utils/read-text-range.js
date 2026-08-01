/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { TextDecoder } from 'node:util';
import { detectFileEncoding, readFileWithEncodingInfo } from './fileUtils.js';
import { isUtf8CompatibleEncoding } from './iconvHelper.js';
import { DEFAULT_RANGE_READ_BYTES, TEXT_RANGE_FAST_PATH_MAX_SIZE, } from './text-range-constants.js';
export class LargeNonUtf8TextError extends Error {
    encoding;
    reason;
    constructor(encoding, reason) {
        super(reason === 'invalid-utf8'
            ? 'Large text file contains invalid UTF-8 byte sequence beyond the initial encoding sample. Convert or extract a smaller UTF-8 slice and read that instead.'
            : `Large non-UTF-8 text files are not supported for streaming reads (detected ${encoding}). Convert or extract a smaller UTF-8 slice and read that instead.`);
        this.encoding = encoding;
        this.reason = reason;
        this.name = 'LargeNonUtf8TextError';
    }
}
export async function readTextRange(request) {
    request.signal?.throwIfAborted();
    const stats = request.stats ?? (await stat(request.path));
    const maxOutputBytes = normalizeMaxBytes(request.maxOutputBytes);
    if (stats.size < TEXT_RANGE_FAST_PATH_MAX_SIZE) {
        const { content, encoding, bom } = await readFileWithEncodingInfo(request.path, request.signal);
        request.signal?.throwIfAborted();
        const range = sliceDecodedContent(content, request.offset, request.limit, maxOutputBytes);
        return {
            ...range,
            encoding,
            bom,
            lineEnding: detectLineEndingFromContent(content),
        };
    }
    return readLargeUtf8Range(request, maxOutputBytes);
}
function normalizeMaxBytes(maxOutputBytes) {
    if (maxOutputBytes === Number.POSITIVE_INFINITY) {
        return Number.POSITIVE_INFINITY;
    }
    if (!Number.isFinite(maxOutputBytes)) {
        return DEFAULT_RANGE_READ_BYTES;
    }
    return Math.max(0, Math.floor(maxOutputBytes));
}
function sliceDecodedContent(content, offset, limit, maxOutputBytes) {
    const lines = content.split('\n');
    const originalLineCount = lines.length;
    const start = Math.min(Math.max(0, offset ?? 0), originalLineCount);
    const end = limit === undefined
        ? originalLineCount
        : Math.min(start + Math.max(0, limit), originalLineCount);
    const selected = lines.slice(start, end).join('\n');
    const truncated = truncateUtf8(selected, maxOutputBytes);
    return {
        content: truncated.content,
        originalLineCount,
        originalLineCountExact: true,
        truncatedByBytes: truncated.truncated,
    };
}
async function readLargeUtf8Range(request, maxOutputBytes) {
    const encoding = await detectFileEncoding(request.path);
    if (!isUtf8CompatibleEncoding(encoding)) {
        throw new LargeNonUtf8TextError(encoding);
    }
    const offset = Math.max(0, request.offset ?? 0);
    const endLine = offset + Math.max(0, request.limit ?? Number.POSITIVE_INFINITY);
    let currentLine = 0;
    let output = '';
    let outputBytes = 0;
    let truncatedByBytes = false;
    let bom = false;
    let firstChunk = true;
    let lineEnding = 'lf';
    let previousChunkEndedWithCR = false;
    let originalLineCountExact = true;
    let stoppedEarly = false;
    const decoder = new TextDecoder('utf-8', {
        fatal: true,
        ignoreBOM: true,
    });
    const stream = createReadStream(request.path, {
        highWaterMark: 512 * 1024,
        signal: request.signal,
    });
    function appendSelected(fragment) {
        if (fragment.length === 0 || truncatedByBytes) {
            return;
        }
        const available = maxOutputBytes - outputBytes;
        if (available <= 0) {
            truncatedByBytes = true;
            return;
        }
        const truncated = truncateUtf8(fragment, available);
        output += truncated.content;
        outputBytes += Buffer.byteLength(truncated.content, 'utf8');
        if (truncated.truncated) {
            truncatedByBytes = true;
        }
    }
    function isSelectedLine() {
        return currentLine >= offset && currentLine < endLine;
    }
    function decodeUtf8Chunk(chunk, options) {
        try {
            return decoder.decode(chunk, options);
        }
        catch {
            throw new LargeNonUtf8TextError(encoding, 'invalid-utf8');
        }
    }
    try {
        for await (const rawChunk of stream) {
            request.signal?.throwIfAborted();
            let chunk = decodeUtf8Chunk(rawChunk, { stream: true });
            if (firstChunk) {
                firstChunk = false;
                if (chunk.charCodeAt(0) === 0xfeff) {
                    chunk = chunk.slice(1);
                    bom = true;
                }
            }
            if ((previousChunkEndedWithCR && chunk.startsWith('\n')) ||
                chunk.includes('\r\n')) {
                lineEnding = 'crlf';
            }
            previousChunkEndedWithCR = chunk.endsWith('\r');
            let start = 0;
            let newline = chunk.indexOf('\n', start);
            while (newline !== -1) {
                if (isSelectedLine()) {
                    appendSelected(chunk.slice(start, newline));
                    if (currentLine + 1 < endLine) {
                        appendSelected('\n');
                    }
                }
                currentLine++;
                start = newline + 1;
                if (currentLine >= endLine || truncatedByBytes) {
                    originalLineCountExact = false;
                    stoppedEarly = true;
                    break;
                }
                newline = chunk.indexOf('\n', start);
            }
            if (start < chunk.length && isSelectedLine()) {
                appendSelected(chunk.slice(start));
            }
            if (currentLine >= endLine || truncatedByBytes) {
                originalLineCountExact = false;
                stoppedEarly = true;
                break;
            }
        }
    }
    finally {
        stream.destroy();
    }
    if (!stoppedEarly) {
        decodeUtf8Chunk();
    }
    return {
        content: output,
        originalLineCount: currentLine + 1,
        encoding: 'utf-8',
        bom,
        lineEnding,
        originalLineCountExact,
        truncatedByBytes,
    };
}
function truncateUtf8(content, maxBytes) {
    const bytes = Buffer.byteLength(content, 'utf8');
    if (bytes <= maxBytes) {
        return { content, truncated: false };
    }
    if (maxBytes <= 0) {
        return { content: '', truncated: true };
    }
    const buffer = Buffer.from(content, 'utf8');
    let end = Math.min(maxBytes, buffer.length);
    // `end` is the first excluded byte. If it lands inside a multi-byte UTF-8
    // sequence, the byte at `end` is a continuation byte, so back up until the
    // prefix ends before the incomplete character.
    while (end > 0 && (buffer[end] & 0xc0) === 0x80) {
        end--;
    }
    return {
        content: buffer.subarray(0, end).toString('utf8'),
        truncated: true,
    };
}
function detectLineEndingFromContent(content) {
    return content.includes('\r\n') ? 'crlf' : 'lf';
}
//# sourceMappingURL=read-text-range.js.map