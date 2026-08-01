/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export type LoopDetectionConfirmationResult = {
    userSelection: 'disable' | 'keep';
};
interface LoopDetectionConfirmationProps {
    onComplete: (result: LoopDetectionConfirmationResult) => void;
}
export declare function LoopDetectionConfirmation({ onComplete, }: LoopDetectionConfirmationProps): import("react").JSX.Element;
export {};
