# UX-Kit: Create New Feature Script
# Creates a new feature branch and initializes spec files

param(
    [Parameter(Mandatory=$true)]
    [string]$Json
)

# Set error action preference
$ErrorActionPreference = "Stop"

try {
    # Parse JSON arguments
    $Args = $Json | ConvertFrom-Json
    $FeatureName = if ($Args.name) { $Args.name } elseif ($Args.description) { $Args.description } else { $null }
    $FeatureDescription = if ($Args.description) { $Args.description } elseif ($Args.name) { $Args.name } else { $null }

    # Validate required arguments
    if (-not $FeatureName) {
        Write-Error "Feature name or description is required"
        $ErrorResult = @{
            error = "Feature name or description is required"
        } | ConvertTo-Json
        Write-Output $ErrorResult
        exit 1
    }

    # Generate branch name from feature name
    $BranchName = "feature/" + ($FeatureName.ToLower() -replace '[^a-z0-9]', '-' -replace '--+', '-' -replace '^-|-$', '')

    # Create .specify directory if it doesn't exist
    $SpecifyDir = ".specify"
    if (-not (Test-Path "$SpecifyDir/specs")) {
        New-Item -ItemType Directory -Path "$SpecifyDir/specs" -Force | Out-Null
    }

    # Generate spec file path
    $SpecFileName = ($FeatureName.ToLower() -replace '[^a-z0-9]', '-' -replace '--+', '-' -replace '^-|-$', '') + "-spec.md"
    $SpecFile = (Resolve-Path .).Path + "/$SpecifyDir/specs/$SpecFileName"

    # Create and checkout new branch
    try {
        git checkout -b $BranchName 2>$null
    } catch {
        git checkout $BranchName
    }

    # Initialize spec file with basic structure
    $SpecContent = @"
# Feature Specification: $FeatureName

**Description**: $FeatureDescription
**Branch**: $BranchName
**Created**: $((Get-Date).ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss UTC"))
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
"@

    Set-Content -Path $SpecFile -Value $SpecContent -Encoding UTF8

    # Output JSON result
    $Result = @{
        success = $true
        BRANCH_NAME = $BranchName
        SPEC_FILE = $SpecFile
        feature_name = $FeatureName
        feature_description = $FeatureDescription
        created_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss UTC")
    }

    $Result | ConvertTo-Json
} catch {
    $ErrorResult = @{
        error = $_.Exception.Message
    } | ConvertTo-Json
    Write-Output $ErrorResult
    exit 1
}

