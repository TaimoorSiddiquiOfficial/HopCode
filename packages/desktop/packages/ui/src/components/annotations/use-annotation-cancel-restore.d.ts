import * as React from 'react';
import type { AnchoredSelection } from './interaction-state-machine';
export interface UseAnnotationCancelRestoreOptions<T extends HTMLElement> {
    contentRootRef: React.RefObject<T | null>;
    cancelFollowUp: () => {
        pendingSelection: AnchoredSelection | null;
    };
}
export declare function useAnnotationCancelRestore<T extends HTMLElement>({ contentRootRef, cancelFollowUp, }: UseAnnotationCancelRestoreOptions<T>): () => void;
