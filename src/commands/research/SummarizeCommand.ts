/**
 * SummarizeCommand
 * 
 * Handles the summarization of research sources.
 */

import { CommandResult } from '../../contracts/presentation-contracts';
import { ResearchService } from '../../services/ResearchService';
import { IOutput } from '../../contracts/presentation-contracts';

export class SummarizeCommand {
  static readonly command = 'summarize <sourceId>';
  static readonly description = 'Generate a summary for a research source';
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
      const sourceId = args[0] || '';

      if (!studyId) {
        return { success: false, message: 'Study ID is required. Use --study option.' };
      }

      if (!sourceId) {
        return { success: false, message: 'Source ID is required.' };
      }

      this.output.writeln(`Generating summary for source: ${sourceId}`);
      this.output.writeln(`Study: ${studyId}`);

      const result = await this.researchService.summarizeSource(studyId, sourceId, projectRoot);

      if (result.success) {
        this.output.writeln(`Summary generated successfully: ${result.filePath}`);
        return { success: true, data: { filePath: result.filePath }, message: result.message };
      } else {
        this.output.writeErrorln(`Failed to generate summary: ${result.message}`);
        return { success: false, message: result.message };
      }
    } catch (error: any) {
      this.output.writeErrorln(`Failed to generate summary: ${error.message}`);
      return { success: false, message: `Failed to generate summary: ${error.message}` };
    }
  }

  async validate(args: string[], options: Record<string, any>): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!args[0]) {
      errors.push('Source ID is required');
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
