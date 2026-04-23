/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Box, Text } from 'ink';
import {
  AuthType,
  ModelSlashCommandEvent,
  logModelSlashCommand,
  MAINLINE_CODER_MODEL,
  type AvailableModel as CoreAvailableModel,
  type ContentGeneratorConfig,
  type InputModalities,
  type ModelProvidersConfig,
  type ProviderModelConfig,
} from '@hoptrendy/hopcode-core';
import { useKeypress } from '../hooks/useKeypress.js';
import { theme } from '../semantic-colors.js';
import { DescriptiveRadioButtonSelect } from './shared/DescriptiveRadioButtonSelect.js';
import { ConfigContext } from '../contexts/ConfigContext.js';
import { UIStateContext, type UIState } from '../contexts/UIStateContext.js';
import { useSettings } from '../contexts/SettingsContext.js';
import { getPersistScopeForModelSelection } from '../../config/modelProvidersScope.js';
import { t } from '../../i18n/index.js';
import {
  PROVIDER_REGISTRY,
  type ProviderConfig,
} from '../../commands/auth/registry.js';
import {
  getCatalog,
  type ModelCategory,
} from '../../commands/model/catalog.js';
import {
  fetchOpenAICompatibleModels,
  fetchOpenRouterModels,
} from '../../commands/model/discovery.js';
import { fetchOllamaModels } from '../../commands/model/ollama.js';

function formatModalities(modalities?: InputModalities): string {
  if (!modalities) return t('text-only');
  const parts: string[] = [];
  if (modalities.image) parts.push(t('image'));
  if (modalities.pdf) parts.push(t('pdf'));
  if (modalities.audio) parts.push(t('audio'));
  if (modalities.video) parts.push(t('video'));
  if (parts.length === 0) return t('text-only');
  return `${t('text')} · ${parts.join(' · ')}`;
}

interface ModelDialogProps {
  onClose: () => void;
  isFastModelMode?: boolean;
}

function maskApiKey(apiKey: string | undefined): string {
  if (!apiKey) return `(${t('not set')})`;
  const trimmed = apiKey.trim();
  if (trimmed.length === 0) return `(${t('not set')})`;
  if (trimmed.length <= 6) return '***';
  const head = trimmed.slice(0, 3);
  const tail = trimmed.slice(-4);
  return `${head}…${tail}`;
}

function persistModelSelection(
  settings: ReturnType<typeof useSettings>,
  modelId: string,
): void {
  const scope = getPersistScopeForModelSelection(settings);
  settings.setValue(scope, 'model.name', modelId);
}

function persistAuthTypeSelection(
  settings: ReturnType<typeof useSettings>,
  authType: AuthType,
): void {
  const scope = getPersistScopeForModelSelection(settings);
  settings.setValue(scope, 'security.auth.selectedType', authType);
}

/**
 * Ensure a model from the live/catalog list is registered in modelRegistry
 * before calling config.switchModel(). Without this, catalog extras and
 * live-fetched models that are not yet in settings.modelProviders would throw
 * "Model not found for authType 'openai'".
 *
 * Mirrors the persistence logic in ProviderDialog.persistProviderConfig.
 */
function registerModelForActiveProvider(
  settings: ReturnType<typeof useSettings>,
  provider: ProviderConfig,
  modelId: string,
  config:
    | {
        reloadModelProvidersConfig?: (
          cfg: ModelProvidersConfig | undefined,
        ) => void;
      }
    | null
    | undefined,
): void {
  const scope = getPersistScopeForModelSelection(settings);

  const newModelConfig: ProviderModelConfig = {
    id: modelId,
    name: `[${provider.label}] ${modelId}`,
    envKey: provider.envKey || undefined,
    ...(provider.baseUrl ? { baseUrl: provider.baseUrl } : {}),
  };

  // Only openai-compat providers use modelProviders.openai
  if (provider.authType !== AuthType.USE_OPENAI) return;

  const existingConfigs =
    ((settings.merged?.modelProviders as Record<
      string,
      ProviderModelConfig[]
    >) ?? {})[AuthType.USE_OPENAI] ?? [];

  // Keep entries for other providers; replace the entry for this provider
  const filteredConfigs = existingConfigs.filter(
    (c) => !(c.envKey === provider.envKey && c.baseUrl === provider.baseUrl),
  );

  settings.setValue(scope, `modelProviders.${AuthType.USE_OPENAI}`, [
    newModelConfig,
    ...filteredConfigs,
  ]);

  config?.reloadModelProvidersConfig?.(
    settings.merged?.modelProviders as ModelProvidersConfig | undefined,
  );
}

interface HandleModelSwitchSuccessParams {
  settings: ReturnType<typeof useSettings>;
  uiState: UIState | null;
  after: ContentGeneratorConfig | undefined;
  effectiveAuthType: AuthType | undefined;
  effectiveModelId: string;
  isRuntime: boolean;
}

function handleModelSwitchSuccess({
  settings,
  uiState,
  after,
  effectiveAuthType,
  effectiveModelId,
  isRuntime,
}: HandleModelSwitchSuccessParams): void {
  persistModelSelection(settings, effectiveModelId);
  if (effectiveAuthType) {
    persistAuthTypeSelection(settings, effectiveAuthType);
  }

  const baseUrl = after?.baseUrl ?? t('(default)');
  const maskedKey = maskApiKey(after?.apiKey);
  uiState?.historyManager.addItem(
    {
      type: 'info',
      text:
        `authType: ${effectiveAuthType ?? `(${t('none')})`}` +
        `\n` +
        `Using ${isRuntime ? 'runtime ' : ''}model: ${effectiveModelId}` +
        `\n` +
        `Base URL: ${baseUrl}` +
        `\n` +
        `API key: ${maskedKey}`,
    },
    Date.now(),
  );
}

function formatContextWindow(size?: number): string {
  if (!size) return `(${t('unknown')})`;
  return `${size.toLocaleString('en-US')} tokens`;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}): React.JSX.Element {
  return (
    <Box>
      <Box minWidth={16} flexShrink={0}>
        <Text color={theme.text.secondary}>{label}:</Text>
      </Box>
      <Box flexGrow={1} flexDirection="row" flexWrap="wrap">
        <Text>{value}</Text>
      </Box>
    </Box>
  );
}

export function ModelDialog({
  onClose,
  isFastModelMode,
}: ModelDialogProps): React.JSX.Element {
  const config = useContext(ConfigContext);
  const uiState = useContext(UIStateContext);
  const settings = useSettings();

  // Local error state for displaying errors within the dialog
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);

  const authType = config?.getAuthType();

  // Detect which registry provider is currently active
  const activeProviderEntry = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merged = settings?.merged as any;
    if (!merged) return null;

    const selectedType = merged?.security?.auth?.selectedType as
      | string
      | undefined;
    let activeProviderId: string | undefined;

    if (selectedType === AuthType.USE_ANTHROPIC) {
      activeProviderId = 'anthropic';
    } else if (selectedType === AuthType.USE_GEMINI) {
      activeProviderId = 'gemini';
    } else if (selectedType === AuthType.USE_OPENAI) {
      const openaiCfg = merged?.modelProviders?.openai?.[0] as
        | { envKey?: string; baseUrl?: string }
        | undefined;
      if (openaiCfg) {
        const match = PROVIDER_REGISTRY.find(
          (p) =>
            p.envKey === openaiCfg.envKey && p.baseUrl === openaiCfg.baseUrl,
        );
        activeProviderId = match?.id;
      }
    }

    if (!activeProviderId) return null;
    return PROVIDER_REGISTRY.find((p) => p.id === activeProviderId) ?? null;
  }, [settings]);

  // All providers that have an API key configured (or don't need one)
  const configuredProviders = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merged = settings?.merged as any;
    return PROVIDER_REGISTRY.filter((provider) => {
      if (!provider.requiresApiKey) return true;
      const envKey = provider.envKey;
      if (!envKey) return false;
      const key =
        process.env[envKey] ||
        (merged?.env as Record<string, string> | undefined)?.[envKey];
      return !!key?.trim();
    });
  }, [settings]);

  // State for live model discovery — map from providerId → categories
  const [liveModelCategoriesMap, setLiveModelCategoriesMap] = useState<
    Map<string, ModelCategory[]>
  >(new Map());
  const [isLoadingLiveModels, setIsLoadingLiveModels] = useState(false);

  // Fetch live models for ALL configured providers that support live discovery
  useEffect(() => {
    const liveProviders = configuredProviders.filter((p) => p.liveModels);
    if (liveProviders.length === 0) {
      setLiveModelCategoriesMap(new Map());
      setIsLoadingLiveModels(false);
      return;
    }

    let cancelled = false;
    setIsLoadingLiveModels(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merged = settings?.merged as any;

    async function fetchAllLive(): Promise<void> {
      const results = new Map<string, ModelCategory[]>();

      await Promise.allSettled(
        liveProviders.map(async (provider) => {
          const storedApiKey = provider.envKey
            ? process.env[provider.envKey] ||
              (merged?.env as Record<string, string> | undefined)?.[
                provider.envKey
              ]
            : undefined;

          let cats: ModelCategory[] | null = null;
          if (provider.id === 'openrouter') {
            cats = await fetchOpenRouterModels(storedApiKey);
          } else if (provider.id.startsWith('ollama')) {
            cats = provider.baseUrl
              ? await fetchOllamaModels(provider.baseUrl, storedApiKey)
              : null;
          } else if (provider.baseUrl) {
            cats = await fetchOpenAICompatibleModels(
              provider.baseUrl,
              storedApiKey,
            );
          }

          if (cats) results.set(provider.id, cats);
        }),
      );

      if (!cancelled) {
        setLiveModelCategoriesMap(results);
        setIsLoadingLiveModels(false);
      }
    }

    fetchAllLive().catch(() => {
      if (!cancelled) {
        setLiveModelCategoriesMap(new Map());
        setIsLoadingLiveModels(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [configuredProviders, settings]);

  const availableModelEntries = useMemo(() => {
    const allCoreModels = config ? config.getAllConfiguredModels() : [];

    // Exclude discontinued qwen-oauth registry models — they can't be selected
    // and confuse users. Runtime qwen-oauth snapshots (from cached tokens) are
    // still allowed so existing sessions keep working.
    const runtimeModels = allCoreModels.filter((m) => m.isRuntimeModel);
    const registryModels = allCoreModels.filter(
      (m) => !m.isRuntimeModel && m.authType !== AuthType.HOPCODE_OAUTH,
    );

    // For each USE_OPENAI registry model, resolve its ProviderConfig via baseUrl
    const coreModelProviderMap = new Map<string, ProviderConfig | null>();
    for (const m of registryModels) {
      if (m.authType === AuthType.USE_OPENAI) {
        const entry =
          PROVIDER_REGISTRY.find(
            (p) =>
              p.authType === AuthType.USE_OPENAI && p.baseUrl === m.baseUrl,
          ) ?? null;
        coreModelProviderMap.set(`${m.id}::${m.baseUrl ?? ''}`, entry);
      }
    }

    // Catalog/live extras from ALL configured providers (deduplicated)
    type CatalogEntry = { model: CoreAvailableModel; provider: ProviderConfig };
    const catalogEntries: CatalogEntry[] = [];
    const existingKeys = new Set(
      registryModels.map((m) => `${m.authType}::${m.id}::${m.baseUrl ?? ''}`),
    );

    for (const provider of configuredProviders) {
      const categories =
        provider.liveModels && liveModelCategoriesMap.has(provider.id)
          ? liveModelCategoriesMap.get(provider.id)!
          : (getCatalog(provider.id)?.categories ?? null);

      if (!categories) continue;

      for (const cat of categories) {
        for (const m of cat.models) {
          const key = `${provider.authType}::${m.id}::${provider.baseUrl ?? ''}`;
          if (existingKeys.has(key)) continue;
          existingKeys.add(key);
          catalogEntries.push({
            model: {
              id: m.id,
              label: m.label,
              description:
                cat.name + (m.description ? ` · ${m.description}` : ''),
              authType: provider.authType,
              isRuntimeModel: false,
              baseUrl: provider.baseUrl,
              envKey: provider.envKey,
              capabilities: {
                image: false,
                pdf: false,
                audio: false,
                video: false,
              } as InputModalities,
            } as CoreAvailableModel,
            provider,
          });
        }
      }
    }

    const result: Array<{
      authType: AuthType;
      model: CoreAvailableModel;
      isRuntime?: boolean;
      snapshotId?: string;
      /** Human-readable provider name for the badge, e.g. "Ollama Cloud" */
      providerLabel?: string;
      /** The ProviderConfig this model belongs to (null for non-USE_OPENAI) */
      providerEntry?: ProviderConfig | null;
    }> = [];

    // Add all runtime models first
    for (const runtimeModel of runtimeModels) {
      result.push({
        authType: runtimeModel.authType,
        model: runtimeModel,
        isRuntime: true,
        snapshotId: runtimeModel.runtimeSnapshotId,
      });
    }

    // Add registry models (already persisted in settings)
    for (const m of registryModels) {
      const providerEntry =
        m.authType === AuthType.USE_OPENAI
          ? (coreModelProviderMap.get(`${m.id}::${m.baseUrl ?? ''}`) ??
            activeProviderEntry)
          : null;
      result.push({
        authType: m.authType,
        model: m,
        isRuntime: false,
        providerLabel:
          m.authType === AuthType.USE_OPENAI
            ? (providerEntry?.label ?? activeProviderEntry?.label)
            : undefined,
        providerEntry,
      });
    }

    // Add catalog/live extras grouped by provider (active provider first)
    const sorted = [...catalogEntries].sort((a, b) => {
      const aIsActive = a.provider.id === activeProviderEntry?.id ? 0 : 1;
      const bIsActive = b.provider.id === activeProviderEntry?.id ? 0 : 1;
      return aIsActive - bIsActive;
    });
    for (const { model, provider } of sorted) {
      result.push({
        authType: model.authType,
        model,
        isRuntime: false,
        providerLabel:
          model.authType === AuthType.USE_OPENAI ? provider.label : undefined,
        providerEntry: provider,
      });
    }

    return result;
  }, [
    config,
    activeProviderEntry,
    configuredProviders,
    liveModelCategoriesMap,
  ]);

  const MODEL_OPTIONS = useMemo(
    () =>
      availableModelEntries.map(
        ({ authType: t2, model, isRuntime, snapshotId, providerLabel }) => {
          // Runtime models use snapshotId directly (format: $runtime|${authType}|${modelId})
          const value =
            isRuntime && snapshotId ? snapshotId : `${t2}::${model.id}`;

          const isQwenOAuth = t2 === AuthType.HOPCODE_OAUTH;
          // Show real provider label (e.g. "Ollama Cloud") when available,
          // otherwise fall back to the raw authType string.
          const badgeLabel = providerLabel ?? t2;

          const title = (
            <Text>
              <Text
                bold
                color={
                  isQwenOAuth
                    ? theme.status.warning
                    : isRuntime
                      ? theme.status.warning
                      : theme.text.accent
                }
              >
                [{badgeLabel}]
              </Text>
              <Text>{` ${
                // Strip the "[ProviderName] " prefix that persistProviderConfig
                // embeds in the stored model name — the badge already shows it.
                model.label.startsWith(`[${badgeLabel}] `)
                  ? model.label.slice(`[${badgeLabel}] `.length)
                  : model.label
              }`}</Text>
              {isRuntime && (
                <Text color={theme.status.warning}> (Runtime)</Text>
              )}
              {isQwenOAuth && !isRuntime && (
                <Text color={theme.status.warning}> ({t('Discontinued')})</Text>
              )}
            </Text>
          );

          // Include runtime / discontinued indicator in description
          let description = model.description || '';
          if (isRuntime) {
            description = description
              ? `${description} (Runtime)`
              : 'Runtime model';
          }
          if (isQwenOAuth && !isRuntime) {
            description = t('Discontinued — switch to Coding Plan or API Key');
          }

          return {
            value,
            title,
            description,
            key: value,
          };
        },
      ),
    [availableModelEntries],
  );

  // In fast model mode, default to the currently configured fast model
  const fastModelSetting = settings?.merged?.fastModel as string | undefined;
  const preferredModelId =
    isFastModelMode && fastModelSetting
      ? fastModelSetting
      : config?.getModel() || MAINLINE_CODER_MODEL;
  // Check if current model is a runtime model
  // Runtime snapshot ID is already in $runtime|${authType}|${modelId} format
  const activeRuntimeSnapshot = isFastModelMode
    ? undefined // fast model is never a runtime model
    : config?.getActiveRuntimeModelSnapshot?.();
  const preferredKey = activeRuntimeSnapshot
    ? activeRuntimeSnapshot.id
    : authType
      ? `${authType}::${preferredModelId}`
      : '';

  useKeypress(
    (key) => {
      if (key.name === 'escape' || (key.name === 'left' && isFastModelMode)) {
        onClose();
      }
    },
    { isActive: true },
  );

  const initialIndex = useMemo(() => {
    const index = MODEL_OPTIONS.findIndex(
      (option) => option.value === preferredKey,
    );
    return index === -1 ? 0 : index;
  }, [MODEL_OPTIONS, preferredKey]);

  const handleHighlight = useCallback((value: string) => {
    setHighlightedValue(value);
  }, []);

  const highlightedEntry = useMemo(() => {
    const key = highlightedValue ?? preferredKey;
    return availableModelEntries.find(
      ({ authType: t2, model, isRuntime, snapshotId }) => {
        const v = isRuntime && snapshotId ? snapshotId : `${t2}::${model.id}`;
        return v === key;
      },
    );
  }, [highlightedValue, preferredKey, availableModelEntries]);

  const handleSelect = useCallback(
    async (selected: string) => {
      setErrorMessage(null);

      // Fast model mode: just save the model ID and close
      if (isFastModelMode) {
        // Extract model ID from selection key (format: "authType::modelId" or "$runtime|authType|modelId")
        let modelId: string;
        if (selected.includes('::')) {
          modelId = selected.split('::').slice(1).join('::');
        } else if (selected.startsWith('$runtime|')) {
          const parts = selected.split('|');
          modelId = parts[2] ?? selected;
        } else {
          modelId = selected;
        }
        const scope = getPersistScopeForModelSelection(settings);
        settings.setValue(scope, 'fastModel', modelId);
        // Sync the runtime Config so forked agents pick up the change immediately.
        config?.setFastModel(modelId);
        uiState?.historyManager.addItem(
          {
            type: 'success',
            text: `${t('Fast Model')}: ${modelId}`,
          },
          Date.now(),
        );
        onClose();
        return;
      }

      // Block selection of discontinued qwen-oauth models
      // (only block non-runtime OAuth; runtime OAuth models from existing
      //  cached tokens are still allowed to work until the server rejects them)
      const isQwenOAuthSelection =
        selected.startsWith(`${AuthType.HOPCODE_OAUTH}::`) ||
        (selected.startsWith('$runtime|') &&
          selected.split('|')[1] === AuthType.HOPCODE_OAUTH);
      const isRuntimeOAuthSelection = selected.startsWith(
        `$runtime|${AuthType.HOPCODE_OAUTH}|`,
      );
      if (isQwenOAuthSelection && !isRuntimeOAuthSelection) {
        setErrorMessage(
          t(
            'HopCode OAuth free tier was discontinued on 2026-04-15. Please select a model from another provider or run /auth to switch.',
          ),
        );
        return;
      }

      let after: ContentGeneratorConfig | undefined;
      let effectiveAuthType: AuthType | undefined;
      let effectiveModelId = selected;
      let isRuntime = false;

      if (!config) {
        onClose();
        return;
      }

      try {
        // Determine if this is a runtime model selection
        // Runtime model format: $runtime|${authType}|${modelId}
        isRuntime = selected.startsWith('$runtime|');

        let selectedAuthType: AuthType;
        let modelId: string;

        if (isRuntime) {
          // For runtime models, extract authType from the snapshot ID
          // Format: $runtime|${authType}|${modelId}
          const parts = selected.split('|');
          if (parts.length >= 2 && parts[0] === '$runtime') {
            selectedAuthType = parts[1] as AuthType;
          } else {
            selectedAuthType = authType as AuthType;
          }
          modelId = selected; // Pass the full snapshot ID to switchModel
        } else {
          const sep = '::';
          const idx = selected.indexOf(sep);
          selectedAuthType = (
            idx >= 0 ? selected.slice(0, idx) : authType
          ) as AuthType;
          modelId = idx >= 0 ? selected.slice(idx + sep.length) : selected;
        }

        // For OpenAI-compat providers: ensure the selected model exists in the
        // modelRegistry before calling switchModel. Catalog and live-fetched models
        // that the user hasn't previously selected won't be in the registry yet,
        // causing "Model not found for authType 'openai'". Persisting the entry
        // here (mirrors ProviderDialog.persistProviderConfig) and reloading the
        // registry fixes that without requiring a full provider re-auth flow.
        if (!isRuntime && selectedAuthType === AuthType.USE_OPENAI) {
          // Use the provider that owns this specific model (not necessarily the active one)
          const modelEntry = availableModelEntries.find(
            ({ authType: t2, model, isRuntime: ir, snapshotId }) => {
              const v = ir && snapshotId ? snapshotId : `${t2}::${model.id}`;
              return v === selected;
            },
          );
          const modelProviderEntry =
            modelEntry?.providerEntry ?? activeProviderEntry;
          if (modelProviderEntry) {
            registerModelForActiveProvider(
              settings,
              modelProviderEntry,
              modelId,
              config,
            );
          }
        }

        await config.switchModel(
          selectedAuthType,
          modelId,
          selectedAuthType !== authType &&
            selectedAuthType === AuthType.HOPCODE_OAUTH
            ? { requireCachedCredentials: true }
            : undefined,
        );

        if (!isRuntime) {
          const event = new ModelSlashCommandEvent(modelId);
          logModelSlashCommand(config, event);
        }

        after = config.getContentGeneratorConfig?.() as
          | ContentGeneratorConfig
          | undefined;
        effectiveAuthType = after?.authType ?? selectedAuthType ?? authType;
        effectiveModelId = after?.model ?? modelId;
      } catch (e) {
        const baseErrorMessage = e instanceof Error ? e.message : String(e);
        const errorPrefix = isRuntime
          ? 'Failed to switch to runtime model.'
          : `Failed to switch model to '${effectiveModelId ?? selected}'.`;
        setErrorMessage(`${errorPrefix}\n\n${baseErrorMessage}`);
        return;
      }

      handleModelSwitchSuccess({
        settings,
        uiState,
        after,
        effectiveAuthType,
        effectiveModelId,
        isRuntime,
      });
      onClose();
    },
    [
      authType,
      config,
      onClose,
      settings,
      uiState,
      setErrorMessage,
      isFastModelMode,
      activeProviderEntry,
      availableModelEntries,
    ],
  );

  const hasModels = MODEL_OPTIONS.length > 0;

  return (
    <Box
      borderStyle="round"
      borderColor={theme.border.default}
      flexDirection="column"
      padding={1}
      width="100%"
    >
      <Text bold>{t('Select Model')}</Text>

      {isLoadingLiveModels && !hasModels ? (
        <Box marginTop={1}>
          <Text color={theme.text.secondary}>
            {t('⟳ Fetching available models…')}
          </Text>
        </Box>
      ) : !hasModels ? (
        <Box marginTop={1} flexDirection="column">
          <Text color={theme.status.warning}>
            {t(
              'No models available for the current authentication type ({{authType}}).',
              {
                authType: authType ? String(authType) : t('(none)'),
              },
            )}
          </Text>
          <Box marginTop={1}>
            <Text color={theme.text.secondary}>
              {t(
                'Please configure models in settings.modelProviders or use environment variables.',
              )}
            </Text>
          </Box>
        </Box>
      ) : (
        <Box marginTop={1} flexDirection="column">
          <DescriptiveRadioButtonSelect
            items={MODEL_OPTIONS}
            onSelect={handleSelect}
            onHighlight={handleHighlight}
            initialIndex={initialIndex}
            showNumbers={true}
          />
          {isLoadingLiveModels && (
            <Box marginTop={1}>
              <Text color={theme.text.secondary}>
                {t('⟳ Fetching available models…')}
              </Text>
            </Box>
          )}
        </Box>
      )}

      {highlightedEntry && (
        <Box marginTop={1} flexDirection="column">
          <Box
            borderStyle="single"
            borderTop
            borderBottom={false}
            borderLeft={false}
            borderRight={false}
            borderColor={theme.border.default}
          />
          {highlightedEntry.authType === AuthType.HOPCODE_OAUTH &&
            !highlightedEntry.isRuntime && (
              <Box marginTop={1}>
                <Text color={theme.status.warning}>
                  ⚠ {t('Discontinued — switch to Coding Plan or API Key')}
                </Text>
              </Box>
            )}
          <DetailRow
            label={t('Modality')}
            value={formatModalities(highlightedEntry.model.modalities)}
          />
          <DetailRow
            label={t('Context Window')}
            value={formatContextWindow(
              highlightedEntry.model.contextWindowSize,
            )}
          />
          {highlightedEntry.authType !== AuthType.HOPCODE_OAUTH && (
            <>
              <DetailRow
                label="Base URL"
                value={highlightedEntry.model.baseUrl ?? t('(default)')}
              />
              <DetailRow
                label="API Key"
                value={highlightedEntry.model.envKey ?? t('(not set)')}
              />
            </>
          )}
        </Box>
      )}

      {errorMessage && (
        <Box marginTop={1} flexDirection="column" paddingX={1}>
          <Text color={theme.status.error} wrap="wrap">
            ✕ {errorMessage}
          </Text>
        </Box>
      )}

      <Box marginTop={1} flexDirection="column">
        <Text color={theme.text.secondary}>
          {t('Enter to select, ↑↓ to navigate, Esc to close')}
        </Text>
      </Box>
    </Box>
  );
}
