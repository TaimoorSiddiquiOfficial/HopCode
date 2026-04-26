/**
 * Verifies release-critical package metadata stays consistent.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const workspacesToExclude = new Set();

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function workspacePackageJsonPaths(workspacePattern) {
  const parts = workspacePattern.split('/');
  const wildcardIndex = parts.indexOf('*');

  if (wildcardIndex === -1) {
    return [path.join(rootDir, workspacePattern, 'package.json')];
  }

  const baseDir = path.join(rootDir, ...parts.slice(0, wildcardIndex));
  const tail = parts.slice(wildcardIndex + 1);
  if (!fs.existsSync(baseDir)) return [];

  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(baseDir, entry.name, ...tail, 'package.json'));
}

function formatPackage(pkg) {
  return `${pkg.name} (${path.relative(rootDir, pkg.file)})`;
}

const rootPackagePath = path.join(rootDir, 'package.json');
const rootPackage = readJson(rootPackagePath);
const packageFiles = [
  rootPackagePath,
  ...rootPackage.workspaces.flatMap(workspacePackageJsonPaths),
];

const packages = [];
let failed = false;

for (const file of packageFiles) {
  if (!fs.existsSync(file)) continue;

  try {
    const pkg = readJson(file);
    if (workspacesToExclude.has(pkg.name)) continue;

    packages.push({
      file,
      name: pkg.name,
      version: pkg.version,
      config: pkg.config,
    });

    if (!pkg.version) {
      console.error(`Missing version: ${path.relative(rootDir, file)}`);
      failed = true;
    }
  } catch (error) {
    console.error(
      `Failed to read ${path.relative(rootDir, file)}: ${error.message}`,
    );
    failed = true;
  }
}

if (packages.length === 0) {
  console.error(
    'No package manifests were checked. Release consistency verification is broken.',
  );
  process.exit(1);
}

const expectedVersion = rootPackage.version;
for (const pkg of packages) {
  if (pkg.version !== expectedVersion) {
    console.error(
      `Version mismatch: ${formatPackage(pkg)} is ${pkg.version}, expected ${expectedVersion}`,
    );
    failed = true;
  }
}

const sandboxPackages = packages.filter((pkg) => pkg.config?.sandboxImageUri);
const expectedSandboxImage = rootPackage.config?.sandboxImageUri;
if (expectedSandboxImage) {
  for (const pkg of sandboxPackages) {
    if (pkg.config.sandboxImageUri !== expectedSandboxImage) {
      console.error(
        `Sandbox image mismatch: ${formatPackage(pkg)} has ${pkg.config.sandboxImageUri}, expected ${expectedSandboxImage}`,
      );
      failed = true;
    }
  }
}

if (failed) process.exit(1);

console.log(
  `Release consistency verified for ${packages.length} package manifests at version ${expectedVersion}.`,
);
