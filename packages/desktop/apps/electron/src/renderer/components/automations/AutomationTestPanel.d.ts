/**
 * AutomationTestPanel
 *
 * Inline panel displaying test execution results.
 * Uses Info_Alert variants for consistent styling.
 */
import type { TestResult } from './types';
export interface AutomationTestPanelProps {
    result: TestResult;
    className?: string;
}
export declare function AutomationTestPanel({ result, className }: AutomationTestPanelProps): import("react").JSX.Element | null;
