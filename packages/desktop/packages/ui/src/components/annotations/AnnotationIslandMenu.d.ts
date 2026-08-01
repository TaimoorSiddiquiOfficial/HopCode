import * as React from 'react';
import { type IslandTransitionConfig } from '../ui';
export type AnnotationIslandView = 'compact' | 'confirm-follow-up';
export type AnnotationIslandMode = 'edit' | 'view';
export interface AnnotationIslandMenuProps {
    anchor: {
        x: number;
        y: number;
    } | null;
    sourceKey: string;
    replayNonce: number;
    isVisible: boolean;
    /** Render via React portal to document.body (default). Disable inside modal/dialog contexts. */
    usePortal?: boolean;
    activeView: AnnotationIslandView;
    mode: AnnotationIslandMode;
    draft: string;
    onDraftChange: (next: string) => void;
    onOpenFollowUp: () => void;
    onCancel: () => void;
    onRequestBack?: () => boolean;
    onRequestEdit: () => void;
    onSubmit: (value: string) => void;
    onSubmitAndSend?: (value: string) => void;
    onDelete?: () => void;
    sendMessageKey?: 'enter' | 'cmd-enter';
    transitionConfig: IslandTransitionConfig;
    onExitComplete?: () => void;
    zIndex?: React.CSSProperties['zIndex'];
    overlayZIndex?: React.CSSProperties['zIndex'];
}
export declare function AnnotationIslandMenu({ anchor, sourceKey, replayNonce, isVisible, activeView, mode, draft, onDraftChange, onOpenFollowUp, onCancel, onRequestBack, onRequestEdit, onSubmit, onSubmitAndSend, onDelete, sendMessageKey, transitionConfig, onExitComplete, zIndex, overlayZIndex, usePortal, }: AnnotationIslandMenuProps): React.JSX.Element | null;
