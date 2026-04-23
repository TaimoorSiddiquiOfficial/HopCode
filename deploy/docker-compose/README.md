# HopCode Docker Compose Deployment

Run HopCode as a containerized service stack with Docker Compose.

## Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Service definition (agent + dashboard) |
| `.env.example` | Example environment variables |

## Quick Start

1. **Copy environment file**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

2. **Start services**
   ```bash
   docker-compose up -d
   ```

3. **Access services**
   - gRPC server: `localhost:50051`
   - Web dashboard: `http://localhost:3000`

4. **Run a client**
   ```bash
   # Using grpcurl (install first)
   grpcurl -plaintext -proto packages/server/proto/hopcode.proto \
     -d '{"session_id":"test-1","model":"claude-sonnet-4-6","cwd":"/workspace"}' \
     localhost:50051 hopcode.HopCodeAgent/CreateSession
   ```

## Services

### hopcode-agent
- Exposes gRPC server on port 50051
- Headless agent execution
- Persistent volume for `.hopcode` config and sessions
- Health check via `hopcode --version`

### hopcode-dashboard
- Web UI for session browsing and chat
- Depends on agent being healthy
- Exposes port 3000

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Optional | For Claude models |
| `OPENAI_API_KEY` | Optional | For GPT models |
| `HOPCODE_MODEL` | Optional | Default model ID |
| `HOPCODE_PERMISSION_MODE` | Optional | `default`, `plan`, `auto-edit`, `yolo` |

## Scaling

To run multiple agent instances behind a load balancer:

```yaml
services:
  hopcode-agent:
    deploy:
      replicas: 3
```

Each instance maintains its own session state. For shared sessions, mount a shared volume.
