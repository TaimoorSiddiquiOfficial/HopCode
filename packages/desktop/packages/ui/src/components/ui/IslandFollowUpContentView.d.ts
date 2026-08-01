import * as React from 'react';
import { type IslandMorphTarget } from './Island';
export type IslandFollowUpMode = 'edit' | 'view';
export interface IslandFollowUpContentViewProps {
    id: string;
    value: string;
    onValueChange: (next: string) => void;
    onCancel: () => void;
    onSubmit: (value: string) => void;
    onSubmitAndSend?: (value: string) => void;
    onDelete?: () => void;
    title?: string;
    placeholder?: string;
    submitLabel?: string;
    submitAndSendLabel?: string;
    editLabel?: string;
    deleteLabel?: string;
    maxInputHeight?: number;
    sendMessageKey?: 'enter' | 'cmd-enter';
    morphFrom?: IslandMorphTarget | null;
    lockScroll?: boolean;
    blockOutsideInteraction?: boolean;
    mode?: IslandFollowUpMode;
    onRequestEdit?: () => void;
}
/**
 * Reusable Follow-up confirmation view for Island flows.
 *
 * - Uses multiline textarea input
 * - Esc cancels
 * - Cmd/Ctrl+Enter submits
 */
export declare function IslandFollowUpContentView({ id, value, onValueChange, onCancel, onSubmit, onSubmitAndSend, onDelete, title: titleProp, placeholder: placeholderProp, submitLabel: submitLabelProp, submitAndSendLabel: submitAndSendLabelProp, editLabel: editLabelProp, deleteLabel: deleteLabelProp, maxInputHeight, sendMessageKey, morphFrom, lockScroll, blockOutsideInteraction, mode, onRequestEdit, }: IslandFollowUpContentViewProps): React.JSX.Element;
