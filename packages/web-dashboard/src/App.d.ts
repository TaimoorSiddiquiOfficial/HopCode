/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * HopCode Web Dashboard — Root App Component
 */
export interface SessionMeta {
    sessionId: string;
    projectDir: string;
    filePath: string;
    mtime: number;
    startTime: string;
    cwd: string;
    prompt: string;
    gitBranch?: string;
    messageCount: number;
    model?: string;
}
export interface GlobalStats {
    totalSessions: number;
    totalMessages: number;
    totalTokens: number;
    topModel: string | null;
    modelCounts: Record<string, number>;
    hopcodeDir: string;
}
export default function App(): import("react").JSX.Element;
