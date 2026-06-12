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

    # 1. Storage.getGlobalQwenDir() -> Storage.getGlobalHopCodeDir()
    $content = $content -replace 'Storage\.getGlobalQwenDir\(\)', 'Storage.getGlobalHopCodeDir()'

    # 2. getGlobalQwenDir: (mock in tests) -> getGlobalHopCodeDir:
    $content = $content -replace 'getGlobalQwenDir:', 'getGlobalHopCodeDir:'

    # 3. QWEN.md -> HOPCODE.md (context instruction file name)
    $content = $content -replace 'QWEN\.md', 'HOPCODE.md'
    $content = $content -replace 'QWEN\.local\.md', 'HOPCODE.local.md'
    $content = $content -replace 'QWEN\.LOCAL\.MD', 'HOPCODE.LOCAL.MD'
    $content = $content -replace 'qwen\.md', 'hopcode.md'

    # 4. DEFAULT_CONTEXT_FILENAME: 'QWEN.md' -> 'HOPCODE.md' (already covered above)

    # 5. QwenCode namespace/product -> HopCode
    $content = $content -replace 'QwenCode', 'HopCode'

    # 6. QwenAgent -> HopCodeAgent
    $content = $content -replace 'QwenAgent', 'HopCodeAgent'

    # 7. qwenVersion -> hopcodeVersion
    $content = $content -replace 'qwenVersion', 'hopcodeVersion'

    # 8. .qwenignore -> .hopcodeignore
    $content = $content -replace '\.qwenignore', '.hopcodeignore'

    # 9. shouldQwenIgnoreFile -> shouldHopcodeIgnoreFile
    $content = $content -replace 'shouldQwenIgnoreFile', 'shouldHopcodeIgnoreFile'

    # 10. useQwenignore -> useHopcodeignore
    $content = $content -replace 'useQwenignore', 'useHopcodeignore'

    # 11. qwenHome -> hopcodeHome (variable names)
    $content = $content -replace 'qwenHome', 'hopcodeHome'

    # 12. qwen-home- temp dir prefix
    $content = $content -replace 'qwen-home-', 'hopcode-home-'

    # 13. globalQwenDir -> globalHopcodeDir (variable names)
    $content = $content -replace 'globalQwenDir', 'globalHopcodeDir'

    # 14. .qwen directory references in code/tests (not model names)
    # Already handled in pass 1 for most cases, but clean up remaining
    $content = $content -replace "path\.join\([^)]*'\.qwen'", "path.join([^)]*'.hopcode'"
    $content = $content -replace '\.qwen\b', '.hopcode'

    # 15. QwenOAuth2Client -> HopCodeOAuth2Client
    $content = $content -replace 'QwenOAuth2Client', 'HopCodeOAuth2Client'

    # 16. IQwenOAuth2Client -> IHopCodeOAuth2Client
    $content = $content -replace 'IQwenOAuth2Client', 'IHopCodeOAuth2Client'

    # 17. QwenCredentials -> HopCodeCredentials
    $content = $content -replace 'QwenCredentials', 'HopCodeCredentials'

    # 18. QwenOAuthPollError -> HopCodeOAuthPollError
    $content = $content -replace 'QwenOAuthPollError', 'HopCodeOAuthPollError'

    # 19. QwenOAuth2Event -> HopCodeOAuth2Event
    $content = $content -replace 'QwenOAuth2Event', 'HopCodeOAuth2Event'

    # 20. qwenOAuth2Events -> hopcodeOAuth2Events
    $content = $content -replace 'qwenOAuth2Events', 'hopcodeOAuth2Events'

    # 21. getQwenOAuthClient -> getHopCodeOAuthClient
    $content = $content -replace 'getQwenOAuthClient', 'getHopCodeOAuthClient'

    # 22. cacheQwenCredentials -> cacheHopCodeCredentials
    $content = $content -replace 'cacheQwenCredentials', 'cacheHopCodeCredentials'

    # 23. clearQwenCredentials -> clearHopCodeCredentials
    $content = $content -replace 'clearQwenCredentials', 'clearHopCodeCredentials'

    # 24. getQwenCachedCredentialPath -> getHopCodeCachedCredentialPath
    $content = $content -replace 'getQwenCachedCredentialPath', 'getHopCodeCachedCredentialPath'

    # 25. authWithQwenDeviceFlow -> authWithHopCodeDeviceFlow
    $content = $content -replace 'authWithQwenDeviceFlow', 'authWithHopCodeDeviceFlow'

    # 26. QwenOAuth2 class/function references in strings
    $content = $content -replace "'QwenOAuthPollError'", "'HopCodeOAuthPollError'"
    $content = $content -replace "Qwen OAuth", "HopCode OAuth"

    # 27. respectQwenIgnore -> respectHopcodeIgnore
    $content = $content -replace 'respectQwenIgnore', 'respectHopcodeIgnore'

    # 28. HOPCODE_DIR: '.qwen' -> HOPCODE_DIR: '.hopcode'
    $content = $content -replace "HOPCODE_DIR:\s*'\.qwen'", "HOPCODE_DIR: '.hopcode'"

    # 29. matchesQwenHomeSurface -> matchesHopcodeHomeSurface
    $content = $content -replace 'matchesQwenHomeSurface', 'matchesHopcodeHomeSurface'

    # 30. normalizedQwenHome -> normalizedHopcodeHome
    $content = $content -replace 'normalizedQwenHome', 'normalizedHopcodeHome'

    # 31. qwenHomePrefixesCache -> hopcodeHomePrefixesCache
    $content = $content -replace 'qwenHomePrefixesCache', 'hopcodeHomePrefixesCache'

    # 32. initialQwenDir -> initialHopcodeDir
    $content = $content -replace 'initialQwenDir', 'initialHopcodeDir'

    # 33. discoveredDir from getGlobalQwenDir context (already handled above)

    # 34. QwenOAuth2Client class name string
    $content = $content -replace "name = 'QwenOAuthPollError'", "name = 'HopCodeOAuthPollError'"

    # 35. GEMINI_DIR_NAME = '.qwen' -> '.hopcode'
    $content = $content -replace "GEMINI_DIR_NAME = '\.qwen'", "GEMINI_DIR_NAME = '.hopcode'"

    # 36. /tmp/qwen-global-test -> /tmp/hopcode-global-test
    $content = $content -replace '/tmp/qwen-global-test', '/tmp/hopcode-global-test'

    # 37. custom-qwen-home -> custom-hopcode-home
    $content = $content -replace 'custom-qwen-home', 'custom-hopcode-home'

    # 38. qwen-global-test -> hopcode-global-test
    $content = $content -replace 'qwen-global-test', 'hopcode-global-test'

    # 39. QWEN.local.md in test strings
    # Already covered by #3

    # 40. qwen_dirname (if any remain)
    $content = $content -replace 'qwen_dirname', 'hopcode_dirname'

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file, $content)
        $totalChanges++
    }
}

Write-Host "Modified $totalChanges files"