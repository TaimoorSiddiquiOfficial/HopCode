---
name: learn
description: Analyze the current or a recent session and distill a reusable skill from the patterns found. Invoke with /learn to generate a new skill from what HopCode just did, or /learn <session-id> to analyze a specific session.
allowedTools:
  - read_file
  - write_file
  - run_shell_command
  - glob
---

# Learning Loop — Session Skill Distillation

You are a meta-learning system for HopCode. Your job is to analyze a chat session
and distill the most useful patterns into a **reusable HopCode skill**.

## What this skill does

When the user runs `/learn` or `/learn <session-id>`:

1. **Locate the session** to analyze (current session or the one specified).
2. **Read the conversation** from the session JSONL file.
3. **Identify reusable patterns** — repeated tasks, successful tool sequences, user preferences.
4. **Generate a SKILL.md** that captures the identified pattern.
5. **Save it** to `~/.hopcode/skills/<slug-name>/SKILL.md`.
6. **Confirm** to the user what skill was created and how to invoke it.

---

## Step 1 — Identify the session to analyze

Parse the argument passed after `/learn`:

- **No argument**: use the _current session_. The session ID is available as `{{session_id}}`.
- **`<session-id>` argument**: use the specified session.

Find the JSONL file for the session:

```bash
find ~/.hopcode/projects -name "<session-id>.jsonl" 2>/dev/null | head -1
```

If the session ID is the current session, you can also read from:

```
~/.hopcode/projects/<current_cwd_sanitised>/chats/<session_id>.jsonl
```

Use `run_shell_command` to locate the file, then `read_file` to read it.

---

## Step 2 — Parse the conversation

Each line of the JSONL file is a JSON object with this shape:

```json
{"type":"user"|"assistant"|"tool_result"|"system", "message": {...}, "timestamp": "...", "sessionId": "...", ...}
```

Read up to **200 lines** from the file. Extract:

- All `type: "user"` messages → what the user asked for
- All `type: "assistant"` messages → what HopCode did (especially tool calls)
- Look for **tool calls** (tool_use blocks inside assistant messages)

---

## Step 3 — Identify the core pattern

Ask yourself:

- **What is the user repeatedly trying to accomplish?**
- **What tool sequence was most effective?**
- **Are there any clever prompting tricks or workflows the user demonstrated?**
- **What would make a great reusable skill?**

Good skill candidates:

- A multi-step workflow (e.g., "always run tests, then lint, then format before committing")
- A domain-specific task the user does often (e.g., "generate API docs from OpenAPI spec")
- A useful combination of existing tools (e.g., "search codebase, summarise findings, write report")
- A style or preference pattern (e.g., "always add copyright headers to new files")

If the session contains no clear reusable pattern (e.g., it was a one-off Q&A), say so and suggest the user run `/learn` after a more structured session. Do not generate a trivial or useless skill.

---

## Step 4 — Generate the SKILL.md

Create a `SKILL.md` file using this template:

```markdown
---
name: <kebab-case-name>
description: <one-sentence description of what this skill does and when to invoke it>
allowedTools:
  - <list only the tools actually needed>
---

# <Title>

<2-3 sentences explaining what this skill does and why it's useful.>

## When to use

<When should the user invoke this skill? What problem does it solve?>

## Steps

<Numbered list of concrete steps the model should follow.>

<For each step, be specific about which tools to use and what to do with the output.>

## Notes

<Any important caveats, edge cases, or tips learned from the session.>
```

**Skill quality rules:**

- The `name` must be unique, descriptive, and kebab-case (e.g., `test-then-lint`, `api-doc-gen`)
- The `description` must be one sentence and tell the user _exactly_ when to invoke it
- Steps must be **actionable and concrete** — another LLM should be able to follow them without additional context
- Only list tools in `allowedTools` that the skill actually uses
- Do NOT include filler or generic advice — every sentence should be specific and useful

---

## Step 5 — Save the skill

1. Choose a unique skill name (kebab-case, max 40 chars).
2. Create the directory:
   ```bash
   mkdir -p ~/.hopcode/skills/<skill-name>
   ```
3. Write the SKILL.md to `~/.hopcode/skills/<skill-name>/SKILL.md`.
4. Verify it was written:
   ```bash
   cat ~/.hopcode/skills/<skill-name>/SKILL.md | head -10
   ```

---

## Step 6 — Confirm

Tell the user:

- The skill name and a one-line description
- Where it was saved (`~/.hopcode/skills/<skill-name>/SKILL.md`)
- How to invoke it: `/<skill-name>` in any HopCode session
- That they can edit the skill at any time to refine it

Example response:

```
✅ New skill created: **test-then-commit**
   "Run tests, lint, and format before every git commit."

   Saved to: ~/.hopcode/skills/test-then-commit/SKILL.md
   Invoke with: /test-then-commit

   Edit the skill anytime to add steps or adjust behaviour.
```

---

## Important constraints

- **Never overwrite** an existing user skill without asking first.
- **Do not create trivial skills** like "answer questions" or "write code" — these add no value.
- The generated skill must be **specific enough** to be useful and **general enough** to apply in future sessions.
- If the session is too short (< 5 turns) or too generic, tell the user honestly and suggest running `/learn` after a more substantial session.
