#!/bin/bash

# Dependency Manager Unit Tests
# Unit tests for individual dependency manager functions

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
    
    # Create test directories
    mkdir -p "$TEST_HOME_DIR"
    
    # Set test environment variables
    export HOME="$TEST_HOME_DIR"
    export UXKIT_CONFIG_DIR="$TEST_CONFIG_DIR"
    
    echo "Dependency manager unit test environment setup complete"
}

# Test cleanup
cleanup_test_environment() {
    if [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]]; then
        rm -rf "$TEST_TEMP_DIR"
        echo "Dependency manager unit test environment cleaned up"
    fi
    
    # Reset environment variables
    unset UXKIT_CONFIG_DIR
}

# Test trap for cleanup
trap cleanup_test_environment EXIT

# Source the dependency manager module
source "$PROJECT_ROOT/scripts/modules/dependency-manager.sh"

# Unit Test 1: install_homebrew function
test_install_homebrew_basic() {
    echo "=== Unit Test 1: install_homebrew basic functionality ==="
    
    setup_test_environment
    
    # Test Homebrew installation
    install_homebrew
    
    # Verify function succeeds
    assert_exit_code 0 install_homebrew
    
    echo "✅ Unit Test 1 passed: install_homebrew basic functionality"
}

test_install_homebrew_force() {
    echo "=== Unit Test 2: install_homebrew force installation ==="
    
    setup_test_environment
    
    # Test force Homebrew installation
    install_homebrew "true"
    
    # Verify function succeeds
    assert_exit_code 0 install_homebrew "true"
    
    echo "✅ Unit Test 2 passed: install_homebrew force installation"
}

# Unit Test 2: install_nodejs function
test_install_nodejs_basic() {
    echo "=== Unit Test 3: install_nodejs basic functionality ==="
    
    setup_test_environment
    
    # Test Node.js installation
    install_nodejs "18.0.0" "homebrew"
    
    # Verify function succeeds
    assert_exit_code 0 install_nodejs "18.0.0" "homebrew"
    
    echo "✅ Unit Test 3 passed: install_nodejs basic functionality"
}

test_install_nodejs_auto_pm() {
    echo "=== Unit Test 4: install_nodejs auto package manager ==="
    
    setup_test_environment
    
    # Test Node.js installation with auto package manager
    install_nodejs "18.0.0" "auto"
    
    # Verify function succeeds
    assert_exit_code 0 install_nodejs "18.0.0" "auto"
    
    echo "✅ Unit Test 4 passed: install_nodejs auto package manager"
}

test_install_nodejs_different_pm() {
    echo "=== Unit Test 5: install_nodejs different package managers ==="
    
    setup_test_environment
    
    # Test Node.js installation with different package managers
    install_nodejs "18.0.0" "apt"
    install_nodejs "18.0.0" "yum"
    
    # Verify functions handle different package managers
    assert_exit_code 0 install_nodejs "18.0.0" "apt"
    assert_exit_code 0 install_nodejs "18.0.0" "yum"
    
    echo "✅ Unit Test 5 passed: install_nodejs different package managers"
}

# Unit Test 3: install_git function
test_install_git_basic() {
    echo "=== Unit Test 6: install_git basic functionality ==="
    
    setup_test_environment
    
    # Test Git installation
    install_git "2.0.0" "homebrew"
    
    # Verify function succeeds
    assert_exit_code 0 install_git "2.0.0" "homebrew"
    
    echo "✅ Unit Test 6 passed: install_git basic functionality"
}

test_install_git_auto_pm() {
    echo "=== Unit Test 7: install_git auto package manager ==="
    
    setup_test_environment
    
    # Test Git installation with auto package manager
    install_git "2.0.0" "auto"
    
    # Verify function succeeds
    assert_exit_code 0 install_git "2.0.0" "auto"
    
    echo "✅ Unit Test 7 passed: install_git auto package manager"
}

test_install_git_different_pm() {
    echo "=== Unit Test 8: install_git different package managers ==="
    
    setup_test_environment
    
    # Test Git installation with different package managers
    install_git "2.0.0" "apt"
    install_git "2.0.0" "yum"
    
    # Verify functions handle different package managers
    assert_exit_code 0 install_git "2.0.0" "apt"
    assert_exit_code 0 install_git "2.0.0" "yum"
    
    echo "✅ Unit Test 8 passed: install_git different package managers"
}

# Unit Test 4: check_dependencies function
test_check_dependencies_basic() {
    echo "=== Unit Test 9: check_dependencies basic functionality ==="
    
    setup_test_environment
    
    # Test dependency checking
    check_dependencies "node" "git" "homebrew"
    
    # Verify function returns appropriate exit code
    if check_dependencies "node" "git" "homebrew"; then
        echo "✓ All dependencies are installed"
    else
        echo "WARNING: Some dependencies are missing"
    fi
    
    echo "✅ Unit Test 9 passed: check_dependencies basic functionality"
}

test_check_dependencies_individual() {
    echo "=== Unit Test 10: check_dependencies individual dependencies ==="
    
    setup_test_environment
    
    # Test individual dependency checking
    check_dependencies "node"
    check_dependencies "git"
    check_dependencies "homebrew"
    
    # Verify functions handle individual dependencies
    assert_exit_code 0 check_dependencies "node"
    assert_exit_code 0 check_dependencies "git"
    assert_exit_code 0 check_dependencies "homebrew"
    
    echo "✅ Unit Test 10 passed: check_dependencies individual dependencies"
}

# Unit Test 5: install_missing_dependencies function
test_install_missing_dependencies_basic() {
    echo "=== Unit Test 11: install_missing_dependencies basic functionality ==="
    
    setup_test_environment
    
    # Test missing dependency installation
    install_missing_dependencies "auto" "node" "git" "homebrew"
    
    # Verify function succeeds
    assert_exit_code 0 install_missing_dependencies "auto" "node" "git" "homebrew"
    
    echo "✅ Unit Test 11 passed: install_missing_dependencies basic functionality"
}

test_install_missing_dependencies_auto_pm() {
    echo "=== Unit Test 12: install_missing_dependencies auto package manager ==="
    
    setup_test_environment
    
    # Test missing dependency installation with auto package manager
    install_missing_dependencies "auto" "node" "git" "homebrew"
    
    # Verify function succeeds
    assert_exit_code 0 install_missing_dependencies "auto" "node" "git" "homebrew"
    
    echo "✅ Unit Test 12 passed: install_missing_dependencies auto package manager"
}

# Unit Test 6: handle_package_manager_errors function
test_handle_package_manager_errors_basic() {
    echo "=== Unit Test 13: handle_package_manager_errors basic functionality ==="
    
    setup_test_environment
    
    # Test error handling for different error codes
    handle_package_manager_errors "1" "apt" "install"
    handle_package_manager_errors "2" "yum" "update"
    handle_package_manager_errors "3" "homebrew" "install"
    handle_package_manager_errors "4" "apt" "install"
    handle_package_manager_errors "5" "yum" "install"
    
    # Verify functions handle errors appropriately
    assert_exit_code 1 handle_package_manager_errors "1" "apt" "install"
    assert_exit_code 1 handle_package_manager_errors "2" "yum" "update"
    assert_exit_code 1 handle_package_manager_errors "3" "homebrew" "install"
    assert_exit_code 1 handle_package_manager_errors "4" "apt" "install"
    assert_exit_code 1 handle_package_manager_errors "5" "yum" "install"
    
    echo "✅ Unit Test 13 passed: handle_package_manager_errors basic functionality"
}

test_handle_package_manager_errors_unknown() {
    echo "=== Unit Test 14: handle_package_manager_errors unknown error code ==="
    
    setup_test_environment
    
    # Test error handling for unknown error code
    handle_package_manager_errors "999" "apt" "install"
    
    # Verify function handles unknown error code
    assert_exit_code 1 handle_package_manager_errors "999" "apt" "install"
    
    echo "✅ Unit Test 14 passed: handle_package_manager_errors unknown error code"
}

# Unit Test 7: detect_package_manager function
test_detect_package_manager_basic() {
    echo "=== Unit Test 15: detect_package_manager basic functionality ==="
    
    setup_test_environment
    
    # Test package manager detection
    detect_package_manager
    
    # Verify function succeeds
    assert_exit_code 0 detect_package_manager
    
    echo "✅ Unit Test 15 passed: detect_package_manager basic functionality"
}

test_detect_package_manager_different_os() {
    echo "=== Unit Test 16: detect_package_manager different operating systems ==="
    
    setup_test_environment
    
    # Test package manager detection for different OS types
    detect_package_manager "darwin"
    detect_package_manager "linux-gnu"
    
    # Verify functions handle different OS types
    assert_exit_code 0 detect_package_manager "darwin"
    assert_exit_code 0 detect_package_manager "linux-gnu"
    
    echo "✅ Unit Test 16 passed: detect_package_manager different operating systems"
}

# Unit Test 8: get_dependency_manager_info function
test_get_dependency_manager_info_basic() {
    echo "=== Unit Test 17: get_dependency_manager_info basic functionality ==="
    
    setup_test_environment
    
    # Test comprehensive dependency manager information
    get_dependency_manager_info
    
    # Verify function succeeds
    assert_exit_code 0 get_dependency_manager_info
    
    echo "✅ Unit Test 17 passed: get_dependency_manager_info basic functionality"
}

# Unit Test 9: Command line interface
test_command_line_interface() {
    echo "=== Unit Test 18: Command line interface ==="
    
    setup_test_environment
    
    # Test individual command line options
    ./scripts/modules/dependency-manager.sh install-homebrew
    ./scripts/modules/dependency-manager.sh install-nodejs "18.0.0" "homebrew"
    ./scripts/modules/dependency-manager.sh install-git "2.0.0" "homebrew"
    ./scripts/modules/dependency-manager.sh check "node" "git" "homebrew"
    ./scripts/modules/dependency-manager.sh install-missing "auto" "node" "git" "homebrew"
    ./scripts/modules/dependency-manager.sh detect-pm
    ./scripts/modules/dependency-manager.sh info
    
    # Verify each command returns appropriate exit code
    assert_exit_code 0 ./scripts/modules/dependency-manager.sh install-homebrew
    assert_exit_code 0 ./scripts/modules/dependency-manager.sh install-nodejs "18.0.0" "homebrew"
    assert_exit_code 0 ./scripts/modules/dependency-manager.sh install-git "2.0.0" "homebrew"
    assert_exit_code 0 ./scripts/modules/dependency-manager.sh check "node" "git" "homebrew"
    assert_exit_code 0 ./scripts/modules/dependency-manager.sh install-missing "auto" "node" "git" "homebrew"
    assert_exit_code 0 ./scripts/modules/dependency-manager.sh detect-pm
    assert_exit_code 0 ./scripts/modules/dependency-manager.sh info
    
    echo "✅ Unit Test 18 passed: Command line interface"
}

# Unit Test 10: Error handling
test_error_handling() {
    echo "=== Unit Test 19: Error handling ==="
    
    setup_test_environment
    
    # Test error handling for various scenarios
    install_nodejs "18.0.0" "unknown_pm"
    install_git "2.0.0" "unknown_pm"
    
    # Verify functions handle errors gracefully
    assert_exit_code 1 install_nodejs "18.0.0" "unknown_pm"
    assert_exit_code 1 install_git "2.0.0" "unknown_pm"
    
    echo "✅ Unit Test 19 passed: Error handling"
}

# Helper assertion functions
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
    echo "Starting Dependency Manager Unit Tests..."
    echo "========================================="
    
    # Run all unit tests
    test_install_homebrew_basic
    test_install_homebrew_force
    test_install_nodejs_basic
    test_install_nodejs_auto_pm
    test_install_nodejs_different_pm
    test_install_git_basic
    test_install_git_auto_pm
    test_install_git_different_pm
    test_check_dependencies_basic
    test_check_dependencies_individual
    test_install_missing_dependencies_basic
    test_install_missing_dependencies_auto_pm
    test_handle_package_manager_errors_basic
    test_handle_package_manager_errors_unknown
    test_detect_package_manager_basic
    test_detect_package_manager_different_os
    test_get_dependency_manager_info_basic
    test_command_line_interface
    test_error_handling
    
    echo "========================================="
    echo "All Dependency Manager Unit Tests Passed! ✅"
}

# Run tests if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    run_unit_tests
fi
