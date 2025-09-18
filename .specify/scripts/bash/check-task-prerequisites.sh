#!/bin/bash

# check-task-prerequisites.sh
# Checks available design documents for task generation

set -e

# Parse JSON input
if [ -z "$1" ]; then
    echo "Usage: $0 --json '{\"feature_dir\": \"path\", ...}'" >&2
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

# Extract feature directory (required)
if command -v jq >/dev/null 2>&1; then
    FEATURE_DIR=$(echo "$JSON_DATA" | jq -r '.feature_dir // empty')
else
    # Fallback: extract feature_dir using grep and sed
    FEATURE_DIR=$(echo "$JSON_DATA" | grep -o '"feature_dir"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"feature_dir"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
fi

if [ -z "$FEATURE_DIR" ]; then
    echo "Error: feature_dir is required" >&2
    exit 1
fi

# Check for available design documents
AVAILABLE_DOCS=""

# Check for plan.md
if [ -f "$FEATURE_DIR/plan.md" ]; then
    AVAILABLE_DOCS="$AVAILABLE_DOCS plan.md"
fi

# Check for data-model.md
if [ -f "$FEATURE_DIR/data-model.md" ]; then
    AVAILABLE_DOCS="$AVAILABLE_DOCS data-model.md"
fi

# Check for contracts directory
if [ -d "$FEATURE_DIR/contracts" ]; then
    AVAILABLE_DOCS="$AVAILABLE_DOCS contracts/"
fi

# Check for research.md
if [ -f "$FEATURE_DIR/research.md" ]; then
    AVAILABLE_DOCS="$AVAILABLE_DOCS research.md"
fi

# Check for quickstart.md
if [ -f "$FEATURE_DIR/quickstart.md" ]; then
    AVAILABLE_DOCS="$AVAILABLE_DOCS quickstart.md"
fi

# Check for tasks.md (existing)
if [ -f "$FEATURE_DIR/tasks.md" ]; then
    AVAILABLE_DOCS="$AVAILABLE_DOCS tasks.md"
fi

# Output JSON response
cat << EOF
{
  "feature_dir": "$FEATURE_DIR",
  "available_docs": "$AVAILABLE_DOCS"
}
EOF