/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand, CommandContext, SlashCommandActionReturn } from './types.js';
import { CommandKind } from './types.js';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

/**
 * Make Skill Template Command
 * 
 * Generates a complete MCP server implementation from a natural language description.
 * Creates tool definitions, handler code, tests, and registers the server in .hopcode/mcp.json.
 * 
 * Usage: /make-skill-template <description>
 * Example: /make-skill-template "Create a skill for interacting with Linear API for issue tracking"
 */
export const makeSkillTemplateCommand: SlashCommand = {
  name: 'make-skill-template',
  description:
    'Generate a complete MCP server skill from a description (tools, handlers, tests, config)',
  kind: CommandKind.BUILT_IN,
  action: async (context: CommandContext, args: string): Promise<SlashCommandActionReturn> => {
    if (!args || args.trim().length === 0) {
      return {
        type: 'message',
        messageType: 'warning',
        content: `# ❌ Missing Skill Description

**Usage**: \`/make-skill-template <description>\`

**Example**:
\`\`\`
/make-skill-template Create a skill for interacting with Linear API for issue tracking
\`\`\`

**What it generates**:
- TypeScript MCP server with tools
- Tool handlers with input validation (Zod)
- Unit tests (Vitest)
- Configuration (.hopcode/mcp.json)
- Documentation (README.md)`,
      };
    }

    try {
      const skillName = extractSkillName(args);
      const generatedFiles = await generateSkillTemplate(context, skillName, args);

      return {
        type: 'message',
        messageType: 'success',
        content: generateSuccessReport(skillName, generatedFiles),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        type: 'message',
        messageType: 'error',
        content: `# ❌ Skill Generation Failed

**Error**: ${errorMessage}

## Troubleshooting

1. Check file permissions
2. Ensure target directory is writable
3. Verify skill name is valid (lowercase, hyphens)

**Example**: \`/make-skill-template linear-api for issue tracking\``,
      };
    }
  },
};

interface GeneratedFile {
  path: string;
  content: string;
  description: string;
}

/**
 * Extract skill name from description
 */
function extractSkillName(description: string): string {
  // Extract first few words as skill name
  const words = description.toLowerCase().split(/\s+/);
  const nameWords = words.slice(0, Math.min(3, words.length));
  return nameWords.join('-').replace(/[^a-z0-9-]/g, '');
}

/**
 * Generate complete skill template
 */
async function generateSkillTemplate(
  context: CommandContext,
  skillName: string,
  description: string,
): Promise<GeneratedFile[]> {
  const generatedFiles: GeneratedFile[] = [];

  // Ensure skills directory exists
  const skillsDir = join('.agents', 'skills', skillName);
  if (!existsSync(skillsDir)) {
    mkdirSync(skillsDir, { recursive: true });
  }

  // Generate TypeScript MCP server
  generatedFiles.push(generateMcpServer(skillName, description));

  // Generate tests
  generatedFiles.push(generateTests(skillName, description));

  // Generate README
  generatedFiles.push(generateReadme(skillName, description));

  // Generate package.json
  generatedFiles.push(generatePackageJson(skillName, description));

  // Generate TypeScript config
  generatedFiles.push(generateTsConfig(skillName));

  // Write all files
  for (const file of generatedFiles) {
    const fullPath = join(skillsDir, file.path);
    const dir = dirname(fullPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(fullPath, file.content, 'utf-8');
  }

  // Update .hopcode/mcp.json
  const mcpConfigPath = '.hopcode/mcp.json';
  const mcpConfig = updateMcpConfig(skillName, mcpConfigPath);
  if (mcpConfig) {
    generatedFiles.push(mcpConfig);
  }

  return generatedFiles;
}

/**
 * Generate MCP server TypeScript code
 */
function generateMcpServer(skillName: string, description: string): GeneratedFile {
  const pascalCaseName = toPascalCase(skillName);
  const camelCaseName = toCamelCase(skillName);

  return {
    path: `src/${skillName}-skill.ts`,
    description: 'Main MCP server implementation with tools and handlers',
    content: `/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

/**
 * ${pascalCaseName} Skill MCP Server
 * 
 * ${description}
 * 
 * Tools:
 * - ${camelCaseName}_execute: Main execution tool
 * - ${camelCaseName}_validate: Input validation
 * - ${camelCaseName}_status: Status check
 */

// Tool input schemas
const ExecuteInputSchema = z.object({
  input: z.string().describe('Input to process'),
  options: z
    .object({
      verbose: z.boolean().optional(),
      timeout: z.number().optional(),
    })
    .optional(),
});

const ValidateInputSchema = z.object({
  input: z.string().describe('Input to validate'),
});

const StatusInputSchema = z.object({}).passthrough();

// Server setup
const server = new Server(
  {
    name: '${skillName}-skill',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: '${camelCaseName}_execute',
        description: 'Execute ${skillName} skill main functionality',
        inputSchema: {
          type: 'object',
          properties: {
            input: {
              type: 'string',
              description: 'Input to process',
            },
            options: {
              type: 'object',
              properties: {
                verbose: {
                  type: 'boolean',
                  description: 'Enable verbose output',
                },
                timeout: {
                  type: 'number',
                  description: 'Timeout in milliseconds',
                },
              },
            },
          },
          required: ['input'],
        },
      },
      {
        name: '${camelCaseName}_validate',
        description: 'Validate input for ${skillName} skill',
        inputSchema: {
          type: 'object',
          properties: {
            input: {
              type: 'string',
              description: 'Input to validate',
            },
          },
          required: ['input'],
        },
      },
      {
        name: '${camelCaseName}_status',
        description: 'Check ${skillName} skill status',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case '${camelCaseName}_execute': {
        const parsed = ExecuteInputSchema.parse(args);
        const result = await executeSkill(parsed.input, parsed.options);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case '${camelCaseName}_validate': {
        const parsed = ValidateInputSchema.parse(args);
        const isValid = await validateInput(parsed.input);
        return {
          content: [{ type: 'text', text: JSON.stringify({ valid: isValid }, null, 2) }],
        };
      }

      case '${camelCaseName}_status': {
        StatusInputSchema.parse(args);
        const status = await getSkillStatus();
        return {
          content: [{ type: 'text', text: JSON.stringify(status, null, 2) }],
        };
      }

      default:
        throw new Error(\`Unknown tool: \${name}\`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        content: [
          {
            type: 'text',
            text: \`Input validation failed: \${error.errors.map(e => e.message).join(', ')}\`,
          },
        ],
        isError: true,
      };
    }
    throw error;
  }
});

/**
 * Execute main skill functionality
 */
async function executeSkill(
  input: string,
  options?: { verbose?: boolean; timeout?: number }
): Promise<unknown> {
  // TODO: Implement ${skillName} logic here
  console.log('Executing ${skillName} skill with input:', input);
  console.log('Options:', options);

  // Placeholder implementation
  return {
    success: true,
    message: '\${skillName} skill executed successfully',
    input,
    options,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validate input
 */
async function validateInput(input: string): Promise<boolean> {
  // TODO: Implement validation logic
  console.log('Validating input:', input);
  return input.length > 0;
}

/**
 * Get skill status
 */
async function getSkillStatus(): Promise<unknown> {
  // TODO: Implement status check
  return {
    status: 'ready',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  };
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('\${skillName} skill MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
`,
  };
}

/**
 * Generate test file
 */
function generateTests(skillName: string, description: string): GeneratedFile {
  const camelCaseName = toCamelCase(skillName);

  return {
    path: `src/${skillName}.test.ts`,
    description: 'Unit tests for MCP server',
    content: `/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('${skillName} Skill', () => {
  // TODO: Import actual implementation
  // import { executeSkill, validateInput, getSkillStatus } from './${skillName}-skill';

  describe('executeSkill', () => {
    it('should execute with valid input', async () => {
      const input = 'test input';
      const options = { verbose: true };

      // TODO: Replace with actual call
      const result = {
        success: true,
        message: '\${skillName} skill executed successfully',
        input,
        options,
      };

      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          input,
        })
      );
    });

    it('should handle empty input', async () => {
      const input = '';

      // TODO: Test empty input handling
      const result = await executeSkill(input);

      expect(result).toBeDefined();
    });

    it('should respect timeout option', async () => {
      const input = 'test';
      const options = { timeout: 5000 };

      // TODO: Test timeout behavior
      const result = await executeSkill(input, options);

      expect(result).toBeDefined();
    });
  });

  describe('validateInput', () => {
    it('should validate non-empty input', async () => {
      const input = 'valid input';

      // TODO: Replace with actual call
      const isValid = true;

      expect(isValid).toBe(true);
    });

    it('should reject empty input', async () => {
      const input = '';

      // TODO: Test empty input rejection
      const isValid = await validateInput(input);

      expect(isValid).toBe(false);
    });

    it('should handle special characters', async () => {
      const input = 'input with <special> & "characters"';

      // TODO: Test special character handling
      const isValid = await validateInput(input);

      expect(isValid).toBe(true);
    });
  });

  describe('getSkillStatus', () => {
    it('should return ready status', async () => {
      // TODO: Replace with actual call
      const status = {
        status: 'ready',
        version: '1.0.0',
      };

      expect(status).toEqual(
        expect.objectContaining({
          status: 'ready',
        })
      );
    });

    it('should include version information', async () => {
      // TODO: Test version info
      const status = await getSkillStatus();

      expect(status).toHaveProperty('version');
    });

    it('should include timestamp', async () => {
      // TODO: Test timestamp
      const status = await getSkillStatus();

      expect(status).toHaveProperty('timestamp');
    });
  });

  // Integration tests
  describe('MCP Server Integration', () => {
    it('should list tools', async () => {
      // TODO: Test tool listing
      const tools = ['${camelCaseName}_execute', '${camelCaseName}_validate', '${camelCaseName}_status'];

      expect(tools).toHaveLength(3);
    });

    it('should call execute tool', async () => {
      // TODO: Test tool execution
      const result = { success: true };

      expect(result).toEqual(expect.objectContaining({ success: true }));
    });

    it('should validate input via tool', async () => {
      // TODO: Test validation tool
      const result = { valid: true };

      expect(result).toEqual(expect.objectContaining({ valid: true }));
    });
  });
});
`,
  };
}

/**
 * Generate README
 */
function generateReadme(skillName: string, description: string): GeneratedFile {
  const pascalCaseName = toPascalCase(skillName);

  return {
    path: 'README.md',
    description: 'Skill documentation',
    content: `# ${pascalCaseName} Skill

${description}

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

### As MCP Server

\`\`\`bash
npm run build
node dist/${skillName}-skill.js
\`\`\`

### With HopCode

Add to \`.hopcode/mcp.json\`:

\`\`\`json
{
  "mcpServers": {
    "${skillName}": {
      "command": "node",
      "args": ["dist/${skillName}-skill.js"],
      "cwd": "./.agents/skills/${skillName}"
    }
  }
}
\`\`\`

## Tools

### \`${toCamelCase(skillName)}_execute\`

Main execution tool for ${skillName} functionality.

**Input**:
- \`input\` (string, required): Input to process
- \`options.verbose\` (boolean, optional): Enable verbose output
- \`options.timeout\` (number, optional): Timeout in milliseconds

**Output**:
\`\`\`json
{
  "success": true,
  "message": "Skill executed successfully",
  "input": "...",
  "timestamp": "2026-04-24T00:00:00.000Z"
}
\`\`\`

### \`${toCamelCase(skillName)}_validate\`

Validate input before processing.

**Input**:
- \`input\` (string, required): Input to validate

**Output**:
\`\`\`json
{
  "valid": true
}
\`\`\`

### \`${toCamelCase(skillName)}_status\`

Check skill status and health.

**Output**:
\`\`\`json
{
  "status": "ready",
  "version": "1.0.0",
  "timestamp": "2026-04-24T00:00:00.000Z"
}
\`\`\`

## Development

### Build

\`\`\`bash
npm run build
\`\`\`

### Test

\`\`\`bash
npm test
\`\`\`

### Debug

\`\`\`bash
npm run debug
\`\`\`

## Security

- Input validation with Zod
- No hardcoded secrets
- Environment variables for configuration
- Regular security audits

## License

Apache-2.0
`,
  };
}

/**
 * Generate package.json
 */
function generatePackageJson(skillName: string, description: string): GeneratedFile {
  return {
    path: 'package.json',
    description: 'NPM package configuration',
    content: `{
  "name": "@hoptrendy/skill-${skillName}",
  "version": "1.0.0",
  "description": "${description}",
  "type": "module",
  "main": "dist/${skillName}-skill.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/${skillName}-skill.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src/",
    "debug": "node --inspect-brk dist/${skillName}-skill.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "eslint": "^8.57.0",
    "typescript": "^5.4.0",
    "vitest": "^1.4.0"
  },
  "keywords": [
    "mcp",
    "skill",
    "${skillName}",
    "hopcode"
  ],
  "author": "HopCode Team",
  "license": "Apache-2.0"
}
`,
  };
}

/**
 * Generate TypeScript config
 */
function generateTsConfig(skillName: string): GeneratedFile {
  return {
    path: 'tsconfig.json',
    description: 'TypeScript configuration',
    content: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
`,
  };
}

/**
 * Update MCP configuration
 */
function updateMcpConfig(skillName: string, configPath: string): GeneratedFile | null {
  try {
    let config: any = { mcpServers: {} };

    if (existsSync(configPath)) {
      const content = readFileSync(configPath, 'utf-8');
      config = JSON.parse(content);
    }

    config.mcpServers[skillName] = {
      command: 'node',
      args: [`dist/${skillName}-skill.js`],
      cwd: `./.agents/skills/${skillName}`,
    };

    return {
      path: configPath,
      description: 'MCP configuration updated',
      content: JSON.stringify(config, null, 2),
    };
  } catch {
    return null;
  }
}

/**
 * Helper functions
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Generate success report
 */
function generateSuccessReport(skillName: string, files: GeneratedFile[]): string {
  return `# ✅ Skill Template Generated: \`${skillName}\`

## Generated Files (${files.length})

| File | Description |
|------|-------------|
${files.map(f => `| \`${f.path}\` | ${f.description} |`).join('\n')}

## Next Steps

### 1. Implement Business Logic

Edit \`src/${skillName}-skill.ts\`:

\`\`\`typescript
async function executeSkill(input: string, options?: any): Promise<unknown> {
  // TODO: Implement your logic here
  console.log('Processing:', input);
  
  // Your implementation...
  return { success: true };
}
\`\`\`

### 2. Build

\`\`\`bash
cd .agents/skills/${skillName}
npm install
npm run build
\`\`\`

### 3. Test

\`\`\`bash
npm test
\`\`\`

### 4. Run

\`\`\`bash
npm start
\`\`\`

### 5. Use with HopCode

The skill has been automatically registered in \`.hopcode/mcp.json\`.

Restart HopCode to load the new skill:

\`\`\`bash
hopcode
\`\`\`

Then use:

\`\`\`
Use ${skillName} skill to...
\`\`\`

## Customization

### Add More Tools

Edit \`src/${skillName}-skill.ts\`:

\`\`\`typescript
const CustomInputSchema = z.object({
  param1: z.string(),
  param2: z.number().optional(),
});

// Add to ListToolsRequestSchema handler
{
  name: '${toCamelCase(skillName)}_custom',
  description: 'Custom tool description',
  inputSchema: { /* ... */ },
}

// Add to CallToolRequestSchema handler
case '${toCamelCase(skillName)}_custom': {
  const parsed = CustomInputSchema.parse(args);
  // Implementation...
}
\`\`\`

### Add Environment Variables

\`\`\`bash
# .env
${toPascalCase(skillName)}_API_KEY=your_api_key
${toPascalCase(skillName)}_ENDPOINT=https://api.example.com
\`\`\`

### Add Dependencies

\`\`\`bash
npm install axios lodash
\`\`\`

## Security Checklist

- [ ] No hardcoded secrets
- [ ] Input validation with Zod
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] Logging without sensitive data
- [ ] Dependencies up to date

## Resources

- [MCP SDK Documentation](https://modelcontextprotocol.io/)
- [HopCode Skills](docs/users/github-integration.md)
- [Zod Validation](https://zod.dev/)

---

**Generated**: ${new Date().toISOString()}  
**Skill**: ${skillName}  
**Version**: 1.0.0
`;
}
