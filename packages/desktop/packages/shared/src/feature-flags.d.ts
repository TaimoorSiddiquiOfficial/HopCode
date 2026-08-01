/**
 * Feature flags for controlling experimental or in-development features.
 */
/**
 * Shared runtime detector for development/debug environments.
 *
 * Use this instead of app-specific debug flags (e.g., Electron main isDebugMode)
 * so behavior stays consistent across shared code and subprocess backends.
 */
export declare function isDevRuntime(): boolean;
/**
 * Runtime-evaluated check for developer feedback feature.
 * Explicit env override has precedence over dev-runtime defaults.
 */
export declare function isDeveloperFeedbackEnabled(): boolean;
/**
 * Runtime-evaluated check for craft-agents-cli integration.
 *
 * Defaults to disabled. Override with CRAFT_FEATURE_CRAFT_AGENTS_CLI=1|0.
 */
export declare function isCraftAgentsCliEnabled(): boolean;
/**
 * Runtime-evaluated check for embedded server settings page.
 *
 * Defaults to disabled. Override with CRAFT_FEATURE_EMBEDDED_SERVER=1|0.
 */
export declare function isEmbeddedServerEnabled(): boolean;
export declare const FEATURE_FLAGS: {
    /** Enable Opus 4.7 fast mode (speed:"fast" + beta header). 6x pricing. */
    readonly fastMode: false;
    /** Show session label/tag management UI. */
    readonly sessionLabelsUi: false;
    /**
     * Enable agent developer feedback tool.
     *
     * Defaults to enabled in explicit development runtimes; disabled otherwise.
     * Override with CRAFT_FEATURE_DEVELOPER_FEEDBACK=1|0.
     */
    readonly developerFeedback: boolean;
    /**
     * Enable craft-agent CLI guidance and guardrails.
     *
     * Defaults to disabled. Override with CRAFT_FEATURE_CRAFT_AGENTS_CLI=1|0.
     */
    readonly craftAgentsCli: boolean;
    /**
     * Enable embedded server settings page.
     *
     * Defaults to disabled. Override with CRAFT_FEATURE_EMBEDDED_SERVER=1|0.
     */
    readonly embeddedServer: boolean;
};
