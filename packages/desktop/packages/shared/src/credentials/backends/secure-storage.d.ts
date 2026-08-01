/**
 * Secure Storage Backend
 *
 * Stores credentials in an encrypted file at ~/.craft-agent/credentials.enc
 * Uses AES-256-GCM for authenticated encryption.
 *
 * Encryption key is derived from OS-native hardware UUID using PBKDF2:
 * - macOS: IOPlatformUUID (tied to logic board, never changes)
 * - Windows: MachineGuid from registry (set at OS install)
 * - Linux: /var/lib/dbus/machine-id (set at OS install)
 *
 * This is more stable than the previous hostname-based derivation, which could
 * change with network/DHCP. Legacy credentials are auto-migrated on first load.
 *
 * File format:
 *   [Header - 64 bytes]
 *   ├── Magic: "CRAFT01\0" (8 bytes)
 *   ├── Flags: uint32 LE (4 bytes) - reserved for future use
 *   ├── Salt: 32 bytes (PBKDF2 salt)
 *   ├── Reserved: 20 bytes
 *   [Encrypted Payload]
 *   ├── IV: 12 bytes (random per write)
 *   ├── Auth Tag: 16 bytes (GCM authentication)
 *   └── Ciphertext: variable (encrypted JSON)
 */
import type { CredentialBackend } from './types.ts';
import type { CredentialId, StoredCredential } from '../types.ts';
export declare class SecureStorageBackend implements CredentialBackend {
    readonly name = "secure-storage";
    readonly priority = 100;
    private cachedStore;
    private encryptionKey;
    private salt;
    isAvailable(): Promise<boolean>;
    get(id: CredentialId): Promise<StoredCredential | null>;
    set(id: CredentialId, credential: StoredCredential): Promise<void>;
    delete(id: CredentialId): Promise<boolean>;
    list(filter?: Partial<CredentialId>): Promise<CredentialId[]>;
    private loadStore;
    /**
     * Attempt to decrypt data with given key.
     * Returns parsed store on success, null on failure.
     */
    private tryDecrypt;
    private saveStore;
    private getEncryptionKey;
    /**
     * Legacy key derivation for migration from v1 (included hostname).
     * Used to decrypt credentials from older versions before re-encrypting with stable key.
     */
    private getLegacyEncryptionKey;
    private handleCorruptedFile;
    /** Clear cached data (for testing or forced refresh) */
    clearCache(): void;
}
