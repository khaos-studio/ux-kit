"use strict";
/**
 * Command Documentation Generator
 *
 * Generates comprehensive documentation for all CLI commands.
 * This includes command descriptions, usage examples, options, and parameters.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandDocumentationGenerator = void 0;
class CommandDocumentationGenerator {
    constructor(fileSystem) {
        this.fileSystem = fileSystem;
    }
    /**
     * Generate command documentation
     */
    async generateCommandDocumentation(projectRoot, outputPath) {
        const commandsPath = `${outputPath}/commands`;
        await this.fileSystem.ensureDirectoryExists(commandsPath);
        // Generate main commands README
        await this.generateCommandsReadme(commandsPath);
        // Generate individual command documentation
        await Promise.all([
            this.generateInitCommandDoc(commandsPath),
            this.generateStudyCommandDoc(commandsPath),
            this.generateResearchCommandDoc(commandsPath)
        ]);
    }
    /**
     * Generate main commands README
     */
    async generateCommandsReadme(commandsPath) {
        const content = `# CLI Commands

UX-Kit provides a comprehensive set of CLI commands for managing UX research workflows.

## Available Commands

### init
Initialize a new UX-Kit project in the current directory.
- **Usage**: \`uxkit init\`
- **Description**: Creates the \`.uxkit/\` directory structure and copies template files
- **See**: [Init Command](./init.md)

### study
Manage research studies.
- **Usage**: \`uxkit study <command>\`
- **Commands**: create, list, show, delete
- **See**: [Study Commands](./study.md)

### research
Generate research artifacts and workflows.
- **Usage**: \`uxkit research <command>\`
- **Commands**: questions, sources, summarize, interview, synthesize
- **See**: [Research Commands](./research.md)

## Getting Started

1. **Initialize your project**:
   \`\`\`bash
   uxkit init
   \`\`\`

2. **Create your first study**:
   \`\`\`bash
   uxkit study create "My Research Study"
   \`\`\`

3. **Generate research questions**:
   \`\`\`bash
   uxkit research questions
   \`\`\`

## Command Structure

All UX-Kit commands follow a consistent structure:

\`\`\`bash
uxkit <category> <command> [options] [arguments]
\`\`\`

### Categories

- **study**: Study management commands
- **research**: Research workflow commands

### Options

Most commands support these common options:

- \`--help\`, \`-h\`: Show help information
- \`--verbose\`, \`-v\`: Enable verbose output
- \`--dry-run\`: Show what would be done without making changes

### Arguments

Command-specific arguments are documented in each command's individual documentation.

## Examples

### Basic Workflow

\`\`\`bash
# Initialize project
uxkit init

# Create study
uxkit study create "User Onboarding Research"

# Generate questions
uxkit research questions

# Add sources
uxkit research sources

# Create summary
uxkit research summarize
\`\`\`

### Advanced Usage

\`\`\`bash
# List all studies
uxkit study list

# Show study details
uxkit study show "User Onboarding Research"

# Generate interview template
uxkit research interview

# Synthesize insights
uxkit research synthesize
\`\`\`

## Error Handling

UX-Kit provides clear error messages and suggestions for common issues:

- **Invalid command**: Shows available commands
- **Missing arguments**: Shows required arguments
- **File system errors**: Provides specific error details
- **Configuration issues**: Suggests fixes

## Getting Help

- Use \`--help\` with any command for detailed information
- Check individual command documentation for specific usage
- See [User Guide](../user-guide/README.md) for tutorials
- Review [Examples](../examples/README.md) for real-world scenarios
`;
        await this.fileSystem.writeFile(`${commandsPath}/README.md`, content);
    }
    /**
     * Generate init command documentation
     */
    async generateInitCommandDoc(commandsPath) {
        const content = `# Init Command

The \`init\` command initializes a new UX-Kit project in the current directory.

## Usage

\`\`\`bash
uxkit init [options]
\`\`\`

## Description

Initializes a new UX-Kit project. The init command sets up the necessary directory structure and files for a UX-Kit project:

- Creates \`.uxkit/\` directory
- Creates \`.uxkit/studies/\` directory for research studies
- Copies template files to \`.uxkit/templates/\`
- Creates default configuration file
- Sets up initial project structure

## Options

- \`--help\`, \`-h\`: Show help information
- \`--verbose\`, \`-v\`: Enable verbose output
- \`--force\`: Overwrite existing files

## Examples

### Basic Initialization

\`\`\`bash
uxkit init
\`\`\`

### Verbose Initialization

\`\`\`bash
uxkit init --verbose
\`\`\`

### Force Overwrite

\`\`\`bash
uxkit init --force
\`\`\`

## What Gets Created

After running \`uxkit init\`, you'll have:

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

## Configuration

The init command creates a default configuration file at \`.uxkit/config.yaml\`:

\`\`\`yaml
version: 1.0.0
templates:
  questions: questions-template.md
  sources: sources-template.md
  summarize: summarize-template.md
  interview: interview-template.md
  synthesis: synthesis-template.md
\`\`\`

## Next Steps

After initialization:

1. **Create a study**: \`uxkit study create "My Study"\`
2. **Generate questions**: \`uxkit research questions\`
3. **Add sources**: \`uxkit research sources\`

## Troubleshooting

### Directory Already Exists

If \`.uxkit/\` already exists, use \`--force\` to overwrite:

\`\`\`bash
uxkit init --force
\`\`\`

### Permission Errors

Ensure you have write permissions in the current directory:

\`\`\`bash
# Check permissions
ls -la

# Fix permissions if needed
chmod 755 .
\`\`\`

### Template Files Missing

If template files are missing, re-run init:

\`\`\`bash
uxkit init --force
\`\`\`
`;
        await this.fileSystem.writeFile(`${commandsPath}/init.md`, content);
    }
    /**
     * Generate study command documentation
     */
    async generateStudyCommandDoc(commandsPath) {
        const content = `# Study Commands

Study commands manage research studies in your UX-Kit project.

## Usage

\`\`\`bash
uxkit study <command> [options] [arguments]
\`\`\`

## Available Commands

### create
Create a new research study.

\`\`\`bash
uxkit study create <name> [description]
\`\`\`

**Arguments:**
- \`name\`: Study name (required)
- \`description\`: Study description (optional)

**Examples:**
\`\`\`bash
uxkit study create "User Onboarding Research"
uxkit study create "Feature Evaluation" "Evaluate new feature usability"
\`\`\`

### list
List all studies in the project.

\`\`\`bash
uxkit study list
\`\`\`

**Output:**
- Study ID
- Study name
- Creation date
- Status

### show
Show detailed information about a study.

\`\`\`bash
uxkit study show <study-id-or-name>
\`\`\`

**Arguments:**
- \`study-id-or-name\`: Study ID or name (required)

**Examples:**
\`\`\`bash
uxkit study show "001-user-onboarding-research"
uxkit study show "User Onboarding Research"
\`\`\`

### delete
Delete a study and all its data.

\`\`\`bash
uxkit study delete <study-id-or-name> [--force]
\`\`\`

**Arguments:**
- \`study-id-or-name\`: Study ID or name (required)

**Options:**
- \`--force\`: Skip confirmation prompt

**Examples:**
\`\`\`bash
uxkit study delete "001-user-onboarding-research"
uxkit study delete "User Onboarding Research" --force
\`\`\`

## Study Structure

Each study creates the following structure:

\`\`\`
.uxkit/studies/<study-id>/
├── study-config.yaml    # Study configuration
├── questions.md         # Research questions
├── sources.md          # Research sources
├── summaries/          # Study summaries
├── interviews/         # Interview data
└── insights.md         # Research insights
\`\`\`

## Study Configuration

Each study has a configuration file with:

\`\`\`yaml
version: 1.0.0
studyId: 001-user-onboarding-research
name: User Onboarding Research
description: Research into improving the new user onboarding flow
status: draft
createdAt: 2024-01-18T10:00:00Z
updatedAt: 2024-01-18T10:00:00Z
\`\`\`

## Examples

### Complete Study Workflow

\`\`\`bash
# Create study
uxkit study create "User Onboarding Research"

# List studies
uxkit study list

# Show study details
uxkit study show "User Onboarding Research"

# Generate research questions
uxkit research questions

# Add sources
uxkit research sources

# Create summary
uxkit research summarize

# Show updated study
uxkit study show "User Onboarding Research"
\`\`\`

### Managing Multiple Studies

\`\`\`bash
# Create multiple studies
uxkit study create "Feature Evaluation"
uxkit study create "User Journey Research"
uxkit study create "Competitive Analysis"

# List all studies
uxkit study list

# Show specific study
uxkit study show "Feature Evaluation"

# Delete a study
uxkit study delete "Competitive Analysis"
\`\`\`

## Study IDs

Studies are automatically assigned sequential IDs:

- \`001-<kebab-case-name>\`
- \`002-<kebab-case-name>\`
- \`003-<kebab-case-name>\`
- etc.

## Best Practices

1. **Use descriptive names**: Make study names clear and specific
2. **Add descriptions**: Provide context for each study
3. **Regular updates**: Keep study information current
4. **Clean up**: Delete studies that are no longer needed
5. **Backup**: Export important studies before deletion

## Troubleshooting

### Study Not Found

If a study isn't found, check the exact name or ID:

\`\`\`bash
# List all studies to see exact names/IDs
uxkit study list

# Use exact ID or name
uxkit study show "001-user-onboarding-research"
\`\`\`

### Permission Errors

Ensure you have write permissions in the project directory:

\`\`\`bash
# Check permissions
ls -la .uxkit/studies/

# Fix permissions if needed
chmod -R 755 .uxkit/studies/
\`\`\`

### Study Already Exists

Study names must be unique. Use a different name or delete the existing study:

\`\`\`bash
# Delete existing study
uxkit study delete "Existing Study"

# Create new study
uxkit study create "New Study Name"
\`\`\`
`;
        await this.fileSystem.writeFile(`${commandsPath}/study.md`, content);
    }
    /**
     * Generate research command documentation
     */
    async generateResearchCommandDoc(commandsPath) {
        const content = `# Research Commands

Research commands generate research artifacts and manage research workflows.

## Usage

\`\`\`bash
uxkit research <command> [options] [arguments]
\`\`\`

## Available Commands

### questions
Generate research questions for a study.

\`\`\`bash
uxkit research questions [--study <study-id-or-name>]
\`\`\`

**Options:**
- \`--study\`: Target study (defaults to most recent)

**Examples:**
\`\`\`bash
uxkit research questions
uxkit research questions --study "User Onboarding Research"
\`\`\`

### sources
Generate sources template for collecting research sources.

\`\`\`bash
uxkit research sources [--study <study-id-or-name>]
\`\`\`

**Options:**
- \`--study\`: Target study (defaults to most recent)

**Examples:**
\`\`\`bash
uxkit research sources
uxkit research sources --study "Feature Evaluation"
\`\`\`

### summarize
Generate summary template for research findings.

\`\`\`bash
uxkit research summarize [--study <study-id-or-name>]
\`\`\`

**Options:**
- \`--study\`: Target study (defaults to most recent)

**Examples:**
\`\`\`bash
uxkit research summarize
uxkit research summarize --study "User Journey Research"
\`\`\`

### interview
Generate interview template for user interviews.

\`\`\`bash
uxkit research interview [--study <study-id-or-name>]
\`\`\`

**Options:**
- \`--study\`: Target study (defaults to most recent)

**Examples:**
\`\`\`bash
uxkit research interview
uxkit research interview --study "User Onboarding Research"
\`\`\`

### synthesize
Generate synthesis template for research insights.

\`\`\`bash
uxkit research synthesize [--study <study-id-or-name>]
\`\`\`

**Options:**
- \`--study\`: Target study (defaults to most recent)

**Examples:**
\`\`\`bash
uxkit research synthesize
uxkit research synthesize --study "Feature Evaluation"
\`\`\`

## Research Workflow

The typical research workflow follows these steps:

1. **Questions**: Define research questions
2. **Sources**: Collect research sources
3. **Summarize**: Create research summaries
4. **Interview**: Conduct user interviews
5. **Synthesize**: Generate insights and findings

## Generated Files

Each research command generates specific files:

### questions
- \`questions.md\`: Structured research questions

### sources
- \`sources.md\`: Template for collecting research sources

### summarize
- \`summaries/<timestamp>-summary.md\`: Research summary

### interview
- \`interviews/<timestamp>-interview.md\`: Interview template

### synthesize
- \`insights.md\`: Research insights and findings

## Templates

Research commands use templates from \`.uxkit/templates/\`:

- \`questions-template.md\`: Research questions template
- \`sources-template.md\`: Sources collection template
- \`summarize-template.md\`: Summary template
- \`interview-template.md\`: Interview template
- \`synthesis-template.md\`: Synthesis template

## Examples

### Complete Research Workflow

\`\`\`bash
# Create study
uxkit study create "User Onboarding Research"

# Generate research questions
uxkit research questions

# Collect sources
uxkit research sources

# Create summary
uxkit research summarize

# Conduct interview
uxkit research interview

# Synthesize insights
uxkit research synthesize
\`\`\`

### Multiple Studies

\`\`\`bash
# Create multiple studies
uxkit study create "Feature Evaluation"
uxkit study create "User Journey Research"

# Generate questions for specific study
uxkit research questions --study "Feature Evaluation"

# Generate sources for another study
uxkit research sources --study "User Journey Research"
\`\`\`

### Custom Templates

You can customize templates by editing files in \`.uxkit/templates/\`:

\`\`\`bash
# Edit questions template
nano .uxkit/templates/questions-template.md

# Generate questions with custom template
uxkit research questions
\`\`\`

## File Structure

Research files are organized in study directories:

\`\`\`
.uxkit/studies/<study-id>/
├── questions.md
├── sources.md
├── insights.md
├── summaries/
│   └── 2024-01-18-10-00-00-summary.md
└── interviews/
    └── 2024-01-18-10-00-00-interview.md
\`\`\`

## Best Practices

1. **Start with questions**: Always begin with clear research questions
2. **Collect diverse sources**: Use multiple source types and perspectives
3. **Regular summaries**: Create summaries throughout the research process
4. **Document interviews**: Record interview insights and observations
5. **Synthesize regularly**: Generate insights at key milestones

## Troubleshooting

### No Study Found

If no study is found, create one first:

\`\`\`bash
uxkit study create "My Research Study"
uxkit research questions
\`\`\`

### Template Not Found

If templates are missing, re-initialize the project:

\`\`\`bash
uxkit init --force
\`\`\`

### File Generation Errors

Check file permissions and disk space:

\`\`\`bash
# Check permissions
ls -la .uxkit/studies/

# Check disk space
df -h
\`\`\`
`;
        await this.fileSystem.writeFile(`${commandsPath}/research.md`, content);
    }
}
exports.CommandDocumentationGenerator = CommandDocumentationGenerator;
//# sourceMappingURL=CommandDocumentationGenerator.js.map