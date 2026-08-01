/**
 * Header - App header with branding and controls
 */
interface HeaderProps {
    hasSession: boolean;
    sessionTitle?: string;
    isDark: boolean;
    onToggleTheme: () => void;
    onClear: () => void;
}
export declare function Header({ hasSession, sessionTitle, isDark, onToggleTheme, onClear }: HeaderProps): import("react").JSX.Element;
export {};
