/**
 * InterviewCommand
 * 
 * Handles the processing and formatting of interview transcripts.
 */

import { ICommand, CommandResult, ValidationResult } from '../../contracts/presentation-contracts';
import { ResearchService } from '../../services/ResearchService';
import { IOutput } from '../../contracts/presentation-contracts';

export class InterviewCommand implements ICommand {
  readonly name = 'research:interview';
  readonly description = 'Process and format an interview transcript';
  readonly usage = 'uxkit research:interview [options]';
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
      name: 'transcript',
      description: 'Interview transcript content or file path',
      type: 'string' as const,
      required: true
    },
    {
      name: 'participant',
      description: 'Participant ID (auto-generated if not provided)',
      type: 'string' as const,
      required: false
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
      description: 'Process an interview transcript',
      command: 'uxkit research:interview --study 001-user-research --transcript "Interview transcript content..."'
    },
    {
      description: 'Process interview with specific participant ID',
      command: 'uxkit research:interview --study 001-user-research --transcript "Interview transcript content..." --participant P001'
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
      const transcript = args[0] || '';
      const participantId = options.participant || this.generateParticipantId();

      if (!studyId) {
        return { success: false, message: 'Study ID is required. Use --study option.' };
      }

      if (!transcript) {
        return { success: false, message: 'Interview transcript is required.' };
      }

      this.output.writeln(`Processing interview transcript for study: ${studyId}`);
      this.output.writeln(`Participant: ${participantId}`);

      const result = await this.researchService.processInterview(studyId, transcript, participantId, projectRoot);

      if (result.success) {
        this.output.writeln(`Interview processed successfully: ${result.filePath}`);
        return { success: true, data: { filePath: result.filePath, participantId }, message: result.message };
      } else {
        this.output.writeErrorln(`Failed to process interview: ${result.message}`);
        return { success: false, message: result.message };
      }
    } catch (error: any) {
      this.output.writeErrorln(`Failed to process interview: ${error.message}`);
      return { success: false, message: `Failed to process interview: ${error.message}` };
    }
  }

  async validate(args: string[], options: Record<string, any>): Promise<ValidationResult> {
    const errors: any[] = [];

    if (!args[0]) {
      errors.push({
        field: 'transcript',
        message: 'Interview transcript is required',
        value: args[0]
      });
    }

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
    this.output.writeln('Arguments:');
    this.arguments.forEach(arg => {
      const required = arg.required ? '<required>' : '[optional]';
      this.output.writeln(`  ${arg.name}    ${arg.description} (${required})`);
    });
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

  private generateParticipantId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `P${timestamp.substring(-4)}${random}`.toUpperCase();
  }
}
