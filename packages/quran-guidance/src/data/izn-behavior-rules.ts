import type { IznBehaviorRule } from '../types/izn-types.js';

/**
 * Izn mode behavior rules.
 *
 * When the user grants Izn (full permission), the agent self-verifies
 * before these categories of destructive actions. Instead of hard-blocking,
 * the gate returns an intent-clarification plan — the model reads affected
 * files, traces dependencies, predicts cascade effects, and asks the user
 * to confirm their actual goal before acting.
 */
export const iznBehaviorRules: IznBehaviorRule[] = [
  {
    category: 'file_deletion',
    detectPattern: /\b(rm|del|delete|unlink|remove|rmdir|rimraf)\b/i,
    preVerify: [
      'List all files or directories that will be deleted.',
      'Confirm the scope with the user if it affects more than a few files.',
      'Warn if files are outside the project directory.',
    ],
    postReport: [
      'List what was deleted.',
      'Note if any deletions were skipped for safety.',
    ],
    revertCondition:
      'If the scope is unclear or the deletion affects critical project files.',
    impactAnalysis: {
      readTargets: [
        'Read the file(s) targeted for deletion to understand their purpose.',
        'Read any package.json or module index that exports the target.',
      ],
      dependencyChecks: [
        'Search for imports of the target file across the project.',
        'Check for parent/child class relationships — if the target exports a base class, list all subclasses that will break.',
        'Check for re-exports in barrel files (index.ts) that reference the target.',
      ],
      cascadeScenarios: [
        'If the file is a base/parent class: all child classes break at import time.',
        'If the file is a shared utility: all consumers get module-not-found errors.',
        'If the file is a route handler: related routes return 404.',
        'If the file is a config: dependent services may fail to start.',
      ],
    },
    intentQuestions: [
      'What is your goal — removal, replacement, refactor, or cleanup?',
      'Are you aware of what depends on this file?',
      'Should the file be replaced with something else, or is this a permanent removal?',
    ],
  },
  {
    category: 'force_push',
    detectPattern: /\b(force.push|git push.*--force|git push.*-f)\b/i,
    preVerify: [
      'Show the current branch and remote state.',
      'List commits that will be pushed.',
      'Warn that force-push is irreversible and can overwrite remote history.',
      'Confirm the user understands the consequences.',
    ],
    postReport: ['Confirm the push completed and show the new remote state.'],
    revertCondition:
      'If any doubt exists about the remote state or what will be overwritten.',
    impactAnalysis: {
      readTargets: [
        'Check the remote tracking branch state with git log.',
        'Show git status and current branch divergence.',
      ],
      dependencyChecks: [
        'List commits that exist locally but not on remote.',
        'List commits that exist on remote but not locally (will be lost).',
        'Check if other collaborators have based work on the remote HEAD.',
      ],
      cascadeScenarios: [
        'Force-push rewrites shared history — teammates who pulled the old HEAD must rebase.',
        'If the remote has commits not in your local, those commits are permanently lost.',
        'CI pipelines may have run against the old HEAD; force-push invalidates those results.',
      ],
    },
    intentQuestions: [
      'Why does this require force-push instead of a normal push or merge?',
      'Are you rebasing, squashing, or amending published commits?',
      'Have collaborators been warned about the history rewrite?',
    ],
  },
  {
    category: 'database_drop',
    detectPattern: /\b(DROP\s+(TABLE|DATABASE|SCHEMA|INDEX|VIEW))\b/i,
    preVerify: [
      'Show what will be dropped.',
      'Warn that data will be permanently lost.',
      'Suggest backup or migration path.',
    ],
    postReport: [
      'Confirm what was dropped.',
      'Note if any dependencies were affected.',
    ],
    revertCondition:
      'If the database contains production data or no backup exists.',
    impactAnalysis: {
      readTargets: [
        'Check if a database connection is available.',
        'List all objects that match the DROP target.',
      ],
      dependencyChecks: [
        'Check for foreign key references to the target table.',
        'Check for views, triggers, or stored procedures that depend on the target.',
        'Check for application code that queries the target table.',
        'Check for ORM models or migration files linked to the target.',
      ],
      cascadeScenarios: [
        'Dropping a parent table: child tables with FK constraints may fail or cascade.',
        'Dropping a schema: all tables, views, and functions within it are lost.',
        'Dropping an index: queries that rely on it will degrade in performance.',
        'No backup means no recovery path if the wrong object is dropped.',
      ],
    },
    intentQuestions: [
      'Is this a development, staging, or production database?',
      'What is the purpose of dropping this — cleanup, migration, or restructure?',
      'Has the data been backed up or migrated elsewhere?',
      'Are you certain this is the correct target (not a similarly named object)?',
    ],
  },
  {
    category: 'database_truncate',
    detectPattern: /\b(TRUNCATE\s+(TABLE)?)\b/i,
    preVerify: [
      'Show the table and row count that will be truncated.',
      'Warn that truncation removes all rows without individual deletes.',
      'Confirm the table is not referenced by foreign keys without CASCADE.',
    ],
    postReport: [
      'Confirm the truncation completed.',
      'Note if any constraint errors occurred.',
    ],
    revertCondition:
      'If the table contains critical data and no backup strategy is in place.',
    impactAnalysis: {
      readTargets: [
        'Check the table row count before truncating.',
        'Check the table schema for foreign key relationships.',
      ],
      dependencyChecks: [
        'Check for FK references FROM this table (will be lost with rows).',
        'Check for FK references TO this table (may block truncation).',
        'Check for auto-increment sequences that will reset.',
        'Check for application cache or materialized views derived from this table.',
      ],
      cascadeScenarios: [
        'TRUNCATE resets auto-increment counters — new rows get IDs that may collide with archived data.',
        'Without CASCADE, FK constraints from child tables block the TRUNCATE.',
        'With CASCADE, child table rows are silently removed — may be unintended.',
      ],
    },
    intentQuestions: [
      'Is this a full reset of test/seed data, or are you clearing production data?',
      'Do you need to preserve any rows (e.g., via WHERE clause with DELETE instead of TRUNCATE)?',
      'Is there a backup of this table before truncation?',
    ],
  },
  {
    category: 'permission_change',
    detectPattern: /\b(chmod|chown|icacls|cacls|setfacl)\b/i,
    preVerify: [
      'Show current permissions.',
      'Show what permissions will change.',
      'Warn if permissions are being made more permissive than necessary.',
    ],
    postReport: [
      'Show the new permission state.',
      'Note if any files became unexpectedly accessible.',
    ],
    revertCondition:
      'If the permission change affects system files or weakens security posture.',
    impactAnalysis: {
      readTargets: [
        'Check current permissions on the target file/directory.',
        'Check the file type and ownership.',
      ],
      dependencyChecks: [
        'Check if the target is a system file, config file, or user data.',
        'Check if the permission change affects a directory recursively.',
        'Check if the new permissions grant access to sensitive files (keys, tokens, env).',
        'Check if the change affects executability (may introduce security risk).',
      ],
      cascadeScenarios: [
        'chmod 777 on a directory: all users can read/write/execute everything inside.',
        'chmod on an SSH key: key becomes readable by other users — compromise risk.',
        'chown on a system binary: may allow privilege escalation if combined with setuid.',
        'Recursive permission changes on project dirs can break git or package managers.',
      ],
    },
    intentQuestions: [
      'What access problem are you solving — is there a least-privilege alternative?',
      'Is the target a user file, project file, or system file?',
      'Are you adjusting permissions for a specific user/group or opening access broadly?',
    ],
  },
];
