import * as React from 'react';
import type { OverlayCard } from '../../lib/tool-parsers';
export interface ActivityCardsOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    cards: OverlayCard[];
    title: string;
    theme?: 'light' | 'dark';
    onOpenUrl?: (url: string) => void;
    onOpenFile?: (path: string) => void;
}
export declare function ActivityCardsOverlay({ isOpen, onClose, cards, title, theme, onOpenUrl, onOpenFile, }: ActivityCardsOverlayProps): React.JSX.Element;
