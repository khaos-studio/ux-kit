# AI Integration Guide

Complete guide to setting up and using AI agents with UX-Kit CLI.

## Overview

UX-Kit supports three types of AI agent integration:

1. **Cursor IDE** - Slash commands for seamless IDE workflow
2. **Codex v2** - Natural language prompts with custom templates
3. **Custom Agents** - Flexible configuration for your preferred AI tools

## Cursor IDE Integration

### Setup

```bash
# Initialize with Cursor IDE integration
uxkit init --aiAgent cursor
```

### What It Creates

**Directory Structure:**
```
.cursor/
└── commands/
    ├── specify.md
    ├── research.md
    ├── study.md
    └── synthesize.md
```

**Generated Commands:**

#### `/specify` Command
```markdown
# Specify Command

Create feature specifications using UX-Kit templates.

## Usage
/specify "Create a new feature specification for user onboarding"

## Features
- Template-based specification generation
- Consistent formatting and structure
- Integration with UX-Kit workflow
```

#### `/research` Command
```markdown
# Research Command

Generate research questions and collect sources.

## Usage
/research "Generate research questions for mobile app usability"

## Features
- Research question generation
- Source collection and categorization
- Template-based output formatting
```

#### `/study` Command
```markdown
# Study Command

Create and manage research studies.

## Usage
/study "Create a new research study for checkout optimization"

## Features
- Study creation and management
- Metadata tracking
- File organization
```

#### `/synthesize` Command
```markdown
# Synthesize Command

Synthesize insights from research data.

## Usage
/synthesize "Synthesize insights from last week's user interviews"

## Features
- Research synthesis
- Insight extraction
- Actionable recommendations
```

### Usage in Cursor IDE

1. **Open Command Palette**: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. **Type Command**: Start typing `/specify`, `/research`, `/study`, or `/synthesize`
3. **Enter Prompt**: Provide your research prompt or request
4. **Execute**: Cursor will use UX-Kit to generate the appropriate research artifacts

### Example Workflows

#### Feature Specification
```
/specify "Create a new feature specification for user onboarding flow including welcome screen, tutorial, and account setup"
```

#### Research Questions
```
/research "Generate research questions for testing the effectiveness of our new checkout flow design"
```

#### Study Creation
```
/study "Create a new research study for mobile app navigation patterns with focus on user task completion rates"
```

#### Research Synthesis
```
/synthesize "Synthesize insights from our user interviews about checkout abandonment and create actionable recommendations"
```

## Codex v2 Integration

### Setup

```bash
# Initialize with Codex v2 integration
uxkit init --aiAgent codex
```

### What It Creates

**Configuration File (`codex.md`):**
```markdown
# Codex Configuration

## UX Research Assistant

You are a UX research assistant integrated with UX-Kit CLI. 
Your role is to help with:

- Creating research studies
- Generating research questions
- Synthesizing findings
- Creating user personas
- Developing research plans

## Available Commands

- Create study
- Generate questions
- Synthesize findings
- Create personas
- Research planning

## Integration

This configuration works with UX-Kit CLI to provide:
- Structured research workflows
- Template-based output generation
- File organization and management
- Cross-platform compatibility
```

**Prompt Templates (`.codex/prompts/`):**

#### `create-study.md`
```markdown
# Create UX Research Study

Create a new UX research study with proper structure and metadata.

## Input
- Study name and description
- Research objectives
- Target audience
- Timeline and scope

## Output
- Study directory structure
- Metadata configuration
- Template files
- Initial research questions

## Example
"Create a new UX research study for mobile app onboarding optimization focusing on user retention and task completion rates"
```

#### `generate-questions.md`
```markdown
# Generate Research Questions

Generate comprehensive research questions for UX studies.

## Input
- Research topic or focus area
- Study objectives
- Target user segments
- Research methods

## Output
- Primary research questions
- Secondary questions
- Methodology recommendations
- Success metrics

## Example
"Generate research questions for testing the effectiveness of our new checkout flow design with focus on conversion rates and user satisfaction"
```

#### `synthesize-findings.md`
```markdown
# Synthesize Research Findings

Analyze and synthesize research data into actionable insights.

## Input
- Research data and findings
- Interview transcripts
- Survey results
- Analytics data

## Output
- Key insights and patterns
- Actionable recommendations
- Priority matrix
- Next steps

## Example
"Synthesize findings from our user interviews about checkout abandonment and create actionable recommendations for improving conversion rates"
```

#### `create-personas.md`
```markdown
# Create User Personas

Develop user personas based on research data and insights.

## Input
- Research findings
- User demographics
- Behavioral patterns
- Pain points and needs

## Output
- User persona profiles
- Journey maps
- Use cases and scenarios
- Design recommendations

## Example
"Create user personas for our e-commerce platform based on our research findings about checkout behavior and user preferences"
```

#### `research-plan.md`
```markdown
# Create Research Plan

Develop comprehensive research plans for UX studies.

## Input
- Research objectives
- Timeline and budget
- Team resources
- Stakeholder requirements

## Output
- Research methodology
- Timeline and milestones
- Resource allocation
- Success metrics

## Example
"Create a comprehensive research plan for Q1 2024 focusing on mobile app usability improvements with budget constraints and 3-month timeline"
```

### Usage with Codex v2

1. **Natural Language Prompts**: Use conversational language to request research tasks
2. **Context Awareness**: Codex v2 understands UX research context and terminology
3. **Template Integration**: Prompts are processed through UX-Kit templates
4. **File Generation**: Results are saved as structured Markdown files

### Example Prompts

#### Study Creation
```
"Create a new UX research study for mobile app navigation patterns with focus on user task completion rates and satisfaction scores"
```

#### Question Generation
```
"Generate research questions for testing the effectiveness of our new checkout flow design with focus on conversion rates and user satisfaction"
```

#### Research Synthesis
```
"Synthesize insights from our user interviews about checkout abandonment and create actionable recommendations for improving conversion rates"
```

#### Persona Development
```
"Create user personas for our e-commerce platform based on our research findings about checkout behavior and user preferences"
```

#### Research Planning
```
"Create a comprehensive research plan for Q1 2024 focusing on mobile app usability improvements with budget constraints and 3-month timeline"
```

## Custom AI Agents

### Setup

```bash
# Initialize with custom AI agent
uxkit init --aiAgent custom
```

### Configuration

Custom agents can be configured through:

1. **Template Customization**: Modify templates in `.uxkit/templates/`
2. **Configuration Files**: Custom configuration in `config.yaml`
3. **Environment Variables**: Override settings with environment variables
4. **Plugin System**: Extend functionality with custom plugins

### Template Customization

**Custom Question Template:**
```handlebars
# Custom Research Questions

## Study: {{studyName}}
**Research Focus**: {{researchFocus}}
**Date**: {{date}}

### Primary Research Questions
{{#each primaryQuestions}}
- **{{this}}**
{{/each}}

### Secondary Questions
{{#each secondaryQuestions}}
- {{this}}
{{/each}}

### Research Methodology
{{#if methodology}}
**Recommended Methods**: {{methodology}}
{{/if}}
```

**Custom Synthesis Template:**
```handlebars
# Research Synthesis: {{studyName}}

## Executive Summary
{{executiveSummary}}

## Key Findings
{{#each keyFindings}}
### {{title}}
**Description**: {{description}}
**Evidence**: {{evidence}}
**Impact**: {{impact}}
**Priority**: {{priority}}
{{/each}}

## Recommendations
{{#each recommendations}}
- **{{title}}**: {{description}} ({{priority}})
{{/each}}
```

### Environment Variables

```bash
# Custom AI agent configuration
export UXKIT_AI_AGENT=custom
export UXKIT_AI_ENDPOINT=https://your-ai-service.com/api
export UXKIT_AI_API_KEY=your-api-key
export UXKIT_AI_MODEL=your-model-name
export UXKIT_AI_TEMPERATURE=0.7
export UXKIT_AI_MAX_TOKENS=2000
```

### Custom Configuration

**config.yaml:**
```yaml
# Custom AI Agent Configuration
aiAgent:
  type: custom
  endpoint: https://your-ai-service.com/api
  model: your-model-name
  temperature: 0.7
  maxTokens: 2000
  customPrompts:
    - name: "custom-research"
      template: "custom-research-template.md"
    - name: "custom-synthesis"
      template: "custom-synthesis-template.md"
```

## Best Practices

### AI Agent Selection

**Choose Cursor IDE when:**
- You're using Cursor IDE for development
- You want seamless IDE integration
- You prefer slash commands over natural language
- You need quick access to research tools

**Choose Codex v2 when:**
- You prefer natural language interaction
- You want conversational AI assistance
- You need flexible prompt templates
- You're working with complex research scenarios

**Choose Custom when:**
- You have specific AI tool requirements
- You need custom templates and workflows
- You want to integrate with proprietary AI systems
- You need advanced customization options

### Prompt Engineering

**Effective Prompts:**
- Be specific about research objectives
- Include context and background information
- Specify desired output format and structure
- Provide examples when helpful
- Use clear, concise language

**Example Good Prompts:**
```
"Generate research questions for testing the effectiveness of our new checkout flow design with focus on conversion rates and user satisfaction"
```

**Example Poor Prompts:**
```
"Generate questions"
```

### Template Design

**Template Best Practices:**
- Use clear, descriptive variable names
- Include conditional logic for optional content
- Provide fallback values for missing data
- Use consistent formatting and structure
- Test templates with various data inputs

### Integration Workflow

**Recommended Workflow:**
1. **Initialize**: Set up AI agent integration
2. **Configure**: Customize templates and settings
3. **Test**: Verify integration with sample data
4. **Iterate**: Refine prompts and templates
5. **Scale**: Use in production research workflows

## Troubleshooting

### Common Issues

#### Cursor IDE Commands Not Working
```bash
# Check if Cursor IDE is installed
which cursor

# Reinitialize commands
uxkit init --aiAgent cursor --force

# Verify command files exist
ls -la .cursor/commands/
```

#### Codex v2 Integration Issues
```bash
# Check configuration file
cat codex.md

# Verify prompt templates
ls -la .codex/prompts/

# Reinitialize integration
uxkit init --aiAgent codex --force
```

#### Custom Agent Configuration
```bash
# Check environment variables
env | grep UXKIT

# Verify configuration file
cat .uxkit/config.yaml

# Test custom templates
uxkit research:questions --study test --template custom-template
```

### Getting Help

- Check [Setup Guide](setup.md) for installation issues
- Review [Usage Guide](usage.md) for command reference
- See [Features Documentation](features.md) for detailed capabilities
- Visit [Development Guide](development.md) for contributing

---

Ready to start developing? [Continue to Development Guide →](development.md)
