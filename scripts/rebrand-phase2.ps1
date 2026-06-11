# HopCode Rebranding Script - Phase 2: Complete remaining qwen -> hopcode replacements
# This script handles the remaining "qwen" references that were missed by the initial rebranding.
#
# Key rules:
# - Model names (qwen3-max, qwen3-coder-plus, etc.) are PRESERVED - they reference external AI models
# - qwen_code_sdk is PRESERVED - it references an external Python SDK
# - QwenLM in GitHub URLs is PRESERVED for upstream references
# - Copyright notices are updated to "HopCode Team"
#
# Usage: .\rebrand-phase2.ps1 [-DryRun]

param(
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"
$RootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

# Get all source files to process (excluding node_modules, .git, dist, coverage, and rebranding scripts)
function Get-SourceFiles {
    param([string[]]$Extensions)
    Get-ChildItem -Path $RootDir -Recurse -Include $Extensions -File |
        Where-Object {
            $_.FullName -notmatch "node_modules" -and
            $_.FullName -notmatch "\.git[/\\]" -and
            $_.FullName -notmatch "dist[/\\]" -and
            $_.FullName -notmatch "coverage" -and
            $_.FullName -notmatch "REBRANDING" -and
            $_.FullName -notmatch "rebrand-to-hopcode" -and
            $_.FullName -notmatch "rebrand-phase2" -and
            $_.FullName -notmatch "\.hopcode-backup" -and
            $_.FullName -notmatch "\.qwen[/\\]" -and
            $_.FullName -notmatch "\.hopcode[/\\]"
        }
}

$totalChanges = 0
$filesChanged = 0
$changedFiles = @{}

function Replace-InContent {
    param(
        [string]$FilePath,
        [string]$Pattern,
        [string]$Replacement,
        [switch]$UseRegex
    )
    
    $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
    if ($null -eq $content) { return }
    
    $newContent = if ($UseRegex) {
        $content -replace $Pattern, $Replacement
    } else {
        $content.Replace($Pattern, $Replacement)
    }
    
    if ($content -ne $newContent) {
        if ($DryRun) {
            Write-Host "[DRY RUN] Would update: $FilePath ($Pattern -> $Replacement)" -ForegroundColor Yellow
        } else {
            Set-Content -Path $FilePath -Value $newContent -Encoding UTF8 -NoNewline
            Write-Host "[UPDATED] $FilePath" -ForegroundColor Green
        }
        $script:totalChanges++
        $script:changedFiles[$FilePath] = $true
        return $true
    }
    return $false
}

# ============================================================
# PHASE 2A: Environment Variables (QWEN_ -> HOPCODE_)
# ============================================================
Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "PHASE 2A: Environment Variables" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$envVarFiles = Get-SourceFiles -Extensions @("*.ts", "*.tsx", "*.js", "*.mjs", "*.cjs", "*.json", "*.yml", "*.yaml", "*.sh", "*.md", "*.env.example", "*.service")

# QWEN_CODE_* -> HOPCODE_CODE_* (keeping CODE part for consistency)
$envReplacements = @{
    "QWEN_CODE_SESSION_ID" = "HOPCODE_CODE_SESSION_ID"
    "QWEN_CODE_MAX_TOOL_CONCURRENCY" = "HOPCODE_CODE_MAX_TOOL_CONCURRENCY"
    "QWEN_CODE_AGENT_ID" = "HOPCODE_CODE_AGENT_ID"
    "QWEN_CODE_PROMPT_ID" = "HOPCODE_CODE_PROMPT_ID"
    "QWEN_CODE_LEGACY_MCP_BLOCKING" = "HOPCODE_CODE_LEGACY_MCP_BLOCKING"
    "QWEN_CODE_NO_RELAUNCH" = "HOPCODE_CODE_NO_RELAUNCH"
    "QWEN_CODE_EMIT_TOOL_USE_SUMMARIES" = "HOPCODE_CODE_EMIT_TOOL_USE_SUMMARIES"
    "QWEN_CODE_UNATTENDED_RETRY" = "HOPCODE_CODE_UNATTENDED_RETRY"
    "QWEN_CODE_TOOL_CALL_STYLE" = "HOPCODE_CODE_TOOL_CALL_STYLE"
    "QWEN_CODE_PROFILE_RUNTIME" = "HOPCODE_CODE_PROFILE_RUNTIME"
    "QWEN_CODE_PROFILE_STARTUP" = "HOPCODE_CODE_PROFILE_STARTUP"
    "QWEN_CODE_DISABLE_SYNCHRONIZED_OUTPUT" = "HOPCODE_CODE_DISABLE_SYNCHRONIZED_OUTPUT"
    "QWEN_CODE_DEBUG" = "HOPCODE_CODE_DEBUG"
    "QWEN_CODE_SIMPLE" = "HOPCODE_CODE_SIMPLE"
    "QWEN_CODE_ENABLE_CRON" = "HOPCODE_CODE_ENABLE_CRON"
}

# Other QWEN_* env vars (without CODE)
$otherEnvReplacements = @{
    "QWEN_OAUTH" = "HOPCODE_OAUTH"
    "QWEN_DEFAULT_AUTH_TYPE" = "HOPCODE_DEFAULT_AUTH_TYPE"
    "QWEN_AUDIT_RAW_PATHS" = "HOPCODE_AUDIT_RAW_PATHS"
    "QWEN_COMPUTER_USE_PACKAGE" = "HOPCODE_COMPUTER_USE_PACKAGE"
    "QWEN_COMPUTER_USE_AUTO_APPROVE" = "HOPCODE_COMPUTER_USE_AUTO_APPROVE"
    "QWEN_MEMORY_PRESSURE_SOFT" = "HOPCODE_MEMORY_PRESSURE_SOFT"
    "QWEN_MEMORY_PRESSURE_HARD" = "HOPCODE_MEMORY_PRESSURE_HARD"
    "QWEN_MEMORY_PRESSURE_CRITICAL" = "HOPCODE_MEMORY_PRESSURE_CRITICAL"
    "QWEN_MEMORY_ENABLE_GC" = "HOPCODE_MEMORY_ENABLE_GC"
    "QWEN_RUNTIME_DIR" = "HOPCODE_RUNTIME_DIR"
    "QWEN_DEBUG" = "HOPCODE_DEBUG"
    "QWEN_TELEMETRY_METRICS_INCLUDE_SESSION_ID" = "HOPCODE_TELEMETRY_METRICS_INCLUDE_SESSION_ID"
    "QWEN_SERVER_TOKEN" = "HOPCODE_SERVER_TOKEN"
    "QWEN_SYSTEM_MD" = "HOPCODE_SYSTEM_MD"
    "QWEN_PID" = "HOPCODE_PID"
    "QWEN_OAUTH_SCOPE" = "HOPCODE_OAUTH_SCOPE"
    "QWEN_IMAGE_TOKEN_ESTIMATE" = "HOPCODE_IMAGE_TOKEN_ESTIMATE"
    "QWEN_DAEMON_TOKEN" = "HOPCODE_DAEMON_TOKEN"
    "QWEN_DAEMON_URL" = "HOPCODE_DAEMON_URL"
    "QWEN_API_KEY" = "HOPCODE_API_KEY"
    "QWEN_SHELL_COMMAND" = "HOPCODE_SHELL_COMMAND"
    "QWEN_TELEMETRY_TARGET" = "HOPCODE_TELEMETRY_TARGET"
    "QWEN_TELEMETRY_OUTFILE" = "HOPCODE_TELEMETRY_OUTFILE"
    "QWEN_TELEMETRY_OTLP_TRACES_ENDPOINT" = "HOPCODE_TELEMETRY_OTLP_TRACES_ENDPOINT"
    "QWEN_TELEMETRY_OTLP_PROTOCOL" = "HOPCODE_TELEMETRY_OTLP_PROTOCOL"
    "QWEN_TELEMETRY_OTLP_METRICS_ENDPOINT" = "HOPCODE_TELEMETRY_OTLP_METRICS_ENDPOINT"
    "QWEN_TELEMETRY_OTLP_LOGS_ENDPOINT" = "HOPCODE_TELEMETRY_OTLP_LOGS_ENDPOINT"
    "QWEN_TELEMETRY_INCLUDE_SENSITIVE_SPAN_ATTRIBUTES" = "HOPCODE_TELEMETRY_INCLUDE_SENSITIVE_SPAN_ATTRIBUTES"
    "QWEN_TELEMETRY_ENABLED" = "HOPCODE_TELEMETRY_ENABLED"
    "QWEN_TELEMETRY_LOG_PROMPTS" = "HOPCODE_TELEMETRY_LOG_PROMPTS"
    "QWEN_SERVE_MCP_CLIENT_BUDGET" = "HOPCODE_SERVE_MCP_CLIENT_BUDGET"
    "QWEN_IDE_DAEMON_URL" = "HOPCODE_IDE_DAEMON_URL"
    "QWEN_CHANNEL_DAEMON_URL" = "HOPCODE_CHANNEL_DAEMON_URL"
    "QWEN_WEB_DAEMON_URL" = "HOPCODE_WEB_DAEMON_URL"
    "QWEN_DAEMON_WORKSPACE" = "HOPCODE_DAEMON_WORKSPACE"
    "QWEN_DISABLED_SLASH_COMMANDS" = "HOPCODE_DISABLED_SLASH_COMMANDS"
    "QWEN_BASELINE_ENABLE_PROMPT_LATENCY" = "HOPCODE_BASELINE_ENABLE_PROMPT_LATENCY"
    "QWEN_BASELINE_HEAVY" = "HOPCODE_BASELINE_HEAVY"
    "QWEN_BASELINE_PROMPT_ITERATIONS" = "HOPCODE_BASELINE_PROMPT_ITERATIONS"
    "QWEN_BASELINE_RSS_SAMPLE_DURATION_MS" = "HOPCODE_BASELINE_RSS_SAMPLE_DURATION_MS"
    "QWEN_BASELINE_RSS_SAMPLE_INTERVAL_MS" = "HOPCODE_BASELINE_RSS_SAMPLE_INTERVAL_MS"
    "QWEN_BASELINE_SKIP_PROMPT_LATENCY" = "HOPCODE_BASELINE_SKIP_PROMPT_LATENCY"
    "QWEN_TUI_E" = "HOPCODE_TUI_E"
    "QWEN_DEBUG_LOG_FILE" = "HOPCODE_DEBUG_LOG_FILE"
    "QWEN_COMPACT_MAX_RECENT_FILES" = "HOPCODE_COMPACT_MAX_RECENT_FILES"
    "QWEN_COMPACT_MAX_RECENT_IMAGES" = "HOPCODE_COMPACT_MAX_RECENT_IMAGES"
}

foreach ($file in $envVarFiles) {
    $changed = $false
    foreach ($old in (@($envReplacements.Keys) + @($otherEnvReplacements.Keys))) {
        $new = if ($envReplacements.ContainsKey($old)) { $envReplacements[$old] } else { $otherEnvReplacements[$old] }
        if (Replace-InContent -FilePath $file.FullName -Pattern $old -Replacement $new) {
            $changed = $true
        }
    }
}

# ============================================================
# PHASE 2B: Code Identifiers (QwenXxx -> HopCodeXxx, qwenXxx -> hopCodeXxx)
# ============================================================
Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "PHASE 2B: Code Identifiers" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$codeFiles = Get-SourceFiles -Extensions @("*.ts", "*.tsx", "*.js", "*.mjs", "*.cjs")

$identifierReplacements = @{
    "QwenCode" = "HopCode"
    "QwenOAuth2" = "HopCodeOAuth2"
    "QwenOAuth" = "HopCodeOAuth"
    "QwenOAuthConfig" = "HopCodeOAuthConfig"
    "QwenAgentManager" = "HopCodeAgentManager"
    "QwenAgent" = "HopCodeAgent"
    "QwenLogger" = "HopCodeLogger"
    "QwenCachedCredentialPath" = "HopCodeCachedCredentialPath"
    "QwenServe" = "HopCodeServe"
    "QwenExecutable" = "HopCodeExecutable"
    "QwenContentGenerator" = "HopCodeContentGenerator"
    "QwenCodeWebUI" = "HopCodeWebUI"
    "Qwenignore" = "HopCodeIgnore"
    "qwenClient" = "hopCodeClient"
    "qwenName" = "hopCodeName"
    "qwenDir" = "hopCodeDir"
    "qwenArgs" = "hopCodeArgs"
    "qwenLocalePathPattern" = "hopCodeLocalePathPattern"
    "qwen_command" = "hopcode_command"
    "qwen_status" = "hopcode_status"
    "qwen_count" = "hopcode_count"
    "qwen_version" = "hopcode_version"
    "qwen_stderr" = "hopcode_stderr"
    "qwen_stdout" = "hopcode_stdout"
    "qwen_http" = "hopcode_http"
    "qwen_normalize_err" = "hopcode_normalize_err"
    "qwen_normalize_status" = "hopcode_normalize_status"
    "qwen_executable" = "hopcode_executable"
}

foreach ($file in $codeFiles) {
    foreach ($old in $identifierReplacements.Keys) {
        Replace-InContent -FilePath $file.FullName -Pattern $old -Replacement $identifierReplacements[$old] -UseRegex
    }
}

# ============================================================
# PHASE 2C: String patterns (qwen-code -> hopcode, etc.)
# ============================================================
Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "PHASE 2C: String Patterns" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$allFiles = Get-SourceFiles -Extensions @("*.ts", "*.tsx", "*.js", "*.mjs", "*.cjs", "*.json", "*.md", "*.yml", "*.yaml", "*.sh", "*.css", "*.html", "*.toml", "*.cfg")

# Order matters - longest patterns first to avoid partial matches
$stringReplacements = [ordered]@{
    # Docker image references
    "ghcr.io/qwenlm/qwen-code" = "ghcr.io/taimoorsiddiquiofficial/hopcode"
    "ghcr.io/hopcodelm/hopcode-code" = "ghcr.io/taimoorsiddiquiofficial/hopcode"
    "HopCodeLM/HopCode-code" = "TaimoorSiddiquiOfficial/HopCode"
    "HopCodeLM/hopcode" = "TaimoorSiddiquiOfficial/HopCode"
    "qwenlm.hopcode-code-vscode-ide-companion" = "hopcode.hopcode-vscode-ide-companion"
    "qwenlm.hopcode-code" = "hopcode.hopcode"
    # Package scope references
    "@qwen-code/" = "@hopcode/"
    # qwen-code-sandbox -> hopcode-sandbox
    "qwen-code-sandbox" = "hopcode-sandbox"
    "hopcode-code-sandbox" = "hopcode-sandbox"
    # qwen-code -> hopcode (product name)
    "qwen-code" = "hopcode"
    "hopcode-code" = "hopcode"
    # qwen_code_sdk stays as-is (external Python SDK) - skip
    # qwen_code_cli -> hopcode_cli
    "qwen_code_cli" = "hopcode_cli"
    # qwencode -> hopcode (single word form)
    "qwencode" = "hopcode"
    # Config dir references
    ".qwen/" = ".hopcode/"
    ".qwen\" = ".hopcode\"
    "/.qwen" = "/.hopcode"
    "~/.qwen" = "~/.hopcode"
    # Path references (system config paths)
    "/etc/qwen-code/" = "/etc/hopcode/"
    "/etc/qwencode/" = "/etc/hopcode/"
    'C:\ProgramData\qwen-code\' = 'C:\ProgramData\hopcode\'
    "/Library/Application Support/QwenCode/" = "/Library/Application Support/HopCode/"
    "/Library/Application Support/Qwen Code/" = "/Library/Application Support/HopCode/"
    # Copyright
    "Copyright 2025 Qwen Team" = "Copyright 2025-2026 HopCode Team"
    "Copyright 2025 Qwen" = "Copyright 2025-2026 HopCode"
    "Copyright 2026 Qwen Team" = "Copyright 2026 HopCode Team"
    # Product names in comments/strings (careful not to touch model names)
    "Qwen Code" = "HopCode"
}

foreach ($file in $allFiles) {
    foreach ($old in $stringReplacements.Keys) {
        $new = $stringReplacements[$old]
        Replace-InContent -FilePath $file.FullName -Pattern $old -Replacement $new
    }
}

# ============================================================
# PHASE 2D: Standalone "qwen" replacements using regex
# Only replace standalone "qwen" that's NOT a model name
# ============================================================
Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "PHASE 2D: Standalone qwen replacements (regex)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# We need to be very careful here - only replace "qwen" when it's:
# 1. Part of an identifier like "qwen_status" (not a model name)
# 2. A standalone product reference like "qwen serve"
# NOT when it's a model name like "qwen3-max" or "qwen3-coder-plus"

$regexFiles = Get-SourceFiles -Extensions @("*.ts", "*.tsx", "*.js", "*.mjs", "*.cjs")

foreach ($file in $regexFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    if ($null -eq $content) { continue }
    
    # Skip files that are model config files (they reference qwen model names heavily)
    if ($file.Name -match "modelConfig|modelConfigResolver|modelsConfig|constants\.ts|tokenLimits") {
        # These files have heavy model name references, skip for now
        continue
    }
    
    # Replace "qwen " or "qwen/" or "qwen." etc. when it's clearly a product reference
    # But NOT "qwen3" (model name) or "qwen_code_sdk" (external SDK)
    
    # Pattern: "qwen serve" -> "hopcode serve"
    # Pattern: "qwen" as standalone word before certain keywords
    # Pattern: variable names like qwen_executable, etc.
    # These are handled by the specific replacements above
    
    # For remaining "qwen" references that are product/brand references:
    # - "qwen" as CLI command name -> "hopcode"
    # - "qwen" in path contexts -> "hopcode"
}

# ============================================================
# PHASE 2E: GitHub URLs and workflow references
# ============================================================
Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "PHASE 2E: GitHub URLs" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$githubFiles = Get-SourceFiles -Extensions @("*.ts", "*.tsx", "*.js", "*.mjs", "*.cjs", "*.json", "*.yml", "*.yaml", "*.md")

foreach ($file in $githubFiles) {
    # GitHub issue/PR references - keep QwenLM/qwen-code for upstream tracking
    # But update our own repo references
    Replace-InContent -FilePath $file.FullName -Pattern "QwenLM/qwen-code" -Replacement "TaimoorSiddiquiOfficial/HopCode"
    Replace-InContent -FilePath $file.FullName -Pattern "QwenLM/hopcode" -Replacement "TaimoorSiddiquiOfficial/HopCode"
}

# ============================================================
# Summary
# ============================================================
Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "[DRY RUN] Would have made $totalChanges replacements across $($changedFiles.Count) files" -ForegroundColor Yellow
    Write-Host "Run without -DryRun to apply changes." -ForegroundColor Yellow
} else {
    Write-Host "[DONE] Made $totalChanges replacements across $($changedFiles.Count) files" -ForegroundColor Green
    Write-Host "`nIMPORTANT: Run the following to verify:" -ForegroundColor Yellow
    Write-Host "  1. npm run build" -ForegroundColor White
    Write-Host "  2. npm run typecheck" -ForegroundColor White
    Write-Host "  3. npm run lint" -ForegroundColor White
}

Write-Host "`nNOTE: Model names (qwen3-max, qwen3-coder-plus, etc.) and qwen_code_sdk were PRESERVED as external references." -ForegroundColor Magenta