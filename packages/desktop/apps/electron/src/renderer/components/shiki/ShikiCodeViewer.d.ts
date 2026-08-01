/**
 * ShikiCodeViewer - Electron wrapper for the portable ShikiCodeViewer
 *
 * This thin wrapper imports the portable component from @craft-agent/ui
 * and connects it to Electron's ThemeContext and preset themes.
 */
import * as React from 'react';
import { type ShikiCodeViewerProps as BaseProps } from '@craft-agent/ui';
export interface ShikiCodeViewerProps extends Omit<BaseProps, 'theme' | 'shikiTheme'> {
}
/**
 * ShikiCodeViewer - Syntax highlighted code viewer with line numbers
 * Connected to Electron's theme context and preset themes.
 */
export declare function ShikiCodeViewer(props: ShikiCodeViewerProps): React.JSX.Element;
