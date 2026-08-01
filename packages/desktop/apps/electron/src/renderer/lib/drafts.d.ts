/**
 * Helpers for persisting and hydrating session-input attachments.
 *
 * Two tracks, chosen per attachment at save time:
 *   - Track P (path-backed): absolute OS path captured via webUtils.getPathForFile.
 *     Persist just `{path, name}`. Re-read on hydrate via the readUserAttachment RPC.
 *   - Track C (content-backed): no real path exists (paste, web-drag). Persist the
 *     bytes inline in `ref.content`. Hydrate reconstructs the FileAttachment from
 *     the stored bytes, no disk read.
 *
 * The detection criterion is `isAbsolutePath(a.path)`. File-picker and OS-drag go
 * through `webUtils.getPathForFile` (exposed on `electronAPI.getFilePath`) which
 * returns the absolute path. Paste/web-drag keep the filename-only synthetic path.
 */
import type { FileAttachment } from '@craft-agent/shared/protocol';
import type { DraftAttachmentRef } from '@craft-agent/shared/config';
/** Per-attachment cap on inlined draft content. Huge pastes are dropped from the draft
 *  (with a warn) rather than bloating drafts.json. Tuned to the same 20 MB limit the
 *  shared readFileAttachment helper uses for file reads. */
export declare const CONTENT_PERSIST_CAP: number;
export declare function isAbsolutePath(p: string): boolean;
/**
 * Turn a live `FileAttachment` into the persisted `DraftAttachmentRef`, picking
 * Track P or Track C based on whether the attachment has a real OS path.
 *
 * Returns `null` for Track C attachments whose content exceeds the per-attachment
 * cap — the caller drops it from the draft with a console warn.
 */
export declare function toDraftRef(a: FileAttachment): DraftAttachmentRef | null;
/**
 * Reconstruct a `FileAttachment` from a content-backed draft ref. Pure data
 * transformation — no disk read, no RPC.
 */
export declare function attachmentFromContentRef(ref: DraftAttachmentRef): FileAttachment | null;
