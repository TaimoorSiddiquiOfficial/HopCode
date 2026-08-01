import crypto from 'crypto';
export const BunShim = {
    hash: {
        xxHash32: (data) => crypto.createHash('md5').update(data).digest('hex').substring(0, 8),
    },
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.Bun = globalThis.Bun || BunShim;
//# sourceMappingURL=bun-shim.js.map