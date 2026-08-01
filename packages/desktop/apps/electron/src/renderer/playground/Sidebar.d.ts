import * as React from 'react';
import type { CategoryGroup } from './registry';
interface SidebarProps {
    categories: CategoryGroup[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}
export declare function Sidebar({ categories, selectedId, onSelect }: SidebarProps): React.JSX.Element;
export {};
