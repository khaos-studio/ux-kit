/**
 * QuestionsCommand
 * 
 * Handles the generation of research questions for a study.
 */

import { CommandResult } from '../../contracts/presentation-contracts';
import { ResearchService } from '../../services/ResearchService';
import { IOutput } from '../../contracts/presentation-contracts';

export class QuestionsCommand {
  static readonly command = 'questions <prompt>';
  static readonly description = 'Generate research questions for a study';
  static readonly options = [
    { flags: '-s, --study <studyId>', description: 'Study ID or name', required: true },
    { flags: '-p, --projectRoot <path>', description: 'Specify the project root directory' }
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

  async validate(args: string[], options: Record<string, any>): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!args[0]) {
      errors.push('Research prompt is required');
    }

    if (!options.study) {
      errors.push('Study ID is required. Use --study option.');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
