"""
HopCode Modal Deployment

Deploy HopCode as a serverless gRPC agent on Modal.
Each invocation spins up a fresh container with the HopCode CLI,
executes the agent loop, and streams results back.

Usage:
    modal deploy hopcode_modal.py
    modal run hopcode_modal.py --prompt "List files in current directory"

Requires:
    pip install modal
    modal token new   # authenticate with Modal
"""

import modal

# Base image with Node.js 20, Python, and common dev tools
image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("git", "curl", "jq", "ripgrep", "gh", "unzip")
    .run_commands(
        "curl -fsSL https://deb.nodesource.com/setup_20.x | bash -",
        "apt-get install -y nodejs",
    )
    # Install HopCode globally from the local package or npm
    .pip_install("@hoptrendy/hopcode")  # or .copy_local_dir("../../")
)

app = modal.App("hopcode-agent", image=image)


@app.function(
    gpu=None,           # set to "T4" or "A10G" if you need GPU for local models
    timeout=600,      # 10 minutes max per request
    memory=4096,      # 4GB RAM
)
def run_agent(prompt: str, model: str = "claude-sonnet-4-6") -> str:
    """
    Run a single HopCode agent turn in a fresh Modal container.

    Args:
        prompt: The user prompt to send to the agent.
        model:  The model ID to use (defaults to Claude Sonnet 4.6).

    Returns:
        The agent's final text response.
    """
    import subprocess
    import json
    import os

    # Set up a temporary working directory
    cwd = "/tmp/hopcode-workspace"
    os.makedirs(cwd, exist_ok=True)

    # Run HopCode in headless JSON mode
    cmd = [
        "hopcode",
        "--json",
        "--model", model,
        "--permission-mode", "yolo",
        "-p", prompt,
    ]

    result = subprocess.run(
        cmd,
        cwd=cwd,
        capture_output=True,
        text=True,
        timeout=580,
    )

    if result.returncode != 0:
        raise RuntimeError(f"HopCode failed: {result.stderr}")

    # Parse the JSON-ND output and return the final result
    lines = result.stdout.strip().split("\n")
    for line in reversed(lines):
        try:
            event = json.loads(line)
            if event.get("type") == "result" and not event.get("is_error"):
                return event.get("result", "")
        except json.JSONDecodeError:
            continue

    return result.stdout


@app.local_entrypoint()
def main(prompt: str, model: str = "claude-sonnet-4-6"):
    """Local entry point for testing."""
    print(f"Running HopCode agent with model: {model}")
    response = run_agent.remote(prompt, model)
    print("\n--- Agent Response ---\n")
    print(response)
