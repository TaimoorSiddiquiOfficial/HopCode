import * as React from 'react';
interface SessionInfoPopoverProps {
    sessionId: string;
    sessionFolderPath?: string;
    trigger: React.ReactElement;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    contentClassName?: string;
    presentation?: 'popover' | 'drawer';
}
export declare function SessionInfoPopover({ sessionId, sessionFolderPath, trigger, side, align, sideOffset, contentClassName, presentation, }: SessionInfoPopoverProps): React.JSX.Element;
export {};
