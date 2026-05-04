---
name: izn-gate-handling
description: How to properly respond when the Izn gate blocks a destructive
  action — self-verification workflow, intent clarification, hash-based retry
  mechanism, and common pitfalls. Use when the gate returns a clarification
  plan or when you need to execute a command the gate previously blocked.
---

# Izn Gate Handling

The Izn gate (`checkIznGate` in `packages/quran-guidance/src/engine/izn-gate.ts`)
is a pre-execution safety check that fires when the agent (with Izn/full-permission
granted) attempts a destructive action. It does NOT hard-block — it returns a
structured intent-clarification plan expecting the model to investigate, verify,
and confirm before retrying.

## When the Gate Triggers

The gate ONLY applies to `run_shell_command`. Tools like `write_file` and `edit`
never trigger it, regardless of content.

Five destructive categories are detected via regex matching on the command text
AND all string-valued `toolArgs` (including `description`):

| Category            | Detection patterns                              |
| ------------------- | ----------------------------------------------- |
| `file_deletion`     | `rm`, `del`, `delete`, `unlink`, `remove`, etc. |
| `force_push`        | `git push --force`, `git push -f`               |
| `database_drop`     | `DROP TABLE`, `DROP DATABASE`, etc.             |
| `database_truncate` | `TRUNCATE TABLE`                                |
| `permission_change` | `chmod`, `chown`, `icacls`, `cacls`, `setfacl`  |

## What the Gate Returns

When blocked, the gate returns an `IznGateResult` with:

- **`reason`**: Which categories matched (e.g., `"file_deletion"`)
- **`analysisPlan`**: Steps to understand impact (read files, trace deps, predict cascades)
- **`intentQuestions`**: Questions to ask the user about their goal
- **`impactScope`**: What to investigate — dependencies, cascade scenarios
- **`requiredConfirmation`**: Formatted system-reminder text shown to the model

The model receives this as a system-reminder in the tool response, NOT as an
error. The tool call is marked as "success" with the clarification message.

## The Correct Response Flow

### Step 1: Read and Understand the Gate Output

The gate tells you exactly what to verify. Do NOT skip straight to retrying.

### Step 2: Execute the Analysis Plan

Follow the `analysisPlan` steps:

- Read any files targeted for deletion/modification
- Search for imports/references across the project
- Trace dependency chains
- Predict cascade effects

### Step 3: Complete the Impact Scope

Address every item in `impactScope`:

- Check parent/child class relationships
- Check barrel file re-exports
- Check config/service dependencies

### Step 4: Clarify Intent with the User

Use `ask_user_question` with the gate's `intentQuestions`. These are
pre-written to probe the user's actual goal. Example for file deletion:

- "What is your goal — removal, replacement, refactor, or cleanup?"
- "Are you aware of what depends on this file?"
- "Should the file be replaced with something else, or permanent removal?"

### Step 5: Retry After Verification

Once verification is complete, re-issue the SAME `run_shell_command` call with
the same command and parameters. The gate has a hash-based retry mechanism:
`iznVerifiedHashes` stores a hash of `toolName|commandStr` from the blocked
call. On retry, the hash matches and the gate is skipped.

**Critical**: Use the exact same command string. Changing the description or
any parameter breaks the hash match.

### Step 6: Post-Execution Scope Report

After the command executes, `reportIznScope` appends a scope-verification
reminder. Verify the result matches intent. Report any deviations.

## The Hash-Based Retry Mechanism

```
First call:  hash = "run_shell_command|del temp.txt"  →  stored in iznVerifiedHashes
Retry call:  hash = "run_shell_command|del temp.txt"  →  matches → gate skipped
```

The hash is built from `toolName + "|" + command`. The `command` field is
extracted from `toolParams.command` (line ~1118 of coreToolScheduler.ts).
The `description` field is NOT part of the hash.

After the retry passes the gate, the hash is deleted from the set — it's a
one-time bypass, not a permanent exemption.

## Common Pitfall: Description Text Triggers False Positives

`buildTextToCheck()` joins ALL string values from `toolArgs`, including the
`description` field. A safe command like:

```
run_shell_command(command="git clean -n", description="Remove temp build artifacts")
```

Will be blocked because "Remove" in the description matches the
`file_deletion` regex. The command itself (`git clean -n` with `-n` dry-run
flag) is safe — it's the description that triggers the gate.

**Workaround**: When you know a command is safe but the gate blocks it due to
description-matching, complete the self-verification (prove safety) and retry.
The retry will pass because the hash matches.

**Future fix**: The description field should be excluded from pattern matching.
This is a known issue documented in `project_izn_gate_false_positives.md`.

## Principles

1. **The gate is a partner, not an enemy.** It's protecting the user's system
   from hasty destruction. Work with it, not against it.
2. **Verification is mandatory.** Do not retry without completing the analysis
   plan and clarifying intent. The gate expects evidence of verification.
3. **Be transparent.** When the gate blocks, tell the user what happened and
   what you're verifying. Don't silently re-issue the command.
4. **If unsure, consult.** The `revertCondition` in each rule tells you when
   to fall back to user consultation despite having Izn permission.

## Reference Files

- Gate engine: `packages/quran-guidance/src/engine/izn-gate.ts`
- Behavior rules: `packages/quran-guidance/src/data/izn-behavior-rules.ts`
- Types: `packages/quran-guidance/src/types/izn-types.ts`
- Tests: `packages/quran-guidance/src/tests/izn-gate.test.ts`
- Scheduler integration: `packages/core/src/core/coreToolScheduler.ts` (~line 1110)
- Izn mode guide: `packages/quran-guidance/src/prompts/izn-mode-guide.md`
