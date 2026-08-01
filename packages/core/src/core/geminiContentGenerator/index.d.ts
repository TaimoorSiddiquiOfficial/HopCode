/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ContentGenerator, ContentGeneratorConfig } from '../contentGenerator.js';
import type { Config } from '../../config/config.js';
export { GeminiContentGenerator } from './geminiContentGenerator.js';
/**
 * Create a Gemini content generator.
 */
export declare function createGeminiContentGenerator(config: ContentGeneratorConfig, gcConfig: Config): ContentGenerator;
