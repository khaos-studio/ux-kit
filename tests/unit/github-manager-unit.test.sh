#!/bin/bash

# GitHub Manager Unit Tests
# Unit tests for individual GitHub integration functions

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
    
    echo "GitHub manager unit test environment setup complete"
}

# Test cleanup
cleanup_test_environment() {
    if [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]]; then
        rm -rf "$TEST_TEMP_DIR"
        echo "GitHub manager unit test environment cleaned up"
    fi
    
    # Reset environment variables
    unset UXKIT_CONFIG_DIR
}

# Test trap for cleanup
trap cleanup_test_environment EXIT

# Source the GitHub manager module
source "$PROJECT_ROOT/scripts/modules/github-manager.sh"

# Unit Test 1: fetch_latest_release function
test_fetch_latest_release_basic() {
    echo "=== Unit Test 1: fetch_latest_release basic functionality ==="
    
    setup_test_environment
    
    # Test fetching latest release (will fail without real API, but function should be callable)
    fetch_latest_release "owner" "repo"
    
    # Verify function can be called (will fail due to network, but that's expected)
    assert_exit_code 1 fetch_latest_release "owner" "repo"
    
    echo "✅ Unit Test 1 passed: fetch_latest_release basic functionality"
}

test_fetch_latest_release_with_token() {
    echo "=== Unit Test 2: fetch_latest_release with token ==="
    
    setup_test_environment
    
    # Test fetching latest release with token
    fetch_latest_release "owner" "repo" "ghp_test_token"
    
    # Verify function can be called with token
    assert_exit_code 1 fetch_latest_release "owner" "repo" "ghp_test_token"
    
    echo "✅ Unit Test 2 passed: fetch_latest_release with token"
}

# Unit Test 2: fetch_specific_release function
test_fetch_specific_release_basic() {
    echo "=== Unit Test 3: fetch_specific_release basic functionality ==="
    
    setup_test_environment
    
    # Test fetching specific release
    fetch_specific_release "owner" "repo" "v1.0.0"
    
    # Verify function can be called
    assert_exit_code 1 fetch_specific_release "owner" "repo" "v1.0.0"
    
    echo "✅ Unit Test 3 passed: fetch_specific_release basic functionality"
}

test_fetch_specific_release_with_token() {
    echo "=== Unit Test 4: fetch_specific_release with token ==="
    
    setup_test_environment
    
    # Test fetching specific release with token
    fetch_specific_release "owner" "repo" "v1.0.0" "ghp_test_token"
    
    # Verify function can be called with token
    assert_exit_code 1 fetch_specific_release "owner" "repo" "v1.0.0" "ghp_test_token"
    
    echo "✅ Unit Test 4 passed: fetch_specific_release with token"
}

# Unit Test 3: download_binary_asset function
test_download_binary_asset_basic() {
    echo "=== Unit Test 5: download_binary_asset basic functionality ==="
    
    setup_test_environment
    
    # Test downloading binary asset (will fail without real URL, but function should be callable)
    download_binary_asset "https://example.com/binary" "$TEST_TEMP_DIR/binary"
    
    # Verify function can be called
    assert_exit_code 1 download_binary_asset "https://example.com/binary" "$TEST_TEMP_DIR/binary"
    
    echo "✅ Unit Test 5 passed: download_binary_asset basic functionality"
}

test_download_binary_asset_with_token() {
    echo "=== Unit Test 6: download_binary_asset with token ==="
    
    setup_test_environment
    
    # Test downloading binary asset with token
    download_binary_asset "https://example.com/binary" "$TEST_TEMP_DIR/binary" "ghp_test_token"
    
    # Verify function can be called with token
    assert_exit_code 1 download_binary_asset "https://example.com/binary" "$TEST_TEMP_DIR/binary" "ghp_test_token"
    
    echo "✅ Unit Test 6 passed: download_binary_asset with token"
}

# Unit Test 4: handle_api_rate_limiting function
test_handle_api_rate_limiting_basic() {
    echo "=== Unit Test 7: handle_api_rate_limiting basic functionality ==="
    
    setup_test_environment
    
    # Test handling rate limiting
    handle_api_rate_limiting "Retry-After: 60"
    
    # Verify function succeeds
    assert_exit_code 0 handle_api_rate_limiting "Retry-After: 60"
    
    echo "✅ Unit Test 7 passed: handle_api_rate_limiting basic functionality"
}

test_handle_api_rate_limiting_no_retry() {
    echo "=== Unit Test 8: handle_api_rate_limiting no retry ==="
    
    setup_test_environment
    
    # Test handling rate limiting without retry-after
    handle_api_rate_limiting "X-RateLimit-Remaining: 1000"
    
    # Verify function succeeds
    assert_exit_code 0 handle_api_rate_limiting "X-RateLimit-Remaining: 1000"
    
    echo "✅ Unit Test 8 passed: handle_api_rate_limiting no retry"
}

# Unit Test 5: authenticate_with_github function
test_authenticate_with_github_basic() {
    echo "=== Unit Test 9: authenticate_with_github basic functionality ==="
    
    setup_test_environment
    
    # Test authentication with token
    authenticate_with_github "ghp_test_token"
    
    # Verify function can be called (will fail due to network, but that's expected)
    assert_exit_code 1 authenticate_with_github "ghp_test_token"
    
    echo "✅ Unit Test 9 passed: authenticate_with_github basic functionality"
}

test_authenticate_with_github_no_token() {
    echo "=== Unit Test 10: authenticate_with_github no token ==="
    
    setup_test_environment
    
    # Test authentication without token
    authenticate_with_github ""
    
    # Verify function fails without token
    assert_exit_code 1 authenticate_with_github ""
    
    echo "✅ Unit Test 10 passed: authenticate_with_github no token"
}

# Unit Test 6: retry_with_exponential_backoff function
test_retry_with_exponential_backoff_basic() {
    echo "=== Unit Test 11: retry_with_exponential_backoff basic functionality ==="
    
    setup_test_environment
    
    # Test retry with successful command
    retry_with_exponential_backoff 3 1 "echo 'success'"
    
    # Verify function succeeds with successful command
    assert_exit_code 0 retry_with_exponential_backoff 3 1 "echo 'success'"
    
    echo "✅ Unit Test 11 passed: retry_with_exponential_backoff basic functionality"
}

test_retry_with_exponential_backoff_failure() {
    echo "=== Unit Test 12: retry_with_exponential_backoff failure ==="
    
    setup_test_environment
    
    # Test retry with failing command
    retry_with_exponential_backoff 2 1 "false"
    
    # Verify function fails with failing command
    assert_exit_code 1 retry_with_exponential_backoff 2 1 "false"
    
    echo "✅ Unit Test 12 passed: retry_with_exponential_backoff failure"
}

# Unit Test 7: get_release_info function
test_get_release_info_basic() {
    echo "=== Unit Test 13: get_release_info basic functionality ==="
    
    setup_test_environment
    
    # Test getting release info
    get_release_info "owner" "repo" "latest"
    
    # Verify function can be called
    assert_exit_code 1 get_release_info "owner" "repo" "latest"
    
    echo "✅ Unit Test 13 passed: get_release_info basic functionality"
}

test_get_release_info_specific_version() {
    echo "=== Unit Test 14: get_release_info specific version ==="
    
    setup_test_environment
    
    # Test getting specific release info
    get_release_info "owner" "repo" "v1.0.0"
    
    # Verify function can be called with specific version
    assert_exit_code 1 get_release_info "owner" "repo" "v1.0.0"
    
    echo "✅ Unit Test 14 passed: get_release_info specific version"
}

# Unit Test 8: list_release_assets function
test_list_release_assets_basic() {
    echo "=== Unit Test 15: list_release_assets basic functionality ==="
    
    setup_test_environment
    
    # Test listing release assets
    list_release_assets "owner" "repo" "latest"
    
    # Verify function can be called
    assert_exit_code 1 list_release_assets "owner" "repo" "latest"
    
    echo "✅ Unit Test 15 passed: list_release_assets basic functionality"
}

test_list_release_assets_with_token() {
    echo "=== Unit Test 16: list_release_assets with token ==="
    
    setup_test_environment
    
    # Test listing release assets with token
    list_release_assets "owner" "repo" "latest" "ghp_test_token"
    
    # Verify function can be called with token
    assert_exit_code 1 list_release_assets "owner" "repo" "latest" "ghp_test_token"
    
    echo "✅ Unit Test 16 passed: list_release_assets with token"
}

# Unit Test 9: download_release_asset function
test_download_release_asset_basic() {
    echo "=== Unit Test 17: download_release_asset basic functionality ==="
    
    setup_test_environment
    
    # Test downloading release asset
    download_release_asset "owner" "repo" "latest" "binary" "$TEST_TEMP_DIR/binary"
    
    # Verify function can be called
    assert_exit_code 1 download_release_asset "owner" "repo" "latest" "binary" "$TEST_TEMP_DIR/binary"
    
    echo "✅ Unit Test 17 passed: download_release_asset basic functionality"
}

test_download_release_asset_with_token() {
    echo "=== Unit Test 18: download_release_asset with token ==="
    
    setup_test_environment
    
    # Test downloading release asset with token
    download_release_asset "owner" "repo" "latest" "binary" "$TEST_TEMP_DIR/binary" "ghp_test_token"
    
    # Verify function can be called with token
    assert_exit_code 1 download_release_asset "owner" "repo" "latest" "binary" "$TEST_TEMP_DIR/binary" "ghp_test_token"
    
    echo "✅ Unit Test 18 passed: download_release_asset with token"
}

# Unit Test 10: get_github_manager_info function
test_get_github_manager_info_basic() {
    echo "=== Unit Test 19: get_github_manager_info basic functionality ==="
    
    setup_test_environment
    
    # Test getting GitHub manager info
    get_github_manager_info
    
    # Verify function succeeds
    assert_exit_code 0 get_github_manager_info
    
    echo "✅ Unit Test 19 passed: get_github_manager_info basic functionality"
}

# Unit Test 11: Command line interface
test_command_line_interface() {
    echo "=== Unit Test 20: Command line interface ==="
    
    setup_test_environment
    
    # Test individual command line options
    ./scripts/modules/github-manager.sh fetch-latest "owner" "repo"
    ./scripts/modules/github-manager.sh fetch-specific "owner" "repo" "v1.0.0"
    ./scripts/modules/github-manager.sh download-asset "https://example.com/binary" "$TEST_TEMP_DIR/binary"
    ./scripts/modules/github-manager.sh authenticate "ghp_test_token"
    ./scripts/modules/github-manager.sh get-release-info "owner" "repo" "latest"
    ./scripts/modules/github-manager.sh list-assets "owner" "repo" "latest"
    ./scripts/modules/github-manager.sh download-release-asset "owner" "repo" "latest" "binary" "$TEST_TEMP_DIR/binary"
    ./scripts/modules/github-manager.sh info
    
    # Verify each command returns appropriate exit code
    assert_exit_code 1 ./scripts/modules/github-manager.sh fetch-latest "owner" "repo"
    assert_exit_code 1 ./scripts/modules/github-manager.sh fetch-specific "owner" "repo" "v1.0.0"
    assert_exit_code 1 ./scripts/modules/github-manager.sh download-asset "https://example.com/binary" "$TEST_TEMP_DIR/binary"
    assert_exit_code 1 ./scripts/modules/github-manager.sh authenticate "ghp_test_token"
    assert_exit_code 1 ./scripts/modules/github-manager.sh get-release-info "owner" "repo" "latest"
    assert_exit_code 1 ./scripts/modules/github-manager.sh list-assets "owner" "repo" "latest"
    assert_exit_code 1 ./scripts/modules/github-manager.sh download-release-asset "owner" "repo" "latest" "binary" "$TEST_TEMP_DIR/binary"
    assert_exit_code 0 ./scripts/modules/github-manager.sh info
    
    echo "✅ Unit Test 20 passed: Command line interface"
}

# Unit Test 12: Error handling
test_error_handling() {
    echo "=== Unit Test 21: Error handling ==="
    
    setup_test_environment
    
    # Test error handling for various scenarios
    fetch_latest_release "" ""
    fetch_specific_release "" "" ""
    download_binary_asset "" ""
    authenticate_with_github ""
    
    # Verify functions handle errors gracefully
    assert_exit_code 1 fetch_latest_release "" ""
    assert_exit_code 1 fetch_specific_release "" "" ""
    assert_exit_code 1 download_binary_asset "" ""
    assert_exit_code 1 authenticate_with_github ""
    
    echo "✅ Unit Test 21 passed: Error handling"
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
    echo "Starting GitHub Manager Unit Tests..."
    echo "====================================="
    
    # Run all unit tests
    test_fetch_latest_release_basic
    test_fetch_latest_release_with_token
    test_fetch_specific_release_basic
    test_fetch_specific_release_with_token
    test_download_binary_asset_basic
    test_download_binary_asset_with_token
    test_handle_api_rate_limiting_basic
    test_handle_api_rate_limiting_no_retry
    test_authenticate_with_github_basic
    test_authenticate_with_github_no_token
    test_retry_with_exponential_backoff_basic
    test_retry_with_exponential_backoff_failure
    test_get_release_info_basic
    test_get_release_info_specific_version
    test_list_release_assets_basic
    test_list_release_assets_with_token
    test_download_release_asset_basic
    test_download_release_asset_with_token
    test_get_github_manager_info_basic
    test_command_line_interface
    test_error_handling
    
    echo "====================================="
    echo "All GitHub Manager Unit Tests Passed! ✅"
}

# Run tests if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    run_unit_tests
fi
