/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import {
  AuthType,
  type ProviderModelConfig as ModelConfig,
} from '@hoptrendy/hopcode-core';
import { theme } from '../semantic-colors.js';
import { useKeypress } from '../hooks/useKeypress.js';
import {
  DescriptiveRadioButtonSelect,
  type DescriptiveRadioSelectItem,
} from './shared/DescriptiveRadioButtonSelect.js';
import { TextInput } from './shared/TextInput.js';
import { ConfigContext } from '../contexts/ConfigContext.js';
import { UIStateContext } from '../contexts/UIStateContext.js';
import { useSettings } from '../contexts/SettingsContext.js';
import { getPersistScopeForModelSelection } from '../../config/modelProvidersScope.js';
import { t } from '../../i18n/index.js';
import {
  PROVIDER_REGISTRY,
  type ProviderConfig,
} from '../../commands/auth/registry.js';
import { getCatalog } from '../../commands/model/catalog.js';
import { fetchOllamaModels } from '../../commands/model/ollama.js';
import { fetchOpenAICompatibleModels } from '../../commands/model/discovery.js';

type Step = 'provider' | 'apikey' | 'model';

interface ProviderDialogProps {
  onClose: () => void;
}

/** Returns a masked version of a key like: sk-...4f3a */
function maskApiKey(key: string): string {
  if (!key) return '';
  if (key.length <= 8) return '●'.repeat(key.length);
  return key.slice(0, 4) + '…' + key.slice(-4);
}

function persistProviderConfig(
  settings: ReturnType<typeof useSettings>,
  provider: ProviderConfig,
  modelId: string,
  apiKey: string,
): void {
  const scope = getPersistScopeForModelSelection(settings);

  // Persist API key to settings.env and process.env
  if (provider.envKey && apiKey) {
    settings.setValue(scope, `env.${provider.envKey}`, apiKey);
    process.env[provider.envKey] = apiKey;
  } else if (!provider.requiresApiKey) {
    // Ollama local: dummy key
    if (provider.envKey) {
      settings.setValue(scope, `env.${provider.envKey}`, 'ollama');
      process.env[provider.envKey] = 'ollama';
    }
  }

  // Build model provider config entry
  const newModelConfig: ModelConfig = {
    id: modelId,
    name: `[${provider.label}] ${modelId}`,
    envKey: provider.envKey || undefined,
    ...(provider.baseUrl ? { baseUrl: provider.baseUrl } : {}),
  };

  // Persist to the correct modelProviders bucket
  const modelProvidersKey =
    provider.authType === AuthType.USE_ANTHROPIC
      ? AuthType.USE_ANTHROPIC
      : provider.authType === AuthType.USE_GEMINI
        ? undefined
        : AuthType.USE_OPENAI;

  if (modelProvidersKey) {
    const existingConfigs =
      ((settings.merged.modelProviders as Record<string, ModelConfig[]>) ?? {})[
        modelProvidersKey
      ] ?? [];
    const filteredConfigs = existingConfigs.filter(
      (c) => !(c.envKey === provider.envKey && c.baseUrl === provider.baseUrl),
    );
    settings.setValue(scope, `modelProviders.${modelProvidersKey}`, [
      newModelConfig,
      ...filteredConfigs,
    ]);
  }

  settings.setValue(scope, 'model.name', modelId);
  settings.setValue(scope, 'security.auth.selectedType', provider.authType);
}

export function ProviderDialog({
  onClose,
}: ProviderDialogProps): React.JSX.Element {
  const config = useContext(ConfigContext);
  const uiState = useContext(UIStateContext);
  const settings = useSettings();

  const [step, setStep] = useState<Step>('provider');
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderConfig | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modelItems, setModelItems] = useState<
    Array<DescriptiveRadioSelectItem<string>>
  >([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // ── Step 1: Provider list ────────────────────────────────────────────────
  const providerItems = PROVIDER_REGISTRY.map(
    (p): DescriptiveRadioSelectItem<string> => {
      const existingKey = p.requiresApiKey ? process.env[p.envKey] : undefined;
      const suffix = existingKey ? ` · ✓ ${maskApiKey(existingKey)}` : '';
      return {
        key: p.id,
        title: p.label,
        description: p.description + suffix,
        value: p.id,
      };
    },
  );

  const handleProviderSelect = useCallback((value: string) => {
    const provider = PROVIDER_REGISTRY.find((p) => p.id === value);
    if (!provider) return;
    setSelectedProvider(provider);
    setApiKey('');
    setApiKeyError(null);
    setErrorMessage(null);

    // Always show API key step for providers that require one,
    // so users can update their key or press Enter to keep the existing one.
    if (provider.requiresApiKey) {
      setStep('apikey');
    } else {
      setStep('model');
    }
  }, []);

  // ── Step 2: API key input ────────────────────────────────────────────────
  const handleApiKeySubmit = useCallback(() => {
    const trimmed = apiKey.trim();
    // Allow empty submission if a key is already configured (keep existing key)
    const alreadyConfigured =
      selectedProvider?.requiresApiKey &&
      !!process.env[selectedProvider.envKey];
    if (!trimmed && !alreadyConfigured) {
      setApiKeyError(t('API key cannot be empty.'));
      return;
    }
    setApiKeyError(null);
    setStep('model');
  }, [apiKey, selectedProvider]);

  // ── Step 3: Model selection — async live fetch ───────────────────────────
  useEffect(() => {
    if (step !== 'model' || !selectedProvider) return;

    let cancelled = false;
    setIsLoadingModels(true);
    setModelItems([]);

    const effectiveApiKey = selectedProvider.requiresApiKey
      ? apiKey.trim() || process.env[selectedProvider.envKey] || ''
      : undefined;

    async function load(): Promise<void> {
      if (!selectedProvider) return;
      let categories = null;

      if (selectedProvider.liveModels && selectedProvider.baseUrl) {
        const isOllama = selectedProvider.id.startsWith('ollama');
        categories = isOllama
          ? await fetchOllamaModels(selectedProvider.baseUrl, effectiveApiKey)
          : await fetchOpenAICompatibleModels(
              selectedProvider.baseUrl,
              effectiveApiKey,
            );
      }

      // Fall back to static catalog
      if (!categories) {
        const catalog = getCatalog(selectedProvider.id);
        if (catalog) categories = catalog.categories;
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
        setModelItems(
          categories.flatMap((cat) =>
            cat.models.map(
              (m): DescriptiveRadioSelectItem<string> => ({
                key: m.id,
                title: m.label,
                description: `${cat.name}${m.description ? ` · ${m.description}` : ''}${'context' in m && m.context ? ` · ${String(m.context)}` : ''}`,
                value: m.id,
              }),
            ),
          ),
        );
        setIsLoadingModels(false);
      }
    }

    load().catch((err: unknown) => {
      if (!cancelled) {
        setErrorMessage(err instanceof Error ? err.message : String(err));
        setIsLoadingModels(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [step, selectedProvider, apiKey]);

  const handleModelSelect = useCallback(
    async (modelId: string) => {
      if (!selectedProvider) return;
      const effectiveApiKey = selectedProvider.requiresApiKey
        ? apiKey.trim() || process.env[selectedProvider.envKey] || ''
        : 'ollama';
      try {
        persistProviderConfig(
          settings,
          selectedProvider,
          modelId,
          effectiveApiKey,
        );

        uiState?.historyManager.addItem(
          {
            type: 'info',
            text:
              `✓ ${t('Configured provider')}: ${selectedProvider.label}\n` +
              `${t('Model')}: ${modelId}`,
          },
          Date.now(),
        );

        // Refresh auth async (fire-and-forget; errors shown via historyManager)
        config?.refreshAuth(selectedProvider.authType).catch((err: unknown) => {
          const msg = err instanceof Error ? err.message : String(err);
          uiState?.historyManager.addItem(
            {
              type: 'error',
              text: `${t('Provider auth refresh failed')}: ${msg}`,
            },
            Date.now(),
          );
        });

        onClose();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMessage(msg);
      }
    },
    [selectedProvider, apiKey, settings, config, uiState, onClose],
  );

  // ── Keyboard: Escape navigation ──────────────────────────────────────────
  useKeypress(
    (key) => {
      if (key.name !== 'escape') return;
      if (step === 'provider') {
        onClose();
      } else if (step === 'apikey') {
        setStep('provider');
      } else if (step === 'model') {
        // Go back to apikey step if provider requires one, else back to provider list
        if (selectedProvider?.requiresApiKey) {
          setStep('apikey');
        } else {
          setStep('provider');
        }
      }
    },
    { isActive: true },
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Box
      borderStyle="round"
      borderColor={theme.border.default}
      flexDirection="column"
      padding={1}
      width="100%"
    >
      {step === 'provider' && (
        <>
          <Text bold>{t('Configure Provider')}</Text>
          <Box marginTop={1}>
            <DescriptiveRadioButtonSelect
              items={providerItems}
              onSelect={handleProviderSelect}
              onHighlight={() => {}}
              showNumbers={true}
            />
          </Box>
          <Box marginTop={1}>
            <Text color={theme.text.secondary}>
              {t('Enter to configure, Esc to close')}
            </Text>
          </Box>
        </>
      )}

      {step === 'apikey' && selectedProvider && (
        <>
          <Text bold>
            {t('Configure {{provider}}', { provider: selectedProvider.label })}
          </Text>
          <Box marginTop={1} flexDirection="column">
            {process.env[selectedProvider.envKey] ? (
              <Text color={theme.text.secondary}>
                {t('Key already set')} (
                {maskApiKey(process.env[selectedProvider.envKey]!)}).{' '}
                {t('Press Enter to keep it, or type a new one:')}
              </Text>
            ) : (
              <Text color={theme.text.secondary}>
                {t('Enter your {{provider}} API key:', {
                  provider: selectedProvider.label,
                })}
              </Text>
            )}
            <Box marginTop={1}>
              <TextInput
                value={apiKey}
                onChange={setApiKey}
                onSubmit={handleApiKeySubmit}
                placeholder={
                  process.env[selectedProvider.envKey]
                    ? t('Leave empty to keep existing key…')
                    : t('Paste API key here...')
                }
                mask={true}
                isActive={true}
              />
            </Box>
            {apiKeyError && (
              <Box marginTop={1}>
                <Text color={theme.status.error}>{apiKeyError}</Text>
              </Box>
            )}
          </Box>
          <Box marginTop={1}>
            <Text color={theme.text.secondary}>
              {t('Enter to continue, Esc to go back')}
            </Text>
          </Box>
        </>
      )}

      {step === 'model' && selectedProvider && (
        <>
          <Text bold>
            {t('Select Model — {{provider}}', {
              provider: selectedProvider.label,
            })}
          </Text>
          <Box marginTop={1}>
            {isLoadingModels ? (
              <Text color={theme.text.secondary}>
                {t('⟳ Fetching available models…')}
              </Text>
            ) : (
              <DescriptiveRadioButtonSelect
                items={modelItems}
                onSelect={handleModelSelect}
                onHighlight={() => {}}
                showNumbers={true}
              />
            )}
          </Box>
          {errorMessage && (
            <Box marginTop={1}>
              <Text color={theme.status.error}>✕ {errorMessage}</Text>
            </Box>
          )}
          {!isLoadingModels && (
            <Box marginTop={1}>
              <Text color={theme.text.secondary}>
                {t('Enter to select, ↑↓ to navigate, Esc to go back')}
              </Text>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
