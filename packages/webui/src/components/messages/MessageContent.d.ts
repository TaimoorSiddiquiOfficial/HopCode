/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface MessageContentProps {
    content: string;
    onFileClick?: (filePath: string) => void;
    enableFileLinks?: boolean;
}
export declare const MessageContent: import("react").NamedExoticComponent<MessageContentProps>;
