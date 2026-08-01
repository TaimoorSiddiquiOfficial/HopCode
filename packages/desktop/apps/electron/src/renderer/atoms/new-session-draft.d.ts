import type { ContentBadge, CreateSessionOptions } from '../../shared/types';
export declare const NEW_SESSION_DRAFT_ID = "__new_session_draft__";
export interface NewSessionDraftState {
    nonce: number;
    input: string;
    createOptions: CreateSessionOptions;
    badges?: ContentBadge[];
}
export declare const newSessionDraftAtom: any;
