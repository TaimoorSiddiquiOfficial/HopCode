/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Static model catalog for all supported AI providers.
 * Each category within a provider groups models by capability tier.
 *
 * Models are listed most-capable first within each category.
 * IDs use the format expected by the active provider's API.
 */
export interface ModelEntry {
    id: string;
    label: string;
    description?: string;
    /** Rough context window hint shown to the user */
    context?: string;
}
export interface ModelCategory {
    name: string;
    models: ModelEntry[];
}
export interface ProviderCatalog {
    providerId: string;
    categories: ModelCategory[];
}
/** Returns the static model catalog for a given providerId, or undefined. */
export declare function getCatalog(providerId: string): ProviderCatalog | undefined;
/** Returns all catalog entries (useful for listing all providers). */
export declare function getAllCatalogs(): ProviderCatalog[];
