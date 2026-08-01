import * as React from "react";
import { FileTypeIcon, getFileTypeLabel } from "@craft-agent/ui";
import type { FileAttachment } from "../../../shared/types";
export { FileTypeIcon, getFileTypeLabel };
interface AttachmentPreviewProps {
    attachments: FileAttachment[];
    onRemove: (index: number) => void;
    disabled?: boolean;
    loadingCount?: number;
}
/**
 * AttachmentPreview - attachment preview strip
 *
 * Shows attached files as small bubbles above the textarea:
 * - Image thumbnails for image files (48x48px)
 * - Icon + filename for text/PDF/code files
 * - X button on hover to remove
 * - Horizontally scrollable when many files
 * - Loading placeholders while files are being read
 */
export declare function AttachmentPreview({ attachments, onRemove, disabled, loadingCount }: AttachmentPreviewProps): React.JSX.Element | null;
