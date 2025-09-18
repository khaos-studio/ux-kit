# Implementation Plan Template

## Execution Flow (main)

This template provides a structured approach to implementation planning. Execute the following steps in order:

### Step 1: Initialize Planning Context
- Set Input path to the feature specification
- Load constitutional requirements
- Initialize progress tracking

### Step 2: Phase 0 - Research & Analysis
- Analyze feature requirements
- Identify technical constraints
- Research best practices
- Generate: `research.md`

### Step 3: Phase 1 - Design & Architecture
- Design data models
- Define contracts and interfaces
- Create quickstart guide
- Generate: `data-model.md`, `contracts/`, `quickstart.md`

### Step 4: Phase 2 - Implementation Planning
- Break down into tasks
- Estimate effort
- Define dependencies
- Generate: `tasks.md`

### Step 5: Progress Tracking
- Update completion status
- Verify all artifacts generated
- Check for errors

## Error Handling

- If any step fails, log error and continue
- Mark phase as ERROR in progress tracking
- Provide clear error messages

## Gate Checks

- Verify all required files exist before proceeding
- Check constitutional compliance
- Validate artifact completeness

## Progress Tracking

```
Phase 0: Research & Analysis - [PENDING/IN_PROGRESS/COMPLETE/ERROR]
Phase 1: Design & Architecture - [PENDING/IN_PROGRESS/COMPLETE/ERROR]
Phase 2: Implementation Planning - [PENDING/IN_PROGRESS/COMPLETE/ERROR]
```

## Technical Context

Incorporate user-provided details from arguments into technical context for planning decisions.

## Artifact Generation

All artifacts should be generated in the specified specs directory with proper formatting and comprehensive content.