/**
 * @license
 * Copyright 2025 Qwen
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
export interface VoiceButtonProps {
    /** Insert the final transcript into the composer (user reviews, then sends). */
    onInsert: (text: string) => void;
    disabled?: boolean;
}
export declare function VoiceButton({ onInsert, disabled, }: VoiceButtonProps): React.JSX.Element | null;
