import * as React from 'react';
import type { AnnotationV1 } from '@craft-agent/core';
import { type ExternalOpenAnnotationRequest } from '../annotations/use-annotation-interaction-controller';
export interface AnnotatableMarkdownDocumentProps {
    content: string;
    messageId: string;
    sessionId?: string;
    annotations?: AnnotationV1[];
    onAddAnnotation?: (messageId: string, annotation: AnnotationV1) => void;
    onRemoveAnnotation?: (messageId: string, annotationId: string) => void;
    onUpdateAnnotation?: (messageId: string, annotationId: string, patch: Partial<AnnotationV1>) => void;
    onOpenUrl?: (url: string) => void;
    onOpenFile?: (path: string) => void;
    sendMessageKey?: 'enter' | 'cmd-enter';
    islandZIndex?: React.CSSProperties['zIndex'];
    openAnnotationRequest?: ExternalOpenAnnotationRequest | null;
    isStreaming?: boolean;
}
export declare function AnnotatableMarkdownDocument({ content, messageId, sessionId, annotations, onAddAnnotation, onRemoveAnnotation, onUpdateAnnotation, onOpenUrl, onOpenFile, sendMessageKey, islandZIndex, openAnnotationRequest, isStreaming, }: AnnotatableMarkdownDocumentProps): React.JSX.Element;
