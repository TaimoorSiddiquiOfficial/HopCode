import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { x as extractTarball } from 'tar';

const HOPCODE_PACKAGE = '@hoptrendy/hopcode';
const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ELECTRON_DIR = join(ROOT_DIR, 'apps', 'electron');
const VENDOR_DIR = join(ELECTRON_DIR, 'vendor', 'hopcode');

type DesktopPackageJson = {
  HopCodeRuntime?: {
    version?: string;
  };
};

function commandName(command: string): string {
  if (process.platform === 'win32' && command === 'npm') return 'npm.cmd';
  return command;
}

function run(
  command: string,
  args: string[],
  cwd: string,
  options: { captureStdout?: boolean } = {},
): string {
  const result = spawnSync(commandName(command), args, {
    cwd,
    env: process.env,
    encoding: 'utf8',
    stdio: options.captureStdout ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed with exit code ${result.status}`,
    );
  }

  return typeof result.stdout === 'string' ? result.stdout.trim() : '';
}

function readDefaultVersion(): string | undefined {
  const packageJson = JSON.parse(
    readFileSync(join(ROOT_DIR, 'package.json'), 'utf8'),
  ) as DesktopPackageJson;
  return packageJson.HopCodeRuntime?.version?.trim() || undefined;
}

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function isHopCodeSourceRoot(path: string): boolean {
  return (
    existsSync(join(path, 'package.json')) &&
    existsSync(join(path, 'packages', 'cli', 'package.json'))
  );
}

function localMonorepoRoot(): string | undefined {
  const candidate = resolve(ROOT_DIR, '..', '..');
  return isHopCodeSourceRoot(candidate) ? candidate : undefined;
}

function cleanVendorDir(): void {
  rmSync(VENDOR_DIR, { recursive: true, force: true });
  mkdirSync(VENDOR_DIR, { recursive: true });
}

function copyPackageContents(sourceDir: string): void {
  cleanVendorDir();
  cpSync(sourceDir, VENDOR_DIR, { recursive: true, force: true });
}

async function extractPackageTarball(tarballPath: string): Promise<void> {
  const tempDir = mkdtempSync(join(tmpdir(), 'hopcode-vendor-'));
  await extractTarball({ file: tarballPath, cwd: tempDir });

  const packageDir = join(tempDir, 'package');
  if (!existsSync(packageDir)) {
    throw new Error(
      `Tarball did not contain an npm package directory: ${tarballPath}`,
    );
  }

  copyPackageContents(packageDir);
  rmSync(tempDir, { recursive: true, force: true });
}

async function vendorFromNpm(version: string): Promise<void> {
  const tempDir = mkdtempSync(join(tmpdir(), 'hopcode-pack-'));
  const spec = `${HOPCODE_PACKAGE}@${version}`;
  console.log(`Packing ${spec}...`);

  const output = run(
    'npm',
    ['pack', spec, '--pack-destination', tempDir, '--silent'],
    ROOT_DIR,
    { captureStdout: true },
  );
  const tarballName = output.split(/\r?\n/).filter(Boolean).pop();
  if (!tarballName)
    throw new Error(`npm pack did not return a tarball for ${spec}`);

  await extractPackageTarball(join(tempDir, basename(tarballName)));
  rmSync(tempDir, { recursive: true, force: true });
}

function prepareSourcePackage(sourceRoot: string): string {
  if (!isHopCodeSourceRoot(sourceRoot)) {
    throw new Error(`Not a HopCode source checkout: ${sourceRoot}`);
  }

  console.log(`Building HopCode runtime from ${sourceRoot}...`);
  run('npm', ['run', 'build'], sourceRoot);
  run('npm', ['run', 'bundle'], sourceRoot);
  run('npm', ['run', 'prepare:package'], sourceRoot);

  const distDir = join(sourceRoot, 'dist');
  if (!existsSync(join(distDir, 'cli.js'))) {
    throw new Error(
      `Prepared HopCode runtime is missing ${join(distDir, 'cli.js')}`,
    );
  }

  return distDir;
}

async function installRuntimeDependencies(): Promise<void> {
  if (!existsSync(join(VENDOR_DIR, 'package.json'))) return;

  console.log('Installing vendored HopCode runtime dependencies...');
  run('npm', ['install', '--omit=dev', '--no-audit', '--no-fund'], VENDOR_DIR);
}

function verifyVendoredCli(): void {
  const candidates = [
    join(VENDOR_DIR, 'cli.js'),
    join(VENDOR_DIR, 'dist', 'cli.js'),
    join(VENDOR_DIR, 'packages', 'cli', 'dist', 'index.js'),
  ];

  const cliPath = candidates.find((candidate) => existsSync(candidate));
  if (!cliPath) {
    throw new Error(
      `Vendored HopCode CLI not found. Checked: ${candidates.join(', ')}`,
    );
  }

  console.log(`Vendored HopCode CLI: ${cliPath}`);
}

async function main(): Promise<void> {
  const tarball = process.env.HOPCODE_CODE_TARBALL?.trim();
  const version = process.env.HOPCODE_CODE_VERSION?.trim();
  const sourceRoot = (
    process.env.HOPCODE_CODE_ROOT || process.env.HOPCODE_CODE_PATH
  )?.trim();

  if (tarball) {
    console.log(`Vendoring HopCode runtime from tarball: ${tarball}`);
    await extractPackageTarball(resolve(tarball));
  } else if (version) {
    await vendorFromNpm(version);
  } else if (sourceRoot && isDirectory(resolve(sourceRoot))) {
    copyPackageContents(prepareSourcePackage(resolve(sourceRoot)));
  } else {
    const monorepoRoot = localMonorepoRoot();
    if (monorepoRoot) {
      copyPackageContents(prepareSourcePackage(monorepoRoot));
    } else {
      const defaultVersion = readDefaultVersion();
      if (!defaultVersion) {
        throw new Error(
          'No HopCode runtime configured. Set HOPCODE_CODE_TARBALL, HOPCODE_CODE_VERSION, HOPCODE_CODE_ROOT, or HopCodeRuntime.version.',
        );
      }
      await vendorFromNpm(defaultVersion);
    }
  }

  await installRuntimeDependencies();
  verifyVendoredCli();
}

await main();
