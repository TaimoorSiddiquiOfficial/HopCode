import type { PetNotification } from '@/pets/usePetNotifications';
interface Props {
    items: PetNotification[];
    dismiss: (sessionId: string) => void;
}
/**
 * The list of notification cards (newest first). Caps its height and scrolls
 * when there are many; collapse state + the toggle live in the parent so the
 * toggle stays pinned regardless of the list.
 */
export declare function PetNotifications({ items, dismiss }: Props): import("react").JSX.Element;
export {};
