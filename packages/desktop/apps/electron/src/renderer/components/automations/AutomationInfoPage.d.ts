/**
 * AutomationInfoPage
 *
 * Detail view for a selected automation, using the Info_Page compound component system.
 * Follows SourceInfoPage pattern: Hero → Sections (When, Then, Settings, History, JSON).
 */
import * as React from 'react';
import { type AutomationListItem, type ExecutionEntry, type TestResult } from './types';
export interface AutomationInfoPageProps {
    automation: AutomationListItem;
    executions?: ExecutionEntry[];
    testResult?: TestResult;
    onToggleEnabled?: () => void;
    onTest?: () => void;
    onDuplicate?: () => void;
    onDelete?: () => void;
    onReplay?: (automationId: string, event: string) => void;
    className?: string;
}
export declare function AutomationInfoPage({ automation, executions, testResult, onToggleEnabled, onTest, onDuplicate, onDelete, onReplay, className, }: AutomationInfoPageProps): React.JSX.Element;
