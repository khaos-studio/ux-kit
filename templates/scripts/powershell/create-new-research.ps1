# UX-Kit: Create New Research Script
# Creates a new research branch and initializes research files

param(
    [Parameter(Mandatory=$true)]
    [string]$Json
)

# Set error action preference
$ErrorActionPreference = "Stop"

try {
    # Parse JSON arguments
    $Args = $Json | ConvertFrom-Json
    $ResearchName = $Args.name
    $ResearchType = if ($Args.type) { $Args.type } else { "general" }
    $StudyId = if ($Args.study) { $Args.study } else { $null }

    # Validate required arguments
    if (-not $ResearchName) {
        Write-Error "Research name is required"
        $ErrorResult = @{
            error = "Research name is required"
        } | ConvertTo-Json
        Write-Output $ErrorResult
        exit 1
    }

    # Generate branch name
    $BranchName = "research/" + ($ResearchName.ToLower() -replace '[^a-z0-9]', '-' -replace '--+', '-' -replace '^-|-$', '')

    # Create research directory if it doesn't exist
    $ResearchDir = if ($StudyId) { ".uxkit/studies/$StudyId" } else { ".uxkit/studies/default" }
    if (-not (Test-Path $ResearchDir)) {
        New-Item -ItemType Directory -Path $ResearchDir -Force | Out-Null
    }

    # Generate spec file path
    $SpecFile = (Resolve-Path .).Path + "/$ResearchDir/research-spec.md"

    # Create and checkout new branch
    try {
        git checkout -b $BranchName 2>$null
    } catch {
        git checkout $BranchName
    }

    # Initialize spec file
    $SpecContent = @"
# Research Specification: $ResearchName

**Type**: $ResearchType
**Study ID**: $(if ($StudyId) { $StudyId } else { "default" })
**Branch**: $BranchName
**Created**: $((Get-Date).ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss UTC"))

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
"@

    Set-Content -Path $SpecFile -Value $SpecContent -Encoding UTF8

    # Output JSON result
    $Result = @{
        success = $true
        BRANCH_NAME = $BranchName
        SPEC_FILE = $SpecFile
        research_name = $ResearchName
        research_type = $ResearchType
        study_id = if ($StudyId) { $StudyId } else { "default" }
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

