export class Env {
    static get(key) {
        return process.env[key];
    }
    static set(key, value) {
        process.env[key] = value;
    }
    static all() {
        return process.env;
    }
}
//# sourceMappingURL=env.js.map