/**
 * Tool Event Handlers
 *
 * Handles tool_start and tool_result events.
 * Pure functions that return new state - no side effects.
 */
import type { SessionState, ToolStartEvent, ToolResultEvent, TaskBackgroundedEvent, ShellBackgroundedEvent, TaskProgressEvent, TaskCompletedEvent } from '../types';
/**
 * Handle tool_start - create or update tool message
 *
 * SDK sends two events per tool: first from stream_event (empty input),
 * second from assistant message (complete input). We handle both.
 */
export declare function handleToolStart(state: SessionState, event: ToolStartEvent): SessionState;
/**
 * Handle tool_result - complete tool execution
 *
 * Updates the tool message with result. If tool not found (out-of-order),
 * creates the tool message with result included.
 */
export declare function handleToolResult(state: SessionState, event: ToolResultEvent): SessionState;
/**
 * Handle task_backgrounded - mark tool as backgrounded with task ID
 *
 * When a Task is executed with run_in_background: true, the SDK returns
 * immediately with an agentId. This event updates the tool message status
 * to 'backgrounded' and stores the taskId for later polling via TaskOutput.
 */
export declare function handleTaskBackgrounded(state: SessionState, event: TaskBackgroundedEvent): SessionState;
/**
 * Handle shell_backgrounded - mark shell as backgrounded with shell ID
 *
 * When a Bash command is executed with run_in_background: true, the SDK
 * returns immediately with a shell_id. This event updates the tool message
 * status to 'backgrounded' and stores the shellId for later reference.
 */
export declare function handleShellBackgrounded(state: SessionState, event: ShellBackgroundedEvent): SessionState;
/**
 * Handle task_progress - update elapsed time for background task
 *
 * The SDK emits tool_progress events with elapsed_time_seconds for
 * background tasks. This event updates the elapsedSeconds field on
 * the tool message to display live progress in the UI.
 */
export declare function handleTaskProgress(state: SessionState, event: TaskProgressEvent): SessionState;
/**
 * Handle task_completed - update background task message on completion
 *
 * When a background task completes, the SDK sends a task_notification.
 * This handler finds the tool message by taskId and updates its status
 * and result summary.
 */
export declare function handleTaskCompleted(state: SessionState, event: TaskCompletedEvent): SessionState;
