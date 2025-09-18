/**
 * SynthesizeCommand
 * 
 * Handles the synthesis of research insights from all artifacts.
 */

import { CommandResult } from '../../contracts/presentation-contracts';
import { ResearchService } from '../../services/ResearchService';
import { IOutput } from '../../contracts/presentation-contracts';

export class SynthesizeCommand {
  static readonly command = 'synthesize';
  static readonly description = 'Synthesize insights from all research artifacts';
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

  async validate(args: string[], options: Record<string, any>): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!options.study) {
      errors.push('Study ID is required. Use --study option.');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
