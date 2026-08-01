/**
 * PanelResizeSash
 *
 * A thin drag handle between adjacent content panels in the split view.
 * Reuses the existing resize gradient style for visual consistency
 * with the sidebar/navigator sash handles.
 *
 * - Drag to resize the two adjacent panels
 * - Double-click to reset both panels to equal share of their combined proportion
 * - Enforces PANEL_MIN_WIDTH on both sides during drag
 * - Measures sibling panel widths from the DOM on drag start (no width props needed)
 */
import { PANEL_MIN_WIDTH } from './panel-constants';
export { PANEL_MIN_WIDTH };
interface PanelResizeSashProps {
    /** Index of the panel to the left of this sash (in panelStack) */
    leftIndex: number;
    /** Index of the panel to the right of this sash (in panelStack) */
    rightIndex: number;
}
export declare function PanelResizeSash({ leftIndex, rightIndex, }: PanelResizeSashProps): import("react").JSX.Element;
