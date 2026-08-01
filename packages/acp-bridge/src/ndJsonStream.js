/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
export function ndJsonStream(output, input, hooks) {
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();
    const readable = new ReadableStream({
        async start(controller) {
            const pending = [];
            const reader = input.getReader();
            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done)
                        break;
                    if (!value)
                        continue;
                    readChunk(value, pending, controller, textDecoder, hooks);
                }
            }
            finally {
                reader.releaseLock();
                controller.close();
            }
        },
    });
    const writable = new WritableStream({
        async write(message) {
            const content = JSON.stringify(message);
            const payload = textEncoder.encode(content);
            const frame = new Uint8Array(payload.byteLength + 1);
            frame.set(payload);
            frame[payload.byteLength] = 0x0a;
            const writer = output.getWriter();
            try {
                await writer.write(frame);
                callHook(hooks?.onMessageSent, payload.byteLength);
                callHook(hooks?.onMessageObserved, {
                    direction: 'sent',
                    bytes: payload.byteLength,
                    message,
                });
            }
            finally {
                writer.releaseLock();
            }
        },
    });
    return { readable, writable };
}
function readChunk(chunk, pending, controller, textDecoder, hooks) {
    let start = 0;
    let newline = chunk.indexOf(0x0a, start);
    while (newline !== -1) {
        const lineBytes = takeLineBytes(pending, chunk.subarray(start, newline));
        handleLine(lineBytes, controller, textDecoder, hooks);
        start = newline + 1;
        newline = chunk.indexOf(0x0a, start);
    }
    if (start < chunk.length) {
        pending.push(chunk.subarray(start));
    }
}
function takeLineBytes(pending, current) {
    if (pending.length === 0)
        return current;
    const totalLength = pending.reduce((sum, part) => sum + part.byteLength, 0) +
        current.byteLength;
    const line = new Uint8Array(totalLength);
    let offset = 0;
    for (const part of pending) {
        line.set(part, offset);
        offset += part.byteLength;
    }
    line.set(current, offset);
    pending.length = 0;
    return line;
}
function handleLine(lineBytes, controller, textDecoder, hooks) {
    const line = textDecoder.decode(lineBytes);
    const trimmedLine = line.trim();
    if (!trimmedLine)
        return;
    try {
        const message = JSON.parse(trimmedLine);
        controller.enqueue(message);
        const bytes = jsonPayloadByteLength(lineBytes);
        callHook(hooks?.onMessageReceived, bytes);
        callHook(hooks?.onMessageObserved, {
            direction: 'received',
            bytes,
            message,
        });
    }
    catch (err) {
        // eslint-disable-next-line no-console -- match ACP SDK parse-error behavior
        console.error('Failed to parse JSON message:', trimmedLine, err);
    }
}
function jsonPayloadByteLength(lineBytes) {
    return lineBytes[lineBytes.byteLength - 1] === 0x0d
        ? lineBytes.byteLength - 1
        : lineBytes.byteLength;
}
function callHook(hook, value) {
    try {
        hook?.(value);
    }
    catch {
        /* metrics hooks must not break the transport */
    }
}
//# sourceMappingURL=ndJsonStream.js.map