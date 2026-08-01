export type CliDomainNamespace = 'label' | 'source' | 'skill' | 'automation' | 'permission' | 'theme';
export interface CliDomainPolicy {
    namespace: CliDomainNamespace;
    helpCommand: string;
    workspacePathScopes: string[];
    readActions: string[];
    quickExamples: string[];
    /** Optional workspace-relative paths guarded for direct Bash operations */
    bashGuardPaths?: string[];
}
export declare const CLI_DOMAIN_POLICIES: Record<CliDomainNamespace, CliDomainPolicy>;
export interface CliDomainScopeEntry {
    namespace: CliDomainNamespace;
    scope: string;
}
/**
 * Canonical workspace-relative path scopes owned by craft-agent CLI domains.
 * Use these for file-path ownership checks to avoid drift across call sites.
 */
export declare const CRAFT_AGENTS_CLI_OWNED_WORKSPACE_PATH_SCOPES: string[];
/**
 * Canonical workspace-relative path scopes guarded for direct Bash operations.
 */
export declare const CRAFT_AGENTS_CLI_OWNED_BASH_GUARD_PATH_SCOPES: string[];
/**
 * Namespace-aware workspace scope entries for craft-agent CLI owned paths.
 */
export declare const CRAFT_AGENTS_CLI_WORKSPACE_SCOPE_ENTRIES: CliDomainScopeEntry[];
/**
 * Namespace-aware Bash guard scope entries.
 */
export declare const CRAFT_AGENTS_CLI_BASH_GUARD_SCOPE_ENTRIES: CliDomainScopeEntry[];
export interface BashPatternRule {
    pattern: string;
    comment: string;
}
/**
 * Derive the canonical Plan-mode read-only craft-agent bash patterns from
 * CLI domain policies. Keeps permissions regexes aligned with command metadata.
 */
export declare function getCraftAgentReadOnlyBashPatterns(): BashPatternRule[];
export declare function getCliDomainPolicy(namespace: CliDomainNamespace): CliDomainPolicy;
