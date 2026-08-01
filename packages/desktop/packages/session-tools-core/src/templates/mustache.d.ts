/**
 * Minimal Mustache Template Renderer
 *
 * A zero-dependency Mustache implementation covering the core spec:
 * - {{var}}           Variable interpolation (HTML-escaped)
 * - {{{var}}}         Unescaped variable interpolation
 * - {{#section}}...{{/section}}  Sections (conditionals + loops)
 * - {{^section}}...{{/section}}  Inverted sections (if falsy/empty)
 * - Nested context resolution (dot-notation: {{issue.title}})
 *
 * Designed for rendering source HTML templates with data from APIs.
 * Logic-less by design — templates cannot execute arbitrary code.
 */
/**
 * Render a Mustache template string with the given data.
 *
 * @param template - The Mustache template string
 * @param data - The data object to render with
 * @returns The rendered string
 */
export declare function renderMustache(template: string, data: Record<string, unknown>): string;
