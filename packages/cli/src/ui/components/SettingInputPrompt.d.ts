/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
type SettingInputPromptProps = {
    settingName: string;
    settingDescription: string;
    sensitive: boolean;
    onSubmit: (value: string) => void;
    onCancel: () => void;
    terminalWidth: number;
};
export declare const SettingInputPrompt: (props: SettingInputPromptProps) => import("react").JSX.Element;
export {};
