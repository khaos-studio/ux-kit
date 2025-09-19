/**
 * QuestionsCommand
 * 
 * Handles the generation of research questions for a study.
 */

import { ICommand, CommandResult, ValidationResult } from '../../contracts/presentation-contracts';
import { ResearchService } from '../../services/ResearchService';
import { IOutput } from '../../contracts/presentation-contracts';

export class QuestionsCommand implements ICommand {
  readonly name = 'questions';
  readonly description = 'Generate research questions for a study';
  readonly usage = 'uxkit questions <prompt> [options]';
  readonly arguments = [
    {
      name: 'prompt',
      description: 'Research prompt or question to generate questions for',
      required: true,
      type: 'string' as const
    }
  ];
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
      description: 'Generate questions for a study',
      command: 'uxkit questions "How do users discover our product features?" --study 001-user-research'
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
      const prompt = args[0] || '';

      if (!studyId) {
        return { success: false, message: 'Study ID is required. Use --study option.' };
      }

      if (!prompt) {
        return { success: false, message: 'Research prompt is required.' };
      }

      this.output.writeln(`Generating research questions for study: ${studyId}`);
      this.output.writeln(`Prompt: ${prompt}`);

      const result = await this.researchService.generateQuestions(studyId, prompt, projectRoot);

      if (result.success) {
        this.output.writeln(`Questions generated successfully: ${result.filePath}`);
        return { success: true, data: { filePath: result.filePath }, message: result.message };
      } else {
        this.output.writeErrorln(`Failed to generate questions: ${result.message}`);
        return { success: false, message: result.message };
      }
    } catch (error: any) {
      this.output.writeErrorln(`Failed to generate questions: ${error.message}`);
      return { success: false, message: `Failed to generate questions: ${error.message}` };
    }
  }

  async validate(args: string[], options: Record<string, any>): Promise<ValidationResult> {
    const errors: any[] = [];

    if (!args[0]) {
      errors.push({
        field: 'prompt',
        message: 'Research prompt is required',
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
}
