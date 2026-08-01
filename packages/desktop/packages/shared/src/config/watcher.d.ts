/**
 * Config File Watcher
 *
 * Watches configuration files for changes and triggers callbacks.
 * Uses recursive directory watching for simplicity and reliability.
 *
 * Watched paths:
 * - ~/.craft-agent/config.json - Main app configuration
 * - ~/.craft-agent/preferences.json - User preferences
 * - ~/.craft-agent/theme.json - App-level theme overrides
 * - ~/.craft-agent/themes/*.json - Preset theme files (app-level)
 * - ~/.craft-agent/workspaces/{slug}/ - Workspace directory (recursive)
 *   - sources/{slug}/config.json, guide.md, permissions.json
 *   - skills/{slug}/SKILL.md, icon.*
 *   - sessions/{id}/session.jsonl (header metadata only)
 *   - permissions.json
 */
import { type StoredConfig } from './storage.ts';
import { type ValidationResult } from './validators.ts';
import type { LoadedSource, SourceGuide } from '../sources/types.ts';
import type { LoadedSkill } from '../skills/types.ts';
import type { SessionHeader } from '../sessions/types.ts';
import type { ThemeOverrides, PresetTheme } from './theme.ts';
/** Exported for testing only */
export declare function _getActiveWatchers(): ReadonlyMap<string, string>;
/**
 * User preferences structure (mirrors UserPreferencesSchema)
 */
export interface UserPreferences {
    name?: string;
    timezone?: string;
    location?: {
        city?: string;
        region?: string;
        country?: string;
    };
    language?: string;
    notes?: string;
    updatedAt?: number;
}
/**
 * Callbacks for config changes
 */
export interface ConfigWatcherCallbacks {
    /** Called when config.json changes */
    onConfigChange?: (config: StoredConfig) => void;
    /** Called when preferences.json changes */
    onPreferencesChange?: (prefs: UserPreferences) => void;
    /** Called when LLM connections array changes (add/remove/update connections) */
    onLlmConnectionsChange?: (connections: import('./storage.ts').LlmConnection[]) => void;
    /** Called when a specific source config changes (null if deleted) */
    onSourceChange?: (slug: string, source: LoadedSource | null) => void;
    /** Called when a source's guide.md changes */
    onSourceGuideChange?: (slug: string, guide: SourceGuide) => void;
    /** Called when the sources list changes (add/remove folders) */
    onSourcesListChange?: (sources: LoadedSource[]) => void;
    /** Called when a specific skill changes (null if deleted) */
    onSkillChange?: (slug: string, skill: LoadedSkill | null) => void;
    /** Called when the skills list changes (add/remove folders) */
    onSkillsListChange?: (skills: LoadedSkill[]) => void;
    /** Called when app-level default permissions change (~/.craft-agent/permissions/default.json) */
    onDefaultPermissionsChange?: () => void;
    /** Called when workspace permissions.json changes */
    onWorkspacePermissionsChange?: (workspaceId: string) => void;
    /** Called when a source's permissions.json changes */
    onSourcePermissionsChange?: (sourceSlug: string) => void;
    /** Called when statuses config.json changes */
    onStatusConfigChange?: (workspaceId: string) => void;
    /** Called when a status icon file changes */
    onStatusIconChange?: (workspaceId: string, iconFilename: string) => void;
    /** Called when labels config.json changes */
    onLabelConfigChange?: (workspaceId: string) => void;
    /** Called when automations.json changes */
    onAutomationsConfigChange?: (workspaceId: string) => void;
    /** Called when a session's JSONL header is modified externally (labels, name, flags, etc.) */
    onSessionMetadataChange?: (sessionId: string, header: SessionHeader) => void;
    /** Called when app-level theme.json changes */
    onAppThemeChange?: (theme: ThemeOverrides | null) => void;
    /** Called when a preset theme file changes (null if deleted) */
    onPresetThemeChange?: (themeId: string, theme: PresetTheme | null) => void;
    /** Called when the preset themes list changes (add/remove files) */
    onPresetThemesListChange?: (themes: PresetTheme[]) => void;
    /** Called when a validation error occurs */
    onValidationError?: (file: string, result: ValidationResult) => void;
    /** Called when an error occurs reading/parsing a file */
    onError?: (file: string, error: Error) => void;
}
/**
 * Load preferences from file
 */
export declare function loadPreferences(): UserPreferences | null;
/**
 * Watches config files and triggers callbacks on changes.
 * Uses recursive directory watching for workspace files.
 */
export declare class ConfigWatcher {
    private workspaceId;
    private callbacks;
    private watchers;
    private debounceTimers;
    private isRunning;
    private knownSources;
    private knownSkills;
    private knownThemes;
    private lastLlmConnectionsHash;
    private workspaceDir;
    private sourcesDir;
    private skillsDir;
    constructor(workspaceIdOrPath: string, callbacks: ConfigWatcherCallbacks);
    /**
     * Get the workspace slug this watcher is scoped to
     */
    getWorkspaceSlug(): string;
    /**
     * Start watching config files
     */
    start(): void;
    /**
     * Initialize LLM connections hash for change detection
     */
    private initLlmConnectionsHash;
    /**
     * Manually notify the watcher of a file change.
     * Workaround: Bun's fs.watch({ recursive: true }) on Linux doesn't track
     * files in directories created after the watcher started.
     * See: https://github.com/oven-sh/bun/issues/15939
     * See: https://github.com/oven-sh/bun/issues/15085
     * When these are fixed, this method and its call sites can be removed.
     */
    notifyFileChange(relativePath: string): void;
    /**
     * Stop watching all files
     */
    stop(): void;
    /**
     * Watch global config files (config.json, preferences.json)
     */
    private watchGlobalConfigs;
    /**
     * Watch workspace directory recursively
     */
    private watchWorkspaceDir;
    /**
     * Handle a file change within the workspace directory
     */
    private handleWorkspaceFileChange;
    /**
     * Debounce a handler by key
     */
    private debounce;
    /**
     * Scan sources directory to populate known sources
     */
    private scanSources;
    /**
     * Handle sources directory change (add/remove folders)
     */
    private handleSourcesDirChange;
    /**
     * Handle source config.json change
     * Downloads icon if URL specified and no local icon exists
     */
    private handleSourceConfigChange;
    /**
     * Handle source guide.md change
     */
    private handleSourceGuideChange;
    /**
     * Handle source permissions.json change
     */
    private handleSourcePermissionsChange;
    /**
     * Scan skills directory to populate known skills
     */
    private scanSkills;
    /**
     * Handle skills directory change (add/remove folders)
     */
    private handleSkillsDirChange;
    /**
     * Handle skill SKILL.md or icon change.
     * If the skill has an icon URL in metadata but no local icon file,
     * downloads the icon and emits another change event after completion.
     */
    private handleSkillChange;
    /**
     * Handle workspace permissions.json change
     */
    private handleWorkspacePermissionsChange;
    /**
     * Handle config.json change
     */
    private handleConfigChange;
    /**
     * Handle preferences.json change
     */
    private handlePreferencesChange;
    /**
     * Handle statuses config.json change
     * Downloads icons for any status with URL icon and no local file
     */
    private handleStatusConfigChange;
    /**
     * Handle status icon file change
     */
    private handleStatusIconChange;
    /**
     * Handle labels config.json change.
     */
    private handleLabelConfigChange;
    /**
     * Handle automations config change.
     */
    private handleAutomationsConfigChange;
    /**
     * Handle session.jsonl change — reads only line 1 (header) and emits if valid.
     * This enables detection of external metadata changes (labels, name, flags)
     * made by other instances, scripts, or manual edits.
     */
    private handleSessionMetadataChange;
    /**
     * Handle app-level theme.json change
     */
    private handleAppThemeChange;
    /**
     * Watch app-level themes directory (~/.craft-agent/themes/)
     */
    private watchAppThemesDir;
    /**
     * Watch app-level permissions directory (~/.craft-agent/permissions/)
     * Watches for changes to default.json which contains the default read-only patterns
     */
    private watchAppPermissionsDir;
    /**
     * Handle default.json permissions change (app-level)
     */
    private handleDefaultPermissionsChange;
    /**
     * Scan app-level themes directory to populate known themes
     */
    private scanAppThemes;
    /**
     * Handle preset theme file change (app-level)
     */
    private handlePresetThemeChange;
}
/**
 * Create and start a config watcher for a specific workspace.
 * Returns the watcher instance for later cleanup.
 */
export declare function createConfigWatcher(workspaceId: string, callbacks: ConfigWatcherCallbacks): ConfigWatcher;
