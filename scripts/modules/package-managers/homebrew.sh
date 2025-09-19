#!/bin/bash

# Homebrew Package Manager Module
# Handles package installation and management via Homebrew

set -euo pipefail

# Check if Homebrew is available
is_homebrew_available() {
    command -v brew >/dev/null 2>&1
}

# Install package via Homebrew
install_package() {
    local package="$1"
    local version="${2:-}"
    
    if ! is_homebrew_available; then
        echo "ERROR: Homebrew is not available"
        return 1
    fi
    
    echo "Installing $package via Homebrew..."
    
    if [[ -n "$version" ]]; then
        brew install "$package@$version"
    else
        brew install "$package"
    fi
    
    echo "Package $package installed successfully"
    return 0
}

# Update Homebrew
update_homebrew() {
    if ! is_homebrew_available; then
        echo "ERROR: Homebrew is not available"
        return 1
    fi
    
    echo "Updating Homebrew..."
    brew update
    echo "Homebrew updated successfully"
    return 0
}

# Upgrade packages via Homebrew
upgrade_packages() {
    local packages=("$@")
    
    if ! is_homebrew_available; then
        echo "ERROR: Homebrew is not available"
        return 1
    fi
    
    if [[ ${#packages[@]} -eq 0 ]]; then
        echo "Upgrading all packages via Homebrew..."
        brew upgrade
    else
        echo "Upgrading packages via Homebrew: ${packages[*]}"
        for package in "${packages[@]}"; do
            brew upgrade "$package"
        done
    fi
    
    echo "Packages upgraded successfully"
    return 0
}

# Uninstall package via Homebrew
uninstall_package() {
    local package="$1"
    local force="${2:-false}"
    
    if ! is_homebrew_available; then
        echo "ERROR: Homebrew is not available"
        return 1
    fi
    
    echo "Uninstalling $package via Homebrew..."
    
    if [[ "$force" == "true" ]]; then
        brew uninstall --force "$package"
    else
        brew uninstall "$package"
    fi
    
    echo "Package $package uninstalled successfully"
    return 0
}

# List installed packages
list_installed_packages() {
    if ! is_homebrew_available; then
        echo "ERROR: Homebrew is not available"
        return 1
    fi
    
    echo "Installed packages via Homebrew:"
    brew list
    return 0
}

# Get package information
get_package_info() {
    local package="$1"
    
    if ! is_homebrew_available; then
        echo "ERROR: Homebrew is not available"
        return 1
    fi
    
    echo "Package information for $package:"
    brew info "$package"
    return 0
}

# Check if package is installed
is_package_installed() {
    local package="$1"
    
    if ! is_homebrew_available; then
        echo "ERROR: Homebrew is not available"
        return 1
    fi
    
    if brew list "$package" >/dev/null 2>&1; then
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
    
    if ! is_homebrew_available; then
        echo "ERROR: Homebrew is not available"
        return 1
    fi
    
    echo "Searching for packages matching '$query':"
    brew search "$query"
    return 0
}

# Export functions for use by other scripts
export -f is_homebrew_available
export -f install_package
export -f update_homebrew
export -f upgrade_packages
export -f uninstall_package
export -f list_installed_packages
export -f get_package_info
export -f is_package_installed
export -f search_packages
