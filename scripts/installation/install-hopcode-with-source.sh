#!/usr/bin/env bash
# HopCode Installation Script
# Installs HopCode from a standalone archive when available, with npm fallback.
# This script intentionally does not install Node.js, NVM, or change npm config.

set -euo pipefail

# ── defaults ──────────────────────────────────────────────────────────
SOURCE="unknown"
METHOD="${HOPCODE_INSTALL_METHOD:-}"
MIRROR="${HOPCODE_INSTALL_MIRROR:-github}"
BASE_URL="${HOPCODE_INSTALL_BASE_URL:-}"
ARCHIVE_PATH="${HOPCODE_INSTALL_ARCHIVE:-}"
VERSION="${HOPCODE_INSTALL_VERSION:-latest}"
NPM_REGISTRY="${HOPCODE_NPM_REGISTRY:-https://registry.npmmirror.com}"
INSTALL_ROOT="${HOPCODE_INSTALL_ROOT:-}"
INSTALL_LIB_PARENT="${HOPCODE_INSTALL_LIB_PARENT:-}"
INSTALL_LIB_DIR="${HOPCODE_INSTALL_LIB_DIR:-}"
INSTALL_BIN_DIR="${HOPCODE_INSTALL_BIN_DIR:-}"

if [[ -z "${INSTALL_ROOT}" ]]; then
    if [[ "$(uname)" == "Darwin" ]]; then
        INSTALL_ROOT="/usr/local"
    else
        INSTALL_ROOT="${XDG_LOCAL_HOME:-${HOME}/.local}"
    fi
fi

if [[ -z "${INSTALL_LIB_PARENT}" ]]; then
    INSTALL_LIB_PARENT="${INSTALL_ROOT}/lib"
fi

if [[ -z "${INSTALL_LIB_DIR}" ]]; then
    INSTALL_LIB_DIR="${INSTALL_LIB_PARENT}/hopcode"
fi

if [[ -z "${INSTALL_BIN_DIR}" ]]; then
    INSTALL_BIN_DIR="${INSTALL_ROOT}/bin"
fi

# ── option parsing ────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
    case "${1}" in
        -s|--source)
            if [[ -z "${2:-}" ]]; then echo "ERROR: --source requires a value" >&2; exit 1; fi
            SOURCE="${2}"; shift 2 ;;
        --method)
            if [[ -z "${2:-}" ]]; then echo "ERROR: --method requires a value" >&2; exit 1; fi
            METHOD="${2}"; shift 2 ;;
        --mirror)
            if [[ -z "${2:-}" ]]; then echo "ERROR: --mirror requires a value" >&2; exit 1; fi
            MIRROR="${2}"; shift 2 ;;
        --base-url)
            if [[ -z "${2:-}" ]]; then echo "ERROR: --base-url requires a value" >&2; exit 1; fi
            BASE_URL="${2}"; shift 2 ;;
        --archive)
            if [[ -z "${2:-}" ]]; then echo "ERROR: --archive requires a value" >&2; exit 1; fi
            ARCHIVE_PATH="${2}"; shift 2 ;;
        --version)
            if [[ -z "${2:-}" ]]; then echo "ERROR: --version requires a value" >&2; exit 1; fi
            VERSION="${2}"; shift 2 ;;
        --registry)
            if [[ -z "${2:-}" ]]; then echo "ERROR: --registry requires a value" >&2; exit 1; fi
            NPM_REGISTRY="${2}"; shift 2 ;;
        -h|--help)
            print_usage; exit 0 ;;
        *)
            echo "ERROR: Unknown option: ${1}" >&2; echo; print_usage >&2; exit 1 ;;
    esac
done

# ── validation ────────────────────────────────────────────────────────
METHOD="${METHOD:-detect}"

validate_value() {
    local value="${1}"
    # Reject unsafe characters that could enable command injection or path traversal.
    local unsafe=$'\n\r!%&<>|^"`'
    local i char
    for (( i=0; i<${#value}; i++ )); do
        char="${value:${i}:1}"
        case "${unsafe}" in
            *"${char}"*) return 1 ;;
        esac
    done
    return 0
}

validate_abs_path() {
    local value="${1}"
    case "${value}" in
        /*) return 0 ;;
        *)  return 1 ;;
    esac
}

validate_url() {
    local value="${1}"
    case "${value}" in
        https://*) return 0 ;;
        "")       return 0 ;;
        *)        return 1 ;;
    esac
}

validate_version() {
    local value="${1}"
    [[ "${value}" == "latest" ]] && return 0
    [[ "${value}" =~ ^v?[0-9]+\.[0-9]+\.[0-9]+[A-Za-z0-9.-]*$ ]] && return 0
    return 1
}

validate_source() {
    [[ "${SOURCE}" == "unknown" ]] && return 0
    [[ "${SOURCE}" =~ ^[A-Za-z0-9._-]+$ ]] && return 0
    return 1
}

for var_name in METHOD MIRROR BASE_URL ARCHIVE_PATH VERSION NPM_REGISTRY INSTALL_ROOT INSTALL_LIB_PARENT INSTALL_LIB_DIR INSTALL_BIN_DIR; do
    value="${!var_name}"
    if [[ -n "${value}" ]] && ! validate_value "${value}"; then
        echo "ERROR: ${var_name} contains unsafe characters." >&2; exit 1
    fi
done

validate_abs_path "${INSTALL_ROOT}"       || { echo "ERROR: HOPCODE_INSTALL_ROOT must be an absolute path." >&2; exit 1; }
validate_abs_path "${INSTALL_LIB_PARENT}" || { echo "ERROR: HOPCODE_INSTALL_LIB_PARENT must be an absolute path." >&2; exit 1; }
validate_abs_path "${INSTALL_LIB_DIR}"   || { echo "ERROR: HOPCODE_INSTALL_LIB_DIR must be an absolute path." >&2; exit 1; }
validate_abs_path "${INSTALL_BIN_DIR}"    || { echo "ERROR: HOPCODE_INSTALL_BIN_DIR must be an absolute path." >&2; exit 1; }

case "${METHOD}" in
    detect|standalone|npm) ;;
    *) echo "ERROR: --method must be detect, standalone, or npm." >&2; exit 1 ;;
esac

case "${MIRROR}" in
    github) ;;
    *) echo "ERROR: --mirror must be github." >&2; exit 1 ;;
esac

validate_url "${BASE_URL}"       || { echo "ERROR: --base-url must start with https://" >&2; exit 1; }
validate_url "${NPM_REGISTRY}"   || { echo "ERROR: --registry must start with https://" >&2; exit 1; }
validate_version "${VERSION}"    || { echo "ERROR: --version must be 'latest' or a semver string." >&2; exit 1; }
validate_source                  || { echo "ERROR: --source may only contain letters, numbers, dot, underscore, or dash." >&2; exit 1; }

# ── banner ─────────────────────────────────────────────────────────────
echo "==========================================="
echo "HopCode Installation Script"
echo "==========================================="
echo
echo "INFO: Install method: ${METHOD}"
if [[ "${METHOD}" != "npm" ]]; then
    echo "INFO: Standalone mirror: ${MIRROR}"
    [[ -n "${BASE_URL}" ]] && echo "INFO: Standalone base URL: ${BASE_URL}"
    if [[ -n "${ARCHIVE_PATH}" ]]; then
        echo "INFO: Standalone archive: ${ARCHIVE_PATH}"
    else
        echo "INFO: Standalone version: ${VERSION}"
    fi
fi
if [[ "${METHOD}" != "standalone" ]]; then
    echo "INFO: npm registry: ${NPM_REGISTRY}"
fi
[[ "${SOURCE}" != "unknown" ]] && echo "INFO: Installation source: ${SOURCE}"
echo

# ── helper functions ───────────────────────────────────────────────────
detect_target() {
    local arch os
    arch="$(uname -m)"
    os="$(uname -s)"

    case "${os}:${arch}" in
        Linux:aarch64)  echo "linux-arm64" ;;
        Linux:x86_64)   echo "linux-x64" ;;
        Linux:arm64)    echo "linux-arm64" ;;
        Linux:amd64)    echo "linux-x64" ;;
        Darwin:arm64)   echo "darwin-arm64" ;;
        Darwin:x86_64)  echo "darwin-x64" ;;
        Darwin:aarch64) echo "darwin-arm64" ;;
        *) echo "ERROR:unsupported" ;;
    esac
}

release_version_path() {
    if [[ "${VERSION}" == "latest" ]]; then
        echo "latest"
        return
    fi
    local v="${VERSION}"
    [[ "${v}" == v* ]] || v="v${v}"
    echo "${v}"
}

standalone_base_url() {
    if [[ -n "${BASE_URL}" ]]; then
        echo "${BASE_URL}"
        return
    fi

    local version_path
    version_path="$(release_version_path)"
    if [[ "${version_path}" == "latest" ]]; then
        echo "https://github.com/TaimoorSiddiquiOfficial/HopCode/releases/latest/download"
    else
        echo "https://github.com/TaimoorSiddiquiOfficial/HopCode/releases/download/${version_path}"
    fi
}

url_exists() {
    local url="${1}"
    if command -v curl >/dev/null 2>&1; then
        curl -fsSL -o /dev/null --head "${url}" 2>/dev/null
    elif command -v wget >/dev/null 2>&1; then
        wget -q --spider "${url}" 2>/dev/null
    else
        echo "ERROR: curl or wget is required for URL checks." >&2
        return 1
    fi
}

download_file() {
    local url="${1}"
    local destination="${2}"

    if command -v curl >/dev/null 2>&1; then
        curl -fsSL -o "${destination}" "${url}"
    elif command -v wget >/dev/null 2>&1; then
        wget -q --tries=3 "${url}" -O "${destination}"
    else
        echo "ERROR: curl or wget is required for downloads." >&2
        return 1
    fi
}

shell_quote() {
    printf '%q' "${1}"
}

validate_archive_entry() {
    local entry="${1}"
    case "${entry}" in
        ''|/*|..|../*|*/..|*/../*) return 1 ;;
        *) return 0 ;;
    esac
}

validate_archive_contents() {
    local archive_path="${1}"
    local entries

    case "${archive_path}" in
        *.tar.gz|*.tgz)
            entries="$(tar -tzf "${archive_path}")" || return 1
            ;;
        *.tar.xz|*.txz)
            entries="$(tar -tJf "${archive_path}")" || return 1
            ;;
        *.zip)
            entries="$(unzip -Z1 "${archive_path}")" || return 1
            ;;
        *)
            echo "ERROR: Unsupported standalone archive format." >&2
            return 1
            ;;
    esac

    local entry
    while IFS= read -r entry; do
        if ! validate_archive_entry "${entry}"; then
            echo "ERROR: Archive contains unsafe path: ${entry}" >&2
            return 1
        fi
    done <<< "${entries}"
}

extract_archive() {
    local archive_path="${1}"
    local destination="${2}"

    case "${archive_path}" in
        *.tar.gz|*.tgz)
            tar -xzf "${archive_path}" -C "${destination}" || return 1
            ;;
        *.tar.xz|*.txz)
            tar -xJf "${archive_path}" -C "${destination}" || return 1
            ;;
        *.zip)
            unzip -q "${archive_path}" -d "${destination}" || return 1
            ;;
        *)
            echo "ERROR: Unsupported standalone archive format." >&2
            return 1
            ;;
    esac
}

sha256_of() {
    local file="${1}"
    if command -v shasum >/dev/null 2>&1; then
        shasum -a 256 "${file}" | cut -d' ' -f1
    elif command -v sha256sum >/dev/null 2>&1; then
        sha256sum "${file}" | cut -d' ' -f1
    else
        echo "ERROR: sha256sum or shasum is required for checksum verification." >&2
        return 1
    fi
}

verify_checksum() {
    local archive_file="${1}"
    local checksum_source="${2:-}"
    local archive_name="${3:-}"
    local checksum_file
    local temp_checksum=""
    local require_checksum="1"

    if [[ -z "${archive_name}" ]]; then
        archive_name="$(basename "${archive_file}")"
    fi

    if [[ -n "${checksum_source}" ]]; then
        if [[ "${checksum_source}" == https://* ]]; then
            require_checksum="1"
            temp_checksum="$(mktemp)"
            download_file "${checksum_source}" "${temp_checksum}" || {
                rm -f "${temp_checksum}"
                echo "ERROR: Could not download SHA256SUMS for checksum verification." >&2
                return 1
            }
            checksum_file="${temp_checksum}"
        else
            checksum_file="${checksum_source}"
        fi
    else
        checksum_file="$(dirname "${archive_file}")/SHA256SUMS"
    fi

    if [[ ! -f "${checksum_file}" ]]; then
        if [[ "${require_checksum}" == "1" ]]; then
            echo "ERROR: SHA256SUMS not found; cannot verify archive." >&2
            return 1
        fi
        echo "WARNING: SHA256SUMS not found; skipping checksum verification."
        return 0
    fi

    local expected_hash=""
    local line hash_in_file name_in_file
    while IFS= read -r line; do
        hash_in_file="${line%% *}"
        name_in_file="${line#* }"
        # Strip leading * or space from the filename column
        name_in_file="${name_in_file#\*}"
        name_in_file="${name_in_file# }"
        if [[ "${name_in_file}" == "${archive_name}" ]]; then
            expected_hash="${hash_in_file}"
            break
        fi
    done < "${checksum_file}"

    [[ -n "${temp_checksum}" ]] && rm -f "${temp_checksum}"

    if [[ -z "${expected_hash}" ]]; then
        if [[ "${require_checksum}" == "1" ]]; then
            echo "ERROR: Checksum entry for ${archive_name} not found." >&2
            return 1
        fi
        echo "WARNING: Checksum entry for ${archive_name} not found; skipping checksum verification."
        return 0
    fi

    local actual_hash
    actual_hash="$(sha256_of "${archive_file}")" || return 1

    if [[ "${expected_hash}" != "${actual_hash}" ]]; then
        echo "ERROR: Checksum verification failed for ${archive_name}." >&2
        return 1
    fi

    echo "SUCCESS: Checksum verified for ${archive_name}."
    return 0
}

reject_archive_links() {
    local extract_dir="${1}"
    # Find any symlinks in the extracted directory.
    if find "${extract_dir}" -type l -print -quit 2>/dev/null | grep -q .; then
        echo "ERROR: Archive contains symlinks; refusing to install." >&2
        return 1
    fi
    return 0
}

ensure_managed_install_dir() {
    local target_dir="${1}"
    if [[ ! -d "${target_dir}" ]]; then
        return 0
    fi
    if [[ -f "${target_dir}/manifest.json" ]]; then
        return 0
    fi
    echo "ERROR: ${target_dir} exists but is not a HopCode standalone install." >&2
    echo "ERROR: Refusing to overwrite it. Move or remove it manually, then rerun the installer." >&2
    return 1
}

# ── standalone installation ────────────────────────────────────────────
install_standalone() {
    local temp_dir=""
    local checksum_source=""

    # Resolve the archive from a local file or from the configured release mirror.
    if [[ -n "${ARCHIVE_PATH}" ]]; then
        ARCHIVE_FILE="${ARCHIVE_PATH}"
        ARCHIVE_NAME="$(basename "${ARCHIVE_FILE}")"
        if [[ ! -f "${ARCHIVE_FILE}" ]]; then
            echo "ERROR: Standalone archive not found: ${ARCHIVE_FILE}" >&2
            return 1
        fi
    else
        local target
        target="$(detect_target)"
        if [[ "${target}" == "ERROR:unsupported" ]]; then
            echo "WARNING: Standalone archive is not available for this platform." >&2
            return 2
        fi

        ARCHIVE_NAME="hopcode-${target}.tar.gz"
        local base_url
        base_url="$(standalone_base_url)"
        ARCHIVE_URL="${base_url}/${ARCHIVE_NAME}"
        checksum_source="${base_url}/SHA256SUMS"

        if [[ "${METHOD}" == "detect" ]]; then
            if ! url_exists "${ARCHIVE_URL}"; then
                echo "WARNING: Standalone archive not found: ${ARCHIVE_NAME}" >&2
                return 2
            fi
        fi

        temp_dir="$(mktemp -d)"
        ARCHIVE_FILE="${temp_dir}/${ARCHIVE_NAME}"

        echo "INFO: Downloading ${ARCHIVE_URL}"
        download_file "${ARCHIVE_URL}" "${ARCHIVE_FILE}" || {
            rm -rf "${temp_dir}"
            echo "WARNING: Failed to download standalone archive." >&2
            return 2
        }
    fi

    [[ -z "${temp_dir}" ]] && temp_dir="$(mktemp -d)"

    # Verify integrity before extraction or changing the install directory.
    verify_checksum "${ARCHIVE_FILE}" "${checksum_source}" "${ARCHIVE_NAME}" || {
        rm -rf "${temp_dir}"
        return 1
    }

    # Extract into a temporary directory, then validate required entry points.
    local extract_dir="${temp_dir}/extract"
    mkdir -p "${extract_dir}"
    validate_archive_contents "${ARCHIVE_FILE}" || {
        rm -rf "${temp_dir}"
        return 1
    }
    extract_archive "${ARCHIVE_FILE}" "${extract_dir}" || {
        rm -rf "${temp_dir}"
        echo "ERROR: Failed to extract standalone archive." >&2
        return 1
    }

    reject_archive_links "${extract_dir}" || {
        rm -rf "${temp_dir}"
        return 1
    }

    if [[ ! -f "${extract_dir}/hopcode/bin/hopcode" ]]; then
        rm -rf "${temp_dir}"
        echo "ERROR: Archive does not contain hopcode/bin/hopcode." >&2
        return 1
    fi

    if [[ ! -f "${extract_dir}/hopcode/node/bin/node" ]]; then
        rm -rf "${temp_dir}"
        echo "ERROR: Archive does not contain hopcode/node/bin/node." >&2
        return 1
    fi

    mkdir -p "${INSTALL_LIB_PARENT}"
    mkdir -p "${INSTALL_BIN_DIR}"

    # Stage into .new and keep .old so failed upgrades can roll back.
    local new_install_dir="${INSTALL_LIB_DIR}.new"
    local old_install_dir="${INSTALL_LIB_DIR}.old"

    ensure_managed_install_dir "${INSTALL_LIB_DIR}" || { rm -rf "${temp_dir}"; return 1; }
    ensure_managed_install_dir "${new_install_dir}" || { rm -rf "${temp_dir}"; return 1; }
    ensure_managed_install_dir "${old_install_dir}" || { rm -rf "${temp_dir}"; return 1; }

    rm -rf "${new_install_dir}"
    rm -rf "${old_install_dir}"
    mv "${extract_dir}/hopcode" "${new_install_dir}" || {
        rm -rf "${temp_dir}"
        echo "ERROR: Failed to stage standalone archive." >&2
        return 1
    }

    if [[ -d "${INSTALL_LIB_DIR}" ]]; then
        mv "${INSTALL_LIB_DIR}" "${old_install_dir}" || {
            rm -rf "${temp_dir}"
            echo "ERROR: Failed to back up existing install at ${INSTALL_LIB_DIR}." >&2
            return 1
        }
    fi
    mv "${new_install_dir}" "${INSTALL_LIB_DIR}" || {
        # Roll back.
        mv "${old_install_dir}" "${INSTALL_LIB_DIR}" 2>/dev/null || true
        rm -rf "${temp_dir}"
        echo "ERROR: Failed to install standalone archive to ${INSTALL_LIB_DIR}." >&2
        return 1
    }

    # Write a portable shim that delegates to the real binary.
    local shim_path="${INSTALL_BIN_DIR}/hopcode"
    local quoted_hopcode_bin
    quoted_hopcode_bin="$(shell_quote "${INSTALL_LIB_DIR}/bin/hopcode")"
    cat > "${shim_path}.new" <<SHIM
#!/usr/bin/env bash
exec ${quoted_hopcode_bin} "\$@"
SHIM
    chmod +x "${shim_path}.new"
    mv "${shim_path}.new" "${shim_path}" || {
        rm -f "${shim_path}.new"
        # Roll back the install.
        rm -rf "${INSTALL_LIB_DIR}"
        mv "${old_install_dir}" "${INSTALL_LIB_DIR}" 2>/dev/null || true
        rm -rf "${temp_dir}"
        echo "ERROR: Failed to create hopcode wrapper in ${INSTALL_BIN_DIR}." >&2
        return 1
    }

    rm -rf "${old_install_dir}"
    rm -rf "${temp_dir}"

    echo "SUCCESS: HopCode standalone archive installed successfully."
    echo "INFO: Installed to ${INSTALL_LIB_DIR}"
    return 0
}

# ── npm installation ───────────────────────────────────────────────────
install_npm() {
    require_node
    require_npm

    if command -v hopcode >/dev/null 2>&1; then
        local existing_version
        existing_version="$(hopcode --version 2>/dev/null || echo unknown)"
        echo "INFO: Existing HopCode detected: ${existing_version}"
        echo "INFO: Upgrading to the latest version."
    fi

    echo "INFO: Running: npm install -g @hoptrendy/hopcode-cli@latest --registry ${NPM_REGISTRY}"
    npm install -g "@hoptrendy/hopcode-cli@latest" --registry "${NPM_REGISTRY}" || {
        echo "ERROR: Failed to install HopCode." >&2
        echo >&2
        echo "This installer does not change your npm prefix or PATH." >&2
        echo "If the failure is a permission error, fix your npm global package directory, then run:" >&2
        echo "  npm install -g @hoptrendy/hopcode-cli@latest --registry ${NPM_REGISTRY}" >&2
        return 1
    }

    echo "SUCCESS: HopCode installed successfully."
    create_source_json
    return 0
}

require_node() {
    if ! command -v node >/dev/null 2>&1; then
        echo "ERROR: Node.js was not found." >&2
        echo >&2
        echo "Node.js 20 or newer is required before installing HopCode with npm." >&2
        echo "Please install Node.js from https://nodejs.org/ and rerun this installer." >&2
        return 1
    fi

    local node_version
    node_version="$(node -p 'process.versions.node' 2>/dev/null || echo unknown)"
    if [[ "${node_version}" == "unknown" ]]; then
        echo "ERROR: Unable to determine Node.js version." >&2
        echo "Node.js 20 or newer is required before installing HopCode with npm." >&2
        return 1
    fi

    local major_version="${node_version%%.*}"
    if [[ "${major_version}" -lt 20 ]]; then
        echo "ERROR: Node.js ${node_version} is installed, but Node.js 20 or newer is required." >&2
        echo "Please install Node.js from https://nodejs.org/ and rerun this installer." >&2
        return 1
    fi

    echo "SUCCESS: Node.js ${node_version} detected."
    return 0
}

require_npm() {
    if ! command -v npm >/dev/null 2>&1; then
        echo "ERROR: npm was not found." >&2
        echo "Please install Node.js with npm included, then rerun this installer." >&2
        return 1
    fi

    local npm_version
    npm_version="$(npm -v 2>/dev/null || echo unknown)"
    echo "SUCCESS: npm ${npm_version} detected."
    return 0
}

# ── source tracking ─────────────────────────────────────────────────────
create_source_json() {
    [[ "${SOURCE}" == "unknown" ]] && return 0

    local hopcode_dir="${HOME}/.hopcode"
    mkdir -p "${hopcode_dir}"

    printf '{\n  "source": "%s"\n}\n' "${SOURCE}" > "${hopcode_dir}/source.json"
    echo "SUCCESS: Installation source saved to ${hopcode_dir}/source.json"
}

# ── final instructions ──────────────────────────────────────────────────
print_final_instructions() {
    local extra_bin="${1:-}"
    local path_prefix=""
    [[ -n "${extra_bin}" ]] && path_prefix="PATH=\"${extra_bin}:${PATH}\" "

    echo
    echo "==========================================="
    echo "Installation completed!"
    echo "==========================================="
    echo

    if eval "${path_prefix} command -v hopcode" >/dev/null 2>&1; then
        local hopcode_version
        hopcode_version="$(eval "${path_prefix} hopcode --version" 2>/dev/null || echo unknown)"
        echo "SUCCESS: HopCode is ready to use: ${hopcode_version}"
        echo
        echo "You can now run: hopcode"
        echo
        echo "INFO: Run hopcode in your project directory to start an interactive session."
        return 0
    fi

    echo "WARNING: HopCode was installed, but hopcode is not on PATH in this prompt."
    echo
    echo "Restart your terminal, then run: hopcode"
    if [[ -n "${extra_bin}" ]]; then
        echo
        echo "Or add this directory to PATH:"
        echo "  export PATH=\"${extra_bin}:\$PATH\""
        echo "Then run:"
        echo "  hopcode"
        return 0
    fi

    local npm_prefix
    npm_prefix="$(npm prefix -g 2>/dev/null || true)"
    if [[ -n "${npm_prefix}" ]]; then
        echo
        echo "Or add this npm global directory to PATH:"
        echo "  ${npm_prefix}/bin"
        echo "Then run:"
        echo "  hopcode"
    fi
}

# ── main dispatch ──────────────────────────────────────────────────────
main() {
    case "${METHOD}" in
        standalone)
            local status=0
            install_standalone || status=$?
            if [[ ${status} -eq 0 ]]; then
                print_final_instructions "${INSTALL_BIN_DIR}"
            fi
            return ${status}
            ;;
        npm)
            local status=0
            install_npm || status=$?
            if [[ ${status} -eq 0 ]]; then
                print_final_instructions ""
            fi
            return ${status}
            ;;
        detect)
            local standalone_status=0
            install_standalone || standalone_status=$?
            if [[ ${standalone_status} -eq 0 ]]; then
                print_final_instructions "${INSTALL_BIN_DIR}"
                return 0
            fi

            if [[ ${standalone_status} -eq 2 ]]; then
                echo "WARNING: Falling back to npm installation."
                install_npm
                local npm_status=$?
                if [[ ${npm_status} -ne 0 ]]; then
                    echo "WARNING: Standalone archive was unavailable before npm fallback; npm fallback also failed." >&2
                    echo "WARNING: Retry with --method standalone to debug the standalone failure, or install Node.js 20+ and rerun --method npm." >&2
                fi
                if [[ ${npm_status} -eq 0 ]]; then
                    print_final_instructions ""
                fi
                return ${npm_status}
            fi

            echo "WARNING: Standalone install failed. Retry with --method npm to use npm, or --method standalone to debug the standalone failure." >&2
            return ${standalone_status}
            ;;
        *)
            echo "ERROR: Unknown method: ${METHOD}" >&2
            return 1
            ;;
    esac
}

# ── usage ──────────────────────────────────────────────────────────────
print_usage() {
    cat <<'EOF'
HopCode Installer

Usage: install-hopcode-with-source.sh [OPTIONS]

Options:
  -s, --source SOURCE      Record the installation source.
                            Only letters, numbers, dot, underscore, and dash are allowed.
  --method METHOD          Install method: detect, standalone, or npm.
  --mirror MIRROR          Standalone archive mirror: github.
  --base-url URL            Override standalone archive base URL.
  --archive PATH            Install from a local standalone archive.
  --version VERSION        Standalone release version. Defaults to latest.
  --registry REGISTRY      npm registry to use.
                            Defaults to HOPCODE_NPM_REGISTRY or https://registry.npmmirror.com
  -h, --help               Show this help message.
EOF
}

main
