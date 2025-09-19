#!/bin/bash

# UX-Kit: Create New Research Script
# Creates a new research branch and initializes research files

set -euo pipefail

# Parse JSON arguments
ARGS_JSON="$1"
RESEARCH_NAME=$(echo "$ARGS_JSON" | jq -r '.name // empty')
RESEARCH_TYPE=$(echo "$ARGS_JSON" | jq -r '.type // "general"')
STUDY_ID=$(echo "$ARGS_JSON" | jq -r '.study // empty')

# Validate required arguments
if [[ -z "$RESEARCH_NAME" ]]; then
    echo "Error: Research name is required" >&2
    echo '{"error": "Research name is required"}' | jq .
    exit 1
fi

# Generate branch name
BRANCH_NAME="research/$(echo "$RESEARCH_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')"

# Create research directory if it doesn't exist
RESEARCH_DIR=".uxkit/studies/${STUDY_ID:-default}"
mkdir -p "$RESEARCH_DIR"

# Generate spec file path
SPEC_FILE="$PWD/$RESEARCH_DIR/research-spec.md"

# Create and checkout new branch
git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"

# Initialize spec file
cat > "$SPEC_FILE" << EOF
# Research Specification: $RESEARCH_NAME

**Type**: $RESEARCH_TYPE
**Study ID**: ${STUDY_ID:-default}
**Branch**: $BRANCH_NAME
**Created**: $(date -u +"%Y-%m-%d %H:%M:%S UTC")

## Research Objectives

[To be filled by Cursor command]

## Research Questions

[To be filled by Cursor command]

## Methodology

[To be filled by Cursor command]

## Expected Outcomes

[To be filled by Cursor command]

## Timeline

[To be filled by Cursor command]
EOF

# Output JSON result
cat << EOF | jq .
{
  "success": true,
  "BRANCH_NAME": "$BRANCH_NAME",
  "SPEC_FILE": "$SPEC_FILE",
  "research_name": "$RESEARCH_NAME",
  "research_type": "$RESEARCH_TYPE",
  "study_id": "${STUDY_ID:-default}",
  "created_at": "$(date -u +"%Y-%m-%d %H:%M:%S UTC")"
}
EOF

