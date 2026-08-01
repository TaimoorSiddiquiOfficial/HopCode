/**
 * QQ Bot credential persistence.
 *
 * Reads and writes appId/appSecret to a JSON file under
 * `{hopcodeDir}/channels/{name}-credentials.json` with restrictive permissions.
 */
/** Build the credential file path for a given safe channel name. */
export declare function getCredsFilePath(safeName: string): string;
/** Try to load persisted credentials. Returns null if file missing or corrupt. */
export declare function loadCredentials(credsFile: string): {
    appId: string;
    appSecret: string;
} | null;
/**
 * Persist credentials to disk.
 *
 * NOTE: writeFileSync with `mode: 0o600` is not atomic — the file is created
 * with default permissions (0o644) and then chmod'd. There is a sub-millisecond
 * TOCTOU window where another local process could read the credentials.
 * Exploiting this requires local shell access and precise timing; for a
 * single-user dev machine, the risk is negligible. Using openSync(fd, 'w', 0o600)
 * would close the window but adds complexity for no practical gain.
 */
export declare function saveCredentials(credsFile: string, appId: string, appSecret: string): void;
