# Phase 3: Refactoring Plan

**Date**: 2026-04-24  
**Status**: Planning Complete - Ready for Implementation  
**Target**: Reduce technical debt, improve maintainability, enable faster feature development

---

## Overview

Phase 3 focuses on refactoring four major systems to improve code quality, type safety, and maintainability:

1. **Provider System** - Unify provider interface, centralize error handling
2. **Tool System** - Base class hierarchy, lazy loading, unified permissions
3. **Config System** - Split 2844-line Config.ts into modular components
4. **Type Safety** - Eliminate `any` types, add type guards, strict return types

---

## 1. Provider System Refactoring

### Current Issues

**File**: `packages/core/src/provider/provider.ts` (1597 lines)

**Problems**:
- ESLint exceptions for `no-namespace` and `no-explicit-any`
- Inconsistent error handling across providers
- Duplicated model catalog logic
- Complex nested conditionals for provider creation

### Refactoring Plan

#### 1.1 Create Unified Provider Interface

**New File**: `packages/core/src/provider/types.ts`

```typescript
/**
 * Unified provider interface for all LLM providers.
 * All providers must implement this interface.
 */
export interface HopCodeProvider {
  /** Unique provider identifier (e.g., 'openai', 'anthropic') */
  readonly id: string;
  
  /** Human-readable label */
  readonly label: string;
  
  /** Whether API key is required */
  readonly requiresApiKey: boolean;
  
  /** Environment variable name for API key */
  readonly envKey?: string;
  
  /** Default base URL (if applicable) */
  readonly baseUrl?: string;
  
  /** Whether to fetch models from API at runtime */
  readonly liveModels: boolean;
  
  /** Default model to use if none specified */
  readonly defaultModel?: string;
  
  /** Provider categories for UI grouping */
  readonly categories: string[];
  
  /**
   * Create provider client with given options.
   * @param options - Provider-specific options
   * @returns Configured provider client
   */
  createClient(options: ProviderOptions): ProviderClient;
  
  /**
   * Fetch available models from provider API.
   * @param options - Authentication options
   * @returns List of available models
   */
  getModels(options: AuthOptions): Promise<ProviderModel[]>;
  
  /**
   * Validate API key format and authenticity.
   * @param key - API key to validate
   * @returns True if valid
   */
  validateApiKey(key: string): Promise<boolean>;
}

/**
 * Provider client for making API requests.
 */
export interface ProviderClient {
  /**
   * Generate content from prompt.
   */
  generateContent(request: GenerationRequest): Promise<GenerationResponse>;
  
  /**
   * Stream content from prompt.
   */
  streamContent(request: GenerationRequest): AsyncIterable<StreamChunk>;
}
```

#### 1.2 Centralize Error Handling

**New File**: `packages/core/src/provider/errors.ts`

```typescript
/**
 * Standardized error types for all providers.
 */
export enum HopCodeErrorType {
  /** Rate limit exceeded */
  RATE_LIMIT = 'RATE_LIMIT',
  
  /** Authentication failure */
  AUTH = 'AUTH',
  
  /** API quota exceeded */
  QUOTA = 'QUOTA',
  
  /** Invalid request parameters */
  INVALID_REQUEST = 'INVALID_REQUEST',
  
  /** Provider server error */
  SERVER = 'SERVER',
  
  /** Network connectivity issue */
  NETWORK = 'NETWORK',
  
  /** Content filtered by provider */
  CONTENT_FILTER = 'CONTENT_FILTER',
  
  /** Model not found or unavailable */
  MODEL_NOT_FOUND = 'MODEL_NOT_FOUND',
}

/**
 * Base class for all provider errors.
 */
export class ProviderError extends Error {
  constructor(
    message: string,
    readonly type: HopCodeErrorType,
    readonly provider: string,
    readonly statusCode?: number,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ProviderError';
  }
  
  /**
   * Classify an unknown error into a ProviderError.
   */
  static classify(error: unknown, provider: string): ProviderError {
    if (error instanceof ProviderError) {
      return error;
    }
    
    // Classification logic here
    // ...
  }
  
  /**
   * Convert to JSON for logging/telemetry.
   */
  toJSON(): ProviderErrorJSON {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      provider: this.provider,
      statusCode: this.statusCode,
      stack: this.stack,
    };
  }
}
```

#### 1.3 Extract Common Logic

**New File**: `packages/core/src/provider/utils.ts`

```typescript
/**
 * Shared utilities for all providers.
 */
export namespace ProviderUtils {
  /**
   * Retry logic with exponential backoff.
   */
  export async function withRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {},
  ): Promise<T> {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 30000,
    } = options;
    
    let delay = initialDelay;
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (!isRetryable(error) || attempt === maxRetries) {
          break;
        }
        
        await sleep(delay);
        delay = Math.min(delay * 2, maxDelay);
      }
    }
    
    throw lastError;
  }
  
  /**
   * Count tokens using provider-specific tokenizer.
   */
  export function countTokens(
    text: string,
    model: string,
    provider: string,
  ): number {
    // Provider-specific token counting
  }
  
  /**
   * Transform messages between provider formats.
   */
  export function transformMessages(
    messages: Message[],
    fromProvider: string,
    toProvider: string,
  ): Message[] {
    // Message format transformation
  }
}
```

### Implementation Steps

1. Create `types.ts` with unified interfaces
2. Create `errors.ts` with centralized error handling
3. Create `utils.ts` with shared utilities
4. Migrate each provider to new interface (one at a time)
5. Remove ESLint exceptions for provider directory
6. Write conformance tests for each provider

**Estimated Effort**: 3-4 days

---

## 2. Tool System Refactoring

### Current Issues

**Directory**: `packages/core/src/tools/` (63 tool files)

**Problems**:
- Inconsistent patterns across tool implementations
- Some tools loaded at startup (slow initialization)
- Duplicated permission check logic
- No common base class for tools

### Refactoring Plan

#### 2.1 Create Base Tool Class

**New File**: `packages/core/src/tools/base-tool.ts`

```typescript
/**
 * Abstract base class for all tools.
 * Provides common lifecycle, validation, and permission checking.
 */
export abstract class BaseTool<TParams, TResult> {
  /** Tool name (must be unique) */
  abstract readonly name: ToolName;
  
  /** Human-readable description */
  abstract readonly description: string;
  
  /** Zod schema for parameter validation */
  abstract readonly schema: z.ZodSchema<TParams>;
  
  /** Whether tool requires approval */
  readonly requiresApproval: boolean = true;
  
  /**
   * Execute the tool with full lifecycle.
   */
  async execute(
    params: unknown,
    context: ToolContext,
  ): Promise<ToolResult<TResult>> {
    // 1. Validate parameters
    const validatedParams = await this.validate(params);
    
    // 2. Check permissions
    await this.checkPermissions(context);
    
    // 3. Fire pre-execution hooks
    await this.firePreExecuteHooks(validatedParams, context);
    
    // 4. Execute tool
    const startTime = Date.now();
    try {
      const result = await this.invoke(validatedParams, context);
      
      // 5. Fire post-execution hooks
      await this.firePostExecuteHooks(result, context);
      
      // 6. Log telemetry
      this.logExecution(startTime, 'success');
      
      return { success: true, result };
    } catch (error) {
      // 7. Handle errors
      this.logExecution(startTime, 'error', error);
      throw error;
    }
  }
  
  /**
   * Validate parameters against schema.
   */
  protected async validate(params: unknown): Promise<TParams> {
    return await this.schema.parseAsync(params);
  }
  
  /**
   * Check if tool execution is permitted.
   */
  protected async checkPermissions(context: ToolContext): Promise<void> {
    if (!context.permissionManager.hasPermission(this.name)) {
      throw new PermissionError(
        `Tool '${this.name}' requires ${context.permissionMode} mode`,
      );
    }
  }
  
  /**
   * Main tool implementation (to be implemented by subclasses).
   */
  protected abstract invoke(
    params: TParams,
    context: ToolContext,
  ): Promise<TResult>;
  
  /**
   * Fire pre-execution hooks.
   */
  private async firePreExecuteHooks(
    params: TParams,
    context: ToolContext,
  ): Promise<void> {
    await context.hookSystem.fireEvent('on_tool_call', {
      tool: this.name,
      params,
      phase: 'pre',
    });
  }
  
  /**
   * Fire post-execution hooks.
   */
  private async firePostExecuteHooks(
    result: TResult,
    context: ToolContext,
  ): Promise<void> {
    await context.hookSystem.fireEvent('on_tool_call', {
      tool: this.name,
      result,
      phase: 'post',
    });
  }
  
  /**
   * Log tool execution for telemetry.
   */
  private logExecution(
    startTime: number,
    status: 'success' | 'error',
    error?: unknown,
  ): void {
    const duration = Date.now() - startTime;
    telemetry.logToolCall(this.name, duration, status, error);
  }
}
```

#### 2.2 Implement Lazy Loading

**File**: `packages/core/src/tools/tool-registry.ts`

```typescript
/**
 * Tool registry with lazy loading support.
 */
export class ToolRegistry {
  private readonly toolFactories = new Map<ToolName, ToolFactory>();
  private readonly toolCache = new Map<ToolName, Tool<any, any>>();
  
  /**
   * Register a tool factory for lazy loading.
   */
  registerFactory(name: ToolName, factory: ToolFactory): void {
    this.toolFactories.set(name, factory);
  }
  
  /**
   * Get tool instance, loading on first access.
   */
  getTool(name: ToolName): Tool<any, any> {
    // Check cache first
    const cached = this.toolCache.get(name);
    if (cached) {
      return cached;
    }
    
    // Load tool on demand
    const factory = this.toolFactories.get(name);
    if (!factory) {
      throw new Error(`Tool not registered: ${name}`);
    }
    
    const tool = factory();
    this.toolCache.set(name, tool);
    return tool;
  }
  
  /**
   * List all registered tools (without loading).
   */
  listTools(): ToolName[] {
    return Array.from(this.toolFactories.keys());
  }
}

/**
 * Factory function for lazy tool loading.
 */
export type ToolFactory = () => Tool<any, any>;
```

**Usage Example**:
```typescript
// Register tool with lazy loading
toolRegistry.registerFactory(
  ToolNames.READ_FILE,
  () => new ReadFileTool(),
);

// Tool is only loaded when first accessed
const tool = toolRegistry.getTool(ToolNames.READ_FILE);
```

#### 2.3 Unified Permission System

**New File**: `packages/core/src/tools/permissions.ts`

```typescript
/**
 * Unified permission checking for all tools.
 */
export class ToolPermissionManager {
  constructor(
    private readonly permissionMode: PermissionMode,
    private readonly approvalManager: ApprovalManager,
  ) {}
  
  /**
   * Check if tool execution is permitted.
   */
  async checkPermission(
    tool: ToolName,
    context: PermissionContext,
  ): Promise<PermissionResult> {
    switch (this.permissionMode) {
      case PermissionMode.YOLO:
        return { permitted: true };
        
      case PermissionMode.AUTO_EDIT:
        if (this.isSafeEdit(tool, context)) {
          return { permitted: true };
        }
        return await this.requestApproval(tool, context);
        
      case PermissionMode.PLAN:
      case PermissionMode.DEFAULT:
      default:
        return await this.requestApproval(tool, context);
    }
  }
  
  /**
   * Determine if an edit is safe (auto-approvable).
   */
  private isSafeEdit(tool: ToolName, context: PermissionContext): boolean {
    // Safe edit heuristics:
    // - Small file changes (< 100 lines)
    // - Non-critical files (not config, not package.json)
    // - No security-sensitive operations
    // ...
  }
  
  /**
   * Request user approval for tool execution.
   */
  private async requestApproval(
    tool: ToolName,
    context: PermissionContext,
  ): Promise<PermissionResult> {
    return await this.approvalManager.request({
      tool,
      description: context.toolDescription,
      impact: context.impactAssessment,
    });
  }
}
```

### Implementation Steps

1. Create `base-tool.ts` with abstract base class
2. Create `permissions.ts` with unified permission system
3. Update `tool-registry.ts` with lazy loading
4. Migrate each tool to extend `BaseTool` (one at a time)
5. Update all tool imports to use lazy loading
6. Benchmark startup time improvement (target: 40% faster)

**Estimated Effort**: 4-5 days

---

## 3. Config System Refactoring

### Current Issues

**File**: `packages/core/src/config/config.ts` (2844 lines)

**Problems**:
- Too large to understand at once
- Mixed concerns (auth, tools, models, session, telemetry)
- Difficult to test in isolation
- Long constructor with many responsibilities

### Refactoring Plan

#### 3.1 Split into Modules

**New Directory Structure**:
```
config/
├── Config.ts                 # Main orchestrator class (~300 lines)
├── AuthConfig.ts             # Authentication configuration
├── ModelConfig.ts            # Model/provider configuration
├── ToolConfig.ts             # Tool configuration
├── SessionConfig.ts          # Session configuration
├── MCPConfig.ts              # MCP configuration
├── TelemetryConfig.ts        # Telemetry configuration
├── validation/               # Zod validation schemas
│   ├── auth.schema.ts
│   ├── model.schema.ts
│   └── ...
└── index.ts                  # Public exports
```

#### 3.2 Example: AuthConfig Module

**New File**: `packages/core/src/config/AuthConfig.ts`

```typescript
import { z } from 'zod';
import type { AuthType } from '../core/contentGenerator.js';

/**
 * Validation schema for auth configuration.
 */
export const AuthConfigSchema = z.object({
  selectedType: z.enum(['openai', 'anthropic', 'gemini', 'vertex-ai']),
  apiKeys: z.record(z.string()).optional(),
  oauthTokens: z.record(z.string()).optional(),
});

export type AuthConfigInput = z.infer<typeof AuthConfigSchema>;

/**
 * Immutable authentication configuration.
 */
export class AuthConfig {
  constructor(private readonly config: AuthConfigInput) {
    AuthConfigSchema.parse(config);
  }
  
  get selectedType(): AuthType {
    return this.config.selectedType as AuthType;
  }
  
  getApiKey(provider: string): string | undefined {
    return this.config.apiKeys?.[provider];
  }
  
  getOAuthToken(provider: string): string | undefined {
    return this.config.oauthTokens?.[provider];
  }
  
  /**
   * Create new config with updated API key.
   */
  withApiKey(provider: string, key: string): AuthConfig {
    return new AuthConfig({
      ...this.config,
      apiKeys: {
        ...this.config.apiKeys,
        [provider]: key,
      },
    });
  }
}
```

#### 3.3 Main Config as Orchestrator

**Refactored Config.ts** (simplified):
```typescript
export class Config {
  private readonly _auth: AuthConfig;
  private readonly _models: ModelConfig;
  private readonly _tools: ToolConfig;
  
  constructor(options: ConfigOptions) {
    // Delegate to specialized config classes
    this._auth = new AuthConfig(options.auth);
    this._models = new ModelConfig(options.models);
    this._tools = new ToolConfig(options.tools);
    
    // Initialize services
    this.initializeServices();
  }
  
  get auth(): AuthConfig {
    return this._auth;
  }
  
  get models(): ModelConfig {
    return this._models;
  }
  
  get tools(): ToolConfig {
    return this._tools;
  }
  
  private initializeServices(): void {
    // Service initialization only
  }
}
```

### Implementation Steps

1. Create validation schemas in `validation/` directory
2. Create `AuthConfig.ts`, `ModelConfig.ts`, etc.
3. Extract methods from Config.ts to new modules
4. Update Config.ts to delegate to new modules
5. Update all Config usages (should be minimal)
6. Write unit tests for each config module

**Estimated Effort**: 3-4 days

---

## 4. Type Safety Improvements

### Current Issues

**Files**: Throughout codebase, especially `provider/sdk/` directory

**Problems**:
- `any` types in provider SDK directory
- Missing return type annotations
- Inconsistent use of type guards
- Complex AI SDK types not properly handled

### Refactoring Plan

#### 4.1 Eliminate `any` Types

**Before**:
```typescript
function transformResponse(data: any): any {
  // Unsafe transformation
  return data.result;
}
```

**After**:
```typescript
interface ApiResponse {
  result: unknown;
  error?: string;
}

function transformResponse(data: unknown): TransformedData {
  if (!isApiResponse(data)) {
    throw new TypeError('Invalid API response');
  }
  return transformToDomainModel(data);
}

function isApiResponse(data: unknown): data is ApiResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'result' in data
  );
}
```

#### 4.2 Add Type Guards Throughout

**New File**: `packages/core/src/util/type-guards.ts`

```typescript
/**
 * Type guards for common error types.
 */
export function isSkillError(error: unknown): error is SkillError {
  return error instanceof SkillError && 'code' in error;
}

export function isProviderError(error: unknown): error is ProviderError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'provider' in error
  );
}

export function isToolError(error: unknown): error is ToolError {
  return (
    error instanceof Error &&
    error.name === 'ToolError'
  );
}

/**
 * Type guards for API responses.
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>,
): response is SuccessResponse<T> {
  return 'data' in response && !('error' in response);
}

export function isErrorResponse(
  response: ApiResponse<unknown>,
): response is ErrorResponse {
  return 'error' in response;
}
```

#### 4.3 Strict Return Types

**ESLint Rule Update**:
```javascript
// eslint.config.js
{
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
  }
}
```

### Implementation Steps

1. Add ESLint rules for strict types
2. Create `type-guards.ts` with common guards
3. Fix provider SDK directory first (highest concentration of `any`)
4. Add return types to all public functions
5. Run TypeScript with strictest settings
6. Fix all type errors

**Estimated Effort**: 2-3 days

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking changes in provider interface | Medium | High | Maintain backward compatibility during transition |
| Tool lazy loading causes issues | Low | Medium | Comprehensive testing, feature flag |
| Config refactoring breaks initialization | Medium | High | Extensive unit tests, gradual migration |
| Type changes cause cascade of errors | High | Medium | Fix incrementally, module by module |

---

## Success Metrics

### Code Quality
- [ ] Zero `any` types in codebase
- [ ] All functions have explicit return types
- [ ] All ESLint rules passing (no exceptions)
- [ ] TypeScript strict mode fully enabled

### Maintainability
- [ ] Config.ts reduced from 2844 to <500 lines
- [ ] Provider errors handled consistently
- [ ] Tools load 40% faster (lazy loading)
- [ ] Test coverage >80% for refactored modules

### Performance
- [ ] Startup time reduced by 40%
- [ ] Tool execution latency unchanged
- [ ] Memory usage stable

---

## Timeline

| Week | Focus | Deliverables |
|------|-------|--------------|
| 6 | Provider System | Unified interface, error handling, utils |
| 7 | Tool System | Base class, lazy loading, permissions |
| 8 | Config System | Modular config, validation schemas |
| 8 (cont.) | Type Safety | Eliminate `any`, add type guards |

**Total Estimated Duration**: 3 weeks

---

## Next Steps

1. **Review and approve this plan** with stakeholders
2. **Create GitHub issues** for each refactoring task
3. **Set up project board** to track progress
4. **Begin Week 6** - Provider System refactoring

---

**Status**: ✅ Planning Complete - Ready for Implementation
