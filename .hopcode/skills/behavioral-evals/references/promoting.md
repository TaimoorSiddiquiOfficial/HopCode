# Promoting and Publishing Evals

## Promoting an eval to CI

To promote to CI:

1. Ensure the eval passes reliably (in at least N=5 consecutive local runs).
2. Edit the tag in `behavioral-registry.ts` to `ci:generative`.
3. If the run takes over 30s and wants CI to use a "fast" model, add the properties to the eval configuration (see `BehavioralEval#promote` in source). Don't guess. Measure.
4. Verify the eval passes in a draft PR. GPUs are scarce. If it fails in the draft PR, it's not ready for CI.

## Publishing vs. local

- Evals marked only as `local` run when a developer explicitly invokes the eval runner on their machine.
- Evals marked `ci:generative` run in the CI "quick" suite.
- Evals marked `ci:resource-heavy` run in a separate, less frequent pipeline (nightly).

## Versioning evals

When updating criteria for an existing eval:

- Update `expected.md` and/or `auto-assertions.ts`.
- Bump the eval version in metadata.
- Leave a comment with the rationale for the criteria change.
