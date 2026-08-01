export type BrowserOwnershipReleaser = {
    clearVisualsForSession(sessionId: string): Promise<void>;
    unbindAllForSession(sessionId: string): void;
};
export declare function releaseBrowserOwnershipOnForcedStop(browserPaneManager: BrowserOwnershipReleaser | null | undefined, sessionId: string): Promise<void>;
