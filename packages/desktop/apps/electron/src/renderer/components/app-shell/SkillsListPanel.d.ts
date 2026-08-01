import * as React from 'react';
import type { LoadedSkill } from '../../../shared/types';
export interface SkillsListPanelProps {
    skills: LoadedSkill[];
    onDeleteSkill: (skillSlug: string) => void;
    onSetSkillEnabled?: (skill: LoadedSkill, enabled: boolean) => Promise<void>;
    onSkillClick: (skill: LoadedSkill) => void;
    selectedSkillSlug?: string | null;
    workspaceId?: string;
    workspaceRootPath?: string;
    isLoading?: boolean;
    className?: string;
}
export declare function SkillsListPanel({ skills, onDeleteSkill, onSetSkillEnabled, onSkillClick, selectedSkillSlug, workspaceId, workspaceRootPath, isLoading, className, }: SkillsListPanelProps): React.JSX.Element;
