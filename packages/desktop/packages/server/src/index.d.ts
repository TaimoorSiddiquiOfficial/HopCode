#!/usr/bin/env bun
/**
 * @craft-agent/server — standalone headless HopCode server.
 *
 * Usage:
 *   CRAFT_SERVER_TOKEN=<secret> bun run packages/server/src/index.ts
 *
 * Environment:
 *   CRAFT_SERVER_TOKEN         — required bearer token for client auth
 *   CRAFT_RPC_HOST             — bind address (default: 127.0.0.1)
 *   CRAFT_RPC_PORT             — bind port (default: 9100)
 *   CRAFT_RPC_TLS_CERT         — path to PEM certificate file (enables TLS/wss)
 *   CRAFT_RPC_TLS_KEY          — path to PEM private key file (required with cert)
 *   CRAFT_RPC_TLS_CA           — path to PEM CA chain file (optional)
 *   CRAFT_APP_ROOT             — app root path (default: cwd)
 *   CRAFT_RESOURCES_PATH       — resources path (default: cwd/resources)
 *   CRAFT_IS_PACKAGED          — 'true' for production (default: false)
 *   CRAFT_VERSION              — app version (default: 0.0.0-dev)
 *   CRAFT_DEBUG                — 'true' for debug logging
 *   CRAFT_WEBUI_DIR            — path to built web UI assets (enables web UI on RPC port)
 *   CRAFT_WEBUI_PASSWORD       — optional shorter password for web login (falls back to CRAFT_SERVER_TOKEN)
 *   CRAFT_WEBUI_SECURE_COOKIE  — optional true/false override for the session cookie Secure flag
 *   CRAFT_WEBUI_WS_URL         — optional browser-facing ws:// or wss:// URL returned by /api/config
 *   CRAFT_MESSAGING_WA_WORKER  — absolute path to worker.cjs (default: packages/messaging-whatsapp-worker/dist/worker.cjs)
 *   CRAFT_MESSAGING_NODE_BIN   — Node binary used to spawn the WhatsApp worker (default: node)
 */
export {};
