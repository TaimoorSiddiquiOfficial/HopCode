/**
 * useAutomations
 *
 * Encapsulates all automations state management:
 * - Loading automations from automations.json
 * - Subscribing to live updates
 * - Test, toggle, duplicate, delete handlers
 * - Delete confirmation state
 * - Syncing automations to Jotai atom for cross-component access
 */
import { type AutomationListItem, type TestResult, type ExecutionEntry } from '@/components/automations/types';
export interface UseAutomationsResult {
    automations: AutomationListItem[];
    automationTestResults: Record<string, TestResult>;
    automationPendingDelete: string | null;
    pendingDeleteAutomation: AutomationListItem | undefined;
    setAutomationPendingDelete: (id: string | null) => void;
    handleTestAutomation: (automationId: string) => void;
    handleToggleAutomation: (automationId: string) => void;
    handleDuplicateAutomation: (automationId: string) => void;
    handleDeleteAutomation: (automationId: string) => void;
    confirmDeleteAutomation: () => void;
    getAutomationHistory: (automationId: string) => Promise<ExecutionEntry[]>;
    handleReplayAutomation: (automationId: string, event: string) => void;
}
export declare function useAutomations(activeWorkspaceId: string | null | undefined): UseAutomationsResult;
