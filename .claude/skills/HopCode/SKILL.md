```markdown
# HopCode Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches the core development patterns, coding conventions, and collaborative workflows used in the HopCode TypeScript codebase. It covers how to structure features, manage configuration, handle merges, and write effective tests. The repository is organized into packages, uses conventional commits, and emphasizes modular, well-tested code.

## Coding Conventions

- **File Naming:**  
  Use camelCase for file and folder names.  
  _Example:_  
  ```
  packages/core/src/sharedTypes.ts
  packages/webui/src/userProfile.tsx
  ```

- **Import Style:**  
  Use relative imports within packages.  
  _Example:_  
  ```typescript
  import { getUser } from './userService'
  import { SharedType } from '../types/sharedTypes'
  ```

- **Export Style:**  
  Use named exports for all modules.  
  _Example:_  
  ```typescript
  // userService.ts
  export function getUser(id: string) { ... }

  // sharedTypes.ts
  export type SharedType = { ... }
  ```

- **Commit Messages:**  
  Follow [Conventional Commits](https://www.conventionalcommits.org/) with prefixes like `feat`, `fix`, `perf`, `ci`, and `merge`.  
  _Example:_  
  ```
  feat: add user profile component and shared types
  fix: correct import path in auth service
  ```

## Workflows

### Feature Development with Tests and Shared Components
**Trigger:** When adding a new feature or capability, especially spanning backend, frontend, and shared code  
**Command:** `/new-feature`

1. Design or update the feature plan or documentation in `docs/plans/*.md`.
2. Implement backend logic or services in `packages/*/src/**/*.ts`.
3. Update or create shared types/interfaces in `packages/*/src/types/**/*.ts`.
4. Implement or update frontend/UI components in `packages/*/src/webview/components/**/*.tsx` or `packages/webui/src/components/**/*.tsx`.
5. Write or update corresponding tests in `*.test.ts` or `*.test.tsx` files.
6. Wire up the feature in main entry points, such as `packages/webui/src/index.ts`.

_Example:_
```typescript
// packages/core/src/userService.ts
export function getUser(id: string) { ... }

// packages/core/src/types/userTypes.ts
export type User = { id: string; name: string }

// packages/core/src/userService.test.ts
import { getUser } from './userService'
import { describe, it, expect } from 'vitest'

describe('getUser', () => {
  it('returns a user object', () => {
    expect(getUser('123')).toHaveProperty('id', '123')
  })
})
```

---

### Infrastructure or Configuration Update
**Trigger:** When updating build scripts, CI/CD workflows, or project configuration  
**Command:** `/update-config`

1. Edit configuration or workflow files, such as `package.json` or `.github/workflows/*.yml`.
2. Test changes locally or in CI.
3. Document the rationale in the commit message.

_Example:_
```yaml
# .github/workflows/ci.yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test
```

---

### Merge Upstream with Conflict Resolution
**Trigger:** When syncing the fork with upstream changes while preserving local modifications  
**Command:** `/merge-upstream`

1. Fetch and merge the upstream branch.
2. Resolve file conflicts, especially in shared or heavily modified files.
3. Preserve local branding, architecture, and configuration.
4. Summarize merged features and conflict resolutions in the commit message.

_Example:_
```bash
git fetch upstream main
git merge upstream/main
# Resolve conflicts in packages/core/src/sharedTypes.ts, etc.
git commit -m "merge: sync with upstream and resolve shared type conflicts"
```

## Testing Patterns

- **Framework:** [Vitest](https://vitest.dev/)
- **Test File Pattern:** Files ending with `.test.ts` or `.test.tsx`
- **Placement:** Tests are located alongside implementation files or in dedicated test directories.

_Example:_
```typescript
// packages/webui/src/components/button.test.tsx
import { render } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders with label', () => {
    const { getByText } = render(<Button label="Click me" />)
    expect(getByText('Click me')).toBeDefined()
  })
})
```

## Commands

| Command         | Purpose                                                        |
|-----------------|----------------------------------------------------------------|
| /new-feature    | Start a new feature with backend, shared types, UI, and tests  |
| /update-config  | Update configuration, build scripts, or CI/CD workflows        |
| /merge-upstream | Merge upstream changes and resolve conflicts                   |
```