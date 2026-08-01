import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useConnection, useWorkspaceActions, useWorkspaceEventSignals, } from '@hoptrendy/webui/daemon-react-sdk';
import { useI18n } from '../../i18n';
import { trimDialogLabel } from '../../utils/dialogLabels';
import { dp } from './dialogStyles';
const UPDATE_AVAILABLE = 'update available';
function extensionTitle(extension) {
    return extension.displayName || extension.name;
}
function statusLabel(extension, t) {
    return extension.isActive
        ? t('extensions.manage.status.enabled')
        : t('extensions.manage.status.disabled');
}
function updateLabel(state, t) {
    switch (state) {
        case 'update available':
            return t('extensions.manage.updateAvailable');
        case 'up to date':
            return t('extensions.manage.upToDate');
        case 'not updatable':
            return t('extensions.manage.notUpdatable');
        case 'checking for updates':
            return t('extensions.manage.checkingUpdates');
        case 'error':
            return t('extensions.manage.updateError');
        default:
            return t('extensions.manage.unknownUpdate');
    }
}
function joinList(values) {
    return values && values.length > 0 ? values.join(', ') : '-';
}
const cleanLabel = trimDialogLabel;
export function ExtensionsDialog() {
    const { t } = useI18n();
    const connection = useConnection();
    const actions = useWorkspaceActions();
    const signals = useWorkspaceEventSignals();
    const [extensions, setExtensions] = useState([]);
    const [expandedName, setExpandedName] = useState(null);
    const [confirmUninstallName, setConfirmUninstallName] = useState(null);
    const [updateStates, setUpdateStates] = useState({});
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const [busyName, setBusyName] = useState(null);
    const [message, setMessage] = useState(null);
    const load = useCallback(() => {
        setLoading(true);
        return actions
            .loadExtensionsStatus()
            .then((status) => {
            const nextExtensions = status.extensions ?? [];
            setExtensions(nextExtensions);
            setMessage(status.errors?.[0]?.error ?? null);
            setExpandedName((name) => name && nextExtensions.some((extension) => extension.name === name)
                ? name
                : null);
        })
            .catch((error) => {
            setMessage(error instanceof Error ? error.message : String(error));
        })
            .finally(() => setLoading(false));
    }, [actions]);
    const checkUpdates = useCallback(() => {
        const clientId = connection.clientId;
        if (!clientId) {
            setMessage(t('extensions.install.waitForSession'));
            return Promise.resolve();
        }
        setChecking(true);
        return actions
            .checkExtensionUpdates(clientId)
            .then((result) => setUpdateStates(result.states))
            .catch((error) => {
            setMessage(error instanceof Error ? error.message : String(error));
        })
            .finally(() => setChecking(false));
    }, [actions, connection.clientId, t]);
    const refreshSessions = useCallback(() => {
        const clientId = connection.clientId;
        if (!clientId) {
            setMessage(t('extensions.install.waitForSession'));
            return;
        }
        setChecking(true);
        actions
            .refreshExtensions(clientId)
            .then(async (result) => {
            setMessage(t('extensions.manage.refreshed', {
                refreshed: result.refreshed,
                failed: result.failed,
            }));
            await load();
            await checkUpdates();
        })
            .catch((error) => {
            setMessage(error instanceof Error ? error.message : String(error));
        })
            .finally(() => setChecking(false));
    }, [actions, checkUpdates, connection.clientId, load, t]);
    useEffect(() => {
        load();
    }, [load]);
    useEffect(() => {
        if (extensions.length > 0)
            checkUpdates();
    }, [checkUpdates, extensions.length]);
    useEffect(() => {
        if ((signals?.extensionsVersion ?? 0) > 0) {
            setUpdateStates({});
            load();
        }
    }, [load, signals?.extensionsVersion]);
    const runMutation = useCallback((name, run) => {
        const clientId = connection.clientId;
        if (!clientId) {
            setMessage(t('extensions.install.waitForSession'));
            return;
        }
        setBusyName(name);
        setMessage(null);
        run(clientId)
            .then(() => setMessage(t('extensions.manage.queued', { name })))
            .catch((error) => {
            setMessage(error instanceof Error ? error.message : String(error));
        })
            .finally(() => setBusyName(null));
    }, [connection.clientId, t]);
    const summary = useMemo(() => {
        if (loading)
            return t('extensions.manage.loading');
        if (checking)
            return t('extensions.manage.checkingUpdates');
        return t('extensions.manage.count', { count: extensions.length });
    }, [checking, extensions.length, loading, t]);
    return (_jsxs("div", { className: dp('picker', 'picker-in-shell'), children: [_jsxs("div", { className: dp('picker-search', 'extensions-toolbar'), children: [_jsx("span", { className: dp('picker-search-hint'), children: message || summary }), _jsx("button", { type: "button", className: dp('dialog-inline-button'), disabled: loading || checking, onClick: refreshSessions, children: t('common.refresh') })] }), _jsx("div", { className: dp('picker-sep') }), _jsxs("div", { className: dp('picker-list'), children: [!loading && extensions.length === 0 && (_jsx("div", { className: dp('picker-empty'), children: t('extensions.manage.empty') })), extensions.map((extension) => {
                        const state = updateStates[extension.name] ?? extension.updateState;
                        const expanded = expandedName === extension.name;
                        const busy = busyName === extension.name;
                        return (_jsxs("div", { className: dp('picker-item', 'picker-session-item', 'tools-picker-item', expanded ? 'selected' : undefined, expanded ? 'tools-picker-item-expanded' : undefined), children: [_jsxs("button", { type: "button", className: dp('extensions-row-button'), onClick: () => {
                                        setExpandedName(expanded ? null : extension.name);
                                        setConfirmUninstallName(null);
                                    }, children: [_jsx("span", { className: dp('tools-item-icon'), "aria-hidden": "true" }), _jsx("span", { className: dp('picker-item-title'), children: extensionTitle(extension) }), _jsxs("span", { className: dp('picker-item-badge'), children: ["v", extension.version] }), _jsx("span", { className: dp('tools-status-badge', extension.isActive
                                                ? 'tools-status-badge-enabled'
                                                : 'tools-status-badge-disabled'), children: statusLabel(extension, t) }), _jsx("span", { className: dp('tools-status-badge', state === UPDATE_AVAILABLE
                                                ? 'tools-status-badge-busy'
                                                : undefined), children: updateLabel(state, t) }), _jsx("svg", { className: dp('tools-item-chevron', expanded ? 'tools-item-chevron-expanded' : undefined), viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("path", { d: "M6 4.5 9.5 8 6 11.5", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" }) })] }), expanded && (_jsx(ExtensionDetail, { extension: extension, updateState: state, busy: busy, confirmingUninstall: confirmUninstallName === extension.name, onUpdate: () => runMutation(extension.name, (clientId) => actions.updateExtension(extension.name, clientId)), onToggleScope: (mutation, scope) => runMutation(extension.name, (clientId) => mutation === 'enable'
                                        ? actions.enableExtension(extension.name, { scope }, clientId)
                                        : actions.disableExtension(extension.name, { scope }, clientId)), onRequestUninstall: () => setConfirmUninstallName(extension.name), onCancelUninstall: () => setConfirmUninstallName(null), onConfirmUninstall: () => {
                                        runMutation(extension.name, (clientId) => actions.uninstallExtension(extension.name, clientId));
                                        setConfirmUninstallName(null);
                                        setExpandedName(null);
                                    } }))] }, extension.id || extension.name));
                    })] })] }));
}
function ExtensionDetail({ extension, updateState, busy, confirmingUninstall, onUpdate, onToggleScope, onRequestUninstall, onCancelUninstall, onConfirmUninstall, }) {
    const { t } = useI18n();
    const details = extension.details;
    const mutation = extension.isActive ? 'disable' : 'enable';
    return (_jsxs("div", { className: dp('extensions-detail'), children: [_jsxs("div", { className: dp('extensions-detail-actions'), children: [_jsx("button", { type: "button", className: dp('dialog-inline-button'), disabled: busy || updateState !== UPDATE_AVAILABLE, onClick: onUpdate, children: t('extensions.manage.update') }), _jsxs("button", { type: "button", className: dp('dialog-inline-button'), disabled: busy, onClick: () => onToggleScope(mutation, 'user'), children: [mutation === 'enable'
                                ? t('extensions.manage.enable')
                                : t('extensions.manage.disable'), "\u00B7 ", t('settings.scope.user')] }), _jsxs("button", { type: "button", className: dp('dialog-inline-button'), disabled: busy, onClick: () => onToggleScope(mutation, 'workspace'), children: [mutation === 'enable'
                                ? t('extensions.manage.enable')
                                : t('extensions.manage.disable'), "\u00B7 ", t('settings.scope.workspace')] }), _jsx("button", { type: "button", className: dp('dialog-danger-button'), disabled: busy, onClick: onRequestUninstall, children: t('extensions.manage.uninstallAction') })] }), confirmingUninstall && (_jsxs("div", { className: dp('extensions-confirm'), children: [_jsx("span", { children: t('extensions.manage.uninstallConfirm', { name: extension.name }) }), _jsxs("div", { className: dp('dialog-inline-actions'), children: [_jsx("button", { type: "button", className: dp('dialog-danger-button'), disabled: busy, onClick: onConfirmUninstall, children: t('extensions.manage.uninstallAction') }), _jsx("button", { type: "button", className: dp('dialog-inline-button'), onClick: onCancelUninstall, children: t('common.cancel') })] })] })), _jsxs("div", { className: dp('extensions-detail-grid'), children: [_jsx(Detail, { label: t('extensions.manage.name'), value: extension.name }), _jsx(Detail, { label: t('extensions.manage.version'), value: extension.version }), _jsx(Detail, { label: t('extensions.manage.status'), value: statusLabel(extension, t) }), _jsx(Detail, { label: t('extensions.manage.path'), value: extension.path }), _jsx(Detail, { label: t('extensions.manage.source'), value: extension.source ?? '-' }), _jsx(Detail, { label: t('extensions.manage.commands'), value: joinList(details?.commands) }), _jsx(Detail, { label: t('extensions.manage.skills'), value: joinList(details?.skills) }), _jsx(Detail, { label: t('extensions.manage.agents'), value: joinList(details?.agents) }), _jsx(Detail, { label: t('extensions.manage.mcpServers'), value: joinList(details?.mcpServers) }), _jsx(Detail, { label: t('extensions.manage.contextFiles'), value: joinList(details?.contextFiles) }), _jsx(Detail, { label: t('extensions.manage.settings'), value: joinList(details?.settings) })] })] }));
}
function Detail({ label, value }) {
    return (_jsxs("div", { className: dp('extensions-detail-field'), children: [_jsx("span", { className: dp('extensions-detail-label'), children: cleanLabel(label) }), _jsx("span", { className: dp('extensions-detail-value'), children: value })] }));
}
//# sourceMappingURL=ExtensionsDialog.js.map