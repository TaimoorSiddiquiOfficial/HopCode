/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * `hopcode skills` command
 *
 * Manages skills at the user and project level.
 *
 * Sub-commands:
 *   hopcode skills list                  — list all skills grouped by level
 *   hopcode skills show <name>           — show SKILL.md content + metadata
 *   hopcode skills add <url|path>        — install skill to ~/.hopcode/skills/<name>/
 *   hopcode skills remove <name>         — remove a user-level skill
 */

import type { CommandModule, Argv } from 'yargs';
import * as fs from 'node:fs/promises';
import * as fsSync from 'node:fs';
import * as path from 'node:path';
import { homedir } from 'node:os';
import { writeStdoutLine, writeStderrLine } from '../utils/stdioHelpers.js';
import { t } from '../i18n/index.js';

// ── Constants ────────────────────────────────────────────────────────────────

const HOPCODE_DIR = '.hopcode';
const SKILLS_SUBDIR = 'skills';
const SKILL_FILE = 'SKILL.md';

function userSkillsDir(): string {
  return path.join(homedir(), HOPCODE_DIR, SKILLS_SUBDIR);
}

function projectSkillsDir(): string {
  return path.join(process.cwd(), HOPCODE_DIR, SKILLS_SUBDIR);
}

// ── Skill discovery ──────────────────────────────────────────────────────────

interface SkillEntry {
  name: string;
  description: string;
  level: 'user' | 'project';
  filePath: string;
}

async function readSkillsFromDir(
  dir: string,
  level: 'user' | 'project',
): Promise<SkillEntry[]> {
  if (!fsSync.existsSync(dir)) return [];

  const entries: SkillEntry[] = [];
  let subdirs: string[];

  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    subdirs = items.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }

  for (const name of subdirs) {
    const skillFile = path.join(dir, name, SKILL_FILE);
    if (!fsSync.existsSync(skillFile)) continue;

    try {
      const content = await fs.readFile(skillFile, 'utf8');
      const description = extractDescription(content);
      entries.push({ name, description, level, filePath: skillFile });
    } catch {
      // skip unreadable skills
    }
  }

  return entries;
}

/** Extract the `description` field from YAML frontmatter. */
function extractDescription(content: string): string {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return '(no description)';
  const descMatch = match[1].match(/^description:\s*(.+)$/m);
  return descMatch ? descMatch[1].trim() : '(no description)';
}

async function listAllSkills(): Promise<SkillEntry[]> {
  const [userSkills, projectSkills] = await Promise.all([
    readSkillsFromDir(userSkillsDir(), 'user'),
    readSkillsFromDir(projectSkillsDir(), 'project'),
  ]);
  return [...projectSkills, ...userSkills];
}

// ── list sub-command ─────────────────────────────────────────────────────────

const listCommand: CommandModule = {
  command: 'list',
  describe: t('List all installed skills (user and project level)'),
  handler: async () => {
    const skills = await listAllSkills();

    if (skills.length === 0) {
      writeStdoutLine(t('\n  No user or project skills installed.\n'));
      writeStdoutLine(
        t(
          '  Bundled skills (batch, loop, qc-helper, review, spec-driven, git-workflow,\n' +
            '  codebase-map, changelog, mcp-builder) are available as /slash commands.\n',
        ),
      );
      writeStdoutLine(
        t('  Add a skill: hopcode skills add <github-url | local-path>\n'),
      );
      return;
    }

    const projectOnes = skills.filter((s) => s.level === 'project');
    const userOnes = skills.filter((s) => s.level === 'user');

    if (projectOnes.length > 0) {
      writeStdoutLine(
        t('\n  ── Project skills (.hopcode/skills/) ──────────────'),
      );
      for (const s of projectOnes) {
        writeStdoutLine(`  ${s.name.padEnd(24)} ${s.description}`);
      }
    }

    if (userOnes.length > 0) {
      writeStdoutLine(
        t('\n  ── User skills (~/.hopcode/skills/) ───────────────'),
      );
      for (const s of userOnes) {
        writeStdoutLine(`  ${s.name.padEnd(24)} ${s.description}`);
      }
    }

    writeStdoutLine('');
    writeStdoutLine(
      t(
        '  Bundled skills are available as /slash commands (use /skills to list them).\n',
      ),
    );
  },
};

// ── show sub-command ─────────────────────────────────────────────────────────

interface ShowArgs {
  name: string;
}

const showCommand: CommandModule<Record<string, unknown>, ShowArgs> = {
  command: 'show <name>',
  describe: t('Show SKILL.md content and metadata for a skill'),
  builder: (yargs: Argv) =>
    yargs.positional('name', {
      type: 'string',
      description: t('Skill name to show'),
      demandOption: true,
    }) as Argv<ShowArgs>,
  handler: async (argv: ShowArgs) => {
    const skills = await listAllSkills();
    const skill = skills.find((s) => s.name === argv.name);

    if (!skill) {
      writeStderrLine(
        t(
          `Skill "{{name}}" not found in user or project skills.\n` +
            `  Run: hopcode skills list`,
          { name: argv.name },
        ),
      );
      process.exit(1);
    }

    const content = await fs.readFile(skill.filePath, 'utf8');
    writeStdoutLine(
      `\n  Name:  ${skill.name}\n  Level: ${skill.level}\n  Path:  ${skill.filePath}\n`,
    );
    writeStdoutLine('─'.repeat(60));
    writeStdoutLine(content);
  },
};

// ── add sub-command ──────────────────────────────────────────────────────────

interface AddArgs {
  source: string;
}

/** Detect if a string looks like a GitHub repo URL or raw URL. */
function isGithubUrl(source: string): boolean {
  return source.startsWith('https://') || source.startsWith('http://');
}

/** Convert a GitHub blob URL to a raw content URL. */
function toRawUrl(url: string): string {
  return url
    .replace('github.com', 'raw.githubusercontent.com')
    .replace('/blob/', '/');
}

/** Infer skill name from a URL or local path. */
function inferSkillName(source: string): string {
  const normalized = source.replace(/\\/g, '/').replace(/\/$/, '');
  const parts = normalized.split('/');
  // If the last segment is SKILL.md, use the parent directory name
  const last = parts[parts.length - 1];
  if (last.toUpperCase() === 'SKILL.MD') {
    return parts[parts.length - 2] ?? 'custom-skill';
  }
  return last ?? 'custom-skill';
}

const addCommand: CommandModule<Record<string, unknown>, AddArgs> = {
  command: 'add <source>',
  describe: t(
    'Install a skill from a GitHub URL or local path to ~/.hopcode/skills/<name>/',
  ),
  builder: (yargs: Argv) =>
    yargs.positional('source', {
      type: 'string',
      description: t(
        'GitHub raw URL or local path to a SKILL.md file or skill directory',
      ),
      demandOption: true,
    }) as Argv<AddArgs>,
  handler: async (argv: AddArgs) => {
    const source = argv.source;
    const skillName = inferSkillName(source);
    const targetDir = path.join(userSkillsDir(), skillName);
    const targetFile = path.join(targetDir, SKILL_FILE);

    let content: string;

    if (isGithubUrl(source)) {
      // Fetch from URL
      const rawUrl = source.includes('SKILL.md')
        ? toRawUrl(source)
        : toRawUrl(
            source.endsWith('/') ? `${source}SKILL.md` : `${source}/SKILL.md`,
          );

      writeStdoutLine(t(`\n  Fetching skill from: ${rawUrl}\n`));

      try {
        const response = await fetch(rawUrl);
        if (!response.ok) {
          writeStderrLine(
            t(
              `Failed to fetch skill: HTTP ${response.status} ${response.statusText}`,
            ),
          );
          process.exit(1);
        }
        content = await response.text();
      } catch (err: unknown) {
        writeStderrLine(
          t(
            `Network error: ${err instanceof Error ? err.message : String(err)}`,
          ),
        );
        process.exit(1);
      }
    } else {
      // Local path
      const localPath = path.resolve(source);
      const isDir =
        fsSync.existsSync(localPath) &&
        fsSync.lstatSync(localPath).isDirectory();
      const skillFilePath = isDir
        ? path.join(localPath, SKILL_FILE)
        : localPath;

      if (!fsSync.existsSync(skillFilePath)) {
        writeStderrLine(t(`SKILL.md not found at: ${skillFilePath}`));
        process.exit(1);
      }

      content = await fs.readFile(skillFilePath, 'utf8');
    }

    // Validate minimal SKILL.md structure
    if (!content.includes('---')) {
      writeStderrLine(
        t(
          'Invalid SKILL.md: missing YAML frontmatter (expected --- delimiters).',
        ),
      );
      process.exit(1);
    }

    // Write to user skills dir
    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(targetFile, content, 'utf8');

    writeStdoutLine(
      t(`\n  ✓ Skill "${skillName}" installed to: ${targetFile}`),
    );
    writeStdoutLine(
      t('  Restart HopCode for the skill to appear as a /slash command.\n'),
    );
  },
};

// ── remove sub-command ───────────────────────────────────────────────────────

interface RemoveArgs {
  name: string;
}

const removeCommand: CommandModule<Record<string, unknown>, RemoveArgs> = {
  command: 'remove <name>',
  describe: t('Remove a user-level skill from ~/.hopcode/skills/<name>/'),
  builder: (yargs: Argv) =>
    yargs.positional('name', {
      type: 'string',
      description: t('Skill name to remove'),
      demandOption: true,
    }) as Argv<RemoveArgs>,
  handler: async (argv: RemoveArgs) => {
    const targetDir = path.join(userSkillsDir(), argv.name);

    if (!fsSync.existsSync(targetDir)) {
      writeStderrLine(
        t(
          `Skill "${argv.name}" not found in user skills (${userSkillsDir()}).\n` +
            `  Run: hopcode skills list`,
        ),
      );
      process.exit(1);
    }

    await fs.rm(targetDir, { recursive: true, force: true });
    writeStdoutLine(
      t(`\n  ✓ Skill "${argv.name}" removed from user skills.\n`),
    );
  },
};

// ── Root command ─────────────────────────────────────────────────────────────

export const skillsCommand: CommandModule = {
  command: 'skills',
  describe: t('Manage skills (list, show, add from GitHub/local, remove)'),
  builder: (yargs: Argv) =>
    yargs
      .command(listCommand)
      .command(showCommand as CommandModule)
      .command(addCommand as CommandModule)
      .command(removeCommand as CommandModule)
      .demandCommand(
        1,
        'You need at least one sub-command. Try: hopcode skills list',
      )
      .version(false),
  handler: () => {
    // yargs shows help via demandCommand(1)
  },
};
