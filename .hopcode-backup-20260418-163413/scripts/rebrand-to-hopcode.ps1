# HopCode Rebranding Script (PowerShell)
# Transforms "Qwen Code" → "HopCode" with butterfly effect
#
# Usage: .\rebrand-to-hopcode.ps1 [-DryRun] [-Phase <1-5|all>]
#
# Phases:
#   1: Core Identity (package names, CLI command, config dir, env vars)
#   2: High Visibility (README, install scripts, extensions)
#   3: Source Code (copyrights, identifiers, CSS)
#   4: Documentation & Ecosystem
#   5: Infrastructure & Deployment

param(
    [switch]$DryRun = $false,
    [ValidateSet("1", "2", "3", "4", "5", "all")]
    [string]$Phase = "all",
    [switch]$Help = $false
)

# Configuration
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir
$BackupDir = Join-Path $RootDir ".hopcode-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Colors
function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Blue }
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }
function Write-Warning { Write-Host "[WARNING] $args" -ForegroundColor Yellow }
function Write-Error { Write-Host "[ERROR] $args" -ForegroundColor Red }

# Help message
if ($Help) {
    Write-Host "HopCode Rebranding Script"
    Write-Host ""
    Write-Host "Usage: .\rebrand-to-hopcode.ps1 [-DryRun] [-Phase <1-5|all>]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -DryRun     Show what would be changed without modifying files"
    Write-Host "  -Phase      Run specific phase (1-5) or 'all'"
    Write-Host "  -Help       Show this help message"
    Write-Host ""
    Write-Host "Phases:"
    Write-Host "  1: Core Identity (package names, CLI command, config dir, env vars)"
    Write-Host "  2: High Visibility (README, install scripts, extensions)"
    Write-Host "  3: Source Code (copyrights, identifiers, CSS)"
    Write-Host "  4: Documentation & Ecosystem"
    Write-Host "  5: Infrastructure & Deployment"
    exit 0
}

# Function to replace text in files
function Replace-InFile {
    param(
        [string]$File,
        [string]$Old,
        [string]$New
    )
    
    if (-not (Test-Path $File)) {
        return
    }
    
    $content = Get-Content -Path $File -Raw -Encoding UTF8
    
    if ($content -match [regex]::Escape($Old)) {
        if ($DryRun) {
            Write-Info "[DRY RUN] Would update: $File"
        } else {
            $newContent = $content -replace [regex]::Escape($Old), $New
            Set-Content -Path $File -Value $newContent -Encoding UTF8 -NoNewline
            Write-Info "Updated: $File"
        }
    }
}

# Function to replace in multiple files
function Replace-InFiles {
    param(
        [string]$Pattern,
        [string]$Old,
        [string]$New,
        [string]$Path = "."
    )
    
    $files = Get-ChildItem -Path $Path -Filter $Pattern -Recurse -File -ErrorAction SilentlyContinue
    
    foreach ($file in $files) {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        if ($content -match [regex]::Escape($Old)) {
            if ($DryRun) {
                Write-Info "[DRY RUN] Would update: $($file.FullName)"
            } else {
                $newContent = $content -replace [regex]::Escape($Old), $New
                Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
            }
        }
    }
}

# Create backup
function Create-Backup {
    if ($DryRun) {
        Write-Info "[DRY RUN] Would create backup directory: $BackupDir"
        return
    }
    
    Write-Info "Creating backup directory: $BackupDir"
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    
    # Backup critical files
    Copy-Item -Path (Join-Path $RootDir "package.json") -Destination $BackupDir -ErrorAction SilentlyContinue
    Copy-Item -Path (Join-Path $RootDir "README.md") -Destination $BackupDir -ErrorAction SilentlyContinue
    Copy-Item -Path (Join-Path $RootDir "packages") -Destination $BackupDir -Recurse -ErrorAction SilentlyContinue
    Copy-Item -Path (Join-Path $RootDir "scripts") -Destination $BackupDir -Recurse -ErrorAction SilentlyContinue
    Copy-Item -Path (Join-Path $RootDir "docs") -Destination $BackupDir -Recurse -ErrorAction SilentlyContinue
    
    Write-Success "Backup created successfully"
}

# Phase 1: Core Identity Changes
function Invoke-Phase1 {
    Write-Host "========================================="
    Write-Host "PHASE 1: Core Identity Changes"
    Write-Host "========================================="
    
    Write-Info "Updating root package.json..."
    Replace-InFile -File (Join-Path $RootDir "package.json") -Old "@qwen-code/qwen-code" -New "@hopcode/hopcode"
    Replace-InFile -File (Join-Path $RootDir "package.json") -Old "QwenLM/qwen-code" -New "TaimoorSiddiquiOfficial/HopCode"
    Replace-InFile -File (Join-Path $RootDir "package.json") -Old "ghcr.io/qwenlm/qwen-code" -New "ghcr.io/hopcode/hopcode"
    Replace-InFile -File (Join-Path $RootDir "package.json") -Old '"qwen": "cli.js"' -New '"hopcode": "cli.js"'
    
    Write-Info "Updating all package.json files..."
    Replace-InFiles -Pattern "package.json" -Old "@qwen-code/" -New "@hopcode/" -Path (Join-Path $RootDir "packages")
    Replace-InFiles -Pattern "package.json" -Old "qwen-code-vscode-ide-companion" -New "hopcode-vscode-ide-companion" -Path (Join-Path $RootDir "packages")
    Replace-InFiles -Pattern "package.json" -Old "ghcr.io/qwenlm/qwen-code" -New "ghcr.io/hopcode/hopcode" -Path (Join-Path $RootDir "packages")
    
    Write-Info "Updating environment variables..."
    Replace-InFiles -Pattern "*.ts" -Old "QWEN_CODE_" -New "HOPCODE_" -Path (Join-Path $RootDir "packages")
    Replace-InFiles -Pattern "*.js" -Old "QWEN_CODE_" -New "HOPCODE_" -Path (Join-Path $RootDir "packages")
    Replace-InFiles -Pattern "*.ts" -Old "QWEN_SANDBOX" -New "HOPCODE_SANDBOX" -Path (Join-Path $RootDir "packages")
    Replace-InFiles -Pattern "*.ts" -Old "QWEN_WORKING_DIR" -New "HOPCODE_WORKING_DIR" -Path (Join-Path $RootDir "packages")
    
    Write-Info "Updating config directory references..."
    Replace-InFiles -Pattern "*.sh" -Old ".qwen" -New ".hopcode" -Path (Join-Path $RootDir "scripts")
    Replace-InFiles -Pattern "*.bat" -Old ".qwen" -New ".hopcode" -Path (Join-Path $RootDir "scripts")
    Replace-InFiles -Pattern "*.ts" -Old ".qwen" -New ".hopcode" -Path (Join-Path $RootDir "packages")
    Replace-InFiles -Pattern "*.js" -Old ".qwen" -New ".hopcode" -Path (Join-Path $RootDir "packages")
    
    Write-Success "Phase 1 complete"
}

# Phase 2: High Visibility Changes
function Invoke-Phase2 {
    Write-Host "========================================="
    Write-Host "PHASE 2: High Visibility Changes"
    Write-Host "========================================="
    
    Write-Info "Updating README.md..."
    Replace-InFile -File (Join-Path $RootDir "README.md") -Old "Qwen Code" -New "HopCode"
    Replace-InFile -File (Join-Path $RootDir "README.md") -Old "qwenlm.github.io/qwen-code-docs" -New "hopcode.dev/docs"
    Replace-InFile -File (Join-Path $RootDir "README.md") -Old "@qwen-code/qwen-code" -New "@hopcode/hopcode"
    Replace-InFile -File (Join-Path $RootDir "README.md") -Old "npm install -g @qwen-code/qwen-code" -New "npm install -g @hopcode/hopcode"
    Replace-InFile -File (Join-Path $RootDir "README.md") -Old "brew install qwen-code" -New "brew install hopcode"
    Replace-InFile -File (Join-Path $RootDir "README.md") -Old "Why Qwen Code?" -New "Why HopCode?"
    Replace-InFile -File (Join-Path $RootDir "README.md") -Old "qwen-code-assets.oss-cn-hangzhou.aliyuncs.com" -New "hopcode-assets.example.com"
    
    Write-Info "Updating installation scripts..."
    $installDir = Join-Path $RootDir "scripts/installation"
    
    if (Test-Path (Join-Path $installDir "install-qwen-with-source.sh")) {
        Replace-InFile -File (Join-Path $installDir "install-qwen-with-source.sh") -Old "Qwen Code" -New "HopCode"
        Replace-InFile -File (Join-Path $installDir "install-qwen-with-source.sh") -Old "install_qwen_code" -New "install_hopcode"
        Replace-InFile -File (Join-Path $installDir "install-qwen-with-source.sh") -Old "@qwen-code/qwen-code" -New "@hopcode/hopcode"
        Replace-InFile -File (Join-Path $installDir "install-qwen-with-source.sh") -Old "QWEN_DIR" -New "HOPCODE_DIR"
        Replace-InFile -File (Join-Path $installDir "install-qwen-with-source.sh") -Old ".qwen" -New ".hopcode"
        
        if (-not $DryRun) {
            Rename-Item -Path (Join-Path $installDir "install-qwen-with-source.sh") -NewName "install-hopcode-with-source.sh"
        }
    }
    
    if (Test-Path (Join-Path $installDir "install-qwen-with-source.bat")) {
        Replace-InFile -File (Join-Path $installDir "install-qwen-with-source.bat") -Old "Qwen Code" -New "HopCode"
        Replace-InFile -File (Join-Path $installDir "install-qwen-with-source.bat") -Old ":InstallQwenCode" -New ":InstallHopCode"
        Replace-InFile -File (Join-Path $installDir "install-qwen-with-source.bat") -Old "@qwen-code/qwen-code" -New "@hopcode/hopcode"
        Replace-InFile -File (Join-Path $installDir "install-qwen-with-source.bat") -Old "%USERPROFILE%\.qwen" -New "%USERPROFILE%\.hopcode"
        
        if (-not $DryRun) {
            Rename-Item -Path (Join-Path $installDir "install-qwen-with-source.bat") -NewName "install-hopcode-with-source.bat"
        }
    }
    
    if (Test-Path (Join-Path $installDir "INSTALLATION_GUIDE.md")) {
        Replace-InFile -File (Join-Path $installDir "INSTALLATION_GUIDE.md") -Old "Qwen Code" -New "HopCode"
    }
    
    Write-Info "Updating VS Code extension..."
    $vscodePkg = Join-Path $RootDir "packages/vscode-ide-companion/package.json"
    if (Test-Path $vscodePkg) {
        Replace-InFile -File $vscodePkg -Old "qwen-code-vscode-ide-companion" -New "hopcode-vscode-ide-companion"
        Replace-InFile -File $vscodePkg -Old "Qwen Code Companion" -New "HopCode Companion"
        Replace-InFile -File $vscodePkg -Old "Enable Qwen Code" -New "Enable HopCode"
        Replace-InFile -File $vscodePkg -Old '"publisher": "qwenlm"' -New '"publisher": "hopcode"'
        Replace-InFile -File $vscodePkg -Old "qwen-code" -New "hopcode"
    }
    
    Write-Info "Updating Zed extension..."
    $zedExt = Join-Path $RootDir "packages/zed-extension/extension.toml"
    if (Test-Path $zedExt) {
        Replace-InFile -File $zedExt -Old 'id = "qwen-code"' -New 'id = "hopcode"'
        Replace-InFile -File $zedExt -Old 'name = "Qwen Code"' -New 'name = "HopCode"'
        Replace-InFile -File $zedExt -Old 'authors = ["Qwen Team"]' -New 'authors = ["HopCode Team"]'
        Replace-InFile -File $zedExt -Old "Qwen Code Agent Server" -New "HopCode Agent Server"
        Replace-InFile -File $zedExt -Old "QwenLM/qwen-code" -New "TaimoorSiddiquiOfficial/HopCode"
        Replace-InFile -File $zedExt -Old '[agent_servers.qwen-code]' -New '[agent_servers.hopcode]'
    }
    
    Write-Info "Updating WebUI package..."
    Replace-InFile -File (Join-Path $RootDir "packages/webui/vite.config.ts") -Old "QwenCodeWebUI" -New "HopCodeWebUI"
    Replace-InFile -File (Join-Path $RootDir "packages/webui/tailwind.preset.cjs") -Old "@qwen-code/webui" -New "@hopcode/webui"
    Replace-InFile -File (Join-Path $RootDir "packages/webui/src/styles/variables.css") -Old "--app-qwen-ivory" -New "--app-hopcode-ivory"
    Replace-InFile -File (Join-Path $RootDir "packages/webui/src/styles/variables.css") -Old "--qwen-corner-radius" -New "--hopcode-corner-radius"
    Replace-InFile -File (Join-Path $RootDir "packages/webui/src/styles/timeline.css") -Old ".qwen-message" -New ".hopcode-message"
    
    Write-Success "Phase 2 complete"
}

# Phase 3: Source Code & Internal Identifiers
function Invoke-Phase3 {
    Write-Host "========================================="
    Write-Host "PHASE 3: Source Code & Internal Identifiers"
    Write-Host "========================================="
    
    Write-Info "Updating copyright headers..."
    Replace-InFiles -Pattern "*.ts" -Old "Copyright 2025 Qwen" -New "Copyright 2026 HopCode Team" -Path (Join-Path $RootDir "packages")
    Replace-InFiles -Pattern "*.js" -Old "Copyright 2025 Qwen" -New "Copyright 2026 HopCode Team" -Path (Join-Path $RootDir "packages")
    Replace-InFiles -Pattern "*.tsx" -Old "Copyright 2025 Qwen" -New "Copyright 2026 HopCode Team" -Path (Join-Path $RootDir "packages")
    Replace-InFiles -Pattern "*.jsx" -Old "Copyright 2025 Qwen" -New "Copyright 2026 HopCode Team" -Path (Join-Path $RootDir "packages")
    
    Write-Info "Updating code identifiers..."
    Replace-InFiles -Pattern "*.ts" -Old "QwenCode" -New "HopCode" -Path (Join-Path $RootDir "packages")
    Replace-InFiles -Pattern "*.js" -Old "QwenCode" -New "HopCode" -Path (Join-Path $RootDir "packages")
    Replace-InFiles -Pattern "*.tsx" -Old "QwenCode" -New "HopCode" -Path (Join-Path $RootDir "packages")
    Replace-InFiles -Pattern "*.jsx" -Old "QwenCode" -New "HopCode" -Path (Join-Path $RootDir "packages")
    Replace-InFiles -Pattern "*.ts" -Old "qwenCode" -New "hopcodeCode" -Path (Join-Path $RootDir "packages")
    Replace-InFiles -Pattern "*.js" -Old "qwenCode" -New "hopcodeCode" -Path (Join-Path $RootDir "packages")
    
    Write-Info "Updating Java source files..."
    Replace-InFiles -Pattern "*.java" -Old "Copyright 2025 Qwen" -New "Copyright 2026 HopCode Team" -Path (Join-Path $RootDir "packages")
    
    Write-Info "Updating script files..."
    Replace-InFile -File (Join-Path $RootDir "Makefile") -Old "qwen-code" -New "hopcode"
    Replace-InFile -File (Join-Path $RootDir "scripts/prepare-package.js") -Old "Qwen Code" -New "HopCode"
    Replace-InFile -File (Join-Path $RootDir "scripts/dev.js") -Old "Qwen Code" -New "HopCode"
    
    Write-Success "Phase 3 complete"
}

# Phase 4: Documentation & Ecosystem
function Invoke-Phase4 {
    Write-Host "========================================="
    Write-Host "PHASE 4: Documentation & Ecosystem"
    Write-Host "========================================="
    
    Write-Info "Updating user documentation..."
    $docsUsers = Join-Path $RootDir "docs/users"
    if (Test-Path $docsUsers) {
        Get-ChildItem -Path $docsUsers -Filter "*.md" -Recurse -File | ForEach-Object {
            Replace-InFile -File $_.FullName -Old "Qwen Code" -New "HopCode"
            Replace-InFile -File $_.FullName -Old "qwen-code" -New "hopcode"
        }
    }
    
    Write-Info "Updating developer documentation..."
    $docsDevs = Join-Path $RootDir "docs/developers"
    if (Test-Path $docsDevs) {
        Get-ChildItem -Path $docsDevs -Filter "*.md" -Recurse -File | ForEach-Object {
            Replace-InFile -File $_.FullName -Old "Qwen Code" -New "HopCode"
            Replace-InFile -File $_.FullName -Old "qwen-code" -New "hopcode"
        }
    }
    
    Write-Info "Updating documentation site..."
    $docsSite = Join-Path $RootDir "docs-site/src/app/layout.jsx"
    if (Test-Path $docsSite) {
        Replace-InFile -File $docsSite -Old "QwenLM/qwen-code" -New "TaimoorSiddiquiOfficial/HopCode"
    }
    
    Write-Info "Updating SDK documentation..."
    $sdkReadme = Join-Path $RootDir "packages/sdk-typescript/README.md"
    if (Test-Path $sdkReadme) {
        Replace-InFile -File $sdkReadme -Old "@qwen-code/sdk" -New "@hopcode/sdk"
        Replace-InFile -File $sdkReadme -Old "qwen_code" -New "hopcode"
    }
    
    Write-Info "Updating Java SDK..."
    $javaSdk = Join-Path $RootDir "packages/sdk-java/QWEN.md"
    if (Test-Path $javaSdk -and -not $DryRun) {
        Rename-Item -Path $javaSdk -NewName "HOPCODE.md"
    }
    
    Write-Success "Phase 4 complete"
}

# Phase 5: Infrastructure & Deployment
function Invoke-Phase5 {
    Write-Host "========================================="
    Write-Host "PHASE 5: Infrastructure & Deployment"
    Write-Host "========================================="
    
    Write-Info "Updating GitHub workflows..."
    $workflows = Join-Path $RootDir ".github/workflows"
    if (Test-Path $workflows) {
        Get-ChildItem -Path $workflows -Filter "*.yml" -Recurse -File | ForEach-Object {
            Replace-InFile -File $_.FullName -Old "qwen-code" -New "hopcode"
            Replace-InFile -File $_.FullName -Old "@qwen-code/" -New "@hopcode/"
        }
    }
    
    Write-Info "Updating Docker configuration..."
    Replace-InFile -File (Join-Path $RootDir "Dockerfile") -Old "qwen-code" -New "hopcode"
    
    Write-Info "Updating git configuration..."
    Replace-InFile -File (Join-Path $RootDir ".gitignore") -Old ".qwen" -New ".hopcode"
    
    Write-Info "Updating integration tests..."
    $intTests = Join-Path $RootDir "integration-tests"
    if (Test-Path $intTests) {
        Get-ChildItem -Path $intTests -Include "*.ts", "*.js", "*.py" -Recurse -File | ForEach-Object {
            Replace-InFile -File $_.FullName -Old "qwen-code" -New "hopcode"
            Replace-InFile -File $_.FullName -Old "qwen_code" -New "hopcode"
        }
    }
    
    Write-Success "Phase 5 complete"
}

# Main execution
Write-Host "============================================"
Write-Host "  HopCode Rebranding Script"
Write-Host "  Qwen Code → HopCode Transformation"
Write-Host "============================================"
Write-Host ""

if ($DryRun) {
    Write-Warning "DRY RUN MODE - No files will be modified"
    Write-Host ""
}

# Create backup
Create-Backup

# Execute phases
switch ($Phase) {
    "1" { Invoke-Phase1 }
    "2" { Invoke-Phase2 }
    "3" { Invoke-Phase3 }
    "4" { Invoke-Phase4 }
    "5" { Invoke-Phase5 }
    "all" {
        Invoke-Phase1
        Invoke-Phase2
        Invoke-Phase3
        Invoke-Phase4
        Invoke-Phase5
    }
}

Write-Host ""
Write-Host "============================================"
if ($DryRun) {
    Write-Success "Dry run complete! Review the changes above."
    Write-Host "Run without -DryRun to apply changes."
} else {
    Write-Success "Rebranding complete!"
    Write-Host ""
    Write-Warning "IMPORTANT NEXT STEPS:"
    Write-Host "1. Review all changes with: git diff"
    Write-Host "2. Test installation scripts"
    Write-Host "3. Update and run test suite"
    Write-Host "4. Build all packages"
    Write-Host "5. Update CI/CD pipelines"
    Write-Host ""
    Write-Host "Backup location: $BackupDir"
}
Write-Host "============================================"
