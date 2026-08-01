/**
 * Named Error - Base class for errors with names
 * OpenCode compatibility layer for HopCode
 */
export class NamedError extends Error {
    name;
    metadata;
    constructor(message, name, metadata) {
        super(message);
        this.name = name ?? this.constructor.name;
        this.metadata = metadata;
        Object.setPrototypeOf(this, NamedError.prototype);
    }
    static create(name, schema) {
        return class extends NamedError {
            constructor(data, options) {
                super(`${name}: ${JSON.stringify(data)}`, name, data);
                if (options?.cause) {
                    Object.defineProperty(this, 'cause', { value: options.cause });
                }
            }
            static get schema() {
                return schema;
            }
        };
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            stack: this.stack,
            metadata: this.metadata,
        };
    }
}
//# sourceMappingURL=error.js.map