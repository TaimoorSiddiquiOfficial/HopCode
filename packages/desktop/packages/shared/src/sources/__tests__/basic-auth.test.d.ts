/**
 * Unit tests for basic auth credential storage and retrieval
 *
 * Tests the fix for the bug where basic auth credentials were stored as
 * pre-encoded base64 instead of JSON {username, password} format.
 *
 * The correct flow is:
 * 1. sessions.ts stores: { value: JSON.stringify({ username, password }) }
 * 2. credential-manager.ts retrieves and parses: JSON.parse(value) → { username, password }
 * 3. api-tools.ts encodes at request time: Buffer.from(`${username}:${password}`).toString('base64')
 */
export {};
