#!/bin/bash

# setup-plan.sh
# Sets up implementation planning workflow

set -e

# Parse JSON input
if [ -z "$1" ]; then
    echo "Usage: $0 --json '{\"feature_spec\": \"path\", ...}'" >&2
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

# Extract feature spec path (required) - handle case where jq might not be available
if command -v jq >/dev/null 2>&1; then
    FEATURE_SPEC=$(echo "$JSON_DATA" | jq -r '.feature_spec // empty')
else
    # Fallback: extract feature_spec using grep and sed
    FEATURE_SPEC=$(echo "$JSON_DATA" | grep -o '"feature_spec"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"feature_spec"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
fi

if [ -z "$FEATURE_SPEC" ]; then
    echo "Error: feature_spec is required" >&2
    exit 1
fi

# Generate implementation plan path
IMPL_PLAN=".specify/plans/$(basename "$FEATURE_SPEC" .md)-plan.md"

# Generate specs directory
SPECS_DIR=".specify/specs"

# Get current branch
BRANCH=$(git branch --show-current)

# Create directories
mkdir -p "$(dirname "$IMPL_PLAN")"
mkdir -p "$SPECS_DIR"

# Copy plan template to implementation plan path
if [ -f ".specify/templates/plan-template.md" ]; then
    cp ".specify/templates/plan-template.md" "$IMPL_PLAN"
else
    echo "Error: Plan template not found" >&2
    exit 1
fi

# Output JSON response
cat << EOF
{
  "feature_spec": "$FEATURE_SPEC",
  "impl_plan": "$IMPL_PLAN",
  "specs_dir": "$SPECS_DIR",
  "branch": "$BRANCH"
}
EOF