import * as React from 'react';
import type { MenuComponents } from '@/components/ui/menu-context';
import { type SessionStatusId, type SessionStatus } from '@/config/session-status-config';
import { type LabelConfig } from '@craft-agent/shared/labels';
export interface ShareMenuItemsProps {
    sessionId: string;
    sharedUrl: string;
    menu: Pick<MenuComponents, 'MenuItem' | 'Separator'>;
}
export declare function ShareMenuItems({ sessionId, sharedUrl, menu }: ShareMenuItemsProps): React.JSX.Element;
export interface StatusMenuItemsProps {
    sessionStatuses: SessionStatus[];
    activeStateId?: SessionStatusId | null;
    onSelect: (stateId: SessionStatusId) => void;
    menu: Pick<MenuComponents, 'MenuItem'>;
}
export declare function StatusMenuItems({ sessionStatuses, activeStateId, onSelect, menu, }: StatusMenuItemsProps): React.JSX.Element;
export interface LabelMenuItemsProps {
    labels: LabelConfig[];
    appliedLabelIds: Set<string>;
    onToggle: (labelId: string) => void;
    menu: Pick<MenuComponents, 'MenuItem' | 'Separator' | 'Sub' | 'SubTrigger' | 'SubContent'>;
}
/**
 * LabelMenuItems - Recursive component for rendering label tree as nested sub-menus.
 *
 * Labels with children render as nested Sub/SubTrigger/SubContent menus (the parent
 * itself appears as the first toggleable item inside its submenu, followed by children).
 * Leaf labels render as simple toggleable menu items with checkmarks.
 * Parent triggers show a count of applied descendants so users can see where selections are.
 */
export declare function LabelMenuItems({ labels, appliedLabelIds, onToggle, menu, }: LabelMenuItemsProps): React.ReactNode;
