import type { ContentBadge, MessageTextElement } from '../types/message.ts';
/**
 * Convert a JavaScript UTF-16 string index into a UTF-8 byte offset.
 *
 * Message text elements intentionally use byte offsets to match Codex's
 * persisted session shape. Rendering code can convert back to UTF-16 indices
 * when slicing strings for React.
 */
export declare function utf16IndexToByteOffset(text: string, index: number): number;
/**
 * Convert a UTF-8 byte offset into a JavaScript UTF-16 string index.
 *
 * If the byte offset lands inside a multi-byte character, this returns the
 * closest following UTF-16 boundary so callers never split a surrogate pair.
 */
export declare function byteOffsetToUtf16Index(text: string, byteOffset: number): number;
export declare function contentBadgeToTextElement(content: string, badge: ContentBadge): MessageTextElement;
export declare function contentBadgesToTextElements(content: string, badges?: ContentBadge[]): MessageTextElement[] | undefined;
export declare function textElementToContentBadge(content: string, element: MessageTextElement): ContentBadge;
export declare function textElementsToContentBadges(content: string, textElements?: MessageTextElement[]): ContentBadge[] | undefined;
