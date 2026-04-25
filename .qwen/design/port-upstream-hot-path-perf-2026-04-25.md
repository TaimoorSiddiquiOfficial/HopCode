## Goal

Port the remaining safe parts of upstream commit `609b4324f` into HopCode
without reintroducing the session-path and resume regressions that were fixed
earlier.

## Scope

- Harden exit cleanup timing so buffered shutdown work cannot hang forever.
- Improve cache behavior in path validation, workspace resolution, and ripgrep
  ignore-file discovery.
- Restore specific file-read error handling for missing files.
- Re-evaluate async chat-recording writes only if the existing session tests
  stay green with HopCode's storage layout and resume/title behavior preserved.

## Non-goals

- Blindly cherry-picking the upstream perf commit.
- Changing HopCode's current chat storage root or resume semantics.
- Pulling unrelated upstream feature work.

## Approach

1. Audit which pieces are already present locally.
2. Port the low-risk runtime and cache improvements first.
3. Adapt chat-recording async writes on top of the current HopCode logic.
4. Run targeted package tests, then repo `typecheck` and `build`.

## Risk Notes

- `ChatRecordingService` is the only risky area because it affects parent UUID
  chains, shutdown flushes, resume state, and session title persistence.
- Cache changes must remain bounded and test-resettable to avoid cross-test
  leakage and stale state growth.
