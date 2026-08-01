/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { getPersistScopeForModelSelection } from '../../config/modelProvidersScope.js';
import { backupSettingsFile, cleanupSettingsBackup, restoreSettingsFromBackup, } from '../../utils/settingsUtils.js';
function isSameModelIdentity(a, b) {
    return a.id === b.id && (a.baseUrl ?? '') === (b.baseUrl ?? '');
}
function applyModelProvidersPatch(existingModelProviders, patch) {
    const existingModels = existingModelProviders[patch.authType] ?? [];
    let updatedModels = patch.models;
    if (patch.mergeStrategy === 'append') {
        updatedModels = [...existingModels, ...patch.models];
    }
    else {
        const ownsModel = patch.ownsModel;
        const preservedModels = existingModels.filter((model) => {
            if (ownsModel) {
                return !ownsModel(model);
            }
            return !patch.models.some((newModel) => isSameModelIdentity(newModel, model));
        });
        updatedModels =
            patch.mergeStrategy === 'replace-owned'
                ? [...preservedModels, ...patch.models]
                : [...patch.models, ...preservedModels];
    }
    return {
        ...existingModelProviders,
        [patch.authType]: updatedModels,
    };
}
export async function applyProviderInstallPlan(plan, { settings, config, scope, refreshAuth = true, }) {
    const persistScope = scope ?? getPersistScopeForModelSelection(settings);
    const settingsFile = settings.forScope(persistScope);
    backupSettingsFile(settingsFile.path);
    const previousEnvValues = new Map();
    const previousSettingsSnapshot = structuredClone(settingsFile.settings);
    const previousOriginalSnapshot = structuredClone(settingsFile.originalSettings);
    const previousModelProviders = {
        ...(settings.merged.modelProviders ??
            {}),
    };
    try {
        for (const [key, value] of Object.entries(plan.env ?? {})) {
            previousEnvValues.set(key, process.env[key]);
            settings.setValue(persistScope, `env.${key}`, value);
            process.env[key] = value;
        }
        let updatedModelProviders = {
            ...(settings.merged.modelProviders ?? {}),
        };
        for (const patch of plan.modelProviders ?? []) {
            updatedModelProviders = applyModelProvidersPatch(updatedModelProviders, patch);
            settings.setValue(persistScope, `modelProviders.${patch.authType}`, updatedModelProviders[patch.authType] ?? []);
        }
        settings.setValue(persistScope, 'security.auth.selectedType', plan.authType);
        if (plan.legacyCredentials?.apiKey != null) {
            settings.setValue(persistScope, 'security.auth.apiKey', plan.legacyCredentials.apiKey);
        }
        if (plan.legacyCredentials?.baseUrl != null) {
            settings.setValue(persistScope, 'security.auth.baseUrl', plan.legacyCredentials.baseUrl);
        }
        if (plan.modelSelection?.modelId) {
            settings.setValue(persistScope, 'model.name', plan.modelSelection.modelId);
        }
        for (const [key, entries] of Object.entries(plan.providerState ?? {})) {
            for (const [field, value] of Object.entries(entries)) {
                settings.setValue(persistScope, `${key}.${field}`, value);
            }
        }
        config.reloadModelProvidersConfig(updatedModelProviders);
        if (plan.modelSelection?.modelId) {
            config
                .getModelsConfig()
                .syncAfterAuthRefresh(plan.authType, plan.modelSelection.modelId);
        }
        if (refreshAuth) {
            await config.refreshAuth(plan.authType);
        }
        cleanupSettingsBackup(settingsFile.path);
        return {
            persistScope,
            updatedModelProviders,
        };
    }
    catch (error) {
        restoreSettingsFromBackup(settingsFile.path);
        // Restore in-memory settings state
        settingsFile.settings = previousSettingsSnapshot;
        settingsFile.originalSettings = previousOriginalSnapshot;
        settings.recomputeMerged();
        // Restore in-memory config state
        config.reloadModelProvidersConfig(previousModelProviders);
        for (const [key, prev] of previousEnvValues) {
            if (prev === undefined) {
                delete process.env[key];
            }
            else {
                process.env[key] = prev;
            }
        }
        throw error;
    }
}
//# sourceMappingURL=applyProviderInstallPlan.js.map