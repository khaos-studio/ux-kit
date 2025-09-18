/**
 * SourcesCommand
 * 
 * Handles the collection and organization of research sources for a study.
 */

import { CommandResult } from '../../contracts/presentation-contracts';
import { ResearchService } from '../../services/ResearchService';
import { Source } from '../../services/FileGenerator';
import { IOutput } from '../../contracts/presentation-contracts';

export class SourcesCommand {
  static readonly command = 'sources';
  static readonly description = 'Collect and organize research sources for a study';
  static readonly options = [
    { flags: '-s, --study <studyId>', description: 'Study ID or name', required: true },
    { flags: '--sources <sources>', description: 'JSON array of sources to add' },
    { flags: '--auto-discover', description: 'Automatically discover relevant files in the project', defaultValue: false },
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
      const autoDiscover = options.autoDiscover || false;
      const sourcesJson = options.sources || '[]';

      if (!studyId) {
        return { success: false, message: 'Study ID is required. Use --study option.' };
      }

      let sources: Source[] = [];

      // Parse sources from JSON if provided
      if (sourcesJson && sourcesJson !== '[]') {
        try {
          const parsedSources = JSON.parse(sourcesJson);
          sources = parsedSources.map((source: any) => ({
            id: source.id || this.generateSourceId(),
            title: source.title || 'Untitled Source',
            type: source.type || 'web',
            url: source.url,
            filePath: source.filePath,
            dateAdded: new Date(),
            tags: source.tags || [],
            summaryStatus: 'not_summarized' as const
          }));
        } catch (error) {
          return { success: false, message: 'Invalid sources JSON format.' };
        }
      }

      this.output.writeln(`Collecting sources for study: ${studyId}`);
      if (sources.length > 0) {
        this.output.writeln(`Adding ${sources.length} sources`);
      }
      if (autoDiscover) {
        this.output.writeln('Auto-discovering relevant files...');
      }

      const result = await this.researchService.collectSources(studyId, sources, projectRoot, autoDiscover);

      if (result.success) {
        this.output.writeln(`Sources collected successfully: ${result.filePath}`);
        return { success: true, data: { filePath: result.filePath }, message: result.message };
      } else {
        this.output.writeErrorln(`Failed to collect sources: ${result.message}`);
        return { success: false, message: result.message };
      }
    } catch (error: any) {
      this.output.writeErrorln(`Failed to collect sources: ${error.message}`);
      return { success: false, message: `Failed to collect sources: ${error.message}` };
    }
  }

  async validate(args: string[], options: Record<string, any>): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!options.study) {
      errors.push('Study ID is required. Use --study option.');
    }

    // Validate sources JSON if provided
    if (options.sources && options.sources !== '[]') {
      try {
        JSON.parse(options.sources);
      } catch (error) {
        errors.push('Invalid sources JSON format');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private generateSourceId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `source-${timestamp}-${random}`;
  }
}
