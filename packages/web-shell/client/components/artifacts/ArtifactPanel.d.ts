import type { DaemonSessionArtifact } from '@hoptrendy/sdk/daemon';
import { type DaemonWorkspaceActions } from '@hoptrendy/webui/daemon-react-sdk';
import { type TurnOutputFileChange, type TurnOutputScheduledTask } from './TurnOutputs';
export type ArtifactPanelTab = {
    id: string;
    kind: 'review';
    title: string;
} | {
    id: string;
    kind: 'artifact';
    title: string;
    artifactId: string;
    workspaceActions?: DaemonWorkspaceActions;
    previewContent?: string;
} | {
    id: string;
    kind: 'scheduled_task';
    title: string;
    task: TurnOutputScheduledTask;
    workspaceActions?: DaemonWorkspaceActions;
};
interface ArtifactPanelProps {
    artifacts: readonly DaemonSessionArtifact[];
    tabs: readonly ArtifactPanelTab[];
    activeTabId: string | null;
    reviewChanges: readonly TurnOutputFileChange[];
    selectedReviewPath: string | null;
    panelWidth?: number;
    workspaceCwd?: string;
    loading?: boolean;
    error?: string | null;
    onSelectTab: (tabId: string) => void;
    onCloseTab: (tabId: string) => void;
    onClose: () => void;
}
export declare function ArtifactPanel({ artifacts, tabs, activeTabId, reviewChanges, selectedReviewPath, panelWidth, workspaceCwd, loading, error, onSelectTab, onCloseTab, onClose, }: ArtifactPanelProps): import("react").JSX.Element;
export {};
