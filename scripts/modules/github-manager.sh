#!/bin/bash

# GitHub Manager Module
# Manages GitHub API integration for fetching releases and downloading binaries

set -euo pipefail

# Source utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UTILS_DIR="$(cd "$SCRIPT_DIR/../utils" && pwd)"

# Source GitHub API utilities if available
if [[ -f "$UTILS_DIR/github-api.sh" ]]; then
    source "$UTILS_DIR/github-api.sh"
fi

# GitHub API configuration
GITHUB_API_BASE_URL="https://api.github.com"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

# Fetch latest release
fetch_latest_release() {
    local owner="$1"
    local repo="$2"
    local token="${3:-$GITHUB_TOKEN}"
    
    echo "Fetching latest release for $owner/$repo..."
    
    # Build API URL
    local api_url="$GITHUB_API_BASE_URL/repos/$owner/$repo/releases/latest"
    local headers=""
    
    # Add authentication header if token is provided
    if [[ -n "$token" ]]; then
        headers="-H \"Authorization: token $token\""
    fi
    
    # Make API request
    local response
    if [[ -n "$headers" ]]; then
        response=$(curl -s -H "Authorization: token $token" "$api_url")
    else
        response=$(curl -s "$api_url")
    fi
    
    # Check for API errors
    if echo "$response" | grep -q '"message"'; then
        local error_message=$(echo "$response" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
        echo "ERROR: GitHub API error: $error_message"
        return 1
    fi
    
    # Check for rate limiting
    if echo "$response" | grep -q '"message".*"API rate limit exceeded"'; then
        echo "ERROR: GitHub API rate limit exceeded"
        return 1
    fi
    
    # Output the response
    echo "$response"
    return 0
}

# Fetch specific release
fetch_specific_release() {
    local owner="$1"
    local repo="$2"
    local version="$3"
    local token="${4:-$GITHUB_TOKEN}"
    
    echo "Fetching specific release $version for $owner/$repo..."
    
    # Build API URL
    local api_url="$GITHUB_API_BASE_URL/repos/$owner/$repo/releases/tags/$version"
    local headers=""
    
    # Add authentication header if token is provided
    if [[ -n "$token" ]]; then
        headers="-H \"Authorization: token $token\""
    fi
    
    # Make API request
    local response
    if [[ -n "$headers" ]]; then
        response=$(curl -s -H "Authorization: token $token" "$api_url")
    else
        response=$(curl -s "$api_url")
    fi
    
    # Check for API errors
    if echo "$response" | grep -q '"message"'; then
        local error_message=$(echo "$response" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
        echo "ERROR: GitHub API error: $error_message"
        return 1
    fi
    
    # Check for rate limiting
    if echo "$response" | grep -q '"message".*"API rate limit exceeded"'; then
        echo "ERROR: GitHub API rate limit exceeded"
        return 1
    fi
    
    # Output the response
    echo "$response"
    return 0
}

# Download binary asset
download_binary_asset() {
    local download_url="$1"
    local output_path="$2"
    local token="${3:-$GITHUB_TOKEN}"
    
    echo "Downloading binary asset from $download_url to $output_path..."
    
    # Create output directory if it doesn't exist
    local output_dir=$(dirname "$output_path")
    if [[ ! -d "$output_dir" ]]; then
        mkdir -p "$output_dir"
    fi
    
    # Download the file
    if [[ -n "$token" ]]; then
        curl -s -L -H "Authorization: token $token" -o "$output_path" "$download_url"
    else
        curl -s -L -o "$output_path" "$download_url"
    fi
    
    # Check if download was successful
    if [[ ! -f "$output_path" ]]; then
        echo "ERROR: Failed to download binary asset"
        return 1
    fi
    
    # Make the file executable
    chmod +x "$output_path"
    
    echo "Binary asset downloaded successfully"
    return 0
}

# Handle API rate limiting
handle_api_rate_limiting() {
    local response_headers="$1"
    local retry_after=""
    
    echo "Handling API rate limiting..."
    
    # Extract retry-after header
    retry_after=$(echo "$response_headers" | grep -i "retry-after" | sed 's/.*Retry-After: *\([0-9]*\).*/\1/' || echo "")
    
    if [[ -n "$retry_after" && "$retry_after" =~ ^[0-9]+$ ]]; then
        echo "Rate limit exceeded. Retry after $retry_after seconds"
        sleep "$retry_after"
        return 0
    else
        echo "No rate limiting detected"
        return 0
    fi
}

# Authenticate with GitHub
authenticate_with_github() {
    local token="${1:-$GITHUB_TOKEN}"
    
    echo "Authenticating with GitHub using token..."
    
    if [[ -z "$token" ]]; then
        echo "ERROR: No GitHub token provided"
        return 1
    fi
    
    # Test authentication by making a request to the user endpoint
    local api_url="$GITHUB_API_BASE_URL/user"
    local response
    response=$(curl -s -H "Authorization: token $token" "$api_url")
    
    # Check for authentication errors
    if echo "$response" | grep -q '"message"'; then
        local error_message=$(echo "$response" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
        echo "ERROR: GitHub authentication failed: $error_message"
        return 1
    fi
    
    # Check for rate limiting
    if echo "$response" | grep -q '"message".*"API rate limit exceeded"'; then
        echo "ERROR: GitHub API rate limit exceeded"
        return 1
    fi
    
    echo "GitHub authentication successful"
    return 0
}

# Retry with exponential backoff
retry_with_exponential_backoff() {
    local max_retries="${1:-3}"
    local base_delay="${2:-1}"
    local command="$3"
    
    echo "Retrying command with exponential backoff (max retries: $max_retries, base delay: $base_delay)..."
    
    local retry_count=0
    local delay="$base_delay"
    
    while [[ $retry_count -lt $max_retries ]]; do
        echo "Attempt $((retry_count + 1))/$max_retries"
        
        if $command; then
            echo "Command succeeded on attempt $((retry_count + 1))"
            return 0
        else
            echo "Command failed on attempt $((retry_count + 1))"
            ((retry_count++))
            
            if [[ $retry_count -lt $max_retries ]]; then
                echo "Waiting $delay seconds before retry..."
                sleep "$delay"
                delay=$((delay * 2))
            fi
        fi
    done
    
    echo "Command failed after $max_retries attempts"
    return 1
}

# Get release information
get_release_info() {
    local owner="$1"
    local repo="$2"
    local version="${3:-latest}"
    local token="${4:-$GITHUB_TOKEN}"
    
    echo "Getting release information for $owner/$repo ($version)..."
    
    if [[ "$version" == "latest" ]]; then
        fetch_latest_release "$owner" "$repo" "$token"
    else
        fetch_specific_release "$owner" "$repo" "$version" "$token"
    fi
}

# List release assets
list_release_assets() {
    local owner="$1"
    local repo="$2"
    local version="${3:-latest}"
    local token="${4:-$GITHUB_TOKEN}"
    
    echo "Listing release assets for $owner/$repo ($version)..."
    
    # Get release information
    local release_info
    release_info=$(get_release_info "$owner" "$repo" "$version" "$token")
    
    if [[ $? -ne 0 ]]; then
        echo "ERROR: Failed to get release information"
        return 1
    fi
    
    # Extract assets from the response
    echo "$release_info" | grep -o '"name":"[^"]*"' | cut -d'"' -f4
    return 0
}

# Download release asset by name
download_release_asset() {
    local owner="$1"
    local repo="$2"
    local version="${3:-latest}"
    local asset_name="$4"
    local output_path="$5"
    local token="${6:-$GITHUB_TOKEN}"
    
    echo "Downloading release asset '$asset_name' for $owner/$repo ($version)..."
    
    # Get release information
    local release_info
    release_info=$(get_release_info "$owner" "$repo" "$version" "$token")
    
    if [[ $? -ne 0 ]]; then
        echo "ERROR: Failed to get release information"
        return 1
    fi
    
    # Find the asset download URL
    local download_url
    download_url=$(echo "$release_info" | grep -A 10 "\"name\":\"$asset_name\"" | grep -o '"browser_download_url":"[^"]*"' | cut -d'"' -f4)
    
    if [[ -z "$download_url" ]]; then
        echo "ERROR: Asset '$asset_name' not found in release"
        return 1
    fi
    
    # Download the asset
    download_binary_asset "$download_url" "$output_path" "$token"
    return $?
}

# Get comprehensive GitHub manager information
get_github_manager_info() {
    echo "=== GitHub Manager Information ==="
    echo "API Base URL: $GITHUB_API_BASE_URL"
    echo "Rate Limit: 5000 requests/hour (authenticated)"
    echo "Rate Limit: 60 requests/hour (unauthenticated)"
    echo "=== Authentication Status ==="
    if [[ -n "$GITHUB_TOKEN" ]]; then
        echo "✓ GitHub token is set"
        authenticate_with_github "$GITHUB_TOKEN"
    else
        echo "✗ No GitHub token set (using unauthenticated requests)"
    fi
    echo "=== Available Functions ==="
    echo "- fetch_latest_release(owner, repo, token)"
    echo "- fetch_specific_release(owner, repo, version, token)"
    echo "- download_binary_asset(url, path, token)"
    echo "- handle_api_rate_limiting(headers)"
    echo "- authenticate_with_github(token)"
    echo "- retry_with_exponential_backoff(max_retries, base_delay, command)"
    echo "- get_release_info(owner, repo, version, token)"
    echo "- list_release_assets(owner, repo, version, token)"
    echo "- download_release_asset(owner, repo, version, asset_name, output_path, token)"
}

# Main function for command line usage
main() {
    local command="${1:-info}"
    
    case "$command" in
        "fetch-latest")
            fetch_latest_release "${2:-}" "${3:-}" "${4:-$GITHUB_TOKEN}"
            ;;
        "fetch-specific")
            fetch_specific_release "${2:-}" "${3:-}" "${4:-}" "${5:-$GITHUB_TOKEN}"
            ;;
        "download-asset")
            download_binary_asset "${2:-}" "${3:-}" "${4:-$GITHUB_TOKEN}"
            ;;
        "authenticate")
            authenticate_with_github "${2:-$GITHUB_TOKEN}"
            ;;
        "get-release-info")
            get_release_info "${2:-}" "${3:-}" "${4:-latest}" "${5:-$GITHUB_TOKEN}"
            ;;
        "list-assets")
            list_release_assets "${2:-}" "${3:-}" "${4:-latest}" "${5:-$GITHUB_TOKEN}"
            ;;
        "download-release-asset")
            download_release_asset "${2:-}" "${3:-}" "${4:-latest}" "${5:-}" "${6:-}" "${7:-$GITHUB_TOKEN}"
            ;;
        "info"|*)
            get_github_manager_info
            ;;
    esac
}

# Export functions for use by other scripts
export -f fetch_latest_release
export -f fetch_specific_release
export -f download_binary_asset
export -f handle_api_rate_limiting
export -f authenticate_with_github
export -f retry_with_exponential_backoff
export -f get_release_info
export -f list_release_assets
export -f download_release_asset
export -f get_github_manager_info

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
