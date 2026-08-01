/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Discontinued-model detection for the ACP `availableModels` payload.
 *
 * The ACP server emits each model id wrapped as `${modelId}(${authType})`,
 * e.g. `qwen3-coder-plus(hopcode-oauth)`. Runtime model snapshots are additionally
 * prefixed with `$runtime|${authType}|`, so the wrapped form becomes
 * `$runtime|hopcode-oauth|qwen3-coder-plus(hopcode-oauth)`.
 *
 * This helper mirrors the encoding contract used by the CLI's
 * `acpModelUtils.ts` and the discontinued check in the CLI's `ModelDialog`.
 * Keep these two files in sync when the encoding evolves.
 */
export declare const RUNTIME_PREFIX = "$runtime|";
/** Auth type marker for the (now-discontinued) HopCode OAuth free tier. */
export declare const HOPCODE_OAUTH_AUTH_TYPE = "hopcode-oauth";
/** User-facing strings for the discontinued state (English-only — webview has no i18n runtime). */
export declare const DISCONTINUED_MESSAGES: {
    readonly badge: "(Discontinued)";
    readonly description: "Discontinued — switch to Coding Plan or API Key";
    readonly blockedError: "HopCode OAuth free tier was discontinued on 2026-04-15. Please select a model from another provider or run /auth to switch.";
};
export interface ParsedAcpModelId {
    /** Model id with the trailing `(authType)` marker stripped. */
    baseModelId: string;
    /** Auth type extracted from the trailing `(authType)` marker, or `undefined` if none. */
    authType?: string;
    /** True when the id starts with `$runtime|` (cached-token snapshot). */
    isRuntime: boolean;
}
/**
 * Parse an ACP-formatted model id into its components.
 *
 * Returned `baseModelId` may still contain `$runtime|` prefix to preserve the
 * caller's original snapshot id; only the trailing auth-type wrapper is removed.
 */
export declare function parseAcpModelId(modelId: string): ParsedAcpModelId;
/**
 * Returns true when the model id refers to a non-runtime HopCode OAuth registry
 * entry, matching the CLI's discontinued rule.
 *
 * Runtime snapshots from existing cached tokens are intentionally excluded so
 * already-authenticated sessions keep working until the server rejects them.
 */
export declare function isDiscontinuedModel(modelId: string): boolean;
