/**
 * MessagingPlatformIcon
 *
 * Parallel of ConnectionIcon (for LLM providers) but for messaging platforms.
 * Renders the brand mark for Telegram / WhatsApp. Falls back to a colored
 * platform-initial badge if the SVG import fails at runtime.
 *
 * SVGs in `assets/messaging-icons/` are shorthand brand marks tuned for a
 * prototype — for production we should swap in the official marks from each
 * platform's press kit.
 */
type MessagingPlatform = 'telegram' | 'whatsapp';
interface MessagingPlatformIconProps {
    platform: MessagingPlatform;
    /** Size in pixels (default: 16). */
    size?: number;
    className?: string;
}
export declare function MessagingPlatformIcon({ platform, size, className, }: MessagingPlatformIconProps): import("react").JSX.Element;
export {};
