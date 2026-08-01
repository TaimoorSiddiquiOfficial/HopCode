export const DEFAULT_HOPCODE_MEMORY_SETTINGS = {
    enableManagedAutoMemory: true,
    enableManagedAutoDream: false,
    enableTeamMemory: false,
    enableTeamMemorySync: false,
    enableAutoSkill: false,
    autoSkillConfirm: true,
};
export function normalizeHopCodeMemorySettings(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return { ...DEFAULT_HOPCODE_MEMORY_SETTINGS };
    }
    const memoryRecord = value;
    return {
        enableManagedAutoMemory: typeof memoryRecord.enableManagedAutoMemory === 'boolean'
            ? memoryRecord.enableManagedAutoMemory
            : DEFAULT_HOPCODE_MEMORY_SETTINGS.enableManagedAutoMemory,
        enableManagedAutoDream: typeof memoryRecord.enableManagedAutoDream === 'boolean'
            ? memoryRecord.enableManagedAutoDream
            : DEFAULT_HOPCODE_MEMORY_SETTINGS.enableManagedAutoDream,
        enableAutoSkill: typeof memoryRecord.enableAutoSkill === 'boolean'
            ? memoryRecord.enableAutoSkill
            : DEFAULT_HOPCODE_MEMORY_SETTINGS.enableAutoSkill,
    };
}
//# sourceMappingURL=hopcode-settings.js.map