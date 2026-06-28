# Rebrand upstream merge: qwen -> hopcode product names
# Preserves model names (qwen3-max, qwen-plus, qwen-max, qwq, etc.)
# Strategy: only replace safe, unambiguous product-name patterns

$ErrorActionPreference = 'Stop'
$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $rootDir

$files = Get-ChildItem -Recurse -File | Where-Object {
    $_.FullName -notmatch '(node_modules|\\.git[\\/]|dist[\\/]|package-lock\.json|\.png$|\.ico$|\.svg$|\.woff|\.wasm|\.map$|rebrand-upstream-merge\.ps1|rebrand-to-hopcode\.ps1|rebrand-to-hopcode\.sh|MIGRATING_FROM_QWEN_CODE\.md)'
} | Select-Object -ExpandProperty FullName

Write-Host "Found $($files.Count) files to process"
$totalChanges = 0
$skippedBinary = 0

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file)
    } catch {
        $skippedBinary++
        continue
    }

    # Skip binary files (heuristic: null bytes in first 8KB)
    $bytes = [System.IO.File]::ReadAllBytes($file)
    if ($bytes.Length -gt 0 -and $bytes.Length -lt 8192) {
        $check = $bytes
    } elseif ($bytes.Length -gt 0) {
        $check = $bytes[0..8191]
    } else {
        continue
    }
    $hasNull = $false
    foreach ($b in $check) {
        if ($b -eq 0) { $hasNull = $true; break }
    }
    if ($hasNull) { $skippedBinary++; continue }

    $original = $content

    # === SAFE, UNAMBIGUOUS REPLACEMENTS ===

    # 1. Environment variables: QWEN_ -> HOPCODE_
    $content = $content -replace 'QWEN_', 'HOPCODE_'

    # 2. [QWEN] log prefix -> [HOPCODE]
    $content = $content -replace '\[QWEN\]', '[HOPCODE]'

    # 3. "Qwen Code" -> "HopCode" (product name, never a model name)
    $content = $content -replace 'Qwen Code', 'HopCode'

    # 4. "Qwen-Coder" (git co-author) -> "HopCode"
    $content = $content -replace 'Qwen-Coder', 'HopCode'

    # 5. __qwen_dirname -> __hopcode_dirname (esbuild define)
    $content = $content -replace '__qwen_dirname', '__hopcode_dirname'

    # 6. qwen/notify/ -> hopcode/notify/ (protocol methods)
    $content = $content -replace 'qwen/notify/', 'hopcode/notify/'

    # 7. .qwen/ directory path -> .hopcode/ 
    # Careful: only config directory references, not model names
    $content = $content -replace '\.qwenignore', '.hopcodeignore'
    $content = $content -replace '\.qwen/', '.hopcode/'
    $content = $content -replace '\.qwen\\', '.hopcode\'
    $content = $content -replace "'\.qwen'", "'.hopcode'"
    $content = $content -replace '"\.qwen"', '".hopcode"'
    $content = $content -replace '\.qwen-runtime', '.hopcode-runtime'
    $content = $content -replace '\.qwen-home', '.hopcode-home'
    $content = $content -replace '/tmp/\.qwen', '/tmp/.hopcode'
    $content = $content -replace '~/\.qwen', '~/.hopcode'

    # 8. Config meta: qwen-ignore -> hopcode-ignore
    $content = $content -replace 'qwen-ignore', 'hopcode-ignore'
    $content = $content -replace 'qwenignore', 'hopcodeignore'
    $content = $content -replace 'respectQwenIgnore', 'respectHopCodeIgnore'

    # 9. Temp dir prefixes
    $content = $content -replace 'qwen-wt-', 'hopcode-wt-'
    $content = $content -replace 'qwen-shell-', 'hopcode-shell-'
    $content = $content -replace 'qwen-cu-', 'hopcode-cu-'

    # 10. qwen_oauth -> hopcode_oauth
    $content = $content -replace 'qwen_oauth', 'hopcode_oauth'

    # 11. qwen-oauth -> hopcode-oauth
    $content = $content -replace 'qwen-oauth', 'hopcode-oauth'

    # 12. Package scopes imported by upstream files
    $content = $content -replace '@qwen-code/qwen-code-core', '@hoptrendy/hopcode-core'
    $content = $content -replace '@qwen-code/acp-bridge', '@hoptrendy/acp-bridge'
    $content = $content -replace '@qwen-code/sdk', '@hoptrendy/sdk'
    $content = $content -replace '@qwen-code/webui', '@hoptrendy/webui'

    # 13. qwen-code (package name) -> hopcode
    # Only when it's clearly the package name, not a model
    $content = $content -replace 'qwen-code', 'hopcode'

    # 14. qwen-serve -> hopcode-serve
    $content = $content -replace 'qwen-serve', 'hopcode-serve'

    # 14b. Serve entrypoint rename from upstream kebab-case files
    $content = $content -replace 'run-qwen-serve', 'run-hopcode-serve'
    $content = $content -replace 'runQwenServe', 'runHopCodeServe'

    # 15. Tailwind theme key qwen: -> hopcode: (only in tailwind config)
    # Too dangerous as blanket replacement; handle separately

    # 16. CLI binary references (very targeted)
    $content = $content -replace '\bqwen --', 'hopcode --'
    $content = $content -replace '\bqwen -p', 'hopcode -p'
    $content = $content -replace '\bqwen serve\b', 'hopcode serve'
    $content = $content -replace 'bin/qwen\b', 'bin/hopcode'
    $content = $content -replace 'bin\\qwen\b', 'bin\hopcode'
    $content = $content -replace 'qwen\.cmd\b', 'hopcode.cmd'
    $content = $content -replace 'qwen\.sh\b', 'hopcode.sh'

    # 17. Backtick/quoted CLI name references
    $content = $content -replace '`qwen`', '`hopcode`'

    # 18. "qwen" in specific string contexts (CLI name only)
    # These patterns ensure we don't hit model names
    $content = $content -replace '"qwen"', '"hopcode"'
    $content = $content -replace "'qwen'", "'hopcode'"

    # 19. name: 'qwen' / name: "qwen" in package.json / config
    $content = $content -replace "name:\s*'qwen'", "name: 'hopcode'"
    $content = $content -replace 'name:\s*"qwen"', 'name: "hopcode"'

    # 20. binary: qwen -> hopcode
    $content = $content -replace 'binary:\s*qwen', 'binary: hopcode'

    # 21. HopCode OAuth and device-flow identifiers. These are product auth
    # identifiers, not Qwen model names.
    $content = $content -replace 'QwenCode', 'HopCode'
    $content = $content -replace 'qwenCode', 'hopCode'
    $content = $content -replace 'qwenDir', 'hopcodeDir'
    $content = $content -replace 'qwenHome', 'hopcodeHome'
    $content = $content -replace 'QwenOAuth', 'HopCodeOAuth'
    $content = $content -replace 'qwenOAuth', 'hopCodeOAuth'
    $content = $content -replace 'QwenCredentials', 'HopCodeCredentials'
    $content = $content -replace 'IQwen', 'IHopCode'
    $content = $content -replace 'qwen-device-flow-provider', 'hopcode-device-flow-provider'

    # 22. Common upstream headers/prompts.
    $content = $content -replace 'Qwen Team', 'HopCode Team'

    # 23. ACP/web-shell extension metadata keys.
    $content = $content -replace 'qwenDiscreteMessage', 'hopcodeDiscreteMessage'
    $content = $content -replace '_qwen/', '_hopcode/'
    $content = $content -replace '_meta\.qwen', '_meta.hopcode'
    $content = $content -replace '\{ qwen:', '{ hopcode:'
    $content = $content -replace 'qwen\.methods', 'hopcode.methods'

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file, $content)
        $totalChanges++
    }
}

Write-Host "Modified $totalChanges files, skipped $skippedBinary binary files"
