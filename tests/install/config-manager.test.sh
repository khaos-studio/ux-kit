#!/bin/bash

# Configuration Manager Tests
# Tests for configuration setup and management functionality

set -euo pipefail

# Source test utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Test configuration
TEST_TEMP_DIR=""
TEST_CONFIG_DIR=""
TEST_HOME_DIR=""

# Test setup
setup_test_environment() {
    # Create temporary test directory
    TEST_TEMP_DIR=$(mktemp -d)
    TEST_CONFIG_DIR="$TEST_TEMP_DIR/.uxkit"
    TEST_HOME_DIR="$TEST_TEMP_DIR/home"
    
    # Create test home directory
    mkdir -p "$TEST_HOME_DIR"
    
    # Set test environment variables
    export HOME="$TEST_HOME_DIR"
    export UXKIT_CONFIG_DIR="$TEST_CONFIG_DIR"
    
    echo "Test environment setup complete"
    echo "Test temp dir: $TEST_TEMP_DIR"
    echo "Test config dir: $TEST_CONFIG_DIR"
    echo "Test home dir: $TEST_HOME_DIR"
}

# Test cleanup
cleanup_test_environment() {
    if [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]]; then
        rm -rf "$TEST_TEMP_DIR"
        echo "Test environment cleaned up"
    fi
    
    # Reset environment variables
    unset UXKIT_CONFIG_DIR
}

# Test trap for cleanup
trap cleanup_test_environment EXIT

# Source the configuration manager module (when it exists)
# For now, we'll create mock functions to test the interface
source_config_manager() {
    # Mock configuration manager functions for testing
    create_config_directories() {
        local config_dir="${1:-$UXKIT_CONFIG_DIR}"
        mkdir -p "$config_dir"/{config,logs,cache,data}
        echo "Configuration directories created in: $config_dir"
    }
    
    setup_environment_variables() {
        local config_dir="${1:-$UXKIT_CONFIG_DIR}"
        local shell_profile="${2:-$HOME/.bashrc}"
        
        # Add UXKIT environment variables to shell profile
        cat >> "$shell_profile" << EOF

# UX-Kit Configuration
export UXKIT_CONFIG_DIR="$config_dir"
export UXKIT_LOG_LEVEL="info"
export UXKIT_CACHE_DIR="$config_dir/cache"
export UXKIT_DATA_DIR="$config_dir/data"
EOF
        echo "Environment variables added to: $shell_profile"
    }
    
    create_default_config() {
        local config_dir="${1:-$UXKIT_CONFIG_DIR}"
        local config_file="$config_dir/config/default.yaml"
        
        mkdir -p "$(dirname "$config_file")"
        cat > "$config_file" << EOF
# UX-Kit Default Configuration
version: "1.0.0"
log_level: "info"
cache_enabled: true
auto_update: true
default_editor: "code"
theme: "default"
EOF
        echo "Default configuration created: $config_file"
    }
    
    setup_ssh_config() {
        local ssh_dir="$HOME/.ssh"
        local ssh_config="$ssh_dir/config"
        
        mkdir -p "$ssh_dir"
        chmod 700 "$ssh_dir"
        
        if [[ ! -f "$ssh_config" ]]; then
            cat > "$ssh_config" << EOF
# UX-Kit SSH Configuration
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes
EOF
            chmod 600 "$ssh_config"
        fi
        
        echo "SSH configuration setup: $ssh_config"
    }
    
    validate_configuration() {
        local config_dir="${1:-$UXKIT_CONFIG_DIR}"
        local errors=0
        
        # Check if config directory exists
        if [[ ! -d "$config_dir" ]]; then
            echo "ERROR: Configuration directory does not exist: $config_dir"
            ((errors++))
        fi
        
        # Check if required subdirectories exist
        for subdir in config logs cache data; do
            if [[ ! -d "$config_dir/$subdir" ]]; then
                echo "ERROR: Required subdirectory missing: $config_dir/$subdir"
                ((errors++))
            fi
        done
        
        # Check if default config file exists
        if [[ ! -f "$config_dir/config/default.yaml" ]]; then
            echo "ERROR: Default configuration file missing: $config_dir/config/default.yaml"
            ((errors++))
        fi
        
        # Check environment variables
        if [[ -z "${UXKIT_CONFIG_DIR:-}" ]]; then
            echo "ERROR: UXKIT_CONFIG_DIR environment variable not set"
            ((errors++))
        fi
        
        if [[ $errors -eq 0 ]]; then
            echo "Configuration validation passed"
            return 0
        else
            echo "Configuration validation failed with $errors errors"
            return 1
        fi
    }
}

# Use Case Test 1: Complete Configuration Setup
test_complete_configuration_setup() {
    echo "=== Use Case Test 1: Complete Configuration Setup ==="
    
    # Given: A clean system with no existing UX-Kit configuration
    setup_test_environment
    
    # When: User runs the configuration setup process
    create_config_directories
    setup_environment_variables
    create_default_config
    setup_ssh_config
    
    # Then: All configuration should be properly set up
    assert_directory_exists "$TEST_CONFIG_DIR"
    assert_directory_exists "$TEST_CONFIG_DIR/config"
    assert_directory_exists "$TEST_CONFIG_DIR/logs"
    assert_directory_exists "$TEST_CONFIG_DIR/cache"
    assert_directory_exists "$TEST_CONFIG_DIR/data"
    assert_file_exists "$TEST_CONFIG_DIR/config/default.yaml"
    assert_file_exists "$TEST_HOME_DIR/.bashrc"
    assert_file_exists "$TEST_HOME_DIR/.ssh/config"
    
    # And: Configuration validation should pass
    validate_configuration
    
    echo "✅ Use Case Test 1 passed: Complete configuration setup"
}

# Use Case Test 2: Configuration Directory Creation
test_configuration_directory_creation() {
    echo "=== Use Case Test 2: Configuration Directory Creation ==="
    
    # Given: A system with no UX-Kit configuration directory
    setup_test_environment
    
    # When: Creating configuration directories
    create_config_directories
    
    # Then: All required directories should be created
    assert_directory_exists "$TEST_CONFIG_DIR"
    assert_directory_exists "$TEST_CONFIG_DIR/config"
    assert_directory_exists "$TEST_CONFIG_DIR/logs"
    assert_directory_exists "$TEST_CONFIG_DIR/cache"
    assert_directory_exists "$TEST_CONFIG_DIR/data"
    
    # And: Directories should have proper permissions
    assert_directory_permissions "$TEST_CONFIG_DIR" "755"
    
    echo "✅ Use Case Test 2 passed: Configuration directory creation"
}

# Use Case Test 3: Environment Variable Setup
test_environment_variable_setup() {
    echo "=== Use Case Test 3: Environment Variable Setup ==="
    
    # Given: A system with no UX-Kit environment variables
    setup_test_environment
    
    # When: Setting up environment variables
    setup_environment_variables
    
    # Then: Environment variables should be added to shell profile
    assert_file_exists "$TEST_HOME_DIR/.bashrc"
    assert_file_contains "$TEST_HOME_DIR/.bashrc" "UXKIT_CONFIG_DIR"
    assert_file_contains "$TEST_HOME_DIR/.bashrc" "UXKIT_LOG_LEVEL"
    assert_file_contains "$TEST_HOME_DIR/.bashrc" "UXKIT_CACHE_DIR"
    assert_file_contains "$TEST_HOME_DIR/.bashrc" "UXKIT_DATA_DIR"
    
    echo "✅ Use Case Test 3 passed: Environment variable setup"
}

# Use Case Test 4: Default Configuration Creation
test_default_configuration_creation() {
    echo "=== Use Case Test 4: Default Configuration Creation ==="
    
    # Given: A system with configuration directories but no config file
    setup_test_environment
    create_config_directories
    
    # When: Creating default configuration
    create_default_config
    
    # Then: Default configuration file should be created with proper content
    assert_file_exists "$TEST_CONFIG_DIR/config/default.yaml"
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "version:"
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "log_level:"
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "cache_enabled:"
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "auto_update:"
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "default_editor:"
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "theme:"
    
    echo "✅ Use Case Test 4 passed: Default configuration creation"
}

# Use Case Test 5: SSH Configuration Setup
test_ssh_configuration_setup() {
    echo "=== Use Case Test 5: SSH Configuration Setup ==="
    
    # Given: A system with no SSH configuration for UX-Kit
    setup_test_environment
    
    # When: Setting up SSH configuration
    setup_ssh_config
    
    # Then: SSH directory and config should be created with proper permissions
    assert_directory_exists "$TEST_HOME_DIR/.ssh"
    assert_file_exists "$TEST_HOME_DIR/.ssh/config"
    assert_directory_permissions "$TEST_HOME_DIR/.ssh" "700"
    assert_file_permissions "$TEST_HOME_DIR/.ssh/config" "600"
    
    # And: SSH config should contain GitHub configuration
    assert_file_contains "$TEST_HOME_DIR/.ssh/config" "Host github.com"
    assert_file_contains "$TEST_HOME_DIR/.ssh/config" "IdentityFile"
    
    echo "✅ Use Case Test 5 passed: SSH configuration setup"
}

# Use Case Test 6: Configuration Validation
test_configuration_validation() {
    echo "=== Use Case Test 6: Configuration Validation ==="
    
    # Given: A properly configured system
    setup_test_environment
    create_config_directories
    setup_environment_variables
    create_default_config
    
    # When: Validating configuration
    validate_configuration
    
    # Then: Validation should pass without errors
    assert_exit_code 0 validate_configuration
    
    echo "✅ Use Case Test 6 passed: Configuration validation"
}

# Use Case Test 7: Configuration Validation with Missing Components
test_configuration_validation_missing_components() {
    echo "=== Use Case Test 7: Configuration Validation with Missing Components ==="
    
    # Given: A system with incomplete configuration
    setup_test_environment
    # Only create config directory, not subdirectories or files
    
    # When: Validating configuration
    validate_configuration
    
    # Then: Validation should fail with appropriate errors
    assert_exit_code 1 validate_configuration
    
    echo "✅ Use Case Test 7 passed: Configuration validation with missing components"
}

# Use Case Test 8: Configuration Backup and Restore
test_configuration_backup_and_restore() {
    echo "=== Use Case Test 8: Configuration Backup and Restore ==="
    
    # Given: A system with existing configuration
    setup_test_environment
    create_config_directories
    create_default_config
    
    # Create a backup
    local backup_dir="$TEST_TEMP_DIR/backup"
    cp -r "$TEST_CONFIG_DIR" "$backup_dir"
    
    # When: Configuration is modified and then restored
    echo "# Modified config" >> "$TEST_CONFIG_DIR/config/default.yaml"
    rm -rf "$TEST_CONFIG_DIR"
    cp -r "$backup_dir" "$TEST_CONFIG_DIR"
    
    # Then: Original configuration should be restored
    assert_file_exists "$TEST_CONFIG_DIR/config/default.yaml"
    assert_file_not_contains "$TEST_CONFIG_DIR/config/default.yaml" "Modified config"
    
    echo "✅ Use Case Test 8 passed: Configuration backup and restore"
}

# Use Case Test 9: Multiple Shell Profile Support
test_multiple_shell_profile_support() {
    echo "=== Use Case Test 9: Multiple Shell Profile Support ==="
    
    # Given: A system with multiple shell profiles
    setup_test_environment
    local zshrc="$TEST_HOME_DIR/.zshrc"
    local fish_config="$TEST_HOME_DIR/.config/fish/config.fish"
    
    mkdir -p "$(dirname "$fish_config")"
    touch "$zshrc" "$fish_config"
    
    # When: Setting up environment variables for different shells
    setup_environment_variables "$TEST_CONFIG_DIR" "$zshrc"
    setup_environment_variables "$TEST_CONFIG_DIR" "$fish_config"
    
    # Then: Environment variables should be added to all profiles
    assert_file_contains "$zshrc" "UXKIT_CONFIG_DIR"
    assert_file_contains "$fish_config" "UXKIT_CONFIG_DIR"
    
    echo "✅ Use Case Test 9 passed: Multiple shell profile support"
}

# Use Case Test 10: Configuration Error Handling
test_configuration_error_handling() {
    echo "=== Use Case Test 10: Configuration Error Handling ==="
    
    # Given: A system with permission issues
    setup_test_environment
    
    # Create a read-only directory
    mkdir -p "$TEST_CONFIG_DIR"
    chmod 444 "$TEST_CONFIG_DIR"
    
    # When: Attempting to create configuration in read-only directory
    # Then: Should handle the error gracefully
    if create_config_directories 2>/dev/null; then
        echo "ERROR: Should have failed to create directories in read-only location"
        return 1
    fi
    
    # Restore permissions for cleanup
    chmod 755 "$TEST_CONFIG_DIR"
    
    echo "✅ Use Case Test 10 passed: Configuration error handling"
}

# Helper assertion functions
assert_directory_exists() {
    local dir="$1"
    if [[ ! -d "$dir" ]]; then
        echo "ASSERTION FAILED: Directory does not exist: $dir"
        return 1
    fi
}

assert_file_exists() {
    local file="$1"
    if [[ ! -f "$file" ]]; then
        echo "ASSERTION FAILED: File does not exist: $file"
        return 1
    fi
}

assert_file_contains() {
    local file="$1"
    local pattern="$2"
    if ! grep -q "$pattern" "$file"; then
        echo "ASSERTION FAILED: File does not contain pattern '$pattern': $file"
        return 1
    fi
}

assert_file_not_contains() {
    local file="$1"
    local pattern="$2"
    if grep -q "$pattern" "$file"; then
        echo "ASSERTION FAILED: File contains pattern '$pattern': $file"
        return 1
    fi
}

assert_directory_permissions() {
    local dir="$1"
    local expected="$2"
    local actual=$(stat -c "%a" "$dir" 2>/dev/null || stat -f "%OLp" "$dir" 2>/dev/null)
    if [[ "$actual" != "$expected" ]]; then
        echo "ASSERTION FAILED: Directory permissions mismatch. Expected: $expected, Actual: $actual"
        return 1
    fi
}

assert_file_permissions() {
    local file="$1"
    local expected="$2"
    local actual=$(stat -c "%a" "$file" 2>/dev/null || stat -f "%OLp" "$file" 2>/dev/null)
    if [[ "$actual" != "$expected" ]]; then
        echo "ASSERTION FAILED: File permissions mismatch. Expected: $expected, Actual: $actual"
        return 1
    fi
}

assert_exit_code() {
    local expected="$1"
    shift
    local command="$*"
    
    if $command; then
        local actual=0
    else
        local actual=1
    fi
    
    if [[ "$actual" != "$expected" ]]; then
        echo "ASSERTION FAILED: Exit code mismatch. Expected: $expected, Actual: $actual"
        return 1
    fi
}

# Main test runner
run_tests() {
    echo "Starting Configuration Manager Tests..."
    echo "======================================"
    
    # Source the configuration manager functions
    source_config_manager
    
    # Run all use case tests
    test_complete_configuration_setup
    test_configuration_directory_creation
    test_environment_variable_setup
    test_default_configuration_creation
    test_ssh_configuration_setup
    test_configuration_validation
    test_configuration_validation_missing_components
    test_configuration_backup_and_restore
    test_multiple_shell_profile_support
    test_configuration_error_handling
    
    echo "======================================"
    echo "All Configuration Manager Tests Passed! ✅"
}

# Run tests if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    run_tests
fi
