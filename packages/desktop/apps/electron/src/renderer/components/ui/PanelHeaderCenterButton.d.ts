import * as React from 'react';
interface PanelHeaderCenterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Icon as React element - caller controls size/styling */
    icon: React.ReactNode;
    /** Optional tooltip text */
    tooltip?: string;
}
export declare const PanelHeaderCenterButton: React.ForwardRefExoticComponent<PanelHeaderCenterButtonProps & React.RefAttributes<HTMLButtonElement>>;
export {};
