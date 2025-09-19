/**
 * User Guide Generator
 * 
 * Generates comprehensive user guides and tutorials for UX-Kit.
 * This includes getting started guides, tutorials, and troubleshooting information.
 */

import { IFileSystemService } from '../contracts/infrastructure-contracts';

export class UserGuideGenerator {
  constructor(private fileSystem: IFileSystemService) {}

  /**
   * Generate user guide
   */
  async generateUserGuide(projectRoot: string, outputPath: string): Promise<void> {
    const userGuidePath = `${outputPath}/user-guide`;
    await this.fileSystem.ensureDirectoryExists(userGuidePath);

    // Generate all user guide documentation
    await Promise.all([
      this.generateUserGuideReadme(userGuidePath),
      this.generateGettingStartedDoc(userGuidePath),
      this.generateTutorialsDoc(userGuidePath),
      this.generateExamplesDoc(userGuidePath),
      this.generateTroubleshootingDoc(userGuidePath)
    ]);
  }

  /**
   * Generate main user guide README
   */
  private async generateUserGuideReadme(userGuidePath: string): Promise<void> {
    const content = `# User Guide

Welcome to UX-Kit! This comprehensive user guide will help you get started with UX-Kit and master its features for your UX research workflows.

## What is UX-Kit?

UX-Kit is a lightweight TypeScript CLI toolkit for UX research inspired by GitHub's spec-kit. It provides structured research workflows through slash commands, AI agent integration, and file-based artifact management.

### Key Features

- **Spec-Driven Research**: Create structured research specifications
- **Research Planning**: Generate research plans and methodologies
- **Task Breakdown**: Create actionable research task lists
- **AI Integration**: Support AI agents in research workflows
- **File Generation**: Create research artifact files (questions.md, sources.md, etc.)
- **IDE Integration**: Provide slash commands for seamless workflow integration
- **Template System**: Structured templates for consistent research outputs

## Examples

This section provides real-world examples of using UX-Kit for various research scenarios.

## Tutorials

This section provides step-by-step tutorials for common UX-Kit tasks and workflows.

## Troubleshooting

This section helps you resolve common issues and problems with UX-Kit.

## Getting Started

New to UX-Kit? Start here:

1. **[Getting Started](./getting-started.md)** - Installation and basic setup
2. **[Tutorials](./tutorials.md)** - Step-by-step tutorials
3. **[Troubleshooting](./troubleshooting.md)** - Common issues and solutions

## Quick Start

1. **Install UX-Kit**:
   \`\`\`bash
   git clone https://github.com/khaos-studio/ux-kit.git && cd ux-kit && npm install && npm run build && npm link
   \`\`\`

2. **Initialize your project**:
   \`\`\`bash
   uxkit init
   \`\`\`

3. **Create your first study**:
   \`\`\`bash
   uxkit study create "My Research Study"
   \`\`\`

4. **Generate research questions**:
   \`\`\`bash
   uxkit research questions
   \`\`\`

## Core Concepts

### Studies
Studies are the main organizational unit in UX-Kit. Each study represents a research project with its own questions, sources, and findings.

### Templates
Templates define the structure and content of generated research artifacts. UX-Kit includes default templates that you can customize.

### Workflows
Workflows are sequences of commands that accomplish specific research tasks. Common workflows include question generation, source collection, and insight synthesis.

## Common Workflows

### Basic Research Workflow

1. **Initialize project**: \`uxkit init\`
2. **Create study**: \`uxkit study create "Study Name"\`
3. **Generate questions**: \`uxkit research questions\`
4. **Collect sources**: \`uxkit research sources\`
5. **Create summary**: \`uxkit research summarize\`
6. **Synthesize insights**: \`uxkit research synthesize\`

### Advanced Research Workflow

1. **Create multiple studies**: \`uxkit study create "Study 1"\` \`uxkit study create "Study 2"\`
2. **Generate questions for each**: \`uxkit research questions --study "Study 1"\`
3. **Collect sources**: \`uxkit research sources --study "Study 1"\`
4. **Create summaries**: \`uxkit research summarize --study "Study 1"\`
5. **Conduct interviews**: \`uxkit research interview --study "Study 1"\`
6. **Synthesize insights**: \`uxkit research synthesize --study "Study 1"\`

## Best Practices

### Study Management
- Use descriptive study names
- Add detailed descriptions
- Keep studies organized
- Regular cleanup of old studies

### Research Process
- Start with clear research questions
- Collect diverse sources
- Document findings regularly
- Synthesize insights at key milestones

### Template Customization
- Customize templates for your methodology
- Document custom templates
- Test templates with real data
- Share useful templates with team

## Getting Help

- **Documentation**: This comprehensive guide
- **Examples**: See [Examples](../examples/README.md) for real-world usage
- **API Reference**: See [API Documentation](../api/README.md) for programmatic access
- **Issues**: Report bugs or request features on GitHub
- **Community**: Join our community discussions

## What's Next?

- **[Getting Started](./getting-started.md)** - Detailed installation and setup guide
- **[Tutorials](./tutorials.md)** - Step-by-step tutorials for common tasks
- **[Troubleshooting](./troubleshooting.md)** - Solutions to common problems
- **[Examples](../examples/README.md)** - Real-world usage examples
- **[API Reference](../api/README.md)** - Programmatic API documentation

---

*Happy researching with UX-Kit!*
`;

    await this.fileSystem.writeFile(`${userGuidePath}/README.md`, content);
  }

  /**
   * Generate getting started documentation
   */
  private async generateGettingStartedDoc(userGuidePath: string): Promise<void> {
    const content = `# Getting Started

This guide will help you get up and running with UX-Kit quickly and easily.

## Prerequisites

Before installing UX-Kit, ensure you have:

- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher
- **Git**: For version control (recommended)

### Checking Your Environment

\`\`\`bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
\`\`\`

## Installation

### Global Installation (Recommended)

Install UX-Kit globally to use it from anywhere:

\`\`\`bash
git clone https://github.com/khaos-studio/ux-kit.git && cd ux-kit && npm install && npm run build && npm link
\`\`\`

### Local Installation

Install UX-Kit locally in your project:

\`\`\`bash
git clone https://github.com/khaos-studio/ux-kit.git && cd ux-kit && npm install && npm run build
\`\`\`

### Verify Installation

Check that UX-Kit is installed correctly:

\`\`\`bash
uxkit --version
\`\`\`

You should see output like:
\`\`\`
ux-kit@1.0.0
\`\`\`

## First Steps

### 1. Initialize Your Project

Navigate to your project directory and initialize UX-Kit:

\`\`\`bash
cd /path/to/your/project
uxkit init
\`\`\`

This creates the \`.uxkit/\` directory structure:

\`\`\`
.uxkit/
├── studies/           # Directory for research studies
├── templates/         # Template files
│   ├── questions-template.md
│   ├── sources-template.md
│   ├── summarize-template.md
│   ├── interview-template.md
│   └── synthesis-template.md
└── config.yaml       # Project configuration
\`\`\`

### 2. Create Your First Study

Create a new research study:

\`\`\`bash
uxkit study create "User Onboarding Research"
\`\`\`

This creates a new study with ID \`001-user-onboarding-research\` and sets up the study directory structure.

### 3. Generate Research Questions

Generate research questions for your study:

\`\`\`bash
uxkit research questions
\`\`\`

This creates a \`questions.md\` file in your study directory with structured research questions.

### 4. Explore Generated Content

Check what was created:

\`\`\`bash
# List your studies
uxkit study list

# Show study details
uxkit study show "User Onboarding Research"

# View generated questions
cat .uxkit/studies/001-user-onboarding-research/questions.md
\`\`\`

## Understanding the Structure

### Project Structure

\`\`\`
your-project/
├── .uxkit/                    # UX-Kit configuration and data
│   ├── studies/              # Research studies
│   │   └── 001-user-onboarding-research/
│   │       ├── study-config.yaml
│   │       ├── questions.md
│   │       ├── sources.md
│   │       ├── insights.md
│   │       ├── summaries/
│   │       └── interviews/
│   ├── templates/            # Template files
│   └── config.yaml          # Project configuration
└── your-project-files...     # Your existing project files
\`\`\`

### Study Structure

Each study has its own directory with:

- \`study-config.yaml\`: Study configuration and metadata
- \`questions.md\`: Research questions
- \`sources.md\`: Research sources
- \`insights.md\`: Research insights and findings
- \`summaries/\`: Research summaries
- \`interviews/\`: Interview data

## Basic Commands

### Study Management

\`\`\`bash
# Create a new study
uxkit study create "Study Name"

# List all studies
uxkit study list

# Show study details
uxkit study show "Study Name"

# Delete a study
uxkit study delete "Study Name"
\`\`\`

### Research Workflow

\`\`\`bash
# Generate research questions
uxkit research questions

# Generate sources template
uxkit research sources

# Generate research summary
uxkit research summarize

# Generate interview template
uxkit research interview

# Generate research synthesis
uxkit research synthesize
\`\`\`

### Getting Help

\`\`\`bash
# Show general help
uxkit --help

# Show command help
uxkit study --help
uxkit research --help

# Show specific command help
uxkit study create --help
\`\`\`

## Configuration

### Default Configuration

UX-Kit creates a default configuration file at \`.uxkit/config.yaml\`:

\`\`\`yaml
version: 1.0.0
templates:
  questions: questions-template.md
  sources: sources-template.md
  summarize: summarize-template.md
  interview: interview-template.md
  synthesis: synthesis-template.md
\`\`\`

### Customizing Configuration

You can customize the configuration by editing \`.uxkit/config.yaml\`:

\`\`\`yaml
version: 1.0.0
templates:
  questions: my-custom-questions-template.md
  sources: my-custom-sources-template.md
  # ... other templates
\`\`\`

## Templates

### Default Templates

UX-Kit includes default templates for:

- **Questions**: Research questions template
- **Sources**: Sources collection template
- **Summarize**: Research summary template
- **Interview**: Interview template
- **Synthesis**: Research synthesis template

### Customizing Templates

You can customize templates by editing files in \`.uxkit/templates/\`:

\`\`\`bash
# Edit questions template
nano .uxkit/templates/questions-template.md

# Edit sources template
nano .uxkit/templates/sources-template.md
\`\`\`

### Template Variables

Templates support variables like:

- \`{{studyName}}\`: Study name
- \`{{studyDescription}}\`: Study description
- \`{{studyId}}\`: Study ID
- \`{{createdAt}}\`: Creation timestamp

## Next Steps

Now that you have UX-Kit set up, you can:

1. **[Follow the Tutorials](./tutorials.md)** - Step-by-step tutorials for common tasks
2. **[Explore Examples](../examples/README.md)** - Real-world usage examples
3. **[Customize Templates](../configuration/customization.md)** - Adapt UX-Kit to your workflow
4. **[Read the API Documentation](../api/README.md)** - Programmatic access to UX-Kit

## Common Issues

### Permission Errors

If you encounter permission errors:

\`\`\`bash
# Check file permissions
ls -la .uxkit/

# Fix permissions if needed
chmod -R 755 .uxkit/
\`\`\`

### Template Not Found

If templates are missing:

\`\`\`bash
# Re-initialize the project
uxkit init --force
\`\`\`

### Command Not Found

If the \`uxkit\` command is not found:

\`\`\`bash
# Check if UX-Kit is installed
npm list -g @ux-kit/cli

# Reinstall if needed
git clone https://github.com/khaos-studio/ux-kit.git && cd ux-kit && npm install && npm run build && npm link
\`\`\`

## Getting Help

If you run into issues:

1. **Check the documentation**: This guide and other documentation
2. **Use verbose mode**: Add \`--verbose\` to commands for more details
3. **Check the logs**: Look for error messages in the output
4. **Report issues**: Create an issue on GitHub with details

## What's Next?

- **[Tutorials](./tutorials.md)** - Step-by-step tutorials
- **[Troubleshooting](./troubleshooting.md)** - Solutions to common problems
- **[Examples](../examples/README.md)** - Real-world usage examples
- **[Configuration Guide](../configuration/README.md)** - Advanced configuration options
`;

    await this.fileSystem.writeFile(`${userGuidePath}/getting-started.md`, content);
  }

  /**
   * Generate tutorials documentation
   */
  private async generateTutorialsDoc(userGuidePath: string): Promise<void> {
    const content = `# Tutorials

This section provides step-by-step tutorials for common UX-Kit tasks and workflows.

## Creating Your First Study

This tutorial walks you through creating your first research study and generating basic research artifacts.

## Setting Up Research Questions

This tutorial shows how to set up and customize research questions for your studies.

## Generating Research Artifacts

This tutorial demonstrates how to generate various research artifacts using UX-Kit.

### Prerequisites

- UX-Kit installed and initialized
- Basic understanding of UX research concepts

### Step 1: Initialize UX-Kit

First, initialize UX-Kit in your project:

\`\`\`bash
uxkit init
\`\`\`

This creates the \`.uxkit/\` directory structure and copies template files.

### Step 2: Create a Study

Create a new research study:

\`\`\`bash
uxkit study create "User Onboarding Research"
\`\`\`

This creates a study with ID \`001-user-onboarding-research\` and sets up the study directory.

### Step 3: Generate Research Questions

Generate research questions for your study:

\`\`\`bash
uxkit research questions
\`\`\`

This creates a \`questions.md\` file with structured research questions.

### Step 4: Review Generated Content

Check what was created:

\`\`\`bash
# List studies
uxkit study list

# Show study details
uxkit study show "User Onboarding Research"

# View questions
cat .uxkit/studies/001-user-onboarding-research/questions.md
\`\`\`

### Step 5: Generate Additional Artifacts

Generate more research artifacts:

\`\`\`bash
# Generate sources template
uxkit research sources

# Generate summary template
uxkit research summarize

# Generate interview template
uxkit research interview
\`\`\`

### Step 6: Review Complete Study

View the complete study structure:

\`\`\`bash
tree .uxkit/studies/001-user-onboarding-research/
\`\`\`

You should see:
\`\`\`
.uxkit/studies/001-user-onboarding-research/
├── study-config.yaml
├── questions.md
├── sources.md
├── insights.md
├── summaries/
└── interviews/
\`\`\`

## Tutorial 2: Managing Multiple Studies

This tutorial shows how to manage multiple research studies and organize your research work.

### Step 1: Create Multiple Studies

Create several studies for different research projects:

\`\`\`bash
uxkit study create "Feature Evaluation Study"
uxkit study create "User Journey Research"
uxkit study create "Competitive Analysis"
\`\`\`

### Step 2: List All Studies

View all your studies:

\`\`\`bash
uxkit study list
\`\`\`

You should see output like:
\`\`\`
ID                           Name                        Created
001-user-onboarding-research User Onboarding Research    2024-01-18
002-feature-evaluation-study Feature Evaluation Study    2024-01-18
003-user-journey-research    User Journey Research       2024-01-18
004-competitive-analysis     Competitive Analysis        2024-01-18
\`\`\`

### Step 3: Work on Specific Studies

Generate content for specific studies:

\`\`\`bash
# Generate questions for feature evaluation
uxkit research questions --study "Feature Evaluation Study"

# Generate sources for user journey research
uxkit research sources --study "User Journey Research"

# Generate summary for competitive analysis
uxkit research summarize --study "Competitive Analysis"
\`\`\`

### Step 4: Show Study Details

Get detailed information about a specific study:

\`\`\`bash
uxkit study show "Feature Evaluation Study"
\`\`\`

### Step 5: Delete Unused Studies

Remove studies that are no longer needed:

\`\`\`bash
uxkit study delete "Competitive Analysis"
\`\`\`

## Tutorial 3: Customizing Templates

This tutorial shows how to customize templates to match your research methodology.

### Step 1: View Default Templates

Examine the default templates:

\`\`\`bash
ls -la .uxkit/templates/
\`\`\`

### Step 2: Create Custom Template

Create a custom questions template:

\`\`\`bash
cp .uxkit/templates/questions-template.md .uxkit/templates/custom-questions-template.md
\`\`\`

### Step 3: Edit Custom Template

Edit the custom template to match your methodology:

\`\`\`markdown
# Custom Research Questions: {{studyName}}

## Study Information
- **Study ID**: {{studyId}}
- **Created**: {{createdAt}}
- **Company**: Your Company
- **Methodology**: Design Thinking

## Research Objectives
{{studyDescription}}

## Primary Questions
1. What are the main user goals and motivations?
2. How do users currently accomplish their tasks?
3. What are the biggest pain points in the current experience?
4. What improvements would users like to see?

## Secondary Questions
1. How do users discover and learn about features?
2. What are the most common user workflows?
3. How do users handle errors and edge cases?
4. What are the biggest usability barriers?

## Research Methods
- User interviews (5-8 participants)
- Usability testing (3-5 tasks)
- Analytics analysis (quantitative data)
- Competitive analysis (3-5 competitors)

## Success Metrics
- Task completion rate: >90%
- User satisfaction score: >4.0/5.0
- Time to complete tasks: <2 minutes
- Error rate: <5%

---
*Generated on {{createdAt}} for Your Company*
\`\`\`

### Step 4: Update Configuration

Update the configuration to use your custom template:

\`\`\`yaml
# .uxkit/config.yaml
version: 1.0.0
templates:
  questions: custom-questions-template.md
  sources: sources-template.md
  summarize: summarize-template.md
  interview: interview-template.md
  synthesis: synthesis-template.md
\`\`\`

### Step 5: Test Custom Template

Create a new study and test your custom template:

\`\`\`bash
uxkit study create "Test Custom Template"
uxkit research questions
\`\`\`

### Step 6: Review Generated Content

Check that your custom template was used:

\`\`\`bash
cat .uxkit/studies/005-test-custom-template/questions.md
\`\`\`

## Tutorial 4: Complete Research Workflow

This tutorial demonstrates a complete research workflow from questions to insights.

### Step 1: Create Study

Create a comprehensive research study:

\`\`\`bash
uxkit study create "Complete UX Research Study"
\`\`\`

### Step 2: Generate Research Questions

Start with research questions:

\`\`\`bash
uxkit research questions
\`\`\`

### Step 3: Collect Sources

Generate sources template and collect research sources:

\`\`\`bash
uxkit research sources
\`\`\`

Edit the generated \`sources.md\` file to add your research sources.

### Step 4: Create Summary

Generate a research summary:

\`\`\`bash
uxkit research summarize
\`\`\`

Edit the generated summary to document your findings.

### Step 5: Conduct Interviews

Generate interview template:

\`\`\`bash
uxkit research interview
\`\`\`

Use the template to conduct user interviews and document findings.

### Step 6: Synthesize Insights

Generate research synthesis:

\`\`\`bash
uxkit research synthesize
\`\`\`

Edit the synthesis to document key insights and recommendations.

### Step 7: Review Complete Study

View the complete study with all artifacts:

\`\`\`bash
tree .uxkit/studies/006-complete-ux-research-study/
\`\`\`

## Tutorial 5: Advanced Configuration

This tutorial shows how to configure UX-Kit for advanced use cases.

### Step 1: View Current Configuration

Check your current configuration:

\`\`\`bash
cat .uxkit/config.yaml
\`\`\`

### Step 2: Create Advanced Configuration

Create an advanced configuration:

\`\`\`yaml
# .uxkit/config.yaml
version: 1.0.0
templates:
  questions: custom-questions-template.md
  sources: custom-sources-template.md
  summarize: custom-summarize-template.md
  interview: custom-interview-template.md
  synthesis: custom-synthesis-template.md

output:
  directory: ./research-output
  format: markdown
  includeMetadata: true

formatting:
  dateFormat: YYYY-MM-DD
  timeFormat: HH:mm:ss
  includeTimestamps: true

logging:
  level: info
  verbose: false

custom:
  companyName: "Your Company"
  researchMethodology: "Design Thinking"
  outputFormat: "Research Report"
\`\`\`

### Step 3: Create Custom Templates

Create custom templates that use your configuration:

\`\`\`markdown
# Research Questions: {{studyName}}

## Company: {{companyName}}
## Methodology: {{researchMethodology}}

### Primary Research Questions
1. How do users interact with our product?
2. What are the main user pain points?
3. How can we improve user experience?

### Secondary Questions
1. What features are most important to users?
2. How do users discover new features?
3. What are the biggest usability issues?
\`\`\`

### Step 4: Test Advanced Configuration

Create a study and test your advanced configuration:

\`\`\`bash
uxkit study create "Advanced Configuration Test"
uxkit research questions
\`\`\`

### Step 5: Review Generated Content

Check that your advanced configuration was used:

\`\`\`bash
cat .uxkit/studies/007-advanced-configuration-test/questions.md
\`\`\`

## Best Practices

### Study Management
- Use descriptive study names
- Add detailed descriptions
- Keep studies organized
- Regular cleanup of old studies

### Research Process
- Start with clear research questions
- Collect diverse sources
- Document findings regularly
- Synthesize insights at key milestones

### Template Customization
- Customize templates for your methodology
- Document custom templates
- Test templates with real data
- Share useful templates with team

### Configuration
- Use version control for configuration
- Document custom configurations
- Test changes in development first
- Keep backups of working configurations

## Troubleshooting

### Common Issues

1. **Template not found**: Re-initialize with \`uxkit init --force\`
2. **Permission errors**: Check file permissions with \`ls -la .uxkit/\`
3. **Command not found**: Reinstall with \`git clone https://github.com/khaos-studio/ux-kit.git && cd ux-kit && npm install && npm run build && npm link\`
4. **Invalid configuration**: Validate YAML syntax

### Getting Help

- Use \`--verbose\` flag for detailed output
- Check the [Troubleshooting Guide](./troubleshooting.md)
- Report issues on GitHub
- Join community discussions

## Next Steps

- **[Troubleshooting](./troubleshooting.md)** - Solutions to common problems
- **[Examples](../examples/README.md)** - Real-world usage examples
- **[Configuration Guide](../configuration/README.md)** - Advanced configuration options
- **[API Documentation](../api/README.md)** - Programmatic access
`;

    await this.fileSystem.writeFile(`${userGuidePath}/tutorials.md`, content);
  }

  /**
   * Generate examples documentation
   */
  private async generateExamplesDoc(userGuidePath: string): Promise<void> {
    const content = `# Examples

This section provides real-world examples of using UX-Kit for various research scenarios.

## Example 1: E-commerce User Onboarding Research

This example shows how to conduct research on user onboarding for an e-commerce platform.

### Study Setup

\`\`\`bash
# Create study
uxkit study create "E-commerce Onboarding Research" "Research into improving the new user onboarding flow for our e-commerce platform"

# Generate research questions
uxkit research questions

# Generate sources template
uxkit research sources
\`\`\`

### Research Questions Generated

\`\`\`markdown
# Research Questions: E-commerce Onboarding Research

## Study Overview
Research into improving the new user onboarding flow for our e-commerce platform

## Research Questions

### Primary Questions
1. What are the main user pain points during onboarding?
2. How do users currently accomplish their goals?
3. What improvements would users like to see?

### Secondary Questions
1. What are the most common user workflows?
2. How do users discover features?
3. What are the biggest usability issues?

## Research Methods
- User interviews
- Usability testing
- Analytics analysis
- Competitive analysis

## Success Metrics
- User satisfaction scores
- Task completion rates
- Time to complete tasks
- Error rates
\`\`\`

### Sources Collection

\`\`\`markdown
# Research Sources: E-commerce Onboarding Research

## Source Categories

### User Research
- [x] User interviews (8 participants)
- [x] Usability testing (5 tasks)
- [ ] Surveys
- [x] Analytics data
- [x] User feedback

### Market Research
- [x] Competitive analysis (3 competitors)
- [ ] Industry reports
- [ ] Market trends
- [x] Customer support data
- [ ] Sales data

### Internal Sources
- [x] Product requirements
- [x] Design specifications
- [x] Technical documentation
- [x] Stakeholder interviews
- [x] Business objectives

## Source Details

### Source 1
- **Type**: User Interview
- **Title**: New User Onboarding Interview - Participant 1
- **URL/Location**: /interviews/participant-1.md
- **Date**: 2024-01-15
- **Key Insights**: Users struggle with account creation process
- **Relevance**: High

### Source 2
- **Type**: Analytics Data
- **Title**: Onboarding Funnel Analysis
- **URL/Location**: /analytics/onboarding-funnel.csv
- **Date**: 2024-01-10
- **Key Insights**: 40% drop-off at email verification step
- **Relevance**: High

### Source 3
- **Type**: Competitive Analysis
- **Title**: Competitor Onboarding Comparison
- **URL/Location**: /competitive/onboarding-comparison.md
- **Date**: 2024-01-12
- **Key Insights**: Competitors use social login to reduce friction
- **Relevance**: Medium
\`\`\`

## Example 2: Mobile App Feature Evaluation

This example demonstrates how to evaluate a new feature for a mobile app.

### Study Setup

\`\`\`bash
# Create study
uxkit study create "Mobile App Feature Evaluation" "Evaluate the usability and effectiveness of the new photo sharing feature"

# Generate research questions
uxkit research questions

# Generate interview template
uxkit research interview
\`\`\`

### Interview Template Generated

\`\`\`markdown
# Interview Template: Mobile App Feature Evaluation

## Study Information
- **Study ID**: 002-mobile-app-feature-evaluation
- **Created**: 2024-01-18T10:00:00Z
- **Company**: Your Company

## Interview Guide

### Introduction
- Welcome participant
- Explain study purpose
- Get consent
- Set expectations (30 minutes)

### Background Questions
1. How often do you use mobile apps for photo sharing?
2. What photo sharing apps do you currently use?
3. What do you like/dislike about current photo sharing apps?

### Feature Testing
1. Show new photo sharing feature
2. Ask participant to complete tasks:
   - Upload a photo
   - Add a caption
   - Share with friends
   - View shared photos

### Usability Questions
1. How easy was it to use this feature?
2. What was confusing or unclear?
3. What would you change about this feature?
4. How does this compare to other photo sharing apps?

### Closing Questions
1. Would you use this feature?
2. What would make you more likely to use it?
3. Any additional feedback?

## Notes Section
- Participant responses
- Observations
- Technical issues
- Follow-up questions
\`\`\`

## Example 3: B2B Software User Journey Research

This example shows how to research user journeys for B2B software.

### Study Setup

\`\`\`bash
# Create study
uxkit study create "B2B Software User Journey" "Research the complete user journey from trial to purchase for our B2B software"

# Generate research questions
uxkit research questions

# Generate synthesis template
uxkit research synthesize
\`\`\`

### Research Synthesis Generated

\`\`\`markdown
# Research Synthesis: B2B Software User Journey

## Study Information
- **Study ID**: 003-b2b-software-user-journey
- **Created**: 2024-01-18T10:00:00Z
- **Company**: Your Company

## Key Findings

### Trial Experience
- **Finding**: Users struggle with initial setup
- **Evidence**: 60% of trial users don't complete setup
- **Impact**: High - affects conversion rates
- **Recommendation**: Simplify onboarding process

### Feature Discovery
- **Finding**: Users don't discover key features
- **Evidence**: Only 20% of users try advanced features
- **Impact**: Medium - affects user engagement
- **Recommendation**: Add feature tours and tooltips

### Purchase Decision
- **Finding**: Price is the main barrier to purchase
- **Evidence**: 70% of users cite price as concern
- **Impact**: High - affects revenue
- **Recommendation**: Consider pricing tiers or free trial extension

## User Journey Map

### Stage 1: Awareness
- **Touchpoints**: Website, ads, referrals
- **Pain Points**: Unclear value proposition
- **Opportunities**: Better landing page, clearer messaging

### Stage 2: Trial
- **Touchpoints**: Sign-up, onboarding, first use
- **Pain Points**: Complex setup, lack of guidance
- **Opportunities**: Simplified onboarding, better tutorials

### Stage 3: Evaluation
- **Touchpoints**: Feature exploration, support, documentation
- **Pain Points**: Hard to find features, limited support
- **Opportunities**: Better discovery, improved support

### Stage 4: Purchase
- **Touchpoints**: Pricing page, sales team, checkout
- **Pain Points**: High price, complex pricing
- **Opportunities**: Clearer pricing, flexible options

## Recommendations

### Immediate (1-2 weeks)
1. Simplify trial onboarding process
2. Add feature discovery tooltips
3. Improve pricing page clarity

### Short-term (1-2 months)
1. Implement feature tours
2. Create better documentation
3. Add live chat support

### Long-term (3-6 months)
1. Redesign pricing strategy
2. Implement user onboarding automation
3. Create comprehensive user education program

## Success Metrics
- Trial completion rate: Target 80% (current 40%)
- Feature adoption rate: Target 50% (current 20%)
- Conversion rate: Target 15% (current 8%)
- User satisfaction: Target 4.5/5 (current 3.2/5)
\`\`\`

## Example 4: Healthcare App Usability Testing

This example demonstrates usability testing for a healthcare application.

### Study Setup

\`\`\`bash
# Create study
uxkit study create "Healthcare App Usability" "Test the usability of our healthcare app for managing patient records"

# Generate research questions
uxkit research questions

# Generate summary template
uxkit research summarize
\`\`\`

### Research Summary Generated

\`\`\`markdown
# Research Summary: Healthcare App Usability

## Study Information
- **Study ID**: 004-healthcare-app-usability
- **Created**: 2024-01-18T10:00:00Z
- **Company**: Your Company

## Executive Summary

This study evaluated the usability of our healthcare app for managing patient records. We conducted usability testing with 12 healthcare professionals over 2 weeks. The study revealed significant usability issues that impact user efficiency and satisfaction.

## Key Findings

### Critical Issues
1. **Patient Search**: 75% of users struggled to find patients quickly
2. **Record Navigation**: 60% of users had difficulty navigating between records
3. **Data Entry**: 50% of users made errors when entering patient data

### Positive Findings
1. **Overall Design**: Users appreciated the clean, modern interface
2. **Mobile Responsiveness**: App works well on tablets and phones
3. **Security Features**: Users felt confident about data security

## Detailed Results

### Task Completion Rates
- **Task 1**: Find patient record - 25% success rate
- **Task 2**: Add new patient - 67% success rate
- **Task 3**: Update patient information - 50% success rate
- **Task 4**: View patient history - 83% success rate
- **Task 5**: Generate report - 33% success rate

### User Feedback
- **Positive**: "The interface is clean and modern"
- **Negative**: "It's hard to find patients quickly"
- **Suggestions**: "Add a search by phone number option"

## Recommendations

### High Priority
1. **Improve Patient Search**: Add multiple search options (name, ID, phone)
2. **Simplify Navigation**: Reduce clicks needed to access common functions
3. **Add Data Validation**: Prevent common data entry errors

### Medium Priority
1. **Add Keyboard Shortcuts**: For power users
2. **Improve Mobile Experience**: Optimize for smaller screens
3. **Add Help System**: Contextual help and tutorials

### Low Priority
1. **Customize Interface**: Allow users to customize layout
2. **Add Reporting Features**: More comprehensive reporting options
3. **Integrate with EHR**: Connect with existing electronic health records

## Next Steps

1. **Design Improvements**: Implement high-priority recommendations
2. **User Testing**: Conduct follow-up testing with improved design
3. **Training**: Develop training materials for healthcare professionals
4. **Monitoring**: Track user behavior and satisfaction metrics

## Success Metrics
- Task completion rate: Target 90% (current 52%)
- User satisfaction: Target 4.5/5 (current 3.1/5)
- Time to complete tasks: Target 50% reduction
- Error rate: Target <5% (current 15%)
\`\`\`

## Example 5: E-learning Platform User Experience

This example shows how to research user experience for an e-learning platform.

### Study Setup

\`\`\`bash
# Create study
uxkit study create "E-learning Platform UX" "Research the user experience of our e-learning platform for students and instructors"

# Generate research questions
uxkit research questions

# Generate sources template
uxkit research sources

# Generate interview template
uxkit research interview
\`\`\`

### Research Questions Generated

\`\`\`markdown
# Research Questions: E-learning Platform UX

## Study Overview
Research the user experience of our e-learning platform for students and instructors

## Research Questions

### Student Experience
1. How do students navigate the platform?
2. What are the main pain points for students?
3. How do students interact with course content?
4. What features do students find most valuable?

### Instructor Experience
1. How do instructors create and manage courses?
2. What are the main challenges for instructors?
3. How do instructors track student progress?
4. What tools do instructors need most?

### Platform Usability
1. How intuitive is the platform interface?
2. What are the biggest usability issues?
3. How do users discover new features?
4. What improvements would users like to see?

## Research Methods
- User interviews (students and instructors)
- Usability testing
- Analytics analysis
- Survey research
- Competitive analysis

## Success Metrics
- User satisfaction scores
- Task completion rates
- Time to complete tasks
- Feature adoption rates
- User retention rates
\`\`\`

## Best Practices from Examples

### Study Planning
1. **Clear Objectives**: Define specific research goals
2. **Target Audience**: Identify key user groups
3. **Research Methods**: Choose appropriate methods for each question
4. **Timeline**: Set realistic timelines for research activities

### Data Collection
1. **Multiple Sources**: Use various data collection methods
2. **Diverse Participants**: Include different user types
3. **Realistic Tasks**: Test with actual use cases
4. **Documentation**: Record all findings and observations

### Analysis and Synthesis
1. **Pattern Recognition**: Look for common themes
2. **Prioritization**: Focus on high-impact issues
3. **Actionable Insights**: Provide specific recommendations
4. **Success Metrics**: Define measurable outcomes

### Implementation
1. **Iterative Approach**: Test improvements incrementally
2. **User Feedback**: Continuously gather user input
3. **Monitoring**: Track key metrics over time
4. **Documentation**: Maintain research records

## Common Patterns

### User Onboarding
- Users struggle with initial setup
- Clear guidance and tutorials are essential
- Progressive disclosure helps reduce complexity

### Feature Discovery
- Users don't discover advanced features
- In-app guidance and tooltips improve discovery
- Regular feature announcements help

### Navigation
- Users prefer simple, intuitive navigation
- Breadcrumbs and clear labels are important
- Search functionality is highly valued

### Mobile Experience
- Mobile users have different needs
- Touch-friendly interfaces are essential
- Offline functionality is often needed

## Tools and Techniques

### Research Tools
- **Interviews**: Zoom, Teams, or in-person
- **Usability Testing**: UserTesting, Maze, or in-house
- **Analytics**: Google Analytics, Mixpanel, or custom
- **Surveys**: SurveyMonkey, Typeform, or Google Forms

### Analysis Tools
- **Data Analysis**: Excel, Google Sheets, or R
- **Visualization**: Tableau, Power BI, or D3.js
- **Collaboration**: Miro, Figma, or whiteboards
- **Documentation**: Notion, Confluence, or Google Docs

### Implementation Tools
- **Prototyping**: Figma, Sketch, or Adobe XD
- **Development**: React, Vue, or Angular
- **Testing**: Jest, Cypress, or Playwright
- **Monitoring**: Hotjar, FullStory, or LogRocket

## Conclusion

These examples demonstrate how UX-Kit can be used for various research scenarios. The key is to:

1. **Start with clear objectives**
2. **Use appropriate research methods**
3. **Collect diverse data sources**
4. **Analyze findings systematically**
5. **Provide actionable recommendations**
6. **Measure success over time**

By following these patterns and using UX-Kit's structured approach, you can conduct effective UX research that drives meaningful improvements to your products and services.

---

*For more examples and detailed guidance, see the [Tutorials](./tutorials.md) and [API Documentation](../api/README.md).*
`;

    await this.fileSystem.writeFile(`${userGuidePath}/examples.md`, content);
  }

  /**
   * Generate troubleshooting documentation
   */
  private async generateTroubleshootingDoc(userGuidePath: string): Promise<void> {
    const content = `# Troubleshooting

This guide helps you resolve common issues and problems with UX-Kit.

## Common Issues

### Installation Issues

#### Command Not Found

**Problem**: The \`uxkit\` command is not found.

**Solutions**:
1. **Check installation**:
   \`\`\`bash
   npm list -g @ux-kit/cli
   \`\`\`

2. **Reinstall globally**:
   \`\`\`bash
   git clone https://github.com/khaos-studio/ux-kit.git && cd ux-kit && npm install && npm run build && npm link
   \`\`\`

3. **Check PATH**:
   \`\`\`bash
   echo $PATH
   npm config get prefix
   \`\`\`

4. **Use npx** (if installed locally):
   \`\`\`bash
   npx @ux-kit/cli --version
   \`\`\`

#### Permission Errors During Installation

**Problem**: Permission errors when installing globally.

**Solutions**:
1. **Use sudo** (not recommended):
   \`\`\`bash
   sudo git clone https://github.com/khaos-studio/ux-kit.git && cd ux-kit && npm install && npm run build && npm link
   \`\`\`

2. **Change npm prefix** (recommended):
   \`\`\`bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   git clone https://github.com/khaos-studio/ux-kit.git && cd ux-kit && npm install && npm run build && npm link
   \`\`\`

3. **Use nvm** (recommended):
   \`\`\`bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install node
   nvm use node
   git clone https://github.com/khaos-studio/ux-kit.git && cd ux-kit && npm install && npm run build && npm link
   \`\`\`

### Initialization Issues

#### Directory Already Exists

**Problem**: \`.uxkit/\` directory already exists.

**Solutions**:
1. **Use force flag**:
   \`\`\`bash
   uxkit init --force
   \`\`\`

2. **Remove existing directory**:
   \`\`\`bash
   rm -rf .uxkit
   uxkit init
   \`\`\`

3. **Backup and reinitialize**:
   \`\`\`bash
   mv .uxkit .uxkit.backup
   uxkit init
   \`\`\`

#### Permission Errors

**Problem**: Permission errors when creating directories.

**Solutions**:
1. **Check permissions**:
   \`\`\`bash
   ls -la
   \`\`\`

2. **Fix permissions**:
   \`\`\`bash
   chmod 755 .
   \`\`\`

3. **Use different directory**:
   \`\`\`bash
   cd ~/Documents
   uxkit init
   \`\`\`

### Study Management Issues

#### Study Not Found

**Problem**: Study not found when using study commands.

**Solutions**:
1. **List all studies**:
   \`\`\`bash
   uxkit study list
   \`\`\`

2. **Use exact ID or name**:
   \`\`\`bash
   uxkit study show "001-user-onboarding-research"
   \`\`\`

3. **Check study directory**:
   \`\`\`bash
   ls -la .uxkit/studies/
   \`\`\`

#### Study Creation Fails

**Problem**: Study creation fails with errors.

**Solutions**:
1. **Check project initialization**:
   \`\`\`bash
   ls -la .uxkit/
   \`\`\`

2. **Reinitialize project**:
   \`\`\`bash
   uxkit init --force
   \`\`\`

3. **Check disk space**:
   \`\`\`bash
   df -h
   \`\`\`

4. **Use verbose mode**:
   \`\`\`bash
   uxkit study create "Test Study" --verbose
   \`\`\`

### Template Issues

#### Template Not Found

**Problem**: Template files are missing or not found.

**Solutions**:
1. **Check template directory**:
   \`\`\`bash
   ls -la .uxkit/templates/
   \`\`\`

2. **Reinitialize templates**:
   \`\`\`bash
   uxkit init --force
   \`\`\`

3. **Check configuration**:
   \`\`\`bash
   cat .uxkit/config.yaml
   \`\`\`

#### Template Rendering Errors

**Problem**: Templates fail to render or produce errors.

**Solutions**:
1. **Check template syntax**:
   \`\`\`bash
   cat .uxkit/templates/questions-template.md
   \`\`\`

2. **Validate YAML configuration**:
   \`\`\`bash
   python -c "import yaml; yaml.safe_load(open('.uxkit/config.yaml'))"
   \`\`\`

3. **Use default templates**:
   \`\`\`bash
   uxkit init --force
   \`\`\`

### Configuration Issues

#### Invalid Configuration

**Problem**: Configuration file has errors or invalid values.

**Solutions**:
1. **Validate YAML syntax**:
   \`\`\`bash
   python -c "import yaml; yaml.safe_load(open('.uxkit/config.yaml'))"
   \`\`\`

2. **Reset to defaults**:
   \`\`\`bash
   rm .uxkit/config.yaml
   uxkit init
   \`\`\`

3. **Check configuration format**:
   \`\`\`bash
   cat .uxkit/config.yaml
   \`\`\`

#### Configuration Not Loading

**Problem**: Configuration file is not being loaded.

**Solutions**:
1. **Check file path**:
   \`\`\`bash
   ls -la .uxkit/config.yaml
   \`\`\`

2. **Check file permissions**:
   \`\`\`bash
   chmod 644 .uxkit/config.yaml
   \`\`\`

3. **Use absolute path**:
   \`\`\`bash
   export UXKIT_CONFIG_PATH="/absolute/path/to/config.yaml"
   \`\`\`

### File System Issues

#### File Permission Errors

**Problem**: Permission errors when reading or writing files.

**Solutions**:
1. **Check file permissions**:
   \`\`\`bash
   ls -la .uxkit/
   \`\`\`

2. **Fix permissions**:
   \`\`\`bash
   chmod -R 755 .uxkit/
   \`\`\`

3. **Check ownership**:
   \`\`\`bash
   ls -la .uxkit/
   chown -R $USER:$USER .uxkit/
   \`\`\`

#### Disk Space Issues

**Problem**: Not enough disk space for operations.

**Solutions**:
1. **Check disk space**:
   \`\`\`bash
   df -h
   \`\`\`

2. **Clean up old studies**:
   \`\`\`bash
   uxkit study list
   uxkit study delete "Old Study"
   \`\`\`

3. **Free up space**:
   \`\`\`bash
   # Remove old files
   find .uxkit/studies/ -name "*.md" -mtime +30 -delete
   \`\`\`

### Command Issues

#### Command Hangs or Freezes

**Problem**: Commands hang or freeze without completing.

**Solutions**:
1. **Use verbose mode**:
   \`\`\`bash
   uxkit study create "Test" --verbose
   \`\`\`

2. **Check for locks**:
   \`\`\`bash
   lsof .uxkit/
   \`\`\`

3. **Kill hanging processes**:
   \`\`\`bash
   pkill -f uxkit
   \`\`\`

4. **Restart terminal**:
   \`\`\`bash
   # Close and reopen terminal
   \`\`\`

#### Command Returns Errors

**Problem**: Commands return unexpected errors.

**Solutions**:
1. **Check error messages**:
   \`\`\`bash
   uxkit study create "Test" 2>&1
   \`\`\`

2. **Use verbose mode**:
   \`\`\`bash
   uxkit study create "Test" --verbose
   \`\`\`

3. **Check logs**:
   \`\`\`bash
   # Look for log files
   find . -name "*.log" -type f
   \`\`\`

## Debugging

### Verbose Mode

Use verbose mode to get detailed output:

\`\`\`bash
uxkit init --verbose
uxkit study create "Test" --verbose
uxkit research questions --verbose
\`\`\`

### Environment Variables

Set environment variables for debugging:

\`\`\`bash
export UXKIT_VERBOSE=true
export UXKIT_DEBUG=true
uxkit study create "Test"
\`\`\`

### Log Files

Check for log files:

\`\`\`bash
# Look for log files
find . -name "*.log" -type f

# Check system logs
tail -f /var/log/system.log | grep uxkit
\`\`\`

### Network Issues

If you're having network-related issues:

\`\`\`bash
# Check internet connection
ping google.com

# Check npm registry
npm ping

# Clear npm cache
npm cache clean --force
\`\`\`

## Getting Help

### Self-Help

1. **Check documentation**: This guide and other documentation
2. **Use help commands**: \`uxkit --help\`, \`uxkit study --help\`
3. **Search issues**: Look for similar issues on GitHub
4. **Check logs**: Look for error messages and logs

### Community Help

1. **GitHub Issues**: Report bugs and request features
2. **Community Discussions**: Ask questions and share solutions
3. **Stack Overflow**: Search for UX-Kit related questions
4. **Discord/Slack**: Join community channels

### Professional Support

1. **Enterprise Support**: Contact for enterprise support
2. **Consulting**: Get help with implementation
3. **Training**: Learn advanced usage patterns

## Reporting Issues

When reporting issues, include:

1. **UX-Kit version**: \`uxkit --version\`
2. **Node.js version**: \`node --version\`
3. **Operating system**: \`uname -a\`
4. **Error messages**: Full error output
5. **Steps to reproduce**: Detailed steps
6. **Expected behavior**: What should happen
7. **Actual behavior**: What actually happens

### Issue Template

\`\`\`markdown
## Bug Report

### Environment
- UX-Kit version: 1.0.0
- Node.js version: 16.14.0
- Operating system: macOS 12.0
- Shell: zsh 5.8

### Description
Brief description of the issue.

### Steps to Reproduce
1. Run \`uxkit init\`
2. Run \`uxkit study create "Test"\`
3. See error

### Expected Behavior
Study should be created successfully.

### Actual Behavior
Error: "Study creation failed"

### Error Messages
\`\`\`
Error: Study creation failed
    at StudyService.createStudy (/path/to/StudyService.ts:22:15)
\`\`\`

### Additional Context
Any additional context about the issue.
\`\`\`

## Prevention

### Best Practices

1. **Keep UX-Kit updated**: Regularly update to latest version
2. **Backup important data**: Keep backups of important studies
3. **Use version control**: Commit configuration and templates
4. **Test changes**: Test configuration changes in development
5. **Monitor disk space**: Keep sufficient disk space available

### Regular Maintenance

1. **Clean up old studies**: Remove studies that are no longer needed
2. **Update templates**: Keep templates up to date
3. **Check configuration**: Validate configuration regularly
4. **Monitor logs**: Check for errors and warnings
5. **Update dependencies**: Keep Node.js and npm updated

## Recovery

### Data Recovery

If you lose important data:

1. **Check backups**: Look for backup files
2. **Check version control**: Look for committed changes
3. **Check trash**: Look in system trash
4. **Use file recovery tools**: Use tools like PhotoRec, TestDisk
5. **Contact support**: Get professional help if needed

### Configuration Recovery

If you lose configuration:

1. **Reset to defaults**: \`uxkit init --force\`
2. **Restore from backup**: Restore from backup files
3. **Recreate manually**: Recreate configuration from documentation
4. **Use examples**: Use configuration examples as templates

---

*For additional help, check the [User Guide](./README.md) or [Examples](../examples/README.md).*
`;

    await this.fileSystem.writeFile(`${userGuidePath}/troubleshooting.md`, content);
  }
}
