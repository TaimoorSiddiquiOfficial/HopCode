import type { SessionMeta } from '@/atoms/sessions';
export interface SessionItemProps {
    item: SessionMeta;
    index: number;
    itemProps: Record<string, unknown>;
    isSelected: boolean;
    isFirstInGroup: boolean;
    isInMultiSelect: boolean;
    onSelect: () => void;
    onToggleSelect?: () => void;
    onRangeSelect?: () => void;
}
export declare function SessionItem({ item, itemProps, isSelected, isFirstInGroup, isInMultiSelect, onSelect, onToggleSelect, onRangeSelect, }: SessionItemProps): import("react").JSX.Element;
