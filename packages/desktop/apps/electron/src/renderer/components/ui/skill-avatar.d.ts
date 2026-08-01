/**
 * SkillAvatar - Thin wrapper around EntityIcon for skills.
 *
 * Sets fallbackIcon={Zap} and delegates all rendering to EntityIcon.
 * Use `fluid` prop for fill-parent sizing (e.g., Info_Page.Hero).
 */
import type { IconSize } from '@craft-agent/shared/icons';
import type { LoadedSkill } from '../../../shared/types';
interface SkillAvatarProps {
    /** LoadedSkill object */
    skill: LoadedSkill;
    /** Size variant */
    size?: IconSize;
    /** Fill parent container (h-full w-full). Overrides size. */
    fluid?: boolean;
    /** Additional className overrides */
    className?: string;
    /** Workspace ID for loading local icons */
    workspaceId?: string;
}
export declare function SkillAvatar({ skill, size, fluid, className, workspaceId }: SkillAvatarProps): import("react").JSX.Element;
export {};
