/**
 * Markdown → Telegram MarkdownV2 formatting.
 *
 * Telegram MarkdownV2 requires escaping special characters outside of
 * code blocks. For Phase 1 we send plain text — formatting added in Phase 2.
 */
/** Escape text for Telegram MarkdownV2 parse mode. */
export declare function escapeTelegramMarkdown(text: string): string;
/**
 * For Phase 1 we send plain text (no parse_mode).
 * This avoids escaping issues while we validate the core flow.
 */
export declare function formatForTelegram(text: string): string;
