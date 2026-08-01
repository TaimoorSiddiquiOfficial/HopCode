export type ResolvedMarkdownLinkTarget = {
    kind: 'file';
    path: string;
} | {
    kind: 'url';
    url: string;
};
/**
 * Resolve markdown link targets for click dispatch.
 *
 * - Raw filesystem paths are routed through onFileClick
 * - Explicit file:// URLs are normalized to filesystem paths and also routed through onFileClick
 * - Everything else is treated as a URL and routed through onUrlClick
 */
export declare function resolveMarkdownLinkTarget(target: string): ResolvedMarkdownLinkTarget;
/**
 * Backward-compatible classifier for tests and existing callers that only need the kind.
 */
export declare function classifyMarkdownLinkTarget(target: string): 'file' | 'url';
