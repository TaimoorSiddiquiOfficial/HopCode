# Contributing to the Guidance System

This package provides the HopCode behavioral guidance system — a
rule-based engine that shapes agent behavior, tone, communication style,
and safety boundaries.

## Scope

The guidance system consists of:

- **Data files** (`src/data/`): Curated guidance entries, situation-to-angle
  mappings, response patterns, and Izn mode behavior rules.
- **Engine** (`src/engine/`): Situation classifier, strategy resolver,
  behavior composer, and Izn safety gate.
- **MCP client** (`src/mcp/`): Verified canonical data transport layer.
- **Prompts** (`src/prompts/`): System prompt overlays injected into the
  agent's default prompt.

## Adding a new guidance entry

1. Identify the situation the entry addresses (debugging, code review,
   planning, communication, etc.).
2. Choose a canonical reference and verify it against the MCP server
   or a recognized printed edition.
3. Add the entry to `src/data/ayah-guidance.ts` following the existing
   schema:

```ts
{
  surah: 49,
  ayah: 6,
  english: "O you who believe, if a wrongdoer comes to you with news, verify it…",
  translation: "Sahih International",
  strategy: "verify_before_acting",
  tone: "cautious",
  useWhen: ["accusation", "unverified_claim", "debugging"],
  instruction: "Verify logs, inputs, outputs, and assumptions before concluding.",
}
```

4. Map the situation to angles in `src/data/situation-angle-map.ts`.
5. Run the tests: `npx vitest run`
6. Open a PR following the [Review Policy](REVIEW_POLICY.md).

## Modifying the Izn safety gate

The Izn gate (`src/engine/izn-gate.ts`) controls which destructive actions
trigger self-verification when the user has granted full permission.

To add a new destructive category:

1. Add the category to the `DestructiveActionCategory` type in
   `src/types/izn-types.ts`.
2. Add a corresponding behavior rule in `src/data/izn-behavior-rules.ts`.
3. Add the gate check in `checkIznGate()`.
4. Add tests covering both pass and fail paths.
5. Run `npm run typecheck` to ensure no type regressions.

## Code conventions

- Follow the project's Prettier and ESLint configuration.
- Use `verbatimModuleSyntax` for imports.
- Tests are collocated with source (`file.test.ts` next to `file.ts`).
- Run `npm run build && npm run typecheck` before submitting.

## Questions?

Open a [GitHub issue](https://github.com/TaimoorSiddiquiOfficial/HopCode/issues/new) with the `guidance-system` label.
