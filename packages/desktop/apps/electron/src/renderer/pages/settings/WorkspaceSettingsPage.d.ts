/**
 * WorkspaceSettingsPage
 *
 * Workspace-level settings for the active workspace.
 *
 * Settings:
 * - Identity (Name, Icon)
 * - Permissions (Default mode, Mode cycling)
 * - Advanced (Working directory, Local MCP servers)
 *
 * Note: AI settings (model, thinking, connection) have been moved to AiSettingsPage.
 */
import * as React from 'react';
import type { DetailsPageMeta } from '@/lib/navigation-registry';
export declare const meta: DetailsPageMeta;
export default function WorkspaceSettingsPage(): React.JSX.Element;
