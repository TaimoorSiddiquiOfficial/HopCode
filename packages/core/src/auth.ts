export interface AuthInfo {
  type: 'api' | 'oauth';
  key?: string;
  access?: string;
  refresh?: string;
  expires?: number;
  accountId?: string;
}

const credentials: Record<string, AuthInfo> = {};

export const Auth = {
  async get(providerID: string): Promise<AuthInfo | undefined> {
    return credentials[providerID];
  },
  async set(providerID: string, info: AuthInfo): Promise<void> {
    credentials[providerID] = info;
  },
  async all(): Promise<Record<string, AuthInfo>> {
    return credentials;
  },
};
