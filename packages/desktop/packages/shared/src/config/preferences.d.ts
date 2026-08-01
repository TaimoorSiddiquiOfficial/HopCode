export interface UserLocation {
    city?: string;
    region?: string;
    country?: string;
}
/**
 * Diff viewer display preferences
 * Persisted to preferences.json as a user-level setting
 */
export interface DiffViewerPreferences {
    /** Diff layout: 'unified' (stacked) or 'split' (side-by-side) */
    diffStyle?: 'unified' | 'split';
    /** Whether to disable background highlighting on changed lines */
    disableBackground?: boolean;
}
export interface UserPreferences {
    name?: string;
    timezone?: string;
    location?: UserLocation;
    language?: string;
    notes?: string;
    diffViewer?: DiffViewerPreferences;
    includeCoAuthoredBy?: boolean;
    updatedAt?: number;
}
export declare function loadPreferences(): UserPreferences;
export declare function savePreferences(prefs: UserPreferences): void;
export declare function updatePreferences(updates: Partial<UserPreferences>): UserPreferences;
export declare function getPreferencesPath(): string;
/**
 * Format preferences for inclusion in system prompt
 */
export declare function formatPreferencesForPrompt(): string;
/**
 * Format preferences as readable text for display
 */
export declare function formatPreferencesDisplay(): string;
/**
 * Whether the Co-Authored-By trailer should be included on git commits.
 * Defaults to true when the preference is not explicitly set.
 */
export declare function getCoAuthorPreference(): boolean;
