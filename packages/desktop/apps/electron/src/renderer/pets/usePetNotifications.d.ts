export type PetNotificationKind = 'running' | 'pending' | 'success' | 'error' | 'info';
export interface PetNotification {
    sessionId: string;
    kind: PetNotificationKind;
    /** i18n key for the card title. */
    titleKey: string;
    /** monotonic update counter — newest on top. */
    seq: number;
}
export declare function usePetNotifications(): {
    items: PetNotification[];
    dismiss: (sessionId: string) => void;
    clear: () => void;
};
