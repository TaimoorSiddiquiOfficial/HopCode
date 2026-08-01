import type { CommandInfo } from '../../adapters/types';
interface HelpDialogProps {
    commands: readonly CommandInfo[];
}
export declare function HelpDialog({ commands }: HelpDialogProps): import("react").JSX.Element;
export {};
