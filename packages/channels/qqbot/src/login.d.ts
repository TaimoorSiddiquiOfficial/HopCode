/**
 * QQ Bot QR-code login flow.
 *
 * Delegates to @tencent-connect/qqbot-connector for the actual QR-code
 * handshake, then returns the obtained credentials.
 */
export interface QQCredentials {
    appId: string;
    appSecret: string;
}
/**
 * Launch QR-code login and wait for the user to scan with QQ.
 * Returns the obtained appId and appSecret.
 */
export declare function qrCodeLogin(): Promise<QQCredentials>;
