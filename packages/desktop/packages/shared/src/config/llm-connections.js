import { DEFAULT_MODEL, HOPCODE_MODELS, } from './models';
export const HOPCODE_CODE_CONNECTION_SLUG = 'hopcode';
export function getMiniModel(connection) {
    return findSmallModel(connection);
}
export function getSummarizationModel(connection) {
    return findSmallModel(connection);
}
function findSmallModel(connection) {
    if (!connection.models || connection.models.length === 0)
        return undefined;
    const toId = (model) => typeof model === 'string' ? model : model.id;
    const match = connection.models.find((model) => toId(model).toLowerCase().includes('flash'));
    return match ? toId(match) : toId(connection.models[connection.models.length - 1]);
}
export function generateSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
export function isValidSlug(slug) {
    return /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(slug);
}
export function getLlmCredentialKey(slug, credentialType) {
    return `llm::${slug}::${credentialType}`;
}
export function authTypeToCredentialStorageType(_authType) {
    return null;
}
export function authTypeToCredentialType(_authType) {
    return null;
}
export function authTypeRequiresEndpoint(_authType) {
    return false;
}
export function isLocalConnection(_conn) {
    return false;
}
export function getModelsForProviderType(_providerType) {
    return HOPCODE_MODELS;
}
export function getDefaultModelsForConnection(_providerType) {
    return HOPCODE_MODELS;
}
export function getDefaultModelForConnection(_providerType) {
    return DEFAULT_MODEL;
}
export function resolveEffectiveConnectionSlug(sessionConnection, workspaceDefault, connections) {
    const hasConnection = (slug) => !!slug && connections.some((connection) => connection.slug === slug);
    if (hasConnection(sessionConnection))
        return sessionConnection;
    if (hasConnection(workspaceDefault))
        return workspaceDefault;
    return connections.find((connection) => connection.isDefault)?.slug ?? connections[0]?.slug;
}
export function isSessionConnectionUnavailable(sessionConnection, connections) {
    if (!sessionConnection)
        return false;
    if (connections.some((connection) => connection.slug === HOPCODE_CODE_CONNECTION_SLUG))
        return false;
    return !connections.some((connection) => connection.slug === sessionConnection);
}
export function authTypeIsOAuth(_authType) {
    return false;
}
export function isValidProviderAuthCombination(providerType, authType) {
    return providerType === 'hopcode' && authType === 'none';
}
export async function resolveAuthEnvVars() {
    return { envVars: {}, success: true };
}
//# sourceMappingURL=llm-connections.js.map