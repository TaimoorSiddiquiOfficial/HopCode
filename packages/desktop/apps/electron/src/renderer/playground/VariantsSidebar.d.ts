import * as React from 'react';
import type { ComponentEntry, ComponentVariant } from './registry';
interface VariantsSidebarProps {
    component: ComponentEntry | null;
    selectedVariant: string | null;
    onVariantSelect: (variant: ComponentVariant) => void;
    props: Record<string, unknown>;
    onPropsChange: (props: Record<string, unknown>) => void;
    isOpen: boolean;
}
export declare function VariantsSidebar({ component, selectedVariant, onVariantSelect, props, onPropsChange, isOpen, }: VariantsSidebarProps): React.JSX.Element | null;
export {};
