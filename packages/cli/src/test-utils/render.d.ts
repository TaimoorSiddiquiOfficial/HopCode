/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import { EventEmitter } from 'node:events';
import type { Config } from '@hoptrendy/hopcode-core';
import { LoadedSettings } from '../config/settings.js';
declare class Stdout extends EventEmitter {
    get columns(): number;
    frames: string[];
    _lastFrame: string | undefined;
    write: (frame: string) => void;
    lastFrame: () => string | undefined;
}
declare class Stderr extends EventEmitter {
    frames: string[];
    _lastFrame: string | undefined;
    write: (frame: string) => void;
    lastFrame: () => string | undefined;
}
declare class Stdin extends EventEmitter {
    isTTY: boolean;
    data: Buffer | string | null;
    constructor(options?: {
        isTTY?: boolean;
    });
    write: (data: string) => void;
    setEncoding(): void;
    setRawMode(): void;
    resume(): void;
    pause(): void;
    ref(): void;
    unref(): void;
    read: () => string | Buffer<ArrayBufferLike> | null;
}
export declare function cleanup(): void;
export type TestKeypress = {
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
    sequence: string;
    paste?: boolean;
    pasteImage?: boolean;
    input?: string;
};
export declare const renderWithProviders: (component: React.ReactElement, { shellFocus, settings, config, }?: {
    shellFocus?: boolean;
    settings?: LoadedSettings;
    config?: Config;
}) => {
    rerender: (node: React.ReactNode) => void;
    unmount: (error?: Error | number | null) => void;
    cleanup: () => void;
    stdout: Stdout;
    stderr: Stderr;
    stdin: Stdin;
    frames: string[];
    lastFrame: () => string | undefined;
};
export {};
