/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand , CommandKind, type MessageActionReturn } from './types.js';

/** Maximum search results shown per query. */
const MAX_DISPLAY_RESULTS = 20;

function makeInfo(content: string): MessageActionReturn {
  return { type: 'message', messageType: 'info', content };
}

function makeError(content: string): MessageActionReturn {
  return { type: 'message', messageType: 'error', content };
}

export const historyCommand: SlashCommand = {
  name: 'history',
  altNames: ['hist'],
  kind: CommandKind.BUILT_IN,
  supportedModes: ['interactive'] as const,
  description: 'Navigate and search session history',
  argumentHint: 'search <query> | older | newer | info | jump <n>',
  examples: [
    '/history search fix the bug',
    '/history older',
    '/history newer',
    '/history info',
    '/history jump 1500',
  ],
  subCommands: [
    {
      name: 'search',
      altNames: ['find', 'grep'],
      kind: CommandKind.BUILT_IN,
      supportedModes: ['interactive'] as const,
      description: 'Full-text search across all history items (entire session)',
      argumentHint: '<query>',
      action(context, args) {
        const query = args.trim();
        if (!query) return makeError('Usage: /history search <query>');

        const searchFn = context.ui.searchHistory;
        if (!searchFn) {
          return makeError('Search is not available in this context.');
        }

        const results = searchFn(query);
        if (results.length === 0) {
          return makeInfo(`No matches found for: "${query}"`);
        }

        const shown = results.slice(0, MAX_DISPLAY_RESULTS);
        const lines: string[] = [
          `Found ${results.length} match${results.length === 1 ? '' : 'es'} for "${query}"` +
            (results.length > MAX_DISPLAY_RESULTS
              ? ` (showing first ${MAX_DISPLAY_RESULTS})`
              : '') +
            ':',
          '',
        ];

        for (const r of shown) {
          lines.push(
            `  [#${r.globalIndex}] (${r.item.type}) ${r.matchExcerpt}`,
          );
        }

        lines.push('');
        lines.push('Use /history jump <n> to navigate to a result by index.');

        return makeInfo(lines.join('\n'));
      },
    },
    {
      name: 'older',
      altNames: ['up', 'prev'],
      kind: CommandKind.BUILT_IN,
      supportedModes: ['interactive'] as const,
      description: 'Load the previous 2 000 history items',
      action(context) {
        if (!context.ui.canLoadOlderHistory) {
          return makeInfo('You are already at the beginning of the history.');
        }
        context.ui.loadOlderHistory?.();
        const info = context.ui.windowInfo;
        if (info) {
          return makeInfo(
            `Showing items ${info.windowStart}–${info.windowEnd} of ${info.total}.` +
              (info.hasOlder ? ' Use /history older to go further back.' : ''),
          );
        }
        return undefined;
      },
    },
    {
      name: 'newer',
      altNames: ['down', 'next'],
      kind: CommandKind.BUILT_IN,
      supportedModes: ['interactive'] as const,
      description: 'Load the next 2 000 history items',
      action(context) {
        if (!context.ui.canLoadNewerHistory) {
          return makeInfo('You are already at the most recent history.');
        }
        context.ui.loadNewerHistory?.();
        const info = context.ui.windowInfo;
        if (info) {
          return makeInfo(
            `Showing items ${info.windowStart}–${info.windowEnd} of ${info.total}.` +
              (info.hasNewer
                ? ' Use /history newer to go forward.'
                : ' This is the latest window.'),
          );
        }
        return undefined;
      },
    },
    {
      name: 'info',
      altNames: ['status'],
      kind: CommandKind.BUILT_IN,
      supportedModes: ['interactive'] as const,
      description: 'Show current history window statistics',
      action(context) {
        const info = context.ui.windowInfo;
        if (!info) return makeInfo('History info is not available.');
        const lines = [
          `History window:`,
          `  Total items : ${info.total}`,
          `  Visible     : ${info.windowStart}–${info.windowEnd}`,
          `  Has older   : ${info.hasOlder ? 'yes — use /history older' : 'no'}`,
          `  Has newer   : ${info.hasNewer ? 'yes — use /history newer' : 'no'}`,
        ];
        return makeInfo(lines.join('\n'));
      },
    },
    {
      name: 'jump',
      altNames: ['goto', 'go'],
      kind: CommandKind.BUILT_IN,
      supportedModes: ['interactive'] as const,
      description: 'Jump to a specific item index in history',
      argumentHint: '<index>',
      action(context, args) {
        const n = parseInt(args.trim(), 10);
        if (isNaN(n) || n < 0) {
          return makeError(
            'Usage: /history jump <n>  (where n is a non-negative integer)',
          );
        }
        const jumpFn = context.ui.jumpToSearchResult;
        if (!jumpFn) return makeError('Jump is not available in this context.');
        jumpFn(n);
        const info = context.ui.windowInfo;
        if (info) {
          return makeInfo(
            `Jumped to index ${n}. Showing items ${info.windowStart}–${info.windowEnd} of ${info.total}.`,
          );
        }
        return undefined;
      },
    },
  ],
  // Top-level action: if called with no subcommand, show a brief help
  action(context, args) {
    const sub = args.trim().toLowerCase();
    if (!sub) {
      const info = context.ui.windowInfo;
      const totalStr = info ? ` (${info.total} total items)` : '';
      return makeInfo(
        `History management${totalStr}\n\n` +
          '  /history search <query>  – full-text search across entire history\n' +
          '  /history older           – load previous 2 000 items\n' +
          '  /history newer           – load next 2 000 items\n' +
          '  /history info            – show window statistics\n' +
          '  /history jump <n>        – jump to item by global index\n' +
          '\nAlias: /search <query> is a shortcut for /history search <query>',
      );
    }
    return undefined;
  },
};

/** Standalone /search alias — delegates to /history search for convenience. */
export const searchCommand: SlashCommand = {
  name: 'search',
  altNames: ['find'],
  kind: CommandKind.BUILT_IN,
  supportedModes: ['interactive'] as const,
  description: 'Full-text search across all history items',
  argumentHint: '<query>',
  examples: ['/search fix the bug', '/search OOM', '/search ollama'],
  action(context, args) {
    const query = args.trim();
    if (!query) return makeError('Usage: /search <query>');

    const searchFn = context.ui.searchHistory;
    if (!searchFn) return makeError('Search is not available in this context.');

    const results = searchFn(query);
    if (results.length === 0) {
      return makeInfo(`No matches found for: "${query}"`);
    }

    const shown = results.slice(0, MAX_DISPLAY_RESULTS);
    const lines: string[] = [
      `Found ${results.length} match${results.length === 1 ? '' : 'es'} for "${query}"` +
        (results.length > MAX_DISPLAY_RESULTS
          ? ` (showing first ${MAX_DISPLAY_RESULTS})`
          : '') +
        ':',
      '',
    ];

    for (const r of shown) {
      lines.push(`  [#${r.globalIndex}] (${r.item.type}) ${r.matchExcerpt}`);
    }

    lines.push('');
    lines.push('Use /history jump <n> to navigate to a result by index.');
    return makeInfo(lines.join('\n'));
  },
};
