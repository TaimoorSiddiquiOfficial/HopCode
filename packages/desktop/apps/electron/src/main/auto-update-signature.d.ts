export interface MacCodeSignatureStatus {
    trustedForAutoUpdate: boolean;
    appBundlePath: string;
    reason?: 'codesign-failed' | 'adhoc-signature' | 'missing-team-identifier';
    signature?: string;
    teamIdentifier?: string;
    diagnostic?: string;
}
export declare function getMacAppBundlePath(executablePath: string): string;
export declare function parseMacCodeSignatureStatus(appBundlePath: string, exitStatus: number | null, output: string): MacCodeSignatureStatus;
export declare function getCurrentMacCodeSignatureStatus(executablePath: string): MacCodeSignatureStatus;
