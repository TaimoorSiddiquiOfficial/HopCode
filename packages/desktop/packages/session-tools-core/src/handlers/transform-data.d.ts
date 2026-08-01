/**
 * Transform Data Handler
 *
 * Transforms data files using Python/Node/Bun scripts for
 * datatable/spreadsheet/html-preview blocks.
 *
 * Runs scripts in an isolated subprocess with sensitive env vars stripped.
 */
import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface TransformDataArgs {
    language: 'python3' | 'node' | 'bun';
    script: string;
    inputFiles: string[];
    outputFile: string;
}
/**
 * Handle the transform_data tool call.
 *
 * 1. Validates input/output file paths are within session boundaries
 * 2. Writes script to temp file
 * 3. Spawns subprocess with env var isolation
 * 4. Returns absolute output path for use in datatable/html-preview blocks
 */
export declare function handleTransformData(ctx: SessionToolContext, args: TransformDataArgs): Promise<ToolResult>;
