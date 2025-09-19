# UX-Kit CLI Demo Script

This script demonstrates the complete UX-Kit CLI workflow with real examples.

## Prerequisites

```bash
# Build the project
npm run build

# Create a demo directory
mkdir ux-kit-demo
cd ux-kit-demo
```

## Demo Script

### Step 1: Initialize UX-Kit

```bash
# Initialize UX-Kit in the demo directory
node ../dist/index.js init

# Expected output:
# Creating .uxkit directory structure...
# Creating configuration file...
# Creating memory/principles.md...
# Copying template files...
# UX-Kit initialized successfully!
```

### Step 2: Create Research Studies

```bash
# Create first study
node ../dist/index.js create "E-commerce Checkout Optimization" --description "Research study for optimizing checkout flow"

# Expected output:
# Creating study: E-commerce Checkout Optimization
# Study created successfully with ID: 001-e-commerce-checkout-optimization
# Study directory: /path/to/demo/.uxkit/studies/001-e-commerce-checkout-optimization

# Create second study
node ../dist/index.js create "Mobile App Onboarding" --description "Research study for improving mobile app onboarding experience"

# Expected output:
# Creating study: Mobile App Onboarding
# Study created successfully with ID: 002-mobile-app-onboarding
# Study directory: /path/to/demo/.uxkit/studies/002-mobile-app-onboarding
```

### Step 3: List All Studies

```bash
# List all studies
node ../dist/index.js list

# Expected output:
# Research Studies:
# 
# 001-e-commerce-checkout-optimization
#   Name: E-commerce Checkout Optimization
#   Description: Research study for optimizing checkout flow
#   Created: 2025-09-19T00:34:16.483Z
# 
# 002-mobile-app-onboarding
#   Name: Mobile App Onboarding
#   Description: Research study for improving mobile app onboarding experience
#   Created: 2025-09-19T00:34:16.483Z
```

### Step 4: Show Study Details

```bash
# Show details for the first study
node ../dist/index.js show 001-e-commerce-checkout-optimization

# Expected output:
# Study Details: E-commerce Checkout Optimization
# ID: 001-e-commerce-checkout-optimization
# Description: Research study for optimizing checkout flow
# Created: 2025-09-19T00:34:16.483Z
# 
# Files:
# - questions.md
# - sources.md
# - insights.md
# - interviews/
```

### Step 5: Generate Research Questions

```bash
# Generate questions for the first study
node ../dist/index.js questions "How do users experience our checkout flow?" --study 001-e-commerce-checkout-optimization

# Expected output:
# Questions generated successfully: .uxkit/studies/001-e-commerce-checkout-optimization/questions.md

# Generate questions for the second study
node ../dist/index.js questions "What are the main pain points in our mobile app onboarding?" --study 002-mobile-app-onboarding

# Expected output:
# Questions generated successfully: .uxkit/studies/002-mobile-app-onboarding/questions.md
```

### Step 6: View Generated Files

```bash
# View the generated questions file
cat .uxkit/studies/001-e-commerce-checkout-optimization/questions.md

# Expected output:
# # Research Questions for Study: E-commerce Checkout Optimization
# 
# **Study ID**: 001-e-commerce-checkout-optimization
# **Date**: 2025-09-19T00:34:16.483Z
# 
# ## Core Questions
# <!-- Add your research questions here -->
# 
# ## Sub-Questions
# <!-- Add sub-questions here -->
# 
# ## AI Generated Prompts
# <!-- AI-generated prompts will appear here -->

# View the directory structure
tree .uxkit

# Expected output:
# .uxkit/
# ├── config.yaml
# ├── memory/
# │   └── principles.md
# ├── templates/
# │   ├── questions-template.md
# │   ├── sources-template.md
# │   ├── interview-template.md
# │   ├── synthesis-template.md
# │   └── summarize-template.md
# └── studies/
#     ├── 001-e-commerce-checkout-optimization/
#     │   ├── study-info.json
#     │   ├── questions.md
#     │   ├── sources.md
#     │   ├── insights.md
#     │   └── interviews/
#     └── 002-mobile-app-onboarding/
#         ├── study-info.json
#         ├── questions.md
#         ├── sources.md
#         ├── insights.md
#         └── interviews/
```

### Step 7: Test Error Handling

```bash
# Try to show a non-existent study
node ../dist/index.js show 999-nonexistent

# Expected output:
# Study not found

# Try to generate questions without a study ID
node ../dist/index.js questions "Test prompt"

# Expected output:
# Usage: uxkit questions <prompt> [options]
# 
# Generate research questions for a study
# 
# Arguments:
#   prompt    Research prompt or question to generate questions for (<required>)
# 
# Options:
#   --study, -s    Study ID or name
#   --projectRoot, -p    Specify the project root directory
# 
# Examples:
#   Generate questions for a study: uxkit questions "How do users discover our product features?" --study 001-user-research
```

### Step 8: Clean Up

```bash
# Delete the first study
node ../dist/index.js delete 001-e-commerce-checkout-optimization

# Expected output:
# Study 001-e-commerce-checkout-optimization deleted successfully

# List studies to confirm deletion
node ../dist/index.js list

# Expected output:
# Research Studies:
# 
# 002-mobile-app-onboarding
#   Name: Mobile App Onboarding
#   Description: Research study for improving mobile app onboarding experience
#   Created: 2025-09-19T00:34:16.483Z

# Delete the second study
node ../dist/index.js delete 002-mobile-app-onboarding

# Expected output:
# Study 002-mobile-app-onboarding deleted successfully

# List studies to confirm all are deleted
node ../dist/index.js list

# Expected output:
# No studies found.
```

## Demo Summary

This demo showcases:

1. **Project Initialization**: Setting up UX-Kit directory structure
2. **Study Management**: Creating, listing, showing, and deleting studies
3. **Research Workflow**: Generating research questions
4. **File Generation**: Creating professional Markdown files
5. **Error Handling**: Graceful handling of invalid commands and missing data
6. **Template System**: Using Handlebars-style templates for consistent output

## Key Features Demonstrated

- ✅ **Complete CLI workflow** from initialization to cleanup
- ✅ **Study management** with proper ID generation and organization
- ✅ **Research questions generation** with template-based output
- ✅ **Professional file structure** with organized directories
- ✅ **Error handling** with helpful error messages
- ✅ **Cross-platform compatibility** (works on macOS, Linux, WSL)

## Next Steps

To extend this demo:

1. **Add more research commands**: sources, synthesize, summarize, interview
2. **Implement AI agent integration**: Connect to Cursor, Codex, or custom agents
3. **Add slash command system**: IDE integration for seamless workflow
4. **Enhance templates**: More sophisticated Handlebars templates
5. **Add validation**: Better input validation and error messages
