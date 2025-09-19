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
   * Generate all Codex command templates
   */
  async generateTemplates(config: CodexConfiguration): Promise<void> {
    const templatePath = config.templatePath || this.defaultTemplatePath;

    try {
      // Check if template directory exists
      const directoryExists = await this.fileSystemService.directoryExists(templatePath);
      if (!directoryExists) {
        await this.fileSystemService.createDirectory(templatePath);
      }

      // Get default templates and write them to files
      const defaultTemplates = this.getDefaultTemplates();
      for (const template of defaultTemplates) {
        const markdown = this.formatTemplateAsMarkdown(template);
        const filePath = `${templatePath}/${template.name}.md`;
        await this.fileSystemService.writeFile(filePath, markdown);
      }
    } catch (error) {
      throw new Error(`Failed to generate templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
   * Get default template definitions
   */
  getDefaultTemplates(): readonly CodexCommandTemplate[] {
    return [
      {
        name: 'create-project',
        description: 'Create a new project with specified configuration',
        command: 'codex create {projectName} --template {templateType}',
        parameters: [
          {
            name: 'projectName',
            type: 'string',
            required: true,
            description: 'Name of the project to create'
          },
          {
            name: 'templateType',
            type: 'string',
            required: false,
            description: 'Type of template to use',
            defaultValue: 'default'
          }
        ],
        examples: [
          'codex create my-app --template react',
          'codex create my-api --template node'
        ],
        category: 'project',
        version: '1.0.0'
      },
      {
        name: 'generate-component',
        description: 'Generate a new component with specified properties',
        command: 'codex generate component {componentName} --type {componentType}',
        parameters: [
          {
            name: 'componentName',
            type: 'string',
            required: true,
            description: 'Name of the component to generate'
          },
          {
            name: 'componentType',
            type: 'string',
            required: false,
            description: 'Type of component to generate',
            defaultValue: 'functional'
          }
        ],
        examples: [
          'codex generate component Button --type class',
          'codex generate component Modal --type functional'
        ],
        category: 'component',
        version: '1.0.0'
      },
      {
        name: 'run-tests',
        description: 'Run tests for the specified scope',
        command: 'codex test {scope} --coverage {coverage}',
        parameters: [
          {
            name: 'scope',
            type: 'string',
            required: true,
            description: 'Scope of tests to run'
          },
          {
            name: 'coverage',
            type: 'boolean',
            required: false,
            description: 'Whether to generate coverage report',
            defaultValue: false
          }
        ],
        examples: [
          'codex test unit --coverage true',
          'codex test integration'
        ],
        category: 'testing',
        version: '1.0.0'
      },
      {
        name: 'deploy-app',
        description: 'Deploy application to specified environment',
        command: 'codex deploy {environment} --config {configFile}',
        parameters: [
          {
            name: 'environment',
            type: 'string',
            required: true,
            description: 'Target environment for deployment'
          },
          {
            name: 'configFile',
            type: 'string',
            required: false,
            description: 'Configuration file to use',
            defaultValue: 'deploy.json'
          }
        ],
        examples: [
          'codex deploy production --config prod.json',
          'codex deploy staging'
        ],
        category: 'deployment',
        version: '1.0.0'
      },
      {
        name: 'setup-database',
        description: 'Set up database with specified configuration',
        command: 'codex db setup {dbType} --host {host} --port {port}',
        parameters: [
          {
            name: 'dbType',
            type: 'string',
            required: true,
            description: 'Type of database to set up'
          },
          {
            name: 'host',
            type: 'string',
            required: false,
            description: 'Database host',
            defaultValue: 'localhost'
          },
          {
            name: 'port',
            type: 'number',
            required: false,
            description: 'Database port',
            defaultValue: 5432
          }
        ],
        examples: [
          'codex db setup postgres --host localhost --port 5432',
          'codex db setup mysql --host db.example.com'
        ],
        category: 'database',
        version: '1.0.0'
      }
    ];
  }
}
