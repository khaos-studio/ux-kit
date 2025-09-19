# Setup Guide

This guide will help you install and configure UX-Kit CLI for your UX research workflow.

## Installation

### Option 1: Direct GitHub Installation (Recommended)

```bash
# Install directly from GitHub repository
npm install -g https://github.com/khaos-studio/ux-kit.git

# Verify installation
uxkit --help
```

### Option 2: Clone and Install Locally

```bash
# Clone the repository
git clone https://github.com/khaos-studio/ux-kit.git
cd ux-kit

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link

# Verify installation
uxkit --help
```

### Option 3: Development Setup

```bash
# Clone the repository
git clone https://github.com/khaos-studio/ux-kit.git
cd ux-kit

# Install dependencies
npm install

# Build the project
npm run build

# Run the CLI directly
node dist/index.js --help
```

## Initial Configuration

### Basic Setup

```bash
# Initialize UX-Kit in your project
uxkit init
```

This creates:
- `.uxkit/` directory structure
- `config.yaml` configuration file
- `templates/` directory with research templates
- `studies/` directory for research studies

### AI Agent Selection

During initialization, you'll be prompted to select your preferred AI agent:

#### Cursor IDE Integration
```bash
uxkit init --aiAgent cursor
```

**What it creates:**
- `.cursor/commands/` directory with custom slash commands
- `/specify`, `/research`, `/study`, and `/synthesize` commands
- Ready-to-use IDE integration

**Usage in Cursor IDE:**
```
/specify "Create a new feature specification"
/research "Generate research questions for user onboarding"
/study "Create a new research study"
/synthesize "Synthesize insights from research data"
```

#### Codex v2 Integration
```bash
uxkit init --aiAgent codex
```

**What it creates:**
- `codex.md` configuration file in project root
- `.codex/` directory with README and prompts/
- 5 UX research prompt templates:
  - `create-study.md` - Create new UX research studies
  - `generate-questions.md` - Generate research questions
  - `synthesize-findings.md` - Analyze and synthesize research data
  - `create-personas.md` - Develop user personas
  - `research-plan.md` - Create comprehensive research plans

**Usage with Codex v2:**
```
"Create a new UX research study about mobile app navigation"
"Generate interview questions for testing the checkout process"
"Synthesize findings from last week's user interviews"
```

#### Custom AI Agents
```bash
uxkit init --aiAgent custom
```

**What it creates:**
- Flexible configuration for your preferred AI tools
- Template system for consistent outputs
- File-based approach for easy customization

## Configuration Files

### config.yaml

The main configuration file contains:

```yaml
# UX-Kit Configuration
version: "1.0.0"

# Template configuration
templates:
  directory: "./templates"
  format: "markdown"

# Output configuration
output:
  directory: "./output"
  format: "markdown"

# Research configuration
research:
  defaultStudy: "default-study"
  autoSave: true
```

### AI Agent Configuration

#### Cursor IDE (.cursor/commands/)

Each command file contains:
- Command definition
- Description and usage
- Template integration
- Error handling

#### Codex v2 (codex.md)

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
```

## Environment Variables

UX-Kit supports the following environment variables:

```bash
# Optional: Override default configuration
export UXKIT_CONFIG_PATH=./custom-config.yaml

# Optional: Set log level
export UXKIT_LOG_LEVEL=info

# Optional: Set output directory
export UXKIT_OUTPUT_DIR=./research-output
```

## Verification

After setup, verify your installation:

```bash
# Check CLI version
uxkit --version

# List available commands
uxkit --help

# Test study creation
uxkit study:create --name "Test Study"

# List studies
uxkit study:list

# Clean up test
uxkit study:delete test-study
```

## Troubleshooting

### Common Issues

#### Permission Errors
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Or use npx instead of global install
npx @ux-kit/cli init
```

#### Node.js Version
```bash
# Check Node.js version (requires 18+)
node --version

# Update Node.js if needed
# Visit https://nodejs.org for latest LTS version
```

#### AI Agent Not Detected
```bash
# Manual AI agent setup
uxkit init --aiAgent cursor --force
uxkit init --aiAgent codex --force
```

### Getting Help

- Check the [Usage Guide](usage.md) for command reference
- Review [Features Documentation](features.md) for detailed capabilities
- See [AI Integration Guide](ai-integration.md) for agent-specific setup
- Visit [Development Guide](development.md) for contributing

## Next Steps

1. **Try the Demo**: Explore [Interactive Demo](../demo/interactive-demo.md)
2. **Create Your First Study**: Follow the [Usage Guide](usage.md)
3. **Explore AI Integration**: Check [AI Integration Guide](ai-integration.md)
4. **Customize Templates**: See [Features Documentation](features.md)

---

Ready to start your UX research workflow? [Continue to Usage Guide →](usage.md)
