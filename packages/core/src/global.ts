import os from 'os';
import path from 'path';

export class Global {
  static get Path() {
    const root = path.join(os.homedir(), '.hopcode');
    return {
      state: path.join(root, 'state'),
      cache: path.join(root, 'cache'),
    };
  }
}
