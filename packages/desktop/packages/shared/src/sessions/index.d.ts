/**
 * Sessions Module
 *
 * Public exports for workspace-scoped session management.
 *
 * Sessions are stored in JSONL format:
 * - Line 1: SessionHeader (metadata for fast list loading)
 * - Lines 2+: StoredMessage (one message per line)
 */
export type { SessionStatus, SessionTokenUsage, StoredMessage, SessionConfig, StoredSession, SessionMetadata, SessionHeader, SessionPersistentField, } from './types.ts';
export { SESSION_PERSISTENT_FIELDS } from './types.ts';
export { ensureSessionsDir, ensureSessionDir, getSessionPath, getSessionFilePath, getSessionAttachmentsPath, getSessionPlansPath, ensureAttachmentsDir, generateSessionId, createSession, getOrCreateSessionById, saveSession, loadSession, listSessions, deleteSession, clearSessionMessages, getOrCreateLatestSession, updateSessionSdkId, updateSessionMetadata, canUpdateSdkCwd, flagSession, unflagSession, setSessionStatus, setPendingPlanExecution, markCompactionComplete, markPendingPlanExecutionDispatched, clearPendingPlanExecution, getPendingPlanExecution, listFlaggedSessions, listCompletedSessions, listInboxSessions, archiveSession, unarchiveSession, listArchivedSessions, listActiveSessions, deleteOldArchivedSessions, formatPlanAsMarkdown, parsePlanFromMarkdown, savePlanToFile, loadPlanFromFile, loadPlanFromPath, listPlanFiles, deletePlanFile, getMostRecentPlanFile, sessionPersistenceQueue, getHeaderMetadataSignature, } from './storage.ts';
export { readSessionHeader, readSessionJsonl, writeSessionJsonl, createSessionHeader, } from './jsonl.ts';
export { pickSessionFields } from './utils.ts';
export { generateDatePrefix, generateHumanSlug, generateUniqueSessionId, parseSessionId, isHumanReadableId, } from './slug-generator.ts';
export { ADJECTIVES, NOUNS } from './word-lists.ts';
export { validateSessionId, sanitizeSessionId, } from './validation.ts';
export type { SessionBundle, BundleFile, BundleBranchInfo, DispatchMode, } from './bundle.ts';
export { serializeSession, validateBundle, MAX_BUNDLE_SIZE_BYTES, } from './bundle.ts';
