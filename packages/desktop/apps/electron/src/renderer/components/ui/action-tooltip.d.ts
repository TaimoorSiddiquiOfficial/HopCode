import type { ActionId } from '@/actions/definitions';
interface ActionTooltipProps {
    action: ActionId;
    children: React.ReactNode;
}
export declare function ActionTooltip({ action, children }: ActionTooltipProps): import("react").JSX.Element;
export {};
