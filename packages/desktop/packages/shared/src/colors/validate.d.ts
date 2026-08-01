/**
 * Entity Color Validation
 *
 * Zod schemas and validation utilities for EntityColor values.
 * Used by config validators to ensure color values in statuses/labels configs are valid.
 */
import { z } from 'zod';
/**
 * Check if a string is a valid CSS color value.
 * Supports hex, OKLCH, RGB/RGBA, and HSL/HSLA formats.
 */
export declare function isValidCSSColor(value: string): boolean;
/**
 * Check if a string is a valid system color (name with optional /opacity).
 * Validates that the name is a known system color and opacity is 0–100.
 */
export declare function isValidSystemColor(value: string): boolean;
/**
 * Check if a value is a valid EntityColor.
 * Accepts system color strings or custom color objects.
 */
export declare function isValidEntityColor(value: unknown): boolean;
/**
 * Zod schema for EntityColor.
 *
 * Uses superRefine instead of a raw z.union to produce a single, actionable error
 * message that an LLM can use to self-correct — rather than confusing dual-branch
 * union errors from Zod (which would show both "invalid string" and "expected object").
 *
 * Valid forms:
 * - System color string: "accent", "foreground/50", "info/80"
 * - Custom color object: { light: "#EF4444", dark?: "#F87171" }
 */
export declare const EntityColorSchema: z.ZodEffects<z.ZodAny, any, any>;
