import { promises as fs } from 'fs';
import path from 'path';
export class Filesystem {
    static async read(filepath) {
        return fs.readFile(filepath, 'utf-8');
    }
    static async write(filepath, content) {
        await fs.mkdir(path.dirname(filepath), { recursive: true });
        await fs.writeFile(filepath, content, 'utf-8');
    }
    static async readJson(filepath) {
        const content = await this.read(filepath);
        return JSON.parse(content);
    }
    static async writeJson(filepath, data) {
        await this.write(filepath, JSON.stringify(data, null, 2));
    }
}
//# sourceMappingURL=filesystem.js.map