# UX-Kit CLI

A comprehensive TypeScript CLI toolkit for UX research with AI agent integration, inspired by GitHub's spec-kit.

## Overview

UX-Kit provides structured research workflows through CLI commands, AI agent integration (Cursor, Codex v2, Custom), and file-based artifact management. The tool generates text files and scripts to support AI agent research workflows in IDEs with beautiful CLI experiences and comprehensive test coverage.

## 🎯 Demo Suite

**See UX-Kit in action!** Check out our comprehensive demo suite that showcases all capabilities:

- **[Demo Script](demo/demo-script.md)** - Complete demonstration of UX-Kit capabilities
- **[Interactive Demo](demo/interactive-demo.md)** - Step-by-step walkthrough with hands-on examples
- **[CLI Demo Script](demo/cli-demo-script.md)** - Complete CLI workflow demonstration with real examples
- **[Capabilities Overview](demo/capabilities-overview.md)** - Detailed feature list and technical architecture
- **[Generated Output Examples](demo/generated-output/)** - Real research artifacts created by UX-Kit
- **[Example Study Data](demo/example-study-data.json)** - Realistic research study data

### Demo Highlights

- **743+ tests passing** with comprehensive coverage
- **50+ TypeScript files** with extensive codebase
- **Complete CLI** with study management and research workflow commands
- **Professional templates** with Handlebars-style syntax
- **Cross-platform support** for macOS, Linux, and WSL
- **AI Agent Integration** supporting Cursor, Codex v2, and Custom agents
- **Real file system operations** with proper directory structure creation
- **Full research workflow** from questions to synthesis
- **Beautiful CLI experience** with ASCII art, progress indicators, and interactive prompts

## Installation

### Development Setup (Current)

```bash
# Clone the repository
git clone https://github.com/ux-kit/cli.git
cd ux-kit

# Install dependencies
npm install

# Build the project
npm run build

# Run the CLI
uxkit --help
```

## 🚀 Current Status

**UX-Kit CLI is fully functional!** All core features are implemented and working:

### ✅ **Core Features**
- **Project Initialization**: `uxkit init` - Sets up UX-Kit directory structure with beautiful ASCII banner
- **Interactive AI Agent Selection**: Choose between Cursor, Codex v2, or Custom AI agents during initialization
- **Cursor IDE Integration**: Automatic generation of custom slash commands for seamless IDE workflow
- **Codex v2 Integration**: Creates `codex.md` configuration and `.codex/prompts/` directory with UX research prompts
- **Study Management**: Complete CRUD operations for research studies
- **Research Workflow**: Question generation, source collection, synthesis, and analysis
- **Template System**: Handlebars-style templates for research artifacts
- **File Generation**: Professional Markdown files with proper formatting
- **Cross-Platform**: Works on macOS, Linux, and WSL
- **Beautiful CLI**: ASCII art, progress indicators, and interactive prompts

### 🤖 **AI Agent Integration**
- **Cursor IDE**: Automatic generation of custom slash commands (`/specify`, `/research`, `/study`, `/synthesize`)
- **Codex v2**: Creates `codex.md` configuration file and `.codex/prompts/` directory with 5 UX research prompt templates
- **Custom Agents**: Support for custom AI agent configurations
- **IDE Detection**: Smart detection of Cursor IDE installation
- **Natural Language Prompts**: Codex v2 integration works through natural language interaction

### 🎨 **Enhanced CLI Experience**
- **Beautiful ASCII Banner**: Eye-catching UX-Kit initialization with colors and emojis
- **Interactive Prompts**: User-friendly AI agent selection with descriptions
- **Progress Indicators**: Visual feedback during setup with animated progress
- **Enhanced UX**: Emojis, colors, and engaging visual feedback throughout the process

### NPM Package Installation

```bash
# Install globally
npm install -g @ux-kit/cli

# Or install locally in your project
npm install --save-dev @ux-kit/cli

# Verify installation
uxkit --help
```

## Quick Start

### Option 1: Try the Demo

```bash
# Explore the demo suite
cat demo/interactive-demo.md

# View generated examples
ls demo/generated-output/
cat demo/generated-output/synthesis.md
```

### Option 2: Use UX-Kit CLI

```bash
# Initialize UX-Kit in your project (with beautiful ASCII banner!)
uxkit init

# Or specify your AI agent directly
uxkit init --aiAgent cursor

# Create a research study
uxkit study:create --name "User Onboarding Research"

# List all studies
uxkit study:list

# Show study details
uxkit study:show <study-id>

# Delete a study
uxkit study:delete <study-id>

# Show help
uxkit --help
```

### Option 3: AI Agent Integration

#### Cursor IDE Integration
```bash
# Initialize with Cursor IDE integration
uxkit init --aiAgent cursor

# This creates:
# - .cursor/commands/ directory with custom slash commands
# - /specify, /research, /study, and /synthesize commands
# - Ready-to-use IDE integration

# In Cursor IDE, you can now use:
# /specify "Create a new feature specification"
# /research "Generate research questions for user onboarding"
# /study "Create a new research study"
# /synthesize "Synthesize insights from research data"
```

#### Codex v2 Integration
```bash
# Initialize with Codex v2 integration
uxkit init --aiAgent codex

# This creates:
# - codex.md configuration file in project root
# - .codex/ directory with README and prompts/
# - 5 UX research prompt templates (create-study, generate-questions, etc.)
# - Natural language prompt support

# Use natural language prompts with Codex:
# "Create a new UX research study about mobile app navigation"
# "Generate interview questions for testing the checkout process"
# "Synthesize findings from last week's user interviews"
```

## Features

### Core Capabilities

- **Spec-Driven Research**: Create structured research specifications
- **AI Agent Integration**: Support for Cursor, Codex v2, and Custom AI agents
- **File-Based Approach**: Simple text files and scripts, no complex databases
- **IDE Integration**: Slash commands for seamless workflow integration
- **Template System**: Handlebars-style templates for consistent research outputs
- **Beautiful CLI Experience**: ASCII art banners, progress indicators, and interactive prompts
- **Cross-Platform Support**: Works on macOS, Linux, and WSL
- **Natural Language Prompts**: Codex v2 integration with custom prompt templates

### Research Workflow

- **Study Management**: Create, list, show, and delete research studies ✅ **Implemented**
- **Project Initialization**: Set up UX-Kit directory structure and configuration ✅ **Implemented**
- **Template System**: Handlebars-style templates for research artifacts ✅ **Implemented**
- **File Generation**: Markdown files with professional formatting ✅ **Implemented**
- **Directory Management**: Organized study structure with metadata ✅ **Implemented**
- **Cross-Platform Support**: Works on macOS, Linux, and WSL ✅ **Implemented**
- **Question Generation**: Structured research questions with primary/secondary categorization ✅ **Implemented**
- **Source Collection**: Automatic discovery and categorization of research sources ✅ **Implemented**
- **Interview Processing**: Transcript analysis with participant profiling ✅ **Implemented**
- **Research Synthesis**: Comprehensive insights with actionable recommendations ✅ **Implemented**
- **Source Summarization**: Generate summaries for individual research sources ✅ **Implemented**

### Advanced Features

- **AI Agent Integration**: Enhanced question generation with Cursor, Claude, or custom agents ✅ **Implemented**
- **Cursor IDE Integration**: Automatic generation of custom slash commands ✅ **Implemented**
- **Interactive CLI Experience**: Beautiful ASCII banners, progress indicators, and user prompts ✅ **Implemented**
- **Slash Command System**: IDE integration for seamless workflow ✅ **Implemented**

### Planned Features

- **Executive Summaries**: Stakeholder-ready summaries with key findings
- **Advanced Templates**: More sophisticated Handlebars templates with conditional logic
- **Additional AI Agents**: Support for more AI platforms and integrations

### Technical Features

- **743+ Tests Passing**: Comprehensive test coverage with validation
- **Cross-Platform**: Works on macOS, Linux, and WSL
- **TypeScript**: Full type safety with strict mode compliance
- **Clean Architecture**: Layered design with dependency injection
- **Professional Output**: Markdown files with tables, code blocks, and formatting
- **AI Agent Integration**: Cursor, Codex v2, and Custom agent support
- **File System Operations**: Robust file and directory management
- **Error Handling**: Comprehensive error handling and user feedback

## Architecture

UX-Kit follows a simple layered architecture:

- **CLI Layer**: Command parsing, argument handling, and user interface
- **Service Layer**: File generation, template processing, and AI agent integration
- **Utility Layer**: File system operations, path handling, and cross-platform support

## 🎮 Demo Scenarios

### E-commerce Checkout Optimization
Our demo showcases a complete UX research study for optimizing an e-commerce checkout flow:

**Key Features Demonstrated:**

- Complete CLI workflow from initialization to study management
- Professional directory structure creation
- Template system with Handlebars-style syntax
- Cross-platform file system operations
- Study metadata management and organization

**Generated Artifacts:**

- Study directory structure with proper organization
- Study metadata and configuration files
- Template files for research artifacts
- Professional Markdown formatting
- Cross-platform file system operations

### CLI Workflow Example
Here's how to use UX-Kit for a complete research study:

```bash
# 1. Initialize UX-Kit in your project
uxkit init

# 2. Create a research study
uxkit study:create --name "E-commerce Checkout Optimization" --description "Research study for optimizing checkout flow"

# 3. List all studies
uxkit study:list

# 4. Show study details (use the study ID from the list)
uxkit study:show 001-e-commerce-checkout-optimization

# 5. Generate research questions
uxkit research:questions --study 001-e-commerce-checkout-optimization --topic "How do users experience our checkout flow?"

# 6. Collect research sources
uxkit research:sources --study 001-e-commerce-checkout-optimization

# 7. Process interview transcripts
uxkit research:interview --study 001-e-commerce-checkout-optimization --transcript "User interview transcript content..."

# 8. Generate source summaries
uxkit research:summarize --study 001-e-commerce-checkout-optimization --sourceId source-123

# 9. Synthesize insights from all artifacts
uxkit research:synthesize --study 001-e-commerce-checkout-optimization

# 10. Delete a study when done
uxkit study:delete 001-e-commerce-checkout-optimization
```

## 📚 Research Commands Tutorial

### Complete Research Workflow Demo

Let's walk through a complete UX research study using UX-Kit:

#### Step 1: Project Setup
```bash
# Initialize UX-Kit in your project
uxkit init

# This creates:
# - .uxkit/ directory structure
# - config.yaml configuration file
# - templates/ directory with research templates
# - studies/ directory for research studies
```

#### Step 2: Create a Research Study
```bash
# Create a new research study
uxkit study:create --name "E-commerce Checkout Optimization" --description "Research study for optimizing checkout flow"

# Output:
# Creating study: E-commerce Checkout Optimization
# Study created successfully with ID: 001-e-commerce-checkout-optimization
# Study directory: /path/to/project/.uxkit/studies/001-e-commerce-checkout-optimization
```

#### Step 3: Generate Research Questions
```bash
# Generate research questions for the study
uxkit research:questions --study 001-e-commerce-checkout-optimization --topic "How do users experience our checkout flow?"

# This creates: .uxkit/studies/001-e-commerce-checkout-optimization/questions.md
```

#### Step 4: View Generated Files
```bash
# List all studies
uxkit study:list

# Show study details
uxkit study:show 001-e-commerce-checkout-optimization

# View the generated questions file
cat .uxkit/studies/001-e-commerce-checkout-optimization/questions.md
```

#### Step 5: Study Management
```bash
# List all studies
uxkit study:list

# Show specific study details
uxkit study:show 001-e-commerce-checkout-optimization

# Delete a study when done
uxkit study:delete 001-e-commerce-checkout-optimization
```

### Generated File Structure

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
        ├── sources.md
        ├── insights.md
        └── interviews/
```

### Research Questions Example

The `questions.md` file generated by the questions command contains:

```markdown
# Research Questions for Study: E-commerce Checkout Optimization

**Study ID**: 001-e-commerce-checkout-optimization
**Date**: 2025-09-19T00:34:16.483Z

## Core Questions
<!-- Add your research questions here -->

## Sub-Questions
<!-- Add sub-questions here -->

## AI Generated Prompts
<!-- AI-generated prompts will appear here -->
```

### Template System Showcase
The demo demonstrates our powerful template system:

```handlebars
{{#each keyFindings}}
### {{title}}
{{description}}
**Evidence**: {{evidence}}
**Impact**: {{impact}}
{{/each}}
```

**Template Features:**

- Variable substitution with `{{variableName}}`
- Conditional logic with `{{#if condition}}...{{/if}}`
- Iteration over arrays with `{{#each array}}...{{/each}}`
- Complex data structure handling

## 📊 Project Metrics

### Code Quality

- **50+ TypeScript files** with extensive codebase
- **743+ tests** with comprehensive coverage
- **Clean Architecture** with layered design and dependency injection
- **Type Safety** with TypeScript strict mode compliance
- **AI Agent Integration** with Cursor, Codex v2, and Custom support
- **File System Operations** with robust error handling

### Test Coverage

- **Unit Tests**: All components individually tested
- **Integration Tests**: Complete workflow testing
- **Use Case Tests**: TDD approach with realistic scenarios
- **Cross-Platform Tests**: macOS, Linux, and WSL compatibility

### Demo Artifacts

- **5 Template Types**: Questions, Sources, Interview, Synthesis, Summary
- **10+ CLI Commands**: Complete workflow management
- **Professional Output**: Markdown files with tables and formatting
- **Realistic Data**: E-commerce checkout optimization study
- **AI Agent Integration**: Cursor and Codex v2 examples
- **Custom Prompts**: UX research prompt templates for Codex v2

## Development

### For Contributors
```bash
# Clone and setup
git clone https://github.com/ux-kit/cli.git
cd ux-kit
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Test CLI during development
node dist/index.js --help
```

### For Users
```bash
# Install globally
npm install -g @ux-kit/cli

# Use the CLI
uxkit --help
uxkit init
```

## 🤖 AI Agent Integration

### Cursor IDE Integration
- **Automatic Setup**: Detects Cursor IDE installation and generates custom slash commands
- **Slash Commands**: `/specify`, `/research`, `/study`, `/synthesize` for seamless workflow
- **IDE Integration**: Commands appear in Cursor's command palette
- **Workflow Integration**: Direct integration with Cursor's AI capabilities

### Codex v2 Integration
- **Configuration File**: Creates `codex.md` in project root with UX research instructions
- **Custom Prompts**: Generates `.codex/prompts/` directory with 5 specialized UX research prompt templates:
  - `create-study.md` - Create new UX research studies
  - `generate-questions.md` - Generate research questions
  - `synthesize-findings.md` - Analyze and synthesize research data
  - `create-personas.md` - Develop user personas
  - `research-plan.md` - Create comprehensive research plans
- **Natural Language**: Works through natural language prompts instead of CLI commands
- **IDE Integration**: Codex v2 works through IDE integration, not CLI commands

### Custom AI Agents
- **Flexible Configuration**: Support for custom AI agent setups
- **Template System**: Handlebars-style templates for consistent outputs
- **File-Based**: Simple text files and scripts, no complex databases

## 📚 Documentation

- **[Documentation Index](DOCUMENTATION.md)** - Complete documentation navigation
- **[Project Status](PROJECT_STATUS.md)** - Detailed project progress
- **[Task Specifications](.specify/specs/tasks.md)** - Complete task breakdown
- **[Quickstart Guide](.specify/specs/quickstart.md)** - Getting started guide
- **[Demo Suite](demo/)** - Comprehensive demo and examples
- **[Capabilities Overview](demo/capabilities-overview.md)** - Complete feature list

## License

MIT License - see [LICENSE](LICENSE) for details.
