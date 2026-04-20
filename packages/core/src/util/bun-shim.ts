import crypto from 'crypto';

export const BunShim = {
  hash: {
    xxHash32: (data: string) =>
      crypto.createHash('md5').update(data).digest('hex').substring(0, 8),
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).Bun = (globalThis as any).Bun || BunShim;
