import * as React from 'react';
import type { ComponentEntry } from './registry';
interface ComponentPreviewProps {
    component: ComponentEntry;
    props: Record<string, unknown>;
}
export declare function ComponentPreview({ component, props }: ComponentPreviewProps): React.JSX.Element;
export {};
