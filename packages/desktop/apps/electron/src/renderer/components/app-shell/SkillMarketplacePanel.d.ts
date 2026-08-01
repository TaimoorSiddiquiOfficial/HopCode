import * as React from 'react';
export interface SkillMarketplacePanelProps {
    workspaceId?: string;
    workingDirectory?: string;
    activeSessionId?: string | null;
    selectedSkillId?: string | null;
    onSkillSelect?: (skillId: string) => void;
    onInstalled?: (options?: {
        force?: boolean;
    }) => Promise<void> | void;
    installingSkillIds?: ReadonlySet<string>;
    onInstallStart?: (skillId: string) => void;
    onInstallFinish?: (skillId: string) => void;
    className?: string;
}
export declare function SkillMarketplacePanel({ workspaceId, workingDirectory, activeSessionId, selectedSkillId, onSkillSelect, onInstalled, installingSkillIds, onInstallStart, onInstallFinish, className, }: SkillMarketplacePanelProps): React.JSX.Element;
