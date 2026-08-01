/**
 * Tests for linkify.ts — URL/file-path detection and markdown link preprocessing.
 *
 * Focuses on the bug where preprocessLinks() would detect bare domains inside
 * the text portion of existing markdown links (e.g. [help.figma.com - Title](url))
 * and double-wrap them, producing broken nested markdown.
 */
export {};
