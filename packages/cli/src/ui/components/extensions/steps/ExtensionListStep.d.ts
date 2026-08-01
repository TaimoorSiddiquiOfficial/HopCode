/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Extension } from '@hoptrendy/hopcode-core';
interface ExtensionListStepProps {
    extensions: Extension[];
    extensionsUpdateState: Map<string, string>;
    onExtensionSelect: (extensionIndex: number) => void;
}
export declare const ExtensionListStep: ({ extensions, extensionsUpdateState, onExtensionSelect, }: ExtensionListStepProps) => import("react").JSX.Element;
export {};
