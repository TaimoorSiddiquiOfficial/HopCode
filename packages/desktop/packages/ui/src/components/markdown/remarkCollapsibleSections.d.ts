/**
 * Remark plugin that wraps heading + content groups into section nodes.
 *
 * For each heading (H1-H6), it collects all content until the next
 * same-or-higher level heading and wraps them in a section node.
 *
 * Example:
 *   ## Intro       -> section[depth=2]
 *     paragraph       contains: heading, paragraph, paragraph, section[depth=3]
 *     paragraph
 *     ### Details  -> section[depth=3] (nested inside Intro section)
 *       paragraph     contains: heading, paragraph
 *   ## Next       -> section[depth=2]
 */
import type { Plugin } from 'unified';
import type { Root } from 'mdast';
/**
 * remarkCollapsibleSections
 *
 * Transforms the markdown AST to wrap heading+content groups into
 * section nodes that can be rendered as collapsible sections.
 */
declare const remarkCollapsibleSections: Plugin<[], Root>;
export default remarkCollapsibleSections;
