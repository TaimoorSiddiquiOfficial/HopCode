/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ToolInvocation, ToolResult } from './tools.js';
import { BaseDeclarativeTool, BaseToolInvocation, Kind } from './tools.js';
import { ToolNames, ToolDisplayNames } from './tool-names.js';
import type { Config } from '../config/config.js';
import * as path from 'node:path';
import * as os from 'node:os';
import * as fs from 'node:fs/promises';

// --- Types ---

export const BROWSER_ACTIONS = [
  'navigate',
  'click',
  'fill',
  'screenshot',
  'snapshot',
  'wait',
  'close',
] as const;

export type BrowserAction = (typeof BROWSER_ACTIONS)[number];

export interface BrowserToolParams {
  /** The action to perform */
  action: BrowserAction;
  /** URL for navigate action */
  url?: string;
  /** CSS selector for click/fill/wait actions */
  selector?: string;
  /** Text value for fill action */
  value?: string;
  /** Session ID (returned by previous navigate call, or omit for first call) */
  sessionId?: string;
  /** Run browser in headed mode (default: false / headless) */
  headed?: boolean;
}

interface BrowserSession {
  browser: unknown; // Browser from 'playwright' (dynamic import)
  context: unknown; // BrowserContext
  page: unknown; // Page
  headless: boolean;
}

// --- Browser Session Store ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlaywrightPage = any;

const sessions = new Map<string, BrowserSession>();

async function getPlaywright(): Promise<typeof import('playwright')> {
  return import('playwright');
}

function pageOf(session: BrowserSession): PlaywrightPage {
  return session.page as PlaywrightPage;
}

async function getOrCreateSession(
  sessionId: string | undefined,
  headless: boolean,
): Promise<{ session: BrowserSession; id: string; isNew: boolean }> {
  if (sessionId && sessions.has(sessionId)) {
    return { session: sessions.get(sessionId)!, id: sessionId, isNew: false };
  }

  const { chromium } = await getPlaywright();
  const browser = await chromium.launch({ headless });
  const context = await browser.newContext();
  const page = await context.newPage();
  const id = `browser-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const session: BrowserSession = { browser, context, page, headless };
  sessions.set(id, session);
  return { session, id, isNew: true };
}

// --- Tool Implementation ---

class BrowserToolInvocation extends BaseToolInvocation<
  BrowserToolParams,
  ToolResult
> {
  constructor(config: Config, params: BrowserToolParams) {
    super(params);
    void config; // Retained for tool pattern consistency; future actions may use projectRoot
  }

  getDescription(): string {
    const parts: string[] = [];
    switch (this.params.action) {
      case 'navigate':
        parts.push(`navigate to ${this.params.url ?? '(no url)'}`);
        break;
      case 'click':
        parts.push(`click ${this.params.selector ?? '(no selector)'}`);
        break;
      case 'fill':
        parts.push(
          `fill ${this.params.selector ?? '(no selector)'} with "${this.params.value ?? ''}"`,
        );
        break;
      case 'screenshot':
        parts.push('take screenshot');
        break;
      case 'snapshot':
        parts.push('get accessibility snapshot');
        break;
      case 'wait':
        parts.push(`wait for ${this.params.selector ?? '(no selector)'}`);
        break;
      case 'close':
        parts.push('close browser session');
        break;
      default:
        parts.push(`browser: ${this.params.action}`);
        break;
    }
    if (this.params.headed) parts.push('(headed)');
    return parts.join(' ');
  }

  async execute(_signal: AbortSignal): Promise<ToolResult> {
    try {
      const result = await this._executeAction();
      return result;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unknown browser error';
      return {
        llmContent: `Browser error: ${message}`,
        returnDisplay: `Browser error: ${message}`,
        error: {
          message,
        },
      };
    }
  }

  private async _executeAction(): Promise<ToolResult> {
    const { action, url, selector, value, sessionId, headed } = this.params;
    const headless = !headed;

    // Close action: shut down existing session
    if (action === 'close') {
      if (!sessionId || !sessions.has(sessionId)) {
        return {
          llmContent: 'No active browser session to close.',
          returnDisplay: 'No active browser session to close.',
        };
      }
      const session = sessions.get(sessionId)!;
      await (session.browser as PlaywrightPage).close();
      sessions.delete(sessionId);
      return {
        llmContent: `Browser session ${sessionId} closed.`,
        returnDisplay: `Browser session ${sessionId} closed.`,
      };
    }

    // All other actions: get or create session
    const { session, id, isNew } = await getOrCreateSession(
      sessionId,
      headless,
    );

    switch (action) {
      case 'navigate': {
        if (!url) {
          return {
            llmContent: 'Error: url parameter is required for navigate action.',
            returnDisplay: 'Error: url parameter is required for navigate.',
          };
        }
        await pageOf(session).goto(url, { waitUntil: 'domcontentloaded' });
        const navUrl = pageOf(session).url();

        // Take a text snapshot after navigation for context
        let snapshotText = '';
        try {
          snapshotText = await pageOf(session).evaluate(() =>
            document.body ? document.body.innerText.slice(0, 5000) : '',
          );
        } catch {
          // Snapshot may fail on some pages
        }

        const summary = `Navigated to ${navUrl}${isNew ? `\nSession ID: ${id}` : `\nSession ID: ${id} (existing)`}${snapshotText ? `\n\nPage structure:\n${snapshotText.slice(0, 3000)}` : ''}`;
        return {
          llmContent: summary,
          returnDisplay: summary,
        };
      }

      case 'click': {
        if (!selector) {
          return {
            llmContent: 'Error: selector parameter is required for click.',
            returnDisplay: 'Error: selector parameter is required for click.',
          };
        }
        await pageOf(session).click(selector);
        const newUrl = pageOf(session).url();
        return {
          llmContent: `Clicked ${selector}. Current URL: ${newUrl}`,
          returnDisplay: `Clicked ${selector}. Current URL: ${newUrl}`,
        };
      }

      case 'fill': {
        if (!selector || value === undefined) {
          return {
            llmContent:
              'Error: selector and value parameters are required for fill.',
            returnDisplay:
              'Error: selector and value parameters are required for fill.',
          };
        }
        await pageOf(session).fill(selector, value);
        return {
          llmContent: `Filled ${selector} with "${value}".`,
          returnDisplay: `Filled ${selector} with "${value}".`,
        };
      }

      case 'screenshot': {
        const tmpDir = os.tmpdir();
        const screenshotPath = path.join(
          tmpDir,
          `hopcode-browser-${Date.now()}.png`,
        );
        await pageOf(session).screenshot({
          path: screenshotPath,
          fullPage: true,
        });
        const stats = await fs.stat(screenshotPath);
        const sizeKb = Math.round(stats.size / 1024);
        return {
          llmContent: `Screenshot saved to: ${screenshotPath} (${sizeKb} KB)`,
          returnDisplay: `Screenshot saved to: ${screenshotPath} (${sizeKb} KB)`,
        };
      }

      case 'snapshot': {
        const text = await pageOf(session).evaluate(() =>
          document.body ? document.body.innerText : '',
        );
        if (!text.trim()) {
          return {
            llmContent: 'No text content found on this page.',
            returnDisplay: 'No text content found.',
          };
        }
        return {
          llmContent: `Page text content:\n${text.slice(0, 5000)}`,
          returnDisplay: text.slice(0, 5000),
        };
      }

      case 'wait': {
        if (!selector) {
          return {
            llmContent: 'Error: selector parameter is required for wait.',
            returnDisplay: 'Error: selector parameter is required for wait.',
          };
        }
        await pageOf(session).waitForSelector(selector, { timeout: 10000 });
        return {
          llmContent: `Element ${selector} is now visible.`,
          returnDisplay: `Element ${selector} is now visible.`,
        };
      }

      default: {
        return {
          llmContent: `Unknown action: ${action}`,
          returnDisplay: `Unknown action: ${action}`,
        };
      }
    }
  }
}

// --- Tool Class ---

/**
 * BrowserTool -- automate web browser interactions via Playwright.
 *
 * Supports navigate, click, fill, screenshot, snapshot, and wait actions.
 * Sessions are automatically created on first navigate and persist across
 * calls via sessionId. Close the session with the 'close' action.
 */
export class BrowserTool extends BaseDeclarativeTool<
  BrowserToolParams,
  ToolResult
> {
  static readonly Name = ToolNames.BROWSER;

  constructor(private readonly config: Config) {
    super(
      BrowserTool.Name,
      ToolDisplayNames.BROWSER,
      'Automate a headless web browser via Playwright. ' +
        'Actions: navigate (go to a URL), click (click an element by CSS selector), ' +
        'fill (type text into an input), screenshot (save a full-page PNG), ' +
        'snapshot (get the accessibility tree as text), wait (wait for an element to appear), ' +
        'close (end the browser session). ' +
        'The first navigate call returns a sessionId -- pass it in subsequent calls to reuse the same browser session.',
      Kind.Fetch,
      {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            description:
              'The action to perform: navigate, click, fill, screenshot, snapshot, wait, or close.',
            enum: [...BROWSER_ACTIONS],
          },
          url: {
            type: 'string',
            description: 'URL to navigate to (required for navigate action).',
          },
          selector: {
            type: 'string',
            description:
              'CSS selector for the target element (required for click, fill, wait).',
          },
          value: {
            type: 'string',
            description: 'Text to type (required for fill action).',
          },
          sessionId: {
            type: 'string',
            description:
              'Session ID from a previous navigate call. Omit for a new session.',
          },
          headed: {
            type: 'boolean',
            description:
              'Run browser in headed (visible) mode. Default: false (headless).',
          },
        },
        required: ['action'],
      },
    );
  }

  protected createInvocation(
    params: BrowserToolParams,
  ): ToolInvocation<BrowserToolParams, ToolResult> {
    return new BrowserToolInvocation(this.config, params);
  }
}
