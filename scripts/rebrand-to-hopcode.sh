#!/bin/bash

# HopCode Rebranding Script
# Transforms "Qwen Code" → "HopCode" with butterfly effect
# 
# Usage: ./rebrand-to-hopcode.sh [--dry-run] [--phase <1-5>]
#
# Phases:
#   1: Core Identity (package names, CLI command, config dir, env vars)
#   2: High Visibility (README, install scripts, extensions)
#   3: Source Code (copyrights, identifiers, CSS)
#   4: Documentation & Ecosystem
#   5: Infrastructure & Deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DRY_RUN=false
PHASE="all"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${SCRIPT_DIR}/.hopcode-backup-$(date +%Y%m%d-%H%M%S)"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --phase)
            PHASE="$2"
            shift 2
            ;;
        -h|--help)
            echo "HopCode Rebranding Script"
            echo ""
            echo "Usage: $0 [--dry-run] [--phase <1-5|all>]"
            echo ""
            echo "Options:"
            echo "  --dry-run     Show what would be changed without modifying files"
            echo "  --phase       Run specific phase (1-5) or 'all'"
            echo "  -h, --help    Show this help message"
            echo ""
            echo "Phases:"
            echo "  1: Core Identity (package names, CLI command, config dir, env vars)"
            echo "  2: High Visibility (README, install scripts, extensions)"
            echo "  3: Source Code (copyrights, identifiers, CSS)"
            echo "  4: Documentation & Ecosystem"
            echo "  5: Infrastructure & Deployment"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

create_backup() {
    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] Would create backup directory: $BACKUP_DIR"
        return
    fi
    
    log_info "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    
    # Backup critical files
    cp -r package.json "$BACKUP_DIR/" 2>/dev/null || true
    cp -r README.md "$BACKUP_DIR/" 2>/dev/null || true
    cp -r packages "$BACKUP_DIR/" 2>/dev/null || true
    cp -r scripts "$BACKUP_DIR/" 2>/dev/null || true
    cp -r docs "$BACKUP_DIR/" 2>/dev/null || true
    
    log_success "Backup created successfully"
}

# Function to replace text in files
replace_in_file() {
    local file="$1"
    local old="$2"
    local new="$3"
    
    if [ ! -f "$file" ]; then
        return
    fi
    
    if [ "$DRY_RUN" = true ]; then
        if grep -q "$old" "$file" 2>/dev/null; then
            log_info "[DRY RUN] Would update: $file"
        fi
        return
    fi
    
    # Check if file contains the old string
    if grep -q "$old" "$file" 2>/dev/null; then
        # Use sed with appropriate delimiter for paths
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|${old}|${new}|g" "$file"
        else
            sed -i "s|${old}|${new}|g" "$file"
        fi
    fi
}

# Function to replace in multiple files matching pattern
replace_in_files() {
    local pattern="$1"
    local old="$2"
    local new="$3"
    
    if [ "$DRY_RUN" = true ]; then
        local count=$(grep -rl "$old" . --include="$pattern" 2>/dev/null | wc -l)
        if [ "$count" -gt 0 ]; then
            log_info "[DRY RUN] Would update $count files matching '$pattern'"
        fi
        return
    fi
    
    log_info "Updating files matching: $pattern"
    find . -type f -name "$pattern" -exec sed -i "s|${old}|${new}|g" {} \; 2>/dev/null || true
}

# Phase 1: Core Identity Changes
phase_1_core_identity() {
    log_info "========================================="
    log_info "PHASE 1: Core Identity Changes"
    log_info "========================================="
    
    # 1.1 Root package.json
    log_info "Updating root package.json..."
    replace_in_file "package.json" "@qwen-code/qwen-code" "@hopcode/hopcode"
    replace_in_file "package.json" "QwenLM/qwen-code" "TaimoorSiddiquiOfficial/HopCode"
    replace_in_file "package.json" "ghcr.io/qwenlm/qwen-code" "ghcr.io/hopcode/hopcode"
    replace_in_file "package.json" '"qwen": "cli.js"' '"hopcode": "cli.js"'
    
    # 1.2 All package.json files
    log_info "Updating all package.json files..."
    find packages -name "package.json" -type f | while read -r pkg; do
        replace_in_file "$pkg" "@qwen-code/" "@hopcode/"
        replace_in_file "$pkg" "qwen-code-vscode-ide-companion" "hopcode-vscode-ide-companion"
        replace_in_file "$pkg" "ghcr.io/qwenlm/qwen-code" "ghcr.io/hopcode/hopcode"
        replace_in_file "$pkg" '"qwen":' '"hopcode":'
    done
    
    # 1.3 Environment variables in source files
    log_info "Updating environment variables..."
    replace_in_files "*.ts" "QWEN_CODE_" "HOPCODE_"
    replace_in_files "*.js" "QWEN_CODE_" "HOPCODE_"
    replace_in_files "*.ts" "QWEN_SANDBOX" "HOPCODE_SANDBOX"
    replace_in_files "*.js" "QWEN_SANDBOX" "HOPCODE_SANDBOX"
    replace_in_files "*.ts" "QWEN_WORKING_DIR" "HOPCODE_WORKING_DIR"
    replace_in_files "*.js" "QWEN_WORKING_DIR" "HOPCODE_WORKING_DIR"
    
    # 1.4 Configuration directory references
    log_info "Updating config directory references..."
    replace_in_files "*.sh" "\.hopcode" ".hopcode"
    replace_in_files "*.bat" "\\.hopcode" ".hopcode"
    replace_in_files "*.ts" "\.hopcode" ".hopcode"
    replace_in_files "*.js" "\.hopcode" ".hopcode"
    
    log_success "Phase 1 complete"
}

# Phase 2: High Visibility Changes
phase_2_high_visibility() {
    log_info "========================================="
    log_info "PHASE 2: High Visibility Changes"
    log_info "========================================="
    
    # 2.1 README.md
    log_info "Updating README.md..."
    replace_in_file "README.md" "Qwen Code" "HopCode"
    replace_in_file "README.md" "qwenlm.github.io/qwen-code-docs" "hopcode.dev/docs"
    replace_in_file "README.md" "@qwen-code/qwen-code" "@hopcode/hopcode"
    replace_in_file "README.md" "npm install -g @qwen-code/qwen-code" "npm install -g @hopcode/hopcode"
    replace_in_file "README.md" "brew install qwen-code" "brew install hopcode"
    replace_in_file "README.md" " qwen " " hopcode "
    replace_in_file "README.md" "Why Qwen Code?" "Why HopCode?"
    replace_in_file "README.md" "qwen-code-assets.oss-cn-hangzhou.aliyuncs.com" "hopcode-assets.example.com"
    
    # 2.2 Installation scripts
    log_info "Updating installation scripts..."
    
    # Shell script
    if [ -f "scripts/installation/install-qwen-with-source.sh" ]; then
        replace_in_file "scripts/installation/install-qwen-with-source.sh" "Qwen Code" "HopCode"
        replace_in_file "scripts/installation/install-qwen-with-source.sh" "install_qwen_code" "install_hopcode"
        replace_in_file "scripts/installation/install-qwen-with-source.sh" "@qwen-code/qwen-code" "@hopcode/hopcode"
        replace_in_file "scripts/installation/install-qwen-with-source.sh" "QWEN_DIR" "HOPCODE_DIR"
        replace_in_file "scripts/installation/install-qwen-with-source.sh" "\.hopcode" ".hopcode"
        
        if [ "$DRY_RUN" = false ]; then
            mv "scripts/installation/install-qwen-with-source.sh" "scripts/installation/install-hopcode-with-source.sh"
        fi
    fi
    
    # Batch script
    if [ -f "scripts/installation/install-qwen-with-source.bat" ]; then
        replace_in_file "scripts/installation/install-qwen-with-source.bat" "Qwen Code" "HopCode"
        replace_in_file "scripts/installation/install-qwen-with-source.bat" ":InstallQwenCode" ":InstallHopCode"
        replace_in_file "scripts/installation/install-qwen-with-source.bat" "@qwen-code/qwen-code" "@hopcode/hopcode"
        replace_in_file "scripts/installation/install-qwen-with-source.bat" "%USERPROFILE%\\.hopcode" "%USERPROFILE%\\.hopcode"
        
        if [ "$DRY_RUN" = false ]; then
            mv "scripts/installation/install-qwen-with-source.bat" "scripts/installation/install-hopcode-with-source.bat"
        fi
    fi
    
    # Installation guide
    if [ -f "scripts/installation/INSTALLATION_GUIDE.md" ]; then
        replace_in_file "scripts/installation/INSTALLATION_GUIDE.md" "Qwen Code" "HopCode"
    fi
    
    # 2.3 VS Code Extension
    log_info "Updating VS Code extension..."
    if [ -f "packages/vscode-ide-companion/package.json" ]; then
        replace_in_file "packages/vscode-ide-companion/package.json" "qwen-code-vscode-ide-companion" "hopcode-vscode-ide-companion"
        replace_in_file "packages/vscode-ide-companion/package.json" "Qwen Code Companion" "HopCode Companion"
        replace_in_file "packages/vscode-ide-companion/package.json" "Enable Qwen Code" "Enable HopCode"
        replace_in_file "packages/vscode-ide-companion/package.json" '"publisher": "qwenlm"' '"publisher": "hopcode"'
        replace_in_file "packages/vscode-ide-companion/package.json" "qwen-code" "hopcode"
        replace_in_file "packages/vscode-ide-companion/package.json" "qwenlm.hopcode-code" "hopcode.hopcode"
    fi
    
    # 2.4 Zed Extension
    log_info "Updating Zed extension..."
    if [ -f "packages/zed-extension/extension.toml" ]; then
        replace_in_file "packages/zed-extension/extension.toml" 'id = "qwen-code"' 'id = "hopcode"'
        replace_in_file "packages/zed-extension/extension.toml" 'name = "Qwen Code"' 'name = "HopCode"'
        replace_in_file "packages/zed-extension/extension.toml" 'authors = \["Qwen Team"\]' 'authors = ["HopCode Team"]'
        replace_in_file "packages/zed-extension/extension.toml" "Qwen Code Agent Server" "HopCode Agent Server"
        replace_in_file "packages/zed-extension/extension.toml" "QwenLM/qwen-code" "TaimoorSiddiquiOfficial/HopCode"
        replace_in_file "packages/zed-extension/extension.toml" '\[agent_servers.hopcode-code\]' '[agent_servers.hopcode]'
    fi
    
    # 2.5 WebUI Package
    log_info "Updating WebUI package..."
    replace_in_file "packages/webui/vite.config.ts" "QwenCodeWebUI" "HopCodeWebUI"
    replace_in_file "packages/webui/tailwind.preset.cjs" "@qwen-code/webui" "@hopcode/webui"
    replace_in_file "packages/webui/src/styles/variables.css" "--app-qwen-ivory" "--app-hopcode-ivory"
    replace_in_file "packages/webui/src/styles/variables.css" "--qwen-corner-radius" "--hopcode-corner-radius"
    replace_in_file "packages/webui/src/styles/timeline.css" ".hopcode-message" ".hopcode-message"
    
    log_success "Phase 2 complete"
}

# Phase 3: Source Code & Internal Identifiers
phase_3_source_code() {
    log_info "========================================="
    log_info "PHASE 3: Source Code & Internal Identifiers"
    log_info "========================================="
    
    # 3.1 Copyright headers
    log_info "Updating copyright headers..."
    replace_in_files "*.ts" "Copyright 2025 Qwen" "Copyright 2026 HopCode Team"
    replace_in_files "*.js" "Copyright 2025 Qwen" "Copyright 2026 HopCode Team"
    replace_in_files "*.tsx" "Copyright 2025 Qwen" "Copyright 2026 HopCode Team"
    replace_in_files "*.jsx" "Copyright 2025 Qwen" "Copyright 2026 HopCode Team"
    
    # 3.2 Code identifiers
    log_info "Updating code identifiers..."
    replace_in_files "*.ts" "QwenCode" "HopCode"
    replace_in_files "*.js" "QwenCode" "HopCode"
    replace_in_files "*.tsx" "QwenCode" "HopCode"
    replace_in_files "*.jsx" "QwenCode" "HopCode"
    replace_in_files "*.ts" "qwenCode" "hopcodeCode"
    replace_in_files "*.js" "qwenCode" "hopcodeCode"
    
    # 3.3 Java files (with caution)
    log_info "Updating Java source files..."
    replace_in_files "*.java" "Copyright 2025 Qwen" "Copyright 2026 HopCode Team"
    # Note: Keeping com.alibaba.hopcode package names for Maven compatibility
    
    # 3.4 Script files
    log_info "Updating script files..."
    replace_in_file "Makefile" "qwen-code" "hopcode"
    replace_in_file "scripts/prepare-package.js" "Qwen Code" "HopCode"
    replace_in_file "scripts/dev.js" "Qwen Code" "HopCode"
    replace_in_file "scripts/create_alias.sh" "qwen" "hopcode"
    
    log_success "Phase 3 complete"
}

# Phase 4: Documentation & Ecosystem
phase_4_documentation() {
    log_info "========================================="
    log_info "PHASE 4: Documentation & Ecosystem"
    log_info "========================================="
    
    # 4.1 User documentation
    log_info "Updating user documentation..."
    find docs/users -name "*.md" -type f | while read -r file; do
        replace_in_file "$file" "Qwen Code" "HopCode"
        replace_in_file "$file" "qwen-code" "hopcode"
    done
    
    # 4.2 Developer documentation
    log_info "Updating developer documentation..."
    find docs/developers -name "*.md" -type f | while read -r file; do
        replace_in_file "$file" "Qwen Code" "HopCode"
        replace_in_file "$file" "qwen-code" "hopcode"
    done
    
    # 4.3 Documentation site
    log_info "Updating documentation site..."
    replace_in_file "docs-site/src/app/layout.jsx" "QwenLM/qwen-code" "TaimoorSiddiquiOfficial/HopCode"
    
    # 4.4 SDK documentation
    log_info "Updating SDK documentation..."
    if [ -f "packages/sdk-typescript/README.md" ]; then
        replace_in_file "packages/sdk-typescript/README.md" "@qwen-code/sdk" "@hopcode/sdk"
        replace_in_file "packages/sdk-typescript/README.md" "qwen_code" "hopcode"
    fi
    
    # 4.5 Java SDK
    log_info "Updating Java SDK..."
    if [ -f "packages/sdk-java/QWEN.md" ] && [ "$DRY_RUN" = false ]; then
        mv "packages/sdk-java/QWEN.md" "packages/sdk-java/HOPCODE.md"
    fi
    
    log_success "Phase 4 complete"
}

# Phase 5: Infrastructure & Deployment
phase_5_infrastructure() {
    log_info "========================================="
    log_info "PHASE 5: Infrastructure & Deployment"
    log_info "========================================="
    
    # 5.1 GitHub workflows
    log_info "Updating GitHub workflows..."
    find .github/workflows -name "*.yml" -o -name "*.yaml" | while read -r file; do
        replace_in_file "$file" "qwen-code" "hopcode"
        replace_in_file "$file" "@qwen-code/" "@hopcode/"
    done
    
    # 5.2 Docker configuration
    log_info "Updating Docker configuration..."
    replace_in_file "Dockerfile" "qwen-code" "hopcode"
    
    # 5.3 Git configuration
    log_info "Updating git configuration..."
    replace_in_file ".gitignore" ".hopcode" ".hopcode"
    
    # 5.4 Integration tests
    log_info "Updating integration tests..."
    find integration-tests -type f \( -name "*.ts" -o -name "*.js" -o -name "*.py" \) | while read -r file; do
        replace_in_file "$file" "qwen-code" "hopcode"
        replace_in_file "$file" "qwen_code" "hopcode"
    done
    
    log_success "Phase 5 complete"
}

# Main execution
main() {
    echo "============================================"
    echo "  HopCode Rebranding Script"
    echo "  Qwen Code → HopCode Transformation"
    echo "============================================"
    echo ""
    
    if [ "$DRY_RUN" = true ]; then
        log_warning "DRY RUN MODE - No files will be modified"
        echo ""
    fi
    
    # Create backup
    create_backup
    
    # Execute phases
    case $PHASE in
        1)
            phase_1_core_identity
            ;;
        2)
            phase_2_high_visibility
            ;;
        3)
            phase_3_source_code
            ;;
        4)
            phase_4_documentation
            ;;
        5)
            phase_5_infrastructure
            ;;
        all)
            phase_1_core_identity
            phase_2_high_visibility
            phase_3_source_code
            phase_4_documentation
            phase_5_infrastructure
            ;;
        *)
            log_error "Invalid phase: $PHASE"
            exit 1
            ;;
    esac
    
    echo ""
    echo "============================================"
    if [ "$DRY_RUN" = true ]; then
        log_success "Dry run complete! Review the changes above."
        echo "Run without --dry-run to apply changes."
    else
        log_success "Rebranding complete!"
        echo ""
        log_warning "IMPORTANT NEXT STEPS:"
        echo "1. Review all changes with: git diff"
        echo "2. Test installation scripts"
        echo "3. Update and run test suite"
        echo "4. Build all packages"
        echo "5. Update CI/CD pipelines"
        echo ""
        echo "Backup location: $BACKUP_DIR"
    fi
    echo "============================================"
}

# Run main function
main
