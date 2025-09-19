# Usage Guide

Complete command reference and workflow examples for UX-Kit CLI.

## Command Overview

```bash
uxkit <command> [options]

Commands:
  init                    Initialize UX-Kit in your project
  study:create           Create a new research study
  study:list             List all research studies
  study:show             Show details of a specific study
  study:delete           Delete a research study
  research:questions     Generate research questions
  research:sources       Collect research sources
  research:interview     Process interview transcripts
  research:summarize     Generate source summaries
  research:synthesize    Synthesize insights from research
  help                   Show help information
```

## Study Management

### Create a Study

```bash
# Basic study creation
uxkit study:create --name "User Onboarding Research"

# With description
uxkit study:create --name "E-commerce Checkout Optimization" --description "Research study for optimizing checkout flow"

# With custom ID
uxkit study:create --name "Mobile App UX" --id "mobile-ux-2024"
```

### List Studies

```bash
# List all studies
uxkit study:list

# Output example:
# 001-e-commerce-checkout-optimization
#   Name: E-commerce Checkout Optimization
#   Description: Research study for optimizing checkout flow
#   Created: 2025-09-19T00:34:16.483Z
```

### Show Study Details

```bash
# Show specific study
uxkit study:show 001-e-commerce-checkout-optimization

# Output includes:
# - Study metadata
# - Directory structure
# - Generated files
# - Last modified date
```

### Delete a Study

```bash
# Delete by ID
uxkit study:delete 001-e-commerce-checkout-optimization

# Confirm deletion
# Study 001-e-commerce-checkout-optimization deleted successfully
```

## Research Workflow

### Generate Research Questions

```bash
# Basic question generation
uxkit research:questions --study 001-e-commerce-checkout-optimization

# With specific topic
uxkit research:questions --study 001-e-commerce-checkout-optimization --topic "How do users experience our checkout flow?"

# With AI agent integration
uxkit research:questions --study 001-e-commerce-checkout-optimization --aiAgent cursor
```

**Generated File**: `.uxkit/studies/{study-id}/questions.md`

### Collect Research Sources

```bash
# Basic source collection
uxkit research:sources --study 001-e-commerce-checkout-optimization

# With specific sources
uxkit research:sources --study 001-e-commerce-checkout-optimization --sources '[
  {
    "title": "E-commerce Best Practices",
    "type": "Industry Report",
    "url": "https://example.com/best-practices",
    "date": "2024-01-15"
  }
]'
```

**Generated File**: `.uxkit/studies/{study-id}/sources.md`

### Process Interview Transcripts

```bash
# Process interview transcript
uxkit research:interview --study 001-e-commerce-checkout-optimization --transcript "User interview transcript content..."

# With participant details
uxkit research:interview --study 001-e-commerce-checkout-optimization --transcript "..." --participant "Alex Johnson" --role "Software Engineer"
```

**Generated File**: `.uxkit/studies/{study-id}/interviews/{participant-id}.md`

### Generate Source Summaries

```bash
# Summarize specific source
uxkit research:summarize --study 001-e-commerce-checkout-optimization --sourceId source-123

# Summarize all sources
uxkit research:summarize --study 001-e-commerce-checkout-optimization --all
```

**Generated File**: `.uxkit/studies/{study-id}/summaries/{source-id}.md`

### Synthesize Research Insights

```bash
# Basic synthesis
uxkit research:synthesize --study 001-e-commerce-checkout-optimization

# With specific focus
uxkit research:synthesize --study 001-e-commerce-checkout-optimization --focus "checkout optimization"

# Generate executive summary
uxkit research:synthesize --study 001-e-commerce-checkout-optimization --executive
```

**Generated File**: `.uxkit/studies/{study-id}/synthesis.md`

## Complete Workflow Example

Here's a complete UX research study workflow:

```bash
# 1. Initialize UX-Kit
uxkit init --aiAgent cursor

# 2. Create a research study
uxkit study:create --name "E-commerce Checkout Optimization" --description "Research study for optimizing checkout flow"

# 3. List studies to get the ID
uxkit study:list

# 4. Generate research questions
uxkit research:questions --study 001-e-commerce-checkout-optimization --topic "How do users experience our checkout flow?"

# 5. Collect research sources
uxkit research:sources --study 001-e-commerce-checkout-optimization

# 6. Process interview transcripts
uxkit research:interview --study 001-e-commerce-checkout-optimization --transcript "User interview transcript content..."

# 7. Generate source summaries
uxkit research:summarize --study 001-e-commerce-checkout-optimization --all

# 8. Synthesize insights
uxkit research:synthesize --study 001-e-commerce-checkout-optimization

# 9. View generated files
ls .uxkit/studies/001-e-commerce-checkout-optimization/

# 10. Clean up when done
uxkit study:delete 001-e-commerce-checkout-optimization
```

## Generated File Structure

After running the research workflow, you'll have:

```
.uxkit/
├── config.yaml
├── memory/
│   └── principles.md
├── templates/
│   ├── questions-template.md
│   ├── sources-template.md
│   ├── interview-template.md
│   ├── synthesis-template.md
│   └── summarize-template.md
└── studies/
    └── 001-e-commerce-checkout-optimization/
        ├── study-info.json
        ├── questions.md          # Generated by questions command
        ├── sources.md           # Generated by sources command
        ├── synthesis.md         # Generated by synthesize command
        ├── interviews/
        │   └── P001-Alex-Johnson.md
        └── summaries/
            └── source-123.md
```

## Template System

UX-Kit uses Handlebars-style templates for consistent output formatting:

### Template Variables

```handlebars
{{#each keyFindings}}
### {{title}}
{{description}}
**Evidence**: {{evidence}}
**Impact**: {{impact}}
{{/each}}
```

### Template Features

- **Variable substitution**: `{{variableName}}`
- **Conditional logic**: `{{#if condition}}...{{/if}}`
- **Iteration**: `{{#each array}}...{{/each}}`
- **Complex data structures**: Nested object access

### Custom Templates

You can customize templates by editing files in `.uxkit/templates/`:

```markdown
# Custom Research Questions Template

## Study: {{studyName}}
**Date**: {{date}}

### Primary Questions
{{#each primaryQuestions}}
- {{this}}
{{/each}}

### Secondary Questions
{{#each secondaryQuestions}}
- {{this}}
{{/each}}
```

## AI Agent Integration

### Cursor IDE Commands

After initialization with `--aiAgent cursor`, use these slash commands in Cursor IDE:

```
/specify "Create a new feature specification for user onboarding"
/research "Generate research questions for mobile app usability"
/study "Create a new research study for checkout optimization"
/synthesize "Synthesize insights from last week's user interviews"
```

### Codex v2 Prompts

After initialization with `--aiAgent codex`, use natural language prompts:

```
"Create a new UX research study about mobile app navigation"
"Generate interview questions for testing the checkout process"
"Synthesize findings from last week's user interviews"
"Create user personas based on our research data"
"Develop a comprehensive research plan for Q1 2024"
```

## Command Options

### Global Options

```bash
--help, -h          Show help information
--version, -v       Show version number
--verbose           Enable verbose output
--quiet             Suppress output except errors
--config <path>     Use custom configuration file
```

### Study Options

```bash
--name <name>       Study name (required for create)
--description <desc> Study description
--id <id>           Custom study ID
--template <template> Use custom template
```

### Research Options

```bash
--study <id>        Study ID (required for research commands)
--topic <topic>     Research topic or focus area
--aiAgent <agent>   AI agent to use (cursor, codex, custom)
--format <format>   Output format (markdown, json, yaml)
--output <path>     Custom output path
```

## Error Handling

UX-Kit provides comprehensive error handling:

```bash
# Invalid study ID
uxkit study:show invalid-id
# Error: Study 'invalid-id' not found

# Missing required options
uxkit study:create
# Error: --name is required for study creation

# File system errors
uxkit research:questions --study 001-test
# Error: Study directory not found. Run 'uxkit study:create' first.
```

## Best Practices

### Study Organization

1. **Use descriptive names**: "E-commerce Checkout Optimization" vs "Study 1"
2. **Include descriptions**: Help team members understand study purpose
3. **Consistent naming**: Use kebab-case for study IDs
4. **Regular cleanup**: Delete completed studies to maintain organization

### Research Workflow

1. **Start with questions**: Define research questions before collecting data
2. **Collect diverse sources**: Include industry reports, academic papers, and user feedback
3. **Process interviews systematically**: Use consistent participant profiling
4. **Synthesize regularly**: Don't wait until the end to analyze findings
5. **Document insights**: Use the synthesis feature to capture key learnings

### AI Agent Usage

1. **Choose the right agent**: Cursor for IDE integration, Codex for natural language
2. **Use specific prompts**: "Generate questions about checkout flow" vs "Generate questions"
3. **Iterate and refine**: Use AI-generated content as starting points
4. **Validate outputs**: Always review and customize AI-generated content

## Troubleshooting

### Common Issues

#### Study Not Found
```bash
# Check if study exists
uxkit study:list

# Verify study ID format
uxkit study:show 001-e-commerce-checkout-optimization
```

#### Template Errors
```bash
# Check template syntax
cat .uxkit/templates/questions-template.md

# Reset to default templates
rm -rf .uxkit/templates/
uxkit init --force
```

#### AI Agent Issues
```bash
# Reinitialize AI agent
uxkit init --aiAgent cursor --force

# Check agent configuration
cat .cursor/commands/specify.md
```

### Getting Help

- Use `uxkit --help` for command overview
- Use `uxkit <command> --help` for specific command help
- Check [Setup Guide](setup.md) for installation issues
- Review [Features Documentation](features.md) for detailed capabilities
- See [AI Integration Guide](ai-integration.md) for agent-specific help

---

Ready to explore advanced features? [Continue to Features Documentation →](features.md)
