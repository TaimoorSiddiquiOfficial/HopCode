## Debugging and fixing broken evals

### Before you start

- Does CI use a different model or prompt strategy than your local runs? Mismatches here are the most common source of CI-only failures.
- Is the eval that broke a generative eval, diff eval, or structured output eval? Most have separate failure modes.

### Process

1. Repro locally. Most behavioral evals are triggered using npm scripts in `package.json`. Find the `eval:behavioral:…` script and check its arguments. Read the eval's configuration in its runner file.

2. Start from the diff. If the test runner produces a structured output (e.g. JSON or a git diff), focus on that artifact first.

3. For `BehavioralEval` / generative evals specifically, look at:
   - Final tool call list
   - Final file contents after the run
   - Exactly which model was used and whether fallback or model override happened

4. For probabilistic / sampling evals, check if the failure rate increased gradually (likely a model drift) or jumped abruptly (likely a regression in tooling).

### Escalation

If the failure is clearly in the model's quality and not your code, escalate to the evals team with the run ID and log.

### After fix

Validate with:

```
npm run eval:behavioral:run -- <your-eval-name>
```
