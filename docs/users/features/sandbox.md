# Sandbox

This document explains how to run HopCode inside a sandbox to reduce risk when tools execute shell commands or modify files.

## Prerequisites

Before using sandboxing, you need to install and set up HopCode:

```bash
npm install -g @hoptrendy/hopcode-cli
```

To verify the installation

```bash
hopcode --version
```

## Overview of sandboxing

Sandboxing isolates potentially dangerous operations (such as shell commands or file modifications) from your host system, providing a security barrier between the CLI and your environment.

The benefits of sandboxing include:

- **Security**: Prevent accidental system damage or data loss.
- **Isolation**: Limit file system access to project directory.
- **Consistency**: Ensure reproducible environments across different systems.
- **Safety**: Reduce risk when working with untrusted code or experimental commands.

> [!note]
>
> **Naming note:** Some sandbox-related environment variables may have used the `GEMINI_*` prefix historically. All new environment variables use the `QWEN_*` prefix.

## Sandboxing methods

Your ideal method of sandboxing may differ depending on your platform and your preferred container solution.

### 1. macOS Seatbelt (macOS only)

Lightweight, built-in sandboxing using `sandbox-exec`.

**Default profile**: `permissive-open` - restricts writes outside the project directory, but allows most other operations and outbound network access.

**Best for**: Fast, no Docker required, strong guardrails for file writes.

### 2. Container-based (Docker/Podman)

Cross-platform sandboxing with complete process isolation.

By default, HopCode uses a published sandbox image (configured in the CLI package) and will pull it as needed.

The container sandbox mounts your workspace and your `~/.hopcode` directory into the container so auth and settings persist between runs.

**Best for**: Strong isolation on any OS, consistent tooling inside a known image.

### Choosing a method

- **On macOS**:
  - Use Seatbelt when you want lightweight sandboxing (recommended for most users).
  - Use Docker/Podman when you need a full Linux userland (e.g., tools that require Linux binaries).
- **On Linux/Windows**:
  - Use Docker or Podman.

## Quickstart

```bash
# Enable sandboxing with command flag
hopcode -s -p "analyze the code structure"

# Or enable sandboxing for your shell session (recommended for CI / scripts)
export HOPCODE_SANDBOX=true   # true auto-picks a provider (see notes below)
hopcode -p "run the test suite"

# Configure in settings.json
{
  "tools": {
    "sandbox": true
  }
}
```

> [!tip]
>
> **Provider selection notes:**
>
> - On **macOS**, `HOPCODE_SANDBOX=true` typically selects `sandbox-exec` (Seatbelt) if available.
> - On **Linux/Windows**, `HOPCODE_SANDBOX=true` requires `docker` or `podman` to be installed.
> - To force a provider, set `HOPCODE_SANDBOX=docker|podman|sandbox-exec`.

## Configuration

### Enable sandboxing (in order of precedence)

1. **Environment variable**: `HOPCODE_SANDBOX=true|false|docker|podman|sandbox-exec`
2. **Command flag / argument**: `-s`, `--sandbox`, or `--sandbox=<provider>`
3. **Settings file**: `tools.sandbox` in your `settings.json` (e.g., `{"tools": {"sandbox": true}}`).

> [!important]
>
> If `HOPCODE_SANDBOX` is set, it **overrides** the CLI flag and `settings.json`.

### Configure the sandbox image (Docker/Podman)

- **CLI flag**: `--sandbox-image <image>`
- **Environment variable**: `HOPCODE_SANDBOX_IMAGE=<image>`
- **Settings file**: `tools.sandboxImage` in your `settings.json` (e.g., `{"tools": {"sandboxImage": "ghcr.io/taimoorsiddiquiofficial/hopcode:0.18.9"}}`) 4. Built-in default image from the CLI package (for example `ghcr.io/taimoorsiddiquiofficial/hopcode:<version>`)

  ## Building custom sandbox images

  For a custom image, build it using the canonical image as a base:

  ```dockerfile
  FROM ghcr.io/taimoorsiddiquiofficial/hopcode:latest
  ```

Multiple flags can be provided as a space-separated string:

```bash
export SANDBOX_FLAGS="--flag1 --flag2=value"
```

### Network proxying (all sandbox methods)

If you want to restrict outbound network access to an allowlist, you can run a local proxy alongside the sandbox:

- Set `HOPCODE_SANDBOX_PROXY_COMMAND=<command>`
- The command must start a proxy server that listens on `:::8877`

This is especially useful with `*-proxied` Seatbelt profiles.

For a working allowlist-style proxy example, see: [Example Proxy Script](/developers/examples/proxy-script).

## Linux UID/GID handling

On Linux, HopCode defaults to enabling UID/GID mapping so the sandbox runs as your user (and reuses the mounted `~/.hopcode`). Override with:

```bash
export SANDBOX_SET_UID_GID=true   # Force host UID/GID
export SANDBOX_SET_UID_GID=false  # Disable UID/GID mapping
```

## Troubleshooting

### Common issues

**"Operation not permitted"**

- Operation requires access outside sandbox.
- On macOS Seatbelt: try a more permissive `SEATBELT_PROFILE`.
- On Docker/Podman: verify the workspace is mounted and your command doesn’t require access outside the project directory.

**Missing commands**

- Container sandbox: add them via `.hopcode/sandbox.Dockerfile` or `.qwen/sandbox.bashrc`.
- Seatbelt: your host binaries are used, but the sandbox may restrict access to some paths.

**Java not available in Docker sandbox**

The official HopCode Docker image is intentionally minimal to keep the image small, secure, and fast to pull. Different users require different language runtimes (Java, Python, Node.js, etc.), and bundling all environments into a single image is not practical. Therefore, Java is **not included by default** in the Docker sandbox.

If your workflow requires Java, you can extend the base image by creating a `.hopcode/sandbox.Dockerfile` in your project:

```dockerfile
FROM ghcr.io/qwenlm/hopcode:latest

RUN apt-get update && \
    apt-get install -y openjdk-17-jre && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

Then rebuild the sandbox image:

```bash
HOPCODE_SANDBOX=docker BUILD_SANDBOX=1 hopcode -s
```

For more details on customizing the sandbox, see [Customizing the sandbox environment](/developers/tools/sandbox).

**Network issues**

- Check sandbox profile allows network.
- Verify proxy configuration.

### Debug mode

```bash
DEBUG=1 hopcode -s -p "debug command"
```

**Note:** If you have `DEBUG=true` in a project's `.env` file, it won't affect the CLI due to automatic exclusion. Use `.hopcode/.env` files for HopCode-specific debug settings.

### Inspect sandbox

```bash
# Check environment
hopcode -s -p "run shell command: env | grep SANDBOX"

# List mounts
hopcode -s -p "run shell command: mount | grep workspace"
```

## Security notes

- Sandboxing reduces but doesn't eliminate all risks.
- Use the most restrictive profile that allows your work.
- Container overhead is minimal after the first pull/build.
- GUI applications may not work in sandboxes.

## Related documentation

- [Configuration](../configuration/settings): Full configuration options.
- [Commands](../features/commands): Available commands.
- [Troubleshooting](../support/troubleshooting): General troubleshooting.
