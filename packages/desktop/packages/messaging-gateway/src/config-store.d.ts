/**
 * ConfigStore — workspace-scoped messaging config.json persistence.
 *
 * Stored at `{storageDir}/config.json`. Shape is `MessagingConfig`.
 * One-shot migration from a legacy directory is supported (mirrors BindingStore).
 */
import { type MessagingConfig, type MessagingLogger } from './types';
export declare class ConfigStore {
    private readonly dirPath;
    private readonly filePath;
    private readonly log;
    private config;
    constructor(storageDir: string, legacyDir?: string, logger?: MessagingLogger);
    get(): MessagingConfig;
    update(partial: Partial<MessagingConfig>): MessagingConfig;
    private migrateLegacy;
    private load;
    private save;
}
