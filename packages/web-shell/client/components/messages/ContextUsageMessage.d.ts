import type { DaemonSessionContextUsageStatus } from '@hoptrendy/webui/daemon-react-sdk';
export declare function serializeContextUsageMessage(status: DaemonSessionContextUsageStatus): string;
export declare function parseContextUsageMessage(content: string): DaemonSessionContextUsageStatus | null;
export declare function ContextUsageMessage({ status, onShowDetail, }: {
    status: DaemonSessionContextUsageStatus;
    /** Run /context detail, exactly like typing it. */
    onShowDetail?: () => void;
}): import("react").JSX.Element;
