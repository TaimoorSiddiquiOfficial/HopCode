# Second pass rebranding: fix remaining qwen product-name references
# Focuses on code identifiers, API names, and test references

$ErrorActionPreference = 'Stop'
$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $rootDir

$files = Get-ChildItem -Recurse -File | Where-Object {
    $_.FullName -notmatch '(node_modules|\\.git[\\/]|dist[\\/]|package-lock\.json|\.png$|\.ico$|\.svg$|\.woff|\.wasm|\.map$|rebrand)'
} | Select-Object -ExpandProperty FullName

Write-Host "Found $($files.Count) files to process"
$totalChanges = 0

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file)
    } catch {
        continue
    }

    $original = $content

    # 1. Storage.getGlobalhopcodeDir() -> Storage.getGlobalHopCodeDir()
    $content = $content -replace 'Storage\.getGlobalhopcodeDir\(\)', 'Storage.getGlobalHopCodeDir()'

    # 2. getGlobalhopcodeDir: (mock in tests) -> getGlobalHopCodeDir:
    $content = $content -replace 'getGlobalhopcodeDir:', 'getGlobalHopCodeDir:'

    # 3. QWEN.md -> HOPCODE.md (context instruction file name)
    $content = $content -replace 'QWEN\.md', 'HOPCODE.md'
    $content = $content -replace 'QWEN\.local\.md', 'HOPCODE.local.md'
    $content = $content -replace 'QWEN\.LOCAL\.MD', 'HOPCODE.LOCAL.MD'
    $content = $content -replace 'qwen\.md', 'hopcode.md'

    # 4. DEFAULT_CONTEXT_FILENAME: 'QWEN.md' -> 'HOPCODE.md' (already covered above)

    # 5. HopCode namespace/product -> HopCode
    $content = $content -replace 'HopCode', 'HopCode'

    # 6. QwenAgent -> HopCodeAgent
    $content = $content -replace 'QwenAgent', 'HopCodeAgent'

    # 7. qwenVersion -> hopcodeVersion
    $content = $content -replace 'qwenVersion', 'hopcodeVersion'

    # 8. .hopcodeignore -> .hopcodeignore
    $content = $content -replace '\.hopcodeignore', '.hopcodeignore'

    # 9. shouldhopcodeignoreFile -> shouldHopcodeIgnoreFile
    $content = $content -replace 'shouldhopcodeignoreFile', 'shouldHopcodeIgnoreFile'

    # 10. usehopcodeignore -> useHopcodeignore
    $content = $content -replace 'usehopcodeignore', 'useHopcodeignore'

    # 11. hopcodeHome -> hopcodeHome (variable names)
    $content = $content -replace 'hopcodeHome', 'hopcodeHome'

    # 12. qwen-home- temp dir prefix
    $content = $content -replace 'qwen-home-', 'hopcode-home-'

    # 13. globalhopcodeDir -> globalHopcodeDir (variable names)
    $content = $content -replace 'globalhopcodeDir', 'globalHopcodeDir'

    # 14. .qwen directory references in code/tests (not model names)
    # Already handled in pass 1 for most cases, but clean up remaining
    $content = $content -replace "path\.join\([^)]*'\.qwen'", "path.join([^)]*'.hopcode'"
    $content = $content -replace '\.hopcode\b', '.hopcode'

    # 15. HopCodeOAuth2Client -> HopCodeOAuth2Client
    $content = $content -replace 'HopCodeOAuth2Client', 'HopCodeOAuth2Client'

    # 16. IHopCodeOAuth2Client -> IHopCodeOAuth2Client
    $content = $content -replace 'IHopCodeOAuth2Client', 'IHopCodeOAuth2Client'

    # 17. HopCodeCredentials -> HopCodeCredentials
    $content = $content -replace 'HopCodeCredentials', 'HopCodeCredentials'

    # 18. HopCodeOAuthPollError -> HopCodeOAuthPollError
    $content = $content -replace 'HopCodeOAuthPollError', 'HopCodeOAuthPollError'

    # 19. HopCodeOAuth2Event -> HopCodeOAuth2Event
    $content = $content -replace 'HopCodeOAuth2Event', 'HopCodeOAuth2Event'

    # 20. HopCodeOAuth2Events -> hopcodeOAuth2Events
    $content = $content -replace 'HopCodeOAuth2Events', 'hopcodeOAuth2Events'

    # 21. getHopCodeOAuthClient -> getHopCodeOAuthClient
    $content = $content -replace 'getHopCodeOAuthClient', 'getHopCodeOAuthClient'

    # 22. cacheHopCodeCredentials -> cacheHopCodeCredentials
    $content = $content -replace 'cacheHopCodeCredentials', 'cacheHopCodeCredentials'

    # 23. clearHopCodeCredentials -> clearHopCodeCredentials
    $content = $content -replace 'clearHopCodeCredentials', 'clearHopCodeCredentials'

    # 24. getQwenCachedCredentialPath -> getHopCodeCachedCredentialPath
    $content = $content -replace 'getQwenCachedCredentialPath', 'getHopCodeCachedCredentialPath'

    # 25. authWithQwenDeviceFlow -> authWithHopCodeDeviceFlow
    $content = $content -replace 'authWithQwenDeviceFlow', 'authWithHopCodeDeviceFlow'

    # 26. HopCodeOAuth2 class/function references in strings
    $content = $content -replace "'HopCodeOAuthPollError'", "'HopCodeOAuthPollError'"
    $content = $content -replace "Qwen OAuth", "HopCode OAuth"

    # 27. respecthopcodeignore -> respectHopcodeIgnore
    $content = $content -replace 'respecthopcodeignore', 'respectHopcodeIgnore'

    # 28. HOPCODE_DIR: '.hopcode' -> HOPCODE_DIR: '.hopcode'
    $content = $content -replace "HOPCODE_DIR:\s*'\.qwen'", "HOPCODE_DIR: '.hopcode'"

    # 29. matcheshopcodeHomeSurface -> matchesHopcodeHomeSurface
    $content = $content -replace 'matcheshopcodeHomeSurface', 'matchesHopcodeHomeSurface'

    # 30. normalizedhopcodeHome -> normalizedHopcodeHome
    $content = $content -replace 'normalizedhopcodeHome', 'normalizedHopcodeHome'

    # 31. hopcodeHomePrefixesCache -> hopcodeHomePrefixesCache
    $content = $content -replace 'hopcodeHomePrefixesCache', 'hopcodeHomePrefixesCache'

    # 32. initialhopcodeDir -> initialHopcodeDir
    $content = $content -replace 'initialhopcodeDir', 'initialHopcodeDir'

    # 33. discoveredDir from getGlobalhopcodeDir context (already handled above)

    # 34. HopCodeOAuth2Client class name string
    $content = $content -replace "name = 'HopCodeOAuthPollError'", "name = 'HopCodeOAuthPollError'"

    # 35. GEMINI_DIR_NAME = '.hopcode' -> '.hopcode'
    $content = $content -replace "GEMINI_DIR_NAME = '\.qwen'", "GEMINI_DIR_NAME = '.hopcode'"

    # 36. /tmp/qwen-global-test -> /tmp/hopcode-global-test
    $content = $content -replace '/tmp/qwen-global-test', '/tmp/hopcode-global-test'

    # 37. custom-qwen-home -> custom-hopcode-home
    $content = $content -replace 'custom-qwen-home', 'custom-hopcode-home'

    # 38. qwen-global-test -> hopcode-global-test
    $content = $content -replace 'qwen-global-test', 'hopcode-global-test'

    # 39. QWEN.local.md in test strings
    # Already covered by #3

    # 40. HOPCODE_dirname (if any remain)
    $content = $content -replace 'HOPCODE_dirname', 'hopcode_dirname'

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file, $content)
        $totalChanges++
    }
}

Write-Host "Modified $totalChanges files"