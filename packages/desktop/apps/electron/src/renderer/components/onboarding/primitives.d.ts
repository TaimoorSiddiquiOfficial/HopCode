import { type ButtonProps } from "@/components/ui/button";
export type StepIconVariant = 'primary' | 'success' | 'error' | 'loading' | 'none';
interface StepIconProps {
    /** The icon to display (should be a lucide-react icon or SVG) */
    children: React.ReactNode;
    /** Visual variant - affects icon color */
    variant?: StepIconVariant;
    className?: string;
}
/**
 * StepIcon - Circular icon container for step headers
 *
 * Use at the top of centered step layouts to provide visual context.
 */
export declare function StepIcon({ children, variant, className }: StepIconProps): import("react").JSX.Element;
interface StepHeaderProps {
    /** The main title */
    title: string;
    /** Optional description below the title */
    description?: React.ReactNode;
    /** Whether to center the text (default: true) */
    centered?: boolean;
    className?: string;
}
/**
 * StepHeader - Title and description for steps
 *
 * Works for both centered layouts (with icon) and form layouts.
 */
export declare function StepHeader({ title, description, centered, className }: StepHeaderProps): import("react").JSX.Element;
interface StepFormLayoutProps {
    /** Icon to display at the top, wrapped in StepIcon (optional) */
    icon?: React.ReactNode;
    /** Icon variant */
    iconVariant?: StepIconVariant;
    /** Raw icon element to display without StepIcon wrapper (optional) */
    iconElement?: React.ReactNode;
    /** Step title */
    title: string;
    /** Step description */
    description?: React.ReactNode;
    /** Action buttons at the bottom */
    actions?: React.ReactNode;
    /** Form content */
    children?: React.ReactNode;
    /** Whether children should grow to fill available space (for scrollable content) */
    grow?: boolean;
    /** Whether to fill parent height without max-height limit */
    fillHeight?: boolean;
    className?: string;
}
/**
 * StepFormLayout - Unified layout for onboarding steps
 *
 * Use for all steps. Supports:
 * - Optional icon at top (wrapped in StepIcon, or raw via iconElement)
 * - Centered header (title + description)
 * - Full-width content below (forms, lists, etc.)
 * - Flex action buttons at bottom
 */
export declare function StepFormLayout({ icon, iconVariant, iconElement, title, description, actions, children, grow, fillHeight, className }: StepFormLayoutProps): import("react").JSX.Element;
interface StepActionsProps {
    children: React.ReactNode;
    /** Layout variant: 'stack' for vertical, 'flex' for horizontal with flex-1 buttons */
    variant?: 'stack' | 'flex';
    className?: string;
}
/**
 * StepActions - Container for action buttons
 *
 * - 'stack' variant: Vertical stack, used for centered layouts with multiple CTAs
 * - 'flex' variant: Horizontal with flex-1 buttons, used for Back/Continue patterns
 */
export declare function StepActions({ children, variant, className }: StepActionsProps): import("react").JSX.Element;
interface BackButtonProps extends Omit<ButtonProps, 'variant' | 'children'> {
    children?: React.ReactNode;
}
/**
 * BackButton - Consistent back/cancel button
 */
export declare function BackButton({ children, className, ...props }: BackButtonProps): import("react").JSX.Element;
interface ContinueButtonProps extends Omit<ButtonProps, 'children'> {
    children?: React.ReactNode;
    loading?: boolean;
    loadingText?: string;
}
/**
 * ContinueButton - Consistent primary action button
 */
export declare function ContinueButton({ children, loading, loadingText, className, disabled, ...props }: ContinueButtonProps): import("react").JSX.Element;
export {};
