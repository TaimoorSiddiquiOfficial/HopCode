/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { createServer, } from 'node:http';
import { randomUUID } from 'node:crypto';
const MAX_REQUEST_BODY_BYTES = 10 * 1024 * 1024;
class RequestBodyTooLargeError extends Error {
    constructor() {
        super('fake OpenAI request body too large');
    }
}
export function fakeToolCall(name, args, id = `call_${randomUUID()}`) {
    return {
        id,
        type: 'function',
        function: {
            name,
            arguments: JSON.stringify(args),
        },
    };
}
export async function startFakeOpenAIServer(handler, options = {}) {
    const requests = [];
    const server = createServer(async (req, res) => {
        if (req.method !== 'POST' || !req.url?.endsWith('/chat/completions')) {
            res.writeHead(404);
            res.end('not found');
            return;
        }
        try {
            const rawBody = await readRequestBody(req);
            const body = parseJsonBody(rawBody);
            if (!body) {
                res.writeHead(400);
                res.end('bad json');
                return;
            }
            const requestIndex = requests.length;
            requests.push({ body });
            const response = await handler({ body, requestIndex });
            if (body['stream'] === true) {
                writeStreamed(res, getModel(body), response);
            }
            else {
                writeNonStreamed(res, getModel(body), response);
            }
        }
        catch (error) {
            if (error instanceof RequestBodyTooLargeError) {
                res.writeHead(413);
                res.end('request body too large');
                return;
            }
            if (res.headersSent) {
                if (!res.writableEnded) {
                    res.destroy();
                }
                return;
            }
            res.writeHead(500, { 'content-type': 'application/json' });
            res.end(JSON.stringify({
                error: {
                    message: 'fake OpenAI server handler failed',
                    type: 'server_error',
                },
            }));
        }
    });
    await new Promise((resolve, reject) => {
        const onError = (error) => {
            server.off('listening', onListening);
            reject(error);
        };
        const onListening = () => {
            server.off('error', onError);
            resolve();
        };
        server.once('error', onError);
        server.once('listening', onListening);
        server.listen(0, options.listenHost ?? '127.0.0.1');
    });
    const address = server.address();
    if (!address || typeof address === 'string') {
        throw new Error('failed to start fake OpenAI server');
    }
    return {
        baseUrl: `http://${options.baseUrlHost ?? '127.0.0.1'}:${address.port}/v1`,
        requests,
        close: () => closeServer(server),
    };
}
function readRequestBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let totalLength = 0;
        let tooLarge = false;
        req.on('data', (chunk) => {
            if (tooLarge)
                return;
            totalLength += chunk.length;
            if (totalLength > MAX_REQUEST_BODY_BYTES) {
                tooLarge = true;
                reject(new RequestBodyTooLargeError());
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => {
            if (!tooLarge)
                resolve(Buffer.concat(chunks).toString('utf8'));
        });
        req.on('error', reject);
    });
}
function parseJsonBody(rawBody) {
    try {
        const parsed = JSON.parse(rawBody);
        return isJsonObject(parsed) ? parsed : null;
    }
    catch {
        return null;
    }
}
function isJsonObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function getModel(body) {
    return typeof body['model'] === 'string' ? body['model'] : 'fake-model';
}
function writeNonStreamed(res, model, message) {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({
        id: chatCompletionId(),
        object: 'chat.completion',
        created: nowSeconds(),
        model,
        choices: [
            {
                index: 0,
                message: {
                    role: 'assistant',
                    content: message.content ?? message.contentChunks?.join('') ?? null,
                    ...(message.toolCalls ? { tool_calls: message.toolCalls } : {}),
                },
                finish_reason: finishReason(message),
            },
        ],
        usage: message.usage ?? DEFAULT_USAGE,
    }));
}
function writeStreamed(res, model, message) {
    res.writeHead(200, {
        'cache-control': 'no-cache',
        connection: 'keep-alive',
        'content-type': 'text/event-stream',
    });
    const id = chatCompletionId();
    const created = nowSeconds();
    const chunk = (delta, finish_reason = null, usage) => ({
        id,
        object: 'chat.completion.chunk',
        created,
        model,
        choices: [{ index: 0, delta, finish_reason }],
        ...(usage ? { usage } : {}),
    });
    const send = (payload, callback) => {
        res.write(`data: ${JSON.stringify(payload)}\n\n`, callback);
    };
    send(chunk({ role: 'assistant' }));
    for (const [index, content] of (message.contentChunks ?? []).entries()) {
        if (message.disconnectAfterContentChunks === index + 1) {
            send(chunk({ content }), () => res.destroy());
            return;
        }
        send(chunk({ content }));
    }
    if (!message.contentChunks && message.content) {
        send(chunk({ content: message.content }));
    }
    for (const [index, toolCall] of (message.toolCalls ?? []).entries()) {
        send(chunk({
            tool_calls: [
                {
                    index,
                    id: toolCall.id,
                    type: toolCall.type,
                    function: {
                        name: toolCall.function.name,
                        arguments: '',
                    },
                },
            ],
        }));
        if (toolCall.function.arguments) {
            send(chunk({
                tool_calls: [
                    {
                        index,
                        function: {
                            arguments: toolCall.function.arguments,
                        },
                    },
                ],
            }));
        }
    }
    send(chunk({}, finishReason(message), message.usage ?? DEFAULT_USAGE));
    res.write('data: [DONE]\n\n');
    res.end();
}
function finishReason(message) {
    return message.finishReason ?? (message.toolCalls ? 'tool_calls' : 'stop');
}
const DEFAULT_USAGE = {
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0,
};
function chatCompletionId() {
    return `chatcmpl-${randomUUID()}`;
}
function nowSeconds() {
    return Math.floor(Date.now() / 1000);
}
function closeServer(server) {
    return new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeAllConnections();
    });
}
//# sourceMappingURL=fake-openai-server.js.map