"use strict";
/**
 * Configuration Documentation Generator
 *
 * Generates comprehensive documentation for UX-Kit configuration options.
 * This includes default configuration, customization options, and environment variables.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationDocumentationGenerator = void 0;
class ConfigurationDocumentationGenerator {
    constructor(fileSystem) {
        this.fileSystem = fileSystem;
    }
    /**
     * Generate configuration documentation
     */
    async generateConfigurationDocumentation(projectRoot, outputPath) {
        const configPath = `${outputPath}/configuration`;
        await this.fileSystem.ensureDirectoryExists(configPath);
        // Generate all configuration documentation
        await Promise.all([
            this.generateConfigurationReadme(configPath),
            this.generateDefaultConfigDoc(projectRoot, configPath),
            this.generateCustomizationDoc(configPath)
        ]);
    }
    /**
     * Generate main configuration README
     */
    async generateConfigurationReadme(configPath) {
        const content = `# Configuration Guide

UX-Kit provides flexible configuration options to customize your research workflows and templates.

## Configuration Files

UX-Kit uses the following configuration files:

- **Project Configuration**: \`.uxkit/config.yaml\` - Project-specific settings
- **Default Configuration**: Built-in defaults for all settings
- **Template Configuration**: Template-specific settings in template files

## Quick Start

1. **Initialize project**: \`uxkit init\` creates default configuration
2. **Customize settings**: Edit \`.uxkit/config.yaml\` as needed
3. **Override templates**: Modify files in \`.uxkit/templates/\`

## Configuration Sections

### Project Settings
- **Version**: UX-Kit version compatibility
- **Templates**: Template file mappings
- **Output**: Output directory settings
- **Formatting**: File formatting options

### Template Settings
- **Questions**: Research questions template configuration
- **Sources**: Sources collection template settings
- **Summaries**: Summary generation options
- **Interviews**: Interview template configuration
- **Synthesis**: Insight synthesis settings

### Environment Variables
- **UXKIT_CONFIG_PATH**: Custom configuration file path
- **UXKIT_TEMPLATES_PATH**: Custom templates directory
- **UXKIT_OUTPUT_PATH**: Default output directory
- **UXKIT_VERBOSE**: Enable verbose logging

## Default Configuration

See [Default Configuration](./default-config.md) for complete default settings.

## Customization

See [Customization Guide](./customization.md) for advanced configuration options.

## Environment Variables

UX-Kit supports several environment variables for configuration:

### UXKIT_CONFIG_PATH
Specify a custom configuration file path.

\`\`\`bash
export UXKIT_CONFIG_PATH="/path/to/custom/config.yaml"
uxkit init
\`\`\`

### UXKIT_TEMPLATES_PATH
Specify a custom templates directory.

\`\`\`bash
export UXKIT_TEMPLATES_PATH="/path/to/custom/templates"
uxkit init
\`\`\`

### UXKIT_OUTPUT_PATH
Set the default output directory for generated files.

\`\`\`bash
export UXKIT_OUTPUT_PATH="/path/to/output"
uxkit research questions
\`\`\`

### UXKIT_VERBOSE
Enable verbose logging for debugging.

\`\`\`bash
export UXKIT_VERBOSE="true"
uxkit study create "My Study"
\`\`\`

## Configuration Precedence

Configuration values are resolved in the following order (highest to lowest priority):

1. **Command-line options**: \`--config\`, \`--verbose\`, etc.
2. **Environment variables**: \`UXKIT_*\` variables
3. **Project configuration**: \`.uxkit/config.yaml\`
4. **Default configuration**: Built-in defaults

## Examples

### Basic Configuration

\`\`\`yaml
# .uxkit/config.yaml
version: 1.0.0
templates:
  questions: questions-template.md
  sources: sources-template.md
  summarize: summarize-template.md
  interview: interview-template.md
  synthesis: synthesis-template.md
\`\`\`

### Advanced Configuration

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
\`\`\`

## Validation

UX-Kit validates configuration files and provides helpful error messages:

- **Invalid YAML**: Syntax errors in configuration files
- **Missing required fields**: Required configuration options
- **Invalid values**: Out-of-range or invalid configuration values
- **File not found**: Missing template or configuration files

## Troubleshooting

### Configuration Not Loading

Check file path and permissions:

\`\`\`bash
# Check if config file exists
ls -la .uxkit/config.yaml

# Check file permissions
chmod 644 .uxkit/config.yaml
\`\`\`

### Invalid Configuration

Validate YAML syntax:

\`\`\`bash
# Test YAML syntax
python -c "import yaml; yaml.safe_load(open('.uxkit/config.yaml'))"
\`\`\`

### Template Not Found

Ensure template files exist:

\`\`\`bash
# Check template files
ls -la .uxkit/templates/

# Re-initialize if missing
uxkit init --force
\`\`\`

## Migration

When upgrading UX-Kit versions, configuration files may need updates:

1. **Backup configuration**: Copy \`.uxkit/config.yaml\` to a safe location
2. **Check changelog**: Review breaking changes in new version
3. **Update configuration**: Modify configuration as needed
4. **Test functionality**: Verify all features work correctly

## Best Practices

1. **Version control**: Commit configuration files to version control
2. **Documentation**: Document custom configurations
3. **Testing**: Test configuration changes in development first
4. **Backup**: Keep backups of working configurations
5. **Validation**: Validate configuration before deployment
`;
        await this.fileSystem.writeFile(`${configPath}/README.md`, content);
    }
    /**
     * Generate default configuration documentation
     */
    async generateDefaultConfigDoc(projectRoot, configPath) {
        const content = `# Default Configuration

This document describes the default configuration values used by UX-Kit.

## Configuration Structure

\`\`\`yaml
# .uxkit/config.yaml
version: 1.0.0
templates:
  questions: questions-template.md
  sources: sources-template.md
  summarize: summarize-template.md
  interview: interview-template.md
  synthesis: synthesis-template.md
output:
  directory: ./.uxkit/studies
  format: markdown
  includeMetadata: true
formatting:
  dateFormat: YYYY-MM-DD
  timeFormat: HH:mm:ss
  includeTimestamps: true
logging:
  level: info
  verbose: false
\`\`\`

## Configuration Options

### version
**Type**: String  
**Default**: \`1.0.0\`  
**Description**: UX-Kit configuration version for compatibility checking.

### templates
**Type**: Object  
**Description**: Template file mappings for different research artifacts.

#### templates.questions
**Type**: String  
**Default**: \`questions-template.md\`  
**Description**: Template file for research questions generation.

#### templates.sources
**Type**: String  
**Default**: \`sources-template.md\`  
**Description**: Template file for sources collection.

#### templates.summarize
**Type**: String  
**Default**: \`summarize-template.md\`  
**Description**: Template file for research summaries.

#### templates.interview
**Type**: String  
**Default**: \`interview-template.md\`  
**Description**: Template file for user interviews.

#### templates.synthesis
**Type**: String  
**Default**: \`synthesis-template.md\`  
**Description**: Template file for research synthesis.

### output
**Type**: Object  
**Description**: Output directory and formatting settings.

#### output.directory
**Type**: String  
**Default**: \`./.uxkit/studies\`  
**Description**: Default directory for generated research artifacts.

#### output.format
**Type**: String  
**Default**: \`markdown\`  
**Description**: Output format for generated files. Supported: \`markdown\`, \`html\`, \`json\`.

#### output.includeMetadata
**Type**: Boolean  
**Default**: \`true\`  
**Description**: Include metadata headers in generated files.

### formatting
**Type**: Object  
**Description**: Date and time formatting options.

#### formatting.dateFormat
**Type**: String  
**Default**: \`YYYY-MM-DD\`  
**Description**: Date format for timestamps in generated files.

#### formatting.timeFormat
**Type**: String  
**Default**: \`HH:mm:ss\`  
**Description**: Time format for timestamps in generated files.

#### formatting.includeTimestamps
**Type**: Boolean  
**Default**: \`true\`  
**Description**: Include timestamps in generated file names and content.

### logging
**Type**: Object  
**Description**: Logging and debugging options.

#### logging.level
**Type**: String  
**Default**: \`info\`  
**Description**: Logging level. Supported: \`debug\`, \`info\`, \`warn\`, \`error\`.

#### logging.verbose
**Type**: Boolean  
**Default**: \`false\`  
**Description**: Enable verbose output for debugging.

## Version

**Type**: String  
**Default**: \`1.0.0\`  
**Description**: UX-Kit configuration version for compatibility checking.

## Templates

Each template file can include configuration comments:

\`\`\`markdown
<!--
Template: questions-template.md
Version: 1.0.0
Description: Research questions template
Variables:
  - studyName: Name of the research study
  - studyDescription: Description of the study
  - createdAt: Creation timestamp
-->

# Research Questions: {{studyName}}

## Study Overview
{{studyDescription}}

## Research Questions

### Primary Questions
1. What are the main user pain points?
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

---
*Generated on {{createdAt}}*
\`\`\`

## Environment Variables

UX-Kit also supports configuration through environment variables:

### UXKIT_CONFIG_PATH
**Default**: \`.uxkit/config.yaml\`  
**Description**: Path to configuration file.

### UXKIT_TEMPLATES_PATH
**Default**: \`.uxkit/templates\`  
**Description**: Path to templates directory.

### UXKIT_OUTPUT_PATH
**Default**: \`.uxkit/studies\`  
**Description**: Default output directory.

### UXKIT_VERBOSE
**Default**: \`false\`  
**Description**: Enable verbose logging.

## Configuration Validation

UX-Kit validates configuration files and provides helpful error messages:

- **Required fields**: Ensures all required configuration options are present
- **Type validation**: Validates data types for configuration values
- **Range validation**: Checks that numeric values are within valid ranges
- **File existence**: Verifies that referenced template files exist
- **YAML syntax**: Validates YAML syntax and structure

## Examples

### Minimal Configuration

\`\`\`yaml
version: 1.0.0
templates:
  questions: questions-template.md
\`\`\`

### Full Configuration

\`\`\`yaml
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
  level: debug
  verbose: true
\`\`\`

## Migration Guide

When upgrading UX-Kit versions, you may need to update your configuration:

1. **Check version compatibility**: Review the changelog for breaking changes
2. **Backup configuration**: Save your current configuration file
3. **Update version**: Change the version number in your configuration
4. **Test functionality**: Verify that all features work with the new version
5. **Update templates**: Update custom templates if needed

## Troubleshooting

### Configuration Not Loading

\`\`\`bash
# Check file exists and is readable
ls -la .uxkit/config.yaml

# Validate YAML syntax
python -c "import yaml; yaml.safe_load(open('.uxkit/config.yaml'))"
\`\`\`

### Invalid Configuration Values

\`\`\`bash
# Check configuration with verbose output
UXKIT_VERBOSE=true uxkit init

# Validate specific configuration options
uxkit config validate
\`\`\`

### Template Files Missing

\`\`\`bash
# Check template files
ls -la .uxkit/templates/

# Re-initialize templates
uxkit init --force
\`\`\`
`;
        await this.fileSystem.writeFile(`${configPath}/default-config.md`, content);
    }
    /**
     * Generate customization documentation
     */
    async generateCustomizationDoc(configPath) {
        const content = `# Customization Guide

This guide explains how to customize UX-Kit for your specific research needs and workflows.

## Overview

UX-Kit provides several levels of customization:

1. **Configuration**: Modify settings and behavior
2. **Templates**: Customize generated content
3. **Workflows**: Adapt research processes
4. **Integration**: Connect with external tools

## Configuration Customization

### Basic Configuration

Start with the default configuration and modify as needed:

\`\`\`yaml
# .uxkit/config.yaml
version: 1.0.0
templates:
  questions: my-questions-template.md
  sources: my-sources-template.md
  summarize: my-summarize-template.md
  interview: my-interview-template.md
  synthesis: my-synthesis-template.md
\`\`\`

### Advanced Configuration

For more control, customize additional settings:

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

## Template Customization

### Creating Custom Templates

1. **Copy default template**:
   \`\`\`bash
   cp .uxkit/templates/questions-template.md .uxkit/templates/my-questions-template.md
   \`\`\`

2. **Edit template content**:
   \`\`\`markdown
   # Custom Research Questions: {{studyName}}
   
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

3. **Update configuration**:
   \`\`\`yaml
   templates:
     questions: my-questions-template.md
   \`\`\`

### Template Variables

Templates support the following variables:

- \`{{studyName}}\`: Name of the research study
- \`{{studyDescription}}\`: Description of the study
- \`{{studyId}}\`: Unique study identifier
- \`{{createdAt}}\`: Creation timestamp
- \`{{updatedAt}}\`: Last update timestamp
- \`{{companyName}}\`: Company name (from custom config)
- \`{{researchMethodology}}\`: Research methodology (from custom config)

### Template Examples

#### Custom Questions Template

\`\`\`markdown
# Research Questions: {{studyName}}

## Study Information
- **Study ID**: {{studyId}}
- **Created**: {{createdAt}}
- **Company**: {{companyName}}
- **Methodology**: {{researchMethodology}}

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
*Generated on {{createdAt}} for {{companyName}}*
\`\`\`

#### Custom Sources Template

\`\`\`markdown
# Research Sources: {{studyName}}

## Study Information
- **Study ID**: {{studyId}}
- **Created**: {{createdAt}}
- **Company**: {{companyName}}

## Source Categories

### User Research
- [ ] User interviews
- [ ] Usability testing
- [ ] Surveys
- [ ] Analytics data
- [ ] User feedback

### Market Research
- [ ] Competitive analysis
- [ ] Industry reports
- [ ] Market trends
- [ ] Customer support data
- [ ] Sales data

### Internal Sources
- [ ] Product requirements
- [ ] Design specifications
- [ ] Technical documentation
- [ ] Stakeholder interviews
- [ ] Business objectives

## Source Details

### Source 1
- **Type**: [Interview/Analytics/Report/etc.]
- **Title**: 
- **URL/Location**: 
- **Date**: 
- **Key Insights**: 
- **Relevance**: [High/Medium/Low]

### Source 2
- **Type**: 
- **Title**: 
- **URL/Location**: 
- **Date**: 
- **Key Insights**: 
- **Relevance**: 

### Source 3
- **Type**: 
- **Title**: 
- **URL/Location**: 
- **Date**: 
- **Key Insights**: 
- **Relevance**: 

## Source Quality Assessment
- **Reliability**: [High/Medium/Low]
- **Recency**: [Current/Recent/Outdated]
- **Relevance**: [High/Medium/Low]
- **Completeness**: [Complete/Partial/Minimal]

---
*Generated on {{createdAt}} for {{companyName}}*
\`\`\`

## Workflow Customization

### Custom Research Workflows

Create custom workflows by combining commands:

\`\`\`bash
#!/bin/bash
# custom-research-workflow.sh

# Create study
uxkit study create "$1"

# Generate questions
uxkit research questions

# Collect sources
uxkit research sources

# Create initial summary
uxkit research summarize

# Generate interview template
uxkit research interview

echo "Research workflow completed for: $1"
\`\`\`

### Integration Scripts

Create scripts to integrate with external tools:

\`\`\`bash
#!/bin/bash
# export-to-confluence.sh

STUDY_ID=$1
CONFLUENCE_SPACE=$2

# Generate research summary
uxkit research summarize --study "$STUDY_ID"

# Convert to Confluence format
pandoc .uxkit/studies/$STUDY_ID/summaries/*.md -t confluence -o research-summary.txt

# Upload to Confluence
curl -X POST "https://your-domain.atlassian.net/wiki/rest/api/content" \\
  -H "Authorization: Bearer $CONFLUENCE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d @research-summary.txt
\`\`\`

## Environment Customization

### Development Environment

\`\`\`bash
# .env.development
UXKIT_CONFIG_PATH=./config/development.yaml
UXKIT_TEMPLATES_PATH=./templates/development
UXKIT_OUTPUT_PATH=./output/development
UXKIT_VERBOSE=true
\`\`\`

### Production Environment

\`\`\`bash
# .env.production
UXKIT_CONFIG_PATH=./config/production.yaml
UXKIT_TEMPLATES_PATH=./templates/production
UXKIT_OUTPUT_PATH=./output/production
UXKIT_VERBOSE=false
\`\`\`

## Best Practices

### Template Design

1. **Keep it simple**: Use clear, concise language
2. **Be specific**: Include specific examples and guidance
3. **Make it actionable**: Provide clear next steps
4. **Include context**: Add relevant background information
5. **Test thoroughly**: Validate templates with real data

### Configuration Management

1. **Version control**: Commit configuration files
2. **Documentation**: Document custom configurations
3. **Testing**: Test changes in development first
4. **Backup**: Keep backups of working configurations
5. **Validation**: Validate configuration before deployment

### Workflow Design

1. **Start simple**: Begin with basic workflows
2. **Iterate**: Improve workflows based on usage
3. **Document**: Document custom workflows
4. **Share**: Share useful workflows with team
5. **Maintain**: Keep workflows up to date

## Troubleshooting

### Template Issues

\`\`\`bash
# Check template syntax
markdownlint .uxkit/templates/*.md

# Validate template variables
uxkit template validate

# Test template rendering
uxkit template test questions-template.md
\`\`\`

### Configuration Issues

\`\`\`bash
# Validate configuration
uxkit config validate

# Check configuration loading
UXKIT_VERBOSE=true uxkit init

# Reset to defaults
uxkit init --force
\`\`\`

### Workflow Issues

\`\`\`bash
# Test workflow step by step
uxkit study create "Test Study"
uxkit research questions
uxkit research sources

# Check file permissions
ls -la .uxkit/studies/

# Verify template files
ls -la .uxkit/templates/
\`\`\`
`;
        await this.fileSystem.writeFile(`${configPath}/customization.md`, content);
    }
}
exports.ConfigurationDocumentationGenerator = ConfigurationDocumentationGenerator;
//# sourceMappingURL=ConfigurationDocumentationGenerator.js.map