# UX-Kit Quickstart Guide

## Overview

UX-Kit is a lightweight TypeScript CLI toolkit for UX research inspired by GitHub's spec-kit. It provides structured research workflows through slash commands, AI agent integration, and file-based artifact management. The tool generates text files and scripts to support AI agent research workflows in IDEs.

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Install UX-Kit

```bash
# Install globally
npm install -g @ux-kit/cli

# Or install locally in your project
npm install --save-dev @ux-kit/cli
```

### Verify Installation

```bash
uxkit --version
uxkit --help
```

## Getting Started

### 1. Initialize UX-Kit

Initialize UX-Kit in your project directory:

```bash
# Initialize with default settings
uxkit init

# Initialize with specific AI agent
uxkit init --ai-agent cursor

# Initialize with custom template
uxkit init --template custom-template
```

This creates a `.uxkit/` directory with:
- `config.yaml` - Configuration file
- `memory/` - Persistent context and principles
- `templates/` - Markdown templates for research artifacts
- `studies/` - Directory for research studies

### 2. Create Your First Research Study

```bash
# Create a new research study
uxkit study create "User Onboarding Research"

# List all studies
uxkit study list

# Show study details
uxkit study show 001-user-onboarding-research
```

### 3. Generate Research Questions

```bash
# Generate questions from a prompt
uxkit research questions "How do users discover and understand our product features?"

# Generate questions for a specific study
uxkit research questions "What are the main pain points in our checkout flow?" --study 001-user-onboarding-research

# Generate questions with specific categories
uxkit research questions "How accessible is our mobile app?" --categories usability,accessibility
```

This creates a `questions.md` file in your study directory with structured research questions.

### 4. Discover Research Sources

```bash
# Discover sources for a study
uxkit research sources --study 001-user-onboarding-research

# Auto-discover sources based on questions
uxkit research sources --auto-discover --study 001-user-onboarding-research

# Discover specific types of sources
uxkit research sources --types web,document --study 001-user-onboarding-research
```

This creates a `sources.md` file with organized research sources.

### 5. Summarize Research Sources

```bash
# Summarize a specific source
uxkit research summarize "source-001" --study 001-user-onboarding-research

# Summarize with focus areas
uxkit research summarize "source-002" --focus-areas usability,accessibility
```

This creates a summary file in the `summaries/` directory.

### 6. Format Interview Transcripts

```bash
# Format an interview transcript
uxkit research interview "participant-001-transcript.txt" --study 001-user-onboarding-research

# Format with participant information
uxkit research interview "participant-002-transcript.txt" --participant "P002" --study 001-user-onboarding-research
```

This creates an interview file in the `interviews/` directory.

### 7. Synthesize Research Insights

```bash
# Synthesize insights from all artifacts
uxkit research synthesize --study 001-user-onboarding-research

# Synthesize with specific focus areas
uxkit research synthesize --focus-areas usability,accessibility --study 001-user-onboarding-research

# Synthesize with minimum confidence threshold
uxkit research synthesize --min-confidence 0.8 --study 001-user-onboarding-research
```

This creates an `insights.md` file with synthesized research insights.

## IDE Integration

### Cursor Integration

UX-Kit integrates seamlessly with Cursor IDE through slash commands:

#### Available Slash Commands

- `/research:questions <prompt>` - Generate research questions
- `/research:sources [query]` - Discover research sources
- `/research:summarize <source>` - Summarize source documents
- `/research:interview <transcript>` - Format interview transcripts
- `/research:synthesize` - Synthesize insights from all artifacts

#### Example Usage in Cursor

1. Open Cursor IDE
2. Type `/research:questions How do users navigate our app?`
3. UX-Kit generates structured research questions
4. Questions are inserted into your current file or a new file

### VS Code Integration

UX-Kit can also integrate with VS Code through the command palette:

1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Type "UX-Kit" to see available commands
3. Select the desired research command
4. Follow the prompts to generate research artifacts

## File Structure

UX-Kit creates a structured file system for your research:

```
.uxkit/
├── config.yaml                 # Configuration file
├── memory/                     # Persistent context
│   ├── principles.md          # Research principles
│   ├── methodologies.md       # Research methodologies
│   └── templates/             # Custom templates
│       ├── questions-template.md
│       ├── sources-template.md
│       ├── summary-template.md
│       ├── interview-template.md
│       └── insights-template.md
└── studies/                    # Research studies
    └── 001-user-onboarding-research/
        ├── questions.md
        ├── sources.md
        ├── summaries/
        │   ├── source-001-summary.md
        │   └── source-002-summary.md
        ├── interviews/
        │   ├── participant-001-interview.md
        │   └── participant-002-interview.md
        └── insights.md
```

## Configuration

### Configuration File

The `.uxkit/config.yaml` file contains all configuration settings:

```yaml
version: "1.0.0"
aiAgent:
  provider: "cursor"
  settings:
    timeout: 30000
    retries: 3
  fallbackEnabled: true
storage:
  basePath: ".uxkit"
  format: "markdown"
  autoSave: true
  backup: true
research:
  defaultTemplates:
    - "questions-template"
    - "sources-template"
    - "summary-template"
    - "interview-template"
    - "insights-template"
  autoDiscovery: true
  qualityThreshold: 0.7
ui:
  theme: "auto"
  verbose: false
  progress: true
  colors: true
```

### Configuration Commands

```bash
# Set configuration values
uxkit config set aiAgent.provider cursor
uxkit config set storage.format markdown
uxkit config set research.autoDiscovery true

# Get configuration values
uxkit config get aiAgent.provider
uxkit config get storage.basePath

# List all configuration
uxkit config list

# Reset to defaults
uxkit config reset
```

## Templates

### Default Templates

UX-Kit includes default templates for all research artifacts:

- **Questions Template**: Structured format for research questions
- **Sources Template**: Organized format for research sources
- **Summary Template**: Consistent format for source summaries
- **Interview Template**: Standardized format for interview data
- **Insights Template**: Structured format for research insights

### Custom Templates

Create custom templates for your specific needs:

```bash
# Create a custom template
uxkit template create "custom-questions" --type questions

# Update a template
uxkit template update "custom-questions" --file custom-template.md

# List available templates
uxkit template list

# Delete a template
uxkit template delete "custom-questions"
```

### Template Variables

Templates support variables for dynamic content:

- `{{studyName}}` - Name of the research study
- `{{studyDescription}}` - Description of the research study
- `{{questions}}` - Array of research questions
- `{{sources}}` - Array of research sources
- `{{insights}}` - Array of research insights
- `{{timestamp}}` - Current timestamp
- `{{user}}` - Current user name

## AI Agent Integration

### Supported AI Agents

UX-Kit supports multiple AI agents:

- **Cursor**: Default AI agent for Cursor IDE integration
- **Codex**: OpenAI Codex integration
- **Custom**: Custom AI agent endpoints

### AI Agent Configuration

```bash
# Set AI agent provider
uxkit config set aiAgent.provider cursor

# Configure custom AI agent
uxkit config set aiAgent.provider custom
uxkit config set aiAgent.settings.endpoint "https://api.example.com/ai"
uxkit config set aiAgent.settings.apiKey "your-api-key"

# Test AI agent connection
uxkit ai test
```

### Fallback Behavior

When AI agents are unavailable, UX-Kit falls back to template-based generation:

1. AI agent fails or times out
2. System automatically switches to template mode
3. Generates content using predefined templates
4. Logs the fallback event for debugging

## Best Practices

### Research Workflow

1. **Start with Questions**: Always begin by generating research questions
2. **Gather Sources**: Discover and organize relevant research sources
3. **Summarize Sources**: Extract key insights from each source
4. **Conduct Interviews**: Format and analyze interview data
5. **Synthesize Insights**: Combine all findings into actionable insights

### File Organization

1. **Use Descriptive Names**: Name studies and files descriptively
2. **Keep Files Focused**: One artifact per file
3. **Version Control**: Commit research artifacts to version control
4. **Regular Backups**: Enable automatic backups in configuration

### AI Agent Usage

1. **Provide Context**: Include relevant context in prompts
2. **Use Focus Areas**: Specify focus areas for better results
3. **Validate Output**: Review AI-generated content for accuracy
4. **Fallback Ready**: Always have template fallbacks available

## Troubleshooting

### Common Issues

#### AI Agent Not Responding

```bash
# Check AI agent status
uxkit ai status

# Test AI agent connection
uxkit ai test

# Check configuration
uxkit config get aiAgent.provider
```

#### File Generation Errors

```bash
# Check file permissions
ls -la .uxkit/

# Verify directory structure
uxkit study list

# Reset configuration
uxkit config reset
```

#### Template Errors

```bash
# Validate templates
uxkit template validate

# List available templates
uxkit template list

# Reset to default templates
uxkit template reset
```

### Debug Mode

Enable debug mode for detailed logging:

```bash
# Enable debug mode
uxkit config set ui.verbose true

# Run commands with debug output
uxkit research questions "test prompt" --debug
```

### Log Files

UX-Kit creates log files for debugging:

- `~/.uxkit/logs/uxkit.log` - Main application log
- `~/.uxkit/logs/ai-agent.log` - AI agent communication log
- `~/.uxkit/logs/file-operations.log` - File system operations log

## Examples

### Complete Research Workflow

```bash
# 1. Initialize UX-Kit
uxkit init --ai-agent cursor

# 2. Create research study
uxkit study create "Mobile App Usability Research"

# 3. Generate research questions
uxkit research questions "What are the main usability issues in our mobile app?" --study 001-mobile-app-usability-research

# 4. Discover research sources
uxkit research sources --auto-discover --study 001-mobile-app-usability-research

# 5. Summarize sources
uxkit research summarize "source-001" --study 001-mobile-app-usability-research

# 6. Format interview
uxkit research interview "participant-001-transcript.txt" --study 001-mobile-app-usability-research

# 7. Synthesize insights
uxkit research synthesize --study 001-mobile-app-usability-research
```

### IDE Integration Example

In Cursor IDE:

1. Type `/research:questions How do users discover new features?`
2. UX-Kit generates structured questions
3. Questions are inserted into your current file
4. Continue with `/research:sources` to discover relevant sources
5. Use `/research:synthesize` to combine all findings

## Support

### Documentation

- [Full Documentation](https://ux-kit.dev/docs)
- [API Reference](https://ux-kit.dev/api)
- [Examples](https://ux-kit.dev/examples)

### Community

- [GitHub Repository](https://github.com/ux-kit/cli)
- [Discord Community](https://discord.gg/ux-kit)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/ux-kit)

### Issues

Report issues and feature requests:

- [GitHub Issues](https://github.com/ux-kit/cli/issues)
- [Bug Reports](https://github.com/ux-kit/cli/issues/new?template=bug_report.md)
- [Feature Requests](https://github.com/ux-kit/cli/issues/new?template=feature_request.md)

## License

UX-Kit is licensed under the MIT License. See [LICENSE](https://github.com/ux-kit/cli/blob/main/LICENSE) for details.