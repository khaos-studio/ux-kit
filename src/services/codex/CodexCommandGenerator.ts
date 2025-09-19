/**
 * CodexCommandGenerator Service
 * 
 * This service provides template generation functionality for Codex commands,
 * implementing the ICodexCommandGenerator interface.
 */

import { ICodexCommandGenerator } from '../../contracts/domain-contracts';
import { IFileSystemService } from '../../contracts/infrastructure-contracts';
import {
  CodexConfiguration,
  CodexCommandTemplate,
  CodexCommandParameter
} from '../../contracts/domain-contracts';

/**
 * Service for generating and managing Codex command templates
 */
export class CodexCommandGenerator implements ICodexCommandGenerator {
  private readonly fileSystemService: IFileSystemService;
  private readonly defaultTemplatePath: string = 'templates/codex';

  constructor(fileSystemService: IFileSystemService) {
    this.fileSystemService = fileSystemService;
  }

  /**
   * Generate Codex v2 configuration file and prompts
   */
  async generateTemplates(config: CodexConfiguration): Promise<void> {
    try {
      // For Codex v2, we create a codex.md file in the project root
      const projectRoot = config.templatePath || process.cwd();
      const codexConfigPath = `${projectRoot}/codex.md`;
      
      // Generate the codex.md file with UX-Kit specific instructions
      const codexConfig = this.generateCodexConfig();
      await this.fileSystemService.writeFile(codexConfigPath, codexConfig);
      
      // Create .codex directory structure following Codex v2 patterns
      const codexDir = `${projectRoot}/.codex`;
      const promptsDir = `${codexDir}/prompts`;
      
      const codexDirExists = await this.fileSystemService.directoryExists(codexDir);
      if (!codexDirExists) {
        await this.fileSystemService.createDirectory(codexDir);
      }
      
      const promptsDirExists = await this.fileSystemService.directoryExists(promptsDir);
      if (!promptsDirExists) {
        await this.fileSystemService.createDirectory(promptsDir);
      }
      
      // Create UX research specific prompts following Codex v2 pattern
      await this.generateUXResearchPrompts(promptsDir);
      
      // Create a README in the .codex directory explaining the setup
      const readmeContent = this.generateCodexReadme();
      await this.fileSystemService.writeFile(`${codexDir}/README.md`, readmeContent);
      
    } catch (error) {
      throw new Error(`Failed to generate Codex v2 configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get specific template by name
   */
  async getTemplate(name: string): Promise<CodexCommandTemplate | null> {
    try {
      const filePath = `${this.defaultTemplatePath}/${name}.md`;
      const fileExists = await this.fileSystemService.fileExists(filePath);
      
      if (!fileExists) {
        return null;
      }

      const markdown = await this.fileSystemService.readFile(filePath);
      return this.parseMarkdownTemplate(name, markdown);
    } catch (error) {
      return null;
    }
  }

  /**
   * List all available templates
   */
  async listTemplates(): Promise<readonly CodexCommandTemplate[]> {
    try {
      const files = await this.fileSystemService.listFiles(this.defaultTemplatePath, '*.md');
      const templates: CodexCommandTemplate[] = [];

      for (const file of files) {
        // Only process .md files
        if (file.endsWith('.md')) {
          const fileName = file.replace('.md', '');
          const template = await this.getTemplate(fileName);
          if (template) {
            templates.push(template);
          }
        }
      }

      return templates;
    } catch (error) {
      return [];
    }
  }

  /**
   * Validate template structure
   */
  validateTemplate(template: CodexCommandTemplate): boolean {
    // Check required fields
    if (!template.name || !template.description || !template.command || 
        !template.category || !template.version) {
      return false;
    }

    // Check parameters
    if (template.parameters) {
      for (const param of template.parameters) {
        if (!param.name || !param.type || !param.description) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Generate template for specific command
   */
  async generateCommandTemplate(commandName: string, config: CodexConfiguration): Promise<CodexCommandTemplate> {
    const defaultTemplates = this.getDefaultTemplates();
    const template = defaultTemplates.find(t => t.name === commandName);

    if (!template) {
      throw new Error(`Unknown command: ${commandName}`);
    }

    return template;
  }

  /**
   * Format template as markdown
   */
  formatTemplateAsMarkdown(template: CodexCommandTemplate): string {
    const title = template.name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    let markdown = `# ${title} Template\n\n`;
    markdown += `## Description\n${template.description}\n\n`;
    markdown += `## Command\n\`${template.command}\`\n\n`;

    if (template.parameters && template.parameters.length > 0) {
      markdown += `## Parameters\n`;
      for (const param of template.parameters) {
        const required = param.required ? 'required' : 'optional';
        markdown += `- ${param.name} (${param.type}, ${required}): ${param.description}\n`;
      }
      markdown += '\n';
    } else {
      markdown += `## Parameters\n\n`;
    }

    if (template.examples && template.examples.length > 0) {
      markdown += `## Examples\n`;
      for (const example of template.examples) {
        markdown += `- \`${example}\`\n`;
      }
      markdown += '\n';
    } else {
      markdown += `## Examples\n\n`;
    }

    markdown += `## Category\n${template.category}\n\n`;
    markdown += `## Version\n${template.version}\n`;

    return markdown;
  }

  /**
   * Parse markdown template
   */
  parseMarkdownTemplate(name: string, markdown: string): CodexCommandTemplate {
    const lines = markdown.split('\n');
    let description = '';
    let command = '';
    let parameters: CodexCommandParameter[] = [];
    let examples: string[] = [];
    let category = '';
    let version = '';

    let currentSection = '';
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('## Description')) {
        currentSection = 'description';
        continue;
      } else if (trimmedLine.startsWith('## Command')) {
        currentSection = 'command';
        continue;
      } else if (trimmedLine.startsWith('## Parameters')) {
        currentSection = 'parameters';
        continue;
      } else if (trimmedLine.startsWith('## Examples')) {
        currentSection = 'examples';
        continue;
      } else if (trimmedLine.startsWith('## Category')) {
        currentSection = 'category';
        continue;
      } else if (trimmedLine.startsWith('## Version')) {
        currentSection = 'version';
        continue;
      }

      if (currentSection === 'description' && trimmedLine && !trimmedLine.startsWith('#')) {
        description = trimmedLine;
      } else if (currentSection === 'command' && trimmedLine.startsWith('`') && trimmedLine.endsWith('`')) {
        command = trimmedLine.slice(1, -1);
      } else if (currentSection === 'parameters' && trimmedLine.startsWith('- ')) {
        const paramMatch = trimmedLine.match(/^- (\w+) \((\w+), (required|optional)\): (.+)$/);
        if (paramMatch && paramMatch[1] && paramMatch[2] && paramMatch[4]) {
          parameters.push({
            name: paramMatch[1],
            type: paramMatch[2] as any,
            required: paramMatch[3] === 'required',
            description: paramMatch[4]
          });
        }
      } else if (currentSection === 'examples' && trimmedLine.startsWith('- `') && trimmedLine.endsWith('`')) {
        examples.push(trimmedLine.slice(3, -1));
      } else if (currentSection === 'category' && trimmedLine && !trimmedLine.startsWith('#')) {
        category = trimmedLine;
      } else if (currentSection === 'version' && trimmedLine && !trimmedLine.startsWith('#')) {
        version = trimmedLine;
      }
    }

    if (!description || !command || !category || !version) {
      throw new Error('Invalid template format');
    }

    return {
      name,
      description,
      command,
      parameters,
      examples,
      category,
      version
    };
  }

  /**
   * Generate Codex v2 configuration file content
   */
  generateCodexConfig(): string {
    return `# Codex Configuration for UX-Kit

This file provides instructions for Codex v2 on how to work with UX-Kit research workflows.

## Project Overview

This is a UX research project using UX-Kit. UX-Kit is a toolkit for conducting user experience research with structured workflows for studies, interviews, and synthesis.

## Available Commands

You can help with the following UX research tasks:

### Study Management
- **Create Study**: "Create a new UX research study called [name]"
- **List Studies**: "Show me all the research studies in this project"
- **Study Details**: "Show me details about study [study-id]"

### Research Workflow
- **Generate Questions**: "Generate research questions for study [study-id] about [topic]"
- **Collect Sources**: "Help me collect research sources for study [study-id]"
- **Process Interview**: "Process this interview transcript for study [study-id]"
- **Synthesize Findings**: "Synthesize the research findings for study [study-id]"
- **Create Summary**: "Create a summary of study [study-id] findings"

### File Structure
- Studies are stored in \`.uxkit/studies/\`
- Each study has its own directory with configuration and data files
- Templates are available in \`.uxkit/templates/\`

## How to Help

When working with UX research tasks:

1. **Understand the Context**: Always consider the research goals and user needs
2. **Follow UX Best Practices**: Use established UX research methodologies
3. **Maintain Structure**: Keep research data organized and accessible
4. **Generate Quality Content**: Create clear, actionable research outputs

## Example Prompts

- "Create a new study about user onboarding experience"
- "Generate interview questions for understanding user pain points"
- "Help me synthesize findings from 5 user interviews"
- "Create a research summary for stakeholder presentation"

## File Locations

- Study data: \`.uxkit/studies/[study-id]/\`
- Templates: \`.uxkit/templates/\`
- Configuration: \`.uxkit/config.yaml\`
- This file: \`codex.md\`

Remember: Always work within the UX-Kit structure and maintain the integrity of research data.
`;
  }

  /**
   * Generate UX research specific prompts following Codex v2 pattern
   */
  private async generateUXResearchPrompts(promptsDir: string): Promise<void> {
    const prompts = [
      {
        name: 'create-study.md',
        content: `# Create UX Research Study

Create a new UX research study with proper structure and documentation.

## Usage
Use this prompt to set up a new research study with all necessary components.

## Example
"Create a new UX research study about mobile app onboarding experience"

## What it does
- Creates study directory structure
- Sets up configuration files
- Generates initial research plan
- Creates templates for data collection
`
      },
      {
        name: 'generate-questions.md',
        content: `# Generate Research Questions

Generate comprehensive research questions for user interviews and surveys.

## Usage
Use this prompt to create well-structured research questions for your study.

## Example
"Generate interview questions for understanding user pain points in the checkout process"

## What it does
- Creates open-ended interview questions
- Generates follow-up questions
- Suggests survey questions
- Provides question validation guidelines
`
      },
      {
        name: 'synthesize-findings.md',
        content: `# Synthesize Research Findings

Analyze and synthesize findings from user research data.

## Usage
Use this prompt to process and analyze research data to extract insights.

## Example
"Synthesize findings from 5 user interviews about mobile app usability"

## What it does
- Analyzes interview transcripts
- Identifies common themes and patterns
- Creates affinity diagrams
- Generates actionable insights
- Produces research reports
`
      },
      {
        name: 'create-personas.md',
        content: `# Create User Personas

Develop user personas based on research findings and data.

## Usage
Use this prompt to create detailed user personas from research insights.

## Example
"Create user personas based on our mobile app research findings"

## What it does
- Analyzes user data and behaviors
- Identifies distinct user segments
- Creates detailed persona profiles
- Generates persona documentation
- Suggests design implications
`
      },
      {
        name: 'research-plan.md',
        content: `# Create Research Plan

Develop a comprehensive research plan for your UX study.

## Usage
Use this prompt to create a structured research plan with methodology and timeline.

## Example
"Create a research plan for studying e-commerce checkout experience"

## What it does
- Defines research objectives
- Selects appropriate methodologies
- Creates timeline and milestones
- Identifies required resources
- Plans data collection and analysis
`
      }
    ];

    for (const prompt of prompts) {
      const promptPath = `${promptsDir}/${prompt.name}`;
      await this.fileSystemService.writeFile(promptPath, prompt.content);
    }
  }

  /**
   * Generate README for .codex directory
   */
  generateCodexReadme(): string {
    return `# Codex Integration for UX-Kit

This directory contains additional configuration for Codex v2 integration with UX-Kit.

## What's Here

- \`README.md\` - This file explaining the Codex integration
- \`prompts/\` - Directory containing UX research specific prompts
- Future configuration files may be added here

## How It Works

Codex v2 reads the \`codex.md\` file in the project root to understand how to help with UX research tasks. The main configuration is in that file, not in this directory.

## Getting Started

1. Make sure Codex v2 is installed and configured in your IDE
2. The \`codex.md\` file in the project root contains all the instructions
3. Use natural language prompts to ask Codex for help with UX research tasks
4. Access the custom prompts in the \`prompts/\` directory via Codex's slash commands

## Available Prompts

- \`create-study.md\` - Create new UX research studies
- \`generate-questions.md\` - Generate research questions
- \`synthesize-findings.md\` - Analyze and synthesize research data
- \`create-personas.md\` - Develop user personas
- \`research-plan.md\` - Create comprehensive research plans

## Example Usage

- "Create a new UX research study about mobile app usability"
- "Generate interview questions for user feedback collection"
- "Help me synthesize findings from user interviews"

For more information, see the \`codex.md\` file in the project root.
`;
  }

  /**
   * Get default template definitions (kept for backward compatibility)
   */
  getDefaultTemplates(): readonly CodexCommandTemplate[] {
    return [
      {
        name: 'specify',
        description: 'Create or update the feature specification from a natural language feature description',
        command: 'codex specify {featureDescription}',
        parameters: [
          {
            name: 'featureDescription',
            type: 'string',
            required: true,
            description: 'Natural language description of the feature to specify'
          }
        ],
        examples: [
          'codex specify "Add user authentication with email and password"',
          'codex specify "Create a dashboard showing user analytics and metrics"'
        ],
        category: 'ux-research',
        version: '1.0.0'
      },
      {
        name: 'research',
        description: 'Generate research questions and methodology for a UX study',
        command: 'codex research {studyTopic} --study {studyId}',
        parameters: [
          {
            name: 'studyTopic',
            type: 'string',
            required: true,
            description: 'Topic or area to research'
          },
          {
            name: 'studyId',
            type: 'string',
            required: false,
            description: 'Study ID or name (auto-generated if not provided)'
          }
        ],
        examples: [
          'codex research "How do users discover product features?" --study 001-feature-discovery',
          'codex research "User onboarding experience"'
        ],
        category: 'ux-research',
        version: '1.0.0'
      },
      {
        name: 'study',
        description: 'Create a new UX research study with specified parameters',
        command: 'codex study create {studyName} --type {studyType} --participants {participantCount}',
        parameters: [
          {
            name: 'studyName',
            type: 'string',
            required: true,
            description: 'Name of the study to create'
          },
          {
            name: 'studyType',
            type: 'string',
            required: false,
            description: 'Type of study (interview, survey, usability-test, etc.)',
            defaultValue: 'interview'
          },
          {
            name: 'participantCount',
            type: 'number',
            required: false,
            description: 'Number of participants',
            defaultValue: 5
          }
        ],
        examples: [
          'codex study create "User Onboarding Research" --type interview --participants 8',
          'codex study create "Feature Discovery Study" --type usability-test'
        ],
        category: 'ux-research',
        version: '1.0.0'
      },
      {
        name: 'synthesize',
        description: 'Synthesize research findings and generate insights',
        command: 'codex synthesize {studyId} --output {outputFormat}',
        parameters: [
          {
            name: 'studyId',
            type: 'string',
            required: true,
            description: 'Study ID to synthesize findings for'
          },
          {
            name: 'outputFormat',
            type: 'string',
            required: false,
            description: 'Output format (markdown, json, html)',
            defaultValue: 'markdown'
          }
        ],
        examples: [
          'codex synthesize 001-user-research --output markdown',
          'codex synthesize 002-feature-discovery --output json'
        ],
        category: 'ux-research',
        version: '1.0.0'
      },
      {
        name: 'interview',
        description: 'Process and format an interview transcript',
        command: 'codex interview {studyId} --transcript {transcriptContent} --participant {participantId}',
        parameters: [
          {
            name: 'studyId',
            type: 'string',
            required: true,
            description: 'Study ID the interview belongs to'
          },
          {
            name: 'transcriptContent',
            type: 'string',
            required: true,
            description: 'Interview transcript content or file path'
          },
          {
            name: 'participantId',
            type: 'string',
            required: false,
            description: 'Participant ID (auto-generated if not provided)'
          }
        ],
        examples: [
          'codex interview 001-user-research --transcript "User interview transcript..." --participant P001',
          'codex interview 002-feature-discovery --transcript /path/to/transcript.txt'
        ],
        category: 'ux-research',
        version: '1.0.0'
      },
      {
        name: 'questions',
        description: 'Generate research questions for a study',
        command: 'codex questions {studyId} --topic {researchTopic}',
        parameters: [
          {
            name: 'studyId',
            type: 'string',
            required: true,
            description: 'Study ID to generate questions for'
          },
          {
            name: 'researchTopic',
            type: 'string',
            required: false,
            description: 'Specific research topic or prompt'
          }
        ],
        examples: [
          'codex questions 001-user-research --topic "How do users discover our product features?"',
          'codex questions 002-feature-discovery'
        ],
        category: 'ux-research',
        version: '1.0.0'
      },
      {
        name: 'sources',
        description: 'Collect and organize research sources for a study',
        command: 'codex sources {studyId} --autoDiscover {autoDiscover}',
        parameters: [
          {
            name: 'studyId',
            type: 'string',
            required: true,
            description: 'Study ID to add sources to'
          },
          {
            name: 'autoDiscover',
            type: 'boolean',
            required: false,
            description: 'Automatically discover relevant files in the project',
            defaultValue: false
          }
        ],
        examples: [
          'codex sources 001-user-research --autoDiscover true',
          'codex sources 002-feature-discovery'
        ],
        category: 'ux-research',
        version: '1.0.0'
      },
      {
        name: 'summarize',
        description: 'Generate a summary of research findings',
        command: 'codex summarize {studyId} --format {summaryFormat}',
        parameters: [
          {
            name: 'studyId',
            type: 'string',
            required: true,
            description: 'Study ID to summarize'
          },
          {
            name: 'summaryFormat',
            type: 'string',
            required: false,
            description: 'Summary format (executive, detailed, bullet-points)',
            defaultValue: 'executive'
          }
        ],
        examples: [
          'codex summarize 001-user-research --format executive',
          'codex summarize 002-feature-discovery --format detailed'
        ],
        category: 'ux-research',
        version: '1.0.0'
      }
    ];
  }
}
