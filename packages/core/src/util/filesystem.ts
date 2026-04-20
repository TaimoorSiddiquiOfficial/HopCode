import { promises as fs } from 'fs';
import path from 'path';

export class Filesystem {
  static async read(filepath: string): Promise<string> {
    return fs.readFile(filepath, 'utf-8');
  }

  static async write(filepath: string, content: string): Promise<void> {
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, content, 'utf-8');
  }

  static async readJson<T = unknown>(filepath: string): Promise<T> {
    const content = await this.read(filepath);
    return JSON.parse(content) as T;
  }

  static async writeJson(filepath: string, data: unknown): Promise<void> {
    await this.write(filepath, JSON.stringify(data, null, 2));
  }
}
