"use strict";
/**
 * SynthesizeCommand
 *
 * Handles the synthesis of research insights from all artifacts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SynthesizeCommand = void 0;
class SynthesizeCommand {
    constructor(researchService, output) {
        this.researchService = researchService;
        this.output = output;
        this.name = 'research:synthesize';
        this.description = 'Synthesize insights from all research artifacts';
        this.usage = 'uxkit research:synthesize [options]';
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
                name: 'projectRoot',
                description: 'Specify the project root directory',
                type: 'string',
                required: false,
                aliases: ['p']
            }
        ];
        this.examples = [
            {
                description: 'Synthesize insights for a study',
                command: 'uxkit research:synthesize --study 001-user-research'
            }
        ];
    }
    async execute(args, options) {
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
                }
                else {
                    this.output.writeln(result.message);
                    return { success: true, message: result.message };
                }
            }
            else {
                this.output.writeErrorln(`Failed to synthesize insights: ${result.message}`);
                return { success: false, message: result.message };
            }
        }
        catch (error) {
            this.output.writeErrorln(`Failed to synthesize insights: ${error.message}`);
            return { success: false, message: `Failed to synthesize insights: ${error.message}` };
        }
    }
    async validate(args, options) {
        const errors = [];
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
exports.SynthesizeCommand = SynthesizeCommand;
//# sourceMappingURL=SynthesizeCommand.js.map