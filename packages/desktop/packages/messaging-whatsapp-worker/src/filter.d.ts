/**
 * Pure filter helpers used by the WA worker's `messages.upsert` handler.
 *
 * Extracted from `worker.ts` so the classification logic can be unit
 * tested without importing the worker entry (which installs stdin and
 * signal handlers on module load).
 */
/**
 * Normalize a Baileys JID so `sock.user.id` (which may carry a device
 * suffix like `num:10@s.whatsapp.net`) compares equal to the plain
 * `num@s.whatsapp.net` form used in `key.remoteJid` for the self-chat.
 */
export declare function bareJid(jid: string | undefined | null): string | null;
/**
 * Extract the visible text from a Baileys message. Covers the subset of
 * content types we care about: plain conversation, extended text,
 * captions on image/doc/video.
 */
export declare function extractText(msg: Record<string, unknown>): string;
export interface ClassifyContext {
    selfChatMode: boolean;
    responsePrefix: string;
    /** Bare phone-number JID of the account (no device suffix), e.g. `num@s.whatsapp.net`. */
    selfJid: string | null;
    /**
     * Bare LID form of the account (no device suffix), e.g. `lid@lid`.
     * WhatsApp's newer clients may deliver the self-chat `key.remoteJid`
     * in LID form even when `sock.user.id` is still the phone-number JID,
     * so the self-chat check must accept either.
     */
    selfLid: string | null;
    sentIds: Set<string>;
}
export type InboundDecision = {
    action: 'emit';
    text: string;
} | {
    action: 'skip';
    reason: 'malformed' | 'own_echo_id' | 'own_echo_prefix' | 'own_outbound' | 'non_self_chat_inbound' | 'empty';
};
/**
 * Decide what to do with a single upsert message.
 *
 * Semantics of `selfChatMode`: "only operate in the account's self-chat."
 * Both directions are gated symmetrically — outbound from other devices AND
 * inbound from contacts are dropped when they are not in the self-chat.
 *
 * Precedence for `fromMe=true`:
 *   1. id in sentIds         → skip (our own echo, primary defence)
 *   2. not self-chat          → skip (user's outbound in normal chats)
 *   3. prefix match           → skip (echo backup defence)
 *   4. empty                  → skip
 *   5. otherwise              → emit (phone/desktop typing in self-chat)
 *
 * For `fromMe=false`:
 *   1. selfChatMode on AND not self-chat → skip (contacts/groups DMing us)
 *   2. empty                              → skip
 *   3. otherwise                          → emit
 */
export declare function classifyInbound(msg: Record<string, unknown>, ctx: ClassifyContext): InboundDecision;
/** Cap the sent-ID set so long-running sessions don't leak memory. */
export declare const MAX_SENT_IDS = 500;
/**
 * Insert `id` into the bounded sent-ID set. `Set` preserves insertion order
 * so the oldest entry is `values().next().value` — evict it when we
 * overflow.
 */
export declare function rememberSentId(sentIds: Set<string>, id: string): void;
