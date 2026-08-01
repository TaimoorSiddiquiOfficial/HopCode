import type { ActionId } from '@/actions/definitions';
interface ActionMenuItemProps {
    action: ActionId;
    onClick?: () => void;
    children?: React.ReactNode;
}
export declare function ActionMenuItem({ action, onClick, children }: ActionMenuItemProps): import("react").JSX.Element;
export {};
