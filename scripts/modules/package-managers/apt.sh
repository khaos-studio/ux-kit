#!/bin/bash

# APT Package Manager Module
# Handles package installation and management via APT

set -euo pipefail

# Check if APT is available
is_apt_available() {
    command -v apt >/dev/null 2>&1 || command -v apt-get >/dev/null 2>&1
}

# Get APT command
get_apt_command() {
    if command -v apt >/dev/null 2>&1; then
        echo "apt"
    elif command -v apt-get >/dev/null 2>&1; then
        echo "apt-get"
    else
        echo ""
    fi
}

# Install package via APT
install_package() {
    local package="$1"
    local version="${2:-}"
    
    if ! is_apt_available; then
        echo "ERROR: APT is not available"
        return 1
    fi
    
    local apt_cmd=$(get_apt_command)
    
    echo "Installing $package via APT..."
    
    if [[ -n "$version" ]]; then
        sudo "$apt_cmd" install -y "$package=$version"
    else
        sudo "$apt_cmd" install -y "$package"
    fi
    
    echo "Package $package installed successfully"
    return 0
}

# Update APT package lists
update_apt() {
    if ! is_apt_available; then
        echo "ERROR: APT is not available"
        return 1
    fi
    
    local apt_cmd=$(get_apt_command)
    
    echo "Updating APT package lists..."
    sudo "$apt_cmd" update
    echo "APT package lists updated successfully"
    return 0
}

# Upgrade packages via APT
upgrade_packages() {
    local packages=("$@")
    
    if ! is_apt_available; then
        echo "ERROR: APT is not available"
        return 1
    fi
    
    local apt_cmd=$(get_apt_command)
    
    if [[ ${#packages[@]} -eq 0 ]]; then
        echo "Upgrading all packages via APT..."
        sudo "$apt_cmd" upgrade -y
    else
        echo "Upgrading packages via APT: ${packages[*]}"
        for package in "${packages[@]}"; do
            sudo "$apt_cmd" install -y "$package"
        done
    fi
    
    echo "Packages upgraded successfully"
    return 0
}

# Uninstall package via APT
uninstall_package() {
    local package="$1"
    local purge="${2:-false}"
    
    if ! is_apt_available; then
        echo "ERROR: APT is not available"
        return 1
    fi
    
    local apt_cmd=$(get_apt_command)
    
    echo "Uninstalling $package via APT..."
    
    if [[ "$purge" == "true" ]]; then
        sudo "$apt_cmd" purge -y "$package"
    else
        sudo "$apt_cmd" remove -y "$package"
    fi
    
    echo "Package $package uninstalled successfully"
    return 0
}

# List installed packages
list_installed_packages() {
    if ! is_apt_available; then
        echo "ERROR: APT is not available"
        return 1
    fi
    
    echo "Installed packages via APT:"
    dpkg -l | grep "^ii" | awk '{print $2}'
    return 0
}

# Get package information
get_package_info() {
    local package="$1"
    
    if ! is_apt_available; then
        echo "ERROR: APT is not available"
        return 1
    fi
    
    echo "Package information for $package:"
    apt show "$package" 2>/dev/null || apt-cache show "$package" 2>/dev/null
    return 0
}

# Check if package is installed
is_package_installed() {
    local package="$1"
    
    if ! is_apt_available; then
        echo "ERROR: APT is not available"
        return 1
    fi
    
    if dpkg -l "$package" >/dev/null 2>&1; then
        echo "Package $package is installed"
        return 0
    else
        echo "Package $package is not installed"
        return 1
    fi
}

# Search for packages
search_packages() {
    local query="$1"
    
    if ! is_apt_available; then
        echo "ERROR: APT is not available"
        return 1
    fi
    
    echo "Searching for packages matching '$query':"
    apt search "$query" 2>/dev/null || apt-cache search "$query"
    return 0
}

# Add repository
add_repository() {
    local repo="$1"
    
    if ! is_apt_available; then
        echo "ERROR: APT is not available"
        return 1
    fi
    
    echo "Adding repository: $repo"
    sudo apt-add-repository -y "$repo"
    sudo apt update
    echo "Repository added successfully"
    return 0
}

# Export functions for use by other scripts
export -f is_apt_available
export -f get_apt_command
export -f install_package
export -f update_apt
export -f upgrade_packages
export -f uninstall_package
export -f list_installed_packages
export -f get_package_info
export -f is_package_installed
export -f search_packages
export -f add_repository
