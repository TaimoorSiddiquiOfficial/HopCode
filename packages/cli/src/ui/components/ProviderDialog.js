import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useContext, useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { AuthType, } from '@hoptrendy/hopcode-core';
import { theme } from '../semantic-colors.js';
import { useKeypress } from '../hooks/useKeypress.js';
import { DescriptiveRadioButtonSelect, } from './shared/DescriptiveRadioButtonSelect.js';
import { TextInput } from './shared/TextInput.js';
import { ConfigContext } from '../contexts/ConfigContext.js';
import { UIStateContext } from '../contexts/UIStateContext.js';
import { useSettings } from '../contexts/SettingsContext.js';
import { getPersistScopeForModelSelection } from '../../config/modelProvidersScope.js';
import { t } from '../../i18n/index.js';
import { PROVIDER_REGISTRY, } from '../../commands/auth/registry.js';
import { getCatalog } from '../../commands/model/catalog.js';
import { fetchOllamaModels } from '../../commands/model/ollama.js';
import { fetchOpenAICompatibleModels } from '../../commands/model/discovery.js';
import { saveProfile } from '../../commands/profile/profileStore.js';
/** Returns a masked version of a key like: sk-...4f3a */
function maskApiKey(key) {
    if (!key)
        return '';
    if (key.length <= 8)
        return '●'.repeat(key.length);
    return key.slice(0, 4) + '…' + key.slice(-4);
}
/**
 * Read stored API key: checks process.env first, then settings.merged.env as
 * fallback (handles cases where loadEnvironment didn't populate process.env).
 */
function getStoredApiKey(settings, envKey) {
    if (process.env[envKey])
        return process.env[envKey];
    const env = settings.merged?.env;
    return env?.[envKey] || undefined;
}
function persistProviderConfig(settings, provider, modelId, apiKey) {
    const scope = getPersistScopeForModelSelection(settings);
    // Persist API key to settings.env and process.env
    if (provider.envKey && apiKey) {
        settings.setValue(scope, `env.${provider.envKey}`, apiKey);
        process.env[provider.envKey] = apiKey;
    }
    else if (!provider.requiresApiKey) {
        // Ollama local: dummy key
        if (provider.envKey) {
            settings.setValue(scope, `env.${provider.envKey}`, 'ollama');
            process.env[provider.envKey] = 'ollama';
        }
    }
    // Build model provider config entry
    const newModelConfig = {
        id: modelId,
        name: `[${provider.label}] ${modelId}`,
        envKey: provider.envKey || undefined,
        ...(provider.baseUrl ? { baseUrl: provider.baseUrl } : {}),
    };
    // Persist to the correct modelProviders bucket
    const modelProvidersKey = provider.authType === AuthType.USE_ANTHROPIC
        ? AuthType.USE_ANTHROPIC
        : provider.authType === AuthType.USE_GEMINI
            ? undefined
            : AuthType.USE_OPENAI;
    if (modelProvidersKey) {
        const existingConfigs = (settings.merged.modelProviders ?? {})[modelProvidersKey] ?? [];
        const filteredConfigs = existingConfigs.filter((c) => !(c.envKey === provider.envKey && c.baseUrl === provider.baseUrl));
        settings.setValue(scope, `modelProviders.${modelProvidersKey}`, [
            newModelConfig,
            ...filteredConfigs,
        ]);
    }
    settings.setValue(scope, 'model.name', modelId);
    settings.setValue(scope, 'security.auth.selectedType', provider.authType);
}
export function ProviderDialog({ onClose, }) {
    const config = useContext(ConfigContext);
    const uiState = useContext(UIStateContext);
    const settings = useSettings();
    const [step, setStep] = useState('provider');
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [highlightedProviderId, setHighlightedProviderId] = useState(null);
    const [apiKey, setApiKey] = useState('');
    const [apiKeyError, setApiKeyError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [modelItems, setModelItems] = useState([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);
    const [selectedModelId, setSelectedModelId] = useState('');
    // ── Step 1: Provider list ────────────────────────────────────────────────
    const providerItems = PROVIDER_REGISTRY.map((p) => {
        const existingKey = p.requiresApiKey
            ? getStoredApiKey(settings, p.envKey)
            : undefined;
        const suffix = existingKey ? ` · ✓ ${maskApiKey(existingKey)}` : '';
        return {
            key: p.id,
            title: p.label,
            description: p.description + suffix,
            value: p.id,
        };
    });
    const handleProviderSelect = useCallback((value) => {
        const provider = PROVIDER_REGISTRY.find((p) => p.id === value);
        if (!provider)
            return;
        setSelectedProvider(provider);
        setApiKey('');
        setApiKeyError(null);
        setErrorMessage(null);
        // Always show API key step for providers that require one,
        // so users can update their key or press Enter to keep the existing one.
        if (provider.requiresApiKey) {
            setStep('apikey');
        }
        else {
            setStep('model');
        }
    }, []);
    // ── Step 2: API key input ────────────────────────────────────────────────
    const handleApiKeySubmit = useCallback(() => {
        const trimmed = apiKey.trim();
        // Allow empty submission if a key is already configured (keep existing key)
        const alreadyConfigured = selectedProvider?.requiresApiKey &&
            !!getStoredApiKey(settings, selectedProvider.envKey);
        if (!trimmed && !alreadyConfigured) {
            setApiKeyError(t('API key cannot be empty.'));
            return;
        }
        setApiKeyError(null);
        setStep('model');
    }, [apiKey, selectedProvider, settings]);
    // ── Step 3: Model selection — async live fetch ───────────────────────────
    useEffect(() => {
        if (step !== 'model' || !selectedProvider)
            return;
        let cancelled = false;
        setIsLoadingModels(true);
        setModelItems([]);
        const effectiveApiKey = selectedProvider.requiresApiKey
            ? apiKey.trim() ||
                getStoredApiKey(settings, selectedProvider.envKey) ||
                ''
            : undefined;
        async function load() {
            if (!selectedProvider)
                return;
            let categories = null;
            if (selectedProvider.liveModels && selectedProvider.baseUrl) {
                const isOllama = selectedProvider.id.startsWith('ollama');
                categories = isOllama
                    ? await fetchOllamaModels(selectedProvider.baseUrl, effectiveApiKey)
                    : await fetchOpenAICompatibleModels(selectedProvider.baseUrl, effectiveApiKey);
            }
            // Fall back to static catalog
            if (!categories) {
                const catalog = getCatalog(selectedProvider.id);
                if (catalog)
                    categories = catalog.categories;
            }
            // Last resort: show the default model
            if (!categories || categories.length === 0) {
                categories = [
                    {
                        name: t('Default'),
                        models: [
                            {
                                id: selectedProvider.defaultModel,
                                label: selectedProvider.defaultModel,
                            },
                        ],
                    },
                ];
            }
            if (!cancelled) {
                setModelItems(categories.flatMap((cat) => cat.models.map((m) => ({
                    key: m.id,
                    title: m.label,
                    description: `${cat.name}${m.description ? ` · ${m.description}` : ''}${'context' in m && m.context ? ` · ${String(m.context)}` : ''}`,
                    value: m.id,
                }))));
                setIsLoadingModels(false);
            }
        }
        load().catch((err) => {
            if (!cancelled) {
                setErrorMessage(err instanceof Error ? err.message : String(err));
                setIsLoadingModels(false);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [step, selectedProvider, apiKey, settings]);
    const handleModelSelect = useCallback(async (modelId) => {
        if (!selectedProvider)
            return;
        const effectiveApiKey = selectedProvider.requiresApiKey
            ? apiKey.trim() ||
                getStoredApiKey(settings, selectedProvider.envKey) ||
                ''
            : 'ollama';
        try {
            persistProviderConfig(settings, selectedProvider, modelId, effectiveApiKey);
            uiState?.historyManager.addItem({
                type: 'info',
                text: `✓ ${t('Configured provider')}: ${selectedProvider.label}\n` +
                    `${t('Model')}: ${modelId}`,
            }, Date.now());
            // Reload modelProviders into in-memory config BEFORE refreshAuth so the
            // new provider/model is recognised during auth validation (avoids the
            // "Model not found for authType" error and ensures the header updates).
            config?.reloadModelProvidersConfig(settings.merged.modelProviders);
            // Refresh auth async (fire-and-forget; errors shown via historyManager)
            config?.refreshAuth(selectedProvider.authType).catch((err) => {
                const msg = err instanceof Error ? err.message : String(err);
                uiState?.historyManager.addItem({
                    type: 'error',
                    text: `${t('Provider auth refresh failed')}: ${msg}`,
                }, Date.now());
            });
            // Offer to save as profile
            setSelectedModelId(modelId);
            setProfileName(`${selectedProvider.id}-${modelId.replace(/[^a-zA-Z0-9_-]/g, '-')}`);
            setStep('profile');
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setErrorMessage(msg);
        }
    }, [selectedProvider, apiKey, settings, config, uiState]);
    // ── Step 4: Save as profile ──────────────────────────────────────────────
    const handleSaveProfile = useCallback(async () => {
        if (!selectedProvider)
            return;
        const trimmedName = profileName.trim();
        if (!trimmedName)
            return;
        setSavingProfile(true);
        try {
            const profile = {
                name: trimmedName,
                provider: selectedProvider.id,
                model: selectedModelId || selectedProvider.defaultModel,
                baseUrl: selectedProvider.baseUrl || undefined,
                apiKey: selectedProvider.requiresApiKey
                    ? apiKey.trim() ||
                        getStoredApiKey(settings, selectedProvider.envKey) ||
                        ''
                    : undefined,
                envKey: selectedProvider.envKey || undefined,
                description: `${selectedProvider.label} profile`,
                createdAt: new Date().toISOString(),
            };
            await saveProfile(profile);
            uiState?.historyManager.addItem({
                type: 'info',
                text: `✓ ${t('Profile saved')}: ${trimmedName}`,
            }, Date.now());
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            uiState?.historyManager.addItem({ type: 'error', text: `${t('Failed to save profile')}: ${msg}` }, Date.now());
        }
        finally {
            setSavingProfile(false);
            onClose();
        }
    }, [
        selectedProvider,
        profileName,
        selectedModelId,
        apiKey,
        settings,
        uiState,
        onClose,
    ]);
    // ── Keyboard: Escape navigation ──────────────────────────────────────────
    useKeypress((key) => {
        if (key.name !== 'escape')
            return;
        if (step === 'provider') {
            onClose();
        }
        else if (step === 'apikey') {
            setStep('provider');
        }
        else if (step === 'model') {
            // Go back to apikey step if provider requires one, else back to provider list
            if (selectedProvider?.requiresApiKey) {
                setStep('apikey');
            }
            else {
                setStep('provider');
            }
        }
        else if (step === 'profile') {
            // Escape on profile step: skip and close
            onClose();
        }
    }, { isActive: true });
    // ── Render ───────────────────────────────────────────────────────────────
    return (_jsxs(Box, { borderStyle: "round", borderColor: theme.border.default, flexDirection: "column", padding: 1, width: "100%", children: [step === 'provider' && (_jsxs(_Fragment, { children: [_jsx(Text, { bold: true, children: t('Configure Provider') }), _jsx(Box, { marginTop: 1, children: _jsx(DescriptiveRadioButtonSelect, { items: providerItems, onSelect: handleProviderSelect, onHighlight: (value) => setHighlightedProviderId(value), showNumbers: true }) }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: theme.text.secondary, children: t('Enter to configure, Esc to close') }) }), (highlightedProviderId === 'ollama-local' ||
                        highlightedProviderId === 'ollama-cloud') && (_jsx(Box, { marginTop: 1, borderStyle: "single", borderColor: theme.border.default, paddingX: 1, flexDirection: "column", children: highlightedProviderId === 'ollama-local' ? (_jsxs(_Fragment, { children: [_jsx(Text, { bold: true, color: theme.text.accent, children: "Ollama Local \u2014 Quick Start" }), _jsx(Text, { color: theme.text.secondary, children: "1. Install: https://ollama.com/download" }), _jsx(Text, { color: theme.text.secondary, children: "2. Start: ollama serve" }), _jsx(Text, { color: theme.text.secondary, children: "3. Pull: ollama pull llama3.2" }), _jsx(Text, { color: theme.text.secondary, children: "CLI: hopcode auth ollama-local [--host http://...]" })] })) : (_jsxs(_Fragment, { children: [_jsx(Text, { bold: true, color: theme.text.accent, children: "Ollama Cloud \u2014 Quick Start" }), _jsx(Text, { color: theme.text.secondary, children: "Get API key: https://ollama.com \u2192 Account \u2192 API Keys" }), _jsxs(Text, { color: theme.text.secondary, children: ["CLI: hopcode auth ollama-cloud --key ", '<', "your-key", '>'] })] })) }))] })), step === 'apikey' && selectedProvider && (_jsxs(_Fragment, { children: [_jsx(Text, { bold: true, children: t('Configure {{provider}}', { provider: selectedProvider.label }) }), _jsxs(Box, { marginTop: 1, flexDirection: "column", children: [selectedProvider.id === 'ollama-cloud' && (_jsxs(Box, { marginBottom: 1, borderStyle: "single", borderColor: theme.border.default, paddingX: 1, flexDirection: "column", children: [_jsx(Text, { bold: true, color: theme.text.accent, children: "Ollama Cloud API Key" }), _jsx(Text, { color: theme.text.secondary, children: "Get yours at: https://ollama.com \u2192 Account \u2192 API Keys" })] })), getStoredApiKey(settings, selectedProvider.envKey) ? (_jsxs(Text, { color: theme.text.secondary, children: [t('Key already set'), " (", maskApiKey(getStoredApiKey(settings, selectedProvider.envKey)), "). ", t('Press Enter to keep it, or type a new one:')] })) : (_jsx(Text, { color: theme.text.secondary, children: t('Enter your {{provider}} API key:', {
                                    provider: selectedProvider.label,
                                }) })), _jsx(Box, { marginTop: 1, children: _jsx(TextInput, { value: apiKey, onChange: setApiKey, onSubmit: handleApiKeySubmit, placeholder: getStoredApiKey(settings, selectedProvider.envKey)
                                        ? t('Leave empty to keep existing key…')
                                        : t('Paste API key here...'), mask: true, isActive: true }) }), apiKeyError && (_jsx(Box, { marginTop: 1, children: _jsx(Text, { color: theme.status.error, children: apiKeyError }) }))] }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: theme.text.secondary, children: t('Enter to continue, Esc to go back') }) })] })), step === 'model' && selectedProvider && (_jsxs(_Fragment, { children: [_jsx(Text, { bold: true, children: t('Select Model — {{provider}}', {
                            provider: selectedProvider.label,
                        }) }), _jsx(Box, { marginTop: 1, children: isLoadingModels ? (_jsx(Text, { color: theme.text.secondary, children: selectedProvider.id.startsWith('ollama')
                                ? t('⟳ Connecting to {{provider}}…', {
                                    provider: selectedProvider.label,
                                })
                                : t('⟳ Fetching available models…') })) : (_jsx(DescriptiveRadioButtonSelect, { items: modelItems, onSelect: handleModelSelect, onHighlight: () => { }, showNumbers: true })) }), errorMessage && (_jsx(Box, { marginTop: 1, children: _jsxs(Text, { color: theme.status.error, children: ["\u2715 ", errorMessage] }) })), !isLoadingModels &&
                        selectedProvider.id === 'ollama-local' &&
                        !errorMessage && (_jsx(Box, { marginTop: 1, flexDirection: "column", children: _jsxs(Text, { color: theme.text.secondary, children: ["Tip: pull more models with", ' ', _jsxs(Text, { bold: true, children: ["ollama pull ", '<', "model", '>'] })] }) })), !isLoadingModels && (_jsx(Box, { marginTop: 1, children: _jsx(Text, { color: theme.text.secondary, children: t('Enter to select, ↑↓ to navigate, Esc to go back') }) }))] })), step === 'profile' && selectedProvider && (_jsxs(_Fragment, { children: [_jsx(Text, { bold: true, children: t('Save as Profile?') }), _jsxs(Box, { marginTop: 1, flexDirection: "column", children: [_jsx(Text, { color: theme.text.secondary, children: t('Save this provider configuration as a reusable profile? You can switch to it later with "hopcode profile use <name>"') }), _jsx(Box, { marginTop: 1, children: _jsx(TextInput, { value: profileName, onChange: setProfileName, onSubmit: handleSaveProfile, placeholder: t('Profile name…'), isActive: true }) }), savingProfile && (_jsx(Box, { marginTop: 1, children: _jsx(Text, { color: theme.text.secondary, children: t('⟳ Saving profile…') }) })), errorMessage && (_jsx(Box, { marginTop: 1, children: _jsxs(Text, { color: theme.status.error, children: ["\u2715 ", errorMessage] }) }))] }), _jsxs(Box, { marginTop: 1, flexDirection: "row", gap: 1, children: [_jsx(Text, { children: t('Enter to save,') }), _jsx(Text, { color: theme.text.secondary, children: t('Esc to skip and close') })] })] }))] }));
}
//# sourceMappingURL=ProviderDialog.js.map