import * as React from 'react';
import type { LoadedSource, SourceFilter } from '../../../shared/types';
export interface SourcesListPanelProps {
    sources: LoadedSource[];
    sourceFilter?: SourceFilter | null;
    workspaceRootPath?: string;
    onDeleteSource: (sourceSlug: string) => void;
    onSourceClick: (source: LoadedSource) => void;
    selectedSourceSlug?: string | null;
    localMcpEnabled?: boolean;
    className?: string;
}
export declare function SourcesListPanel({ sources, sourceFilter, workspaceRootPath, onDeleteSource, onSourceClick, selectedSourceSlug, localMcpEnabled, className, }: SourcesListPanelProps): React.JSX.Element;
