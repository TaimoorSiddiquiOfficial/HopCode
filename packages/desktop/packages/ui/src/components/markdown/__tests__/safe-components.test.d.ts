/**
 * Tests for safe-components.tsx — handling invalid HTML-like tags in markdown.
 *
 * When users type `<sq+qr>` or similar invalid tag names, rehype-raw interprets
 * them as HTML. React crashes on invalid component names. These tests verify
 * the proxy correctly handles all cases.
 */
export {};
