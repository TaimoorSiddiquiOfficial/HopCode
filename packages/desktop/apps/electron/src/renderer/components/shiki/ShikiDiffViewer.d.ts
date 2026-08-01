/**
 * ShikiDiffViewer - Electron wrapper for the portable ShikiDiffViewer
 *
 * Connects the base component to Electron's ThemeContext, passing the
 * app's Shiki theme (e.g. dracula, nord) so the diff viewer uses matching
 * syntax highlighting. Falls back to craft-dark/craft-light (transparent bg)
 * when no Shiki theme is configured.
 */
import * as React from 'react';
import { type ShikiDiffViewerProps as BaseProps } from '@craft-agent/ui';
export interface ShikiDiffViewerProps extends Omit<BaseProps, 'theme' | 'shikiTheme'> {
}
/**
 * ShikiDiffViewer - Shiki-based diff viewer component
 * Connected to Electron's theme context. Passes the app's Shiki theme
 * so the diff viewer uses the matching syntax theme (e.g. dracula, nord).
 */
export declare function ShikiDiffViewer(props: ShikiDiffViewerProps): React.JSX.Element;
