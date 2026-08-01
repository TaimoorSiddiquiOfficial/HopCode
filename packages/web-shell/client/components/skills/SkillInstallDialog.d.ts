import type { DaemonSkillInstallRequest } from '@hoptrendy/sdk/daemon';
interface SkillInstallDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onInstall: (request: DaemonSkillInstallRequest) => Promise<void>;
}
export declare function SkillInstallDialog({ open, onOpenChange, onInstall, }: SkillInstallDialogProps): import("react").JSX.Element;
export {};
