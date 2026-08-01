export interface HopCodeMemorySettings {
    enableManagedAutoMemory: boolean;
    enableManagedAutoDream: boolean;
    enableTeamMemory: boolean;
    enableTeamMemorySync: boolean;
    enableAutoSkill: boolean;
    autoSkillConfirm: boolean;
}
export interface HopCodeMemoryPaths {
    userMemoryFile: string;
    projectMemoryFile: string;
    autoMemoryDir: string;
}
export type HopCodeMemoryPathTarget = 'user' | 'project' | 'auto';
export declare const DEFAULT_HOPCODE_MEMORY_SETTINGS: HopCodeMemorySettings;
export declare function normalizeHopCodeMemorySettings(value: unknown): HopCodeMemorySettings;
