"use strict";
/**
 * Documentation Generator Service
 *
 * Orchestrates the generation of comprehensive documentation for UX-Kit.
 * This service coordinates all documentation generation tasks including
 * CLI commands, configuration, API, user guides, and examples.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentationGenerator = void 0;
class DocumentationGenerator {
    constructor(fileSystem, commandDocGenerator, configDocGenerator, apiDocGenerator, userGuideGenerator) {
        this.fileSystem = fileSystem;
        this.commandDocGenerator = commandDocGenerator;
        this.configDocGenerator = configDocGenerator;
        this.apiDocGenerator = apiDocGenerator;
        this.userGuideGenerator = userGuideGenerator;
    }
    /**
     * Generate all documentation for the project
     */
    async generateAllDocumentation(projectRoot, outputPath) {
        try {
            // Ensure output directory exists
            await this.fileSystem.ensureDirectoryExists(outputPath);
            // Always create the main documentation structure
            await this.generateMainIndex(projectRoot, outputPath);
            // Create all documentation directories even if source files are missing
            await Promise.all([
                this.ensureDocumentationDirectories(outputPath),
                this.commandDocGenerator.generateCommandDocumentation(projectRoot, outputPath),
                this.configDocGenerator.generateConfigurationDocumentation(projectRoot, outputPath),
                this.apiDocGenerator.generateAPIDocumentation(projectRoot, outputPath),
                this.userGuideGenerator.generateUserGuide(projectRoot, outputPath),
                this.generateExamples(projectRoot, outputPath),
                this.generateTemplateDocumentation(projectRoot, outputPath)
            ]);
        }
        catch (error) {
            // Even if generation fails, ensure basic structure exists
            await this.ensureDocumentationDirectories(outputPath);
            await this.generateMainIndex(projectRoot, outputPath);
            throw new Error(`Failed to generate documentation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Ensure all documentation directories exist
     */
    async ensureDocumentationDirectories(outputPath) {
        const directories = [
            `${outputPath}/commands`,
            `${outputPath}/configuration`,
            `${outputPath}/api`,
            `${outputPath}/user-guide`,
            `${outputPath}/examples`,
            `${outputPath}/templates`
        ];
        await Promise.all(directories.map(dir => this.fileSystem.ensureDirectoryExists(dir)));
    }
    /**
     * Generate the main documentation index
     */
    async generateMainIndex(projectRoot, outputPath) {
        const indexContent = `# UX-Kit Documentation

Welcome to the UX-Kit documentation! This comprehensive guide will help you understand and use UX-Kit effectively for your UX research workflows.

## Commands

- [Commands](./commands/README.md) - CLI command reference
- [Configuration](./configuration/README.md) - Configuration guide
- [API Reference](./api/README.md) - API documentation
- [User Guide](./user-guide/README.md) - Getting started and tutorials
- [Examples](./examples/README.md) - Usage examples and scenarios

## Configuration

## API Reference

## User Guide

## Examples

## Quick Start

1. **Installation**: \`git clone https://github.com/khaos-studio/ux-kit.git && cd ux-kit && npm install && npm run build && npm link\`
2. **Initialize**: \`uxkit init\`
3. **Create Study**: \`uxkit study create "My Research Study"\`
4. **Generate Questions**: \`uxkit research questions\`

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

## Architecture

UX-Kit follows a simple layered architecture:

- **CLI Layer**: Command-line interface and user interaction
- **Service Layer**: Business logic and workflow management
- **Utility Layer**: File operations, validation, and formatting

## Getting Help

- **Documentation**: This comprehensive guide
- **Examples**: See [Examples](./examples/README.md) for real-world usage
- **Issues**: Report bugs or request features on GitHub
- **Community**: Join our community discussions

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

---

*Generated by UX-Kit Documentation Generator*
`;
        await this.fileSystem.writeFile(`${outputPath}/README.md`, indexContent);
    }
    /**
     * Generate examples and tutorials
     */
    async generateExamples(projectRoot, outputPath) {
        const examplesPath = `${outputPath}/examples`;
        await this.fileSystem.ensureDirectoryExists(examplesPath);
        // Generate examples README
        const examplesReadme = `# Examples

This section contains practical examples and real-world scenarios for using UX-Kit effectively.

## Basic Usage

See [Basic Usage](./basic-usage.md) for simple, common use cases.

## Advanced Usage

See [Advanced Usage](./advanced-usage.md) for complex scenarios and advanced features.

## Real-world Scenarios

- **User Onboarding Research**: Complete workflow from questions to insights
- **Product Feature Evaluation**: Multi-phase research approach
- **Competitive Analysis**: Systematic competitor research
- **User Journey Mapping**: End-to-end user experience research

## Getting Started with Examples

1. Choose an example that matches your use case
2. Follow the step-by-step instructions
3. Adapt the templates and workflows to your needs
4. Customize the generated artifacts for your project

## Example Structure

Each example includes:
- **Overview**: What the example demonstrates
- **Prerequisites**: What you need before starting
- **Step-by-step Guide**: Detailed instructions
- **Expected Output**: What you should see
- **Next Steps**: How to continue from here
`;
        await this.fileSystem.writeFile(`${examplesPath}/README.md`, examplesReadme);
        // Generate basic usage example
        const basicUsage = `# Basic Usage Example

This example demonstrates the most common UX-Kit workflow: creating a study and generating research questions.

## Overview

We'll create a simple user onboarding research study and generate initial research questions.

## Prerequisites

- UX-Kit installed and initialized
- Basic understanding of UX research concepts

## Step-by-step Guide

### Step 1: Initialize UX-Kit

\`\`\`bash
uxkit init
\`\`\`

This creates the \`.uxkit/\` directory structure in your project.

### Step 2: Create a Study

\`\`\`bash
uxkit study create "User Onboarding Research"
\`\`\`

This creates a new study with ID \`001-user-onboarding-research\`.

### Step 3: Generate Research Questions

\`\`\`bash
uxkit research questions
\`\`\`

This generates a \`questions.md\` file with structured research questions.

### Step 4: Review Generated Content

Check the generated files:
- \`.uxkit/studies/001-user-onboarding-research/questions.md\`
- \`.uxkit/studies/001-user-onboarding-research/study-config.yaml\`

## Expected Output

You should see:
- A new study directory created
- Research questions file generated
- Study configuration file created
- Success messages in the terminal

## Next Steps

- Add sources: \`uxkit research sources\`
- Create summaries: \`uxkit research summarize\`
- Generate insights: \`uxkit research synthesize\`

## Customization

You can customize the generated questions by editing the template files in \`.uxkit/templates/\`.
`;
        await this.fileSystem.writeFile(`${examplesPath}/basic-usage.md`, basicUsage);
        // Generate advanced usage example
        const advancedUsage = `# Advanced Usage Example

This example demonstrates advanced UX-Kit features including custom templates, multiple studies, and complex research workflows.

## Overview

We'll create a comprehensive product evaluation study with custom templates and multiple research phases.

## Prerequisites

- UX-Kit installed and initialized
- Understanding of advanced UX research methods
- Familiarity with template customization

## Step-by-step Guide

### Step 1: Create Multiple Studies

\`\`\`bash
uxkit study create "Feature Evaluation Study"
uxkit study create "User Journey Research"
uxkit study create "Competitive Analysis"
\`\`\`

### Step 2: Customize Templates

Edit the template files in \`.uxkit/templates/\` to match your research methodology.

### Step 3: Generate Research Artifacts

\`\`\`bash
# Generate questions for each study
uxkit research questions --study "Feature Evaluation Study"
uxkit research questions --study "User Journey Research"
uxkit research questions --study "Competitive Analysis"

# Generate sources
uxkit research sources --study "Feature Evaluation Study"
uxkit research sources --study "User Journey Research"
uxkit research sources --study "Competitive Analysis"
\`\`\`

### Step 4: Create Summaries and Insights

\`\`\`bash
# Generate summaries
uxkit research summarize --study "Feature Evaluation Study"
uxkit research summarize --study "User Journey Research"
uxkit research summarize --study "Competitive Analysis"

# Synthesize insights
uxkit research synthesize --study "Feature Evaluation Study"
\`\`\`

## Expected Output

You should see:
- Multiple study directories created
- Customized research artifacts
- Comprehensive research documentation
- Cross-study insights and patterns

## Advanced Features Demonstrated

- **Multiple Studies**: Managing multiple research projects
- **Custom Templates**: Tailored research methodologies
- **Cross-study Analysis**: Finding patterns across studies
- **Automated Workflows**: Streamlined research processes

## Next Steps

- Export findings to external tools
- Create research reports
- Share insights with stakeholders
- Iterate on research questions based on findings
`;
        await this.fileSystem.writeFile(`${examplesPath}/advanced-usage.md`, advancedUsage);
    }
    /**
     * Generate template documentation
     */
    async generateTemplateDocumentation(projectRoot, outputPath) {
        const templatesPath = `${outputPath}/templates`;
        await this.fileSystem.ensureDirectoryExists(templatesPath);
        const templatesReadme = `# Templates

This section documents all available templates in UX-Kit and how to customize them.

## Available Templates

### Questions Template
- **File**: \`questions-template.md\`
- **Purpose**: Generate structured research questions
- **Usage**: \`uxkit research questions\`

### Sources Template
- **File**: \`sources-template.md\`
- **Purpose**: Collect and organize research sources
- **Usage**: \`uxkit research sources\`

### Summarize Template
- **File**: \`summarize-template.md\`
- **Purpose**: Create research summaries
- **Usage**: \`uxkit research summarize\`

### Interview Template
- **File**: \`interview-template.md\`
- **Purpose**: Conduct user interviews
- **Usage**: \`uxkit research interview\`

### Synthesis Template
- **File**: \`synthesis-template.md\`
- **Purpose**: Synthesize research insights
- **Usage**: \`uxkit research synthesize\`

## Custom Templates

This section shows how to create and use custom templates.

### Creating Custom Templates

1. **Copy default template**:
   \`\`\`bash
   cp .uxkit/templates/questions-template.md .uxkit/templates/custom-template.md
   \`\`\`

2. **Edit template content**:
   \`\`\`markdown
   # Custom Research Questions: {{studyName}}
   
   ## Study Information
   - **Study ID**: {{studyId}}
   - **Created**: {{createdAt}}
   
   ## Research Questions
   1. What are the main user pain points?
   2. How do users currently accomplish their goals?
   3. What improvements would users like to see?
   \`\`\`

3. **Update configuration**:
   \`\`\`yaml
   templates:
     questions: custom-template.md
   \`\`\`

## Template Variables

All templates support the following variables:

- \`{{studyName}}\`: Name of the research study
- \`{{studyDescription}}\`: Description of the study
- \`{{studyId}}\`: Unique study identifier
- \`{{createdAt}}\`: Creation timestamp
- \`{{updatedAt}}\`: Last update timestamp

## Customizing Templates

1. **Copy default template**:
   \`\`\`bash
   cp .uxkit/templates/questions-template.md .uxkit/templates/my-questions-template.md
   \`\`\`

2. **Edit template content**:
   \`\`\`markdown
   # Custom Research Questions: {{studyName}}
   
   ## Study Information
   - **Study ID**: {{studyId}}
   - **Created**: {{createdAt}}
   
   ## Research Questions
   1. What are the main user pain points?
   2. How do users currently accomplish their goals?
   3. What improvements would users like to see?
   \`\`\`

3. **Update configuration**:
   \`\`\`yaml
   templates:
     questions: my-questions-template.md
   \`\`\`

## Best Practices

1. **Keep it simple**: Use clear, concise language
2. **Be specific**: Include specific examples and guidance
3. **Make it actionable**: Provide clear next steps
4. **Include context**: Add relevant background information
5. **Test thoroughly**: Validate templates with real data

## Template Examples

See the [User Guide](../user-guide/examples.md) for detailed examples of custom templates.

## Troubleshooting

### Template Not Found
If templates are missing, re-initialize the project:
\`\`\`bash
uxkit init --force
\`\`\`

### Template Rendering Errors
Check template syntax and variable usage:
\`\`\`bash
cat .uxkit/templates/questions-template.md
\`\`\`

### Invalid Configuration
Validate YAML syntax:
\`\`\`bash
python -c "import yaml; yaml.safe_load(open('.uxkit/config.yaml'))"
\`\`\`
`;
        await this.fileSystem.writeFile(`${templatesPath}/README.md`, templatesReadme);
    }
}
exports.DocumentationGenerator = DocumentationGenerator;
//# sourceMappingURL=DocumentationGenerator.js.map