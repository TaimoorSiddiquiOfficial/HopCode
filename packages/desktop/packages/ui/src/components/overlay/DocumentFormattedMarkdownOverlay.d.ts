/**
 * DocumentFormattedMarkdownOverlay - Fullscreen view for reading AI responses and plans
 *
 * Renders markdown content in a document-like format with:
 * - Centered content card with max-width
 * - Copy button via FullscreenOverlayBase's built-in copyContent prop
 * - Optional "Plan" header variant
 * - Optional filePath badge with dual-trigger menu (Open / Reveal in {file manager})
 *
 * Background and scenic blur are provided by FullscreenOverlayBase.
 * Uses FullscreenOverlayBase for portal, traffic lights, ESC handling, and header.
 */
import type { AnnotationV1 } from '@craft-agent/core';
import type { ExternalOpenAnnotationRequest } from '../annotations/use-annotation-interaction-controller';
import type { OverlayTypeBadge } from './FullscreenOverlayBaseHeader';
export interface DocumentFormattedMarkdownOverlayProps {
    /** The content to display (markdown) */
    content: string;
    /** Whether the overlay is open */
    isOpen: boolean;
    /** Called when overlay should close */
    onClose: () => void;
    /** Variant: 'response' (default) or 'plan' (shows header) */
    variant?: 'response' | 'plan';
    /** Callback for URL clicks */
    onOpenUrl?: (url: string) => void;
    /** Callback for file path clicks */
    onOpenFile?: (path: string) => void;
    /** Optional file path — shows badge with "Open" / "Reveal in {file manager}" menu */
    filePath?: string;
    /** Optional type badge — tool/format indicator (e.g. "Write") shown in header */
    typeBadge?: OverlayTypeBadge;
    /** Optional error message — renders a tinted error banner above the content card */
    error?: string;
    /** Optional session id used for annotation payload source metadata */
    sessionId?: string;
    /** Optional message id; when present with callbacks, overlay becomes annotatable */
    messageId?: string;
    /** Persisted annotations for the message */
    annotations?: AnnotationV1[];
    /** Callback to add annotation */
    onAddAnnotation?: (messageId: string, annotation: AnnotationV1) => void;
    /** Callback to remove annotation */
    onRemoveAnnotation?: (messageId: string, annotationId: string) => void;
    /** Callback to update annotation */
    onUpdateAnnotation?: (messageId: string, annotationId: string, patch: Partial<AnnotationV1>) => void;
    /** Input send key behavior used by follow-up editor */
    sendMessageKey?: 'enter' | 'cmd-enter';
    /** Whether source content is currently streaming (affects annotation eligibility parity) */
    isStreaming?: boolean;
    /** Optional external request to open a specific annotation */
    openAnnotationRequest?: ExternalOpenAnnotationRequest | null;
    /** Render inline inside a docked side panel instead of taking over the viewport */
    embedded?: boolean;
}
export declare function DocumentFormattedMarkdownOverlay({ content, isOpen, onClose, variant, onOpenUrl, onOpenFile, filePath, typeBadge, error, sessionId, messageId, annotations, onAddAnnotation, onRemoveAnnotation, onUpdateAnnotation, sendMessageKey, isStreaming, openAnnotationRequest, embedded, }: DocumentFormattedMarkdownOverlayProps): import("react").JSX.Element;
