/**
 * Centralized model registry.
 *
 * HopCode reports the live model list through ACP at session startup. The
 * static registry below provides a stable fallback for first-run UI, tests, and
 * utility calls before ACP metadata is available.
 */
export const DEFAULT_MODEL = 'qwen3-coder';
export const MODEL_REGISTRY = [
    {
        id: DEFAULT_MODEL,
        name: 'Qwen3 Coder',
        shortName: 'hopcode',
        description: 'Default HopCode model',
        provider: 'hopcode',
        contextWindow: 1_000_000,
    },
];
export function getModelsByProvider(provider) {
    return MODEL_REGISTRY.filter((model) => model.provider === provider);
}
export const HOPCODE_MODELS = getModelsByProvider('hopcode');
/** Compatibility export for older imports. */
export const MODELS = HOPCODE_MODELS;
export function getDefaultSummarizationModel() {
    return DEFAULT_MODEL;
}
export function getModelById(modelId) {
    return MODEL_REGISTRY.find((model) => model.id === modelId);
}
function humanizeModelId(modelId) {
    const id = modelId.includes('/') ? modelId.split('/').pop() || modelId : modelId;
    return id
        .replace(/^qwen[-_]?/i, 'Qwen ')
        .split(/[-_]/)
        .filter(Boolean)
        .map((part) => {
        if (/^hopcode/i.test(part))
            return part.replace(/^hopcode/i, 'hopcode');
        return part.charAt(0).toUpperCase() + part.slice(1);
    })
        .join(' ');
}
export function getModelDisplayName(modelId) {
    return getModelById(modelId)?.name ?? humanizeModelId(modelId);
}
export function getModelShortName(modelId) {
    return getModelById(modelId)?.shortName ?? humanizeModelId(modelId);
}
export function getModelContextWindow(modelId) {
    return getModelById(modelId)?.contextWindow;
}
export function isOpusModel(_modelId) {
    return false;
}
export function isQwenModel(modelId) {
    return modelId.toLowerCase().includes('hopcode');
}
export function getModelProvider(modelId) {
    return getModelById(modelId)?.provider ?? (isQwenModel(modelId) ? 'hopcode' : undefined);
}
//# sourceMappingURL=models.js.map