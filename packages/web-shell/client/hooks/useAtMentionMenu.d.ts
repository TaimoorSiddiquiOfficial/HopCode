import type { RefObject, ReactNode } from 'react';
import type { StateEffect } from '@codemirror/state';
import type { EditorView } from '@codemirror/view';
import type { WebShellAtItem, WebShellAtProvider, WebShellAtProviderTab, WebShellBuiltinAtProvidersConfig, WebShellComposerTag } from '../customization';
export interface AtMentionProviderView {
    id: string;
    provider: WebShellAtProvider;
    label: ReactNode;
    textValue: string;
    description?: string;
    tabs?: readonly WebShellAtProviderTab[];
    selectedTabId?: string;
    renderItem?: WebShellAtProvider['renderItem'];
}
export interface AtMentionItem extends WebShellAtItem {
    kind?: 'insert' | 'directory' | 'mcp-server';
    targetPath?: string;
    serverName?: string;
}
export interface AtMentionMenuState {
    from: number;
    to: number;
    query: string;
    level: 'categories' | 'items';
    selectedProviderId?: string;
    selectedIndex: number;
    providers: AtMentionProviderView[];
    items: AtMentionItem[];
    loading: boolean;
    itemMode?: 'default' | 'mcpServers' | 'mcpResources';
    mcpServerName?: string;
    fileDirectory?: string;
    inputMode?: 'search' | 'context';
    validateMcpServer?: boolean;
    tabs?: readonly WebShellAtProviderTab[];
    selectedTabId?: string;
}
type GlobWorkspaceFn = (pattern: string, opts?: {
    maxResults?: number;
    signal?: AbortSignal;
}) => Promise<{
    matches: string[];
}>;
interface ExtensionEntry {
    name: string;
    displayName?: string;
    description?: string;
    isActive: boolean;
}
type LoadExtensionsStatusFn = () => Promise<{
    extensions: ExtensionEntry[];
}>;
interface DirectoryEntry {
    name: string;
    kind: 'file' | 'directory' | 'symlink' | 'other';
    ignored: boolean;
}
type ListDirectoryFn = (dirPath: string, options?: {
    signal?: AbortSignal;
}) => Promise<{
    kind: 'list';
    path: string;
    entries: DirectoryEntry[];
    truncated: boolean;
}>;
interface McpServerEntry {
    kind: 'mcp_server';
    name: string;
    disabled: boolean;
    mcpStatus?: string;
    resourceCount?: number;
    description?: string;
}
type LoadMcpStatusFn = () => Promise<{
    servers: McpServerEntry[];
}>;
type LoadMcpResourcesFn = (serverName: string, options?: {
    signal?: AbortSignal;
}) => Promise<{
    resources: Array<{
        uri: string;
        name?: string;
        title?: string;
        description?: string;
        mimeType?: string;
        size?: number;
    }>;
}>;
export interface AtMentionWorkspaceActions {
    globWorkspace?: GlobWorkspaceFn;
    loadExtensionsStatus?: LoadExtensionsStatusFn;
    listDirectory?: ListDirectoryFn;
    loadMcpStatus?: LoadMcpStatusFn;
    loadMcpResources?: LoadMcpResourcesFn;
}
export interface UseAtMentionMenuOptions {
    viewRef: RefObject<EditorView | null>;
    disabledRef: RefObject<boolean>;
    shellModeRef: RefObject<boolean>;
    workspaceActionsRef: RefObject<AtMentionWorkspaceActions | undefined>;
    workspaceKey?: string;
    builtinProviders?: WebShellBuiltinAtProvidersConfig;
    providers?: readonly WebShellAtProvider[];
    createInlineTagEffect?: (range: {
        from: number;
        to: number;
        tag: WebShellComposerTag;
    }) => StateEffect<unknown>;
}
export declare const FILE_PROVIDER_ID = "files";
export declare const MCP_RESOURCES_PROVIDER_ID = "mcp-resources";
export declare function sanitizeDisplayText(raw: string): string | undefined;
export declare function useAtMentionMenu({ viewRef, disabledRef, shellModeRef, workspaceActionsRef, workspaceKey, builtinProviders, providers, createInlineTagEffect, }: UseAtMentionMenuOptions): {
    state: AtMentionMenuState | null;
    close: (options?: {
        preserveProviderSelection?: boolean;
    }) => void;
    closeIfOpen: () => false | "closed" | "categories";
    refreshForView: (view: EditorView | null) => boolean;
    moveSelection: (direction: "up" | "down") => boolean;
    select: (index: number) => boolean;
    accept: (index?: number) => boolean;
    enterCategory: (index?: number) => boolean;
    selectTab: (tabId: string) => boolean;
    backToCategories: () => false | "items" | "categories";
    updateSearch: (query: string) => boolean;
};
export {};
