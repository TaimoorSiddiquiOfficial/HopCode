/**
 * PrerequisiteManager - Prerequisite Reading System
 *
 * Blocks tool calls until specified files have been read in the current context window.
 * State resets on compaction since the LLM loses the guide content.
 *
 * Key responsibilities:
 * - Track which files have been read via the Read tool
 * - Check prerequisites before tool execution (e.g., guide.md for sources)
 * - Reset state on context compaction
 */
export interface PrerequisiteRule {
    /** Match tool names that require prerequisites */
    toolMatcher: (toolName: string) => boolean;
    /** Resolve the required file path for a matched tool. Returns null to skip. */
    resolveRequiredPath: (toolName: string, workspaceRootPath: string) => string | null;
    /** Block message template. {filePath} is replaced with the required path. */
    blockMessage: string;
    /** If true, always block until file is read (no graceful fallback). */
    strict?: boolean;
}
export interface PrerequisiteCheckResult {
    allowed: boolean;
    blockReason?: string;
}
export interface PrerequisiteManagerConfig {
    workspaceRootPath: string;
    onDebug?: (message: string) => void;
}
export declare class PrerequisiteManager {
    /** Max times to block a tool for the same prerequisite before allowing through */
    private static readonly MAX_REJECTIONS;
    private readFiles;
    private rejectionCounts;
    private pendingSkillPaths;
    private workspaceRootPath;
    private onDebug?;
    constructor(config: PrerequisiteManagerConfig);
    /**
     * Register skill SKILL.md paths as prerequisites.
     * All tool calls (except Read targeting these paths) are blocked
     * until the files have been read.
     */
    registerSkillPrerequisites(paths: string[]): void;
    /**
     * Check if a tool call's prerequisites are met.
     * Iterates rules, checks if required files have been read.
     * After MAX_REJECTIONS blocks for the same path, allows through gracefully.
     */
    checkPrerequisites(toolName: string): PrerequisiteCheckResult;
    /**
     * Check dynamic skill prerequisites.
     * If pending skill paths exist and the tool is NOT a Read targeting one of them, block.
     */
    private checkSkillPrerequisites;
    /**
     * Track a Read tool call. Extracts file_path from tool input,
     * normalizes it, and adds to the read set.
     * Also clears matching pending skill paths.
     */
    trackReadTool(toolInput: Record<string, unknown>): void;
    /**
     * Check if a Bash command is reading a pending skill file.
     * If it matches, clear the prerequisite and return true.
     * Called from the pre-tool-use pipeline to allow targeted Bash reads through.
     */
    trackBashSkillRead(input: Record<string, unknown>): boolean;
    /**
     * Reset read state. Called on context compaction since the LLM
     * loses the guide content and needs to re-read.
     * Also clears pending skill paths (model lost the directive).
     */
    resetReadState(): void;
    /**
     * Check if a specific file has been read (for testing).
     */
    hasRead(filePath: string): boolean;
}
