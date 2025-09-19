/**
 * List Studies Command
 * 
 * Lists all research studies in the project.
 */

import { ICommand, CommandResult, ValidationResult } from '../../contracts/presentation-contracts';
import { StudyService } from '../../services/StudyService';
import { IOutput } from '../../contracts/presentation-contracts';

export class ListStudiesCommand implements ICommand {
  readonly name = 'study:list';
  readonly description = 'List all research studies';
  readonly usage = 'uxkit study:list [options]';
  readonly arguments = [];
  readonly options = [
    {
      name: 'format',
      description: 'Output format (table, json)',
      type: 'string' as const,
      required: false,
      defaultValue: 'table',
      aliases: ['f']
    }
  ];
  readonly examples = [
    {
      description: 'List all studies in table format',
      command: 'uxkit study list'
    },
    {
      description: 'List all studies in JSON format',
      command: 'uxkit study list --format json'
    }
  ];

  constructor(
    private studyService: StudyService,
    private output: IOutput
  ) {}

  async execute(args: string[], options: Record<string, any>): Promise<CommandResult> {
    try {
      const projectRoot = options.projectRoot || process.cwd();
      const format = options.format || 'table';

      this.output.writeln('Fetching studies...');
      
      const studies = await this.studyService.listStudies(projectRoot);
      
      if (studies.length === 0) {
        this.output.writeln('No studies found. Create your first study with: uxkit study create "Study Name"');
        return {
          success: true,
          message: 'No studies found',
          data: []
        };
      }

      if (format === 'json') {
        this.output.writeln(JSON.stringify(studies, null, 2));
      } else {
        this.displayStudiesTable(studies);
      }
      
      return {
        success: true,
        message: `Found ${studies.length} studies`,
        data: studies
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.output.writeErrorln(`Failed to list studies: ${errorMessage}`);
      
      return {
        success: false,
        message: `Failed to list studies: ${errorMessage}`,
        errors: [errorMessage]
      };
    }
  }

  async validate(args: string[], options: Record<string, any>): Promise<ValidationResult> {
    const errors: Array<{ field: string; message: string; value: any }> = [];

    // Validate format option
    if (options.format && !['table', 'json'].includes(options.format)) {
      errors.push({
        field: 'format',
        message: 'Format must be either "table" or "json"',
        value: options.format
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

  private displayStudiesTable(studies: any[]): void {
    this.output.writeln('\nResearch Studies:');
    this.output.writeln('================');
    
    studies.forEach(study => {
      this.output.writeln(`ID: ${study.id}`);
      this.output.writeln(`Name: ${study.name}`);
      if (study.description) {
        this.output.writeln(`Description: ${study.description}`);
      }
      this.output.writeln(`Path: ${study.basePath}`);
      this.output.writeln('---');
    });
  }
}
