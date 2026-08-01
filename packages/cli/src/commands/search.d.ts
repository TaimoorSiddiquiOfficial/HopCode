/**
 * `hopcode search` — full-text search across session history.
 *
 * Scans ~/.hopcode/projects/<project>/chats/*.jsonl and returns messages
 * matching the query string. Supports filtering by date and model.
 *
 * Usage:
 *   hopcode search "fix the bug"
 *   hopcode search "typescript error" --limit 20
 *   hopcode search "refactor" --since 2025-01-01
 *   hopcode search "prompt" --model gpt-4
 */
import type { CommandModule } from 'yargs';
interface SearchArgs {
    query: string;
    limit: number;
    since?: string;
    model?: string;
    context: number;
    json: boolean;
}
export declare const searchCommand: CommandModule<object, SearchArgs>;
export {};
