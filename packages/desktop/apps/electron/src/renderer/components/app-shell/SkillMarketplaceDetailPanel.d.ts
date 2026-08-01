import * as React from 'react';
export interface SkillMarketplaceDetailPanelProps {
    workspaceId?: string;
    workingDirectory?: string;
    activeSessionId?: string | null;
    selectedSkillId?: string | null;
    onInstalled?: (options?: {
        force?: boolean;
    }) => Promise<void> | void;
    installingSkillIds?: ReadonlySet<string>;
    onInstallStart?: (skillId: string) => void;
    onInstallFinish?: (skillId: string) => void;
    className?: string;
}
export declare function SkillMarketplaceDetailPanel({ workspaceId, workingDirectory, activeSessionId, selectedSkillId, onInstalled, installingSkillIds, onInstallStart, onInstallFinish, className, }: SkillMarketplaceDetailPanelProps): React.JSX.Element;
