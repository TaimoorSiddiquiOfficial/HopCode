export type BannerState = 'hidden' | 'mcp_auth' | 'api_auth' | 'error';
interface SetupAuthBannerProps {
    state: BannerState;
    reason?: string;
    onAction: () => void;
    /** Variant: 'banner' for chat list, 'inputAreaCover' matches chat input styling */
    variant?: 'banner' | 'inputAreaCover';
}
/**
 * SetupAuthBanner - Shows when sources need authentication
 *
 * States:
 * - 'hidden': No banner shown
 * - 'mcp_auth': MCP sources need authentication
 * - 'api_auth': API sources need credentials
 * - 'error': Something went wrong (allows retry)
 */
export declare function SetupAuthBanner({ state, reason, onAction, variant }: SetupAuthBannerProps): import("react").JSX.Element | null;
export {};
