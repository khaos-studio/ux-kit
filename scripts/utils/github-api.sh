#!/bin/bash

# GitHub API Utilities
# Utility functions for GitHub API interactions

set -euo pipefail

# GitHub API configuration
GITHUB_API_BASE_URL="https://api.github.com"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

# Make authenticated GitHub API request
make_github_api_request() {
    local endpoint="$1"
    local method="${2:-GET}"
    local data="${3:-}"
    local token="${4:-$GITHUB_TOKEN}"
    
    local url="$GITHUB_API_BASE_URL$endpoint"
    local headers=""
    
    # Add authentication header if token is provided
    if [[ -n "$token" ]]; then
        headers="-H \"Authorization: token $token\""
    fi
    
    # Add content type header for POST/PUT requests
    if [[ "$method" == "POST" || "$method" == "PUT" || "$method" == "PATCH" ]]; then
        headers="$headers -H \"Content-Type: application/json\""
    fi
    
    # Make the request
    local response
    if [[ "$method" == "GET" ]]; then
        if [[ -n "$token" ]]; then
            response=$(curl -s -H "Authorization: token $token" "$url")
        else
            response=$(curl -s "$url")
        fi
    elif [[ "$method" == "POST" ]]; then
        if [[ -n "$token" ]]; then
            response=$(curl -s -X POST -H "Authorization: token $token" -H "Content-Type: application/json" -d "$data" "$url")
        else
            response=$(curl -s -X POST -H "Content-Type: application/json" -d "$data" "$url")
        fi
    elif [[ "$method" == "PUT" ]]; then
        if [[ -n "$token" ]]; then
            response=$(curl -s -X PUT -H "Authorization: token $token" -H "Content-Type: application/json" -d "$data" "$url")
        else
            response=$(curl -s -X PUT -H "Content-Type: application/json" -d "$data" "$url")
        fi
    elif [[ "$method" == "PATCH" ]]; then
        if [[ -n "$token" ]]; then
            response=$(curl -s -X PATCH -H "Authorization: token $token" -H "Content-Type: application/json" -d "$data" "$url")
        else
            response=$(curl -s -X PATCH -H "Content-Type: application/json" -d "$data" "$url")
        fi
    elif [[ "$method" == "DELETE" ]]; then
        if [[ -n "$token" ]]; then
            response=$(curl -s -X DELETE -H "Authorization: token $token" "$url")
        else
            response=$(curl -s -X DELETE "$url")
        fi
    else
        echo "ERROR: Unsupported HTTP method: $method"
        return 1
    fi
    
    # Check for HTTP errors
    local http_code
    http_code=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $token" "$url" 2>/dev/null || echo "000")
    
    if [[ "$http_code" -ge 400 ]]; then
        echo "ERROR: HTTP $http_code error"
        return 1
    fi
    
    # Output the response
    echo "$response"
    return 0
}

# Check GitHub API rate limit
check_rate_limit() {
    local token="${1:-$GITHUB_TOKEN}"
    
    echo "Checking GitHub API rate limit..."
    
    local response
    response=$(make_github_api_request "/rate_limit" "GET" "" "$token")
    
    if [[ $? -ne 0 ]]; then
        echo "ERROR: Failed to check rate limit"
        return 1
    fi
    
    # Extract rate limit information
    local remaining
    local reset_time
    local limit
    
    remaining=$(echo "$response" | grep -o '"remaining":[0-9]*' | cut -d':' -f2)
    reset_time=$(echo "$response" | grep -o '"reset":[0-9]*' | cut -d':' -f2)
    limit=$(echo "$response" | grep -o '"limit":[0-9]*' | cut -d':' -f2)
    
    echo "Rate limit: $remaining/$limit requests remaining"
    echo "Reset time: $(date -r "$reset_time" 2>/dev/null || echo "Unknown")"
    
    if [[ "$remaining" -eq 0 ]]; then
        echo "WARNING: Rate limit exceeded"
        return 1
    fi
    
    return 0
}

# Parse GitHub release JSON
parse_release_json() {
    local json_data="$1"
    local field="$2"
    
    case "$field" in
        "tag_name")
            echo "$json_data" | grep -o '"tag_name":"[^"]*"' | cut -d'"' -f4
            ;;
        "name")
            echo "$json_data" | grep -o '"name":"[^"]*"' | cut -d'"' -f4
            ;;
        "body")
            echo "$json_data" | grep -o '"body":"[^"]*"' | cut -d'"' -f4
            ;;
        "published_at")
            echo "$json_data" | grep -o '"published_at":"[^"]*"' | cut -d'"' -f4
            ;;
        "assets")
            echo "$json_data" | grep -A 20 '"assets":\[' | grep -o '"name":"[^"]*"' | cut -d'"' -f4
            ;;
        "download_url")
            local asset_name="$3"
            echo "$json_data" | grep -A 10 "\"name\":\"$asset_name\"" | grep -o '"browser_download_url":"[^"]*"' | cut -d'"' -f4
            ;;
        *)
            echo "ERROR: Unknown field: $field"
            return 1
            ;;
    esac
}

# Validate GitHub token
validate_github_token() {
    local token="${1:-$GITHUB_TOKEN}"
    
    if [[ -z "$token" ]]; then
        echo "ERROR: No GitHub token provided"
        return 1
    fi
    
    # Test token by making a request to the user endpoint
    local response
    response=$(make_github_api_request "/user" "GET" "" "$token")
    
    if [[ $? -ne 0 ]]; then
        echo "ERROR: Invalid GitHub token"
        return 1
    fi
    
    # Check if response contains user information
    if echo "$response" | grep -q '"login"'; then
        local username
        username=$(echo "$response" | grep -o '"login":"[^"]*"' | cut -d'"' -f4)
        echo "GitHub token is valid for user: $username"
        return 0
    else
        echo "ERROR: Invalid GitHub token response"
        return 1
    fi
}

# Get repository information
get_repository_info() {
    local owner="$1"
    local repo="$2"
    local token="${3:-$GITHUB_TOKEN}"
    
    echo "Getting repository information for $owner/$repo..."
    
    local response
    response=$(make_github_api_request "/repos/$owner/$repo" "GET" "" "$token")
    
    if [[ $? -ne 0 ]]; then
        echo "ERROR: Failed to get repository information"
        return 1
    fi
    
    # Extract repository information
    local full_name
    local description
    local stargazers_count
    local forks_count
    
    full_name=$(parse_release_json "$response" "name")
    description=$(echo "$response" | grep -o '"description":"[^"]*"' | cut -d'"' -f4)
    stargazers_count=$(echo "$response" | grep -o '"stargazers_count":[0-9]*' | cut -d':' -f2)
    forks_count=$(echo "$response" | grep -o '"forks_count":[0-9]*' | cut -d':' -f2)
    
    echo "Repository: $full_name"
    echo "Description: $description"
    echo "Stars: $stargazers_count"
    echo "Forks: $forks_count"
    
    return 0
}

# List repository releases
list_repository_releases() {
    local owner="$1"
    local repo="$2"
    local token="${3:-$GITHUB_TOKEN}"
    local per_page="${4:-10}"
    
    echo "Listing releases for $owner/$repo..."
    
    local response
    response=$(make_github_api_request "/repos/$owner/$repo/releases?per_page=$per_page" "GET" "" "$token")
    
    if [[ $? -ne 0 ]]; then
        echo "ERROR: Failed to list releases"
        return 1
    fi
    
    # Extract release information
    echo "$response" | grep -o '"tag_name":"[^"]*"' | cut -d'"' -f4
    return 0
}

# Search repositories
search_repositories() {
    local query="$1"
    local token="${2:-$GITHUB_TOKEN}"
    local per_page="${3:-10}"
    
    echo "Searching repositories for: $query..."
    
    local response
    response=$(make_github_api_request "/search/repositories?q=$query&per_page=$per_page" "GET" "" "$token")
    
    if [[ $? -ne 0 ]]; then
        echo "ERROR: Failed to search repositories"
        return 1
    fi
    
    # Extract repository information
    echo "$response" | grep -o '"full_name":"[^"]*"' | cut -d'"' -f4
    return 0
}

# Get user information
get_user_info() {
    local username="$1"
    local token="${2:-$GITHUB_TOKEN}"
    
    echo "Getting user information for: $username..."
    
    local response
    response=$(make_github_api_request "/users/$username" "GET" "" "$token")
    
    if [[ $? -ne 0 ]]; then
        echo "ERROR: Failed to get user information"
        return 1
    fi
    
    # Extract user information
    local name
    local public_repos
    local followers
    local following
    
    name=$(echo "$response" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    public_repos=$(echo "$response" | grep -o '"public_repos":[0-9]*' | cut -d':' -f2)
    followers=$(echo "$response" | grep -o '"followers":[0-9]*' | cut -d':' -f2)
    following=$(echo "$response" | grep -o '"following":[0-9]*' | cut -d':' -f2)
    
    echo "User: $name"
    echo "Public repositories: $public_repos"
    echo "Followers: $followers"
    echo "Following: $following"
    
    return 0
}

# Export functions for use by other scripts
export -f make_github_api_request
export -f check_rate_limit
export -f parse_release_json
export -f validate_github_token
export -f get_repository_info
export -f list_repository_releases
export -f search_repositories
export -f get_user_info
