import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Loader2, Plus, RefreshCw, Save, Settings2, Trash2, } from 'lucide-react';
import { toast } from 'sonner';
import { PanelHeader } from '@/components/app-shell/PanelHeader';
import { HeaderMenu } from '@/components/ui/HeaderMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SettingsCard, SettingsInput, SettingsSection, SettingsSelect, SettingsTextarea, SettingsToggle, } from '@/components/settings';
import { routes } from '@/lib/navigate';
import { normalizehopcodeSettingsSnapshot } from '@/lib/hopcode-settings-snapshot';
const PAGE_COPY = {
    general: {
        titleKey: 'settings.general.title',
        descriptionKey: 'settings.general.description',
        slug: 'general',
    },
    mcpServers: {
        titleKey: 'settings.mcpServers.title',
        descriptionKey: 'settings.mcpServers.description',
        slug: 'mcpServers',
    },
    hooks: {
        titleKey: 'settings.hooks.title',
        descriptionKey: 'settings.hooks.description',
        slug: 'hooks',
    },
    extensions: {
        titleKey: 'settings.extensions.title',
        descriptionKey: 'settings.extensions.description',
        slug: 'extensions',
    },
};
const TRANSPORT_OPTIONS = [
    { value: 'http', label: 'HTTP' },
    { value: 'stdio', label: 'Stdio' },
    { value: 'sse', label: 'SSE' },
];
const HOOK_EVENTS = [
    'PreToolUse',
    'PostToolUse',
    'PostToolUseFailure',
    'PermissionRequest',
    'UserPromptSubmit',
    'SessionStart',
    'SessionEnd',
    'Stop',
    'Notification',
    'PreCompact',
    'SubagentStart',
    'SubagentStop',
];
const HOOK_EVENT_OPTIONS = HOOK_EVENTS.map((event) => ({
    value: event,
    label: event,
}));
function createMeta(slug) {
    return { navigator: 'settings', slug };
}
export const generalMeta = createMeta('general');
export const mcpServersMeta = createMeta('mcpServers');
export const hooksMeta = createMeta('hooks');
export const extensionsMeta = createMeta('extensions');
function valueOf(snapshot, key, fallback) {
    return snapshot?.merged.values[key] ?? fallback;
}
function boolValue(snapshot, key, fallback) {
    const value = valueOf(snapshot, key, fallback);
    return typeof value === 'boolean' ? value : fallback;
}
function stringValue(snapshot, key, fallback = '') {
    const value = valueOf(snapshot, key, fallback);
    return typeof value === 'string' ? value : fallback;
}
function parseLines(value) {
    const lines = value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    return lines.length > 0 ? lines : undefined;
}
function stringifyLines(value) {
    return value?.join('\n') ?? '';
}
function parseKeyValueLines(value) {
    const result = {};
    for (const line of value.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed)
            continue;
        const index = trimmed.indexOf('=');
        if (index <= 0)
            continue;
        const key = trimmed.slice(0, index).trim();
        const item = trimmed.slice(index + 1).trim();
        if (key)
            result[key] = item;
    }
    return Object.keys(result).length > 0 ? result : undefined;
}
function stringifyKeyValueLines(value) {
    return Object.entries(value ?? {})
        .map(([key, item]) => `${key}=${item}`)
        .join('\n');
}
function createEmptyMcpDraft() {
    return {
        scope: 'user',
        name: '',
        transport: 'http',
        commandOrUrl: '',
        args: '',
        cwd: '',
        env: '',
        headers: '',
        timeout: '',
        trust: false,
        description: '',
        includeTools: '',
        excludeTools: '',
    };
}
function serverToDraft(entry) {
    const { server } = entry;
    return {
        scope: entry.scope === 'workspace' ? 'workspace' : 'user',
        name: entry.name,
        transport: server.transport,
        commandOrUrl: server.transport === 'stdio'
            ? (server.command ?? '')
            : server.transport === 'http'
                ? (server.httpUrl ?? '')
                : (server.url ?? ''),
        args: stringifyLines(server.args),
        cwd: server.cwd ?? '',
        env: stringifyKeyValueLines(server.env),
        headers: stringifyKeyValueLines(server.headers),
        timeout: server.timeout === undefined ? '' : String(server.timeout),
        trust: server.trust ?? false,
        description: server.description ?? '',
        includeTools: stringifyLines(server.includeTools),
        excludeTools: stringifyLines(server.excludeTools),
    };
}
function draftToServer(draft) {
    const timeout = draft.timeout.trim()
        ? Number(draft.timeout.trim())
        : undefined;
    const base = {
        transport: draft.transport,
        timeout,
        trust: draft.trust,
        description: draft.description.trim() || undefined,
        includeTools: parseLines(draft.includeTools),
        excludeTools: parseLines(draft.excludeTools),
    };
    if (draft.transport === 'stdio') {
        return {
            ...base,
            command: draft.commandOrUrl.trim(),
            args: parseLines(draft.args),
            cwd: draft.cwd.trim() || undefined,
            env: parseKeyValueLines(draft.env),
        };
    }
    if (draft.transport === 'http') {
        return {
            ...base,
            httpUrl: draft.commandOrUrl.trim(),
            headers: parseKeyValueLines(draft.headers),
        };
    }
    return {
        ...base,
        url: draft.commandOrUrl.trim(),
        headers: parseKeyValueLines(draft.headers),
    };
}
function createEmptyHookDraft() {
    return {
        scope: 'user',
        event: 'PreToolUse',
        matcher: '*',
        type: 'command',
        commandOrUrl: '',
        name: '',
        description: '',
        timeout: '',
        statusMessage: '',
        env: '',
        headers: '',
        allowedEnvVars: '',
        async: false,
        once: false,
        sequential: false,
    };
}
function hookToDraft(entry) {
    const config = entry.hook.hooks[0];
    const type = config?.type ?? 'command';
    return {
        scope: entry.scope === 'workspace' ? 'workspace' : 'user',
        event: entry.event,
        index: entry.index,
        matcher: entry.hook.matcher ?? '*',
        sequential: entry.hook.sequential ?? false,
        type,
        commandOrUrl: type === 'command' ? (config?.command ?? '') : (config?.url ?? ''),
        name: config?.name ?? '',
        description: config?.description ?? '',
        timeout: config?.timeout === undefined ? '' : String(config.timeout),
        statusMessage: config?.statusMessage ?? '',
        env: stringifyKeyValueLines(config?.env),
        headers: stringifyKeyValueLines(config?.headers),
        allowedEnvVars: stringifyLines(config?.allowedEnvVars),
        async: config?.async ?? false,
        once: config?.once ?? false,
    };
}
function draftToHook(draft) {
    const timeout = draft.timeout.trim()
        ? Number(draft.timeout.trim())
        : undefined;
    const common = {
        name: draft.name.trim() || undefined,
        description: draft.description.trim() || undefined,
        timeout,
        statusMessage: draft.statusMessage.trim() || undefined,
    };
    return {
        matcher: draft.matcher,
        sequential: draft.sequential || undefined,
        hooks: [
            draft.type === 'command'
                ? {
                    ...common,
                    type: 'command',
                    command: draft.commandOrUrl.trim(),
                    env: parseKeyValueLines(draft.env),
                    async: draft.async || undefined,
                }
                : {
                    ...common,
                    type: 'http',
                    url: draft.commandOrUrl.trim(),
                    headers: parseKeyValueLines(draft.headers),
                    allowedEnvVars: parseLines(draft.allowedEnvVars),
                    once: draft.once || undefined,
                },
        ],
    };
}
async function runSharedhopcodeSettingsCommand(command) {
    if (!window.electronAPI)
        return null;
    switch (command.type) {
        case 'getQwenCoreSettings':
            return window.electronAPI.getQwenCoreSettings();
        case 'setQwenCoreSetting':
            return window.electronAPI.setQwenCoreSetting(command.scope, command.key, command.value);
        case 'setQwenMcpServer':
            return window.electronAPI.setQwenMcpServer(command.scope, command.name, command.server);
        case 'removeQwenMcpServer':
            return window.electronAPI.removeQwenMcpServer(command.scope, command.name);
        case 'setQwenHook':
            return window.electronAPI.setQwenHook(command.scope, command.event, command.index, command.hook);
        case 'removeQwenHook':
            return window.electronAPI.removeQwenHook(command.scope, command.event, command.index);
        case 'setQwenExtensionSetting':
            return window.electronAPI.setQwenExtensionSetting(command.extensionId, command.settingKey, command.scope, command.value);
        default:
            return null;
    }
}
export default function HopCodeSettingsPage({ tab }) {
    const { t } = useTranslation();
    const copy = PAGE_COPY[tab];
    const scrollViewportRef = useRef(null);
    const [snapshot, setSnapshot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const runCommand = useCallback(async (command) => {
        if (!window.electronAPI)
            return null;
        const result = await runSharedhopcodeSettingsCommand(command);
        return normalizehopcodeSettingsSnapshot(result);
    }, []);
    const load = useCallback(async () => {
        if (!window.electronAPI) {
            setSnapshot(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const result = await runCommand({ type: 'getQwenCoreSettings' });
            setSnapshot(result);
        }
        catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : String(loadError));
            setSnapshot(null);
        }
        finally {
            setLoading(false);
        }
    }, [runCommand]);
    useEffect(() => {
        void load();
    }, [load]);
    const saveSetting = useCallback(async (key, value, scope = 'user') => {
        try {
            const result = await runCommand({
                type: 'setQwenCoreSetting',
                scope,
                key,
                value,
            });
            if (result)
                setSnapshot(result);
        }
        catch (saveError) {
            toast.error(t('settings.hopcode.failedToSaveSetting'), {
                description: saveError instanceof Error ? saveError.message : String(saveError),
            });
        }
    }, [runCommand, t]);
    return (_jsxs("div", { className: "h-full flex flex-col", children: [_jsx(PanelHeader, { title: t(copy.titleKey), actions: _jsx(HeaderMenu, { route: routes.view.settings(copy.slug) }) }), _jsx("div", { className: "flex-1 min-h-0 mask-fade-y", children: _jsx(ScrollArea, { className: "h-full", viewportRef: scrollViewportRef, children: _jsx("div", { className: "px-5 py-7 max-w-3xl mx-auto", children: _jsxs("div", { className: "space-y-8", children: [_jsx(SettingsSection, { title: t(copy.titleKey), description: t(copy.descriptionKey), children: error ? (_jsxs(SettingsCard, { className: "px-4 py-3 text-sm text-destructive flex gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 mt-0.5 shrink-0" }), _jsx("span", { children: error })] })) : null }), loading ? (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(Loader2, { className: "w-5 h-5 animate-spin text-muted-foreground" }) })) : !snapshot ? (_jsx(EmptyState, { title: t('settings.hopcode.settingsUnavailableTitle'), description: t('settings.hopcode.settingsUnavailableDesc') })) : tab === 'general' ? (_jsx(GeneralTab, { snapshot: snapshot, onSave: saveSetting })) : tab === 'mcpServers' ? (_jsx(McpServersTab, { snapshot: snapshot, runCommand: runCommand, setSnapshot: setSnapshot })) : tab === 'hooks' ? (_jsx(HooksTab, { snapshot: snapshot, runCommand: runCommand, setSnapshot: setSnapshot, onSave: saveSetting, scrollViewportRef: scrollViewportRef })) : (_jsx(ExtensionsTab, { snapshot: snapshot, runCommand: runCommand, setSnapshot: setSnapshot })), snapshot ? (_jsx("div", { className: "flex justify-end", children: _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => void load(), children: [_jsx(RefreshCw, { className: "w-4 h-4 mr-2" }), t('settings.hopcode.refresh')] }) })) : null] }) }) }) })] }));
}
function EmptyState({ title, description, }) {
    return (_jsx(SettingsCard, { className: "px-4 py-8", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm font-medium", children: title }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: description })] }) }));
}
function GeneralTab({ snapshot, onSave, }) {
    const { t } = useTranslation();
    const outputLanguage = stringValue(snapshot, 'general.outputLanguage', 'auto');
    const [outputLanguageDraft, setOutputLanguageDraft] = useState(outputLanguage);
    useEffect(() => setOutputLanguageDraft(outputLanguage), [outputLanguage]);
    const approvalModeOptions = useMemo(() => [
        { value: 'plan', label: t('settings.hopcode.approvalMode.plan') },
        { value: 'default', label: t('settings.hopcode.approvalMode.default') },
        { value: 'auto-edit', label: t('settings.hopcode.approvalMode.autoEdit') },
        { value: 'izn', label: t('settings.hopcode.ApprovalMode.IZN') },
    ], [t]);
    const fileEncodingOptions = useMemo(() => [
        { value: 'utf-8', label: 'UTF-8' },
        { value: 'utf-8-bom', label: t('settings.hopcode.fileEncoding.utf8Bom') },
    ], [t]);
    return (_jsxs(_Fragment, { children: [_jsx(SettingsSection, { title: t('settings.hopcode.general.responseLanguage'), description: t('settings.hopcode.general.responseLanguageDesc'), children: _jsx(SettingsCard, { children: _jsx(SettingsInput, { inCard: true, label: t('settings.hopcode.general.outputLanguage'), description: t('settings.hopcode.general.outputLanguageDesc'), value: outputLanguageDraft, placeholder: t('settings.hopcode.option.auto'), onChange: (value) => {
                            setOutputLanguageDraft(value);
                            void onSave('general.outputLanguage', value);
                        } }) }) }), _jsx(SettingsSection, { title: t('settings.hopcode.general.everydayBehavior'), description: t('settings.hopcode.general.everydayBehaviorDesc'), children: _jsxs(SettingsCard, { children: [_jsx(SettingsSelect, { inCard: true, label: t('settings.hopcode.general.toolApprovalMode'), description: t('settings.hopcode.general.toolApprovalModeDesc'), value: stringValue(snapshot, 'tools.approvalMode', 'default'), options: approvalModeOptions, onValueChange: (value) => void onSave('tools.approvalMode', value) }), _jsx(SettingsToggle, { label: t('settings.hopcode.general.commitAttribution'), description: t('settings.hopcode.general.commitAttributionDesc'), checked: boolValue(snapshot, 'general.gitCoAuthor.commit', true), onCheckedChange: (checked) => void onSave('general.gitCoAuthor.commit', checked) }), _jsx(SettingsToggle, { label: t('settings.hopcode.general.prAttribution'), description: t('settings.hopcode.general.prAttributionDesc'), checked: boolValue(snapshot, 'general.gitCoAuthor.pr', true), onCheckedChange: (checked) => void onSave('general.gitCoAuthor.pr', checked) }), _jsx(SettingsSelect, { inCard: true, label: t('settings.hopcode.general.defaultFileEncoding'), description: t('settings.hopcode.general.defaultFileEncodingDesc'), value: stringValue(snapshot, 'general.defaultFileEncoding', 'utf-8'), options: fileEncodingOptions, onValueChange: (value) => void onSave('general.defaultFileEncoding', value) })] }) }), _jsx(SettingsSection, { title: t('settings.hopcode.general.fileSearch'), description: t('settings.hopcode.general.fileSearchDesc'), children: _jsxs(SettingsCard, { children: [_jsx(SettingsToggle, { label: t('settings.hopcode.general.respectGitIgnore'), description: t('settings.hopcode.general.respectGitIgnoreDesc'), checked: boolValue(snapshot, 'context.fileFiltering.respectGitIgnore', true), onCheckedChange: (checked) => void onSave('context.fileFiltering.respectGitIgnore', checked) }), _jsx(SettingsToggle, { label: t('settings.hopcode.general.respectHopcodeIgnore'), description: t('settings.hopcode.general.respectHopcodeIgnoreDesc'), checked: boolValue(snapshot, 'context.fileFiltering.respectHopcodeIgnore', true), onCheckedChange: (checked) => void onSave('context.fileFiltering.respectHopcodeIgnore', checked) }), _jsx(SettingsToggle, { label: t('settings.hopcode.general.fuzzyFileSearch'), description: t('settings.hopcode.general.fuzzyFileSearchDesc'), checked: boolValue(snapshot, 'context.fileFiltering.enableFuzzySearch', true), onCheckedChange: (checked) => void onSave('context.fileFiltering.enableFuzzySearch', checked) })] }) })] }));
}
function McpServersTab({ snapshot, runCommand, setSnapshot, }) {
    const { t } = useTranslation();
    const [draft, setDraft] = useState(createEmptyMcpDraft);
    const [showEditor, setShowEditor] = useState(false);
    const scopeOptions = useMemo(() => [
        { value: 'user', label: t('settings.hopcode.scope.user') },
        { value: 'workspace', label: t('settings.hopcode.scope.project') },
    ], [t]);
    const entries = useMemo(() => [
        ...snapshot.user.mcpServers,
        ...snapshot.workspace.mcpServers,
        ...snapshot.merged.mcpServers.filter((entry) => entry.scope === 'extension'),
    ], [snapshot]);
    const save = async () => {
        if (!draft.name.trim() || !draft.commandOrUrl.trim())
            return;
        const result = await runCommand({
            type: 'setQwenMcpServer',
            scope: draft.scope,
            name: draft.name.trim(),
            server: draftToServer(draft),
        });
        if (result) {
            setSnapshot(result);
            setDraft(createEmptyMcpDraft());
            setShowEditor(false);
        }
    };
    const remove = async (entry) => {
        if (entry.scope !== 'user' && entry.scope !== 'workspace')
            return;
        const result = await runCommand({
            type: 'removeQwenMcpServer',
            scope: entry.scope,
            name: entry.name,
        });
        if (result)
            setSnapshot(result);
    };
    return (_jsxs(_Fragment, { children: [_jsxs(SettingsSection, { title: t('settings.hopcode.mcp.configuredServers'), description: t('settings.hopcode.mcp.configuredServersDesc'), children: [_jsx("div", { className: "flex justify-end gap-2", children: _jsxs(Button, { size: "sm", onClick: () => {
                                setDraft(createEmptyMcpDraft());
                                setShowEditor(true);
                            }, children: [_jsx(Plus, { className: "w-4 h-4" }), t('settings.hopcode.mcp.addServer')] }) }), _jsx("div", { className: "mt-3 space-y-3", children: entries.length === 0 ? (_jsx(EmptyState, { title: t('settings.hopcode.mcp.noServersTitle'), description: t('settings.hopcode.mcp.noServersDesc') })) : (entries.map((entry) => (_jsx(SettingsCard, { className: "px-4 py-3.5", children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-sm font-medium", children: entry.name }), _jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [entry.scope, " \u00B7 ", entry.server.transport, " \u00B7", ' ', entry.server.command ??
                                                        entry.server.httpUrl ??
                                                        entry.server.url] }), entry.server.description ? (_jsx("div", { className: "text-xs text-muted-foreground mt-1", children: entry.server.description })) : null] }), entry.scope === 'extension' ? null : (_jsxs("div", { className: "flex gap-1", children: [_jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
                                                    setDraft(serverToDraft(entry));
                                                    setShowEditor(true);
                                                }, "aria-label": t('common.edit'), children: _jsx(Settings2, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "ghost", onClick: () => void remove(entry), children: _jsx(Trash2, { className: "w-4 h-4 text-destructive" }) })] }))] }) }, `${entry.scope}:${entry.name}`)))) })] }), showEditor ? (_jsx(SettingsSection, { title: t('settings.hopcode.mcp.addOrEditServer'), description: t('settings.hopcode.mcp.addOrEditServerDesc'), children: _jsxs(SettingsCard, { className: "p-4 space-y-3", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsx(SettingsSelect, { label: t('settings.hopcode.common.scope'), value: draft.scope, options: scopeOptions, onValueChange: (scope) => setDraft((current) => ({
                                        ...current,
                                        scope: scope,
                                    })) }), _jsx(SettingsSelect, { label: t('settings.hopcode.mcp.transport'), value: draft.transport, options: TRANSPORT_OPTIONS, onValueChange: (transport) => setDraft((current) => ({
                                        ...current,
                                        transport: transport,
                                    })) }), _jsx(SettingsInput, { label: t('settings.hopcode.common.name'), value: draft.name, onChange: (name) => setDraft((current) => ({ ...current, name })), placeholder: "my-server" })] }), _jsx(SettingsInput, { label: draft.transport === 'stdio'
                                ? t('settings.hopcode.common.command')
                                : t('settings.hopcode.common.url'), value: draft.commandOrUrl, onChange: (commandOrUrl) => setDraft((current) => ({ ...current, commandOrUrl })), placeholder: draft.transport === 'stdio'
                                ? 'node'
                                : 'http://localhost:3000/mcp' }), draft.transport === 'stdio' ? (_jsx(SettingsTextarea, { label: t('settings.hopcode.mcp.arguments'), description: t('settings.hopcode.mcp.oneArgumentPerLine'), value: draft.args, onChange: (args) => setDraft((current) => ({ ...current, args })), placeholder: '-m\nmy_mcp_server', rows: 3 })) : (_jsx(SettingsTextarea, { label: t('settings.hopcode.common.headers'), description: t('settings.hopcode.common.oneKeyValuePerLine'), value: draft.headers, onChange: (headers) => setDraft((current) => ({ ...current, headers })), placeholder: "Authorization=Bearer ${TOKEN}", rows: 3 })), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsx(SettingsInput, { label: t('settings.hopcode.common.timeout'), value: draft.timeout, onChange: (timeout) => setDraft((current) => ({ ...current, timeout })), placeholder: "15000" }), _jsx(SettingsInput, { label: t('settings.hopcode.common.description'), value: draft.description, onChange: (description) => setDraft((current) => ({ ...current, description })), placeholder: "Internal tools" })] }), draft.transport === 'stdio' ? (_jsx(SettingsTextarea, { label: t('settings.hopcode.common.environment'), description: t('settings.hopcode.common.oneKeyValuePerLine'), value: draft.env, onChange: (env) => setDraft((current) => ({ ...current, env })), placeholder: "API_KEY=${API_KEY}", rows: 3 })) : null, _jsx(SettingsToggle, { inCard: false, label: t('settings.hopcode.mcp.trustThisServer'), description: t('settings.hopcode.mcp.trustThisServerDesc'), checked: draft.trust, onCheckedChange: (trust) => setDraft((current) => ({ ...current, trust })) }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "ghost", onClick: () => {
                                        setDraft(createEmptyMcpDraft());
                                        setShowEditor(false);
                                    }, children: t('common.clear') }), _jsxs(Button, { onClick: () => void save(), disabled: !draft.name.trim() || !draft.commandOrUrl.trim(), children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), t('settings.hopcode.mcp.saveServer')] })] })] }) })) : null] }));
}
function HooksTab({ snapshot, runCommand, setSnapshot, onSave, scrollViewportRef, }) {
    const { t } = useTranslation();
    const [draft, setDraft] = useState(createEmptyHookDraft);
    const [showEditor, setShowEditor] = useState(false);
    const [editorScrollRequest, setEditorScrollRequest] = useState(0);
    const editorRef = useRef(null);
    const scopeOptions = useMemo(() => [
        { value: 'user', label: t('settings.hopcode.scope.user') },
        { value: 'workspace', label: t('settings.hopcode.scope.project') },
    ], [t]);
    const hookTypeOptions = useMemo(() => [
        { value: 'command', label: t('settings.hopcode.common.command') },
        { value: 'http', label: 'HTTP' },
    ], [t]);
    const entries = useMemo(() => [
        ...snapshot.user.hooks,
        ...snapshot.workspace.hooks,
        ...snapshot.merged.hooks.filter((entry) => entry.scope === 'extension'),
    ], [snapshot]);
    const openEditor = useCallback((nextDraft) => {
        setDraft(nextDraft);
        setShowEditor(true);
        setEditorScrollRequest((count) => count + 1);
    }, []);
    useEffect(() => {
        if (!showEditor)
            return;
        const frameId = requestAnimationFrame(() => {
            const viewport = scrollViewportRef.current;
            const editor = editorRef.current;
            if (!viewport || !editor)
                return;
            const viewportRect = viewport.getBoundingClientRect();
            const editorRect = editor.getBoundingClientRect();
            viewport.scrollTo({
                top: Math.max(0, viewport.scrollTop + editorRect.top - viewportRect.top - 8),
                behavior: 'smooth',
            });
        });
        return () => cancelAnimationFrame(frameId);
    }, [editorScrollRequest, scrollViewportRef, showEditor]);
    const save = async () => {
        if (!draft.commandOrUrl.trim())
            return;
        const result = await runCommand({
            type: 'setQwenHook',
            scope: draft.scope,
            event: draft.event,
            index: draft.index,
            hook: draftToHook(draft),
        });
        if (result) {
            setSnapshot(result);
            setDraft(createEmptyHookDraft());
            setShowEditor(false);
        }
    };
    const remove = async (entry) => {
        if (entry.scope !== 'user' && entry.scope !== 'workspace')
            return;
        const result = await runCommand({
            type: 'removeQwenHook',
            scope: entry.scope,
            event: entry.event,
            index: entry.index,
        });
        if (result)
            setSnapshot(result);
    };
    return (_jsxs(_Fragment, { children: [_jsx(SettingsSection, { title: t('settings.hopcode.hooks.hookControl'), description: t('settings.hopcode.hooks.hookControlDesc'), children: _jsx(SettingsCard, { children: _jsx(SettingsToggle, { label: t('settings.hopcode.hooks.disableAllHooks'), description: t('settings.hopcode.hooks.disableAllHooksDesc'), checked: boolValue(snapshot, 'disableAllHooks', false), onCheckedChange: (checked) => void onSave('disableAllHooks', checked) }) }) }), _jsxs(SettingsSection, { title: t('settings.hopcode.hooks.configuredHooks'), description: t('settings.hopcode.hooks.configuredHooksDesc'), children: [_jsx("div", { className: "flex justify-end gap-2", children: _jsxs(Button, { size: "sm", onClick: () => {
                                openEditor(createEmptyHookDraft());
                            }, children: [_jsx(Plus, { className: "w-4 h-4" }), t('settings.hopcode.hooks.addHook')] }) }), _jsx("div", { className: "mt-3 space-y-3", children: entries.length === 0 ? (_jsx(EmptyState, { title: t('settings.hopcode.hooks.noHooksTitle'), description: t('settings.hopcode.hooks.noHooksDesc') })) : (entries.map((entry) => {
                            const config = entry.hook.hooks[0];
                            return (_jsx(SettingsCard, { className: "px-4 py-3.5", children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-sm font-medium", children: entry.event }), _jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [entry.scope, " \u00B7 ", config?.type, " \u00B7", ' ', entry.hook.matcher || '*'] }), _jsx("div", { className: "text-xs font-mono text-muted-foreground mt-1 truncate", children: config?.command ?? config?.url })] }), entry.scope === 'extension' ? null : (_jsxs("div", { className: "flex gap-1", children: [_jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
                                                        openEditor(hookToDraft(entry));
                                                    }, "aria-label": t('common.edit'), children: _jsx(Settings2, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "ghost", onClick: () => void remove(entry), children: _jsx(Trash2, { className: "w-4 h-4 text-destructive" }) })] }))] }) }, `${entry.scope}:${entry.event}:${entry.index}`));
                        })) })] }), showEditor ? (_jsx("div", { ref: editorRef, children: _jsx(SettingsSection, { title: t('settings.hopcode.hooks.addOrEditHook'), description: t('settings.hopcode.hooks.addOrEditHookDesc'), children: _jsxs(SettingsCard, { className: "p-4 space-y-3", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsx(SettingsSelect, { label: t('settings.hopcode.common.scope'), value: draft.scope, options: scopeOptions, onValueChange: (scope) => setDraft((current) => ({
                                            ...current,
                                            scope: scope,
                                        })) }), _jsx(SettingsSelect, { label: t('settings.hopcode.hooks.event'), value: draft.event, options: HOOK_EVENT_OPTIONS, onValueChange: (event) => setDraft((current) => ({
                                            ...current,
                                            event: event,
                                        })) }), _jsx(SettingsSelect, { label: t('settings.hopcode.hooks.type'), value: draft.type, options: hookTypeOptions, onValueChange: (type) => setDraft((current) => ({
                                            ...current,
                                            type: type,
                                        })) })] }), _jsx(SettingsInput, { label: t('settings.hopcode.hooks.matcher'), value: draft.matcher, onChange: (matcher) => setDraft((current) => ({ ...current, matcher })), placeholder: "*" }), _jsx(SettingsInput, { label: draft.type === 'command'
                                    ? t('settings.hopcode.common.command')
                                    : t('settings.hopcode.common.url'), value: draft.commandOrUrl, onChange: (commandOrUrl) => setDraft((current) => ({ ...current, commandOrUrl })), placeholder: draft.type === 'command'
                                    ? '$HOPCODE_PROJECT_DIR/.hopcode/hooks/check.sh'
                                    : 'http://127.0.0.1:8080/hook' }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsx(SettingsInput, { label: t('settings.hopcode.common.name'), value: draft.name, onChange: (name) => setDraft((current) => ({ ...current, name })) }), _jsx(SettingsInput, { label: t('settings.hopcode.common.timeout'), value: draft.timeout, onChange: (timeout) => setDraft((current) => ({ ...current, timeout })), placeholder: "10000" })] }), _jsx(SettingsInput, { label: t('settings.hopcode.common.description'), value: draft.description, onChange: (description) => setDraft((current) => ({ ...current, description })) }), draft.type === 'command' ? (_jsx(SettingsTextarea, { label: t('settings.hopcode.common.environment'), description: t('settings.hopcode.common.oneKeyValuePerLine'), value: draft.env, onChange: (env) => setDraft((current) => ({ ...current, env })), rows: 3 })) : (_jsxs(_Fragment, { children: [_jsx(SettingsTextarea, { label: t('settings.hopcode.common.headers'), description: t('settings.hopcode.common.oneKeyValuePerLine'), value: draft.headers, onChange: (headers) => setDraft((current) => ({ ...current, headers })), rows: 3 }), _jsx(SettingsTextarea, { label: t('settings.hopcode.hooks.allowedEnvVars'), description: t('settings.hopcode.hooks.allowedEnvVarsDesc'), value: draft.allowedEnvVars, onChange: (allowedEnvVars) => setDraft((current) => ({ ...current, allowedEnvVars })), rows: 3 })] })), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: [_jsx(SettingsToggle, { inCard: false, label: t('settings.hopcode.hooks.sequential'), description: t('settings.hopcode.hooks.sequentialDesc'), checked: draft.sequential, onCheckedChange: (sequential) => setDraft((current) => ({ ...current, sequential })) }), _jsx(SettingsToggle, { inCard: false, label: draft.type === 'command'
                                            ? t('settings.hopcode.hooks.async')
                                            : t('settings.hopcode.hooks.once'), description: draft.type === 'command'
                                            ? t('settings.hopcode.hooks.asyncDesc')
                                            : t('settings.hopcode.hooks.onceDesc'), checked: draft.type === 'command' ? draft.async : draft.once, onCheckedChange: (checked) => setDraft((current) => draft.type === 'command'
                                            ? { ...current, async: checked }
                                            : { ...current, once: checked }) })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "ghost", onClick: () => {
                                            setDraft(createEmptyHookDraft());
                                            setShowEditor(false);
                                        }, children: t('common.clear') }), _jsxs(Button, { onClick: () => void save(), disabled: !draft.commandOrUrl.trim(), children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), t('settings.hopcode.hooks.saveHook')] })] })] }) }) })) : null] }));
}
function ExtensionsTab({ snapshot, runCommand, setSnapshot, }) {
    const { t } = useTranslation();
    return (_jsx(SettingsSection, { title: t('settings.hopcode.extensions.installedExtensions'), description: t('settings.hopcode.extensions.installedExtensionsDesc'), children: _jsx("div", { className: "space-y-3", children: snapshot.merged.extensions.length === 0 ? (_jsx(EmptyState, { title: t('settings.hopcode.extensions.noExtensionsTitle'), description: t('settings.hopcode.extensions.noExtensionsDesc') })) : (snapshot.merged.extensions.map((extension) => (_jsx(ExtensionCard, { extension: extension, runCommand: runCommand, setSnapshot: setSnapshot }, extension.id)))) }) }));
}
function ExtensionCard({ extension, runCommand, setSnapshot, }) {
    const { t } = useTranslation();
    return (_jsxs(SettingsCard, { className: "px-4 py-3.5", children: [_jsx("div", { className: "flex items-start justify-between gap-3", children: _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-sm font-medium", children: extension.displayName ?? extension.name }), _jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [extension.version, " \u00B7", ' ', extension.isActive
                                    ? t('settings.hopcode.extensions.active')
                                    : t('settings.hopcode.extensions.inactive')] }), _jsx("div", { className: "text-[11px] text-muted-foreground/70 mt-1 truncate font-mono", children: extension.path })] }) }), _jsx("div", { className: "mt-3 text-xs text-muted-foreground", children: t('settings.hopcode.extensions.summary', {
                    commands: extension.commands.length,
                    skills: extension.skills.length,
                    mcpServers: extension.mcpServers.length,
                }) }), _jsx("div", { className: "mt-3 divide-y divide-border/60", children: extension.settings.length === 0 ? (_jsx("div", { className: "py-3 text-xs text-muted-foreground", children: t('settings.hopcode.extensions.noConfigurableSettings') })) : (extension.settings.map((setting) => (_jsx(ExtensionSettingRow, { extension: extension, setting: setting, runCommand: runCommand, setSnapshot: setSnapshot }, setting.envVar)))) })] }));
}
function ExtensionSettingRow({ extension, setting, runCommand, setSnapshot, }) {
    const { t } = useTranslation();
    const [scope, setScope] = useState(setting.effectiveScope ?? 'user');
    const scopeOptions = useMemo(() => [
        { value: 'user', label: t('settings.hopcode.scope.user') },
        { value: 'workspace', label: t('settings.hopcode.scope.project') },
    ], [t]);
    const [draft, setDraft] = useState(setting.sensitive ? '' : String(setting.effectiveValue ?? ''));
    useEffect(() => {
        setScope(setting.effectiveScope ?? 'user');
        setDraft(setting.sensitive ? '' : String(setting.effectiveValue ?? ''));
    }, [setting]);
    const save = async () => {
        const result = await runCommand({
            type: 'setQwenExtensionSetting',
            extensionId: extension.id,
            settingKey: setting.envVar,
            scope,
            value: draft,
        });
        if (result)
            setSnapshot(result);
    };
    return (_jsxs("div", { className: "py-3", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-sm font-medium", children: setting.name }), _jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: setting.description }), _jsx("div", { className: "text-[11px] text-muted-foreground/70 mt-1 font-mono", children: setting.envVar })] }), _jsx(SettingsSelect, { value: scope, options: scopeOptions, onValueChange: (value) => setScope(value), className: "w-32" })] }), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsx(Input, { value: draft, type: setting.sensitive ? 'password' : 'text', onChange: (event) => setDraft(event.target.value), placeholder: setting.sensitive &&
                            (setting.hasUserValue || setting.hasWorkspaceValue)
                            ? t('settings.hopcode.extensions.storedSecurely')
                            : t('settings.hopcode.extensions.value'), className: "h-8 bg-muted/50" }), _jsx(Button, { size: "sm", onClick: () => void save(), disabled: !draft && setting.sensitive, children: _jsx(Save, { className: "w-4 h-4" }) })] })] }));
}
//# sourceMappingURL=HopcodeSettingsPage.js.map