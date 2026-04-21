/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// hopcode mcp presets — list curated MCP servers with ready-to-use add commands
import type { CommandModule } from 'yargs';
import { writeStdoutLine } from '../../utils/stdioHelpers.js';

interface McpPreset {
  name: string;
  description: string;
  category: string;
  command: string;
  args: string[];
  addCommand: string;
}

const PRESETS: McpPreset[] = [
  {
    name: 'bb-browser',
    description:
      'Browser automation via your real logged-in Chrome — 103 commands across 36 platforms (Twitter, Reddit, GitHub, YouTube, etc.). No API keys needed.',
    category: 'Browser',
    command: 'npx',
    args: ['-y', 'bb-browser', '--mcp'],
    addCommand: 'hopcode mcp add bb-browser npx -- -y bb-browser --mcp --trust',
  },
  {
    name: 'chrome-devtools',
    description:
      'Official Chrome DevTools MCP by the Chrome team — control and inspect a live Chrome browser for web debugging, JS evaluation, network inspection.',
    category: 'Browser',
    command: 'npx',
    args: ['-y', 'chrome-devtools-mcp'],
    addCommand: 'hopcode mcp add chrome-devtools npx -- -y chrome-devtools-mcp',
  },
  {
    name: 'github',
    description:
      'GitHub MCP — create/list issues, PRs, repos, search code, manage branches via GitHub API.',
    category: 'Developer Tools',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    addCommand:
      'hopcode mcp add github npx -- -y @modelcontextprotocol/server-github -e GITHUB_PERSONAL_ACCESS_TOKEN=<your-token>',
  },
  {
    name: 'filesystem',
    description:
      'MCP filesystem server — read, write, list files in specified directories with controlled access.',
    category: 'Storage',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '/path/to/dir'],
    addCommand:
      'hopcode mcp add filesystem npx -- -y @modelcontextprotocol/server-filesystem /path/to/dir',
  },
  {
    name: 'postgres',
    description:
      'PostgreSQL MCP — query databases, inspect schemas, run SQL with read-only safety.',
    category: 'Database',
    command: 'npx',
    args: [
      '-y',
      '@modelcontextprotocol/server-postgres',
      'postgresql://user:pass@host/db',
    ],
    addCommand:
      'hopcode mcp add postgres npx -- -y @modelcontextprotocol/server-postgres postgresql://user:pass@host/db',
  },
  {
    name: 'memory',
    description:
      'MCP memory server — persistent key-value memory across agent sessions using a local knowledge graph.',
    category: 'Memory',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-memory'],
    addCommand:
      'hopcode mcp add memory npx -- -y @modelcontextprotocol/server-memory',
  },
  {
    name: 'sequential-thinking',
    description:
      'Sequential thinking MCP — structured multi-step reasoning with backtracking for complex problem solving.',
    category: 'Reasoning',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
    addCommand:
      'hopcode mcp add sequential-thinking npx -- -y @modelcontextprotocol/server-sequential-thinking',
  },
  {
    name: 'brave-search',
    description:
      'Brave Search MCP — web and local search via Brave Search API.',
    category: 'Search',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-brave-search'],
    addCommand:
      'hopcode mcp add brave-search npx -- -y @modelcontextprotocol/server-brave-search -e BRAVE_API_KEY=<your-key>',
  },
];

export const presetsCommand: CommandModule = {
  command: 'presets',
  describe: 'List curated MCP server presets with ready-to-use add commands',
  builder: (yargs) =>
    yargs
      .option('category', {
        alias: 'c',
        describe: 'Filter by category',
        type: 'string',
      })
      .option('json', {
        describe: 'Output as JSON',
        type: 'boolean',
        default: false,
      }),
  handler: (argv) => {
    const categoryFilter = argv['category'] as string | undefined;
    const jsonOutput = argv['json'] as boolean;

    let filtered = PRESETS;
    if (categoryFilter) {
      filtered = PRESETS.filter((p) =>
        p.category.toLowerCase().includes(categoryFilter.toLowerCase()),
      );
    }

    if (jsonOutput) {
      writeStdoutLine(JSON.stringify(filtered, null, 2));
      return;
    }

    const categories = [...new Set(filtered.map((p) => p.category))];

    writeStdoutLine('');
    writeStdoutLine('🔌 Curated MCP Server Presets');
    writeStdoutLine(
      '   Run the "Add Command" to install any preset into your settings.',
    );
    writeStdoutLine('');

    for (const category of categories) {
      writeStdoutLine(`── ${category} ──────────────────────────────────`);
      const inCategory = filtered.filter((p) => p.category === category);
      for (const preset of inCategory) {
        writeStdoutLine(`  📦 ${preset.name}`);
        writeStdoutLine(`     ${preset.description}`);
        writeStdoutLine(`     Add: ${preset.addCommand}`);
        writeStdoutLine('');
      }
    }

    writeStdoutLine(
      `${filtered.length} preset${filtered.length !== 1 ? 's' : ''} available.`,
    );
    if (categoryFilter) {
      writeStdoutLine(`Filtered by category: "${categoryFilter}"`);
    }
    writeStdoutLine(
      'Tip: Use --category <name> to filter (e.g. --category browser)',
    );
    writeStdoutLine('');
  },
};
