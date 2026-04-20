import crypto from 'crypto';

export const BunShim = {
  hash: {
    xxHash32: (data: string) =>
      crypto.createHash('md5').update(data).digest('hex').substring(0, 8),
  },
};

// @ts-expect-error — polyfill Bun global for Node.js environments
globalThis.Bun = globalThis.Bun || BunShim;
