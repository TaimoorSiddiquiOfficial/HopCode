# Pass 3: rebrand "qwen serve" and remaining qwen product-name refs in source

$ErrorActionPreference = 'Stop'
$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $rootDir

$files = Get-ChildItem -Recurse -File | Where-Object {
    $_.FullName -notmatch '(node_modules|\\.git[\\/]|dist[\\/]|package-lock|\.png|\.ico|\.svg|\.woff|\.wasm|\.map|rebrand)'
} | Select-Object -ExpandProperty FullName

Write-Host "Found $($files.Count) files"
$totalChanges = 0

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file)
    } catch {
        continue
    }

    $original = $content

    # "qwen serve" in backticks, quotes, log messages, comments
    $content = $content -replace 'qwen serve', 'hopcode serve'

    # `Qwen Serve` as title (from test)
    $content = $content -replace 'Qwen Serve', 'HopCode Serve'

    # "QwenOAuth2" already handled, but check for any remaining
    # QwenOAuth2 in import/export strings
    $content = $content -replace "'QwenOAuth2Client'", "'HopCodeOAuth2Client'"

    # Remaining ".qwen" directory in test strings that might have been missed
    $content = $content -replace '\.hopcode\b', '.hopcode'

    # Remaining "qwen/" paths (not model names like qwen3, qwen-plus, etc.)
    # Only match standalone "qwen/" not followed by model identifiers
    $content = $content -replace '(?<!qwen\d)qwen/(?!notify|control|model|plus|max|3)', 'hopcode/'

    # "runQwenServe" -> "runHopCodeServe" (function name)
    $content = $content -replace 'runQwenServe', 'runHopCodeServe'

    # "HOPCODE_DIR" constant -> "HOPCODE_DIR"
    $content = $content -replace 'HOPCODE_DIR\b', 'HOPCODE_DIR'

    # "HopCode" product name (one more pass for safety)
    $content = $content -replace 'HopCode', 'HopCode'

    # "hopcode" package name
    $content = $content -replace 'hopcode', 'hopcode'

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file, $content)
        $totalChanges++
    }
}

Write-Host "Modified $totalChanges files"