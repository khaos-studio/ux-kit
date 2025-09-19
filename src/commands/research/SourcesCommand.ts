/**
 * SourcesCommand
 * 
 * Handles the collection and organization of research sources for a study.
 */

import { ICommand, CommandResult, ValidationResult } from '../../contracts/presentation-contracts';
import { ResearchService } from '../../services/ResearchService';
import { Source } from '../../services/FileGenerator';
import { IOutput } from '../../contracts/presentation-contracts';

export class SourcesCommand implements ICommand {
  readonly name = 'research:sources';
  readonly description = 'Collect and organize research sources for a study';
  readonly usage = 'uxkit research:sources [options]';
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
      name: 'sources',
      description: 'JSON array of sources to add',
      type: 'string' as const,
      required: false
    },
    {
      name: 'autoDiscover',
      description: 'Automatically discover relevant files in the project',
      type: 'boolean' as const,
      required: false,
      defaultValue: false
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
      description: 'Add sources to a study',
      command: 'uxkit research:sources --study 001-user-research --sources \'[{"title":"User Interview","type":"interview","url":"https://example.com"}]\''
    },
    {
      description: 'Auto-discover sources in project',
      command: 'uxkit research:sources --study 001-user-research --autoDiscover'
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

  async validate(args: string[], options: Record<string, any>): Promise<ValidationResult> {
    const errors: any[] = [];

    if (!options.study) {
      errors.push({
        field: 'study',
        message: 'Study ID is required. Use --study option.',
        value: options.study
      });
    }

    // Validate sources JSON if provided
    if (options.sources && options.sources !== '[]') {
      try {
        JSON.parse(options.sources);
      } catch (error) {
        errors.push({
          field: 'sources',
          message: 'Invalid sources JSON format',
          value: options.sources
        });
      }
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

  private generateSourceId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `source-${timestamp}-${random}`;
  }
}
