# UX-Kit TypeScript CLI Quickstart Guide

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git (for version control)

### Install UX-Kit
```bash
# Install globally via npm
npm install -g @ux-kit/cli

# Or install locally in your project
npm install --save-dev @ux-kit/cli
```

### Verify Installation
```bash
uxkit --version
uxkit --help
```

## Quick Start

### 1. Initialize UX-Kit in Your Project
```bash
# Navigate to your project directory
cd /path/to/your/project

# Initialize UX-Kit with Cursor AI agent
uxkit init --ai-agent cursor

# This creates a .uxkit/ directory with:
# - Configuration files
# - Template files
# - Memory/context files
```

### 2. Create Your First Research Study
```bash
# Create a new research study
uxkit study create "User Onboarding Optimization" \
  --description "Improve user onboarding retention rates" \
  --priority high

# List all studies
uxkit study list

# View study details
uxkit study show 001
```

### 3. Generate Research Questions
```bash
# Generate questions from a prompt
uxkit research questions \
  "How can we improve user onboarding retention rates?" \
  --study 001 \
  --max-questions 5

# This creates: .uxkit/studies/001/questions.md
```

### 4. Add Research Sources
```bash
# Add sources manually
uxkit research sources --study 001

# Or auto-discover sources
uxkit research sources --study 001 --auto-discover

# This creates: .uxkit/studies/001/sources.md
```

### 5. Summarize Sources
```bash
# Summarize a specific source
uxkit research summarize "analytics-data.csv" --study 001

# Summarize all sources
uxkit research summarize --all --study 001

# This creates: .uxkit/studies/001/summaries/
```

### 6. Format Interview Data
```bash
# Format interview transcript
uxkit research interview "user-interview-1.txt" \
  --study 001 \
  --participant "user-001" \
  --method "semi-structured"

# This creates: .uxkit/studies/001/interviews/
```

### 7. Synthesize Insights
```bash
# Synthesize insights from all artifacts
uxkit research synthesize --study 001 --format markdown

# This creates: .uxkit/studies/001/insights.md
```

## IDE Integration (Cursor)

### Slash Commands
In Cursor, you can use slash commands for seamless integration:

```
/research:questions How can we improve user onboarding retention rates?
/research:sources
/research:summarize analytics-data.csv
/research:interview user-interview-1.txt
/research:synthesize
```

### Command Palette
- `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- Type "UX-Kit" to see available commands
- Select commands to execute

## Configuration

### Basic Configuration
```bash
# View current configuration
uxkit config list

# Set AI agent provider
uxkit config set aiAgent.provider cursor

# Set storage format
uxkit config set storage.format markdown

# Set auto-save
uxkit config set research.autoSave true
```

### Configuration File
Edit `.uxkit/config.yaml`:
```yaml
version: "1.0.0"
aiAgent:
  provider: "cursor"
  settings:
    model: "gpt-4"
    temperature: 0.7
    maxTokens: 2000
storage:
  basePath: ".uxkit"
  format: "markdown"
research:
  defaultTemplates:
    - "questions-template.md"
    - "sources-template.md"
  autoSave: true
```

## Project Structure

After initialization, your project will have:
```
.uxkit/
├── config.yaml                 # Configuration file
├── memory/                     # Persistent context
│   └── principles.md
├── templates/                  # Markdown templates
│   ├── questions-template.md
│   ├── sources-template.md
│   ├── summarize-template.md
│   ├── interview-template.md
│   └── synthesis-template.md
└── studies/                    # Research studies
    └── 001-user-onboarding-optimization/
        ├── questions.md
        ├── sources.md
        ├── summaries/
        ├── interviews/
        └── insights.md
```

## Common Workflows

### New Research Project
```bash
# 1. Initialize
uxkit init --ai-agent cursor

# 2. Create study
uxkit study create "Project Name" --description "Description"

# 3. Generate questions
uxkit research questions "Your research prompt"

# 4. Add sources
uxkit research sources --auto-discover

# 5. Summarize sources
uxkit research summarize --all

# 6. Synthesize insights
uxkit research synthesize
```

### Adding Interview Data
```bash
# 1. Prepare transcript file
echo "Interview transcript content..." > interview.txt

# 2. Format interview
uxkit research interview interview.txt \
  --participant "P001" \
  --method "semi-structured"

# 3. Re-synthesize insights
uxkit research synthesize
```

### Updating Research
```bash
# 1. Add new sources
uxkit research sources --study 001

# 2. Update summaries
uxkit research summarize --all --study 001

# 3. Update insights
uxkit research synthesize --study 001
```

## Tips and Best Practices

### 1. Use Descriptive Study Names
```bash
# Good
uxkit study create "Q1 2024 User Onboarding Analysis"

# Avoid
uxkit study create "Research"
```

### 2. Leverage Auto-Discovery
```bash
# Let UX-Kit discover relevant sources
uxkit research sources --auto-discover --study 001
```

### 3. Regular Synthesis
```bash
# Synthesize insights after each major update
uxkit research synthesize --study 001
```

### 4. Version Control
```bash
# Add .uxkit/ to your .gitignore if needed
echo ".uxkit/" >> .gitignore

# Or commit research artifacts
git add .uxkit/
git commit -m "Add UX research artifacts"
```

### 5. Use Templates
```bash
# Customize templates in .uxkit/templates/
# Edit templates to match your research methodology
```

## Troubleshooting

### Common Issues

#### Command Not Found
```bash
# Ensure UX-Kit is installed globally
npm install -g @ux-kit/cli

# Or use npx
npx @ux-kit/cli --help
```

#### AI Agent Connection Issues
```bash
# Check AI agent configuration
uxkit config get aiAgent.provider

# Test connection
uxkit test --ai-agent
```

#### Permission Errors
```bash
# Ensure you have write permissions
chmod -R 755 .uxkit/

# Or run with appropriate permissions
sudo uxkit init
```

#### Configuration Issues
```bash
# Reset configuration
uxkit config reset

# Or edit manually
uxkit config edit
```

### Getting Help
```bash
# General help
uxkit --help

# Command-specific help
uxkit research --help
uxkit study --help

# Verbose output
uxkit research questions "prompt" --verbose

# Debug mode
uxkit research questions "prompt" --debug
```

## Next Steps

1. **Explore Templates**: Customize templates in `.uxkit/templates/`
2. **Configure AI Agent**: Set up your preferred AI agent settings
3. **Create Multiple Studies**: Organize different research efforts
4. **Integrate with IDE**: Use slash commands in Cursor
5. **Export Results**: Generate reports from your research

## Resources

- [Full Documentation](https://docs.ux-kit.dev)
- [Command Reference](https://docs.ux-kit.dev/commands)
- [Configuration Guide](https://docs.ux-kit.dev/configuration)
- [API Reference](https://docs.ux-kit.dev/api)
- [GitHub Repository](https://github.com/ux-kit/cli)

## Support

- **Issues**: [GitHub Issues](https://github.com/ux-kit/cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ux-kit/cli/discussions)
- **Community**: [Discord Server](https://discord.gg/ux-kit)
- **Email**: support@ux-kit.dev

Happy researching! 🚀
