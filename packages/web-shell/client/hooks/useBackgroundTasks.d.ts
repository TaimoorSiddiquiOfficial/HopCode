import type { DaemonSessionTaskStatus } from '@hoptrendy/sdk/daemon';
export declare function useBackgroundTasks(taskActivityKey: string, connected: boolean, refreshTrigger?: number): DaemonSessionTaskStatus[];
