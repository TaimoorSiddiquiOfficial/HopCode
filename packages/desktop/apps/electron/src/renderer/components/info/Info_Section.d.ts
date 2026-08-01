/**
 * Info_Section
 *
 * Section container with title, optional description, and content card.
 * Matches SettingsSection styling pattern.
 */
import * as React from 'react';
export interface Info_SectionProps {
    /** Section title */
    title: string;
    /** Optional description below title */
    description?: string;
    /** Optional right-aligned header actions */
    actions?: React.ReactNode;
    /** Section content */
    children: React.ReactNode;
    className?: string;
}
export declare function Info_Section({ title, description, actions, children, className, }: Info_SectionProps): React.JSX.Element;
