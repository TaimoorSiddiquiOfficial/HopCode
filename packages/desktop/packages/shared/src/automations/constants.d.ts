/** Canonical config filename */
export declare const AUTOMATIONS_CONFIG_FILE = "automations.json";
/** History log filename */
export declare const AUTOMATIONS_HISTORY_FILE = "automations-history.jsonl";
/** Persistent retry queue filename */
export declare const AUTOMATIONS_RETRY_QUEUE_FILE = "automations-retry-queue.jsonl";
/** Default HTTP method for webhook actions */
export declare const DEFAULT_WEBHOOK_METHOD = "POST";
/** Maximum length for string fields written to automations-history.jsonl (error, responseBody, prompt). */
export declare const HISTORY_FIELD_MAX_LENGTH = 2000;
/** Max history entries retained per automation ID. */
export declare const AUTOMATION_HISTORY_MAX_RUNS_PER_MATCHER = 20;
/** Max total history entries across all automations (global safety cap). */
export declare const AUTOMATION_HISTORY_MAX_ENTRIES = 1000;
