/**
 * InterviewCommand
 * 
 * Handles the processing and formatting of interview transcripts.
 */

import { CommandResult } from '../../contracts/presentation-contracts';
import { ResearchService } from '../../services/ResearchService';
import { IOutput } from '../../contracts/presentation-contracts';

export class InterviewCommand {
  static readonly command = 'interview <transcript>';
  static readonly description = 'Process and format an interview transcript';
  static readonly options = [
    { flags: '-s, --study <studyId>', description: 'Study ID or name', required: true },
    { flags: '--participant <participantId>', description: 'Participant ID (auto-generated if not provided)' },
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

  async validate(args: string[], options: Record<string, any>): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!args[0]) {
      errors.push('Interview transcript is required');
    }

    if (!options.study) {
      errors.push('Study ID is required. Use --study option.');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private generateParticipantId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `P${timestamp.substring(-4)}${random}`.toUpperCase();
  }
}
