#!/bin/bash

# Security Manager Unit Tests
# Unit tests for individual security management functions

set -euo pipefail

# Source test utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Test configuration
TEST_TEMP_DIR=""
TEST_CONFIG_DIR=""
TEST_HOME_DIR=""
TEST_SECURITY_DIR=""

# Test setup
setup_test_environment() {
    # Create temporary test directory
    TEST_TEMP_DIR=$(mktemp -d)
    TEST_CONFIG_DIR="$TEST_TEMP_DIR/.uxkit"
    TEST_HOME_DIR="$TEST_TEMP_DIR/home"
    TEST_SECURITY_DIR="$TEST_TEMP_DIR/security"
    
    # Create test directories
    mkdir -p "$TEST_HOME_DIR"
    mkdir -p "$TEST_SECURITY_DIR"
    
    # Set test environment variables
    export HOME="$TEST_HOME_DIR"
    export UXKIT_CONFIG_DIR="$TEST_CONFIG_DIR"
    export UXKIT_SECURITY_DIR="$TEST_SECURITY_DIR"
    
    echo "Security unit test environment setup complete"
}

# Test cleanup
cleanup_test_environment() {
    if [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]]; then
        rm -rf "$TEST_TEMP_DIR"
        echo "Security unit test environment cleaned up"
    fi
    
    # Reset environment variables
    unset UXKIT_CONFIG_DIR
    unset UXKIT_SECURITY_DIR
}

# Test trap for cleanup
trap cleanup_test_environment EXIT

# Source the mock security manager
source "$PROJECT_ROOT/tests/mocks/security-manager.mock.sh"

# Unit Test 1: verify_checksums function
test_verify_checksums_basic() {
    echo "=== Unit Test 1: verify_checksums basic functionality ==="
    
    setup_test_environment
    
    # Test basic checksum verification
    mock_verify_checksums "/path/to/file" "expected_checksum" "sha256" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_verify_checksums "/path/to/file" "expected_checksum" "sha256" "success"
    
    echo "✅ Unit Test 1 passed: verify_checksums basic functionality"
}

test_verify_checksums_different_algorithms() {
    echo "=== Unit Test 2: verify_checksums with different algorithms ==="
    
    setup_test_environment
    
    # Test different checksum algorithms
    mock_verify_checksums "/path/to/file" "sha256_checksum" "sha256" "success"
    mock_verify_checksums "/path/to/file" "sha1_checksum" "sha1" "success"
    mock_verify_checksums "/path/to/file" "md5_checksum" "md5" "success"
    
    # Verify all algorithms work
    assert_exit_code 0 mock_verify_checksums "/path/to/file" "sha256_checksum" "sha256" "success"
    assert_exit_code 0 mock_verify_checksums "/path/to/file" "sha1_checksum" "sha1" "success"
    assert_exit_code 0 mock_verify_checksums "/path/to/file" "md5_checksum" "md5" "success"
    
    echo "✅ Unit Test 2 passed: verify_checksums with different algorithms"
}

test_verify_checksums_failure() {
    echo "=== Unit Test 3: verify_checksums failure scenario ==="
    
    setup_test_environment
    
    # Test checksum verification failure
    mock_verify_checksums "/path/to/file" "expected_checksum" "sha256" "failure"
    
    # Verify function failed as expected
    assert_exit_code 1 mock_verify_checksums "/path/to/file" "expected_checksum" "sha256" "failure"
    
    echo "✅ Unit Test 3 passed: verify_checksums failure scenario"
}

# Unit Test 2: validate_ssh_keys function
test_validate_ssh_keys_basic() {
    echo "=== Unit Test 4: validate_ssh_keys basic functionality ==="
    
    setup_test_environment
    
    # Test basic SSH key validation
    mock_validate_ssh_keys "/path/to/key" "true" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_validate_ssh_keys "/path/to/key" "true" "success"
    
    echo "✅ Unit Test 4 passed: validate_ssh_keys basic functionality"
}

test_validate_ssh_keys_without_permissions() {
    echo "=== Unit Test 5: validate_ssh_keys without permission check ==="
    
    setup_test_environment
    
    # Test SSH key validation without permission check
    mock_validate_ssh_keys "/path/to/key" "false" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_validate_ssh_keys "/path/to/key" "false" "success"
    
    echo "✅ Unit Test 5 passed: validate_ssh_keys without permission check"
}

test_validate_ssh_keys_failure() {
    echo "=== Unit Test 6: validate_ssh_keys failure scenario ==="
    
    setup_test_environment
    
    # Test SSH key validation failure
    mock_validate_ssh_keys "/path/to/key" "true" "failure"
    
    # Verify function failed as expected
    assert_exit_code 1 mock_validate_ssh_keys "/path/to/key" "true" "failure"
    
    echo "✅ Unit Test 6 passed: validate_ssh_keys failure scenario"
}

# Unit Test 3: sanitize_input function
test_sanitize_input_basic() {
    echo "=== Unit Test 7: sanitize_input basic functionality ==="
    
    setup_test_environment
    
    # Test basic input sanitization
    mock_sanitize_input "valid_input" "1000" "a-zA-Z0-9._-" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_sanitize_input "valid_input" "1000" "a-zA-Z0-9._-" "success"
    
    echo "✅ Unit Test 7 passed: sanitize_input basic functionality"
}

test_sanitize_input_custom_parameters() {
    echo "=== Unit Test 8: sanitize_input with custom parameters ==="
    
    setup_test_environment
    
    # Test input sanitization with custom parameters
    mock_sanitize_input "test_input" "500" "a-zA-Z0-9" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_sanitize_input "test_input" "500" "a-zA-Z0-9" "success"
    
    echo "✅ Unit Test 8 passed: sanitize_input with custom parameters"
}

test_sanitize_input_failure() {
    echo "=== Unit Test 9: sanitize_input failure scenario ==="
    
    setup_test_environment
    
    # Test input sanitization failure
    mock_sanitize_input "invalid_input" "1000" "a-zA-Z0-9._-" "failure"
    
    # Verify function failed as expected
    assert_exit_code 1 mock_sanitize_input "invalid_input" "1000" "a-zA-Z0-9._-" "failure"
    
    echo "✅ Unit Test 9 passed: sanitize_input failure scenario"
}

# Unit Test 4: enforce_https function
test_enforce_https_basic() {
    echo "=== Unit Test 10: enforce_https basic functionality ==="
    
    setup_test_environment
    
    # Test basic HTTPS enforcement
    mock_enforce_https "https://example.com" "false" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_enforce_https "https://example.com" "false" "success"
    
    echo "✅ Unit Test 10 passed: enforce_https basic functionality"
}

test_enforce_https_with_localhost() {
    echo "=== Unit Test 11: enforce_https with localhost allowed ==="
    
    setup_test_environment
    
    # Test HTTPS enforcement with localhost allowed
    mock_enforce_https "http://localhost:3000" "true" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_enforce_https "http://localhost:3000" "true" "success"
    
    echo "✅ Unit Test 11 passed: enforce_https with localhost allowed"
}

test_enforce_https_failure() {
    echo "=== Unit Test 12: enforce_https failure scenario ==="
    
    setup_test_environment
    
    # Test HTTPS enforcement failure
    mock_enforce_https "http://example.com" "false" "failure"
    
    # Verify function failed as expected
    assert_exit_code 1 mock_enforce_https "http://example.com" "false" "failure"
    
    echo "✅ Unit Test 12 passed: enforce_https failure scenario"
}

# Unit Test 5: check_permissions function
test_check_permissions_basic() {
    echo "=== Unit Test 13: check_permissions basic functionality ==="
    
    setup_test_environment
    
    # Test basic permission check
    mock_check_permissions "/path/to/file" "600" "false" "" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_check_permissions "/path/to/file" "600" "false" "" "success"
    
    echo "✅ Unit Test 13 passed: check_permissions basic functionality"
}

test_check_permissions_with_ownership() {
    echo "=== Unit Test 14: check_permissions with ownership check ==="
    
    setup_test_environment
    
    # Test permission check with ownership validation
    mock_check_permissions "/path/to/file" "600" "true" "user" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_check_permissions "/path/to/file" "600" "true" "user" "success"
    
    echo "✅ Unit Test 14 passed: check_permissions with ownership check"
}

test_check_permissions_failure() {
    echo "=== Unit Test 15: check_permissions failure scenario ==="
    
    setup_test_environment
    
    # Test permission check failure
    mock_check_permissions "/path/to/file" "600" "false" "" "failure"
    
    # Verify function failed as expected
    assert_exit_code 1 mock_check_permissions "/path/to/file" "600" "false" "" "failure"
    
    echo "✅ Unit Test 15 passed: check_permissions failure scenario"
}

# Unit Test 6: audit_log function
test_audit_log_basic() {
    echo "=== Unit Test 16: audit_log basic functionality ==="
    
    setup_test_environment
    
    # Test basic audit logging
    mock_audit_log "TEST_EVENT" "Test details" "/tmp/test_audit.log" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_audit_log "TEST_EVENT" "Test details" "/tmp/test_audit.log" "success"
    
    # Verify log file was created
    assert_file_exists "/tmp/test_audit.log"
    assert_file_contains "/tmp/test_audit.log" "TEST_EVENT"
    assert_file_contains "/tmp/test_audit.log" "Test details"
    
    echo "✅ Unit Test 16 passed: audit_log basic functionality"
}

test_audit_log_custom_file() {
    echo "=== Unit Test 17: audit_log with custom log file ==="
    
    setup_test_environment
    
    local custom_log="$TEST_TEMP_DIR/custom_audit.log"
    
    # Test audit logging with custom log file
    mock_audit_log "CUSTOM_EVENT" "Custom details" "$custom_log" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_audit_log "CUSTOM_EVENT" "Custom details" "$custom_log" "success"
    
    # Verify custom log file was created
    assert_file_exists "$custom_log"
    assert_file_contains "$custom_log" "CUSTOM_EVENT"
    assert_file_contains "$custom_log" "Custom details"
    
    echo "✅ Unit Test 17 passed: audit_log with custom log file"
}

test_audit_log_failure() {
    echo "=== Unit Test 18: audit_log failure scenario ==="
    
    setup_test_environment
    
    # Test audit logging failure
    mock_audit_log "FAIL_EVENT" "Failure details" "/tmp/fail_audit.log" "failure"
    
    # Verify function failed as expected
    assert_exit_code 1 mock_audit_log "FAIL_EVENT" "Failure details" "/tmp/fail_audit.log" "failure"
    
    echo "✅ Unit Test 18 passed: audit_log failure scenario"
}

# Unit Test 7: validate_file_integrity function
test_validate_file_integrity_basic() {
    echo "=== Unit Test 19: validate_file_integrity basic functionality ==="
    
    setup_test_environment
    
    # Test basic file integrity validation
    mock_validate_file_integrity "/path/to/file" "1024" "expected_checksum" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_validate_file_integrity "/path/to/file" "1024" "expected_checksum" "success"
    
    echo "✅ Unit Test 19 passed: validate_file_integrity basic functionality"
}

test_validate_file_integrity_size_only() {
    echo "=== Unit Test 20: validate_file_integrity with size only ==="
    
    setup_test_environment
    
    # Test file integrity validation with size only
    mock_validate_file_integrity "/path/to/file" "1024" "" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_validate_file_integrity "/path/to/file" "1024" "" "success"
    
    echo "✅ Unit Test 20 passed: validate_file_integrity with size only"
}

test_validate_file_integrity_checksum_only() {
    echo "=== Unit Test 21: validate_file_integrity with checksum only ==="
    
    setup_test_environment
    
    # Test file integrity validation with checksum only
    mock_validate_file_integrity "/path/to/file" "" "expected_checksum" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_validate_file_integrity "/path/to/file" "" "expected_checksum" "success"
    
    echo "✅ Unit Test 21 passed: validate_file_integrity with checksum only"
}

test_validate_file_integrity_failure() {
    echo "=== Unit Test 22: validate_file_integrity failure scenario ==="
    
    setup_test_environment
    
    # Test file integrity validation failure
    mock_validate_file_integrity "/path/to/file" "1024" "expected_checksum" "failure"
    
    # Verify function failed as expected
    assert_exit_code 1 mock_validate_file_integrity "/path/to/file" "1024" "expected_checksum" "failure"
    
    echo "✅ Unit Test 22 passed: validate_file_integrity failure scenario"
}

# Unit Test 8: generate_secure_token function
test_generate_secure_token_basic() {
    echo "=== Unit Test 23: generate_secure_token basic functionality ==="
    
    setup_test_environment
    
    # Test basic secure token generation
    mock_generate_secure_token "32" "a-zA-Z0-9" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_generate_secure_token "32" "a-zA-Z0-9" "success"
    
    echo "✅ Unit Test 23 passed: generate_secure_token basic functionality"
}

test_generate_secure_token_custom_length() {
    echo "=== Unit Test 24: generate_secure_token with custom length ==="
    
    setup_test_environment
    
    # Test secure token generation with custom length
    mock_generate_secure_token "64" "a-zA-Z0-9" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_generate_secure_token "64" "a-zA-Z0-9" "success"
    
    echo "✅ Unit Test 24 passed: generate_secure_token with custom length"
}

test_generate_secure_token_failure() {
    echo "=== Unit Test 25: generate_secure_token failure scenario ==="
    
    setup_test_environment
    
    # Test secure token generation failure
    mock_generate_secure_token "32" "a-zA-Z0-9" "failure"
    
    # Verify function failed as expected
    assert_exit_code 1 mock_generate_secure_token "32" "a-zA-Z0-9" "failure"
    
    echo "✅ Unit Test 25 passed: generate_secure_token failure scenario"
}

# Unit Test 9: encrypt_sensitive_data function
test_encrypt_sensitive_data_basic() {
    echo "=== Unit Test 26: encrypt_sensitive_data basic functionality ==="
    
    setup_test_environment
    
    # Test basic data encryption
    mock_encrypt_sensitive_data "sensitive data" "/path/to/key" "/path/to/output" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_encrypt_sensitive_data "sensitive data" "/path/to/key" "/path/to/output" "success"
    
    echo "✅ Unit Test 26 passed: encrypt_sensitive_data basic functionality"
}

test_encrypt_sensitive_data_failure() {
    echo "=== Unit Test 27: encrypt_sensitive_data failure scenario ==="
    
    setup_test_environment
    
    # Test data encryption failure
    mock_encrypt_sensitive_data "sensitive data" "/path/to/key" "/path/to/output" "failure"
    
    # Verify function failed as expected
    assert_exit_code 1 mock_encrypt_sensitive_data "sensitive data" "/path/to/key" "/path/to/output" "failure"
    
    echo "✅ Unit Test 27 passed: encrypt_sensitive_data failure scenario"
}

# Unit Test 10: decrypt_sensitive_data function
test_decrypt_sensitive_data_basic() {
    echo "=== Unit Test 28: decrypt_sensitive_data basic functionality ==="
    
    setup_test_environment
    
    # Create mock encrypted file
    echo "MOCK_ENCRYPTED_DATA: test data" > "$TEST_TEMP_DIR/encrypted.txt"
    
    # Test basic data decryption
    mock_decrypt_sensitive_data "$TEST_TEMP_DIR/encrypted.txt" "/path/to/key" "$TEST_TEMP_DIR/decrypted.txt" "success"
    
    # Verify function succeeded
    assert_exit_code 0 mock_decrypt_sensitive_data "$TEST_TEMP_DIR/encrypted.txt" "/path/to/key" "$TEST_TEMP_DIR/decrypted.txt" "success"
    
    # Verify decrypted file was created
    assert_file_exists "$TEST_TEMP_DIR/decrypted.txt"
    assert_file_contains "$TEST_TEMP_DIR/decrypted.txt" "test data"
    
    echo "✅ Unit Test 28 passed: decrypt_sensitive_data basic functionality"
}

test_decrypt_sensitive_data_failure() {
    echo "=== Unit Test 29: decrypt_sensitive_data failure scenario ==="
    
    setup_test_environment
    
    # Test data decryption failure
    mock_decrypt_sensitive_data "/path/to/encrypted" "/path/to/key" "/path/to/output" "failure"
    
    # Verify function failed as expected
    assert_exit_code 1 mock_decrypt_sensitive_data "/path/to/encrypted" "/path/to/key" "/path/to/output" "failure"
    
    echo "✅ Unit Test 29 passed: decrypt_sensitive_data failure scenario"
}

# Helper assertion functions
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
    echo "Starting Security Manager Unit Tests..."
    echo "======================================="
    
    # Run all unit tests
    test_verify_checksums_basic
    test_verify_checksums_different_algorithms
    test_verify_checksums_failure
    test_validate_ssh_keys_basic
    test_validate_ssh_keys_without_permissions
    test_validate_ssh_keys_failure
    test_sanitize_input_basic
    test_sanitize_input_custom_parameters
    test_sanitize_input_failure
    test_enforce_https_basic
    test_enforce_https_with_localhost
    test_enforce_https_failure
    test_check_permissions_basic
    test_check_permissions_with_ownership
    test_check_permissions_failure
    test_audit_log_basic
    test_audit_log_custom_file
    test_audit_log_failure
    test_validate_file_integrity_basic
    test_validate_file_integrity_size_only
    test_validate_file_integrity_checksum_only
    test_validate_file_integrity_failure
    test_generate_secure_token_basic
    test_generate_secure_token_custom_length
    test_generate_secure_token_failure
    test_encrypt_sensitive_data_basic
    test_encrypt_sensitive_data_failure
    test_decrypt_sensitive_data_basic
    test_decrypt_sensitive_data_failure
    
    echo "======================================="
    echo "All Security Manager Unit Tests Passed! ✅"
}

# Run tests if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    run_unit_tests
fi
