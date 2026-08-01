import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { WifiOffIcon } from 'lucide-react';
import { DaemonSessionProvider, useWorkspace, useWorkspaceActions, } from '@hoptrendy/webui/daemon-react-sdk';
import { App } from '../App';
import { WEB_SHELL_HISTORY_PAGE_SIZE, WEB_SHELL_MAX_TRANSCRIPT_BLOCKS, } from '../constants/sessions';
import { getTranslator, normalizeLanguage } from '../i18n';
import { Spinner } from './ui/spinner';
import { WorkspaceUnavailableState } from './WorkspaceUnavailableState';
export function WorkspaceSessionProvider({ sessionId, workspaceId, workspaceCwd, lockWorkspaceCwd, clientId, restartSseOnPrompt, webShellProps, }) {
    const workspace = useWorkspace();
    const workspaceActions = useWorkspaceActions();
    const [usePrimaryNewSession, setUsePrimaryNewSession] = useState(false);
    const [registeredWorkspace, setRegisteredWorkspace] = useState();
    const [registrationErrorCwd, setRegistrationErrorCwd] = useState();
    const registrationRef = useRef(undefined);
    useEffect(() => setUsePrimaryNewSession(false), [sessionId, lockWorkspaceCwd, workspaceCwd, workspaceId]);
    const effectiveSessionId = usePrimaryNewSession ? undefined : sessionId;
    const effectiveWorkspaceCwd = usePrimaryNewSession
        ? undefined
        : (lockWorkspaceCwd ?? workspaceCwd);
    const effectiveWorkspaceId = effectiveWorkspaceCwd ? undefined : workspaceId;
    const pathWorkspace = useMemo(() => {
        const listedWorkspace = workspace.capabilities?.workspaces?.find((entry) => entry.cwd === effectiveWorkspaceCwd);
        if (listedWorkspace)
            return listedWorkspace;
        if (effectiveWorkspaceCwd &&
            effectiveWorkspaceCwd === workspace.capabilities?.workspaceCwd) {
            return {
                id: 'primary',
                cwd: effectiveWorkspaceCwd,
                primary: true,
                trusted: true,
            };
        }
        return undefined;
    }, [
        effectiveWorkspaceCwd,
        workspace.capabilities?.workspaceCwd,
        workspace.capabilities?.workspaces,
    ]);
    const registeredLockedWorkspace = lockWorkspaceCwd && registeredWorkspace?.requestedCwd === lockWorkspaceCwd
        ? registeredWorkspace.workspace
        : undefined;
    const targetWorkspace = effectiveWorkspaceCwd
        ? (pathWorkspace ?? registeredLockedWorkspace)
        : workspace.capabilities?.workspaces?.find((entry) => entry.id === effectiveWorkspaceId);
    const t = useMemo(() => getTranslator(normalizeLanguage(webShellProps.language)), [webShellProps.language]);
    useEffect(() => {
        if (!lockWorkspaceCwd || !workspace.capabilities || pathWorkspace)
            return;
        if (registeredWorkspace?.requestedCwd === lockWorkspaceCwd)
            return;
        if (registrationErrorCwd === lockWorkspaceCwd)
            return;
        if (registrationRef.current?.cwd !== lockWorkspaceCwd) {
            registrationRef.current = {
                cwd: lockWorkspaceCwd,
                promise: workspaceActions
                    .addWorkspace(lockWorkspaceCwd, { persist: true })
                    .then((result) => {
                    if (result.persisted !== true) {
                        throw new Error('Workspace registration was not persisted');
                    }
                    return result;
                }),
            };
        }
        let cancelled = false;
        void registrationRef.current.promise
            .then(async (result) => {
            if (cancelled)
                return;
            setRegisteredWorkspace({
                requestedCwd: lockWorkspaceCwd,
                workspace: result,
            });
            setRegistrationErrorCwd(undefined);
            try {
                await workspace.refreshCapabilities?.();
            }
            catch {
                // Registration succeeded; a later capabilities refresh can reconcile.
            }
        })
            .catch(() => {
            if (!cancelled) {
                setRegistrationErrorCwd(lockWorkspaceCwd);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [
        pathWorkspace,
        registeredWorkspace,
        registrationErrorCwd,
        workspace,
        workspace.capabilities,
        workspace.refreshCapabilities,
        workspaceActions,
        lockWorkspaceCwd,
    ]);
    if ((effectiveWorkspaceCwd || effectiveWorkspaceId) &&
        workspace.status === 'error') {
        return (_jsx(WorkspaceUnavailableState, { title: t('workspace.loadFailed'), description: t('workspace.loadFailedDescription'), actionLabel: t('common.retry'), theme: webShellProps.theme, icon: _jsx(WifiOffIcon, {}), onAction: () => {
                void workspace.refreshCapabilities?.().catch(() => { });
            } }));
    }
    if ((effectiveWorkspaceCwd || effectiveWorkspaceId) &&
        !workspace.capabilities) {
        return (_jsxs("div", { "data-web-shell-root": true, "data-web-shell-shadcn": true, className: `flex min-h-32 w-full items-center justify-center gap-2 text-sm text-muted-foreground ${webShellProps.theme === 'dark' ? 'dark' : ''}`, role: "status", "aria-live": "polite", children: [_jsx(Spinner, {}), _jsx("span", { children: t('common.loading') })] }));
    }
    if (lockWorkspaceCwd && registrationErrorCwd === lockWorkspaceCwd) {
        return (_jsx(WorkspaceUnavailableState, { title: t('workspace.loadFailed'), description: t('workspace.loadFailedDescription'), actionLabel: t('common.retry'), theme: webShellProps.theme, icon: _jsx(WifiOffIcon, {}), onAction: () => {
                registrationRef.current = undefined;
                setRegistrationErrorCwd(undefined);
            } }));
    }
    if (lockWorkspaceCwd && !targetWorkspace) {
        return (_jsxs("div", { "data-web-shell-root": true, "data-web-shell-shadcn": true, className: `flex min-h-32 w-full items-center justify-center gap-2 text-sm text-muted-foreground ${webShellProps.theme === 'dark' ? 'dark' : ''}`, role: "status", "aria-live": "polite", children: [_jsx(Spinner, {}), _jsx("span", { children: t('common.loading') })] }));
    }
    if ((effectiveWorkspaceCwd || effectiveWorkspaceId) && !targetWorkspace) {
        return (_jsx(WorkspaceUnavailableState, { title: t('workspace.notFound'), description: t('workspace.notFoundDescription'), actionLabel: t('session.new'), theme: webShellProps.theme, onAction: () => {
                setUsePrimaryNewSession(true);
                webShellProps.onSessionIdChange?.(undefined, undefined);
            } }));
    }
    return (_jsx(DaemonSessionProvider, { sessionId: effectiveSessionId, workspaceCwd: targetWorkspace?.cwd, clientId: clientId, historyPageSize: WEB_SHELL_HISTORY_PAGE_SIZE, maxBlocks: WEB_SHELL_MAX_TRANSCRIPT_BLOCKS, suppressOwnUserEcho: true, restartEventStreamOnPrompt: restartSseOnPrompt, children: _jsx(App, { ...webShellProps, restartSseOnPrompt: restartSseOnPrompt, lockedWorkspaceCwd: lockWorkspaceCwd ? targetWorkspace?.cwd : undefined, lockedWorkspaceCapability: lockWorkspaceCwd ? targetWorkspace : undefined }) }, `${targetWorkspace?.id ?? effectiveWorkspaceId ?? 'primary'}:${effectiveSessionId ?? 'new'}`));
}
//# sourceMappingURL=WorkspaceSessionProvider.js.map