#!/bin/bash

# System Detection Module
# Detects operating system, architecture, and available tools

set -euo pipefail

# Source utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UTILS_DIR="$(cd "$SCRIPT_DIR/../utils" && pwd)"

# Source utility functions if available
if [[ -f "$UTILS_DIR/system-info.sh" ]]; then
    source "$UTILS_DIR/system-info.sh"
fi

# Detect operating system
detect_os() {
    local os_name=""
    local os_version=""
    
    # Detect operating system
    if [[ "$OSTYPE" == "darwin"* ]]; then
        os_name="macOS"
        os_version=$(sw_vers -productVersion 2>/dev/null || echo "unknown")
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        os_name="Linux"
        if [[ -f /etc/os-release ]]; then
            os_version=$(grep "^VERSION_ID=" /etc/os-release | cut -d'"' -f2 | cut -d'=' -f2)
        else
            os_version="unknown"
        fi
    else
        os_name="Unknown"
        os_version="unknown"
    fi
    
    echo "OS: $os_name"
    echo "Version: $os_version"
    return 0
}

# Detect system architecture
detect_architecture() {
    local arch=""
    
    # Detect system architecture
    case "$(uname -m)" in
        "x86_64")
            arch="x86_64"
            ;;
        "arm64"|"aarch64")
            arch="ARM64"
            ;;
        "i386"|"i686")
            arch="x86_32"
            ;;
        *)
            arch="Unknown"
            ;;
    esac
    
    echo "Architecture: $arch"
    return 0
}

# Detect Linux distribution
detect_distribution() {
    local distro=""
    local distro_version=""
    
    # Detect Linux distribution
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [[ -f /etc/os-release ]]; then
            distro=$(grep "^ID=" /etc/os-release | cut -d'=' -f2 | tr -d '"')
            distro_version=$(grep "^VERSION_ID=" /etc/os-release | cut -d'=' -f2 | tr -d '"')
        elif [[ -f /etc/redhat-release ]]; then
            distro="rhel"
            distro_version=$(cat /etc/redhat-release | grep -oE '[0-9]+\.[0-9]+' | head -1)
        elif [[ -f /etc/debian_version ]]; then
            distro="debian"
            distro_version=$(cat /etc/debian_version)
        else
            distro="unknown"
            distro_version="unknown"
        fi
    else
        distro="N/A"
        distro_version="N/A"
    fi
    
    echo "Distribution: $distro"
    echo "Distribution Version: $distro_version"
    return 0
}

# Check Node.js version
check_node_version() {
    local required_version="${1:-18.0.0}"
    local current_version=""
    
    # Check if Node.js is installed
    if command -v node >/dev/null 2>&1; then
        current_version=$(node --version 2>/dev/null | sed 's/v//')
        
        # Compare versions
        if [[ "$current_version" == "$required_version" ]] || [[ "$(printf '%s\n' "$required_version" "$current_version" | sort -V | head -n1)" == "$required_version" ]]; then
            echo "Node.js version: $current_version (meets requirement: $required_version)"
            return 0
        else
            echo "Node.js version: $current_version (below requirement: $required_version)"
            return 1
        fi
    else
        echo "Node.js not installed"
        return 1
    fi
}

# Check Git version
check_git_version() {
    local required_version="${1:-2.0.0}"
    local current_version=""
    
    # Check if Git is installed
    if command -v git >/dev/null 2>&1; then
        current_version=$(git --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
        
        # Compare versions
        if [[ "$current_version" == "$required_version" ]] || [[ "$(printf '%s\n' "$required_version" "$current_version" | sort -V | head -n1)" == "$required_version" ]]; then
            echo "Git version: $current_version (meets requirement: $required_version)"
            return 0
        else
            echo "Git version: $current_version (below requirement: $required_version)"
            return 1
        fi
    else
        echo "Git not installed"
        return 1
    fi
}

# Check SSH access
check_ssh_access() {
    local test_host="${1:-github.com}"
    local test_port="${2:-22}"
    
    # Check if SSH is available
    if command -v ssh >/dev/null 2>&1; then
        # Test SSH connectivity (with timeout)
        if timeout 5 ssh -o ConnectTimeout=3 -o BatchMode=yes -o StrictHostKeyChecking=no "$test_host" -p "$test_port" exit 2>/dev/null; then
            echo "SSH access to $test_host:$test_port: Available"
            return 0
        else
            echo "SSH access to $test_host:$test_port: Not available (connection failed)"
            return 1
        fi
    else
        echo "SSH not installed"
        return 1
    fi
}

# Validate system requirements
validate_system_requirements() {
    local errors=0
    local warnings=0
    
    echo "Validating system requirements..."
    
    # Check OS support
    local os_info=$(detect_os)
    if [[ "$os_info" == *"Unknown"* ]]; then
        echo "ERROR: Unsupported operating system"
        ((errors++))
    else
        echo "✓ Operating system supported: $os_info"
    fi
    
    # Check architecture support
    local arch_info=$(detect_architecture)
    if [[ "$arch_info" == *"Unknown"* ]]; then
        echo "ERROR: Unsupported architecture"
        ((errors++))
    else
        echo "✓ Architecture supported: $arch_info"
    fi
    
    # Check Node.js
    if check_node_version "18.0.0"; then
        echo "✓ Node.js requirement met"
    else
        echo "WARNING: Node.js 18+ required"
        ((warnings++))
    fi
    
    # Check Git
    if check_git_version "2.0.0"; then
        echo "✓ Git requirement met"
    else
        echo "WARNING: Git 2.0+ required"
        ((warnings++))
    fi
    
    # Check SSH (optional)
    if check_ssh_access "github.com" "22"; then
        echo "✓ SSH access available"
    else
        echo "WARNING: SSH access not available (Git operations may be limited)"
        ((warnings++))
    fi
    
    # Report results
    if [[ $errors -eq 0 ]]; then
        echo "System requirements validation passed with $warnings warnings"
        return 0
    else
        echo "System requirements validation failed with $errors errors and $warnings warnings"
        return 1
    fi
}

# Get comprehensive system information
get_system_info() {
    echo "=== System Information ==="
    detect_os
    detect_architecture
    detect_distribution
    echo "=== Tool Availability ==="
    check_node_version "18.0.0"
    check_git_version "2.0.0"
    check_ssh_access "github.com" "22"
    echo "=== System Requirements ==="
    validate_system_requirements
}

# Main function for command line usage
main() {
    local command="${1:-info}"
    
    case "$command" in
        "os")
            detect_os
            ;;
        "arch")
            detect_architecture
            ;;
        "distro")
            detect_distribution
            ;;
        "node")
            check_node_version "${2:-18.0.0}"
            ;;
        "git")
            check_git_version "${2:-2.0.0}"
            ;;
        "ssh")
            check_ssh_access "${2:-github.com}" "${3:-22}"
            ;;
        "validate")
            validate_system_requirements
            ;;
        "info"|*)
            get_system_info
            ;;
    esac
}

# Export functions for use by other scripts
export -f detect_os
export -f detect_architecture
export -f detect_distribution
export -f check_node_version
export -f check_git_version
export -f check_ssh_access
export -f validate_system_requirements
export -f get_system_info

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
