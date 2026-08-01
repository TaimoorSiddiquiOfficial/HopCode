/**
 * SettingsNavigator
 *
 * Navigator panel content for settings. Displays a list of settings sections
 * (App, Workspace, Shortcuts, Preferences) that can be selected to show in the details panel.
 *
 * Styling follows SessionList/SourcesListPanel patterns for visual consistency.
 */
import type { DetailsPageMeta } from '@/lib/navigation-registry';
import type { SettingsSubpage } from '../../../shared/types';
export declare const meta: DetailsPageMeta;
interface SettingsNavigatorProps {
    /** Currently selected settings subpage */
    selectedSubpage: SettingsSubpage;
    /** Called when a subpage is selected */
    onSelectSubpage: (subpage: SettingsSubpage) => void;
}
export default function SettingsNavigator({ selectedSubpage, onSelectSubpage, }: SettingsNavigatorProps): import("react").JSX.Element;
export {};
