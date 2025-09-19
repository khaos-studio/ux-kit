#!/bin/bash

# Dependency Manager Module
# Manages dependency installation and management for different package managers

set -euo pipefail

# Source utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UTILS_DIR="$(cd "$SCRIPT_DIR/../utils" && pwd)"

# Source system detector if available
if [[ -f "$SCRIPT_DIR/system-detector.sh" ]]; then
    source "$SCRIPT_DIR/system-detector.sh"
fi

# Source package manager modules if available
if [[ -f "$SCRIPT_DIR/package-managers/homebrew.sh" ]]; then
    source "$SCRIPT_DIR/package-managers/homebrew.sh"
fi

if [[ -f "$SCRIPT_DIR/package-managers/apt.sh" ]]; then
    source "$SCRIPT_DIR/package-managers/apt.sh"
fi

if [[ -f "$SCRIPT_DIR/package-managers/yum.sh" ]]; then
    source "$SCRIPT_DIR/package-managers/yum.sh"
fi

# Install Homebrew
install_homebrew() {
    local force_install="${1:-false}"
    
    echo "Installing Homebrew..."
    
    # Check if Homebrew is already installed
    if command -v brew >/dev/null 2>&1; then
        echo "Homebrew is already installed"
        return 0
    fi
    
    # Check if we're on macOS
    if [[ "$OSTYPE" != "darwin"* ]]; then
        echo "ERROR: Homebrew is only available on macOS"
        return 1
    fi
    
    # Install Homebrew
    if [[ "$force_install" == "true" ]]; then
        echo "Force installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)" 2>/dev/null || true
    fi
    
    # Install Homebrew
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH if needed
    if [[ -f "/opt/homebrew/bin/brew" ]]; then
        export PATH="/opt/homebrew/bin:$PATH"
    elif [[ -f "/usr/local/bin/brew" ]]; then
        export PATH="/usr/local/bin:$PATH"
    fi
    
    echo "Homebrew installation completed"
    return 0
}

# Install Node.js
install_nodejs() {
    local version="${1:-18.0.0}"
    local package_manager="${2:-auto}"
    
    echo "Installing Node.js version $version using $package_manager..."
    
    # Check if Node.js is already installed with correct version
    if command -v node >/dev/null 2>&1; then
        local current_version=$(node --version 2>/dev/null | sed 's/v//')
        if [[ "$(printf '%s\n' "$version" "$current_version" | sort -V | head -n1)" == "$version" ]]; then
            echo "Node.js $current_version is already installed and meets requirement"
            return 0
        fi
    fi
    
    # Detect package manager if auto
    if [[ "$package_manager" == "auto" ]]; then
        package_manager=$(detect_package_manager)
    fi
    
    # Install Node.js based on package manager
    case "$package_manager" in
        "homebrew")
            if command -v brew >/dev/null 2>&1; then
                echo "Installing Node.js via Homebrew..."
                brew install node
            else
                echo "ERROR: Homebrew not available"
                return 1
            fi
            ;;
        "apt")
            if command -v apt >/dev/null 2>&1; then
                echo "Installing Node.js via APT..."
                curl -fsSL https://deb.nodesource.com/setup_${version%.*}.x | sudo -E bash -
                sudo apt-get install -y nodejs
            else
                echo "ERROR: APT not available"
                return 1
            fi
            ;;
        "yum")
            if command -v yum >/dev/null 2>&1; then
                echo "Installing Node.js via YUM..."
                curl -fsSL https://rpm.nodesource.com/setup_${version%.*}.x | sudo bash -
                sudo yum install -y nodejs
            else
                echo "ERROR: YUM not available"
                return 1
            fi
            ;;
        *)
            echo "ERROR: Unknown package manager: $package_manager"
            return 1
            ;;
    esac
    
    echo "Node.js $version installation completed"
    return 0
}

# Install Git
install_git() {
    local version="${1:-2.0.0}"
    local package_manager="${2:-auto}"
    
    echo "Installing Git version $version using $package_manager..."
    
    # Check if Git is already installed with correct version
    if command -v git >/dev/null 2>&1; then
        local current_version=$(git --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
        if [[ "$(printf '%s\n' "$version" "$current_version" | sort -V | head -n1)" == "$version" ]]; then
            echo "Git $current_version is already installed and meets requirement"
            return 0
        fi
    fi
    
    # Detect package manager if auto
    if [[ "$package_manager" == "auto" ]]; then
        package_manager=$(detect_package_manager)
    fi
    
    # Install Git based on package manager
    case "$package_manager" in
        "homebrew")
            if command -v brew >/dev/null 2>&1; then
                echo "Installing Git via Homebrew..."
                brew install git
            else
                echo "ERROR: Homebrew not available"
                return 1
            fi
            ;;
        "apt")
            if command -v apt >/dev/null 2>&1; then
                echo "Installing Git via APT..."
                sudo apt-get update
                sudo apt-get install -y git
            else
                echo "ERROR: APT not available"
                return 1
            fi
            ;;
        "yum")
            if command -v yum >/dev/null 2>&1; then
                echo "Installing Git via YUM..."
                sudo yum install -y git
            else
                echo "ERROR: YUM not available"
                return 1
            fi
            ;;
        *)
            echo "ERROR: Unknown package manager: $package_manager"
            return 1
            ;;
    esac
    
    echo "Git $version installation completed"
    return 0
}

# Check dependencies
check_dependencies() {
    local dependencies=("$@")
    local missing_deps=()
    local installed_deps=()
    
    echo "Checking dependencies: ${dependencies[*]}"
    
    for dep in "${dependencies[@]}"; do
        case "$dep" in
            "node"|"nodejs")
                if command -v node >/dev/null 2>&1; then
                    local version=$(node --version 2>/dev/null | sed 's/v//')
                    echo "✓ Node.js $version is installed"
                    installed_deps+=("node:$version")
                else
                    echo "✗ Node.js is not installed"
                    missing_deps+=("node")
                fi
                ;;
            "git")
                if command -v git >/dev/null 2>&1; then
                    local version=$(git --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
                    echo "✓ Git $version is installed"
                    installed_deps+=("git:$version")
                else
                    echo "✗ Git is not installed"
                    missing_deps+=("git")
                fi
                ;;
            "brew"|"homebrew")
                if command -v brew >/dev/null 2>&1; then
                    echo "✓ Homebrew is installed"
                    installed_deps+=("homebrew")
                else
                    echo "✗ Homebrew is not installed"
                    missing_deps+=("homebrew")
                fi
                ;;
            *)
                echo "Unknown dependency: $dep"
                missing_deps+=("$dep")
                ;;
        esac
    done
    
    # Report results
    if [[ ${#missing_deps[@]} -eq 0 ]]; then
        echo "All dependencies are installed"
        return 0
    else
        echo "Missing dependencies: ${missing_deps[*]}"
        return 1
    fi
}

# Install missing dependencies
install_missing_dependencies() {
    local package_manager="${1:-auto}"
    shift
    local dependencies=("$@")
    local install_count=0
    
    echo "Installing missing dependencies using $package_manager..."
    
    # Check what's missing and install
    for dep in "${dependencies[@]}"; do
        case "$dep" in
            "node"|"nodejs")
                if ! command -v node >/dev/null 2>&1; then
                    install_nodejs "18.0.0" "$package_manager"
                    ((install_count++))
                fi
                ;;
            "git")
                if ! command -v git >/dev/null 2>&1; then
                    install_git "2.0.0" "$package_manager"
                    ((install_count++))
                fi
                ;;
            "brew"|"homebrew")
                if ! command -v brew >/dev/null 2>&1; then
                    install_homebrew
                    ((install_count++))
                fi
                ;;
            *)
                echo "Cannot install unknown dependency: $dep"
                ;;
        esac
    done
    
    echo "Installed $install_count dependencies"
    return 0
}

# Handle package manager errors
handle_package_manager_errors() {
    local error_code="$1"
    local package_manager="$2"
    local operation="$3"
    
    echo "Handling package manager error: $error_code for $package_manager during $operation"
    
    case "$error_code" in
        "1")
            echo "Error: Package manager not found"
            echo "Suggestion: Install $package_manager or use alternative package manager"
            ;;
        "2")
            echo "Error: Permission denied"
            echo "Suggestion: Run with sudo or check user permissions"
            ;;
        "3")
            echo "Error: Network connectivity issue"
            echo "Suggestion: Check internet connection and try again"
            ;;
        "4")
            echo "Error: Package not found in repository"
            echo "Suggestion: Update package lists or use alternative source"
            ;;
        "5")
            echo "Error: Installation failed"
            echo "Suggestion: Check system requirements and try again"
            ;;
        *)
            echo "Unknown error code: $error_code"
            echo "Suggestion: Check package manager logs for details"
            ;;
    esac
    
    return 1
}

# Detect package manager
detect_package_manager() {
    local os_type="${1:-$OSTYPE}"
    
    echo "Detecting package manager for OS: $os_type"
    
    if [[ "$os_type" == "darwin"* ]]; then
        if command -v brew >/dev/null 2>&1; then
            echo "Package manager: homebrew"
            return 0
        else
            echo "Package manager: homebrew (not installed)"
            return 1
        fi
    elif [[ "$os_type" == "linux-gnu"* ]]; then
        if command -v apt >/dev/null 2>&1; then
            echo "Package manager: apt"
            return 0
        elif command -v yum >/dev/null 2>&1; then
            echo "Package manager: yum"
            return 0
        elif command -v dnf >/dev/null 2>&1; then
            echo "Package manager: dnf"
            return 0
        else
            echo "Package manager: unknown"
            return 1
        fi
    else
        echo "Package manager: unsupported OS"
        return 1
    fi
}

# Get comprehensive dependency manager information
get_dependency_manager_info() {
    echo "=== Dependency Manager Information ==="
    detect_package_manager
    echo "=== Current Dependencies ==="
    check_dependencies "node" "git" "homebrew"
    echo "=== Installation Status ==="
    install_missing_dependencies "node" "git" "homebrew"
}

# Main function for command line usage
main() {
    local command="${1:-info}"
    
    case "$command" in
        "install-homebrew")
            install_homebrew "${2:-false}"
            ;;
        "install-nodejs")
            install_nodejs "${2:-18.0.0}" "${3:-auto}"
            ;;
        "install-git")
            install_git "${2:-2.0.0}" "${3:-auto}"
            ;;
        "check")
            shift
            check_dependencies "$@"
            ;;
        "install-missing")
            shift
            install_missing_dependencies "$@"
            ;;
        "detect-pm")
            detect_package_manager "${2:-$OSTYPE}"
            ;;
        "info"|*)
            get_dependency_manager_info
            ;;
    esac
}

# Export functions for use by other scripts
export -f install_homebrew
export -f install_nodejs
export -f install_git
export -f check_dependencies
export -f install_missing_dependencies
export -f handle_package_manager_errors
export -f detect_package_manager
export -f get_dependency_manager_info

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
