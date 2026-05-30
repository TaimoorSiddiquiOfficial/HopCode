/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

// Re-export wrapper. The implementation lives in `@hoptrendy/hopcode-acp-bridge`
// (lifted in #4175 PR 22a). Existing `import { createInMemoryChannel }
// from './inMemoryChannel.js'` callers inside `serve/` and the SDK
// in-process bridge tests keep resolving without churn.
//
// @see ../../../acp-bridge/src/inMemoryChannel.ts for the implementation
//      plus design notes on `abort()` semantics and settlement shape.
export * from '@hoptrendy/hopcode-acp-bridge/inMemoryChannel';
