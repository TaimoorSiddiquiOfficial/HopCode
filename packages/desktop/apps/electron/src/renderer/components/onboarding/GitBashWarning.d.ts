import type { GitBashStatus } from "../../../shared/types";
export type { GitBashStatus };
interface GitBashWarningProps {
    status: GitBashStatus;
    onBrowse: () => Promise<string | null>;
    onUsePath: (path: string) => void;
    onRecheck: () => void;
    onBack: () => void;
    isRechecking?: boolean;
    errorMessage?: string;
    onClearError?: () => void;
}
/**
 * GitBashWarning - Warning screen when Git Bash is not found on Windows
 *
 * Shows:
 * - Warning message explaining why Git Bash is needed
 * - Download link to Git for Windows
 * - Option to manually specify bash.exe path
 * - Option to skip and continue anyway
 */
export declare function GitBashWarning({ status, onBrowse, onUsePath, onRecheck, onBack, isRechecking, errorMessage, onClearError, }: GitBashWarningProps): import("react").JSX.Element;
