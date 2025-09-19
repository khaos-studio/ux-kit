#!/bin/bash

# UX-Kit Environment Configuration
# This file contains environment variables for UX-Kit

# Core configuration
export UXKIT_CONFIG_DIR="${HOME}/.uxkit"
export UXKIT_LOG_LEVEL="info"
export UXKIT_CACHE_DIR="${UXKIT_CONFIG_DIR}/cache"
export UXKIT_DATA_DIR="${UXKIT_CONFIG_DIR}/data"
export UXKIT_LOG_DIR="${UXKIT_CONFIG_DIR}/logs"

# Research configuration
export UXKIT_RESEARCH_DIR="${UXKIT_DATA_DIR}/research"
export UXKIT_STUDIES_DIR="${UXKIT_RESEARCH_DIR}/studies"
export UXKIT_TEMPLATES_DIR="${UXKIT_CONFIG_DIR}/templates"

# Output configuration
export UXKIT_OUTPUT_DIR="${UXKIT_DATA_DIR}/output"
export UXKIT_REPORTS_DIR="${UXKIT_OUTPUT_DIR}/reports"
export UXKIT_EXPORTS_DIR="${UXKIT_OUTPUT_DIR}/exports"

# Integration configuration
export UXKIT_GITHUB_TOKEN="${UXKIT_GITHUB_TOKEN:-}"
export UXKIT_SLACK_TOKEN="${UXKIT_SLACK_TOKEN:-}"
export UXKIT_NOTION_TOKEN="${UXKIT_NOTION_TOKEN:-}"

# Security configuration
export UXKIT_ENCRYPTION_KEY="${UXKIT_ENCRYPTION_KEY:-}"
export UXKIT_SESSION_SECRET="${UXKIT_SESSION_SECRET:-}"

# Development configuration
export UXKIT_DEBUG="${UXKIT_DEBUG:-false}"
export UXKIT_VERBOSE="${UXKIT_VERBOSE:-false}"
export UXKIT_DRY_RUN="${UXKIT_DRY_RUN:-false}"

# Path configuration
export PATH="${UXKIT_CONFIG_DIR}/bin:${PATH}"

# Shell completion
if command -v complete >/dev/null 2>&1; then
    source "${UXKIT_CONFIG_DIR}/completions/uxkit.bash" 2>/dev/null || true
fi
