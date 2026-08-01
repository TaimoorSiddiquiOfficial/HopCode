import { type ModelDefinition } from './models';
export type LlmProviderType = 'hopcode';
export declare const HOPCODE_CODE_CONNECTION_SLUG = "hopcode";
export type LlmAuthType = 'none';
export type ModelSelectionMode = 'automaticallySyncedFromProvider' | 'userDefined3Tier';
export interface LlmConnection {
    slug: string;
    name: string;
    providerType: LlmProviderType;
    authType: LlmAuthType;
    models?: Array<ModelDefinition | string>;
    defaultModel?: string;
    modelSelectionMode?: ModelSelectionMode;
    createdAt: number;
    lastUsedAt?: number;
}
export interface LlmConnectionWithStatus extends LlmConnection {
    isAuthenticated: boolean;
    authError?: string;
    isDefault?: boolean;
}
export declare function getMiniModel(connection: Pick<LlmConnection, 'models'>): string | undefined;
export declare function getSummarizationModel(connection: Pick<LlmConnection, 'models'>): string | undefined;
export declare function generateSlug(name: string): string;
export declare function isValidSlug(slug: string): boolean;
export declare function getLlmCredentialKey(slug: string, credentialType: 'api_key' | 'oauth_token'): string;
export type LlmCredentialStorageType = null;
export declare function authTypeToCredentialStorageType(_authType: LlmAuthType): LlmCredentialStorageType;
export declare function authTypeToCredentialType(_authType: LlmAuthType): null;
export declare function authTypeRequiresEndpoint(_authType: LlmAuthType): boolean;
export declare function isLocalConnection(_conn: Pick<LlmConnection, never>): boolean;
export declare function getModelsForProviderType(_providerType: LlmProviderType): ModelDefinition[];
export declare function getDefaultModelsForConnection(_providerType: LlmProviderType): Array<ModelDefinition | string>;
export declare function getDefaultModelForConnection(_providerType: LlmProviderType): string;
export declare function resolveEffectiveConnectionSlug(sessionConnection: string | undefined, workspaceDefault: string | undefined, connections: Pick<LlmConnectionWithStatus, 'slug' | 'isDefault'>[]): string | undefined;
export declare function isSessionConnectionUnavailable(sessionConnection: string | undefined, connections: Pick<LlmConnectionWithStatus, 'slug'>[]): boolean;
export declare function authTypeIsOAuth(_authType: LlmAuthType): boolean;
export declare function isValidProviderAuthCombination(providerType: LlmProviderType, authType: LlmAuthType): boolean;
export interface ResolvedAuthEnvVars {
    envVars: Record<string, string>;
    success: boolean;
    warning?: string;
}
export declare function resolveAuthEnvVars(): Promise<ResolvedAuthEnvVars>;
