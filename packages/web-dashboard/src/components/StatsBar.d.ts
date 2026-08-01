/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * StatsBar — Top-right global stats display
 */
import type { GlobalStats } from '../App.js';
interface Props {
    stats: GlobalStats | null;
    totalSessions: number;
}
export default function StatsBar({ stats, totalSessions }: Props): import("react").JSX.Element;
export {};
