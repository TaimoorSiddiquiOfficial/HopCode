/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import process from 'node:process';
import { lookup as dnsLookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { createDebugLogger } from '@hoptrendy/hopcode-core';
import { buildVoiceKeyterms } from './voice-keyterms.js';
import { formatUnsupportedVoiceModelMessage, isTranscribableVoiceModel, resolveVoiceTransport, } from './voice-model.js';
import { readVoiceLanguage } from './voice-settings.js';
const DEFAULT_OPENAI_API_KEY = 'OPENAI_API_KEY';
const INFERENCE_TIMEOUT_MS = 60_000;
const MIN_KEYTERM_ECHO_TOKENS = 8;
const MIN_ABSOLUTE_KEYTERM_ECHO_TOKENS = 10;
const MIN_KEYTERM_SET_ECHO_RATIO = 0.3;
const debugLogger = createDebugLogger('VOICE_TRANSCRIBER');
export { resolveVoiceTransport };
function trimTrailingSlashes(value) {
    return value.replace(/\/+$/, '');
}
function readSettingsEnv(settings, envKey) {
    const env = settings.merged.env;
    const value = env?.[envKey];
    return typeof value === 'string' && value.trim().length > 0
        ? value.trim()
        : undefined;
}
function isQwenBaseUrl(baseUrl) {
    try {
        const hostname = new URL(baseUrl).hostname.toLowerCase();
        return (hostname === 'dashscope.aliyuncs.com' ||
            hostname === 'dashscope-intl.aliyuncs.com' ||
            hostname === 'dashscope-us.aliyuncs.com' ||
            hostname.endsWith('.dashscope.aliyuncs.com') ||
            hostname.endsWith('.dashscope-intl.aliyuncs.com') ||
            hostname.endsWith('.dashscope-us.aliyuncs.com'));
    }
    catch {
        return false;
    }
}
function normalizeBaseUrl(baseUrl, modelName) {
    let url;
    try {
        url = new URL(baseUrl);
    }
    catch {
        throw new Error(`Voice model '${modelName}' has an invalid baseUrl.`);
    }
    url.username = '';
    url.password = '';
    return trimTrailingSlashes(url.toString());
}
function normalizeHostname(hostname) {
    return hostname.toLowerCase().replace(/^\[|\]$/g, '');
}
function isLoopbackHost(hostname) {
    const host = normalizeHostname(hostname);
    return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}
function readIpv4CompatibleIpv6(host) {
    if (!host.startsWith('::') || host.startsWith('::ffff:')) {
        return undefined;
    }
    const parts = host.slice(2).split(':');
    if (parts.length === 0 || parts.length > 2 || parts.some((p) => !p)) {
        return undefined;
    }
    if (parts.some((part) => !/^[0-9a-f]{1,4}$/i.test(part))) {
        return undefined;
    }
    const hextets = parts.map((part) => Number.parseInt(part, 16));
    if (hextets.some((part) => !Number.isInteger(part) || part < 0 || part > 0xffff)) {
        return undefined;
    }
    const value = hextets.length === 1 ? hextets[0] : (hextets[0] << 16) | hextets[1];
    return [
        (value >>> 24) & 0xff,
        (value >>> 16) & 0xff,
        (value >>> 8) & 0xff,
        value & 0xff,
    ].join('.');
}
// Blocks IP-literal private networks only. Hostname DNS resolution and
// rebinding protection require an async lookup or socket-level remoteAddress check.
function isPrivateNetworkIp(hostname) {
    const host = normalizeHostname(hostname);
    if (isLoopbackHost(host)) {
        return false;
    }
    const ipv4Mapped = host.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (ipv4Mapped) {
        return isPrivateNetworkIp(ipv4Mapped[1]);
    }
    const ipv4Compatible = host.match(/^::(\d+\.\d+\.\d+\.\d+)$/);
    if (ipv4Compatible) {
        return isPrivateNetworkIp(ipv4Compatible[1]);
    }
    const normalizedIpv4Compatible = readIpv4CompatibleIpv6(host);
    if (normalizedIpv4Compatible) {
        return isPrivateNetworkIp(normalizedIpv4Compatible);
    }
    if (host.startsWith('::ffff:')) {
        return true;
    }
    if (isIP(host) === 4) {
        const [first = 0, second = 0] = host.split('.').map(Number);
        return (first === 0 ||
            first === 10 ||
            first === 127 ||
            (first === 169 && second === 254) ||
            (first === 172 && second >= 16 && second <= 31) ||
            (first === 192 && second === 168) ||
            (first === 100 && second >= 64 && second <= 127));
    }
    if (isIP(host) === 6) {
        const firstHextet = Number.parseInt(host.split(':', 1)[0] || '', 16);
        const isLinkLocal = firstHextet >= 0xfe80 && firstHextet <= 0xfebf;
        const isUniqueLocal = (firstHextet & 0xfe00) === 0xfc00;
        return host === '::' || isLinkLocal || isUniqueLocal;
    }
    return false;
}
async function defaultLookupHost(hostname) {
    return dnsLookup(hostname, { all: true });
}
export async function assertVoiceBaseUrlNetworkAllowed(voiceConfig, lookupHost, abortSignal) {
    const hostname = normalizeHostname(new URL(voiceConfig.baseUrl).hostname);
    if (isLoopbackHost(hostname)) {
        return;
    }
    if (isIP(hostname) !== 0) {
        if (isPrivateNetworkIp(hostname)) {
            throw new Error(`Voice model '${voiceConfig.model}' resolved to a private-network address.`);
        }
        return;
    }
    let result;
    let onAbort;
    try {
        if (abortSignal?.aborted) {
            throw abortSignal.reason;
        }
        const lookup = (lookupHost ?? defaultLookupHost)(hostname);
        result = abortSignal
            ? await Promise.race([
                lookup,
                new Promise((_resolve, reject) => {
                    onAbort = () => reject(abortSignal.reason);
                    if (abortSignal.aborted)
                        onAbort();
                    else
                        abortSignal.addEventListener('abort', onAbort, { once: true });
                }),
            ])
            : await lookup;
    }
    catch {
        if (abortSignal?.aborted) {
            throw abortSignal.reason instanceof Error
                ? abortSignal.reason
                : new Error('Voice request was aborted.');
        }
        throw new Error(`Voice model '${voiceConfig.model}': DNS lookup failed for ${hostname}. Cannot verify network safety.`);
    }
    finally {
        if (onAbort)
            abortSignal?.removeEventListener('abort', onAbort);
    }
    const records = Array.isArray(result) ? result : [result];
    if (records.some((record) => isPrivateNetworkIp(record.address))) {
        throw new Error(`Voice model '${voiceConfig.model}' resolved to a private-network address.`);
    }
}
function readApiKey(settings, model, baseUrl, env) {
    if (!model.envKey && !isQwenBaseUrl(baseUrl)) {
        return undefined;
    }
    const envKey = model.envKey ?? DEFAULT_OPENAI_API_KEY;
    const envValue = (env ?? process.env)[envKey];
    if (envValue && envValue.trim().length > 0) {
        return envValue.trim();
    }
    const settingsEnvValue = readSettingsEnv(settings, envKey);
    if (settingsEnvValue) {
        return settingsEnvValue;
    }
    if (!model.envKey && isQwenBaseUrl(baseUrl)) {
        const authApiKey = settings.merged.security?.auth?.apiKey;
        return typeof authApiKey === 'string' && authApiKey.trim().length > 0
            ? authApiKey.trim()
            : undefined;
    }
    return undefined;
}
export function resolveVoiceTranscriptionConfig({ config, settings, voiceModel, env, }) {
    const matches = config
        .getAllConfiguredModels()
        .filter((model) => model.id === voiceModel);
    if (matches.length === 0) {
        throw new Error(`Voice model '${voiceModel}' is not configured. Run /model --voice to choose a configured model.`);
    }
    if (matches.length > 1) {
        throw new Error(`Voice model '${voiceModel}' is ambiguous.`);
    }
    const model = matches[0];
    if (!isTranscribableVoiceModel(model)) {
        throw new Error(formatUnsupportedVoiceModelMessage(voiceModel));
    }
    const baseUrl = model.baseUrl?.trim();
    if (!baseUrl) {
        throw new Error(`Voice model '${voiceModel}' does not define a baseUrl.`);
    }
    const normalizedBaseUrl = normalizeBaseUrl(baseUrl, voiceModel);
    const parsedBaseUrl = new URL(normalizedBaseUrl);
    const isLocalhost = isLoopbackHost(parsedBaseUrl.hostname);
    if (parsedBaseUrl.protocol !== 'https:' && !isLocalhost) {
        throw new Error(`Voice model '${voiceModel}' must use an https baseUrl. Voice audio must not be transmitted in cleartext.`);
    }
    if (isPrivateNetworkIp(parsedBaseUrl.hostname)) {
        throw new Error(`Voice model '${voiceModel}' must not use a private-network baseUrl.`);
    }
    const apiKey = readApiKey(settings, model, normalizedBaseUrl, env);
    if (model.envKey && !apiKey) {
        throw new Error(`Voice model '${voiceModel}' requires ${model.envKey}.`);
    }
    return {
        model: voiceModel,
        baseUrl: normalizedBaseUrl,
        ...(apiKey ? { apiKey } : {}),
    };
}
export function isStreamingVoiceModel(model) {
    const transport = resolveVoiceTransport(model);
    return (transport === 'qwen-asr-realtime' || transport === 'dashscope-task-realtime');
}
/** Build a streaming (WebSocket) config from the configured voice provider. */
export function resolveVoiceStreamConfig(args) {
    const base = resolveVoiceTranscriptionConfig(args);
    const transport = resolveVoiceTransport(base.model);
    if (transport !== 'qwen-asr-realtime' &&
        transport !== 'dashscope-task-realtime') {
        throw new Error(`Voice model '${base.model}' does not support streaming transcription.`);
    }
    const language = resolveLanguageCode(readVoiceLanguage(args.settings));
    const keytermsContext = transport === 'qwen-asr-realtime'
        ? buildKeytermsContext(args.settings)
        : undefined;
    return {
        transport,
        baseUrl: base.baseUrl,
        model: base.model,
        ...(base.apiKey ? { apiKey: base.apiKey } : {}),
        ...(language ? { language } : {}),
        ...(keytermsContext ? { keytermsContext } : {}),
    };
}
// Common spoken-language names → the codes Qwen-ASR's asr_options.language wants.
const LANGUAGE_CODES = {
    english: 'en',
    chinese: 'zh',
    mandarin: 'zh',
    cantonese: 'yue',
    japanese: 'ja',
    korean: 'ko',
    french: 'fr',
    german: 'de',
    spanish: 'es',
    italian: 'it',
    portuguese: 'pt',
    russian: 'ru',
    arabic: 'ar',
};
function resolveLanguageCode(language) {
    if (!language) {
        return undefined;
    }
    const lower = language.toLowerCase();
    if (LANGUAGE_CODES[lower]) {
        return LANGUAGE_CODES[lower];
    }
    // Already a short code (en / zh / yue). Unknown free text → let it auto-detect.
    return /^[a-z]{2,3}$/.test(lower) ? lower : undefined;
}
function buildKeytermsContext(settings) {
    try {
        const keyterms = buildVoiceKeyterms(settings);
        return keyterms.length > 0 ? keyterms.join(' ') : undefined;
    }
    catch {
        return undefined;
    }
}
function tokenize(value) {
    return value
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .filter(Boolean);
}
/**
 * On non-speech audio (silence/noise) Qwen-ASR can hallucinate the keyterm
 * context back as the transcript. Detect that — a multi-word result whose tokens
 * are almost entirely keyterms — so the bias list never lands in the prompt.
 * Short results are left alone so genuine terse utterances ("grep regex") pass.
 */
export function isKeytermEcho(transcript, keytermsContext) {
    if (!keytermsContext) {
        return false;
    }
    const tokens = tokenize(transcript);
    if (tokens.length < 4) {
        return false;
    }
    const keyset = new Set(tokenize(keytermsContext));
    const overlap = tokens.filter((t) => keyset.has(t)).length;
    const transcriptRatio = overlap / tokens.length;
    const keytermRatio = overlap / keyset.size;
    const isEcho = overlap >= MIN_KEYTERM_ECHO_TOKENS &&
        transcriptRatio >= 0.9 &&
        (keytermRatio >= MIN_KEYTERM_SET_ECHO_RATIO ||
            overlap >= MIN_ABSOLUTE_KEYTERM_ECHO_TOKENS);
    if (isEcho) {
        const branch = keytermRatio >= MIN_KEYTERM_SET_ECHO_RATIO ? 'ratio' : 'absolute';
        debugLogger.debug(`[voice] dropped likely keyterm echo (${branch}): overlap=${overlap} keysetSize=${keyset.size} transcriptRatio=${transcriptRatio.toFixed(2)} keytermRatio=${keytermRatio.toFixed(2)} text="${transcript}"`);
    }
    return isEcho;
}
// Qwen-ASR caps each audio file at 10 MB / 5 minutes. Our 16 kHz mono 16-bit WAV
// is ~32 KB/s, so guard before encoding to give a clear error on overlong holds.
export const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const MAX_TRANSCRIPTION_ERROR_LENGTH = 200;
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export function sanitizeVoiceErrorMessage(raw, apiKey) {
    let redacted = raw
        .replace(/Authorization:\s*(?:Bearer|ApiKey|Basic|Token)?\s*\S+/gi, 'Authorization: [REDACTED]')
        .replace(/Bearer\s+\S+/gi, 'Bearer [REDACTED]')
        .replace(/\b(?:api[-_ ]?key|token|secret)=\S+/gi, '[REDACTED]')
        .replace(/\bsk-[A-Za-z0-9._-]{4,}\b/g, '[REDACTED]');
    if (apiKey) {
        redacted = redacted.replace(new RegExp(escapeRegExp(apiKey), 'g'), '[REDACTED]');
    }
    return redacted.length > MAX_TRANSCRIPTION_ERROR_LENGTH
        ? `${redacted.slice(0, MAX_TRANSCRIPTION_ERROR_LENGTH)}...`
        : redacted;
}
function inputAudioFormat(mimeType) {
    const subtype = mimeType.split(';', 1)[0]?.trim().toLowerCase() ?? '';
    return subtype.startsWith('audio/')
        ? subtype.slice('audio/'.length) || 'wav'
        : 'wav';
}
function transcriptionAbortSignal(abortSignal) {
    const timeoutSignal = AbortSignal.timeout(INFERENCE_TIMEOUT_MS);
    return abortSignal
        ? AbortSignal.any([abortSignal, timeoutSignal])
        : timeoutSignal;
}
/**
 * Transcribe via the DashScope/Qwen-ASR OpenAI-compatible protocol: the audio
 * is sent as an `input_audio` chat message and the transcript comes back as the
 * assistant message content. (DashScope does NOT serve the Whisper-style
 * `/audio/transcriptions` endpoint — it 404s.) Keyterm biasing goes in a leading
 * system message with structured content; language/itn go in `asr_options`.
 */
async function transcribeViaQwenAsr(audio, voiceConfig, options, fetchFn) {
    if (audio.data.byteLength > MAX_AUDIO_BYTES) {
        throw new Error('Recording is too long for transcription (max ~5 minutes / 10 MB). Try a shorter dictation.');
    }
    const dataUrl = `data:${audio.mimeType};base64,${Buffer.from(audio.data).toString('base64')}`;
    const messages = [];
    if (options.keytermsContext) {
        messages.push({
            role: 'system',
            content: [{ type: 'text', text: options.keytermsContext }],
        });
    }
    messages.push({
        role: 'user',
        content: [
            {
                type: 'input_audio',
                input_audio: {
                    data: dataUrl,
                    format: inputAudioFormat(audio.mimeType),
                },
            },
        ],
    });
    const asrOptions = { enable_itn: true };
    if (options.language) {
        asrOptions['language'] = options.language;
    }
    const headers = {
        'Content-Type': 'application/json',
    };
    if (voiceConfig.apiKey) {
        headers['Authorization'] = `Bearer ${voiceConfig.apiKey}`;
    }
    let response;
    try {
        options.onEgress?.();
        response = await fetchFn(`${trimTrailingSlashes(voiceConfig.baseUrl)}/chat/completions`, {
            method: 'POST',
            headers,
            redirect: 'manual',
            body: JSON.stringify({
                model: voiceConfig.model,
                messages,
                asr_options: asrOptions,
            }),
            signal: transcriptionAbortSignal(options.abortSignal),
        });
    }
    catch (error) {
        if (error instanceof DOMException && error.name === 'TimeoutError') {
            throw new Error(`Voice transcription timed out after ${INFERENCE_TIMEOUT_MS / 1000}s. Check ASR service health and retry.`);
        }
        throw error;
    }
    if (response.status >= 300 && response.status < 400) {
        throw new Error('Voice transcription request redirected.');
    }
    if (!response.ok) {
        let details = '';
        try {
            details = sanitizeVoiceErrorMessage(await response.text(), voiceConfig.apiKey);
        }
        catch {
            details = '';
        }
        if (/model_not_supported|unsupported model/i.test(details)) {
            throw new Error('This voice model cannot be used for batch transcription. Use qwen3-asr-flash for batch or choose a realtime voice model such as qwen3-asr-flash-realtime / fun-asr-realtime / paraformer-realtime-v2.');
        }
        const suffix = details ? `: ${details}` : '';
        throw new Error(`Voice transcription request failed (${response.status} ${response.statusText})${suffix}`);
    }
    const json = (await response.json());
    const content = json.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
        throw new Error('Voice transcription response did not include text.');
    }
    const text = content.trim();
    // Drop the result if the model just echoed our keyterm bias back (happens on
    // non-speech audio) so the term list never gets inserted into the prompt.
    if (isKeytermEcho(text, options.keytermsContext)) {
        return '';
    }
    return text;
}
export async function transcribeVoiceAudio(audio, args) {
    const voiceConfig = resolveVoiceTranscriptionConfig(args);
    await assertVoiceBaseUrlNetworkAllowed(voiceConfig, args.lookupHost, args.abortSignal);
    const fetchFn = args.fetchFn ?? fetch;
    const language = resolveLanguageCode(readVoiceLanguage(args.settings));
    const keytermsContext = buildKeytermsContext(args.settings);
    const transport = resolveVoiceTransport(voiceConfig.model);
    switch (transport) {
        case 'qwen-asr-chat':
            return transcribeViaQwenAsr(audio, voiceConfig, {
                language,
                keytermsContext,
                abortSignal: args.abortSignal,
                ...(args.onEgress ? { onEgress: args.onEgress } : {}),
            }, fetchFn);
        case 'qwen-asr-realtime':
        case 'dashscope-task-realtime':
            throw new Error(`Voice model '${voiceConfig.model}' requires streaming transcription.`);
        case 'unsupported':
        default:
            throw new Error(`Voice model '${voiceConfig.model}' is not a supported transcription model.`);
    }
}
//# sourceMappingURL=voice-transcriber.js.map