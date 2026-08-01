import type { TodoItem } from '../../adapters/types';
import type { WebShellBottomStatusItem } from '../../customization';
interface TodoPanelProps {
    todos: TodoItem[];
    title?: string;
    statusItems?: readonly WebShellBottomStatusItem[];
}
export declare const TodoPanel: import("react").MemoExoticComponent<({ todos, title, statusItems, }: TodoPanelProps) => import("react").JSX.Element | null>;
export {};
