import type { Page } from '@playwright/test';
import { type DaemonCapabilities, type DaemonEvent, type DaemonSessionGroup, type DaemonSessionState, type DaemonSessionSummary, type DaemonWorkspaceExtensionsStatus, type DaemonWorkspaceProvidersStatus, type DaemonWorkspaceSettingsStatus, type DaemonWorkspaceSkillsStatus, type ExtensionActiveOperations, type ExtensionUpdateCheckResponse } from '@hoptrendy/sdk/daemon';
import { type SseTransport } from './sseTransport';
export interface DaemonRequestRecord {
    method: string;
    path: string;
    body: unknown;
    headers: Record<string, string>;
}
export interface WebShellDaemonScenario {
    workspaceCwd: string;
    sessionId: string;
    clientId: string;
    displayName: string;
    currentModel: string;
    currentMode: string;
    capabilities: DaemonCapabilities;
    providers: DaemonWorkspaceProvidersStatus;
    skills: DaemonWorkspaceSkillsStatus;
    settings: DaemonWorkspaceSettingsStatus;
    extensions: DaemonWorkspaceExtensionsStatus;
    extensionOperations: ExtensionActiveOperations;
    extensionUpdateCheck: ExtensionUpdateCheckResponse;
    sessions: DaemonSessionSummary[];
    sessionGroups: DaemonSessionGroup[];
    events: DaemonEvent[];
    state: DaemonSessionState;
}
export interface MockDaemonController {
    scenario: WebShellDaemonScenario;
    sse: SseTransport<DaemonEvent>;
    requests: readonly DaemonRequestRecord[];
    sendEvent(event: DaemonEvent): Promise<void>;
    burstEvents(events: readonly DaemonEvent[]): Promise<void>;
    promptRequests(): DaemonRequestRecord[];
    permissionRequests(): DaemonRequestRecord[];
    modelRequests(): DaemonRequestRecord[];
}
type ScenarioOverrides = Partial<Omit<WebShellDaemonScenario, 'capabilities' | 'providers' | 'skills' | 'settings' | 'extensions' | 'extensionOperations' | 'extensionUpdateCheck' | 'sessions' | 'sessionGroups' | 'state'>> & {
    capabilities?: Partial<DaemonCapabilities>;
    providers?: Partial<DaemonWorkspaceProvidersStatus>;
    skills?: Partial<DaemonWorkspaceSkillsStatus>;
    settings?: Partial<DaemonWorkspaceSettingsStatus>;
    extensions?: Partial<DaemonWorkspaceExtensionsStatus>;
    extensionOperations?: Partial<ExtensionActiveOperations>;
    extensionUpdateCheck?: Partial<ExtensionUpdateCheckResponse>;
    sessions?: DaemonSessionSummary[];
    sessionGroups?: DaemonSessionGroup[];
    state?: Partial<DaemonSessionState>;
};
export declare function applyScenarioCurrentModel(scenario: WebShellDaemonScenario, modelId: string): void;
export declare function createWebShellDaemonScenario(overrides?: ScenarioOverrides): WebShellDaemonScenario;
export declare function installMockDaemon(page: Page, scenario: WebShellDaemonScenario, options?: {
    baseURL?: string;
}): Promise<MockDaemonController>;
export declare function userTextEvent(text: string, options?: {
    id?: number;
    sessionId?: string;
}): DaemonEvent;
export declare function assistantTextEvent(text: string, options?: {
    id?: number;
    sessionId?: string;
}): DaemonEvent;
export declare function turnCompleteEvent(promptId: string, options?: {
    id?: number;
    sessionId?: string;
}): DaemonEvent;
export declare function replayCompleteEvent(options?: {
    replayedCount?: number;
    sessionId?: string;
}): DaemonEvent;
export declare function permissionRequestEvent(requestId: string, options?: {
    id?: number;
    sessionId?: string;
}): DaemonEvent;
export {};
