# Changelog

All notable changes to the HopCode VS Code Companion extension.

## 0.23.0

### Breaking Changes

- **Approval mode renamed**: `yolo` mode is now `izn` (Izn). The `--yolo` / `-y` flags are replaced with `--izn` / `-z`. Update CI workflows and scripts that reference the old flags.

### Added

- **Izn mode**: Full-permission approval mode with built-in self-verification for destructive actions. Izn (إذن) means permission with responsibility — the agent auto-approves tools but self-verifies before file deletion, force-push, database drops, truncation, and permission changes.
- **Guidance system**: Integrated behavioral guidance engine that shapes agent tone, communication, debugging, and decision-making. The engine classifies user intent, resolves guidance strategies, and composes agent behavior — applied transparently and only to the default system prompt.

### Changed

- Approval mode UI labels now display "Izn" across all surfaces (indicator, settings, toggle).
- Settings schema defaults updated from `'yolo'` to `'izn'`.
- CLI error messages and help text now reference `--izn` / `-z`.
- SDK permission mode enum now uses `'izn'` instead of `'yolo'`.

## 0.22.0

- Previous release.
