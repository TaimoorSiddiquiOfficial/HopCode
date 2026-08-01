import type { DaemonSessionArtifact } from '@hoptrendy/sdk/daemon';
import type { DaemonWorkspaceActions } from '@hoptrendy/webui/daemon-react-sdk';
export interface TurnOutputFileChange {
    path: string;
    status: 'created' | 'modified';
    toolCallId: string;
    isArtifact: boolean;
    additions?: number;
    deletions?: number;
    diffs: TurnOutputFileDiff[];
}
export interface TurnOutputFileDiff {
    oldText: string;
    newText: string;
    fileDiff?: string;
    fullContent?: boolean;
}
export interface TurnOutputScheduledTask {
    id: string;
    toolCallId: string;
    title: string;
    cron: string;
    prompt: string;
    recurring: boolean;
    durable: boolean;
    display?: string;
}
export type TurnOutputKind = 'file' | 'artifact' | 'scheduled_task';
export declare const TURN_OUTPUT_KINDS: readonly TurnOutputKind[];
export type TurnOutputOpenRequest = {
    id: 'review';
    kind: 'review';
    title: string;
    turnId: string;
    changes: readonly TurnOutputFileChange[];
    selectedPath?: string;
} | {
    id: string;
    kind: 'artifact';
    title: string;
    turnId: string;
    artifactId: string;
    artifact: DaemonSessionArtifact;
    workspaceActions?: DaemonWorkspaceActions;
    previewContent?: string;
} | {
    id: string;
    kind: 'scheduled_task';
    title: string;
    turnId: string;
    task: TurnOutputScheduledTask;
    workspaceActions?: DaemonWorkspaceActions;
};
interface TurnOutputsProps {
    turnId: string;
    changes: readonly TurnOutputFileChange[];
    artifacts: readonly DaemonSessionArtifact[];
    scheduledTasks: readonly TurnOutputScheduledTask[];
    workspaceCwd?: string;
    onOpenRequest?: (request: TurnOutputOpenRequest) => void;
    onReviewChanges: (changes: readonly TurnOutputFileChange[], selectedPath?: string) => void;
    onOpenArtifact: (artifactId: string, previewContent?: string) => void;
    onOpenScheduledTask: (task: TurnOutputScheduledTask) => void;
}
declare function TurnOutputsComponent({ turnId, changes, artifacts, scheduledTasks, workspaceCwd, onOpenRequest, onReviewChanges, onOpenArtifact, onOpenScheduledTask, }: TurnOutputsProps): import("react").JSX.Element | null;
export declare const TurnOutputs: import("react").MemoExoticComponent<typeof TurnOutputsComponent>;
export declare function getArtifactPreviewContent(artifact: DaemonSessionArtifact, changes: readonly TurnOutputFileChange[], workspaceCwd?: string): string | undefined;
export declare function displayPath(path: string, workspaceCwd?: string): any;
export {};
