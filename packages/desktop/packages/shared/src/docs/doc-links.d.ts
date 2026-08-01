/**
 * Documentation links and summaries for contextual help throughout the UI.
 * Summaries provide quick context; "Learn more" opens the full docs.
 */
export type DocFeature = 'sources' | 'sources-api' | 'sources-mcp' | 'sources-local' | 'skills' | 'statuses' | 'permissions' | 'labels' | 'workspaces' | 'themes' | 'app-settings' | 'preferences' | 'automations';
export interface DocInfo {
    /** Path relative to DOC_BASE_URL */
    path: string;
    /** Display title for the help popover */
    title: string;
    /** 1-2 sentence summary for quick context */
    summary: string;
}
export declare const DOCS: Record<DocFeature, DocInfo>;
/**
 * Get the full documentation URL for a feature
 */
export declare function getDocUrl(feature: DocFeature): string;
/**
 * Get the doc info (title, summary, path) for a feature
 */
export declare function getDocInfo(feature: DocFeature): DocInfo;
