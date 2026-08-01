import type { AvailableSkillDetail, AvailableSlashCommand, LoadedSkill } from '../../shared/types';
export interface HopCodeCapabilitySnapshot {
    availableCommands: AvailableSlashCommand[];
    availableSkills?: string[];
    availableSkillDetails?: AvailableSkillDetail[];
    skills: LoadedSkill[];
}
export declare function gethopcodeCapabilityCacheKey(workspaceId?: string | null, workingDirectory?: string | null, connectionSlug?: string | null): string | null;
export declare function getWorkspaceSkillsCacheKey(workspaceId?: string | null, workingDirectory?: string | null): string | null;
export declare function providerSkillsFromQwenCapabilities(snapshot: Pick<HopCodeCapabilitySnapshot, 'availableCommands' | 'availableSkills' | 'availableSkillDetails'>): LoadedSkill[];
export declare function hopcodeCapabilitiesFromSkills(skills: LoadedSkill[]): HopCodeCapabilitySnapshot;
