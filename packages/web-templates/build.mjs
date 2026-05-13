import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const assetsDir = join(dirname(fileURLToPath(import.meta.url)), 'src');

await mkdir(join(assetsDir, 'generated'), { recursive: true });

const assetBuilds = [
  {
    name: 'insight',
    assetPath: join(assetsDir, 'insight'),
    buildPath: join(assetsDir, 'insight', 'build.mjs'),
  },
  {
    name: 'export-html',
    assetPath: join(assetsDir, 'export-html'),
    buildPath: join(assetsDir, 'export-html', 'build.mjs'),
  },
];

const runCommand = ({ command, args, cwd, label }) =>
  new Promise((resolve, reject) => {
    // Don't use shell on Windows when paths contain spaces — cmd.exe splits
    // unquoted arguments at spaces, breaking module resolution.  Use shell
    // only on non-Windows platforms where it's needed for PATH lookups.
    const useShell = process.platform !== 'win32';

    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: useShell,
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${label} failed for ${cwd}.`));
      }
    });
  });

const runBuild = async (asset) => {
  await runCommand({
    command: process.execPath,
    args: [asset.buildPath],
    cwd: asset.assetPath,
    label: `Node build`,
  });
};

console.log('Building web-templates...');
await Promise.all(assetBuilds.map((asset) => runBuild(asset)));
console.log('Successfully built all web-templates.');
