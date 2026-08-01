/**
 * Shared remark-math configuration for markdown rendering.
 *
 * We intentionally disable single-dollar inline math so currency strings
 * (e.g. $100, $2M–$4M) remain plain text.
 */
export declare const MARKDOWN_MATH_OPTIONS: {
    readonly singleDollarTextMath: false;
};
