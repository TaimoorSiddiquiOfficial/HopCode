/**
 * Info_Page
 *
 * Compound page layout component for Info pages.
 * Handles loading, error, and empty states with consistent styling.
 */
import * as React from 'react';
import { type PanelHeaderProps } from '@/components/app-shell/PanelHeader';
export interface Info_PageProps {
    children: React.ReactNode;
    /** Show loading spinner */
    loading?: boolean;
    /** Show error state with message */
    error?: string;
    /** Show empty state with message */
    empty?: string;
    className?: string;
}
export interface Info_PageHeaderProps extends Omit<PanelHeaderProps, 'className'> {
    className?: string;
}
export interface Info_PageHeroProps {
    /** Avatar element */
    avatar: React.ReactNode;
    /** Title displayed next to avatar */
    title?: string;
    /** Tagline/description text below title */
    tagline?: string | null;
    className?: string;
}
export interface Info_PageContentProps {
    children: React.ReactNode;
    className?: string;
}
declare function Info_PageRoot({ children, loading, error, empty, className, }: Info_PageProps): React.JSX.Element;
declare function Info_PageHeader({ className, ...props }: Info_PageHeaderProps): React.JSX.Element;
declare function Info_PageHero({ avatar, title, tagline, className }: Info_PageHeroProps): React.JSX.Element;
declare function Info_PageContent({ children, className }: Info_PageContentProps): React.JSX.Element;
export declare const Info_Page: typeof Info_PageRoot & {
    Header: typeof Info_PageHeader;
    Hero: typeof Info_PageHero;
    Content: typeof Info_PageContent;
};
export {};
