/**
 * BindingStore — workspace-scoped persistence for channel bindings.
 *
 * Stores bindings in an explicit storage directory (passed by the caller).
 * In Electron this is `~/.craft-agent/workspaces/{wsId}/messaging/`, but tests
 * can point it at any directory.
 *
 * One-shot migration: if a legacy path is provided and contains a bindings.json
 * that the new path does not, the legacy file is copied forward on construction.
 */
import type { ChannelBinding, MessagingLogger, PlatformType } from './types';
export declare class BindingStore {
    private bindings;
    private readonly filePath;
    private readonly dirPath;
    private readonly log;
    private changeListener?;
    /**
     * @param storageDir  Absolute path to the directory where bindings.json is stored.
     * @param legacyDir   Optional legacy directory. If its bindings.json exists and
     *                    the new location does not, the file is copied forward once.
     */
    constructor(storageDir: string, legacyDir?: string, logger?: MessagingLogger);
    /** Register a callback fired after any mutation is persisted. */
    onChange(fn: () => void): void;
    findByChannel(platform: PlatformType, channelId: string): ChannelBinding | undefined;
    findBySession(sessionId: string): ChannelBinding[];
    getAll(): ChannelBinding[];
    bind(workspaceId: string, sessionId: string, platform: PlatformType, channelId: string, channelName?: string, config?: Partial<ChannelBinding['config']>): ChannelBinding;
    unbind(platform: PlatformType, channelId: string): boolean;
    unbindById(bindingId: string): boolean;
    unbindSession(sessionId: string, platform?: PlatformType): number;
    private migrateLegacy;
    private load;
    private save;
}
