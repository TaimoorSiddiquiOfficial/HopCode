/**
 * MermaidPreviewOverlay — fullscreen diagram preview with zoom and pan.
 */
export interface MermaidPreviewOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    svg: string;
    code: string;
}
export declare function MermaidPreviewOverlay({ isOpen, onClose, svg, code, }: MermaidPreviewOverlayProps): import("react").JSX.Element;
