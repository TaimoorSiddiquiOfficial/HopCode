import type { ACPToolCall } from './types';
export declare function isTaskExecutionRaw(raw: unknown): boolean;
export declare function isSubAgentToolCall(tool: ACPToolCall): boolean;
export declare function isBackgroundSubAgentToolCall(tool: ACPToolCall): boolean;
