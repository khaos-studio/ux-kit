/**
 * SynthesizeCommand
 * 
 * Handles the synthesis of research insights from all artifacts.
 */

import { ICommand, CommandResult, ValidationResult } from '../../contracts/presentation-contracts';
import { ResearchService } from '../../services/ResearchService';
import { IOutput } from '../../contracts/presentation-contracts';

export class SynthesizeCommand implements ICommand {
  readonly name = 'research:synthesize';
  readonly description = 'Synthesize insights from all research artifacts';
  readonly usage = 'uxkit research:synthesize [options]';
  readonly arguments: Array<{ name: string; description: string; required: boolean; type: 'string' | 'number' | 'boolean' }> = [];
  readonly options = [
    {
      name: 'study',
      description: 'Study ID or name',
      type: 'string' as const,
      required: true,
      aliases: ['s']
    },
    {
      name: 'projectRoot',
      description: 'Specify the project root directory',
      type: 'string' as const,
      required: false,
      aliases: ['p']
    }
  ];
  readonly examples = [
    {
      description: 'Synthesize insights for a study',
      command: 'uxkit research:synthesize --study 001-user-research'
    }
  ];

  constructor(
    private researchService: ResearchService,
    private output: IOutput
  ) {}

  async execute(args: string[], options: Record<string, any>): Promise<CommandResult> {
    try {
      const projectRoot = options.projectRoot || process.cwd();
      const studyId = options.study || '';

      if (!studyId) {
        return { success: false, message: 'Study ID is required. Use --study option.' };
      }

      this.output.writeln(`Synthesizing insights for study: ${studyId}`);
      this.output.writeln('Collecting research artifacts...');

      const result = await this.researchService.synthesizeInsights(studyId, projectRoot);

      if (result.success) {
        if (result.filePath) {
          this.output.writeln(`Insights synthesized successfully: ${result.filePath}`);
          return { success: true, data: { filePath: result.filePath }, message: result.message };
        } else {
          this.output.writeln(result.message);
          return { success: true, message: result.message };
        }
      } else {
        this.output.writeErrorln(`Failed to synthesize insights: ${result.message}`);
        return { success: false, message: result.message };
      }
    } catch (error: any) {
      this.output.writeErrorln(`Failed to synthesize insights: ${error.message}`);
      return { success: false, message: `Failed to synthesize insights: ${error.message}` };
    }
  }

  async validate(args: string[], options: Record<string, any>): Promise<ValidationResult> {
    const errors: any[] = [];

    if (!options.study) {
      errors.push({
        field: 'study',
        message: 'Study ID is required. Use --study option.',
        value: options.study
      });
    }

    return { valid: errors.length === 0, errors };
  }

  showHelp(): void {
    this.output.writeln(`Usage: ${this.usage}`);
    this.output.writeln(`\n${this.description}\n`);
    if (this.arguments.length > 0) {
      this.output.writeln('Arguments:');
      this.arguments.forEach(arg => {
        const required = arg.required ? '<required>' : '[optional]';
        this.output.writeln(`  ${arg.name}    ${arg.description} (${required})`);
      });
    }
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
