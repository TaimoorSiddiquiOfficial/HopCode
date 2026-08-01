import * as React from 'react';
import type { PermissionRequest as PermissionRequestType } from '../../../../../shared/types';
interface AskUserQuestionRequestProps {
    request: PermissionRequestType;
    onSubmit: (answers: Record<string, string>) => void;
    onCancel: () => void;
    /** When true, removes container styling (shadow, rounded) - used when wrapped by InputContainer */
    unstyled?: boolean;
}
export declare function AskUserQuestionRequest({ request, onSubmit, onCancel, unstyled }: AskUserQuestionRequestProps): React.JSX.Element;
export {};
