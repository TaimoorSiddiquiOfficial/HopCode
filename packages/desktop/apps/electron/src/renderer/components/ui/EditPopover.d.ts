/**
 * EditPopover
 *
 * A popover with title, subtitle, and multiline textarea for editing settings.
 * Supports two modes:
 * - Legacy: Opens a new focused window with a chat session
 * - Inline: Executes mini agent inline within the popover using compact ChatDisplay
 */
import * as React from 'react';
import type { ContentBadge, CreateSessionOptions } from '../../../shared/types';
/**
 * Context passed to the new chat session so the agent knows exactly
 * what is being edited and can execute quickly.
 *
 * Simplified structure: label for display, filePath for the agent to know
 * where to edit, and optional context for additional instructions.
 */
export interface EditContext {
    /** Human-readable label for badge display and agent context (e.g., "Permissions") */
    label: string;
    /** Absolute path to the file being edited */
    filePath: string;
    /** Optional additional context/instructions for the agent */
    context?: string;
}
/** Available edit context keys - add new ones here */
export type EditContextKey = 'workspace-permissions' | 'default-permissions' | 'skill-instructions' | 'skill-metadata' | 'source-guide' | 'source-config' | 'source-permissions' | 'source-tool-permissions' | 'preferences-notes' | 'add-source' | 'add-source-api' | 'add-source-mcp' | 'add-source-local' | 'add-skill' | 'edit-statuses' | 'edit-labels' | 'edit-auto-rules' | 'add-label' | 'edit-views' | 'edit-tool-icons' | 'automation-config';
/**
 * Full edit configuration including context for agent and example for UI.
 * Returned by getEditConfig() for use in EditPopover.
 */
export interface EditConfig {
    /** Context passed to the agent */
    context: EditContext;
    /** Example text shown in the popover placeholder */
    example: string;
    /** Optional custom placeholder text - overrides the default "Describe what you'd like to change" */
    overridePlaceholder?: string;
    /** Translated display label for UI (resolved from displayLabelKey, falls back to context.label) */
    displayLabel?: string;
    /** i18n key for the display label (translated for UI, keeps context.label in English for agent) */
    displayLabelKey?: string;
    /** i18n key for the example text */
    exampleKey?: string;
    /** i18n key for overridePlaceholder */
    overridePlaceholderKey?: string;
    /** Model tier hint: 'fast' uses the connection's mini model, 'default' uses the primary model */
    model?: 'fast' | 'default';
    /** Optional system prompt preset for mini agent (e.g., 'mini' for focused edits) */
    systemPromptPreset?: 'default' | 'mini';
    /** When true, executes inline within the popover instead of opening a new window */
    inlineExecution?: boolean;
}
/**
 * Get full edit config by key. Returns both context (for agent) and example (for UI).
 *
 * @param key - The edit context key
 * @param location - Base path (e.g., workspace root path)
 *
 * @example
 * const { context, example } = getEditConfig('workspace-permissions', workspace.rootPath)
 */
export declare function getEditConfig(key: EditContextKey, location: string): EditConfig;
/**
 * Optional secondary action button displayed on the left side of the popover footer.
 * Styled as plain text with underline on hover - typically used for "Edit File" actions.
 */
export interface SecondaryAction {
    /** Button label (e.g., "Edit File") */
    label: string;
    /** File path to open directly in the system editor (bypasses link interceptor) */
    filePath: string;
}
export interface EditPopoverProps {
    /** Trigger element that opens the popover */
    trigger: React.ReactNode;
    /** Example text shown in placeholder (e.g., "Allow 'make build' command") */
    example?: string;
    /** Context passed to the new chat session */
    context: EditContext;
    /** Permission mode for the new session (default: 'allow-all' / canonical: execute for fast execution) */
    permissionMode?: CreateSessionOptions['permissionMode'];
    /**
     * Working directory for the new session:
     * - 'none' (default): No working directory (session folder only) - best for config edits
     * - 'user_default': Use workspace's configured default
     * - Absolute path string: Use this specific path
     */
    workingDirectory?: string | 'user_default' | 'none';
    /** Model tier hint: 'fast' uses the connection's mini model, 'default' uses the primary model */
    model?: 'fast' | 'default';
    /** System prompt preset for mini agent (e.g., 'mini' for focused edits) */
    systemPromptPreset?: 'default' | 'mini';
    /** Width of the popover (default: 320) */
    width?: number;
    /** Additional className for the trigger */
    triggerClassName?: string;
    /** Side of the popover relative to trigger */
    side?: 'top' | 'right' | 'bottom' | 'left';
    /** Alignment of the popover */
    align?: 'start' | 'center' | 'end';
    /** Optional secondary action button on the left (e.g., "Edit File") */
    secondaryAction?: SecondaryAction;
    /** Optional custom placeholder - overrides the default "Describe what you'd like to change" */
    overridePlaceholder?: string;
    /** Translated display label for badges and empty state (falls back to context.label) */
    displayLabel?: string;
    /**
     * Controlled open state - when provided, the popover becomes controlled.
     * Use this when opening the popover programmatically (e.g., from context menus).
     */
    open?: boolean;
    /** Callback when open state changes (for controlled mode) */
    onOpenChange?: (open: boolean) => void;
    /**
     * When true, prevents the popover from closing when clicking outside.
     * Useful for context menu triggered popovers where focus management is tricky.
     */
    modal?: boolean;
    /**
     * Default value to pre-fill the input with.
     * Useful when the user types something (e.g., "#Test") and clicks "Add new label" -
     * the input can be pre-filled with "Add new label Test".
     */
    defaultValue?: string;
    /**
     * When true, executes the mini agent inline within the popover instead of
     * opening a new window. Best for quick config edits with mini agents.
     */
    inlineExecution?: boolean;
}
/**
 * Result from buildEditPrompt containing both the full prompt and badge metadata
 * for hiding the XML context in the UI while keeping it in the actual message.
 */
interface EditPromptResult {
    /** Full prompt including XML metadata and user instructions */
    prompt: string;
    /** Badge marking the hidden metadata section */
    badges: ContentBadge[];
}
/**
 * Build the prompt that will be sent to the agent.
 * Uses XML-like tags for clear structure.
 *
 * Returns both the prompt and a context badge that marks the metadata section
 * so it can be hidden in the UI while still being sent to the agent.
 *
 * @param context - The edit context with label, filePath, and optional context
 * @param userInstructions - User's instructions (can be empty string for pre-filled context only)
 *
 * @example
 * // With user instructions (for EditPopover submit)
 * const { prompt, badges } = buildEditPrompt(context, "Add a Blocked status")
 *
 * // Without user instructions (for context menu - opens window with context pre-filled)
 * const { prompt, badges } = buildEditPrompt(context, "")
 */
export declare function buildEditPrompt(context: EditContext, userInstructions: string, displayLabel?: string): EditPromptResult;
export declare function EditPopover({ trigger, example, context, permissionMode, workingDirectory, // Default to session folder for config edits
model, systemPromptPreset, width, // Default 400px for compact chat embedding
triggerClassName, side, align, secondaryAction: _secondaryAction, overridePlaceholder, displayLabel, open: controlledOpen, onOpenChange: controlledOnOpenChange, modal, defaultValue: _defaultValue, inlineExecution, }: EditPopoverProps): React.JSX.Element;
/**
 * Standard Edit button styled for use with EditPopover.
 * Use this as the trigger prop for consistent styling across the app.
 *
 * Uses forwardRef to properly work with Radix's asChild pattern,
 * which requires the child to accept ref and spread props.
 *
 * @example
 * <EditPopover
 *   trigger={<EditButton />}
 *   context={getEditContext('workspace-permissions', { workspacePath })}
 * />
 */
export declare const EditButton: React.ForwardRefExoticComponent<any>;
export {};
