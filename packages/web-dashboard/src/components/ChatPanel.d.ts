/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * ChatPanel — Main area showing chat messages for a selected session
 */
import type { SessionMeta } from '../App.js';
interface Props {
    session: SessionMeta;
}
export default function ChatPanel({ session }: Props): import("react").JSX.Element;
export {};
