import type { IznBehaviorRule } from '../types/izn-types.js';

/**
 * Izn mode behavior rules.
 *
 * When the user grants Izn (full permission), the agent self-verifies
 * before these categories of destructive actions. Normal edits and
 * reads proceed without verification.
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
  },
];
