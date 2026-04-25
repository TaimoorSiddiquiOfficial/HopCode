# HopCode Serverless Deployment — Modal

Deploy HopCode as a serverless agent on [Modal](https://modal.com/).

## Files

| File               | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `hopcode_modal.py` | Modal app definition with `run_agent` function |

## Quick Start

1. **Install Modal CLI**

   ```bash
   pip install modal
   modal token new
   ```

2. **Deploy**

   ```bash
   cd deploy/modal
   modal deploy hopcode_modal.py
   ```

3. **Run remotely**
   ```bash
   modal run hopcode_modal.py --prompt "Explain the architecture of this codebase"
   ```

## Configuration

- **GPU:** Uncomment `gpu="T4"` in `@app.function()` if running local models via Ollama.
- **Timeout:** Adjust `timeout` (seconds) for long-running tasks.
- **Memory:** Increase `memory` (MB) for large codebases.
- **Model:** Pass `--model` to use a specific provider (e.g., `gpt-4o`, `claude-opus-4-7`).

## Architecture

Each call to `run_agent` spins up a fresh container with:

- Node.js 20 + HopCode CLI
- Git, ripgrep, GitHub CLI
- Isolated `/tmp/hopcode-workspace` directory

Results are streamed back as JSON-ND and parsed for the final response.

## Comparison

| Feature | Docker          | Modal (Serverless)         |
| ------- | --------------- | -------------------------- |
| Startup | Instant         | ~2-5s cold start           |
| Scale   | Manual          | Auto-scale to 0            |
| Cost    | Always-on       | Pay per invocation         |
| State   | Persistent disk | Ephemeral (fresh per call) |
| GPU     | Host-dependent  | Optional cloud GPU         |
