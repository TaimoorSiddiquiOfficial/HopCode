/**
 * End-to-end integration tests for multi-header authentication
 *
 * These tests simulate the full flow from source config to HTTP request headers,
 * specifically targeting the failure scenarios we encountered:
 *
 * 1. authType: "none" + headerNames present → NO auth headers applied (our bug)
 * 2. headerNames missing → credential not parsed as JSON
 * 3. Malformed credential storage → graceful fallback
 */
export {};
