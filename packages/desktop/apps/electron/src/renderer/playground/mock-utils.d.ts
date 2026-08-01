import type { FileAttachment, LoadedSource, PermissionMode, MessagingPlatformRuntimeInfo, WhatsAppUiEvent } from '../../shared/types';
import type { MessagingBinding } from '../atoms/messaging';
type PlatformStatusListener = (workspaceId: string, platform: string, status: MessagingPlatformRuntimeInfo) => void;
type BindingListener = (workspaceId: string) => void;
type WhatsAppEventListener = (payload: {
    workspaceId: string;
    event: WhatsAppUiEvent;
}) => void;
interface MessagingMockState {
    runtime: {
        telegram: MessagingPlatformRuntimeInfo;
        whatsapp: MessagingPlatformRuntimeInfo;
    };
    bindings: MessagingBinding[];
    platformStatusListeners: Set<PlatformStatusListener>;
    bindingListeners: Set<BindingListener>;
    waEventListeners: Set<WhatsAppEventListener>;
}
export interface PlaygroundMessagingHandle {
    /** Snapshot of current state (for debugging from DevTools). */
    state: MessagingMockState;
    setTelegramConnected: (connected: boolean, identity?: string) => void;
    setWhatsAppConnected: (connected: boolean, identity?: string) => void;
    setBindings: (bindings: MessagingBinding[]) => void;
    fireWAEvent: (event: WhatsAppUiEvent) => void;
    reset: () => void;
}
export declare const playgroundMessagingHandle: PlaygroundMessagingHandle;
export declare const mockElectronAPI: {
    isDebugMode: () => Promise<boolean>;
    getRuntimeEnvironment: () => "electron" | "web";
    openFileDialog: () => Promise<never[]>;
    readFileAttachment: (path: string) => Promise<null>;
    generateThumbnail: (base64: string, mimeType: string) => Promise<null>;
    openFolderDialog: () => Promise<null>;
    getTaskOutput: (taskId: string) => Promise<string>;
    getSessionFiles: (sessionId: string) => Promise<never[]>;
    watchSessionFiles: (sessionId: string) => void;
    unwatchSessionFiles: () => void;
    onSessionFilesChanged: (callback: (sessionId: string) => void) => () => void;
    onSessionsChanged: (callback: (workspaceId: string) => void) => () => void;
    onSessionListRefreshStateChanged: (callback: (workspaceId: string, isRefreshing: boolean) => void) => () => void;
    browserPane: {
        focus: (instanceId: string) => Promise<void>;
    };
    openFile: (path: string) => Promise<void>;
    showInFolder: (path: string) => Promise<void>;
    readPreferences: () => Promise<{
        diffViewerSettings: {
            showFilePath: boolean;
            expandedSections: {};
        };
    }>;
    writePreferences: (prefs: unknown) => Promise<void>;
    getAutoCapitalisation: () => Promise<boolean>;
    getPendingPlanExecution: (sessionId: string) => Promise<null>;
    getSendMessageKey: () => Promise<string>;
    getSpellCheck: () => Promise<boolean>;
    getMessagingConfig: () => Promise<{
        enabled: boolean;
        platforms: {
            telegram: {
                enabled: boolean;
            };
            whatsapp: {
                enabled: boolean;
            };
        };
        runtime: {
            telegram: MessagingPlatformRuntimeInfo;
            whatsapp: MessagingPlatformRuntimeInfo;
        };
    }>;
    updateMessagingConfig: (config: Record<string, unknown>) => Promise<void>;
    testTelegramToken: (token: string) => Promise<{
        success: boolean;
        botName: string;
        botUsername: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        botName?: undefined;
        botUsername?: undefined;
    }>;
    saveTelegramToken: (token: string) => Promise<void>;
    disconnectMessagingPlatform: (platform: string) => Promise<void>;
    forgetMessagingPlatform: (platform: string) => Promise<void>;
    getMessagingBindings: () => Promise<MessagingBinding[]>;
    generateMessagingPairingCode: (sessionId: string, platform: string) => Promise<{
        code: string;
        expiresAt: number;
        botUsername: string | undefined;
    }>;
    unbindMessagingSession: (sessionId: string, platform?: string) => Promise<void>;
    unbindMessagingBinding: (bindingId: string) => Promise<{
        success: boolean;
    }>;
    onMessagingBindingChanged: (callback: (workspaceId: string) => void) => () => void;
    onMessagingPlatformStatus: (callback: (workspaceId: string, platform: string, status: MessagingPlatformRuntimeInfo) => void) => () => void;
    startWhatsAppConnect: () => Promise<{
        success: boolean;
    }>;
    submitWhatsAppPhone: (phoneNumber: string) => Promise<{
        success: boolean;
    }>;
    onWhatsAppEvent: (callback: (payload: {
        workspaceId: string;
        event: WhatsAppUiEvent;
    }) => void) => () => void;
};
/**
 * Inject mock electronAPI into window if not already present.
 * Call this in playground component wrappers before rendering components
 * that depend on electronAPI.
 *
 * IMPORTANT: this also runs as a top-level side effect when this module is
 * imported (see below), so that consumers relying on a synchronous
 * `window.electronAPI.*` read at module-load time (e.g.
 * `SessionFilesSection.tsx`'s top-level `getRuntimeEnvironment()` call) see
 * the mock before their module is evaluated. The entry `playground.tsx`
 * must import this module before any component chain that touches
 * `window.electronAPI` at import time.
 */
export declare function ensureMockElectronAPI(): void;
export declare const mockSources: LoadedSource[];
export declare const sampleImageAttachment: FileAttachment;
export declare const samplePdfAttachment: FileAttachment;
export declare const mockInputCallbacks: {
    onSubmit: (message: string, attachments?: FileAttachment[]) => void;
    onModelChange: (model: string) => void;
    onInputChange: (value: string) => void;
    onHeightChange: (height: number) => void;
    onFocusChange: (focused: boolean) => void;
    onPermissionModeChange: (mode: PermissionMode) => void;
    onSourcesChange: (slugs: string[]) => void;
    onWorkingDirectoryChange: (path: string) => void;
    onStop: () => void;
};
export declare const mockAttachmentCallbacks: {
    onRemove: (index: number) => void;
    onOpenFile: (path: string) => void;
};
export declare const mockBackgroundTaskCallbacks: {
    onKillTask: (taskId: string) => void;
};
export {};
