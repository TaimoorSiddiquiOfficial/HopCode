/**
 * AppSettingsPage
 *
 * Global app-level settings that apply across all workspaces.
 *
 * Settings:
 * - Notifications
 * - Network (proxy)
 * - Updates
 *
 * Note: AI settings (connections, model, thinking) have been moved to AiSettingsPage.
 * Note: Appearance settings (theme, font) have been moved to AppearanceSettingsPage.
 */
import type { DetailsPageMeta } from '@/lib/navigation-registry';
export declare const meta: DetailsPageMeta;
export default function AppSettingsPage(): import("react").JSX.Element;
