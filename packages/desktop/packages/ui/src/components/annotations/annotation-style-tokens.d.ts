export declare function annotationColorToCss(color?: string): string;
export declare function getAnnotationRectVisual(rect: {
    pendingFollowUp?: boolean;
    sentFollowUp?: boolean;
}): {
    className: any;
    style: {
        [x: string]: string | number;
        opacity: number;
    };
};
export declare function getAnnotationChipVisual(chip: {
    pendingFollowUp?: boolean;
    sentFollowUp?: boolean;
}): {
    className: any;
    style: {
        [x: string]: string;
        backgroundColor: string;
        color: string;
    };
};
