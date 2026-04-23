# HopCode Serverless / Cloud Deployment Templates

This directory contains deployment templates for running HopCode in various cloud environments.

## Available Templates

| Template | Platform | Cost Model | Best For |
|----------|----------|-----------|----------|
| [Modal](modal/) | [Modal.com](https://modal.com) | Pay-per-invocation | Ephemeral tasks, auto-scaling |
| [Docker Compose](docker-compose/) | Any Docker host | Always-on | Persistent agents, local dev |

## Coming Soon

- **AWS Lambda** — Serverless with API Gateway
- **Google Cloud Run** — Container-based serverless
- **Kubernetes Helm Chart** — Orchestrated multi-agent clusters
- **Fly.io** — Edge-deployed agents

## Comparison

| Feature | Docker Compose | Modal |
|---------|---------------|-------|
| Startup | Instant | ~2-5s cold start |
| Scale | Manual / Compose | Auto-scale to 0 |
| GPU | Host-dependent | Optional cloud GPU |
| State | Persistent volume | Ephemeral |
| Cost | Fixed (host) | Per-invocation |

## Security Notes

- Never commit API keys to version control. Use `.env` files or secret managers.
- Set `HOPCODE_PERMISSION_MODE=default` or `plan` for production to require approval for destructive tools.
- Use `HOPCODE_SANDBOX=docker` to isolate shell execution.
