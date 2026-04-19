/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import { useCallback, useContext, useMemo, useState } from 'react';
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

type Step = 'provider' | 'apikey' | 'model';

interface ProviderDialogProps {
  onClose: () => void;
}

function isProviderConfigured(provider: ProviderConfig): boolean {
  if (!provider.requiresApiKey) return true;
  return !!process.env[provider.envKey];
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

  // ── Step 1: Provider list ────────────────────────────────────────────────
  const providerItems = useMemo(
    () =>
      PROVIDER_REGISTRY.map((p): DescriptiveRadioSelectItem<string> => {
        const configured = isProviderConfigured(p);
        const suffix = configured ? ` · [${t('configured')}]` : '';
        return {
          key: p.id,
          title: p.label,
          description: p.description + suffix,
          value: p.id,
        };
      }),
    [],
  );

  const handleProviderSelect = useCallback((value: string) => {
    const provider = PROVIDER_REGISTRY.find((p) => p.id === value);
    if (!provider) return;
    setSelectedProvider(provider);
    setApiKey('');
    setApiKeyError(null);
    setErrorMessage(null);

    // If key needed and not set → ask for it; otherwise go straight to model
    if (provider.requiresApiKey && !process.env[provider.envKey]) {
      setStep('apikey');
    } else {
      setStep('model');
    }
  }, []);

  // ── Step 2: API key input ────────────────────────────────────────────────
  const handleApiKeySubmit = useCallback(() => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setApiKeyError(t('API key cannot be empty.'));
      return;
    }
    setApiKeyError(null);
    setStep('model');
  }, [apiKey]);

  // ── Step 3: Model selection ──────────────────────────────────────────────
  const modelItems = useMemo((): Array<DescriptiveRadioSelectItem<string>> => {
    if (!selectedProvider) return [];
    const catalog = getCatalog(selectedProvider.id);
    if (!catalog) {
      return [
        {
          key: selectedProvider.defaultModel,
          title: selectedProvider.defaultModel,
          description: t('Default model'),
          value: selectedProvider.defaultModel,
        },
      ];
    }
    return catalog.categories.flatMap((cat) =>
      cat.models.map(
        (m): DescriptiveRadioSelectItem<string> => ({
          key: m.id,
          title: m.label,
          description: `${cat.name}${m.description ? ` · ${m.description}` : ''}${m.context ? ` · ${m.context}` : ''}`,
          value: m.id,
        }),
      ),
    );
  }, [selectedProvider]);

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
        // Go back to apikey step if we showed it, else back to provider list
        if (
          selectedProvider?.requiresApiKey &&
          !process.env[selectedProvider.envKey]
        ) {
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
            <Text color={theme.text.secondary}>
              {t('Enter your {{provider}} API key:', {
                provider: selectedProvider.label,
              })}
            </Text>
            <Box marginTop={1}>
              <TextInput
                value={apiKey}
                onChange={setApiKey}
                onSubmit={handleApiKeySubmit}
                placeholder={t('Paste API key here...')}
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
            <DescriptiveRadioButtonSelect
              items={modelItems}
              onSelect={handleModelSelect}
              onHighlight={() => {}}
              showNumbers={true}
            />
          </Box>
          {errorMessage && (
            <Box marginTop={1}>
              <Text color={theme.status.error}>✕ {errorMessage}</Text>
            </Box>
          )}
          <Box marginTop={1}>
            <Text color={theme.text.secondary}>
              {t('Enter to select, ↑↓ to navigate, Esc to go back')}
            </Text>
          </Box>
        </>
      )}
    </Box>
  );
}
