/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import { type SkillDefinition } from '../../types.js';
interface SkillsListProps {
    skills: readonly SkillDefinition[];
}
export declare const SkillsList: React.FC<SkillsListProps>;
export {};
