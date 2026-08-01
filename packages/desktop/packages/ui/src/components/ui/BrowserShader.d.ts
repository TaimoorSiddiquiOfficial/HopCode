export interface BrowserShaderProps {
    className?: string;
    rounded?: boolean;
    borderRadius?: string;
    maskImage: string;
    opacity?: number;
    colorBack?: string;
    colorFront?: string;
    shape?: 'warp' | 'simplex' | 'dots' | 'wave' | 'ripple' | 'swirl' | 'sphere';
    type?: '2x2' | '4x4' | '8x8' | 'random';
    size?: number;
    speed?: number;
    scale?: number;
    maxPixelCount?: number;
    minPixelRatio?: number;
}
export declare function BrowserShader({ className, rounded, borderRadius, maskImage, opacity, colorBack, colorFront, shape, type, size, speed, scale, maxPixelCount, minPixelRatio, }: BrowserShaderProps): import("react").JSX.Element;
