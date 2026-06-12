export interface HopCodeMemorySettings {
  enableManagedAutoMemory: boolean;
  enableManagedAutoDream: boolean;
  enableAutoSkill: boolean;
}

export interface HopCodeMemoryPaths {
  userMemoryFile: string;
  projectMemoryFile: string;
  autoMemoryDir: string;
}

export type HopCodeMemoryPathTarget = 'user' | 'project' | 'auto';

export const DEFAULT_HOPCODE_MEMORY_SETTINGS: HopCodeMemorySettings = {
  enableManagedAutoMemory: true,
  enableManagedAutoDream: false,
  enableAutoSkill: false,
};

type JsonRecord = Record<string, unknown>;

export function normalizeHopCodeMemorySettings(
  value: unknown,
): HopCodeMemorySettings {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ...DEFAULT_HOPCODE_MEMORY_SETTINGS };
  }

  const memoryRecord = value as JsonRecord;
  return {
    enableManagedAutoMemory:
      typeof memoryRecord.enableManagedAutoMemory === 'boolean'
        ? memoryRecord.enableManagedAutoMemory
        : DEFAULT_HOPCODE_MEMORY_SETTINGS.enableManagedAutoMemory,
    enableManagedAutoDream:
      typeof memoryRecord.enableManagedAutoDream === 'boolean'
        ? memoryRecord.enableManagedAutoDream
        : DEFAULT_HOPCODE_MEMORY_SETTINGS.enableManagedAutoDream,
    enableAutoSkill:
      typeof memoryRecord.enableAutoSkill === 'boolean'
        ? memoryRecord.enableAutoSkill
        : DEFAULT_HOPCODE_MEMORY_SETTINGS.enableAutoSkill,
  };
}
