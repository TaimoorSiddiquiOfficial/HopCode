import type { LabelConfig } from "@craft-agent/shared/labels";
interface EntityListLabelBadgeProps {
    label: LabelConfig;
    rawValue?: string;
    sessionLabels: string[];
    onLabelsChange?: (updatedLabels: string[]) => void;
}
export declare function EntityListLabelBadge({ label, rawValue, sessionLabels, onLabelsChange }: EntityListLabelBadgeProps): import("react").JSX.Element;
export {};
