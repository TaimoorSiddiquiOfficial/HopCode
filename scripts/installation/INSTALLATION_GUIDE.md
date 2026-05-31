# Installation Guide for HopCode with Source Tracking

This guide describes the source-tracking installation scripts for HopCode.
The scripts prefer standalone release archives and can fall back to npm when a
standalone archive is not available.

## Overview

The installers are intentionally lightweight:

- They try a standalone archive first by default.
- They do not install Node.js, NVM, or any other Node version manager.
- They do not edit npm config. Standalone installs may update the shell profile
  or user PATH so the generated `qwen` shim is discoverable.
- They do not start `qwen` automatically after installation.
- They store source information in `~/.hopcode/source.json` or
  `%USERPROFILE%\.qwen\source.json` when `--source` is provided.

Standalone archives include a private Node.js runtime, so users do not need a
local Node.js installation on the standalone path. Node.js 22 or newer and npm
are only required when the installer falls back to npm or when
`--method npm` is used.

## Installation Scripts

- Linux/macOS: `install-hopcode-standalone.sh`
- Windows: `install-hopcode-standalone.ps1`
- Linux/macOS uninstall: `uninstall-hopcode-standalone.sh`
- Windows uninstall: `uninstall-hopcode-standalone.ps1`

## Release Artifacts

GitHub releases publish these standalone archives:

- `hopcode-darwin-arm64.tar.gz`
- `hopcode-darwin-x64.tar.gz`
- `hopcode-linux-arm64.tar.gz`
- `hopcode-linux-x64.tar.gz`
- `hopcode-win-x64.zip`
- `SHA256SUMS`

The new standalone-first installer scripts (`install-hopcode-standalone.sh`,
`install-hopcode-standalone.ps1`) are not republished per release. They are served
from a hosted installation endpoint and accept `--version` to pin a specific
standalone release. The `standalone` suffix intentionally avoids overwriting the
existing production `install-qwen.sh` / `install-qwen.bat` OSS objects during
the staged rollout.

Public installation documentation intentionally continues to use the existing
production installer in this PR. Update README and other public quick-install
instructions in a follow-up after the standalone-suffixed hosted installers and
release archive sync have been validated in production.

Hosted installer assets are staged separately from GitHub Release archives:

- `install-hopcode-standalone.sh` is the Linux/macOS hosted entrypoint.
- `install-hopcode-standalone.ps1` is the Windows hosted entrypoint for `irm | iex`.
- `install-hopcode-standalone.bat` is the Windows installer implementation used by
  `install-hopcode-standalone.ps1` and can also be downloaded and run directly.
- `uninstall-hopcode-standalone.sh` removes Linux/macOS standalone installs.
- `uninstall-hopcode-standalone.ps1` removes Windows standalone installs.

The global standalone-suffixed OSS entrypoints are maintained under
`installation/install-hopcode-standalone.sh`,
`installation/install-hopcode-standalone.ps1`,
`installation/install-hopcode-standalone.bat`,
`installation/uninstall-hopcode-standalone.sh`, and
`installation/uninstall-hopcode-standalone.ps1`.

Build them with:

```bash
npm run package:hosted-installation -- --out-dir dist/installation
```

The staged `install-hopcode-standalone.sh`, `install-hopcode-standalone.ps1`,
`install-hopcode-standalone.bat`, `uninstall-hopcode-standalone.sh`, and
`uninstall-hopcode-standalone.ps1` files map to the standalone-suffixed hosted URLs
shown above. The staging command also writes `SHA256SUMS` for upload
verification. During a non-dry-run stable release, the publish workflow uploads
a byte-for-byte snapshot to `installation/vX.Y.Z/` for audit and rollback, and
also refreshes the global `installation/` entrypoint objects so `curl | bash`
links keep resolving without a version segment. The versioned snapshot lets you
roll back by repointing the global objects to a previous tag if a regression is
caught after publish. The hosted
installers intentionally default to `latest`; on Aliyun OSS this means reading
`releases/hopcode/latest/VERSION` first, then downloading the matching
versioned release directory. Use `--version` or `HOPCODE_INSTALL_VERSION` to pin a
standalone release directly.

Configure the `production-release` GitHub environment with these required
secrets before enabling OSS sync:

- `ALIYUN_OSS_ACCESS_KEY_ID`
- `ALIYUN_OSS_ACCESS_KEY_SECRET`

The workflow defaults to the production OSS bucket and Hangzhou endpoint. Set
these GitHub Actions variables only when the bucket, endpoint, or public base
URL changes:

- `ALIYUN_OSS_BUCKET` (default: `hopcode-assets`)
- `ALIYUN_OSS_ENDPOINT` (default: `https://oss-cn-hangzhou.aliyuncs.com`)
- `ALIYUN_OSS_PUBLIC_BASE_URL` (default:
  `https://hopcode-assets.oss-cn-hangzhou.aliyuncs.com`)

Archive layout:

```text
hopcode/
  bin/qwen
  bin/qwen.cmd
  lib/cli.js
  node/
  package.json
  README.md
  LICENSE
  manifest.json
```

## Install Methods

The default method is `detect`:

1. Detect the current platform.
2. Try to download and install the matching standalone archive.
3. Verify the archive with `SHA256SUMS`.
4. Fall back to npm if the standalone archive is not available.

You can force a method:

```bash
bash install-hopcode-standalone.sh --method standalone
bash install-hopcode-standalone.sh --method npm
```

```bat
install-hopcode-standalone.bat --method standalone
install-hopcode-standalone.bat --method npm
```

## Optional Native Modules

The standalone archives bundle HopCode and a private Node.js runtime. They do
not currently install npm optional native modules such as `node-pty` and
`@teddyzhu/clipboard`. HopCode is designed to degrade when these optional
modules are absent, but terminal pty behavior and clipboard image support may
not be identical to an npm installation.

Use `--method npm` if you specifically need npm to resolve optional native
modules for the current machine.

## Linux/macOS Usage

```bash
# Default: standalone archive with npm fallback
bash install-hopcode-standalone.sh

# Record a source value
bash install-hopcode-standalone.sh --source github

# Use npm explicitly
bash install-hopcode-standalone.sh --method npm --registry https://registry.npmjs.org

# Use the Aliyun standalone mirror
bash install-hopcode-standalone.sh --mirror aliyun

# Install an offline archive
# SHA256SUMS must be in the same directory.
bash install-hopcode-standalone.sh --archive ./hopcode-linux-x64.tar.gz
```

Standalone installs to:

- Runtime: `~/.local/lib/hopcode`
- Shim: `~/.local/bin/qwen`

Override with `HOPCODE_INSTALL_ROOT`, `HOPCODE_INSTALL_LIB_PARENT`,
`HOPCODE_INSTALL_LIB_DIR`, or `HOPCODE_INSTALL_BIN_DIR` when needed.

Uninstall a standalone Linux/macOS install:

```bash
curl -fsSL https://hopcode-assets.oss-cn-hangzhou.aliyuncs.com/installation/uninstall-hopcode-standalone.sh | bash
```

The uninstaller removes only the standalone runtime, generated `qwen` wrapper,
and installer-managed shell PATH block. It preserves `~/.qwen` by default. Set
`HOPCODE_UNINSTALL_PURGE=1` to remove `~/.hopcode/source.json`; other config and auth
files are still preserved.

## Windows Usage

```bat
REM Default: standalone archive with npm fallback
install-hopcode-standalone.bat

REM Record a source value
install-hopcode-standalone.bat --source github

REM Use npm explicitly
install-hopcode-standalone.bat --method npm --registry https://registry.npmjs.org

REM Use the Aliyun standalone mirror
install-hopcode-standalone.bat --mirror aliyun

REM Install an offline archive
REM SHA256SUMS must be in the same directory.
install-hopcode-standalone.bat --archive hopcode-win-x64.zip
```

Standalone installs to:

- Runtime: `%LOCALAPPDATA%\hopcode\hopcode`
- Shim: `%LOCALAPPDATA%\hopcode\bin\qwen.cmd`

Override with `HOPCODE_INSTALL_ROOT`, `HOPCODE_INSTALL_LIB_DIR`, or
`HOPCODE_INSTALL_BIN_DIR` when needed.

Restart the terminal if `qwen` is not immediately available on PATH.

Uninstall a standalone Windows install:

```bat
powershell -ExecutionPolicy Bypass -c "irm https://hopcode-assets.oss-cn-hangzhou.aliyuncs.com/installation/uninstall-hopcode-standalone.ps1 | iex"
```

The uninstaller removes only the standalone runtime, generated `qwen.cmd`
wrapper, user PATH entry, and the current-session `cmd.exe` shim created by the
hosted PowerShell installer. It preserves `%USERPROFILE%\.qwen` by default. Set
`HOPCODE_UNINSTALL_PURGE=1` to remove `%USERPROFILE%\.qwen\source.json`; other
config and auth files are still preserved.

## Mirrors and Overrides

Options:

- `--method detect|standalone|npm`
- `--mirror github|aliyun`
- `--base-url URL`
- `--archive PATH`
- `--version VERSION`
- `--registry REGISTRY`
- `--source SOURCE`

Environment variables:

- `HOPCODE_INSTALL_METHOD`
- `HOPCODE_INSTALL_MIRROR`
- `HOPCODE_INSTALL_BASE_URL`
- `HOPCODE_INSTALL_ARCHIVE`
- `HOPCODE_INSTALL_VERSION`
- `HOPCODE_NPM_REGISTRY`

Use `--base-url` for private mirrors. The URL must contain
`hopcode-<target>` archives and `SHA256SUMS` in the same directory. Custom
base URLs must use `https://`.

For Aliyun OSS/CDN, release publishing uploads byte-identical artifacts to the
versioned directory, for example `releases/hopcode/vX.Y.Z/`. Stable releases
also update the small `releases/hopcode/latest/VERSION` pointer used by the
default installer path. The installer reads that pointer and then downloads the
versioned archive plus the versioned `SHA256SUMS`; nightly and preview releases
do not update the pointer.

## Supported Source Values

The source value may only contain letters, numbers, dot, underscore, and dash.
Common values are:

- `github`
- `npm`
- `internal`
- `local-build`

## Source Tracking

When `--source` or `-s` is provided, the installer writes:

```json
{
  "source": "github"
}
```

Locations:

- Linux/macOS: `~/.hopcode/source.json`
- Windows: `%USERPROFILE%\.qwen\source.json`

The telemetry logger reads this file when available. Missing, invalid, or
unreadable source files are ignored.

## Manual Installation

If source tracking is not needed and Node.js 22 or newer is already available:

```bash
npm install -g @hoptrendy/hopcode-cli@latest
```

Homebrew users can also install HopCode with:

```bash
brew install hopcode
```

## Troubleshooting

### Standalone Archive Missing

In `detect` mode, the installer falls back to npm. In `standalone` mode, install
fails so that automation can detect the missing artifact.

### Node.js Missing or Too Old

This only blocks npm installation. Install or activate Node.js 22 or newer, then
rerun the installer with `--method npm` or let `detect` fall back again.

### npm Missing

Install a Node.js distribution that includes npm, then rerun the installer.

### Permission Errors During npm Install

The installers do not rewrite npm prefix settings. If global npm installation
fails with a permission error, fix the npm global install location or use a
user-owned Node.js installation, then rerun:

```bash
npm install -g @hoptrendy/hopcode-cli@latest --registry https://registry.npmmirror.com
```

### qwen Is Not on PATH After Installation

Restart the terminal first. For standalone installs, add the shim directory:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

For npm installs, add npm's global binary directory. On Linux/macOS this is
usually:

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
```

On Windows standalone installs, add this directory to PATH:

```bat
%LOCALAPPDATA%\hopcode\bin
```
