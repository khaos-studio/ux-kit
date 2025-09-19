#!/bin/bash

# Configuration Manager Mock
# Mock implementation for testing configuration management functionality

set -euo pipefail

# Mock configuration manager functions
mock_create_config_directories() {
    local config_dir="${1:-${UXKIT_CONFIG_DIR:-$HOME/.uxkit}}"
    local create_subdirs="${2:-true}"
    
    echo "MOCK: Creating configuration directories in: $config_dir"
    
    if [[ "$create_subdirs" == "true" ]]; then
        mkdir -p "$config_dir"/{config,logs,cache,data,templates,completions}
        echo "MOCK: Created subdirectories: config, logs, cache, data, templates, completions"
    else
        mkdir -p "$config_dir"
        echo "MOCK: Created main configuration directory only"
    fi
    
    return 0
}

mock_setup_environment_variables() {
    local config_dir="${1:-${UXKIT_CONFIG_DIR:-$HOME/.uxkit}}"
    local shell_profile="${2:-$HOME/.bashrc}"
    local append_mode="${3:-true}"
    
    echo "MOCK: Setting up environment variables"
    echo "MOCK: Config directory: $config_dir"
    echo "MOCK: Shell profile: $shell_profile"
    echo "MOCK: Append mode: $append_mode"
    
    # Create shell profile if it doesn't exist
    if [[ ! -f "$shell_profile" ]]; then
        touch "$shell_profile"
        echo "MOCK: Created shell profile: $shell_profile"
    fi
    
    # Add environment variables
    if [[ "$append_mode" == "true" ]]; then
        cat >> "$shell_profile" << EOF

# UX-Kit Configuration (Mock)
export UXKIT_CONFIG_DIR="$config_dir"
export UXKIT_LOG_LEVEL="info"
export UXKIT_CACHE_DIR="$config_dir/cache"
export UXKIT_DATA_DIR="$config_dir/data"
export UXKIT_LOG_DIR="$config_dir/logs"
EOF
    else
        cat > "$shell_profile" << EOF
# UX-Kit Configuration (Mock)
export UXKIT_CONFIG_DIR="$config_dir"
export UXKIT_LOG_LEVEL="info"
export UXKIT_CACHE_DIR="$config_dir/cache"
export UXKIT_DATA_DIR="$config_dir/data"
export UXKIT_LOG_DIR="$config_dir/logs"
EOF
    fi
    
    echo "MOCK: Environment variables added to: $shell_profile"
    return 0
}

mock_create_default_config() {
    local config_dir="${1:-${UXKIT_CONFIG_DIR:-$HOME/.uxkit}}"
    local config_file="$config_dir/config/default.yaml"
    local template_file="${2:-}"
    
    echo "MOCK: Creating default configuration"
    echo "MOCK: Config file: $config_file"
    echo "MOCK: Template file: ${template_file:-none}"
    
    # Create config directory if it doesn't exist
    mkdir -p "$(dirname "$config_file")"
    
    # Use template if provided, otherwise create default
    if [[ -n "$template_file" && -f "$template_file" ]]; then
        cp "$template_file" "$config_file"
        echo "MOCK: Used template file: $template_file"
    else
        cat > "$config_file" << EOF
# UX-Kit Default Configuration (Mock)
version: "1.0.0"
log_level: "info"
cache_enabled: true
auto_update: true
default_editor: "code"
theme: "default"

# Research settings
research:
  default_study_type: "user_interview"
  auto_save: true
  backup_enabled: true
  max_backups: 5

# Output settings
output:
  format: "markdown"
  include_timestamps: true
  include_metadata: true
  template_dir: "templates"

# Integration settings
integrations:
  github:
    enabled: true
    auto_sync: false
  slack:
    enabled: false
  notion:
    enabled: false

# Security settings
security:
  encrypt_sensitive_data: false
  require_authentication: false
  session_timeout: 3600
EOF
        echo "MOCK: Created default configuration content"
    fi
    
    echo "MOCK: Default configuration created: $config_file"
    return 0
}

mock_setup_ssh_config() {
    local ssh_dir="$HOME/.ssh"
    local ssh_config="$ssh_dir/config"
    local template_file="${1:-}"
    local force_overwrite="${2:-false}"
    
    echo "MOCK: Setting up SSH configuration"
    echo "MOCK: SSH directory: $ssh_dir"
    echo "MOCK: SSH config: $ssh_config"
    echo "MOCK: Template file: ${template_file:-none}"
    echo "MOCK: Force overwrite: $force_overwrite"
    
    # Create SSH directory if it doesn't exist
    mkdir -p "$ssh_dir"
    chmod 700 "$ssh_dir"
    
    # Check if config already exists
    if [[ -f "$ssh_config" && "$force_overwrite" != "true" ]]; then
        echo "MOCK: SSH config already exists, skipping creation"
        return 0
    fi
    
    # Use template if provided, otherwise create default
    if [[ -n "$template_file" && -f "$template_file" ]]; then
        cp "$template_file" "$ssh_config"
        echo "MOCK: Used SSH template file: $template_file"
    else
        cat > "$ssh_config" << EOF
# UX-Kit SSH Configuration (Mock)
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes
    AddKeysToAgent yes
    UseKeychain yes

# UX-Kit specific GitHub configuration
Host uxkit-github
    HostName github.com
    User git
    IdentityFile ~/.ssh/uxkit_rsa
    IdentitiesOnly yes
    AddKeysToAgent yes
    UseKeychain yes

# SSH connection settings
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    TCPKeepAlive yes
    Compression yes
    ForwardAgent yes
EOF
        echo "MOCK: Created default SSH configuration content"
    fi
    
    chmod 600 "$ssh_config"
    echo "MOCK: SSH configuration setup: $ssh_config"
    return 0
}

mock_validate_configuration() {
    local config_dir="${1:-${UXKIT_CONFIG_DIR:-$HOME/.uxkit}}"
    local strict_mode="${2:-false}"
    local errors=0
    local warnings=0
    
    echo "MOCK: Validating configuration"
    echo "MOCK: Config directory: $config_dir"
    echo "MOCK: Strict mode: $strict_mode"
    
    # Check if config directory exists
    if [[ ! -d "$config_dir" ]]; then
        echo "MOCK ERROR: Configuration directory does not exist: $config_dir"
        ((errors++))
    else
        echo "MOCK: Configuration directory exists: $config_dir"
    fi
    
    # Check required subdirectories
    local required_dirs=("config" "logs" "cache" "data")
    for subdir in "${required_dirs[@]}"; do
        if [[ ! -d "$config_dir/$subdir" ]]; then
            echo "MOCK ERROR: Required subdirectory missing: $config_dir/$subdir"
            ((errors++))
        else
            echo "MOCK: Required subdirectory exists: $config_dir/$subdir"
        fi
    done
    
    # Check optional subdirectories
    local optional_dirs=("templates" "completions")
    for subdir in "${optional_dirs[@]}"; do
        if [[ ! -d "$config_dir/$subdir" ]]; then
            echo "MOCK WARNING: Optional subdirectory missing: $config_dir/$subdir"
            ((warnings++))
        else
            echo "MOCK: Optional subdirectory exists: $config_dir/$subdir"
        fi
    done
    
    # Check default config file
    if [[ ! -f "$config_dir/config/default.yaml" ]]; then
        echo "MOCK ERROR: Default configuration file missing: $config_dir/config/default.yaml"
        ((errors++))
    else
        echo "MOCK: Default configuration file exists: $config_dir/config/default.yaml"
    fi
    
    # Check environment variables (only check UXKIT_CONFIG_DIR as it's the only one set in tests)
    if [[ -z "${UXKIT_CONFIG_DIR:-}" ]]; then
        echo "MOCK ERROR: Required environment variable not set: UXKIT_CONFIG_DIR"
        ((errors++))
    else
        echo "MOCK: Required environment variable set: UXKIT_CONFIG_DIR=${UXKIT_CONFIG_DIR}"
    fi
    
    # Check optional environment variables
    local optional_env_vars=("UXKIT_GITHUB_TOKEN" "UXKIT_SLACK_TOKEN" "UXKIT_NOTION_TOKEN")
    for env_var in "${optional_env_vars[@]}"; do
        if [[ -z "${!env_var:-}" ]]; then
            echo "MOCK WARNING: Optional environment variable not set: $env_var"
            ((warnings++))
        else
            echo "MOCK: Optional environment variable set: $env_var"
        fi
    done
    
    # Report results
    echo "MOCK: Validation complete - Errors: $errors, Warnings: $warnings"
    
    if [[ $errors -eq 0 ]]; then
        echo "MOCK: Configuration validation passed"
        return 0
    else
        echo "MOCK: Configuration validation failed with $errors errors"
        return 1
    fi
}

mock_backup_configuration() {
    local config_dir="${1:-${UXKIT_CONFIG_DIR:-$HOME/.uxkit}}"
    local backup_dir="${2:-$config_dir.backup.$(date +%Y%m%d_%H%M%S)}"
    local include_logs="${3:-false}"
    
    echo "MOCK: Backing up configuration"
    echo "MOCK: Source: $config_dir"
    echo "MOCK: Destination: $backup_dir"
    echo "MOCK: Include logs: $include_logs"
    
    if [[ ! -d "$config_dir" ]]; then
        echo "MOCK ERROR: Configuration directory does not exist: $config_dir"
        return 1
    fi
    
    # Create backup directory
    mkdir -p "$backup_dir"
    
    # Copy configuration files
    cp -r "$config_dir"/* "$backup_dir/" 2>/dev/null || true
    
    # Optionally exclude logs
    if [[ "$include_logs" != "true" ]]; then
        rm -rf "$backup_dir/logs" 2>/dev/null || true
        echo "MOCK: Excluded logs from backup"
    fi
    
    echo "MOCK: Configuration backed up to: $backup_dir"
    return 0
}

mock_restore_configuration() {
    local backup_dir="$1"
    local config_dir="${2:-${UXKIT_CONFIG_DIR:-$HOME/.uxkit}}"
    local force_overwrite="${3:-false}"
    
    echo "MOCK: Restoring configuration"
    echo "MOCK: Source: $backup_dir"
    echo "MOCK: Destination: $config_dir"
    echo "MOCK: Force overwrite: $force_overwrite"
    
    if [[ ! -d "$backup_dir" ]]; then
        echo "MOCK ERROR: Backup directory does not exist: $backup_dir"
        return 1
    fi
    
    # Check if destination exists
    if [[ -d "$config_dir" && "$force_overwrite" != "true" ]]; then
        echo "MOCK ERROR: Configuration directory already exists: $config_dir"
        echo "MOCK: Use force_overwrite=true to overwrite"
        return 1
    fi
    
    # Create destination directory
    mkdir -p "$(dirname "$config_dir")"
    
    # Restore configuration
    cp -r "$backup_dir" "$config_dir"
    
    echo "MOCK: Configuration restored from: $backup_dir"
    return 0
}

# Export mock functions
export -f mock_create_config_directories
export -f mock_setup_environment_variables
export -f mock_create_default_config
export -f mock_setup_ssh_config
export -f mock_validate_configuration
export -f mock_backup_configuration
export -f mock_restore_configuration

echo "Configuration Manager Mock loaded successfully"
