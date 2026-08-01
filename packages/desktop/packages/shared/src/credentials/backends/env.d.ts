/**
 * Environment Variable Backend (DISABLED)
 *
 * This backend is currently disabled to force manual API key entry.
 * Kept as a placeholder for potential future use.
 */
import type { CredentialBackend } from './types.ts';
import type { CredentialId, StoredCredential } from '../types.ts';
export declare class EnvironmentBackend implements CredentialBackend {
    readonly name = "environment";
    readonly priority = 110;
    isAvailable(): Promise<boolean>;
    get(_id: CredentialId): Promise<StoredCredential | null>;
    set(_id: CredentialId, _credential: StoredCredential): Promise<void>;
    delete(_id: CredentialId): Promise<boolean>;
    list(_filter?: Partial<CredentialId>): Promise<CredentialId[]>;
}
