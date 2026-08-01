/**
 * useBackgroundTasks - Hook for managing active background tasks
 *
 * Tracks background agents and shells per session.
 * Updated via event handlers for task_backgrounded, shell_backgrounded, task_progress.
 */
import { type BackgroundTask } from '@/atoms/sessions';
export interface UseBackgroundTasksOptions {
    /** Session ID to track tasks for */
    sessionId: string;
}
export interface UseBackgroundTasksResult {
    /** Active background tasks for this session */
    tasks: BackgroundTask[];
    /** Add a new background task */
    addTask: (task: Omit<BackgroundTask, 'elapsedSeconds'>) => void;
    /** Update elapsed time for a task */
    updateTaskProgress: (toolUseId: string, elapsedSeconds: number) => void;
    /** Remove a task (when completed or killed) */
    removeTask: (toolUseId: string) => void;
    /** Kill a task (sends kill request via IPC) */
    killTask: (taskId: string, type: 'agent' | 'shell') => Promise<void>;
}
/**
 * Hook for managing background tasks in a session
 */
export declare function useBackgroundTasks({ sessionId }: UseBackgroundTasksOptions): UseBackgroundTasksResult;
