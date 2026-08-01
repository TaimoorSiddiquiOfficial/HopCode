/**
 * UserMessageBubble - Shared user message component
 *
 * Displays user messages with right-aligned styling:
 * - Subtle background (5% foreground)
 * - Pill-shaped corners
 * - Max width 80%
 * - Markdown rendering for links and code
 * - Optional file attachments with thumbnails
 * - Content badges for @mentions (sources, skills)
 * - Pending/queued states (Electron only)
 */
import * as React from 'react';
import type { StoredAttachment, MessageTextElement } from '@craft-agent/core';
export interface UserMessageBubbleProps {
    /** Message content (markdown supported) */
    content: string;
    /** Additional className for the outer container */
    className?: string;
    /** Callback when a URL is clicked */
    onUrlClick?: (url: string) => void;
    /** Callback when a file path is clicked */
    onFileClick?: (path: string) => void;
    /** Stored attachments (images, documents) */
    attachments?: StoredAttachment[];
    /** Semantic text elements for inline references and collapsed ranges */
    textElements?: MessageTextElement[];
    /** Whether the message is pending (shimmer animation) */
    isPending?: boolean;
    /** Whether the message is queued (badge shown) */
    isQueued?: boolean;
    /** Compact mode - reduces padding for popover embedding */
    compactMode?: boolean;
    /** Sent timestamp in milliseconds, displayed under the bubble */
    timestamp?: number;
    /** Copy the visible message text */
    onCopy?: (content: string) => void | Promise<void>;
    /** Save edited visible message text */
    onEdit?: (content: string) => void | Promise<void>;
    /** Whether the edit action should be available */
    canEdit?: boolean;
}
export declare function UserMessageBubble({ content, className, onUrlClick, onFileClick, attachments, textElements, isPending, isQueued, compactMode, timestamp, onCopy, onEdit, canEdit, }: UserMessageBubbleProps): React.JSX.Element;
