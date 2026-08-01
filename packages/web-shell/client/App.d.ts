import { type DaemonStreamingState } from '@hoptrendy/webui/daemon-react-sdk';
import type { DaemonTranscriptBlock, DaemonWorkspaceCapability } from '@hoptrendy/sdk/daemon';
import { type ComposerToolbarAction } from './components/ChatEditor';
import { type ToastTone } from './components/ToastHost';
import type { TurnOutputKind, TurnOutputOpenRequest } from './components/artifacts/TurnOutputs';
import { type WebShellSidebarBranding, type WebShellSidebarFooterOptions, type WebShellSidebarLockedWorkspace } from './components/sidebar/WebShellSidebar';
import { type WebShellLanguage } from './i18n';
import { type ComposerPlaceholderState } from './utils/composerInputState';
import { type WebShellTheme } from './themeContext';
import { type WebShellComposerApi, type WebShellComposerInput, type WebShellMarkdownCustomization, type ToolHeaderExtraRenderer, type UserMessageContentRenderer, type UserMessageContentParser, type AssistantTurnFooterRenderer, type WelcomeHeaderRenderer, type WelcomeFooterRenderer, type ComposerToolbarStartRenderer, type ComposerToolbarEndRenderer, type ComposerToolbarRightRenderer, type ComposerHeaderRenderer, type FooterRenderer, type LoadingPhrasesResolver, type MarkdownTableMode, type WebShellAtProvider, type WebShellBuiltinAtProvidersConfig, type ComposerTagClickHandler, type ComposerTagRenderer, type WebShellComposerTagIconMap, type WebShellBottomStatusItem } from './customization';
import type { CommandDisplayCategoryOrder } from './utils/commandDisplay';
import './styles/globals.css';
export declare const CompactModeContext: import("react").Context<boolean>;
/**
 * Per-snapshot status diffs (keyed by tool callId or plan message id), so a
 * history row can render what changed in that snapshot without re-deriving it
 * from the whole transcript. Empty by default so a row rendered outside the
 * provider still falls back gracefully.
 */
export declare const TodoTimelineContext: import("react").Context<Map<string, TodoSnapshotDiff>>;
/**
 * Per-todo timing and resource detail keyed by todoStateKey, consumed by the
 * expanded todo list so a finished task can reveal when it ran and what it
 * spent. Empty by default so a row rendered outside the provider (or in tests)
 * simply shows no expander.
 */
export declare const TodoDetailContext: import("react").Context<Map<string, TodoDetail>>;
export interface BugReportInfo {
    title: string;
    systemInfo: Record<string, string>;
}
export interface WebShellSidebarOptions {
    enabled?: boolean;
    defaultCollapsed?: boolean;
    /** Whether to show WebShell's built-in compact drawer toggle. Defaults to true. */
    showCompactToggle?: boolean;
    /** Hide or replace the complete sidebar branding row. */
    branding?: false | WebShellSidebarBranding;
    /** Hide the footer completely or select the built-in entries it exposes. */
    footer?: false | WebShellSidebarFooterOptions;
    /** Customize the workspace row shown when lockWorkspaceCwd is active. */
    lockedWorkspace?: WebShellSidebarLockedWorkspace;
}
export type SessionChangeEvent = {
    type: 'rename';
    sessionId: string;
    newName: string;
} | {
    type: 'submit';
    sessionId: string;
    prompt: string;
    queued: boolean;
} | {
    type: 'turn_complete';
    sessionId: string;
    error?: Error;
};
export interface WebShellApi {
    /** Open the in-window split view, matching the built-in sidebar button. */
    openSplitView: () => void;
    /** Open the Session Overview panel, matching the built-in sidebar button. */
    openSessionOverview: () => void;
    /** Open the compact session drawer, matching the hamburger control. */
    openSessionDrawer: () => void;
    /** Start a new session using the same lifecycle as the built-in New Chat action. */
    createNewSession: () => Promise<boolean>;
}
export type WebShellComposerPlaceholderState = ComposerPlaceholderState;
export type WebShellComposerPlaceholders = Readonly<Partial<Record<WebShellComposerPlaceholderState, string>>>;
export interface WebShellProps {
    /** Called whenever the attached daemon session or workspace changes. */
    onSessionIdChange?: (sessionId: string | undefined, workspaceId?: string, workspaceCwd?: string) => void;
    /** Called after a new session is created. Session setup waits up to 30 seconds. */
    onSessionCreated?: (sessionId: string) => Promise<void> | void;
    /** Visual theme for the embedded shell. */
    theme?: WebShellTheme;
    /** Called when `/theme` changes the web-shell theme. */
    onThemeChange?: (theme: WebShellTheme) => void;
    /** UI language for the web-shell. Defaults to `?language=` or browser language. */
    language?: 'en' | 'zh-CN' | 'zh' | 'zh-cn';
    /** Called when `/language ui` changes the web-shell UI language. */
    onLanguageChange?: (language: WebShellLanguage) => void;
    /** Additional CSS class name appended to the root element. */
    className?: string;
    /** Inline styles applied to the root element. */
    style?: React.CSSProperties;
    /** Maximum chat content width in regular mode. Defaults to 1000px. */
    chatMaxWidth?: number;
    /** Optional workspace sidebar. Disabled by default. */
    sidebar?: boolean | WebShellSidebarOptions;
    /** Session ids to control the split view; an empty array closes it. */
    splitSessionIds?: readonly string[];
    /** Called when the split pane list changes from inside WebShell. */
    onSplitSessionIdsChange?: (sessionIds: string[]) => void;
    /**
     * Called instead of the built-in right panel open behavior when a user clicks
     * a turn output such as review changes, an artifact, or a scheduled task.
     */
    onRightPanelOpen?: (request: TurnOutputOpenRequest) => void;
    /**
     * Controls which turn output cards appear below messages. Defaults to all.
     */
    messageTurnOutputs?: readonly TurnOutputKind[];
    /** Imperative handle for externally opening WebShell surfaces. */
    shellRef?: React.Ref<WebShellApi>;
    /** Built-in composer toolbar actions to show. Defaults to all actions. */
    composerToolbarActions?: readonly ComposerToolbarAction[];
    /**
     * Main-composer copy by semantic state. Omitted or blank entries retain the
     * WebShell localized default; shell-mode and follow-up copy still wins.
     */
    composerPlaceholders?: WebShellComposerPlaceholders;
    /** Called when connection status changes (idle/connecting/connected/disconnected/error). */
    onConnectionChange?: (status: string) => void;
    /** Called when prompt status changes (idle/waiting/responding). */
    onStreamingStateChange?: (state: DaemonStreamingState) => void;
    /**
     * Called whenever transcript blocks change. Receives the full blocks array
     * from useTranscriptBlocks(). Fires on every streaming delta during active
     * generation, so consumers should debounce or throttle expensive work.
     */
    onTranscriptChange?: (blocks: readonly DaemonTranscriptBlock[]) => void;
    /** Called when a critical error occurs (auth failure, session gone, etc). */
    onError?: (error: Error) => void;
    /** Called when `/bug` is invoked. Receives system info. If omitted, web-shell opens the report URL itself. */
    onBugReport?: (info: BugReportInfo) => void;
    /** Slash command names to hide from completion/help, for example `['approval-mode']`. */
    hiddenSlashCommands?: string[];
    /** Slash command category order. Defaults to custom, skill, system. */
    slashCommandCategoryOrder?: CommandDisplayCategoryOrder;
    /** Built-in @ mention providers to enable. Defaults to all built-ins. */
    builtinAtProviders?: WebShellBuiltinAtProvidersConfig;
    /** Additional @ mention categories shown alongside built-in files/extensions. */
    atProviders?: readonly WebShellAtProvider[];
    /** Icon URLs for custom composer tag kinds used by @ mention chips. */
    composerTagIcons?: WebShellComposerTagIconMap;
    /** Custom renderer for the tool-card header content after the status icon and tool name. */
    renderToolHeaderExtra?: ToolHeaderExtraRenderer;
    /** Custom renderer for the welcome header. Receives version, cwd, model, and mode. */
    renderWelcomeHeader?: WelcomeHeaderRenderer;
    /** Custom renderer shown below the chat composer in the empty welcome state. */
    renderWelcomeFooter?: WelcomeFooterRenderer;
    /**
     * Show renderWelcomeFooter between the welcome header and composer on
     * mobile empty state. Requires renderWelcomeFooter to be provided for the
     * mobile CSS reordering to take effect.
     */
    mobileWelcomeFooterMiddle?: boolean;
    /** Parse user-message text into display parts such as chips. */
    parseUserMessageContent?: UserMessageContentParser;
    /** Custom renderer for the inside of user chat bubbles. Defaults to plain text. */
    renderUserMessageContent?: UserMessageContentRenderer;
    /** Custom renderer for composer and user-message tags. */
    renderComposerTag?: ComposerTagRenderer;
    /** Custom hover content for composer and user-message tags. */
    renderComposerTagTooltip?: ComposerTagRenderer;
    /** Click handler for composer and user-message tags. */
    onComposerTagClick?: ComposerTagClickHandler;
    /** Custom renderer displayed after the final assistant message of each turn. */
    renderAssistantTurnFooter?: AssistantTurnFooterRenderer;
    /** Custom renderer inserted before the built-in chat composer toolbar controls. */
    renderComposerToolbarStart?: ComposerToolbarStartRenderer;
    /** Custom renderer inserted after the built-in composer toolbar controls. */
    renderComposerToolbarEnd?: ComposerToolbarEndRenderer;
    /** Custom renderer inserted into the composer toolbar's right-side action area. */
    renderComposerToolbarRight?: ComposerToolbarRightRenderer;
    /** Custom renderer shown directly above the chat composer input. */
    renderComposerHeader?: ComposerHeaderRenderer;
    /** Custom component for the footer area below the Editor. Replaces the built-in StatusBar. */
    renderFooter?: FooterRenderer;
    /** Extra status items shown in the floating bottom panel beside the TODO summary. */
    bottomStatusItems?: readonly WebShellBottomStatusItem[];
    /** Collapse thinking blocks to 5 lines with a click-to-expand toggle. */
    compactThinking?: boolean;
    /** Auto-collapse completed turns to just the prompt and final answer, with a per-turn toggle. Defaults to true. */
    collapseCompletedTurns?: boolean;
    /** Markdown table rendering mode. Defaults to basic. */
    markdownTableMode?: MarkdownTableMode;
    /** Enable virtual scrolling only when rendered transcript rows exceed this threshold. Defaults to 200. */
    virtualScrollThreshold?: number;
    /** Custom Markdown behavior for assistant content only. */
    markdown?: WebShellMarkdownCustomization;
    /**
     * Override the witty phrases cycled while a prompt is streaming. Receives the
     * resolved UI language; return phrases to replace the built-in defaults, an
     * empty array to hide the phrase, or `undefined`/`null` to keep the defaults.
     */
    loadingPhrases?: LoadingPhrasesResolver;
    /** When provided, all toast notifications are forwarded to this callback and the built-in ToastHost is hidden. */
    onToast?: (tone: ToastTone, message: string) => void;
    /** Imperative handle for externally controlling the composer input. */
    composerRef?: React.Ref<WebShellComposerApi>;
    /** Called once the real composer API is mounted and safe to call. */
    onComposerReady?: (api: WebShellComposerApi) => void;
    /** Declarative composer input value. Increment composerInputVersion to replay the same value. */
    composerInput?: WebShellComposerInput;
    /** Replay key for composerInput. */
    composerInputVersion?: number;
    /** Called when a session-level event occurs (rename, submit, turn complete). */
    onSessionChange?: (event: SessionChangeEvent) => void;
    /**
     * Called before a prompt is submitted. Return a Promise — the prompt is held
     * until the Promise resolves. If the Promise rejects, the prompt is cancelled.
     * `sessionId` is `undefined` when the session has not yet been created (deferred).
     * Also called for queued prompts (submitted while a turn is streaming).
     */
    onSubmitBefore?: (params: {
        sessionId: string | undefined;
        prompt: string;
    }) => Promise<void>;
}
interface AppProps extends WebShellProps {
    lockedWorkspaceCwd?: string;
    lockedWorkspaceCapability?: DaemonWorkspaceCapability;
    restartSseOnPrompt?: boolean;
}
export declare function App({ onSessionIdChange, onSessionCreated, theme: providedTheme, onThemeChange, language: providedLanguage, onLanguageChange, className: externalClassName, style: externalStyle, onConnectionChange, onStreamingStateChange, onError, onBugReport, hiddenSlashCommands, slashCommandCategoryOrder, builtinAtProviders, atProviders, composerTagIcons, renderToolHeaderExtra, renderWelcomeHeader, renderWelcomeFooter, mobileWelcomeFooterMiddle, parseUserMessageContent, renderUserMessageContent, renderComposerTag, renderComposerTagTooltip, onComposerTagClick, renderAssistantTurnFooter, renderComposerToolbarStart, renderComposerToolbarEnd, renderComposerToolbarRight, renderComposerHeader, renderFooter, bottomStatusItems, chatMaxWidth, sidebar, splitSessionIds: externalSplitSessionIds, onSplitSessionIdsChange, onRightPanelOpen, messageTurnOutputs, shellRef, composerToolbarActions, composerPlaceholders, compactThinking, collapseCompletedTurns, markdownTableMode, virtualScrollThreshold, markdown, loadingPhrases, onTranscriptChange, onToast, composerRef, onComposerReady, composerInput, composerInputVersion, onSessionChange, onSubmitBefore, restartSseOnPrompt, lockedWorkspaceCwd, lockedWorkspaceCapability, }?: AppProps): import("react").JSX.Element;
export {};
