#!/bin/bash

# UX-Kit: Create New Feature Script  
# Creates a new feature branch and initializes spec files

set -euo pipefail

# Parse JSON arguments
ARGS_JSON="$1"
FEATURE_NAME=$(echo "$ARGS_JSON" | jq -r '.name // .description // empty')
FEATURE_DESCRIPTION=$(echo "$ARGS_JSON" | jq -r '.description // .name // empty')

# Validate required arguments
if [[ -z "$FEATURE_NAME" ]]; then
    echo "Error: Feature name or description is required" >&2
    echo '{"error": "Feature name or description is required"}' | jq .
    exit 1
fi

# Generate branch name from feature name
BRANCH_NAME="feature/$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')"

# Create .specify directory if it doesn't exist
SPECIFY_DIR=".specify"
mkdir -p "$SPECIFY_DIR/specs"

# Generate spec file path
SPEC_FILE="$PWD/$SPECIFY_DIR/specs/$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')-spec.md"

# Create and checkout new branch
git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"

# Initialize spec file with basic structure
cat > "$SPEC_FILE" << EOF
# Feature Specification: $FEATURE_NAME

**Description**: $FEATURE_DESCRIPTION
**Branch**: $BRANCH_NAME
**Created**: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
**Status**: Draft

## Overview

[To be filled by Cursor command based on feature description]

## User Stories

[To be filled by Cursor command]

## Acceptance Criteria

[To be filled by Cursor command]

## Technical Requirements

[To be filled by Cursor command]

## Design Considerations

[To be filled by Cursor command]

## Implementation Plan

[To be filled by Cursor command]

## Testing Strategy

[To be filled by Cursor command]

## Risks and Considerations

[To be filled by Cursor command]
EOF

# Output JSON result
cat << EOF | jq .
{
  "success": true,
  "BRANCH_NAME": "$BRANCH_NAME",
  "SPEC_FILE": "$SPEC_FILE",
  "feature_name": "$FEATURE_NAME",
  "feature_description": "$FEATURE_DESCRIPTION",
  "created_at": "$(date -u +"%Y-%m-%d %H:%M:%S UTC")"
}
EOF

