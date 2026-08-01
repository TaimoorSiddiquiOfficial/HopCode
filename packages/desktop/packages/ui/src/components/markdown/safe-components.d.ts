/**
 * Safe component handling for react-markdown
 *
 * When users type HTML-like content (e.g., `<sq+qr>`), rehype-raw interprets
 * it as an HTML tag. React crashes if the tag name contains invalid characters.
 * This module provides utilities to handle such cases gracefully.
 */
import React from 'react';
import type { Components } from 'react-markdown';
/**
 * UnknownTag - Fallback component for invalid HTML-like tags
 *
 * Renders tags with invalid names (containing +, @, etc.) as plain text
 * instead of crashing React. Always renders both opening and closing tags
 * for consistency (it's escaped text anyway).
 */
export declare const UnknownTag: React.FC<{
    tagName: string;
    children?: React.ReactNode;
}>;
/**
 * Checks if a tag name is valid for React/HTML rendering.
 * Invalid tags contain characters like +, @, -, spaces, etc.
 */
export declare function isValidTagName(tagName: string): boolean;
/**
 * Wraps a components object with a Proxy to handle unknown/invalid tag names.
 *
 * Returns:
 * - The original component if defined in the components map
 * - undefined for valid HTML/React tag names (lets React handle them)
 * - UnknownTag fallback for invalid tag names (containing +, @, etc.)
 *
 * @example
 * const safeComponents = wrapWithSafeProxy(components)
 * // <div> → handled by React (valid HTML)
 * // <MyComponent> → handled by React (valid component name)
 * // <sq+qr> → rendered as text by UnknownTag
 */
export declare function wrapWithSafeProxy(components: Partial<Components>): Partial<Components>;
