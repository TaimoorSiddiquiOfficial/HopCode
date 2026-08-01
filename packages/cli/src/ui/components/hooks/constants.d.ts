/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { HooksConfigSource, HookEventName } from '@hoptrendy/hopcode-core';
import type { HookExitCode, HookEventDisplayInfo } from './types.js';
/**
 * Exit code descriptions for different hook types
 */
export declare function getHookExitCodes(eventName: string): HookExitCode[];
/**
 * Short one-line description for hooks list view
 */
export declare function getHookShortDescription(eventName: string): string;
/**
 * Detailed description for each hook event type (shown in detail view)
 */
export declare function getHookDescription(eventName: string): string;
/**
 * Source display mapping (translated)
 */
export declare function getTranslatedSourceDisplayMap(): Record<HooksConfigSource, string>;
export declare const DISPLAY_HOOK_EVENTS: HookEventName[];
export declare function supportsMatchers(eventName: HookEventName): boolean;
export declare function createEmptyHookEventInfo(eventName: HookEventName): HookEventDisplayInfo;
