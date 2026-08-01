import * as React from 'react';
import type { ToolDisplayMeta, AnnotationV1 } from '@craft-agent/core';
/**
 * Global size configuration for TurnCard components.
 * Adjust these values to scale the entire component uniformly.
 */
/** Shared size configuration for activity UI - exported for reuse in inline execution */
export declare const SIZE_CONFIG: {
    /** Base font size class for all text */
    readonly fontSize: "text-[13px]";
    /** Icon size class (width and height) */
    readonly iconSize: "w-3 h-3";
    /** Spinner text size class */
    readonly spinnerSize: "text-[10px]";
    /** Small spinner for header */
    readonly spinnerSizeSmall: "text-[8px]";
    /** Activity row height in pixels (approx for calculation) */
    readonly activityRowHeight: 24;
    /** Max visible activities before scrolling (show ~15 items) */
    readonly maxVisibleActivities: 15;
    /** Number of items before which we apply staggered animation */
    readonly staggeredAnimationLimit: 10;
};
export type ActivityStatus = 'pending' | 'running' | 'completed' | 'error' | 'backgrounded';
export type ActivityType = 'tool' | 'thinking' | 'intermediate' | 'status' | 'plan';
export type AnnotationInteractionMode = 'interactive' | 'tooltip-only';
export type TodoStatus = 'pending' | 'in_progress' | 'completed' | 'interrupted';
export interface TodoItem {
    /** Task content/description */
    content: string;
    /** Current status */
    status: TodoStatus;
    /** Present continuous form shown when in_progress (e.g., "Running tests") */
    activeForm?: string;
}
export interface ActivityItem {
    id: string;
    type: ActivityType;
    status: ActivityStatus;
    toolName?: string;
    toolUseId?: string;
    toolInput?: Record<string, unknown>;
    content?: string;
    intent?: string;
    intermediateKind?: 'commentary' | 'thought';
    /** Optional backing message id (used by plan activities for branching/annotations) */
    messageId?: string;
    /** Optional persisted annotations (used by plan activities) */
    annotations?: AnnotationV1[];
    displayName?: string;
    toolDisplayMeta?: ToolDisplayMeta;
    timestamp: number;
    error?: string;
    parentId?: string;
    depth?: number;
    statusType?: string;
    taskId?: string;
    shellId?: string;
    elapsedSeconds?: number;
    isBackground?: boolean;
}
export interface ResponseContent {
    text: string;
    isStreaming: boolean;
    streamStartTime?: number;
    /** Timestamp of the underlying assistant message, used for timeline ordering */
    timestamp?: number;
    /** Whether this response is a plan (renders with plan variant) */
    isPlan?: boolean;
    /** ID of the underlying message (for branching + annotations) */
    messageId?: string;
    /** Persisted annotations attached to the response message */
    annotations?: AnnotationV1[];
}
export type OpenAnnotationRequest = {
    messageId: string;
    annotationId: string;
    mode: 'view' | 'edit';
    anchorX?: number;
    anchorY?: number;
    nonce: number;
};
export interface TurnCardProps {
    /** Session ID for state persistence (optional in shared context) */
    sessionId?: string;
    /** Turn ID for state persistence */
    turnId: string;
    /** All activities in this turn (tools, thinking, intermediate text) */
    activities: ActivityItem[];
    /** Final response content (may be streaming) */
    response?: ResponseContent;
    /** Primary intent/goal for this turn (shown in collapsed preview) */
    intent?: string;
    /** Whether content is still being received */
    isStreaming: boolean;
    /** Whether this turn is fully complete */
    isComplete: boolean;
    /** Start in expanded state */
    defaultExpanded?: boolean;
    /** Controlled expansion state (overrides internal state) */
    isExpanded?: boolean;
    /** Callback when expansion state changes */
    onExpandedChange?: (expanded: boolean) => void;
    /** Controlled expansion state for activity groups */
    expandedActivityGroups?: Set<string>;
    /** Callback when activity group expansion changes */
    onExpandedActivityGroupsChange?: (groups: Set<string>) => void;
    /** Callback when file path is clicked */
    onOpenFile?: (path: string) => void;
    /** Callback when URL is clicked */
    onOpenUrl?: (url: string) => void;
    /** Callback to open response in Monaco editor */
    onPopOut?: (text: string) => void;
    /** Callback to open turn details in a new window */
    onOpenDetails?: () => void;
    /** Callback to open individual activity details in Monaco */
    onOpenActivityDetails?: (activity: ActivityItem) => void;
    /** Callback to open all edits/writes in multi-file diff view */
    onOpenMultiFileDiff?: () => void;
    /** Whether this turn has any Edit or Write activities */
    hasEditOrWriteActivities?: boolean;
    /** TodoWrite tool state - shown at bottom of turn */
    todos?: TodoItem[];
    /** Optional render prop for actions menu (Electron provides dropdown) */
    renderActionsMenu?: () => React.ReactNode;
    /** Callback when user accepts the plan (plan responses only) */
    onAcceptPlan?: () => void;
    /** Callback when user accepts the plan with compaction (compact conversation first, then execute) */
    onAcceptPlanWithCompact?: () => void;
    /** Whether this is the last response in the session (shows Accept Plan button only for last response) */
    isLastResponse?: boolean;
    /** Session folder path for stripping from file paths in tool display */
    sessionFolderPath?: string;
    /** Display mode: 'detailed' shows all info, 'informative' hides MCP/API names and params */
    displayMode?: 'informative' | 'detailed';
    /** Animate response appearance (for playground demos) */
    animateResponse?: boolean;
    /** Hide footers for compact embedding (EditPopover) */
    compactMode?: boolean;
    /** Callback to branch the session from a specific message */
    onBranch?: (messageId: string, options?: {
        newPanel?: boolean;
    }) => void;
    /** Callback to add an annotation to a response message */
    onAddAnnotation?: (messageId: string, annotation: AnnotationV1) => void;
    /** Callback to remove a persisted annotation from a response message */
    onRemoveAnnotation?: (messageId: string, annotationId: string) => void;
    /** Callback to update a persisted annotation */
    onUpdateAnnotation?: (messageId: string, annotationId: string, patch: Partial<AnnotationV1>) => void;
    /** Input send key behavior used by follow-up editor */
    sendMessageKey?: 'enter' | 'cmd-enter';
    /** Callback when follow-up is saved via "Save & Send" action */
    onSaveAndSendFollowUp?: (target: {
        messageId: string;
        annotationId: string;
        note: string;
        selectedText: string;
    }) => void;
    /** Whether there are active pending follow-up annotations in the session */
    hasActiveFollowUpAnnotations?: boolean;
    /** External request to open a specific annotation in the follow-up island */
    openAnnotationRequest?: OpenAnnotationRequest | null;
    /** Annotation interaction mode (viewer uses tooltip-only to suppress the island) */
    annotationInteractionMode?: AnnotationInteractionMode;
}
/**
 * Status icon for an activity - exported for reuse in inline execution.
 * Supports custom icons from skill/source metadata when completed.
 * Edit/Write tools show tool-specific icons; others show checkmark or custom icon.
 */
export declare function ActivityStatusIcon({ status, toolName, customIcon }: {
    status: ActivityStatus;
    toolName?: string;
    /** Custom icon from tool metadata - emoji or data URL (base64) */
    customIcon?: string;
}): React.JSX.Element;
export interface ResponseCardProps {
    /** The content to display (markdown) */
    text: string;
    /** Whether the content is still streaming */
    isStreaming: boolean;
    /** When streaming started - used for buffering timeout calculation */
    streamStartTime?: number;
    /** Callback to open file in editor */
    onOpenFile?: (path: string) => void;
    /** Callback to open URL */
    onOpenUrl?: (url: string) => void;
    /** Callback to open response in Monaco editor */
    onPopOut?: () => void;
    /** Card variant - 'response' for AI messages, 'plan' for plan messages */
    variant?: 'response' | 'plan';
    /** Parent session ID (used to reset local annotation/island UI state on session switches) */
    sessionId?: string;
    /** Underlying message ID for annotation actions */
    messageId?: string;
    /** Persisted annotations for this response */
    annotations?: AnnotationV1[];
    /** Callback when user accepts the plan (plan variant only) */
    onAccept?: () => void;
    /** Callback when user accepts the plan with compaction (compact first, then execute) */
    onAcceptWithCompact?: () => void;
    /** Whether this is the last response in the session (shows Accept Plan button only for last response) */
    isLastResponse?: boolean;
    /** Whether to show the Accept Plan button (default: true) */
    showAcceptPlan?: boolean;
    /** Hide footer for compact embedding (EditPopover) */
    compactMode?: boolean;
    /** Whether to show copy/fullscreen/branch actions for the final response */
    showResponseActions?: boolean;
    /** Whether to use the transparent final-response text chrome without implying actions */
    plainChrome?: boolean;
    /** Callback to branch the session from this response */
    onBranch?: (options?: {
        newPanel?: boolean;
    }) => void;
    /** Callback to add annotation from selected text */
    onAddAnnotation?: (messageId: string, annotation: AnnotationV1) => void;
    /** Callback to remove persisted annotation */
    onRemoveAnnotation?: (messageId: string, annotationId: string) => void;
    /** Callback to update persisted annotation */
    onUpdateAnnotation?: (messageId: string, annotationId: string, patch: Partial<AnnotationV1>) => void;
    /** Input send key behavior used by follow-up editor */
    sendMessageKey?: 'enter' | 'cmd-enter';
    /** Callback when follow-up is saved via "Save & Send" action */
    onSaveAndSendFollowUp?: (target: {
        messageId: string;
        annotationId: string;
        note: string;
        selectedText: string;
    }) => void;
    /** Whether there are active pending follow-up annotations in the session */
    hasActiveFollowUpAnnotations?: boolean;
    /** External request to open a specific annotation in this response */
    openAnnotationRequest?: OpenAnnotationRequest | null;
    /** Annotation interaction mode (viewer uses tooltip-only to suppress the island) */
    annotationInteractionMode?: AnnotationInteractionMode;
}
/**
 * ResponseCard - Unified card component for AI responses and plans
 *
 * Variants:
 * - 'response': Buffered streaming response with smart content gating
 * - 'plan': Plan message with header and Accept Plan button
 *
 * Response variant implements smart buffering:
 * - Waits for 40+ words with structure OR
 * - High-confidence patterns (code blocks, headers, lists) with lower threshold OR
 * - Timeout after 2.5 seconds
 *
 * Performance optimization: Uses throttled static snapshots instead of re-rendering
 * on every character. Content updates every 300ms during streaming, avoiding
 * expensive markdown parsing on every delta.
 */
export declare function ResponseCard({ text, isStreaming, streamStartTime, onOpenFile, onOpenUrl, onPopOut, variant, sessionId, messageId, annotations, onAccept, onAcceptWithCompact, isLastResponse, showAcceptPlan, compactMode, showResponseActions, plainChrome, onBranch, onAddAnnotation, onRemoveAnnotation, onUpdateAnnotation, sendMessageKey, onSaveAndSendFollowUp, hasActiveFollowUpAnnotations, openAnnotationRequest, annotationInteractionMode, }: ResponseCardProps): React.JSX.Element | null;
/**
 * TurnCard - Email-like display for one assistant turn
 *
 * Batches all activities (tools, thinking) into a collapsible section
 * with the final response displayed separately below.
 *
 * Memoized to prevent re-renders of completed turns during session switches.
 * Only complete, non-streaming turns are memoized - active turns always re-render.
 */
export declare const TurnCard: React.MemoExoticComponent<({ sessionId, turnId, activities, response, intent, isStreaming, isComplete, defaultExpanded, isExpanded: externalIsExpanded, onExpandedChange, expandedActivityGroups: externalExpandedActivityGroups, onExpandedActivityGroupsChange, onOpenFile, onOpenUrl, onPopOut, onOpenDetails, onOpenActivityDetails, onOpenMultiFileDiff, hasEditOrWriteActivities, todos, renderActionsMenu, onAcceptPlan, onAcceptPlanWithCompact, isLastResponse, sessionFolderPath, displayMode, animateResponse, compactMode, onBranch, onAddAnnotation, onRemoveAnnotation, onUpdateAnnotation, sendMessageKey, onSaveAndSendFollowUp, hasActiveFollowUpAnnotations, openAnnotationRequest, annotationInteractionMode, }: TurnCardProps) => React.JSX.Element | null>;
