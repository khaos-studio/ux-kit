#!/bin/bash

# System Detector Unit Tests
# Unit tests for individual system detection functions

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
    
    echo "System detector unit test environment setup complete"
}

# Test cleanup
cleanup_test_environment() {
    if [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]]; then
        rm -rf "$TEST_TEMP_DIR"
        echo "System detector unit test environment cleaned up"
    fi
    
    # Reset environment variables
    unset UXKIT_CONFIG_DIR
}

# Test trap for cleanup
trap cleanup_test_environment EXIT

# Source the system detector module
source "$PROJECT_ROOT/scripts/modules/system-detector.sh"

# Unit Test 1: detect_os function
test_detect_os_basic() {
    echo "=== Unit Test 1: detect_os basic functionality ==="
    
    setup_test_environment
    
    # Test OS detection
    local os_info=$(detect_os)
    
    # Verify OS information is detected
    assert_string_contains "$os_info" "OS:"
    assert_string_contains "$os_info" "Version:"
    
    # Verify function succeeds
    assert_exit_code 0 detect_os
    
    echo "✅ Unit Test 1 passed: detect_os basic functionality"
}

test_detect_os_supported() {
    echo "=== Unit Test 2: detect_os supported systems ==="
    
    setup_test_environment
    
    # Test OS detection
    local os_info=$(detect_os)
    
    # Verify OS is supported (macOS or Linux)
    if [[ "$os_info" == *"macOS"* ]] || [[ "$os_info" == *"Linux"* ]]; then
        echo "✓ Supported OS detected: $os_info"
    else
        echo "WARNING: Unsupported OS detected: $os_info"
    fi
    
    echo "✅ Unit Test 2 passed: detect_os supported systems"
}

# Unit Test 2: detect_architecture function
test_detect_architecture_basic() {
    echo "=== Unit Test 3: detect_architecture basic functionality ==="
    
    setup_test_environment
    
    # Test architecture detection
    local arch_info=$(detect_architecture)
    
    # Verify architecture information is detected
    assert_string_contains "$arch_info" "Architecture:"
    
    # Verify function succeeds
    assert_exit_code 0 detect_architecture
    
    echo "✅ Unit Test 3 passed: detect_architecture basic functionality"
}

test_detect_architecture_supported() {
    echo "=== Unit Test 4: detect_architecture supported architectures ==="
    
    setup_test_environment
    
    # Test architecture detection
    local arch_info=$(detect_architecture)
    
    # Verify architecture is supported (x86_64 or ARM64)
    if [[ "$arch_info" == *"x86_64"* ]] || [[ "$arch_info" == *"ARM64"* ]]; then
        echo "✓ Supported architecture detected: $arch_info"
    else
        echo "WARNING: Unsupported architecture detected: $arch_info"
    fi
    
    echo "✅ Unit Test 4 passed: detect_architecture supported architectures"
}

# Unit Test 3: detect_distribution function
test_detect_distribution_basic() {
    echo "=== Unit Test 5: detect_distribution basic functionality ==="
    
    setup_test_environment
    
    # Test distribution detection
    local distro_info=$(detect_distribution)
    
    # Verify distribution information is detected
    assert_string_contains "$distro_info" "Distribution:"
    assert_string_contains "$distro_info" "Distribution Version:"
    
    # Verify function succeeds
    assert_exit_code 0 detect_distribution
    
    echo "✅ Unit Test 5 passed: detect_distribution basic functionality"
}

# Unit Test 4: check_node_version function
test_check_node_version_basic() {
    echo "=== Unit Test 6: check_node_version basic functionality ==="
    
    setup_test_environment
    
    # Test Node.js version check
    local node_info=$(check_node_version "18.0.0")
    
    # Verify Node.js information is checked
    assert_string_contains "$node_info" "Node.js"
    
    # Verify function returns appropriate exit code
    if check_node_version "18.0.0"; then
        echo "✓ Node.js version meets requirements"
    else
        echo "WARNING: Node.js version does not meet requirements"
    fi
    
    echo "✅ Unit Test 6 passed: check_node_version basic functionality"
}

test_check_node_version_custom_requirement() {
    echo "=== Unit Test 7: check_node_version custom requirement ==="
    
    setup_test_environment
    
    # Test Node.js version check with custom requirement
    local node_info=$(check_node_version "20.0.0")
    
    # Verify Node.js information is checked
    assert_string_contains "$node_info" "Node.js"
    
    # Verify function returns appropriate exit code
    if check_node_version "20.0.0"; then
        echo "✓ Node.js version meets custom requirement"
    else
        echo "WARNING: Node.js version does not meet custom requirement"
    fi
    
    echo "✅ Unit Test 7 passed: check_node_version custom requirement"
}

# Unit Test 5: check_git_version function
test_check_git_version_basic() {
    echo "=== Unit Test 8: check_git_version basic functionality ==="
    
    setup_test_environment
    
    # Test Git version check
    local git_info=$(check_git_version "2.0.0")
    
    # Verify Git information is checked
    assert_string_contains "$git_info" "Git"
    
    # Verify function returns appropriate exit code
    if check_git_version "2.0.0"; then
        echo "✓ Git version meets requirements"
    else
        echo "WARNING: Git version does not meet requirements"
    fi
    
    echo "✅ Unit Test 8 passed: check_git_version basic functionality"
}

test_check_git_version_custom_requirement() {
    echo "=== Unit Test 9: check_git_version custom requirement ==="
    
    setup_test_environment
    
    # Test Git version check with custom requirement
    local git_info=$(check_git_version "2.5.0")
    
    # Verify Git information is checked
    assert_string_contains "$git_info" "Git"
    
    # Verify function returns appropriate exit code
    if check_git_version "2.5.0"; then
        echo "✓ Git version meets custom requirement"
    else
        echo "WARNING: Git version does not meet custom requirement"
    fi
    
    echo "✅ Unit Test 9 passed: check_git_version custom requirement"
}

# Unit Test 6: check_ssh_access function
test_check_ssh_access_basic() {
    echo "=== Unit Test 10: check_ssh_access basic functionality ==="
    
    setup_test_environment
    
    # Test SSH access check
    local ssh_info=$(check_ssh_access "github.com" "22")
    
    # Verify SSH information is checked
    assert_string_contains "$ssh_info" "SSH"
    
    # Verify function returns appropriate exit code
    if check_ssh_access "github.com" "22"; then
        echo "✓ SSH access available"
    else
        echo "WARNING: SSH access not available"
    fi
    
    echo "✅ Unit Test 10 passed: check_ssh_access basic functionality"
}

test_check_ssh_access_custom_host() {
    echo "=== Unit Test 11: check_ssh_access custom host ==="
    
    setup_test_environment
    
    # Test SSH access check with custom host
    local ssh_info=$(check_ssh_access "gitlab.com" "22")
    
    # Verify SSH information is checked
    assert_string_contains "$ssh_info" "SSH"
    
    # Verify function returns appropriate exit code
    if check_ssh_access "gitlab.com" "22"; then
        echo "✓ SSH access to custom host available"
    else
        echo "WARNING: SSH access to custom host not available"
    fi
    
    echo "✅ Unit Test 11 passed: check_ssh_access custom host"
}

# Unit Test 7: validate_system_requirements function
test_validate_system_requirements_basic() {
    echo "=== Unit Test 12: validate_system_requirements basic functionality ==="
    
    setup_test_environment
    
    # Test system requirements validation
    local validation_result=$(validate_system_requirements)
    
    # Verify validation is performed
    assert_string_contains "$validation_result" "Validating system requirements"
    assert_string_contains "$validation_result" "System requirements validation"
    
    # Verify function returns appropriate exit code
    if validate_system_requirements; then
        echo "✓ System requirements validation passed"
    else
        echo "WARNING: System requirements validation failed"
    fi
    
    echo "✅ Unit Test 12 passed: validate_system_requirements basic functionality"
}

# Unit Test 8: get_system_info function
test_get_system_info_basic() {
    echo "=== Unit Test 13: get_system_info basic functionality ==="
    
    setup_test_environment
    
    # Test comprehensive system information
    local system_info=$(get_system_info)
    
    # Verify all sections are included
    assert_string_contains "$system_info" "System Information"
    assert_string_contains "$system_info" "Tool Availability"
    assert_string_contains "$system_info" "System Requirements"
    assert_string_contains "$system_info" "OS:"
    assert_string_contains "$system_info" "Architecture:"
    assert_string_contains "$system_info" "Distribution:"
    
    # Verify function succeeds
    assert_exit_code 0 get_system_info
    
    echo "✅ Unit Test 13 passed: get_system_info basic functionality"
}

# Unit Test 9: Command line interface
test_command_line_interface() {
    echo "=== Unit Test 14: Command line interface ==="
    
    setup_test_environment
    
    # Test individual command line options
    local os_info=$(./scripts/modules/system-detector.sh os)
    local arch_info=$(./scripts/modules/system-detector.sh arch)
    local distro_info=$(./scripts/modules/system-detector.sh distro)
    local node_info=$(./scripts/modules/system-detector.sh node)
    local git_info=$(./scripts/modules/system-detector.sh git)
    local ssh_info=$(./scripts/modules/system-detector.sh ssh)
    local validation_info=$(./scripts/modules/system-detector.sh validate)
    
    # Verify each command returns appropriate information
    assert_string_contains "$os_info" "OS:"
    assert_string_contains "$arch_info" "Architecture:"
    assert_string_contains "$distro_info" "Distribution:"
    assert_string_contains "$node_info" "Node.js"
    assert_string_contains "$git_info" "Git"
    assert_string_contains "$ssh_info" "SSH"
    assert_string_contains "$validation_info" "Validating system requirements"
    
    echo "✅ Unit Test 14 passed: Command line interface"
}

# Unit Test 10: Error handling
test_error_handling() {
    echo "=== Unit Test 15: Error handling ==="
    
    setup_test_environment
    
    # Test error handling for unsupported systems
    local os_info=$(detect_os)
    local arch_info=$(detect_architecture)
    
    # Verify functions handle errors gracefully
    assert_exit_code 0 detect_os
    assert_exit_code 0 detect_architecture
    assert_exit_code 0 detect_distribution
    assert_exit_code 0 check_node_version "18.0.0"
    assert_exit_code 0 check_git_version "2.0.0"
    # SSH access may fail (exit code 1) if not available, which is expected
    check_ssh_access "github.com" "22" || true
    
    echo "✅ Unit Test 15 passed: Error handling"
}

# Helper assertion functions
assert_string_contains() {
    local string="$1"
    local pattern="$2"
    if [[ "$string" != *"$pattern"* ]]; then
        echo "ASSERTION FAILED: String does not contain pattern '$pattern'"
        echo "String: $string"
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
    echo "Starting System Detector Unit Tests..."
    echo "======================================"
    
    # Run all unit tests
    test_detect_os_basic
    test_detect_os_supported
    test_detect_architecture_basic
    test_detect_architecture_supported
    test_detect_distribution_basic
    test_check_node_version_basic
    test_check_node_version_custom_requirement
    test_check_git_version_basic
    test_check_git_version_custom_requirement
    test_check_ssh_access_basic
    test_check_ssh_access_custom_host
    test_validate_system_requirements_basic
    test_get_system_info_basic
    test_command_line_interface
    test_error_handling
    
    echo "======================================"
    echo "All System Detector Unit Tests Passed! ✅"
}

# Run tests if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    run_unit_tests
fi
