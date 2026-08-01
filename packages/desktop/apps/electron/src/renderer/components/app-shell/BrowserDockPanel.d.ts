import * as React from 'react';
interface BrowserDockPanelProps {
    expandedLeft: number;
    autoHideKey?: string | null;
    isCompact?: boolean;
}
export declare function BrowserDockPanel({ expandedLeft, autoHideKey, isCompact, }: BrowserDockPanelProps): React.JSX.Element | null;
export {};
