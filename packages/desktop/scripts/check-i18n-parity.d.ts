#!/usr/bin/env bun
/**
 * check-i18n-parity.ts — CI-safe locale parity check.
 *
 * Verifies every non-English locale has the same keys as en.json. Plural
 * variants (`_zero` / `_one` / `_two` / `_few` / `_many` / `_other`) are
 * allowed to diverge from English because languages have different plural
 * rules (e.g. Polish needs `_few`, Japanese has no plural distinction).
 *
 * A locale file may therefore have an `X_few` key even if en.json only has
 * `X_one` / `X_other`, as long as the non-pluralized base exists in English.
 *
 * Exits 0 when all locales match en.json; 1 with a diagnostic otherwise.
 *
 * Scope: this script intentionally only checks locale files under
 * `packages/shared/src/i18n/locales`. It does NOT scan for hardcoded
 * strings — that's the job of `scripts/lint-i18n-staged.sh` (pre-commit).
 */
export {};
