import type { CommandInfo } from '../adapters/types';
import type { UseDaemonFollowupSuggestionReturn } from '@hoptrendy/webui/daemon-react-sdk';
import type { DaemonSessionGroupPresetColor, DaemonWorkspaceGitStatus } from '@hoptrendy/sdk/daemon';
import type { CommandDisplayCategoryOrder } from '../utils/commandDisplay';
import type { SkillInfo } from '../completions/slashCompletion';
import { type WebShellComposerInput, type WebShellComposerTagIconMap, type WebShellAtProvider, type WebShellBuiltinAtProvidersConfig } from '../customization';
import { type ComposerSubmitMetadata } from '../hooks/useComposerCore';
export type ComposerToolbarAction = 'approvalMode' | 'gitBranch' | 'model' | 'commands' | 'files' | 'widthMode' | 'voice' | 'workspace';
interface ChatEditorProps {
    onSubmit: (text: string, images?: import('../adapters/promptTypes').PromptImage[], commitAccepted?: import('../hooks/useComposerCore').ComposerSubmitCommit, metadata?: ComposerSubmitMetadata) => boolean | void;
    onInputTextChange?: (text: string) => void;
    onCycleMode?: () => void;
    onToggleShortcuts?: () => void;
    onCancel?: () => void;
    isRunning?: boolean;
    isPreparing?: boolean;
    /** First Esc armed a cancel — the send button shows an "Esc to stop" hint. */
    cancelArmed?: boolean;
    disabled?: boolean;
    placeholderText?: string;
    commands: CommandInfo[];
    skills?: SkillInfo[];
    slashCommandCategoryOrder?: CommandDisplayCategoryOrder;
    queuedMessages?: string[];
    onPopQueuedMessages?: () => boolean;
    onClearQueuedMessages?: () => boolean;
    currentMode?: string;
    currentModel?: string;
    gitBranch?: string;
    /** Enriched working-tree summary (dirty / ahead-behind / stash / operation). */
    gitStatus?: DaemonWorkspaceGitStatus;
    /** Opens the working-tree Changes dialog; makes the git chip clickable. */
    onOpenGitDiff?: () => void;
    /** Workspace name shown in the pane composer's `workspace` toolbar chip. */
    workspaceName?: string;
    /** Full workspace cwd, used as the chip's tooltip. */
    workspaceTitle?: string;
    /**
     * Stable per-workspace accent color for the chip, so it stays distinguishable
     * from other panes' chips even when it collapses to an icon on a narrow split.
     */
    workspaceColor?: DaemonSessionGroupPresetColor;
    chatWidthMode?: '1000' | 'wide';
    showChatWidthToggle?: boolean;
    chatWidthToggleMin?: number;
    visibleToolbarActions?: readonly ComposerToolbarAction[];
    availableModels?: Array<{
        id: string;
        label?: string;
    }>;
    onSelectMode?: (mode: string) => void;
    onSelectModel?: (model: string) => void;
    workspaces?: Array<{
        id: string;
        cwd: string;
        label: string;
        primary: boolean;
    }>;
    selectedWorkspaceCwd?: string;
    workspaceSelectionDisabled?: boolean;
    onSelectWorkspace?: (workspaceCwd: string | undefined) => void;
    atWorkspaceCwd?: string;
    onChatWidthModeChange?: (mode: '1000' | 'wide') => void;
    onFocusFooter?: () => boolean;
    dialogOpen?: boolean;
    followupState?: UseDaemonFollowupSuggestionReturn['followupState'];
    onAcceptFollowup?: UseDaemonFollowupSuggestionReturn['onAcceptFollowup'];
    onDismissFollowup?: UseDaemonFollowupSuggestionReturn['onDismissFollowup'];
    sessionName?: string;
    composerInput?: WebShellComposerInput;
    composerInputVersion?: number;
    builtinAtProviders?: WebShellBuiltinAtProvidersConfig;
    atProviders?: readonly WebShellAtProvider[];
    composerTagIcons?: WebShellComposerTagIconMap;
}
export declare const ChatEditor: import("react").NamedExoticComponent<ChatEditorProps & import("react").RefAttributes<EditorHandle>>;
export {};
