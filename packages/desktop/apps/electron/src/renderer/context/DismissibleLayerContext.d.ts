import React from 'react';
import { type DismissibleLayerBridge, type DismissibleLayerRegistration } from '@/lib/dismissible-layer-bridge';
export interface DismissibleLayer extends Required<Pick<DismissibleLayerRegistration, 'id' | 'type' | 'priority' | 'close'>> {
    isOpen: boolean;
    canBack?: () => boolean;
    back?: () => boolean;
    order: number;
}
interface DismissibleLayerContextValue extends DismissibleLayerBridge {
}
export interface DismissibleLayerRegistry extends DismissibleLayerBridge {
    registerLayer: (layer: DismissibleLayerRegistration) => () => void;
}
export declare function createDismissibleLayerRegistry(): DismissibleLayerRegistry;
export declare function DismissibleLayerProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export declare function useDismissibleLayerRegistry(): DismissibleLayerContextValue;
export declare function useRegisterDismissibleLayer(layer: DismissibleLayerRegistration | null): void;
export {};
