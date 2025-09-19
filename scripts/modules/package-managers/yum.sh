#!/bin/bash

# YUM Package Manager Module
# Handles package installation and management via YUM

set -euo pipefail

# Check if YUM is available
is_yum_available() {
    command -v yum >/dev/null 2>&1 || command -v dnf >/dev/null 2>&1
}

# Get YUM command
get_yum_command() {
    if command -v dnf >/dev/null 2>&1; then
        echo "dnf"
    elif command -v yum >/dev/null 2>&1; then
        echo "yum"
    else
        echo ""
    fi
}

# Install package via YUM
install_package() {
    local package="$1"
    local version="${2:-}"
    
    if ! is_yum_available; then
        echo "ERROR: YUM is not available"
        return 1
    fi
    
    local yum_cmd=$(get_yum_command)
    
    echo "Installing $package via YUM..."
    
    if [[ -n "$version" ]]; then
        sudo "$yum_cmd" install -y "$package-$version"
    else
        sudo "$yum_cmd" install -y "$package"
    fi
    
    echo "Package $package installed successfully"
    return 0
}

# Update YUM package lists
update_yum() {
    if ! is_yum_available; then
        echo "ERROR: YUM is not available"
        return 1
    fi
    
    local yum_cmd=$(get_yum_command)
    
    echo "Updating YUM package lists..."
    sudo "$yum_cmd" update -y
    echo "YUM package lists updated successfully"
    return 0
}

# Upgrade packages via YUM
upgrade_packages() {
    local packages=("$@")
    
    if ! is_yum_available; then
        echo "ERROR: YUM is not available"
        return 1
    fi
    
    local yum_cmd=$(get_yum_command)
    
    if [[ ${#packages[@]} -eq 0 ]]; then
        echo "Upgrading all packages via YUM..."
        sudo "$yum_cmd" upgrade -y
    else
        echo "Upgrading packages via YUM: ${packages[*]}"
        for package in "${packages[@]}"; do
            sudo "$yum_cmd" install -y "$package"
        done
    fi
    
    echo "Packages upgraded successfully"
    return 0
}

# Uninstall package via YUM
uninstall_package() {
    local package="$1"
    local remove_deps="${2:-false}"
    
    if ! is_yum_available; then
        echo "ERROR: YUM is not available"
        return 1
    fi
    
    local yum_cmd=$(get_yum_command)
    
    echo "Uninstalling $package via YUM..."
    
    if [[ "$remove_deps" == "true" ]]; then
        sudo "$yum_cmd" remove -y "$package"
    else
        sudo "$yum_cmd" remove -y "$package"
    fi
    
    echo "Package $package uninstalled successfully"
    return 0
}

# List installed packages
list_installed_packages() {
    if ! is_yum_available; then
        echo "ERROR: YUM is not available"
        return 1
    fi
    
    local yum_cmd=$(get_yum_command)
    
    echo "Installed packages via YUM:"
    "$yum_cmd" list installed | awk 'NR>1 {print $1}'
    return 0
}

# Get package information
get_package_info() {
    local package="$1"
    
    if ! is_yum_available; then
        echo "ERROR: YUM is not available"
        return 1
    fi
    
    local yum_cmd=$(get_yum_command)
    
    echo "Package information for $package:"
    "$yum_cmd" info "$package"
    return 0
}

# Check if package is installed
is_package_installed() {
    local package="$1"
    
    if ! is_yum_available; then
        echo "ERROR: YUM is not available"
        return 1
    fi
    
    local yum_cmd=$(get_yum_command)
    
    if "$yum_cmd" list installed "$package" >/dev/null 2>&1; then
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
    
    if ! is_yum_available; then
        echo "ERROR: YUM is not available"
        return 1
    fi
    
    local yum_cmd=$(get_yum_command)
    
    echo "Searching for packages matching '$query':"
    "$yum_cmd" search "$query"
    return 0
}

# Add repository
add_repository() {
    local repo="$1"
    
    if ! is_yum_available; then
        echo "ERROR: YUM is not available"
        return 1
    fi
    
    local yum_cmd=$(get_yum_command)
    
    echo "Adding repository: $repo"
    sudo "$yum_cmd" config-manager --add-repo "$repo"
    sudo "$yum_cmd" update
    echo "Repository added successfully"
    return 0
}

# Install EPEL repository
install_epel() {
    if ! is_yum_available; then
        echo "ERROR: YUM is not available"
        return 1
    fi
    
    local yum_cmd=$(get_yum_command)
    
    echo "Installing EPEL repository..."
    sudo "$yum_cmd" install -y epel-release
    echo "EPEL repository installed successfully"
    return 0
}

# Export functions for use by other scripts
export -f is_yum_available
export -f get_yum_command
export -f install_package
export -f update_yum
export -f upgrade_packages
export -f uninstall_package
export -f list_installed_packages
export -f get_package_info
export -f is_package_installed
export -f search_packages
export -f add_repository
export -f install_epel
