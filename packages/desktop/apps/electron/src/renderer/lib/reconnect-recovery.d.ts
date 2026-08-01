import type { SessionMeta } from '@/atoms/sessions';
export declare function getSessionsToRefreshAfterStaleReconnect(metaMap: Map<string, SessionMeta>, activeSessionId: string | null): string[];
