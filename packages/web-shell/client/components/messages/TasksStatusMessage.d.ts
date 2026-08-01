import type { DaemonSessionTasksStatus } from '@hoptrendy/sdk/daemon';
declare const ACTIVE_EVENT = "web-shell:tasks-panel-active";
export interface SerializedTasksMessage {
    snapshot: DaemonSessionTasksStatus;
}
declare const serializeTasksStatusMessage: any;
declare function parseTasksStatusMessage(content: string): SerializedTasksMessage | null;
export { serializeTasksStatusMessage, parseTasksStatusMessage };
export declare function TasksStatusMessage({ message, embedded, manageActiveEvent, onClose, }: {
    message: SerializedTasksMessage;
    embedded?: boolean;
    manageActiveEvent?: boolean;
    onClose?: () => void;
}): import("react").JSX.Element | null;
export { ACTIVE_EVENT as TASKS_STATUS_ACTIVE_EVENT };
