import type { PreparedOAuthFlow } from './oauth-flow-types.ts';
export declare const OAUTH_RELAY_CALLBACK_URL = "https://agents.craft.do/auth/callback";
export interface OAuthRelayState {
    returnTo: string;
    innerState: string;
}
export declare function isOAuthRelayState(value: string): boolean;
export declare function encodeOAuthRelayState(returnTo: string, innerState: string): string;
export declare function decodeOAuthRelayState(value: string): OAuthRelayState;
export declare function wrapPreparedOAuthFlowForRelay(prepared: PreparedOAuthFlow, returnTo: string): PreparedOAuthFlow;
