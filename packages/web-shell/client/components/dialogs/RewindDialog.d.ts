import type { DaemonRewindSnapshotInfo, DaemonTranscriptBlock } from '@hoptrendy/sdk/daemon';
interface RewindDialogProps {
    blocks: readonly DaemonTranscriptBlock[];
    loadSnapshots: () => Promise<{
        snapshots: DaemonRewindSnapshotInfo[];
    }>;
    rewind: (promptId: string) => Promise<void>;
    onError: (error: unknown) => void;
    onClose: () => void;
}
export declare function RewindDialog({ blocks, loadSnapshots, rewind, onError, onClose, }: RewindDialogProps): import("react").JSX.Element;
export {};
