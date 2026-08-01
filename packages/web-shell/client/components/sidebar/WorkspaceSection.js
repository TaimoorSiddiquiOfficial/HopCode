import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState, } from 'react';
import { FolderClosedIcon, FolderOpenIcon } from 'lucide-react';
import { GitBranchIndicator } from '../GitBranchIndicator';
import { SESSION_LIST_PAGE_SIZE } from '../../constants/sessions';
import { readWorkspaceCollapsedGroupIds, writeWorkspaceCollapsedGroupIds, } from './collapsedSessionSections';
import { SessionGroupSection } from './SessionGroupSection';
import styles from './WorkspaceSection.module.css';
function cx(...classes) {
    return classes.filter(Boolean).join(' ');
}
function getWorkspaceName(cwd) {
    const parts = cwd.split(/[\\/]+/).filter(Boolean);
    return parts.at(-1) ?? cwd;
}
// The cwd-qualified daemon route only accepts a workspace id or absolute path.
// A synthetic fallback workspace (daemon reports no workspaces and the
// connection has no cwd) carries a display name in `cwd`, which is neither, so
// qualifying a request with it would only ever 400.
function isAbsolutePath(cwd) {
    return (cwd.startsWith('/') || cwd.startsWith('\\') || /^[a-zA-Z]:[\\/]/.test(cwd));
}
function getSessionLabel(session) {
    const displayName = session.displayName?.trim();
    return displayName || session.sessionId.slice(0, 8);
}
function WorkspaceFolderIcon({ open }) {
    const Icon = open ? FolderOpenIcon : FolderClosedIcon;
    return (_jsx(Icon, { className: styles.folderIcon, size: 16, strokeWidth: 1.2, "aria-hidden": "true" }));
}
export function WorkspaceSection({ workspace, renderHeader, client, reloadToken, untrustedLabel, readOnlyLabel, trustToOpenLabel, noSessionsLabel, loadErrorLabel, organizationEnabled, ungroupedLabel, formatTime, searchQuery = '', expanded: controlledExpanded, autoExpandKey, onExpandedChange, renderSessions = true, renderSession, headerActions, onRenameGroup, onDeleteGroup, renameGroupLabel, deleteGroupLabel, groupActionsDisabled, excludePinned = false, onOpenGitDiff, }) {
    const [sessions, setSessions] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loadError, setLoadError] = useState(false);
    const [internalExpanded, setInternalExpanded] = useState(false);
    const [collapsedGroupIds, setCollapsedGroupIds] = useState(() => readWorkspaceCollapsedGroupIds(workspace.id));
    const [actionsVisible, setActionsVisible] = useState(false);
    const [gitStatus, setGitStatus] = useState();
    const expanded = controlledExpanded ?? internalExpanded;
    const readOnly = !workspace.primary && !workspace.trusted;
    const disabled = workspace.primary && !workspace.trusted;
    // A workspace always starts collapsed, including the primary workspace.
    useEffect(() => {
        if (controlledExpanded === undefined)
            setInternalExpanded(false);
    }, [controlledExpanded, workspace.id]);
    // The render site keys this component by workspace id, so an id change
    // always remounts and the lazy useState initializer re-reads storage.
    useEffect(() => {
        writeWorkspaceCollapsedGroupIds(workspace.id, collapsedGroupIds);
    }, [collapsedGroupIds, workspace.id]);
    useEffect(() => {
        if (controlledExpanded === undefined && autoExpandKey) {
            setInternalExpanded(true);
        }
    }, [autoExpandKey, controlledExpanded]);
    const loadSessions = useCallback(async () => {
        if (disabled)
            return;
        try {
            const result = await client
                .workspaceByCwd(workspace.cwd)
                .listWorkspaceSessions({
                pageSize: SESSION_LIST_PAGE_SIZE,
                archiveState: 'active',
                ...(organizationEnabled
                    ? { view: 'organized', group: 'all' }
                    : {}),
            });
            setSessions(result);
            setLoadError(false);
        }
        catch (err) {
            // Surface connectivity failures so users can distinguish a broken
            // daemon from genuinely zero sessions.
            console.warn('[WorkspaceSection] session poll failed:', err);
            setLoadError(true);
        }
    }, [client, disabled, organizationEnabled, workspace.cwd]);
    useEffect(() => {
        if (!renderSessions || disabled || !organizationEnabled) {
            setGroups([]);
            return;
        }
        let cancelled = false;
        void client
            .workspaceByCwd(workspace.cwd)
            .listSessionGroups()
            .then((catalog) => {
            if (!cancelled)
                setGroups(catalog.groups);
        })
            .catch((err) => {
            console.warn('[WorkspaceSection] group catalog load failed:', err);
        });
        return () => {
            cancelled = true;
        };
    }, [
        client,
        disabled,
        organizationEnabled,
        reloadToken,
        renderSessions,
        workspace.cwd,
    ]);
    useEffect(() => {
        if (!renderSessions)
            return;
        if (!expanded && !searchQuery.trim())
            return;
        void loadSessions();
        if (readOnly)
            return;
        const timer = setInterval(() => void loadSessions(), 10_000);
        return () => clearInterval(timer);
    }, [
        expanded,
        loadSessions,
        readOnly,
        reloadToken,
        renderSessions,
        searchQuery,
    ]);
    // Undefined when `cwd` is not a real path (synthetic fallback workspace), so
    // the poll — which qualifies the route with the cwd — is skipped entirely.
    const gitPollCwd = isAbsolutePath(workspace.cwd) ? workspace.cwd : undefined;
    // Log a poll failure only on the success→failure transition, not on every
    // 60s/focus tick, so an unreachable workspace doesn't spam a long-lived tab.
    const gitPollFailed = useRef(false);
    const loadGitStatus = useCallback(async () => {
        if (!onOpenGitDiff || !workspace.trusted || !gitPollCwd)
            return;
        try {
            const status = await client.workspaceByCwd(gitPollCwd).workspaceGit();
            gitPollFailed.current = false;
            setGitStatus(status);
        }
        catch (err) {
            // Keep the last known status on a transient failure so a brief network
            // or daemon blip doesn't blank the chip for a whole poll interval; log
            // only on the success→failure transition.
            if (!gitPollFailed.current) {
                console.warn('[WorkspaceSection] git status poll failed:', err);
                gitPollFailed.current = true;
            }
        }
    }, [client, gitPollCwd, onOpenGitDiff, workspace.trusted]);
    // The git chip lives in the always-visible folder header, so it polls
    // independently of session expansion: on mount/trust, on window focus, and on
    // a visibility-gated 60s tick (the daemon recomputes the working-tree summary
    // per call, so the cadence stays gentle). Skipped entirely when no diff
    // handler is wired, since the chip — its only consumer — would not render.
    useEffect(() => {
        if (!onOpenGitDiff || !workspace.trusted || !gitPollCwd) {
            setGitStatus(undefined);
            return;
        }
        void loadGitStatus();
        const onFocus = () => void loadGitStatus();
        window.addEventListener('focus', onFocus);
        const timer = window.setInterval(() => {
            if (document.visibilityState === 'visible')
                void loadGitStatus();
        }, 60_000);
        return () => {
            window.removeEventListener('focus', onFocus);
            window.clearInterval(timer);
        };
    }, [
        gitPollCwd,
        loadGitStatus,
        onOpenGitDiff,
        reloadToken,
        workspace.trusted,
    ]);
    const visibleSessions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return sessions.filter((session) => {
            if (excludePinned && session.isPinned)
                return false;
            if (!query)
                return true;
            const label = (session.displayName || '').toLowerCase();
            return (label.includes(query) || session.sessionId.toLowerCase().includes(query));
        });
    }, [excludePinned, searchQuery, sessions]);
    const groupedSessions = useMemo(() => {
        if (!organizationEnabled || groups.length === 0)
            return null;
        const assigned = new Set();
        const sections = groups.map((group) => {
            const items = visibleSessions.filter((session) => session.groupId === group.id);
            items.forEach((session) => assigned.add(session.sessionId));
            return { group, sessions: items };
        });
        return {
            sections,
            ungrouped: visibleSessions.filter((session) => !assigned.has(session.sessionId)),
        };
    }, [groups, organizationEnabled, visibleSessions]);
    return (_jsxs("div", { className: styles.section, children: [_jsxs("div", { className: cx(styles.headerRow, disabled && styles.headerDisabled), onMouseEnter: () => setActionsVisible(true), onMouseLeave: () => setActionsVisible(false), onFocus: () => setActionsVisible(true), onBlur: (event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                        setActionsVisible(false);
                    }
                }, children: [_jsx("button", { className: styles.header, type: "button", disabled: disabled, "aria-expanded": expanded, onClick: () => {
                            const nextExpanded = !expanded;
                            setInternalExpanded(nextExpanded);
                            onExpandedChange?.(nextExpanded);
                        }, children: renderHeader ? (renderHeader(expanded)) : (_jsxs(_Fragment, { children: [_jsx("span", { className: cx(styles.chevron, expanded && styles.chevronOpen), children: _jsx(WorkspaceFolderIcon, { open: expanded }) }), _jsx("span", { className: styles.headerContent, children: _jsx("span", { className: styles.name, children: getWorkspaceName(workspace.cwd) }) }), !workspace.trusted && (_jsx("span", { className: styles.badge, children: untrustedLabel })), readOnly && (_jsx("span", { className: styles.badge, children: readOnlyLabel }))] })) }), onOpenGitDiff && workspace.trusted && gitStatus?.branch && (_jsx("span", { className: styles.gitPill, children: _jsx(GitBranchIndicator, { branch: gitStatus.branch, status: gitStatus, compact: true, onOpenDiff: () => onOpenGitDiff(workspace.cwd) }) })), headerActions?.(actionsVisible)] }), renderSessions &&
                (expanded || Boolean(searchQuery.trim())) &&
                !disabled && (_jsx("div", { className: styles.sessions, children: loadError ? (_jsx("div", { className: styles.error, role: "status", children: loadErrorLabel })) : visibleSessions.length === 0 ? (_jsx("div", { className: styles.empty, children: noSessionsLabel })) : groupedSessions ? (_jsxs(_Fragment, { children: [groupedSessions.sections.map(({ group, sessions }) => (_jsx(SessionGroupSection, { id: `group:${group.id}`, label: group.name, count: sessions.length, color: group.color, expanded: !collapsedGroupIds.has(group.id), onToggle: () => {
                                setCollapsedGroupIds((current) => {
                                    const next = new Set(current);
                                    if (next.has(group.id))
                                        next.delete(group.id);
                                    else
                                        next.add(group.id);
                                    return next;
                                });
                            }, onRename: onRenameGroup
                                ? () => onRenameGroup(group, workspace.cwd)
                                : undefined, onDelete: onDeleteGroup
                                ? () => onDeleteGroup(group, workspace.cwd)
                                : undefined, renameLabel: renameGroupLabel, deleteLabel: deleteGroupLabel, actionsDisabled: groupActionsDisabled, children: sessions.map((session) => renderSession(session)) }, group.id))), groupedSessions.ungrouped.length > 0 && (_jsx(SessionGroupSection, { id: "ungrouped", label: ungroupedLabel, count: groupedSessions.ungrouped.length, expanded: !collapsedGroupIds.has('ungrouped'), onToggle: () => {
                                setCollapsedGroupIds((current) => {
                                    const next = new Set(current);
                                    if (next.has('ungrouped'))
                                        next.delete('ungrouped');
                                    else
                                        next.add('ungrouped');
                                    return next;
                                });
                            }, children: groupedSessions.ungrouped.map((session) => renderSession(session)) }))] })) : (visibleSessions.map((session) => {
                    if (!readOnly)
                        return renderSession(session);
                    const label = getSessionLabel(session);
                    const time = session.createdAt
                        ? formatTime(session.createdAt)
                        : '';
                    return (_jsxs("div", { className: styles.sessionItemReadOnly, role: "note", "aria-label": `${label}${time ? `, ${time}` : ''}. ${trustToOpenLabel}`, children: [_jsx("span", { className: styles.sessionName, children: label }), time && _jsx("span", { className: styles.sessionTime, children: time })] }, session.sessionId));
                })) }))] }));
}
//# sourceMappingURL=WorkspaceSection.js.map