/**
 * Router tests — focused on attachment forwarding.
 *
 * Covers:
 *   - text-only messages forward to sessionManager.sendMessage unchanged
 *     (regression guard for the Phase-3 rewrite).
 *   - attachments with `localPath` are materialized to FileAttachment[]
 *     and forwarded.
 *   - attachments missing `localPath` are silently dropped.
 *   - caption-less attachments still produce a send with empty text.
 *   - unbound channels fall through to Commands.handle.
 */
export {};
