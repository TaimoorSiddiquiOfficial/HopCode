/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { hasErrorCode, hasErrorType } from '../../utils/errors.js';
import { createDebugLogger } from '../../utils/debugLogger.js';
import { getErrorStatus, getErrorType } from '../../utils/errors.js';
import { getRateLimitErrorDetails } from '../../utils/rateLimit.js';
import { redactProxyError } from '../../utils/runtimeFetchOptions.js';
const debugLogger = createDebugLogger('OPENAI_ERROR');
export class EnhancedErrorHandler {
    shouldSuppressLogging;
    constructor(shouldSuppressLogging = () => false) {
        this.shouldSuppressLogging = shouldSuppressLogging;
    }
    handle(error, context, request) {
        const redactedError = redactProxyError(error);
        const isTimeoutError = this.isTimeoutError(redactedError);
        const errorMessage = this.buildErrorMessage(redactedError, context, isTimeoutError);
        // Allow subclasses to suppress error logging for specific scenarios
        if (!this.shouldSuppressErrorLogging(redactedError, request)) {
            debugLogger.error('OpenAI API Error:', errorMessage, this.buildDiagnostics(redactedError, context));
        }
        // Provide helpful timeout-specific error message
        if (isTimeoutError) {
            throw new Error(`${errorMessage}\n\n${this.getTimeoutTroubleshootingTips()}`);
        }
        throw redactedError;
    }
    shouldSuppressErrorLogging(error, request) {
        return this.shouldSuppressLogging(error, request);
    }
    isTimeoutError(error) {
        if (!error)
            return false;
        const errorMessage = error instanceof Error
            ? error.message.toLowerCase()
            : String(error).toLowerCase();
        const errorCode = hasErrorCode(error) ? error.code : undefined;
        const errorType = hasErrorType(error) ? error.type : undefined;
        // Check for common timeout indicators
        return (errorMessage.includes('timeout') ||
            errorMessage.includes('timed out') ||
            errorMessage.includes('connection timeout') ||
            errorMessage.includes('request timeout') ||
            errorMessage.includes('read timeout') ||
            errorMessage.includes('etimedout') ||
            errorMessage.includes('esockettimedout') ||
            errorCode === 'ETIMEDOUT' ||
            errorCode === 'ESOCKETTIMEDOUT' ||
            errorType === 'timeout' ||
            errorMessage.includes('request timed out') ||
            errorMessage.includes('deadline exceeded'));
    }
    buildErrorMessage(error, context, isTimeoutError) {
        const durationSeconds = Math.round((Date.now() - context.startTime) / 1000);
        if (isTimeoutError) {
            return `Request timeout after ${durationSeconds}s. Try reducing input length or increasing timeout in config.`;
        }
        return error instanceof Error ? error.message : String(error);
    }
    buildDiagnostics(error, context) {
        const details = getRateLimitErrorDetails(error);
        const requestId = this.getRequestId(error) ?? details.requestId;
        const statusCode = getErrorStatus(error);
        return {
            model: context.model,
            durationMs: Date.now() - context.startTime,
            errorType: getErrorType(error),
            ...(statusCode !== undefined ? { statusCode } : {}),
            ...(details.providerCode !== undefined
                ? { providerCode: details.providerCode }
                : {}),
            ...(details.providerMessage !== undefined
                ? { providerMessage: details.providerMessage }
                : {}),
            ...(requestId !== undefined ? { requestId } : {}),
            ...(details.transport !== 'unknown'
                ? { transport: details.transport }
                : {}),
        };
    }
    getRequestId(error) {
        if (!error || typeof error !== 'object')
            return undefined;
        const source = error;
        for (const value of [
            source.requestID,
            source.request_id,
            source.response_id,
        ]) {
            if (typeof value === 'string' && value) {
                return value;
            }
        }
        return undefined;
    }
    getTimeoutTroubleshootingTips() {
        const tips = [
            '- Reduce input length or complexity',
            '- Increase timeout in config: contentGenerator.timeout',
            '- Check network connectivity',
        ];
        return `Troubleshooting tips:\n${tips.join('\n')}`;
    }
}
//# sourceMappingURL=errorHandler.js.map