# Creating a New Eval

## 1. Determine eval type

Behavioral tests use `BehavioralEval` and exercise agent flows in `generative_eval`. If the eval runs the agent end-to-end, validating overall behavior, start there. If the focus is a single function's accuracy under different inputs, use `FileDiffEval` or `ImageDiffEval`.

## 2. Register the eval

1. Open `packages/core/src/eval/behavioral-registry.ts`.
2. Add it to the `BehavioralEvalRegistry` array. If the eval is tagged `ci:generative`, it runs in CI for every PR. If it is `ci:resource-heavy`, it runs on a less frequent schedule.

## 3. Configure the file system

Each eval gets its own folder under `generative_eval/tests/my-eval-name/`. Put files and folders the eval needs there, following existing examples.

**Special file names by convention:**

- `input.md` – The input prompt for the eval. HopCode prompts are nested markdown using `((path/to/file.txt))` syntax for file references.
- `expected.md` – Human-readable instructions for a human reviewer. Pair with `auto-assertions.ts`.
- `schema.ts` — Zod schema for structured evals. The test reads the .ts manually and validates the structured output.

**File references:**

- `((<path>))` — inserts the single file content from `generative_eval/tests/test-name/<path>`.
- `((<path>**))` — inserts the workspace tree from `generative_eval/tests/test-name/<path>`.
