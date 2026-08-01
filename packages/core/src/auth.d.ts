export interface AuthInfo {
    type: 'api' | 'oauth';
    key?: string;
    access?: string;
    refresh?: string;
    expires?: number;
    accountId?: string;
}
export declare const Auth: {
    get(providerID: string): Promise<AuthInfo | undefined>;
    set(providerID: string, info: AuthInfo): Promise<void>;
    all(): Promise<Record<string, AuthInfo>>;
};
