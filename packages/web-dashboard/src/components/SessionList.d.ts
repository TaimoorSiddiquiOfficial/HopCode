/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * SessionList — Left sidebar showing all sessions with search
 */
import type { SessionMeta } from '../App.js';
interface Props {
    sessions: SessionMeta[];
    selectedId: string | null;
    search: string;
    onSearchChange: (q: string) => void;
    onSelect: (s: SessionMeta) => void;
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
}
export default function SessionList({ sessions, selectedId, search, onSearchChange, onSelect, hasMore, isLoading, onLoadMore, }: Props): import("react").JSX.Element;
export {};
