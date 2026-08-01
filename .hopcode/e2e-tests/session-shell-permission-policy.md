# Session Shell Permission Policy E2E

## Problem

Direct session shell is a user-visible daemon capability. It must stay disabled
by default and only become visible and callable when the operator enables it on
an authenticated daemon.

## Scenarios

1. Start `hopcode serve` on loopback without `--token` or
   `HOPCODE_SERVER_TOKEN`.
   - `/capabilities.features` must not include `session_shell_command`.
   - ACP initialize `_meta.hopcode.methods` must not include
     `_hopcode/session/shell`.
   - `POST /session/:id/shell` must return `401 token_required`.

2. Start `hopcode serve --token <token>` without `--enable-session-shell`.
   - `/capabilities.features` must not include `session_shell_command`.
   - ACP initialize must not advertise `_hopcode/session/shell`.
   - Authenticated REST shell calls must return
     `session_shell_disabled`.

3. Start `hopcode serve --token <token> --enable-session-shell`.
   - `/capabilities.features` must include `session_shell_command`.
   - ACP initialize must advertise `_hopcode/session/shell`.
   - REST shell without `X-hopcode-client-id` must return
     `client_id_required`.
   - REST shell with the session-bound client id must execute and stream
     shell output through the session events.

## Commands

Focused automated checks:

```bash
cd packages/acp-bridge && npx vitest run src/bridge.test.ts
cd packages/cli && npx vitest run src/serve/server.test.ts src/serve/acpHttp/transport.test.ts src/commands/serve.test.ts
```

Final verification:

```bash
npm run build
npm run typecheck
```

## What This Proves

- The default daemon does not expose direct session shell.
- Operator opt-in without bearer auth is ineffective.
- Authenticated opt-in advertises the capability consistently across REST and
  ACP.
- Calls still need a client id bound to the target session.

## What This Does Not Prove

- It does not validate prompt queue backpressure.
- It does not validate normal agent-originated shell tool approval behavior.
- It does not add or validate shell-specific rate limiting.
