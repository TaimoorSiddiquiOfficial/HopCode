export class Env {
  static get(key: string): string | undefined {
    return process.env[key];
  }

  static set(key: string, value: string): void {
    process.env[key] = value;
  }

  static all(): Record<string, string | undefined> {
    return process.env;
  }
}
