import { z } from 'zod';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
z.ZodType.prototype.meta = function (data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._meta = data;
    return this;
};
//# sourceMappingURL=zod-meta.js.map