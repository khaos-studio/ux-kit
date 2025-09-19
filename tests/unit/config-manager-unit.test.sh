#!/bin/bash

# Configuration Manager Unit Tests
# Unit tests for individual configuration management functions

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
    
    echo "Unit test environment setup complete"
}

# Test cleanup
cleanup_test_environment() {
    if [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]]; then
        rm -rf "$TEST_TEMP_DIR"
        echo "Unit test environment cleaned up"
    fi
    
    # Reset environment variables
    unset UXKIT_CONFIG_DIR
}

# Test trap for cleanup
trap cleanup_test_environment EXIT

# Source the mock configuration manager
source "$PROJECT_ROOT/tests/mocks/config-manager.mock.sh"

# Unit Test 1: create_config_directories function
test_create_config_directories_basic() {
    echo "=== Unit Test 1: create_config_directories basic functionality ==="
    
    setup_test_environment
    
    # Test basic directory creation
    mock_create_config_directories
    
    # Verify directories were created
    assert_directory_exists "$TEST_CONFIG_DIR"
    assert_directory_exists "$TEST_CONFIG_DIR/config"
    assert_directory_exists "$TEST_CONFIG_DIR/logs"
    assert_directory_exists "$TEST_CONFIG_DIR/cache"
    assert_directory_exists "$TEST_CONFIG_DIR/data"
    assert_directory_exists "$TEST_CONFIG_DIR/templates"
    assert_directory_exists "$TEST_CONFIG_DIR/completions"
    
    echo "✅ Unit Test 1 passed: create_config_directories basic functionality"
}

test_create_config_directories_custom_path() {
    echo "=== Unit Test 2: create_config_directories with custom path ==="
    
    setup_test_environment
    
    local custom_config_dir="$TEST_TEMP_DIR/custom-config"
    
    # Test directory creation with custom path
    mock_create_config_directories "$custom_config_dir"
    
    # Verify directories were created in custom location
    assert_directory_exists "$custom_config_dir"
    assert_directory_exists "$custom_config_dir/config"
    assert_directory_exists "$custom_config_dir/logs"
    assert_directory_exists "$custom_config_dir/cache"
    assert_directory_exists "$custom_config_dir/data"
    
    echo "✅ Unit Test 2 passed: create_config_directories with custom path"
}

test_create_config_directories_no_subdirs() {
    echo "=== Unit Test 3: create_config_directories without subdirectories ==="
    
    setup_test_environment
    
    # Test directory creation without subdirectories
    mock_create_config_directories "$TEST_CONFIG_DIR" "false"
    
    # Verify only main directory was created
    assert_directory_exists "$TEST_CONFIG_DIR"
    assert_directory_not_exists "$TEST_CONFIG_DIR/config"
    assert_directory_not_exists "$TEST_CONFIG_DIR/logs"
    
    echo "✅ Unit Test 3 passed: create_config_directories without subdirectories"
}

# Unit Test 2: setup_environment_variables function
test_setup_environment_variables_basic() {
    echo "=== Unit Test 4: setup_environment_variables basic functionality ==="
    
    setup_test_environment
    
    # Test environment variable setup
    mock_setup_environment_variables
    
    # Verify shell profile was created and contains environment variables
    assert_file_exists "$TEST_HOME_DIR/.bashrc"
    assert_file_contains "$TEST_HOME_DIR/.bashrc" "UXKIT_CONFIG_DIR"
    assert_file_contains "$TEST_HOME_DIR/.bashrc" "UXKIT_LOG_LEVEL"
    assert_file_contains "$TEST_HOME_DIR/.bashrc" "UXKIT_CACHE_DIR"
    assert_file_contains "$TEST_HOME_DIR/.bashrc" "UXKIT_DATA_DIR"
    
    echo "✅ Unit Test 4 passed: setup_environment_variables basic functionality"
}

test_setup_environment_variables_custom_shell() {
    echo "=== Unit Test 5: setup_environment_variables with custom shell profile ==="
    
    setup_test_environment
    
    local custom_shell="$TEST_HOME_DIR/.zshrc"
    
    # Test environment variable setup with custom shell profile
    mock_setup_environment_variables "$TEST_CONFIG_DIR" "$custom_shell"
    
    # Verify custom shell profile was created and contains environment variables
    assert_file_exists "$custom_shell"
    assert_file_contains "$custom_shell" "UXKIT_CONFIG_DIR"
    assert_file_contains "$custom_shell" "UXKIT_LOG_LEVEL"
    
    echo "✅ Unit Test 5 passed: setup_environment_variables with custom shell profile"
}

test_setup_environment_variables_overwrite_mode() {
    echo "=== Unit Test 6: setup_environment_variables in overwrite mode ==="
    
    setup_test_environment
    
    # Create existing shell profile with content
    echo "existing content" > "$TEST_HOME_DIR/.bashrc"
    
    # Test environment variable setup in overwrite mode
    mock_setup_environment_variables "$TEST_CONFIG_DIR" "$TEST_HOME_DIR/.bashrc" "false"
    
    # Verify shell profile was overwritten
    assert_file_exists "$TEST_HOME_DIR/.bashrc"
    assert_file_contains "$TEST_HOME_DIR/.bashrc" "UXKIT_CONFIG_DIR"
    assert_file_not_contains "$TEST_HOME_DIR/.bashrc" "existing content"
    
    echo "✅ Unit Test 6 passed: setup_environment_variables in overwrite mode"
}

# Unit Test 3: create_default_config function
test_create_default_config_basic() {
    echo "=== Unit Test 7: create_default_config basic functionality ==="
    
    setup_test_environment
    mock_create_config_directories
    
    # Test default configuration creation
    mock_create_default_config
    
    # Verify default configuration file was created
    assert_file_exists "$TEST_CONFIG_DIR/config/default.yaml"
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "version:"
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "log_level:"
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "cache_enabled:"
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "research:"
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "integrations:"
    
    echo "✅ Unit Test 7 passed: create_default_config basic functionality"
}

test_create_default_config_with_template() {
    echo "=== Unit Test 8: create_default_config with template file ==="
    
    setup_test_environment
    mock_create_config_directories
    
    # Create template file
    local template_file="$TEST_TEMP_DIR/template.yaml"
    cat > "$template_file" << EOF
# Template Configuration
version: "2.0.0"
custom_setting: "template_value"
EOF
    
    # Test default configuration creation with template
    mock_create_default_config "$TEST_CONFIG_DIR" "$template_file"
    
    # Verify configuration file was created from template
    assert_file_exists "$TEST_CONFIG_DIR/config/default.yaml"
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "version: \"2.0.0\""
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "custom_setting: \"template_value\""
    
    echo "✅ Unit Test 8 passed: create_default_config with template file"
}

# Unit Test 4: setup_ssh_config function
test_setup_ssh_config_basic() {
    echo "=== Unit Test 9: setup_ssh_config basic functionality ==="
    
    setup_test_environment
    
    # Test SSH configuration setup
    mock_setup_ssh_config
    
    # Verify SSH directory and config were created
    assert_directory_exists "$TEST_HOME_DIR/.ssh"
    assert_file_exists "$TEST_HOME_DIR/.ssh/config"
    assert_directory_permissions "$TEST_HOME_DIR/.ssh" "700"
    assert_file_permissions "$TEST_HOME_DIR/.ssh/config" "600"
    
    # Verify SSH config content
    assert_file_contains "$TEST_HOME_DIR/.ssh/config" "Host github.com"
    assert_file_contains "$TEST_HOME_DIR/.ssh/config" "IdentityFile"
    
    echo "✅ Unit Test 9 passed: setup_ssh_config basic functionality"
}

test_setup_ssh_config_with_template() {
    echo "=== Unit Test 10: setup_ssh_config with template file ==="
    
    setup_test_environment
    
    # Create template file
    local template_file="$TEST_TEMP_DIR/ssh-template"
    cat > "$template_file" << EOF
# Custom SSH Template
Host custom-host
    HostName example.com
    User custom-user
EOF
    
    # Test SSH configuration setup with template
    mock_setup_ssh_config "$template_file"
    
    # Verify SSH config was created from template
    assert_file_exists "$TEST_HOME_DIR/.ssh/config"
    assert_file_contains "$TEST_HOME_DIR/.ssh/config" "Host custom-host"
    assert_file_contains "$TEST_HOME_DIR/.ssh/config" "HostName example.com"
    
    echo "✅ Unit Test 10 passed: setup_ssh_config with template file"
}

test_setup_ssh_config_existing_file() {
    echo "=== Unit Test 11: setup_ssh_config with existing file ==="
    
    setup_test_environment
    
    # Create existing SSH config
    mkdir -p "$TEST_HOME_DIR/.ssh"
    echo "existing ssh config" > "$TEST_HOME_DIR/.ssh/config"
    chmod 600 "$TEST_HOME_DIR/.ssh/config"
    
    # Test SSH configuration setup (should not overwrite)
    mock_setup_ssh_config
    
    # Verify existing config was preserved
    assert_file_exists "$TEST_HOME_DIR/.ssh/config"
    assert_file_contains "$TEST_HOME_DIR/.ssh/config" "existing ssh config"
    
    echo "✅ Unit Test 11 passed: setup_ssh_config with existing file"
}

# Unit Test 5: validate_configuration function
test_validate_configuration_valid() {
    echo "=== Unit Test 12: validate_configuration with valid configuration ==="
    
    setup_test_environment
    mock_create_config_directories
    mock_setup_environment_variables
    mock_create_default_config
    
    # Test configuration validation
    mock_validate_configuration
    
    # Verify validation passed
    assert_exit_code 0 mock_validate_configuration
    
    echo "✅ Unit Test 12 passed: validate_configuration with valid configuration"
}

test_validate_configuration_invalid() {
    echo "=== Unit Test 13: validate_configuration with invalid configuration ==="
    
    setup_test_environment
    # Don't create any configuration
    
    # Test configuration validation
    mock_validate_configuration
    
    # Verify validation failed
    assert_exit_code 1 mock_validate_configuration
    
    echo "✅ Unit Test 13 passed: validate_configuration with invalid configuration"
}

test_validate_configuration_partial() {
    echo "=== Unit Test 14: validate_configuration with partial configuration ==="
    
    setup_test_environment
    mock_create_config_directories
    # Don't set up environment variables or create default config
    
    # Test configuration validation
    mock_validate_configuration
    
    # Verify validation failed due to missing components
    assert_exit_code 1 mock_validate_configuration
    
    echo "✅ Unit Test 14 passed: validate_configuration with partial configuration"
}

# Unit Test 6: backup_configuration function
test_backup_configuration_basic() {
    echo "=== Unit Test 15: backup_configuration basic functionality ==="
    
    setup_test_environment
    mock_create_config_directories
    mock_create_default_config
    
    # Create some test files
    echo "test log" > "$TEST_CONFIG_DIR/logs/test.log"
    echo "test cache" > "$TEST_CONFIG_DIR/cache/test.cache"
    
    # Test configuration backup
    mock_backup_configuration
    
    # Verify backup was created
    local backup_dir="$TEST_CONFIG_DIR.backup."*
    assert_directory_exists $backup_dir
    assert_file_exists "$backup_dir/config/default.yaml"
    assert_file_not_exists "$backup_dir/logs/test.log"  # Logs should be excluded by default
    
    echo "✅ Unit Test 15 passed: backup_configuration basic functionality"
}

test_backup_configuration_with_logs() {
    echo "=== Unit Test 16: backup_configuration including logs ==="
    
    setup_test_environment
    mock_create_config_directories
    mock_create_default_config
    
    # Create some test files
    echo "test log" > "$TEST_CONFIG_DIR/logs/test.log"
    
    # Test configuration backup including logs
    mock_backup_configuration "$TEST_CONFIG_DIR" "" "true"
    
    # Verify backup was created with logs
    local backup_dir="$TEST_CONFIG_DIR.backup."*
    assert_directory_exists $backup_dir
    assert_file_exists "$backup_dir/logs/test.log"
    
    echo "✅ Unit Test 16 passed: backup_configuration including logs"
}

# Unit Test 7: restore_configuration function
test_restore_configuration_basic() {
    echo "=== Unit Test 17: restore_configuration basic functionality ==="
    
    setup_test_environment
    
    # Create backup directory with test files
    local backup_dir="$TEST_TEMP_DIR/backup"
    mkdir -p "$backup_dir/config"
    echo "backup config" > "$backup_dir/config/default.yaml"
    
    # Test configuration restore
    mock_restore_configuration "$backup_dir"
    
    # Verify configuration was restored
    assert_directory_exists "$TEST_CONFIG_DIR"
    assert_file_exists "$TEST_CONFIG_DIR/config/default.yaml"
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "backup config"
    
    echo "✅ Unit Test 17 passed: restore_configuration basic functionality"
}

test_restore_configuration_overwrite() {
    echo "=== Unit Test 18: restore_configuration with force overwrite ==="
    
    setup_test_environment
    
    # Create existing configuration
    mock_create_config_directories
    echo "existing config" > "$TEST_CONFIG_DIR/config/default.yaml"
    
    # Create backup directory
    local backup_dir="$TEST_TEMP_DIR/backup"
    mkdir -p "$backup_dir/config"
    echo "backup config" > "$backup_dir/config/default.yaml"
    
    # Test configuration restore with force overwrite
    mock_restore_configuration "$backup_dir" "$TEST_CONFIG_DIR" "true"
    
    # Verify configuration was overwritten
    assert_file_exists "$TEST_CONFIG_DIR/config/default.yaml"
    assert_file_contains "$TEST_CONFIG_DIR/config/default.yaml" "backup config"
    assert_file_not_contains "$TEST_CONFIG_DIR/config/default.yaml" "existing config"
    
    echo "✅ Unit Test 18 passed: restore_configuration with force overwrite"
}

# Helper assertion functions
assert_directory_exists() {
    local dir="$1"
    if [[ ! -d "$dir" ]]; then
        echo "ASSERTION FAILED: Directory does not exist: $dir"
        return 1
    fi
}

assert_directory_not_exists() {
    local dir="$1"
    if [[ -d "$dir" ]]; then
        echo "ASSERTION FAILED: Directory should not exist: $dir"
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

assert_file_not_exists() {
    local file="$1"
    if [[ -f "$file" ]]; then
        echo "ASSERTION FAILED: File should not exist: $file"
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
run_unit_tests() {
    echo "Starting Configuration Manager Unit Tests..."
    echo "============================================="
    
    # Run all unit tests
    test_create_config_directories_basic
    test_create_config_directories_custom_path
    test_create_config_directories_no_subdirs
    test_setup_environment_variables_basic
    test_setup_environment_variables_custom_shell
    test_setup_environment_variables_overwrite_mode
    test_create_default_config_basic
    test_create_default_config_with_template
    test_setup_ssh_config_basic
    test_setup_ssh_config_with_template
    test_setup_ssh_config_existing_file
    test_validate_configuration_valid
    test_validate_configuration_invalid
    test_validate_configuration_partial
    test_backup_configuration_basic
    test_backup_configuration_with_logs
    test_restore_configuration_basic
    test_restore_configuration_overwrite
    
    echo "============================================="
    echo "All Configuration Manager Unit Tests Passed! ✅"
}

# Run tests if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    run_unit_tests
fi
