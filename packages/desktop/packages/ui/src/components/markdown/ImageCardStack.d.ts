import * as React from 'react';
export interface ImageCardStackItem {
    src: string;
    label?: string;
    alt?: string;
    /** Optional image ratio (width / height). Defaults to 4/3. */
    ratio?: number;
}
export interface ImageCardStackProps {
    items: ImageCardStackItem[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
    className?: string;
    maxRotate?: number;
    minSwipeDistanceRatio?: number;
    minSwipeVelocity?: number;
    /** Max stack height in px. Defaults to 320. */
    maxHeight?: number;
    /** Fraction of container size used by cards (0..1). Defaults to 0.8. */
    stackScale?: number;
    /** Called when the top card is tapped/clicked. */
    onTopCardTap?: () => void;
}
export declare function ImageCardStack({ items, currentIndex, onIndexChange, className, maxRotate, minSwipeDistanceRatio, minSwipeVelocity, maxHeight, stackScale, onTopCardTap, }: ImageCardStackProps): React.JSX.Element | null;
