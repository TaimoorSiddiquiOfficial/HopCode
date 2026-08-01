/**
 * Attachment helpers for displaying file type icons and labels
 *
 * Shared utilities for rendering file attachments in user messages.
 * Used by both Electron app and web viewer.
 */
import type { AttachmentType } from '@craft-agent/core';
/**
 * Get a human-friendly label for a file type
 */
export declare function getFileTypeLabel(type: AttachmentType, mimeType: string, fileName?: string): string;
export interface FileTypeIconProps {
    type: AttachmentType;
    mimeType: string;
    className?: string;
}
/**
 * File icon - ImageIcon for images, generic File icon with color tint for others
 */
export declare function FileTypeIcon({ type, mimeType, className }: FileTypeIconProps): import("react").JSX.Element;
