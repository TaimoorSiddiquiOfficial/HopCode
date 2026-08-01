/**
 * @license
 * Copyright 2025 HopCode
 * SPDX-License-Identifier: Apache-2.0
 */
import { AuthType, type Config, type ProviderModelConfig as ModelConfig } from '@hoptrendy/hopcode-core';
import type { LoadedSettings } from '../../config/settings.js';
/**
 * All provider IDs that support live model browsing via manage-models.
 * Derived from PROVIDER_REGISTRY entries with liveModels: true and USE_OPENAI authType.
 */
export declare const MANAGE_MODELS_SOURCES: readonly string[];
export type ManageModelsSource = string;
export interface ManageModelsCatalogEntry {
    id: string;
    label: string;
    searchText: string;
    supportsVision: boolean;
    contextWindowSize?: number;
    badges: string[];
    model: ModelConfig;
}
export interface ManageModelsCatalog {
    source: ManageModelsSource;
    title: string;
    description: string;
    authType: AuthType;
    entries: ManageModelsCatalogEntry[];
}
export interface ManageModelsSaveResult {
    updatedConfigs: ModelConfig[];
    selectedIds: string[];
    activeModelId?: string;
}
export declare function fetchManageModelsCatalog(source: ManageModelsSource): Promise<ManageModelsCatalog>;
export declare function getEnabledModelIdsForSource(source: ManageModelsSource, settings: LoadedSettings): string[];
export declare function saveManageModelsSelection(params: {
    source: ManageModelsSource;
    selectedModels: ModelConfig[];
    settings: LoadedSettings;
    config: Config;
}): Promise<ManageModelsSaveResult>;
