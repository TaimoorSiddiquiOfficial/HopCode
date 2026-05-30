/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

// Re-export wrapper. The implementation lives in `@hoptrendy/hopcode-acp-bridge`
// (lifted in #4175 PR 22a). Existing `import { ... } from './eventBus.js'`
// callers inside `serve/` and the one external import in
// `cli/src/commands/serve.ts:14` keep resolving without churn.
//
// @see ../../../acp-bridge/src/eventBus.ts for the implementation plus
//      threat-model notes on bounded ring replay, slow-client backpressure,
//      and `client_evicted` semantics.
export * from '@hoptrendy/hopcode-acp-bridge/eventBus';
