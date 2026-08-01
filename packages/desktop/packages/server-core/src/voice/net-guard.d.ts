/**
 * SSRF guard for the resolved voice baseUrl. Voice audio must never be sent in
 * cleartext or to a private-network address, so the configured ASR endpoint is
 * required to be https (or loopback) and is checked against private IP ranges —
 * including a DNS resolution so a public hostname can't point at an internal IP.
 *
 * Ported from the CLI voice pipeline (packages/cli/src/ui/voice/voice-transcriber.ts).
 */
export type VoiceHostLookup = (hostname: string) => Promise<{
    address: string;
} | Array<{
    address: string;
}>>;
export declare function isLoopbackHost(hostname: string): boolean;
/** IP-literal private-network check; hostname resolution is handled separately. */
export declare function isPrivateNetworkIp(hostname: string): boolean;
/** Reject a voice baseUrl that resolves to a private-network address. */
export declare function assertVoiceBaseUrlNetworkAllowed(baseUrl: string, model: string, lookupHost?: VoiceHostLookup): Promise<void>;
