/**
 * SettingsEditRow
 *
 * A settings row with an Edit button that opens an EditPopover.
 * When the user submits their edit request, a new focused chat window
 * opens with context pre-filled for fast execution.
 */
import { type EditContext } from '@/components/ui/EditPopover';
export interface SettingsEditRowProps {
    /** Row label */
    label: string;
    /** Optional description below label */
    description?: string;
    /** Current value display (shown on the right side) */
    value?: React.ReactNode;
    /** Context for the edit popover - tells the agent what's being edited */
    editContext: EditContext;
    /** Example text for the edit placeholder (e.g., "Change the API endpoint") */
    editExample?: string;
    /** Whether the row is inside a card (affects padding) */
    inCard?: boolean;
    /** Additional className */
    className?: string;
}
export declare function SettingsEditRow({ label, description, value, editContext, editExample, inCard, className, }: SettingsEditRowProps): import("react").JSX.Element;
