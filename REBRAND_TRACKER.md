# Rebrand Tracker — HopCode fork from QwenLM/qwen-code

## Completed

- [x] npm scope: @qwen/_ → @hoptrendy/_ (all packages)
- [x] Docker image namespace: ghcr.io/hopcode/hopcode
- [x] Root package name: @hoptrendy/hopcode
- [x] CLI binary name: hopcode
- [x] Approval mode: yolo → izn (all workflows)
- [x] Triage workflow node-version: 20 → 22.x (uses .nvmrc)
- [x] release.yml repo guards: QwenLM/hopcode → TaimoorSiddiquiOfficial/HopCode (4 locations)
- [x] qwen-autofix.yml → hopcode-autofix.yml in release.yml notify_failure
- [x] @hopcode/audio-capture version: 0.19.3 → 0.30.4
- [x] yolo.svg → izn.svg (+ backward-compat alias in ModeIcon.tsx)
- [x] Rebrand guard workflow: .github/workflows/rebrand-guard.yml

## Pending

- [ ] Rename qwen.diff.\* VS Code command IDs (breaking change for users' keybindings.json)
- [ ] Fix OSS bucket URL in README.md (hopcode-assets 404) — replace with npm/GH releases path
- [ ] Bump packages/desktop/_ @craft-agent/_ packages from 0.0.x to 0.30.4 (low priority, pre-fork artifacts)
- [ ] Review izn-gate-handling/SKILL.md for lingering YOLO terminology in docs
- [ ] Add download-artifact step for audio-capture prebuilds in release.yml publish job (step exists but gated on our repo)
