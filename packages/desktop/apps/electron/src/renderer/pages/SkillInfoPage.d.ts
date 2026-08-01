/**
 * SkillInfoPage
 *
 * Displays comprehensive skill details including metadata,
 * permission modes, and instructions.
 * Uses the Info_ component system for consistent styling with SourceInfoPage.
 */
import * as React from 'react';
interface SkillInfoPageProps {
    skillSlug: string;
    workspaceId: string;
    workingDirectory?: string;
    activeSessionId?: string | null;
}
export default function SkillInfoPage({ skillSlug, workspaceId, workingDirectory, activeSessionId, }: SkillInfoPageProps): React.JSX.Element;
export {};
