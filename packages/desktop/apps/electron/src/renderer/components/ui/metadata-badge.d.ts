import * as React from 'react';
export interface MetadataBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Primary label text */
    label: string;
    /** Optional secondary value text */
    value?: string;
    /** Optional leading icon */
    icon?: React.ReactNode;
    /** Optional trailing hint icon when no value is set */
    valueHintIcon?: React.ReactNode;
    /** Color tint source for chip background/text */
    badgeColor?: string;
    /** Enable hover/click styling */
    interactive?: boolean;
    /** Active/open state styling */
    isActive?: boolean;
    /** Show dropdown chevron on the right */
    showChevron?: boolean;
    /** Shadow style for the chip */
    shadow?: 'none' | 'minimal';
}
export declare const MetadataBadge: React.ForwardRefExoticComponent<MetadataBadgeProps & React.RefAttributes<HTMLButtonElement>>;
