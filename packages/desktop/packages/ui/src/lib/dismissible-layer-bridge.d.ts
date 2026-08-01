export type DismissibleLayerType = 'radix-dialog' | 'radix-popover' | 'island' | 'modal' | 'custom';
export interface DismissibleLayerRegistration {
    id: string;
    type: DismissibleLayerType;
    priority?: number;
    isOpen?: boolean;
    close: () => void;
    canBack?: () => boolean;
    back?: () => boolean;
}
export interface DismissibleLayerSnapshot {
    id: string;
    type: DismissibleLayerType;
    priority: number;
}
export interface DismissibleLayerBridge {
    registerLayer: (layer: DismissibleLayerRegistration) => () => void;
    hasOpenLayers: () => boolean;
    getTopLayer: () => DismissibleLayerSnapshot | null;
    closeTop: () => boolean;
    handleEscape: () => boolean;
}
export declare function setDismissibleLayerBridge(bridge: DismissibleLayerBridge | null): void;
export declare function getDismissibleLayerBridge(): DismissibleLayerBridge | null;
