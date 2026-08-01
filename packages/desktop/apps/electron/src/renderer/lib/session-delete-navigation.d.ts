import { type Route } from './navigate';
interface SessionDeleteNavigationOptions {
    deleted: boolean;
    deletedSessionId: string;
    selectedSessionId: string | null | undefined;
}
export declare function getSessionDeleteNavigationRoute({ deleted, deletedSessionId, selectedSessionId, }: SessionDeleteNavigationOptions): Route | null;
export {};
