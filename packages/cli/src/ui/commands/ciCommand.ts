/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * /ci — GitHub Actions workflow integration command.
 *
 * Sub-commands:
 *   /ci             — list latest runs for the current branch
 *   /ci logs        — show logs from the most recent failed job
 *   /ci rerun       — re-run failed jobs in the most recent run
 *   /ci cancel      — cancel the most recent in-progress run
 *   /ci dispatch <workflow> [ref] — trigger a workflow_dispatch event
 *   /ci workflows   — list all workflow files in the repo
 */

import { execSync } from 'node:child_process';
import process from 'node:process';
import type { SlashCommand, SlashCommandActionReturn } from './types.js';
import { CommandKind } from './types.js';
import { t } from '../../i18n/index.js';
import { loadGitHubToken } from '../../utils/githubTokenStore.js';
import {
  listWorkflowRuns,
  listJobsForRun,
  getJobLogs,
  rerunFailedJobs,
  cancelRun,
  dispatchWorkflow,
  listWorkflows,
  workflowRunIcon,
  formatRunDuration,
  type GHWorkflowRun,
} from '../../utils/githubApi.js';
import { getGitHubRepoInfo } from '../../utils/gitUtils.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getCurrentBranch(): string {
  try {
    return execSync('git branch --show-current', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return 'main';
  }
}

function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len - 1) + '…' : str.padEnd(len);
}

function runSummaryLine(run: GHWorkflowRun): string {
  const icon = workflowRunIcon(run);
  const name = truncate(run.name ?? 'Unknown', 28);
  const sha = run.head_sha.slice(0, 7);
  const dur =
    run.status === 'completed'
      ? formatRunDuration(run.created_at, run.updated_at)
      : run.status;
  return `${icon}  ${name}  #${run.run_number}  ${sha}  ${dur}  (${run.actor.login})`;
}

async function* listRunsStream(
  owner: string,
  repo: string,
  branch: string,
): AsyncGenerator<{ messageType: 'info' | 'error'; content: string }> {
  yield {
    messageType: 'info',
    content: `🔍 Fetching CI runs for ${owner}/${repo}@${branch}…`,
  };

  const runs = await listWorkflowRuns(owner, repo, branch, 10);

  if (!runs.length) {
    yield {
      messageType: 'info',
      content: `No workflow runs found for branch "${branch}".`,
    };
    return;
  }

  yield {
    messageType: 'info',
    content: `\n${'─'.repeat(70)}\n  CI Status — ${owner}/${repo}  branch: ${branch}\n${'─'.repeat(70)}`,
  };

  for (const run of runs) {
    yield { messageType: 'info', content: runSummaryLine(run) };
  }

  yield {
    messageType: 'info',
    content: `\nTip: /ci logs · /ci rerun · /ci cancel · /ci dispatch <workflow>`,
  };
}

async function* logsStream(
  owner: string,
  repo: string,
  branch: string,
): AsyncGenerator<{ messageType: 'info' | 'error'; content: string }> {
  yield { messageType: 'info', content: '🔍 Fetching latest failed run…' };

  const runs = await listWorkflowRuns(owner, repo, branch, 5);
  const failedRun = runs.find(
    (r) => r.status === 'completed' && r.conclusion === 'failure',
  );

  if (!failedRun) {
    yield {
      messageType: 'info',
      content: '✅ No failed runs found on this branch.',
    };
    return;
  }

  yield {
    messageType: 'info',
    content: `❌ Run #${failedRun.run_number}: ${failedRun.name} (${failedRun.head_sha.slice(0, 7)})`,
  };

  const jobs = await listJobsForRun(owner, repo, failedRun.id);
  const failedJobs = jobs.filter((j) => j.conclusion === 'failure');

  if (!failedJobs.length) {
    yield { messageType: 'info', content: 'No failed jobs found in this run.' };
    return;
  }

  for (const job of failedJobs.slice(0, 3)) {
    yield { messageType: 'info', content: `\n── Job: ${job.name} ──` };
    try {
      const logs = await getJobLogs(owner, repo, job.id);
      // Show last 60 lines to keep output manageable
      const lines = logs.split('\n');
      const tail = lines.slice(-60).join('\n');
      yield { messageType: 'info', content: tail };
    } catch (err) {
      yield {
        messageType: 'error',
        content: `Could not fetch logs: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }
}

// ── Command definition ────────────────────────────────────────────────────────

export const ciCommand: SlashCommand = {
  name: 'ci',
  get description() {
    return t(
      'Manage GitHub Actions CI: list runs, view logs, rerun, cancel, dispatch',
    );
  },
  kind: CommandKind.BUILT_IN,

  completion: async (_ctx, partialArg) => {
    const subs = ['logs', 'rerun', 'cancel', 'dispatch', 'workflows'];
    return subs
      .filter((s) => s.startsWith(partialArg))
      .map((s) => ({ value: s, description: subCommandDesc(s) }));
  },

  action: async (context): Promise<SlashCommandActionReturn> => {
    // Check token first
    const stored = loadGitHubToken();
    const token = stored?.accessToken ?? process.env['GITHUB_TOKEN'];
    if (!token) {
      return {
        type: 'message',
        messageType: 'error',
        content: t(
          'GitHub token not configured. Set GITHUB_TOKEN env var or run: hopcode github auth',
        ),
      };
    }

    // Detect repo context
    let repoInfo: { owner: string; repo: string };
    try {
      repoInfo = getGitHubRepoInfo();
    } catch {
      return {
        type: 'message',
        messageType: 'error',
        content: t('/ci must be run from a GitHub repository.'),
      };
    }

    const { owner, repo } = repoInfo;
    const branch = getCurrentBranch();
    const subCmd =
      (context.invocation?.args?.trim() ?? '').split(/\s+/)[0]?.toLowerCase() ??
      '';

    // ── /ci workflows ──────────────────────────────────────────────────────
    if (subCmd === 'workflows') {
      return {
        type: 'stream_messages',
        messages: (async function* () {
          yield {
            messageType: 'info' as const,
            content: `📋 Workflows in ${owner}/${repo}…`,
          };
          const wfs = await listWorkflows(owner, repo);
          if (!wfs.length) {
            yield {
              messageType: 'info' as const,
              content: 'No workflows found.',
            };
            return;
          }
          for (const wf of wfs) {
            yield {
              messageType: 'info' as const,
              content: `  ${wf.state === 'active' ? '✅' : '⊘'}  ${wf.name}  (${wf.path})`,
            };
          }
        })(),
      };
    }

    // ── /ci logs ───────────────────────────────────────────────────────────
    if (subCmd === 'logs') {
      return {
        type: 'stream_messages',
        messages: logsStream(owner, repo, branch),
      };
    }

    // ── /ci rerun ──────────────────────────────────────────────────────────
    if (subCmd === 'rerun') {
      return {
        type: 'stream_messages',
        messages: (async function* () {
          yield {
            messageType: 'info' as const,
            content: '🔍 Finding last failed run…',
          };
          const runs = await listWorkflowRuns(owner, repo, branch, 5);
          const failedRun = runs.find(
            (r) => r.status === 'completed' && r.conclusion === 'failure',
          );
          if (!failedRun) {
            yield {
              messageType: 'info' as const,
              content: '✅ No failed runs found.',
            };
            return;
          }
          await rerunFailedJobs(owner, repo, failedRun.id);
          yield {
            messageType: 'info' as const,
            content: `✅ Re-running failed jobs in run #${failedRun.run_number}: ${failedRun.name}`,
          };
        })(),
      };
    }

    // ── /ci cancel ─────────────────────────────────────────────────────────
    if (subCmd === 'cancel') {
      return {
        type: 'stream_messages',
        messages: (async function* () {
          yield {
            messageType: 'info' as const,
            content: '🔍 Finding in-progress run…',
          };
          const runs = await listWorkflowRuns(owner, repo, branch, 5);
          const active = runs.find((r) => r.status === 'in_progress');
          if (!active) {
            yield {
              messageType: 'info' as const,
              content: 'No in-progress runs found.',
            };
            return;
          }
          await cancelRun(owner, repo, active.id);
          yield {
            messageType: 'info' as const,
            content: `⊘ Cancelled run #${active.run_number}: ${active.name}`,
          };
        })(),
      };
    }

    // ── /ci dispatch <workflow> [ref] ──────────────────────────────────────
    if (subCmd === 'dispatch') {
      const parts = (context.invocation?.args?.trim() ?? '').split(/\s+/);
      const workflowArg = parts[1];
      const refArg = parts[2] ?? branch;

      if (!workflowArg) {
        return {
          type: 'message',
          messageType: 'error',
          content: t('Usage: /ci dispatch <workflow-filename-or-id> [ref]'),
        };
      }

      return {
        type: 'stream_messages',
        messages: (async function* () {
          yield {
            messageType: 'info' as const,
            content: `🚀 Dispatching workflow "${workflowArg}" on ref "${refArg}"…`,
          };
          await dispatchWorkflow(owner, repo, workflowArg, refArg);
          yield {
            messageType: 'info' as const,
            content: `✅ Workflow dispatched. Check status: /ci`,
          };
        })(),
      };
    }

    // ── /ci (default — list runs) ──────────────────────────────────────────
    return {
      type: 'stream_messages',
      messages: listRunsStream(owner, repo, branch),
    };
  },
};

function subCommandDesc(sub: string): string {
  switch (sub) {
    case 'logs':
      return 'Show logs from the most recent failed job';
    case 'rerun':
      return 'Re-run failed jobs in the most recent run';
    case 'cancel':
      return 'Cancel the most recent in-progress run';
    case 'dispatch':
      return 'Trigger a workflow_dispatch event';
    case 'workflows':
      return 'List all workflow files in the repo';
    default:
      return '';
  }
}
