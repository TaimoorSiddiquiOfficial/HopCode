import * as React from 'react';
export type AnchorX = 'left' | 'center' | 'right';
export type AnchorY = 'top' | 'center' | 'bottom';
export type IslandDialogBehavior = 'none' | 'close' | 'back-or-close';
export type IslandMorphTarget = {
    x: number;
    y: number;
    width?: number;
    height?: number;
};
export interface IslandContentViewProps {
    id: string;
    anchorX?: AnchorX;
    anchorY?: AnchorY;
    className?: string;
    morphFrom?: IslandMorphTarget | null;
    /** Locks document scrolling while this view is active and visible (dialog-like behavior). */
    lockScroll?: boolean;
    /** Renders a full-viewport capture layer that blocks pointer interaction outside the island. Implies lockScroll. */
    blockOutsideInteraction?: boolean;
    children: React.ReactNode;
}
/**
 * Marker component for Island child views.
 *
 * Usage:
 * <Island activeViewId="compact">
 *   <IslandContentView id="compact">...</IslandContentView>
 *   <IslandContentView id="confirm">...</IslandContentView>
 * </Island>
 */
export declare function IslandContentView({ children }: IslandContentViewProps): React.JSX.Element;
export declare namespace IslandContentView {
    var displayName: string;
}
export interface IslandTransitionConfig {
    /** Master duration used by both shell and content animations */
    duration?: number;
    /** Spring bounce for the shell layout animation */
    bounce?: number;
    /** Enter/exit blur radius in px for content crossfade */
    blurPx?: number;
    /** Direction in degrees for directional enter/exit offset (0 = from right, 90 = from bottom). */
    entryAngleDeg?: number;
    /** Directional travel distance in pixels for enter/exit offset. */
    entryDistancePx?: number;
    /** Start scale used when no morph target scale is available. */
    entryStartScale?: number;
}
export interface IslandActiveViewSize {
    id: string;
    width: number;
    height: number;
}
export interface IslandProps {
    activeViewId: string;
    children: React.ReactNode;
    className?: string;
    radius?: number;
    transitionConfig?: IslandTransitionConfig;
    onActiveViewSizeChange?: (size: IslandActiveViewSize) => void;
    /** Controls shell presence animation. Defaults to true for backward compatibility. */
    isVisible?: boolean;
    /** Called after hide animation settles. Parent can unmount safely here. */
    onExitComplete?: () => void;
    /** Calls onRequestClose when pointer-down happens outside the island shell while visible. */
    dismissOnPointerDownOutside?: boolean;
    /** Consumer callback for close/dismiss requests (outside tap, escape, etc.). */
    onRequestClose?: () => void;
    /** Consumer callback for back navigation requests. Return true when handled. */
    onRequestBack?: () => boolean;
    /** Dialog semantics for Escape handling while visible. */
    dialogBehavior?: IslandDialogBehavior;
    /** Locks document scrolling while the island is visible, regardless of active view-level lockScroll flags. */
    lockScrollWhileVisible?: boolean;
    /** Force entry animation replay when this value changes (show(animated:true)-style control). */
    replayEntryKey?: string | number;
    /** Controls whether visible transitions always run through an internal priming frame for deterministic entry replay. */
    replayOnVisible?: 'auto' | 'always';
    /** z-index for the blockOutsideInteraction overlay (portaled to body). Set to containerZIndex − 1. */
    overlayZIndex?: React.CSSProperties['zIndex'];
}
export declare function useIslandAnimationConfig(): Required<IslandTransitionConfig>;
export interface HandleIslandEscapeParams {
    dialogBehavior: IslandDialogBehavior;
    onRequestBack?: () => boolean;
    onRequestClose?: () => void;
}
/**
 * Apply Island Escape behavior. Returns true when Escape was handled.
 */
export declare function handleIslandEscape({ dialogBehavior, onRequestBack, onRequestClose, }: HandleIslandEscapeParams): boolean;
/**
 * Animated shell that morphs between registered IslandContentView children.
 *
 * - Outer shell: layout spring + optional morph from/to target
 * - Inner content: parallel enter/exit crossfade + blur
 */
export declare function Island({ activeViewId, children, className, radius, transitionConfig, onActiveViewSizeChange, isVisible, onExitComplete, dismissOnPointerDownOutside, onRequestClose, onRequestBack, dialogBehavior, lockScrollWhileVisible, replayEntryKey, replayOnVisible, overlayZIndex, }: IslandProps): React.JSX.Element | null;
