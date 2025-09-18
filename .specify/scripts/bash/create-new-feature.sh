#!/bin/bash

# create-new-feature.sh
# Creates a new feature specification with branch and file structure

set -e

# Parse JSON input
if [ -z "$1" ]; then
    echo "Usage: $0 --json '{\"feature_name\": \"value\", ...}'" >&2
    exit 1
fi

# Extract JSON argument
JSON_INPUT="$1"
if [[ "$JSON_INPUT" != --json* ]]; then
    echo "Error: Expected --json argument" >&2
    exit 1
fi

# Remove --json prefix and parse
JSON_DATA="${JSON_INPUT#--json }"

# Extract feature name (required) - handle case where jq might not be available
if command -v jq >/dev/null 2>&1; then
    FEATURE_NAME=$(echo "$JSON_DATA" | jq -r '.feature_name // empty')
else
    # Fallback: extract feature_name using grep and sed
    FEATURE_NAME=$(echo "$JSON_DATA" | grep -o '"feature_name"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"feature_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
fi
if [ -z "$FEATURE_NAME" ]; then
    echo "Error: feature_name is required" >&2
    exit 1
fi

# Generate branch name (sanitized)
BRANCH_NAME="feature/$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')"

# Generate spec file path
SPEC_FILE=".specify/specs/${BRANCH_NAME#feature/}.md"

# Create branch and spec file directory
git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"
mkdir -p "$(dirname "$SPEC_FILE")"

# Create empty spec file
touch "$SPEC_FILE"

# Output JSON response
cat << EOF
{
  "branch_name": "$BRANCH_NAME",
  "spec_file": "$SPEC_FILE",
  "feature_name": "$FEATURE_NAME"
}
EOF