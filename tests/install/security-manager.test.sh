#!/bin/bash

# Security Manager Tests
# Tests for security features and validation functionality

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
    
    echo "Security test environment setup complete"
    echo "Test temp dir: $TEST_TEMP_DIR"
    echo "Test config dir: $TEST_CONFIG_DIR"
    echo "Test home dir: $TEST_HOME_DIR"
    echo "Test security dir: $TEST_SECURITY_DIR"
}

# Test cleanup
cleanup_test_environment() {
    if [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]]; then
        rm -rf "$TEST_TEMP_DIR"
        echo "Security test environment cleaned up"
    fi
    
    # Reset environment variables
    unset UXKIT_CONFIG_DIR
    unset UXKIT_SECURITY_DIR
}

# Test trap for cleanup
trap cleanup_test_environment EXIT

# Source the security manager module (when it exists)
# For now, we'll create mock functions to test the interface
source_security_manager() {
    # Mock security manager functions for testing
    verify_checksums() {
        local file_path="$1"
        local expected_checksum="$2"
        local algorithm="${3:-sha256}"
        
        if [[ ! -f "$file_path" ]]; then
            echo "ERROR: File does not exist: $file_path"
            return 1
        fi
        
        # Calculate actual checksum
        local actual_checksum
        case "$algorithm" in
            "sha256")
                actual_checksum=$(sha256sum "$file_path" | cut -d' ' -f1)
                ;;
            "sha1")
                actual_checksum=$(sha1sum "$file_path" | cut -d' ' -f1)
                ;;
            "md5")
                actual_checksum=$(md5sum "$file_path" | cut -d' ' -f1)
                ;;
            *)
                echo "ERROR: Unsupported checksum algorithm: $algorithm"
                return 1
                ;;
        esac
        
        if [[ "$actual_checksum" == "$expected_checksum" ]]; then
            echo "Checksum verification passed: $algorithm"
            return 0
        else
            echo "ERROR: Checksum verification failed"
            echo "Expected: $expected_checksum"
            echo "Actual: $actual_checksum"
            return 1
        fi
    }
    
    validate_ssh_keys() {
        local ssh_dir="$HOME/.ssh"
        local key_file="$1"
        local validate_permissions="${2:-true}"
        
        if [[ ! -d "$ssh_dir" ]]; then
            echo "ERROR: SSH directory does not exist: $ssh_dir"
            return 1
        fi
        
        if [[ ! -f "$key_file" ]]; then
            echo "ERROR: SSH key file does not exist: $key_file"
            return 1
        fi
        
        # Check file permissions
        if [[ "$validate_permissions" == "true" ]]; then
            local permissions=$(stat -c "%a" "$key_file" 2>/dev/null || stat -f "%OLp" "$key_file" 2>/dev/null)
            if [[ "$permissions" != "600" ]]; then
                echo "ERROR: SSH key has incorrect permissions: $permissions (expected: 600)"
                return 1
            fi
        fi
        
        # Check if key is valid (basic check)
        if ! ssh-keygen -l -f "$key_file" >/dev/null 2>&1; then
            echo "ERROR: SSH key is invalid or corrupted: $key_file"
            return 1
        fi
        
        echo "SSH key validation passed: $key_file"
        return 0
    }
    
    sanitize_input() {
        local input="$1"
        local max_length="${2:-1000}"
        local allowed_chars="${3:-a-zA-Z0-9._-}"
        
        # Check length
        if [[ ${#input} -gt $max_length ]]; then
            echo "ERROR: Input exceeds maximum length: ${#input} > $max_length"
            return 1
        fi
        
        # Check for dangerous characters
        if [[ "$input" =~ [^$allowed_chars] ]]; then
            echo "ERROR: Input contains invalid characters"
            return 1
        fi
        
        # Check for common injection patterns
        local dangerous_patterns=("; " "|" "&" "\`" "\$" "(" ")" "<" ">" "\"" "'" "\\")
        for pattern in "${dangerous_patterns[@]}"; do
            if [[ "$input" == *"$pattern"* ]]; then
                echo "ERROR: Input contains potentially dangerous pattern: $pattern"
                return 1
            fi
        done
        
        echo "Input sanitization passed"
        return 0
    }
    
    enforce_https() {
        local url="$1"
        local allow_localhost="${2:-false}"
        
        # Check if URL starts with https://
        if [[ "$url" =~ ^https:// ]]; then
            echo "HTTPS enforcement passed: $url"
            return 0
        fi
        
        # Allow localhost for testing if specified
        if [[ "$allow_localhost" == "true" && "$url" =~ ^http://localhost ]]; then
            echo "HTTPS enforcement passed (localhost allowed): $url"
            return 0
        fi
        
        echo "ERROR: HTTPS enforcement failed - URL must use HTTPS: $url"
        return 1
    }
    
    check_permissions() {
        local file_path="$1"
        local expected_permissions="$2"
        local check_ownership="${3:-false}"
        local expected_owner="${4:-}"
        
        if [[ ! -e "$file_path" ]]; then
            echo "ERROR: File or directory does not exist: $file_path"
            return 1
        fi
        
        # Check file permissions
        local actual_permissions=$(stat -c "%a" "$file_path" 2>/dev/null || stat -f "%OLp" "$file_path" 2>/dev/null)
        if [[ "$actual_permissions" != "$expected_permissions" ]]; then
            echo "ERROR: Incorrect permissions: $actual_permissions (expected: $expected_permissions)"
            return 1
        fi
        
        # Check ownership if requested
        if [[ "$check_ownership" == "true" && -n "$expected_owner" ]]; then
            local actual_owner=$(stat -c "%U" "$file_path" 2>/dev/null || stat -f "%Su" "$file_path" 2>/dev/null)
            if [[ "$actual_owner" != "$expected_owner" ]]; then
                echo "ERROR: Incorrect ownership: $actual_owner (expected: $expected_owner)"
                return 1
            fi
        fi
        
        echo "Permission check passed: $file_path"
        return 0
    }
    
    audit_log() {
        local event="$1"
        local details="$2"
        local log_file="${3:-$UXKIT_SECURITY_DIR/audit.log}"
        local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        
        # Create log directory if it doesn't exist
        mkdir -p "$(dirname "$log_file")"
        
        # Log the event
        echo "[$timestamp] $event: $details" >> "$log_file"
        echo "Audit log entry created: $event"
    }
    
    validate_file_integrity() {
        local file_path="$1"
        local expected_size="${2:-}"
        local expected_checksum="${3:-}"
        
        if [[ ! -f "$file_path" ]]; then
            echo "ERROR: File does not exist: $file_path"
            return 1
        fi
        
        # Check file size if provided
        if [[ -n "$expected_size" ]]; then
            local actual_size=$(stat -c "%s" "$file_path" 2>/dev/null || stat -f "%z" "$file_path" 2>/dev/null)
            if [[ "$actual_size" != "$expected_size" ]]; then
                echo "ERROR: File size mismatch: $actual_size (expected: $expected_size)"
                return 1
            fi
        fi
        
        # Check checksum if provided
        if [[ -n "$expected_checksum" ]]; then
            verify_checksums "$file_path" "$expected_checksum"
        fi
        
        echo "File integrity validation passed: $file_path"
        return 0
    }
    
    generate_secure_token() {
        local length="${1:-32}"
        local charset="${2:-a-zA-Z0-9}"
        
        # Generate secure random token
        local token=$(openssl rand -base64 $((length * 3 / 4)) | tr -d "=+/" | cut -c1-$length)
        
        echo "Secure token generated: ${token:0:$length}"
        return 0
    }
    
    encrypt_sensitive_data() {
        local data="$1"
        local key_file="$2"
        local output_file="$3"
        
        if [[ ! -f "$key_file" ]]; then
            echo "ERROR: Encryption key file does not exist: $key_file"
            return 1
        fi
        
        # Simple encryption using openssl (for testing purposes)
        echo "$data" | openssl enc -aes-256-cbc -salt -in - -out "$output_file" -pass file:"$key_file" 2>/dev/null
        
        if [[ $? -eq 0 ]]; then
            echo "Data encrypted successfully: $output_file"
            return 0
        else
            echo "ERROR: Encryption failed"
            return 1
        fi
    }
    
    decrypt_sensitive_data() {
        local encrypted_file="$1"
        local key_file="$2"
        local output_file="$3"
        
        if [[ ! -f "$encrypted_file" ]]; then
            echo "ERROR: Encrypted file does not exist: $encrypted_file"
            return 1
        fi
        
        if [[ ! -f "$key_file" ]]; then
            echo "ERROR: Decryption key file does not exist: $key_file"
            return 1
        fi
        
        # Simple decryption using openssl (for testing purposes)
        openssl enc -aes-256-cbc -d -in "$encrypted_file" -out "$output_file" -pass file:"$key_file" 2>/dev/null
        
        if [[ $? -eq 0 ]]; then
            echo "Data decrypted successfully: $output_file"
            return 0
        else
            echo "ERROR: Decryption failed"
            return 1
        fi
    }
}

# Use Case Test 1: Complete Security Validation
test_complete_security_validation() {
    echo "=== Use Case Test 1: Complete Security Validation ==="
    
    # Given: A system with files and SSH keys that need security validation
    setup_test_environment
    
    # Create test files
    echo "test content" > "$TEST_TEMP_DIR/test.txt"
    echo "another test file" > "$TEST_TEMP_DIR/test2.txt"
    
    # Create SSH directory and key
    mkdir -p "$TEST_HOME_DIR/.ssh"
    ssh-keygen -t rsa -b 2048 -f "$TEST_HOME_DIR/.ssh/test_key" -N "" -q
    chmod 600 "$TEST_HOME_DIR/.ssh/test_key"
    
    # When: Performing complete security validation
    source_security_manager
    
    # Test checksum verification
    local checksum=$(sha256sum "$TEST_TEMP_DIR/test.txt" | cut -d' ' -f1)
    verify_checksums "$TEST_TEMP_DIR/test.txt" "$checksum"
    
    # Test SSH key validation
    validate_ssh_keys "$TEST_HOME_DIR/.ssh/test_key"
    
    # Test input sanitization
    sanitize_input "valid_input_123"
    
    # Test HTTPS enforcement
    enforce_https "https://example.com"
    
    # Test permission checks
    check_permissions "$TEST_HOME_DIR/.ssh/test_key" "600"
    
    # Then: All security validations should pass
    assert_exit_code 0 verify_checksums "$TEST_TEMP_DIR/test.txt" "$checksum"
    assert_exit_code 0 validate_ssh_keys "$TEST_HOME_DIR/.ssh/test_key"
    assert_exit_code 0 sanitize_input "valid_input_123"
    assert_exit_code 0 enforce_https "https://example.com"
    assert_exit_code 0 check_permissions "$TEST_HOME_DIR/.ssh/test_key" "600"
    
    echo "✅ Use Case Test 1 passed: Complete security validation"
}

# Use Case Test 2: Checksum Verification
test_checksum_verification() {
    echo "=== Use Case Test 2: Checksum Verification ==="
    
    # Given: A file with known checksum
    setup_test_environment
    source_security_manager
    
    echo "test content for checksum" > "$TEST_TEMP_DIR/checksum_test.txt"
    local expected_sha256=$(sha256sum "$TEST_TEMP_DIR/checksum_test.txt" | cut -d' ' -f1)
    local expected_sha1=$(sha1sum "$TEST_TEMP_DIR/checksum_test.txt" | cut -d' ' -f1)
    local expected_md5=$(md5sum "$TEST_TEMP_DIR/checksum_test.txt" | cut -d' ' -f1)
    
    # When: Verifying checksums with different algorithms
    verify_checksums "$TEST_TEMP_DIR/checksum_test.txt" "$expected_sha256" "sha256"
    verify_checksums "$TEST_TEMP_DIR/checksum_test.txt" "$expected_sha1" "sha1"
    verify_checksums "$TEST_TEMP_DIR/checksum_test.txt" "$expected_md5" "md5"
    
    # Then: All checksum verifications should pass
    assert_exit_code 0 verify_checksums "$TEST_TEMP_DIR/checksum_test.txt" "$expected_sha256" "sha256"
    assert_exit_code 0 verify_checksums "$TEST_TEMP_DIR/checksum_test.txt" "$expected_sha1" "sha1"
    assert_exit_code 0 verify_checksums "$TEST_TEMP_DIR/checksum_test.txt" "$expected_md5" "md5"
    
    # And: Invalid checksums should fail
    assert_exit_code 1 verify_checksums "$TEST_TEMP_DIR/checksum_test.txt" "invalid_checksum" "sha256"
    
    echo "✅ Use Case Test 2 passed: Checksum verification"
}

# Use Case Test 3: SSH Key Validation
test_ssh_key_validation() {
    echo "=== Use Case Test 3: SSH Key Validation ==="
    
    # Given: SSH keys with different configurations
    setup_test_environment
    source_security_manager
    
    mkdir -p "$TEST_HOME_DIR/.ssh"
    
    # Create valid SSH key
    ssh-keygen -t rsa -b 2048 -f "$TEST_HOME_DIR/.ssh/valid_key" -N "" -q
    chmod 600 "$TEST_HOME_DIR/.ssh/valid_key"
    
    # Create invalid SSH key (wrong permissions)
    ssh-keygen -t rsa -b 2048 -f "$TEST_HOME_DIR/.ssh/invalid_perms_key" -N "" -q
    chmod 644 "$TEST_HOME_DIR/.ssh/invalid_perms_key"
    
    # When: Validating SSH keys
    validate_ssh_keys "$TEST_HOME_DIR/.ssh/valid_key"
    
    # Then: Valid key should pass validation
    assert_exit_code 0 validate_ssh_keys "$TEST_HOME_DIR/.ssh/valid_key"
    
    # And: Invalid permissions should fail validation
    assert_exit_code 1 validate_ssh_keys "$TEST_HOME_DIR/.ssh/invalid_perms_key"
    
    # And: Non-existent key should fail
    assert_exit_code 1 validate_ssh_keys "$TEST_HOME_DIR/.ssh/nonexistent_key"
    
    echo "✅ Use Case Test 3 passed: SSH key validation"
}

# Use Case Test 4: Input Sanitization
test_input_sanitization() {
    echo "=== Use Case Test 4: Input Sanitization ==="
    
    # Given: Various input strings with different characteristics
    setup_test_environment
    source_security_manager
    
    # When: Sanitizing different types of input
    sanitize_input "valid_input_123"
    sanitize_input "test.user@example.com"
    sanitize_input "file_name-123.txt"
    
    # Then: Valid inputs should pass sanitization
    assert_exit_code 0 sanitize_input "valid_input_123"
    assert_exit_code 0 sanitize_input "test.user@example.com"
    assert_exit_code 0 sanitize_input "file_name-123.txt"
    
    # And: Dangerous inputs should fail sanitization
    assert_exit_code 1 sanitize_input "test; rm -rf /"
    assert_exit_code 1 sanitize_input "test | cat /etc/passwd"
    assert_exit_code 1 sanitize_input "test & background_process"
    assert_exit_code 1 sanitize_input "test \`whoami\`"
    assert_exit_code 1 sanitize_input "test \$USER"
    assert_exit_code 1 sanitize_input "test (malicious)"
    assert_exit_code 1 sanitize_input "test <script>"
    assert_exit_code 1 sanitize_input "test \"injection\""
    assert_exit_code 1 sanitize_input "test 'injection'"
    assert_exit_code 1 sanitize_input "test \\backslash"
    
    # And: Input exceeding length limit should fail
    local long_input=$(printf "a%.0s" {1..1001})
    assert_exit_code 1 sanitize_input "$long_input"
    
    echo "✅ Use Case Test 4 passed: Input sanitization"
}

# Use Case Test 5: HTTPS Enforcement
test_https_enforcement() {
    echo "=== Use Case Test 5: HTTPS Enforcement ==="
    
    # Given: Various URLs with different protocols
    setup_test_environment
    source_security_manager
    
    # When: Enforcing HTTPS on different URLs
    enforce_https "https://example.com"
    enforce_https "https://api.github.com"
    enforce_https "https://secure.example.com/path"
    
    # Then: HTTPS URLs should pass enforcement
    assert_exit_code 0 enforce_https "https://example.com"
    assert_exit_code 0 enforce_https "https://api.github.com"
    assert_exit_code 0 enforce_https "https://secure.example.com/path"
    
    # And: HTTP URLs should fail enforcement
    assert_exit_code 1 enforce_https "http://example.com"
    assert_exit_code 1 enforce_https "http://insecure.example.com"
    
    # And: Localhost should fail unless explicitly allowed
    assert_exit_code 1 enforce_https "http://localhost:3000"
    assert_exit_code 0 enforce_https "http://localhost:3000" "true"
    
    echo "✅ Use Case Test 5 passed: HTTPS enforcement"
}

# Use Case Test 6: Permission Checks
test_permission_checks() {
    echo "=== Use Case Test 6: Permission Checks ==="
    
    # Given: Files with different permissions
    setup_test_environment
    source_security_manager
    
    # Create test files with specific permissions
    echo "test content" > "$TEST_TEMP_DIR/test_600.txt"
    chmod 600 "$TEST_TEMP_DIR/test_600.txt"
    
    echo "test content" > "$TEST_TEMP_DIR/test_644.txt"
    chmod 644 "$TEST_TEMP_DIR/test_644.txt"
    
    mkdir -p "$TEST_TEMP_DIR/test_755_dir"
    chmod 755 "$TEST_TEMP_DIR/test_755_dir"
    
    # When: Checking file permissions
    check_permissions "$TEST_TEMP_DIR/test_600.txt" "600"
    check_permissions "$TEST_TEMP_DIR/test_644.txt" "644"
    check_permissions "$TEST_TEMP_DIR/test_755_dir" "755"
    
    # Then: Correct permissions should pass checks
    assert_exit_code 0 check_permissions "$TEST_TEMP_DIR/test_600.txt" "600"
    assert_exit_code 0 check_permissions "$TEST_TEMP_DIR/test_644.txt" "644"
    assert_exit_code 0 check_permissions "$TEST_TEMP_DIR/test_755_dir" "755"
    
    # And: Incorrect permissions should fail checks
    assert_exit_code 1 check_permissions "$TEST_TEMP_DIR/test_600.txt" "644"
    assert_exit_code 1 check_permissions "$TEST_TEMP_DIR/test_644.txt" "600"
    
    # And: Non-existent files should fail
    assert_exit_code 1 check_permissions "$TEST_TEMP_DIR/nonexistent.txt" "600"
    
    echo "✅ Use Case Test 6 passed: Permission checks"
}

# Use Case Test 7: Audit Logging
test_audit_logging() {
    echo "=== Use Case Test 7: Audit Logging ==="
    
    # Given: A security event that needs to be logged
    setup_test_environment
    source_security_manager
    
    # When: Logging security events
    audit_log "LOGIN_ATTEMPT" "User admin attempted login from 192.168.1.1"
    audit_log "FILE_ACCESS" "User accessed sensitive file: /etc/passwd"
    audit_log "PERMISSION_CHANGE" "File permissions changed: /var/log/auth.log"
    
    # Then: Audit log entries should be created
    assert_file_exists "$TEST_SECURITY_DIR/audit.log"
    assert_file_contains "$TEST_SECURITY_DIR/audit.log" "LOGIN_ATTEMPT"
    assert_file_contains "$TEST_SECURITY_DIR/audit.log" "FILE_ACCESS"
    assert_file_contains "$TEST_SECURITY_DIR/audit.log" "PERMISSION_CHANGE"
    
    # And: Log entries should have timestamps
    assert_file_contains "$TEST_SECURITY_DIR/audit.log" "2025-"
    
    echo "✅ Use Case Test 7 passed: Audit logging"
}

# Use Case Test 8: File Integrity Validation
test_file_integrity_validation() {
    echo "=== Use Case Test 8: File Integrity Validation ==="
    
    # Given: A file with known size and checksum
    setup_test_environment
    source_security_manager
    
    echo "integrity test content" > "$TEST_TEMP_DIR/integrity_test.txt"
    local expected_size=$(stat -c "%s" "$TEST_TEMP_DIR/integrity_test.txt" 2>/dev/null || stat -f "%z" "$TEST_TEMP_DIR/integrity_test.txt" 2>/dev/null)
    local expected_checksum=$(sha256sum "$TEST_TEMP_DIR/integrity_test.txt" | cut -d' ' -f1)
    
    # When: Validating file integrity
    validate_file_integrity "$TEST_TEMP_DIR/integrity_test.txt" "$expected_size" "$expected_checksum"
    
    # Then: File integrity validation should pass
    assert_exit_code 0 validate_file_integrity "$TEST_TEMP_DIR/integrity_test.txt" "$expected_size" "$expected_checksum"
    
    # And: Wrong size should fail
    assert_exit_code 1 validate_file_integrity "$TEST_TEMP_DIR/integrity_test.txt" "999" "$expected_checksum"
    
    # And: Wrong checksum should fail
    assert_exit_code 1 validate_file_integrity "$TEST_TEMP_DIR/integrity_test.txt" "$expected_size" "wrong_checksum"
    
    echo "✅ Use Case Test 8 passed: File integrity validation"
}

# Use Case Test 9: Secure Token Generation
test_secure_token_generation() {
    echo "=== Use Case Test 9: Secure Token Generation ==="
    
    # Given: A need for secure tokens
    setup_test_environment
    source_security_manager
    
    # When: Generating secure tokens
    local token1=$(generate_secure_token 32)
    local token2=$(generate_secure_token 16)
    local token3=$(generate_secure_token 64)
    
    # Then: Tokens should be generated successfully
    assert_exit_code 0 generate_secure_token 32
    assert_exit_code 0 generate_secure_token 16
    assert_exit_code 0 generate_secure_token 64
    
    # And: Tokens should have correct length
    assert_string_length "$token1" 32
    assert_string_length "$token2" 16
    assert_string_length "$token3" 64
    
    # And: Tokens should be different
    assert_not_equal "$token1" "$token2"
    assert_not_equal "$token2" "$token3"
    
    echo "✅ Use Case Test 9 passed: Secure token generation"
}

# Use Case Test 10: Data Encryption and Decryption
test_data_encryption_decryption() {
    echo "=== Use Case Test 10: Data Encryption and Decryption ==="
    
    # Given: Sensitive data that needs encryption
    setup_test_environment
    source_security_manager
    
    # Create encryption key
    echo "encryption_key_123" > "$TEST_TEMP_DIR/encryption.key"
    
    local sensitive_data="This is sensitive information that needs to be encrypted"
    local encrypted_file="$TEST_TEMP_DIR/encrypted_data.enc"
    local decrypted_file="$TEST_TEMP_DIR/decrypted_data.txt"
    
    # When: Encrypting and decrypting data
    encrypt_sensitive_data "$sensitive_data" "$TEST_TEMP_DIR/encryption.key" "$encrypted_file"
    decrypt_sensitive_data "$encrypted_file" "$TEST_TEMP_DIR/encryption.key" "$decrypted_file"
    
    # Then: Encryption and decryption should succeed
    assert_exit_code 0 encrypt_sensitive_data "$sensitive_data" "$TEST_TEMP_DIR/encryption.key" "$encrypted_file"
    assert_exit_code 0 decrypt_sensitive_data "$encrypted_file" "$TEST_TEMP_DIR/encryption.key" "$decrypted_file"
    
    # And: Decrypted data should match original
    assert_file_exists "$encrypted_file"
    assert_file_exists "$decrypted_file"
    assert_file_contains "$decrypted_file" "$sensitive_data"
    
    # And: Encrypted file should be different from original
    assert_file_not_contains "$encrypted_file" "$sensitive_data"
    
    echo "✅ Use Case Test 10 passed: Data encryption and decryption"
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

assert_file_not_contains() {
    local file="$1"
    local pattern="$2"
    if grep -q "$pattern" "$file"; then
        echo "ASSERTION FAILED: File contains pattern '$pattern': $file"
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

assert_string_length() {
    local string="$1"
    local expected_length="$2"
    local actual_length=${#string}
    
    if [[ "$actual_length" != "$expected_length" ]]; then
        echo "ASSERTION FAILED: String length mismatch. Expected: $expected_length, Actual: $actual_length"
        return 1
    fi
}

assert_not_equal() {
    local value1="$1"
    local value2="$2"
    
    if [[ "$value1" == "$value2" ]]; then
        echo "ASSERTION FAILED: Values should not be equal: '$value1' == '$value2'"
        return 1
    fi
}

# Main test runner
run_tests() {
    echo "Starting Security Manager Tests..."
    echo "=================================="
    
    # Source the security manager functions
    source_security_manager
    
    # Run all use case tests
    test_complete_security_validation
    test_checksum_verification
    test_ssh_key_validation
    test_input_sanitization
    test_https_enforcement
    test_permission_checks
    test_audit_logging
    test_file_integrity_validation
    test_secure_token_generation
    test_data_encryption_decryption
    
    echo "=================================="
    echo "All Security Manager Tests Passed! ✅"
}

# Run tests if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    run_tests
fi
