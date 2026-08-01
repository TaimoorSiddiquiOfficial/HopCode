interface FadingTextProps {
    children: React.ReactNode;
    className?: string;
    /** Width of the fade gradient in pixels (default: 24) */
    fadeWidth?: number;
}
/**
 * FadingText - Text that fades with gradient only when overflowing
 *
 * Uses CSS mask-image to create a gradient fade effect on the right edge
 * when the text content overflows its container. Only applies the mask
 * when overflow is detected.
 *
 * @example
 * <FadingText>Long text that might overflow</FadingText>
 * <FadingText fadeWidth={36}>Custom fade width</FadingText>
 */
export declare function FadingText({ children, className, fadeWidth }: FadingTextProps): import("react").JSX.Element;
export {};
