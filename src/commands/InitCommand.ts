/**
 * Init Command
 * 
 * Initializes UX-Kit in a project by creating the .uxkit/ directory structure.
 */

import { ICommand, CommandResult, ValidationResult } from '../contracts/presentation-contracts';
import { DirectoryService } from '../services/DirectoryService';
import { TemplateService } from '../services/TemplateService';
import { IOutput } from '../contracts/presentation-contracts';

export class InitCommand implements ICommand {
  readonly name = 'init';
  readonly description = 'Initialize UX-Kit in the current project';
  readonly usage = 'uxkit init [options]';
  readonly arguments = [];
  readonly options = [
    {
      name: 'aiAgent',
      description: 'AI agent provider to use (cursor, codex, custom)',
      type: 'string' as const,
      required: false,
      defaultValue: 'cursor',
      aliases: ['a']
    },
    {
      name: 'template',
      description: 'Template source to use',
      type: 'string' as const,
      required: false,
      defaultValue: 'default',
      aliases: ['t']
    }
  ];
  readonly examples = [
    {
      description: 'Initialize with default settings',
      command: 'uxkit init'
    },
    {
      description: 'Initialize with specific AI agent',
      command: 'uxkit init --aiAgent codex'
    }
  ];

  constructor(
    private directoryService: DirectoryService,
    private templateService: TemplateService,
    private output: IOutput
  ) {}

  async execute(args: string[], options: Record<string, any>): Promise<CommandResult> {
    try {
      const projectRoot = options.projectRoot || process.cwd();
      
      // Check if already initialized
      if (await this.directoryService.isUXKitInitialized(projectRoot)) {
        return {
          success: true,
          message: 'UX-Kit already initialized in this project'
        };
      }

      this.output.writeln('Creating .uxkit directory structure...');
      
      // Create directory structure
      await this.directoryService.createUXKitStructure(projectRoot);
      
      this.output.writeln('Creating configuration file...');
      
      // Create configuration file
      await this.directoryService.createConfigFile(projectRoot, {
        aiAgent: options.aiAgent
      });
      
      this.output.writeln('Creating memory/principles.md...');
      
      // Create principles file
      await this.directoryService.createPrinciplesFile(projectRoot);
      
      this.output.writeln('Copying template files...');
      
      // Copy template files
      await this.templateService.copyTemplates(projectRoot, options.template);
      
      this.output.writeln('UX-Kit initialized successfully!');
      
      return {
        success: true,
        message: 'UX-Kit initialized successfully in this project',
        data: {
          projectRoot,
          aiAgent: options.aiAgent || 'cursor',
          template: options.template || 'default'
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.output.writeErrorln(`Failed to initialize UX-Kit: ${errorMessage}`);
      
      return {
        success: false,
        message: `Failed to initialize UX-Kit: ${errorMessage}`,
        errors: [errorMessage]
      };
    }
  }

  async validate(args: string[], options: Record<string, any>): Promise<ValidationResult> {
    const errors: Array<{ field: string; message: string; value: any }> = [];

    // Validate AI agent option
    if (options.aiAgent && !['cursor', 'codex', 'custom'].includes(options.aiAgent)) {
      errors.push({
        field: 'aiAgent',
        message: 'AI agent must be one of: cursor, codex, custom',
        value: options.aiAgent
      });
    }

    // Validate template option
    if (options.template && typeof options.template !== 'string') {
      errors.push({
        field: 'template',
        message: 'Template must be a string',
        value: options.template
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  showHelp(): void {
    this.output.writeln(`Usage: ${this.usage}`);
    this.output.writeln(`\n${this.description}`);
    this.output.writeln('\nOptions:');
    this.options.forEach(option => {
      const aliases = option.aliases ? `, -${option.aliases[0]}` : '';
      this.output.writeln(`  --${option.name}${aliases}    ${option.description}`);
    });
    this.output.writeln('\nExamples:');
    this.examples.forEach(example => {
      this.output.writeln(`  ${example.description}: ${example.command}`);
    });
  }
}
