import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMcp } from '@hoptrendy/webui/daemon-react-sdk';
import { useI18n } from '../../i18n';
import { trimDialogLabel } from '../../utils/dialogLabels';
import styles from './McpDialog.module.css';
function extractErrorDetail(err) {
    if (err && typeof err === 'object') {
        const body = err.body;
        if (body && typeof body === 'object') {
            const data = body.data;
            if (data && typeof data === 'object') {
                const details = data.details;
                if (typeof details === 'string' && details)
                    return details;
            }
            const error = body.error;
            if (typeof error === 'string' && error)
                return error;
        }
        if (err instanceof Error && err.message)
            return err.message;
    }
    return String(err);
}
function statusDisplay(server, t) {
    if (server.disabled) {
        return { text: t('mcp.status.disabled'), className: styles.error };
    }
    switch (server.mcpStatus) {
        case 'connected':
            return { text: t('mcp.status.connected'), className: styles.success };
        case 'connecting':
            return { text: t('mcp.status.starting'), className: styles.warning };
        case 'disconnected':
        default:
            return {
                text: t('mcp.status.disconnectedTitle'),
                className: styles.error,
            };
    }
}
function serverGroupLabel(server, t) {
    return server.extensionName ? t('mcp.extensionMcp') : t('mcp.userMcp');
}
function oauthAuthMessage(serverName, t, detail) {
    return [
        `${t('mcp.oauth.server')}: ${serverName}`,
        '',
        t('mcp.oauth.starting', { name: serverName }),
        ...(detail ? ['', detail] : []),
    ].join('\n');
}
function schemaObject(tool) {
    const schema = tool.schema;
    const content = schema?.parametersJsonSchema ?? schema?.parameters ?? schema;
    return content && typeof content === 'object'
        ? content
        : null;
}
function toolAnnotationText(tool, t) {
    const annotations = tool.annotations ?? {};
    const labels = [];
    if (annotations['destructiveHint'])
        labels.push(t('mcp.annotation.destructive'));
    if (annotations['readOnlyHint'])
        labels.push(t('mcp.annotation.readOnly'));
    if (annotations['openWorldHint'])
        labels.push(t('mcp.annotation.openWorld'));
    if (annotations['idempotentHint'])
        labels.push(t('mcp.annotation.idempotent'));
    return labels.join(', ');
}
function toolKey(serverName, toolName) {
    return `${serverName}:${toolName}`;
}
// A resource URI may contain ':', so join with NUL (mirrors core's
// ResourceRegistry key) to keep the expand-state key collision-proof.
function resourceKey(serverName, uri) {
    return `${serverName}\u0000${uri}`;
}
const detailLabel = trimDialogLabel;
function ChevronIcon({ expanded }) {
    return (_jsx("svg", { className: `${styles.chevron} ${expanded ? styles.chevronExpanded : ''}`, viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("path", { d: "M6 4.5 9.5 8 6 11.5", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
function serverActions(server, t) {
    const actions = [];
    if (!server.disabled && server.mcpStatus === 'disconnected') {
        actions.push({ id: 'reconnect', label: t('mcp.action.reconnect') });
    }
    actions.push({
        id: server.disabled ? 'enable' : 'disable',
        label: server.disabled ? t('mcp.action.enable') : t('mcp.action.disable'),
    });
    if (!server.disabled) {
        actions.push({
            id: 'authenticate',
            label: server.hasOAuthTokens
                ? t('mcp.action.reauth')
                : t('mcp.action.auth'),
        });
        if (server.hasOAuthTokens) {
            actions.push({ id: 'clear-auth', label: t('mcp.action.clearAuth') });
        }
    }
    return actions;
}
function SchemaSummary({ tool, t, }) {
    const schema = schemaObject(tool);
    if (!schema)
        return _jsx("div", { className: styles.muted, children: t('mcp.noSchema') });
    const properties = schema['properties'];
    const required = Array.isArray(schema['required'])
        ? new Set(schema['required'].filter((name) => typeof name === 'string'))
        : new Set();
    if (!properties || typeof properties !== 'object') {
        return (_jsx("pre", { className: styles.schema, children: JSON.stringify(schema, null, 2) }));
    }
    const entries = Object.entries(properties);
    if (entries.length === 0)
        return null;
    return (_jsxs("div", { className: styles.section, children: [_jsx("div", { className: styles.sectionTitle, children: t('mcp.parameters') }), entries.map(([name, param]) => {
                const details = param && typeof param === 'object'
                    ? param
                    : {};
                const type = typeof details['type'] === 'string' ? details['type'] : 'any';
                const description = typeof details['description'] === 'string'
                    ? details['description']
                    : '';
                return (_jsx("div", { className: styles.parameter, children: `- ${name}${required.has(name) ? t('mcp.required') : ''}: ${type}${description ? ` - ${description}` : ''}` }, name));
            })] }));
}
function Field({ label, value }) {
    return (_jsxs("div", { className: styles.field, children: [_jsx("span", { className: styles.label, children: label }), _jsx("span", { className: styles.value, children: value })] }));
}
function ToolDetail({ tool, t }) {
    const annotations = toolAnnotationText(tool, t);
    return (_jsxs("div", { className: styles.toolDetail, children: [!tool.isValid ? (_jsxs("div", { className: styles.section, children: [_jsx("div", { className: `${styles.sectionTitle} ${styles.error}`, children: t('mcp.invalidToolWarning') }), _jsxs("div", { className: styles.muted, children: [detailLabel(t('mcp.invalidReasonLabel')), ' ', tool.invalidReason || t('mcp.status.unknown')] }), _jsx("div", { className: styles.muted, children: t('mcp.invalidToolHelp') })] })) : null, tool.description ? (_jsxs("div", { className: styles.section, children: [_jsx("div", { className: styles.sectionTitle, children: detailLabel(t('mcp.description')) }), _jsx("div", { className: styles.description, children: tool.description.trim() })] })) : (_jsx("div", { className: styles.muted, children: t('mcp.noDescription') })), annotations ? (_jsx(Field, { label: detailLabel(t('mcp.annotations')), value: annotations })) : null, _jsx(SchemaSummary, { tool: tool, t: t })] }));
}
function ResourceDetail({ resource, t, }) {
    // Only surface the friendly name when it adds information beyond the URI
    // that is already shown — mirrors the TUI ResourceDetailStep.
    const friendlyName = resource.title || resource.name || '';
    const showName = friendlyName !== '' && friendlyName !== resource.uri;
    return (_jsxs("div", { className: styles.toolDetail, children: [_jsx(Field, { label: detailLabel(t('mcp.resource.uriLabel')), value: resource.uri }), showName ? (_jsx(Field, { label: detailLabel(t('mcp.resource.nameLabel')), value: friendlyName })) : null, resource.mimeType ? (_jsx(Field, { label: detailLabel(t('mcp.resource.mimeTypeLabel')), value: resource.mimeType })) : null, typeof resource.size === 'number' ? (_jsx(Field, { label: detailLabel(t('mcp.resource.sizeLabel')), value: t('mcp.resource.bytes', { count: resource.size }) })) : null, resource.description ? (_jsxs("div", { className: styles.section, children: [_jsx("div", { className: styles.sectionTitle, children: detailLabel(t('mcp.description')) }), _jsx("div", { className: styles.description, children: resource.description.trim() })] })) : null] }));
}
export function McpDialog({ message }) {
    const { t } = useI18n();
    const mcp = useMcp({ autoLoad: false });
    const [status, setStatus] = useState(message.status);
    const [toolsByServer, setToolsByServer] = useState(message.toolsByServer);
    const [resourcesByServer, setResourcesByServer] = useState(message.resourcesByServer ?? {});
    const servers = useMemo(() => status.servers ?? [], [status.servers]);
    const [expandedServers, setExpandedServers] = useState(new Set());
    const [expandedTools, setExpandedTools] = useState(new Set());
    const [expandedResources, setExpandedResources] = useState(new Set());
    const [actionMessage, setActionMessage] = useState(null);
    const [busyServer, setBusyServer] = useState(null);
    useEffect(() => {
        setExpandedServers((current) => {
            const validNames = new Set(servers.map((server) => server.name));
            return new Set([...current].filter((name) => validNames.has(name)));
        });
    }, [servers]);
    const connectingCount = servers.filter((server) => !server.disabled && server.mcpStatus === 'connecting').length;
    const groupedServers = useMemo(() => {
        const groups = [];
        for (const server of servers) {
            const label = serverGroupLabel(server, t);
            const item = {
                server,
                tools: toolsByServer[server.name]?.tools ?? [],
                resources: resourcesByServer[server.name]?.resources ?? [],
            };
            const group = groups.find((candidate) => candidate.label === label);
            if (group)
                group.items.push(item);
            else
                groups.push({ label, items: [item] });
        }
        return groups;
    }, [servers, t, toolsByServer, resourcesByServer]);
    const reloadServer = useCallback(async (serverName) => {
        const nextStatus = await mcp.reload();
        if (!nextStatus)
            return;
        setStatus(nextStatus);
        const nextServer = nextStatus.servers?.find((server) => server.name === serverName);
        if (!nextServer)
            return;
        const nextTools = await mcp.loadTools(nextServer.name);
        setToolsByServer((current) => ({
            ...current,
            [nextServer.name]: nextTools,
        }));
        // Keep the resource list in sync after reconnect/enable. Only fetch
        // when the refreshed status still advertises resources; otherwise
        // drop any now-stale list so the section disappears. The fetch is
        // isolated in its own try/catch so a failed resource refresh never
        // turns a successful reconnect/enable into a reported failure.
        if (nextServer.resourceCount) {
            try {
                const nextResources = await mcp.loadResources(nextServer.name);
                setResourcesByServer((current) => ({
                    ...current,
                    [nextServer.name]: nextResources,
                }));
            }
            catch {
                // Leave the prior resource list in place; the count badge still
                // reflects the refreshed status.
            }
        }
        else {
            setResourcesByServer((current) => {
                if (!(nextServer.name in current))
                    return current;
                const next = { ...current };
                delete next[nextServer.name];
                return next;
            });
        }
    }, [mcp]);
    const runAction = useCallback(async (server, action) => {
        if (busyServer)
            return;
        setExpandedServers(new Set([server.name]));
        setBusyServer(server.name);
        setActionMessage({
            serverName: server.name,
            text: action.id === 'authenticate'
                ? oauthAuthMessage(server.name, t)
                : t('mcp.action.running', { action: action.label }),
        });
        try {
            let nextActionMessage = null;
            if (action.id === 'reconnect') {
                await mcp.restartServer(server.name);
            }
            else {
                const result = await mcp.manageServer(server.name, action.id);
                const details = [
                    ...(result.messages ?? []),
                    ...(result.authUrl ? [result.authUrl] : []),
                ].join('\n');
                if (details) {
                    nextActionMessage =
                        action.id === 'authenticate'
                            ? oauthAuthMessage(server.name, t, details)
                            : details;
                }
            }
            await reloadServer(server.name);
            setActionMessage({
                serverName: server.name,
                text: nextActionMessage ?? t('mcp.action.done', { action: action.label }),
            });
        }
        catch (err) {
            setActionMessage({
                serverName: server.name,
                text: action.id === 'authenticate'
                    ? oauthAuthMessage(server.name, t, extractErrorDetail(err))
                    : t('mcp.action.failed', { error: extractErrorDetail(err) }),
            });
        }
        finally {
            setBusyServer(null);
        }
    }, [busyServer, mcp, reloadServer, t]);
    const toggleServer = useCallback((serverName) => {
        setExpandedServers((current) => {
            return current.has(serverName) ? new Set() : new Set([serverName]);
        });
        setExpandedTools(new Set());
        setExpandedResources(new Set());
    }, []);
    const toggleTool = useCallback((serverName, toolName) => {
        const key = toolKey(serverName, toolName);
        setExpandedTools((current) => {
            return current.has(key) ? new Set() : new Set([key]);
        });
    }, []);
    const toggleResource = useCallback((serverName, uri) => {
        const key = resourceKey(serverName, uri);
        setExpandedResources((current) => {
            return current.has(key) ? new Set() : new Set([key]);
        });
    }, []);
    return (_jsxs("div", { className: styles.layout, "data-keyboard-scope": true, children: [connectingCount > 0 ? (_jsxs("div", { className: styles.notice, children: [t('mcp.starting', { count: connectingCount }), _jsx("div", { className: styles.muted, children: t('mcp.startingNote') })] })) : null, servers.length === 0 ? (_jsx("div", { className: styles.empty, children: t('mcp.empty') })) : (_jsx("div", { className: styles.list, children: groupedServers.map((group) => (_jsxs("div", { className: styles.group, children: [group.label !== t('mcp.extensionMcp') ? (_jsx("div", { className: styles.groupTitle, children: group.label })) : null, group.items.map(({ server, tools, resources }) => {
                            const display = statusDisplay(server, t);
                            const expanded = expandedServers.has(server.name);
                            const actions = serverActions(server, t);
                            const toolCount = toolsByServer[server.name]?.tools.length ?? 0;
                            const resourceCount = server.resourceCount ?? 0;
                            const promptCount = server.promptCount ?? 0;
                            return (_jsx("div", { className: styles.server, children: _jsxs("div", { className: `${styles.serverCard} ${expanded ? styles.serverCardExpanded : ''}`, children: [_jsxs("button", { type: "button", className: `${styles.row} ${styles.serverRow} ${expanded ? styles.expandedRow : ''}`, onClick: () => toggleServer(server.name), "aria-label": expanded ? t('mcp.collapse') : t('mcp.expand'), children: [_jsxs("span", { className: styles.rowMain, children: [_jsx("span", { className: styles.rowIcon, "aria-hidden": "true" }), _jsx("span", { className: `${styles.name} ${styles.serverName}`, children: server.name })] }), _jsx("span", { className: `${styles.status} ${display.className}`, children: display.text }), _jsx("span", { className: `${styles.badge} ${styles.toolCount}`, children: t(toolCount === 1
                                                        ? 'mcp.toolCount'
                                                        : 'mcp.toolsCount', {
                                                        count: toolCount,
                                                    }) }), resourceCount > 0 ? (_jsx("span", { className: `${styles.badge} ${styles.resourceCount}`, children: t('mcp.resourceCount', { count: resourceCount }) })) : null, promptCount > 0 ? (_jsx("span", { className: `${styles.badge} ${styles.promptCount}`, children: t('mcp.promptCount', { count: promptCount }) })) : null, _jsx("span", { className: styles.chevronCell, "aria-hidden": "true", children: _jsx(ChevronIcon, { expanded: expanded }) })] }), expanded ? (_jsxs("div", { className: styles.serverDetail, children: [actions.length > 0 ? (_jsx("div", { className: styles.serverDetailHeader, children: _jsx("div", { className: styles.serverActions, children: actions.map((action) => (_jsx("button", { type: "button", className: styles.button, onClick: () => void runAction(server, action), disabled: busyServer !== null, children: action.label }, action.id))) }) })) : null, actionMessage?.serverName === server.name ? (_jsx("pre", { className: styles.message, children: actionMessage.text })) : null, tools.length === 0 ? (_jsx("div", { className: styles.emptyTools, children: t('mcp.emptyTools') })) : (_jsx("div", { className: styles.tools, children: tools.map((tool) => {
                                                        const key = toolKey(server.name, tool.name);
                                                        const toolExpanded = expandedTools.has(key);
                                                        return (_jsxs("div", { className: styles.tool, children: [_jsxs("button", { type: "button", className: `${styles.row} ${styles.toolRow} ${toolExpanded ? styles.expandedRow : ''} ${!tool.isValid ? styles.disabled : ''}`, onClick: () => toggleTool(server.name, tool.name), children: [_jsx("span", { className: styles.rowIcon, "aria-hidden": "true" }), _jsx("span", { className: styles.name, children: tool.name }), _jsx(ChevronIcon, { expanded: toolExpanded })] }), toolExpanded ? (_jsx(ToolDetail, { tool: tool, t: t })) : null] }, tool.name));
                                                    }) })), resourceCount > 0 ? (_jsxs("div", { className: styles.resources, children: [_jsx("div", { className: styles.sectionTitle, children: t('mcp.resources') }), resources.length === 0 ? (_jsx("div", { className: styles.emptyTools, children: t('mcp.resourcesUnavailable') })) : null, resources.map((resource) => {
                                                            const key = resourceKey(server.name, resource.uri);
                                                            const resourceExpanded = expandedResources.has(key);
                                                            const label = resource.title || resource.name || '';
                                                            return (_jsxs("div", { className: styles.tool, children: [_jsxs("button", { type: "button", className: `${styles.row} ${styles.toolRow} ${resourceExpanded
                                                                            ? styles.expandedRow
                                                                            : ''}`, onClick: () => toggleResource(server.name, resource.uri), children: [_jsx("span", { className: styles.rowIcon, "aria-hidden": "true" }), _jsx("span", { className: `${styles.name} ${styles.resourceUri}`, children: resource.uri }), label && label !== resource.uri ? (_jsx("span", { className: styles.resourceLabel, children: label })) : null, _jsx(ChevronIcon, { expanded: resourceExpanded })] }), resourceExpanded ? (_jsx(ResourceDetail, { resource: resource, t: t })) : null] }, resource.uri));
                                                        })] })) : null] })) : null] }) }, server.name));
                        })] }, group.label))) }))] }));
}
//# sourceMappingURL=McpDialog.js.map