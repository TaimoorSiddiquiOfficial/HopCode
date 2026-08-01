export interface WelcomeHeaderProps {
    version: string;
    cwd: string;
    currentModel: string;
    currentMode: string;
    hideTips?: boolean;
}
export declare function WelcomeHeader({ version, cwd, currentModel, currentMode, hideTips, }: WelcomeHeaderProps): import("react").JSX.Element;
