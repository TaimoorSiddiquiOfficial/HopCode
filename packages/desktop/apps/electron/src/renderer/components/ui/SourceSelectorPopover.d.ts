import * as React from 'react';
import type { LoadedSource } from '../../../shared/types';
export interface SourceSelectorPopoverProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    anchorRef: React.RefObject<HTMLButtonElement | null>;
    sources: LoadedSource[];
    selectedSlugs: string[];
    onToggleSlug: (slug: string) => void;
}
export declare function SourceSelectorPopover({ open, onOpenChange, anchorRef, sources, selectedSlugs, onToggleSlug, }: SourceSelectorPopoverProps): React.JSX.Element;
