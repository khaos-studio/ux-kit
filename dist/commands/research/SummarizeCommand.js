"use strict";
/**
 * SummarizeCommand
 *
 * Handles the summarization of research sources.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummarizeCommand = void 0;
class SummarizeCommand {
    constructor(researchService, output) {
        this.researchService = researchService;
        this.output = output;
        this.name = 'research:summarize';
        this.description = 'Generate a summary for a research source';
        this.usage = 'uxkit research:summarize [options]';
        this.arguments = [];
        this.options = [
            {
                name: 'study',
                description: 'Study ID or name',
                type: 'string',
                required: true,
                aliases: ['s']
            },
            {
                name: 'sourceId',
                description: 'Source ID to summarize',
                type: 'string',
                required: true
            },
            {
                name: 'projectRoot',
                description: 'Specify the project root directory',
                type: 'string',
                required: false,
                aliases: ['p']
            }
        ];
        this.examples = [
            {
                description: 'Summarize a research source',
                command: 'uxkit research:summarize --study 001-user-research --sourceId source-123'
            }
        ];
    }
    async execute(args, options) {
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
            }
            else {
                this.output.writeErrorln(`Failed to generate summary: ${result.message}`);
                return { success: false, message: result.message };
            }
        }
        catch (error) {
            this.output.writeErrorln(`Failed to generate summary: ${error.message}`);
            return { success: false, message: `Failed to generate summary: ${error.message}` };
        }
    }
    async validate(args, options) {
        const errors = [];
        if (!args[0]) {
            errors.push({
                field: 'sourceId',
                message: 'Source ID is required',
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
    showHelp() {
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
exports.SummarizeCommand = SummarizeCommand;
//# sourceMappingURL=SummarizeCommand.js.map