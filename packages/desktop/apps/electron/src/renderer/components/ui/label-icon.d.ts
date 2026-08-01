/**
 * LabelIcon - Renders a colored circle representing a label.
 *
 * Labels are color-only (no icons/emoji). The circle size scales
 * with the icon size variant for consistent inline display.
 */
import type { IconSize } from '@craft-agent/shared/icons';
import type { EntityColor } from '@craft-agent/shared/colors';
import type { LabelConfig } from '@craft-agent/shared/labels';
interface LabelIconProps {
    /** Label configuration (matches LabelConfig from @craft-agent/shared/labels) */
    label: {
        id: string;
        /** EntityColor: system color string or custom color object */
        color?: EntityColor;
    };
    /** Size variant (default: 'sm' - labels are typically small inline elements) */
    size?: IconSize;
    /** When true, renders an inner circle (radio-button style) to indicate nested children */
    hasChildren?: boolean;
    /** Additional className */
    className?: string;
}
export declare function LabelIcon({ label, size, hasChildren, className }: LabelIconProps): import("react").JSX.Element;
interface LabelValueTypeIconProps {
    /** The label's valueType ('number' | 'date' | 'string' | undefined) */
    valueType: LabelConfig['valueType'];
    /** Icon size in pixels (default: 11) */
    size?: number;
    /** Additional className */
    className?: string;
}
export declare function LabelValueTypeIcon({ valueType, size, className }: LabelValueTypeIconProps): import("react").JSX.Element | null;
export {};
