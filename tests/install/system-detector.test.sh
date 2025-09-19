#!/bin/bash

# System Detection Tests
# Tests for system detection functionality

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
    
    echo "System detection test environment setup complete"
    echo "Test temp dir: $TEST_TEMP_DIR"
    echo "Test config dir: $TEST_CONFIG_DIR"
    echo "Test home dir: $TEST_HOME_DIR"
}

# Test cleanup
cleanup_test_environment() {
    if [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]]; then
        rm -rf "$TEST_TEMP_DIR"
        echo "System detection test environment cleaned up"
    fi
    
    # Reset environment variables
    unset UXKIT_CONFIG_DIR
}

# Test trap for cleanup
trap cleanup_test_environment EXIT

# Source the system detector module (when it exists)
# For now, we'll create mock functions to test the interface
source_system_detector() {
    # Mock system detector functions for testing
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
}

# Use Case Test 1: Complete System Detection
test_complete_system_detection() {
    echo "=== Use Case Test 1: Complete System Detection ==="
    
    # Given: A system that needs to be detected and validated
    setup_test_environment
    
    # When: Performing complete system detection
    source_system_detector
    get_system_info
    
    # Then: System information should be detected and displayed
    local system_info=$(get_system_info)
    assert_string_contains "$system_info" "System Information"
    assert_string_contains "$system_info" "OS:"
    assert_string_contains "$system_info" "Architecture:"
    assert_string_contains "$system_info" "Distribution:"
    assert_string_contains "$system_info" "Tool Availability"
    assert_string_contains "$system_info" "System Requirements"
    
    echo "✅ Use Case Test 1 passed: Complete system detection"
}

# Use Case Test 2: OS Detection
test_os_detection() {
    echo "=== Use Case Test 2: OS Detection ==="
    
    # Given: A system with a known operating system
    setup_test_environment
    source_system_detector
    
    # When: Detecting the operating system
    local os_info=$(detect_os)
    
    # Then: OS information should be detected
    assert_string_contains "$os_info" "OS:"
    assert_string_contains "$os_info" "Version:"
    
    # And: OS should be supported (macOS or Linux)
    if [[ "$os_info" == *"macOS"* ]] || [[ "$os_info" == *"Linux"* ]]; then
        echo "✓ Supported OS detected"
    else
        echo "WARNING: Unsupported OS detected: $os_info"
    fi
    
    echo "✅ Use Case Test 2 passed: OS detection"
}

# Use Case Test 3: Architecture Detection
test_architecture_detection() {
    echo "=== Use Case Test 3: Architecture Detection ==="
    
    # Given: A system with a known architecture
    setup_test_environment
    source_system_detector
    
    # When: Detecting the system architecture
    local arch_info=$(detect_architecture)
    
    # Then: Architecture information should be detected
    assert_string_contains "$arch_info" "Architecture:"
    
    # And: Architecture should be supported (x86_64 or ARM64)
    if [[ "$arch_info" == *"x86_64"* ]] || [[ "$arch_info" == *"ARM64"* ]]; then
        echo "✓ Supported architecture detected"
    else
        echo "WARNING: Unsupported architecture detected: $arch_info"
    fi
    
    echo "✅ Use Case Test 3 passed: Architecture detection"
}

# Use Case Test 4: Distribution Detection
test_distribution_detection() {
    echo "=== Use Case Test 4: Distribution Detection ==="
    
    # Given: A system that may have a Linux distribution
    setup_test_environment
    source_system_detector
    
    # When: Detecting the Linux distribution
    local distro_info=$(detect_distribution)
    
    # Then: Distribution information should be detected
    assert_string_contains "$distro_info" "Distribution:"
    assert_string_contains "$distro_info" "Distribution Version:"
    
    echo "✅ Use Case Test 4 passed: Distribution detection"
}

# Use Case Test 5: Node.js Version Check
test_node_version_check() {
    echo "=== Use Case Test 5: Node.js Version Check ==="
    
    # Given: A system that may have Node.js installed
    setup_test_environment
    source_system_detector
    
    # When: Checking Node.js version
    local node_info=$(check_node_version "18.0.0")
    
    # Then: Node.js information should be checked
    assert_string_contains "$node_info" "Node.js"
    
    # And: Function should return appropriate exit code
    if check_node_version "18.0.0"; then
        echo "✓ Node.js version meets requirements"
    else
        echo "WARNING: Node.js version does not meet requirements"
    fi
    
    echo "✅ Use Case Test 5 passed: Node.js version check"
}

# Use Case Test 6: Git Version Check
test_git_version_check() {
    echo "=== Use Case Test 6: Git Version Check ==="
    
    # Given: A system that may have Git installed
    setup_test_environment
    source_system_detector
    
    # When: Checking Git version
    local git_info=$(check_git_version "2.0.0")
    
    # Then: Git information should be checked
    assert_string_contains "$git_info" "Git"
    
    # And: Function should return appropriate exit code
    if check_git_version "2.0.0"; then
        echo "✓ Git version meets requirements"
    else
        echo "WARNING: Git version does not meet requirements"
    fi
    
    echo "✅ Use Case Test 6 passed: Git version check"
}

# Use Case Test 7: SSH Access Check
test_ssh_access_check() {
    echo "=== Use Case Test 7: SSH Access Check ==="
    
    # Given: A system that may have SSH access
    setup_test_environment
    source_system_detector
    
    # When: Checking SSH access
    local ssh_info=$(check_ssh_access "github.com" "22")
    
    # Then: SSH information should be checked
    assert_string_contains "$ssh_info" "SSH"
    
    # And: Function should return appropriate exit code
    if check_ssh_access "github.com" "22"; then
        echo "✓ SSH access available"
    else
        echo "WARNING: SSH access not available"
    fi
    
    echo "✅ Use Case Test 7 passed: SSH access check"
}

# Use Case Test 8: System Requirements Validation
test_system_requirements_validation() {
    echo "=== Use Case Test 8: System Requirements Validation ==="
    
    # Given: A system that needs requirements validation
    setup_test_environment
    source_system_detector
    
    # When: Validating system requirements
    local validation_result=$(validate_system_requirements)
    
    # Then: Validation should be performed
    assert_string_contains "$validation_result" "Validating system requirements"
    assert_string_contains "$validation_result" "System requirements validation"
    
    # And: Function should return appropriate exit code
    if validate_system_requirements; then
        echo "✓ System requirements validation passed"
    else
        echo "WARNING: System requirements validation failed"
    fi
    
    echo "✅ Use Case Test 8 passed: System requirements validation"
}

# Use Case Test 9: Error Handling for Unsupported Systems
test_error_handling_unsupported_systems() {
    echo "=== Use Case Test 9: Error Handling for Unsupported Systems ==="
    
    # Given: A system with unsupported configuration
    setup_test_environment
    source_system_detector
    
    # When: Detecting system information
    local os_info=$(detect_os)
    local arch_info=$(detect_architecture)
    
    # Then: Unsupported systems should be identified
    if [[ "$os_info" == *"Unknown"* ]]; then
        echo "WARNING: Unsupported OS detected: $os_info"
    fi
    
    if [[ "$arch_info" == *"Unknown"* ]]; then
        echo "WARNING: Unsupported architecture detected: $arch_info"
    fi
    
    # And: Validation should handle errors gracefully
    if ! validate_system_requirements; then
        echo "✓ Error handling for unsupported systems works correctly"
    fi
    
    echo "✅ Use Case Test 9 passed: Error handling for unsupported systems"
}

# Use Case Test 10: Cross-Platform Compatibility
test_cross_platform_compatibility() {
    echo "=== Use Case Test 10: Cross-Platform Compatibility ==="
    
    # Given: Different platform configurations
    setup_test_environment
    source_system_detector
    
    # When: Testing cross-platform compatibility
    local os_info=$(detect_os)
    local arch_info=$(detect_architecture)
    local distro_info=$(detect_distribution)
    
    # Then: All platforms should be handled
    assert_string_contains "$os_info" "OS:"
    assert_string_contains "$arch_info" "Architecture:"
    assert_string_contains "$distro_info" "Distribution:"
    
    # And: Functions should not fail on any platform
    assert_exit_code 0 detect_os
    assert_exit_code 0 detect_architecture
    assert_exit_code 0 detect_distribution
    assert_exit_code 0 check_node_version "18.0.0"
    assert_exit_code 0 check_git_version "2.0.0"
    assert_exit_code 0 check_ssh_access "github.com" "22"
    
    echo "✅ Use Case Test 10 passed: Cross-platform compatibility"
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
run_tests() {
    echo "Starting System Detection Tests..."
    echo "=================================="
    
    # Source the system detector functions
    source_system_detector
    
    # Run all use case tests
    test_complete_system_detection
    test_os_detection
    test_architecture_detection
    test_distribution_detection
    test_node_version_check
    test_git_version_check
    test_ssh_access_check
    test_system_requirements_validation
    test_error_handling_unsupported_systems
    test_cross_platform_compatibility
    
    echo "=================================="
    echo "All System Detection Tests Passed! ✅"
}

# Run tests if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    run_tests
fi
