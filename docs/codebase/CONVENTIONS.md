# Code Conventions

## Language & Module System

### TypeScript

- **Strict Mode**: Enabled for all packages
  - `strict: true`
  - `noImplicitAny: true`
  - `noImplicitReturns: true`
  - `noImplicitOverride: true`
  - `strictNullChecks: true`
  - `strictFunctionTypes: true`
  - `strictBindCallApply: true`
  - `strictPropertyInitialization: true`
  - `noPropertyAccessFromIndexSignature: true`
  - `verbatimModuleSyntax: true`

- **Target**: ES2022
- **Module**: NodeNext (ESM)
- **Module Resolution**: NodeNext

### ESM Imports

Always use ESM imports (no `require()`):

```typescript
// ✅ Good
import { Config } from '../config/config.js';
import * as path from 'node:path';

// ❌ Bad
const { Config } = require('../config/config.js');
```

**Note**: `.js` extension required in imports (ESM convention).

### Type Imports

Use inline type imports for type-only imports:

```typescript
// ✅ Good
import type { ToolConfig } from './tools.js';
import { ToolRegistry, type ToolName } from './tool-registry.js';

// ❌ Bad
import { ToolRegistry, ToolName } from './tool-registry.js';
type ToolName = ToolName; // type-only import used as value
```

---

## File Naming

### Source Files

- **Pattern**: kebab-case
- **Extension**: `.ts` or `.tsx` for React components

```
✅ skill-manager.ts
✅ tool-registry.ts
✅ provider-dialog.tsx

❌ SkillManager.ts
❌ toolRegistry.ts
```

### Test Files

- **Pattern**: `<source-file>.test.ts`
- **Location**: Colocated with source file

```
src/tools/read-file.ts
src/tools/read-file.test.ts

src/config/config.ts
src/config/config.test.ts
```

---

## Naming Conventions

### Classes & Interfaces

```typescript
// PascalCase for classes
class ToolRegistry { ... }
class HopCodeClient { ... }

// PascalCase for interfaces
interface ToolConfig { ... }
interface ProviderModel { ... }

// Prefix interface names with 'I' only if needed for clarity
interface IReadable { ... } // ✅ Acceptable
interface Readable { ... }  // ✅ Preferred
```

### Functions & Variables

```typescript
// camelCase for functions and variables
function loadSkill(name: string): Promise<SkillConfig> { ... }
const toolRegistry = new ToolRegistry();
let currentModel: string | undefined;

// SCREAMING_SNAKE_CASE for constants
const DEFAULT_MODEL = 'gpt-4o';
const MAX_RETRIES = 3;
```

### Files with Constants

```typescript
// constants.ts
export const CODING_PLAN_ENV_KEY = 'BAILIAN_CODING_PLAN_API_KEY';
export const DEFAULT_HOPCODE_MODEL = 'gpt-4o';
```

---

## Code Style

### Indentation

- **Spaces**: 2 spaces (no tabs)
- **Semicolons**: Required
- **Trailing Commas**: Required (ES2017+)
- **Line Length**: 80 characters (soft limit)

```typescript
// ✅ Good
const config = {
  model: 'gpt-4o',
  provider: 'openai',
  tools: ['read-file', 'write-file'],
};

// ❌ Bad (no trailing comma)
const config = {
  model: 'gpt-4o',
  provider: 'openai',
  tools: ['read-file', 'write-file']
};
```

### Quotes

- **Strings**: Single quotes
- **Template Literals**: Backticks for interpolation

```typescript
// ✅ Good
const message = 'Hello, World!';
const greeting = `Hello, ${name}!`;

// ❌ Bad
const message = "Hello, World!";
```

### Braces

- **Allman Style**: Opening brace on new line for control structures
- **K&R Style**: Opening brace on same line for functions

```typescript
// Control structures
if (condition)
{
  // ...
}

for (let i = 0; i < 10; i++)
{
  // ...
}

// Functions
function doSomething(): void {
  // ...
}

const doSomethingElse = (): void => {
  // ...
};
```

### Arrow Functions

```typescript
// Single parameter: omit parentheses
const double = (x: number): number => x * 2;

// Multiple parameters: use parentheses
const add = (a: number, b: number): number => a + b;

// Block body: use braces and explicit return
const process = (items: string[]): string[] => {
  const result = items.map((item) => item.toUpperCase());
  return result;
};
```

---

## Error Handling

### Throw Typed Errors

```typescript
// ✅ Good
class SkillError extends Error {
  constructor(
    message: string,
    readonly code: SkillErrorCode,
    readonly skillName?: string,
  ) {
    super(message);
    this.name = 'SkillError';
  }
}

throw new SkillError('Failed to parse skill file', SkillErrorCode.PARSE_ERROR);

// ❌ Bad
throw new Error('Something went wrong');
```

### Error Boundaries

Log errors at the boundary (CLI layer), not deep in core:

```typescript
// ✅ Good (in CLI layer)
try {
  await client.run(prompt);
} catch (error) {
  logger.error('Session failed:', getErrorMessage(error));
  process.exit(1);
}

// ❌ Bad (deep in core logic)
try {
  // ...
} catch (error) {
  console.error('Error:', error); // Never use console.log in library code
  process.exit(1);
}
```

### Error Messages

```typescript
// ✅ Good: Descriptive with context
throw new SkillError(
  `Failed to parse skill file: ${error instanceof Error ? error.message : 'Unknown error'}`,
  SkillErrorCode.PARSE_ERROR,
);

// ❌ Bad: Vague
throw new Error('Parsing failed');
```

---

## Async Patterns

### Async/Await (Preferred)

```typescript
// ✅ Good
async function loadSkill(name: string): Promise<SkillConfig | null> {
  const skill = await skillManager.findSkillByName(name);
  if (!skill) {
    return null;
  }
  return await skillManager.parseSkillFile(skill.path);
}
```

### Promise.all for Parallel Execution

```typescript
// ✅ Good
const [providers, models, tools] = await Promise.all([
  loadProviders(),
  loadModels(),
  loadTools(),
]);
```

### Avoid .then() Chains

```typescript
// ✅ Good
const result = await fetchData();
process(result);

// ❌ Bad
fetchData().then((result) => {
  process(result);
});
```

---

## Testing Conventions

### Test File Structure

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToolRegistry } from './tool-registry.js';

describe('ToolRegistry', () => {
  let registry: ToolRegistry;

  beforeEach(() => {
    registry = new ToolRegistry();
  });

  describe('registerTool', () => {
    it('should add tool to registry', () => {
      const tool = new MockTool();
      registry.registerTool(tool);

      expect(registry.getTool('mock-tool')).toBe(tool);
    });

    it('should throw if tool already registered', () => {
      registry.registerTool(new MockTool());

      expect(() => registry.registerTool(new MockTool())).toThrow();
    });
  });
});
```

### Mocking

Use `vi.hoisted()` for mocks consumed by `vi.mock()`:

```typescript
// ✅ Good
const mockFs = vi.hoisted(() => {
  return {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  };
});

vi.mock('node:fs', () => ({
  readFile: mockFs.readFile,
  writeFile: mockFs.writeFile,
}));

it('reads file', async () => {
  mockFs.readFile.mockResolvedValue('content');
  // ...
});

// ❌ Bad (mock factory runs before test setup)
vi.mock('node:fs', () => ({
  readFile: vi.fn(), // Can't be configured in test
}));
```

### Test Isolation

```typescript
// ✅ Good: Isolated test state
beforeEach(() => {
  vi.clearAllMocks();
  registry = new ToolRegistry();
});

// ❌ Bad: Shared state between tests
let registry = new ToolRegistry(); // Created once, shared across tests
```

### Async Test Timeout

```typescript
// ✅ Good
it('loads data', { timeout: 10000 }, async () => {
  await loadData();
});
```

---

## Import Organization

### Import Order

```typescript
// 1. Node built-ins
import * as fs from 'node:fs';
import * as path from 'node:path';
import process from 'node:process';

// 2. External dependencies
import { z } from 'zod';
import { ModelRegistry } from '@hoptrendy/hopcode-core';

// 3. Internal packages (no relative imports between packages)
import { Config } from '../config/config.js';
import { ToolRegistry } from '../tools/tool-registry.js';

// 4. Same-package imports
import { ToolError } from './tool-error.js';
import type { ToolName } from './tool-names.js';
```

### No Cross-Package Relative Imports

```typescript
// ✅ Good (in packages/cli/src/commands/model.ts)
import { ModelRegistry } from '@hoptrendy/hopcode-core';

// ❌ Bad
import { ModelRegistry } from '../../../core/src/models/index.js';
```

---

## Documentation

### JSDoc for Public APIs

```typescript
/**
 * Lists all available skills.
 *
 * @param options - Filtering options
 * @returns Array of skill configurations
 * @throws SkillError if skill loading fails
 */
async function listSkills(options?: ListSkillsOptions): Promise<SkillConfig[]> {
  // ...
}
```

### Comments for Complex Logic

```typescript
// Use binary search for O(log n) lookup in sorted array
let left = 0;
let right = sortedArray.length - 1;

while (left <= right) {
  const mid = Math.floor((left + right) / 2);
  // ...
}
```

### TODO Comments

```typescript
// TODO(taimoor): Implement caching for better performance
// TODO: Add rate limiting (#123)
```

---

## Git & Commits

### Conventional Commits

```
feat(cli): Add --json flag to config get command
fix(core): Resolve model alias correctly
docs: Update architecture diagram
test(skills): Add unit tests for skill loading
refactor(provider): Simplify provider registry
chore: Update dependencies
```

### PR Titles

Follow Conventional Commits format:
- `feat: Add arena mode for multi-model comparison`
- `fix: Handle rate limit errors gracefully`
- `chore: Bump AI SDK to 5.0.124`

---

## Do's and Don'ts

### Do

```typescript
// Use const over let
const MAX_RETRIES = 3;
let retryCount = 0; // Only if mutation needed

// Use for...of over .forEach()
for (const tool of tools) {
  await tool.initialize();
}

// Use early returns
if (!config) {
  return null;
}
// Continue with config...

// Use type guards
function isSkillError(error: unknown): error is SkillError {
  return error instanceof SkillError && 'code' in error;
}

// Use optional chaining
const baseUrl = provider?.config?.baseUrl;

// Use nullish coalescing
const model = userSelectedModel ?? defaultModel;
```

### Don't

```typescript
// Avoid var
var count = 0; // ❌

// Avoid .forEach() with async
tools.forEach(async (tool) => {
  await tool.initialize(); // ❌ Parallel execution unclear
});

// Avoid deep nesting
if (condition1) {
  if (condition2) {
    if (condition3) {
      // ... // ❌
    }
  }
}

// Avoid any type
const data: any = {}; // ❌

// Avoid console.log in library code
console.log('Debug info'); // ❌ Use logger instead
```

---

## ESLint Configuration

### Global Rules

```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-any': 'error',
      'no-unused-vars': 'error',
      'no-console': 'warn',
    },
  },
];
```

### Provider Directory Exceptions

```javascript
{
  files: ['packages/core/src/provider/**/*.ts'],
  rules: {
    '@typescript-eslint/no-namespace': 'off', // Allowed for provider namespaces
    '@typescript-eslint/no-explicit-any': 'off', // AI SDK types required
    '@typescript-eslint/ban-ts-comment': 'off', // @ts-expect-error for type coercions
  },
}
```

---

## Prettier Configuration

```json
// .prettierrc.json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 80,
  "arrowParens": "always",
  "bracketSpacing": true,
  "endOfLine": "lf"
}
```

---

## Package-Specific Conventions

### Core Package

- Export types alongside functions: `export { ToolRegistry, type ToolName }`
- Use namespaces for provider SDKs: `export namespace Provider { ... }`
- Lazy-load heavy tool classes via dynamic import

### CLI Package

- React components in `.tsx` files
- Ink components use functional style with hooks
- Commands exported as default function

### VS Code Extension

- Extension entry point in `extension.ts`
- Use VS Code API types from `@types/vscode`
- Extension bundled as CommonJS (`.cjs`)

---

## Code Review Checklist

Before submitting a PR:

- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Prettier formatting applied (`npm run format`)
- [ ] Tests pass (`npm test`)
- [ ] No `any` types without justification comment
- [ ] All new functions have JSDoc comments
- [ ] Error handling in place
- [ ] No console.log in library code
- [ ] Import order follows convention
- [ ] No cross-package relative imports
- [ ] Test coverage for new code
- [ ] Commit message follows Conventional Commits

---

## Tooling Commands

```bash
# Full preflight check
npm run preflight

# Individual checks
npm run lint        # ESLint
npm run format      # Prettier
npm run typecheck   # TypeScript
npm test            # Unit tests
npm run test:ci     # CI test run
```
