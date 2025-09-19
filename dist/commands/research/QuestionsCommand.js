"use strict";
/**
 * QuestionsCommand
 *
 * Handles the generation of research questions for a study.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsCommand = void 0;
class QuestionsCommand {
    constructor(researchService, output) {
        this.researchService = researchService;
        this.output = output;
        this.name = 'research:questions';
        this.description = 'Generate research questions for a study';
        this.usage = 'uxkit research:questions [options]';
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
                name: 'topic',
                description: 'Research topic or prompt to generate questions for',
                type: 'string',
                required: false,
                aliases: ['t']
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
                description: 'Generate questions for a study',
                command: 'uxkit research:questions --study 001-user-research --topic "How do users discover our product features?"'
            }
        ];
    }
    async execute(args, options) {
        try {
            const projectRoot = options.projectRoot || process.cwd();
            const studyId = options.study || '';
            const topic = options.topic || 'Research questions';
            if (!studyId) {
                return { success: false, message: 'Study ID is required. Use --study option.' };
            }
            this.output.writeln(`Generating research questions for study: ${studyId}`);
            this.output.writeln(`Topic: ${topic}`);
            const result = await this.researchService.generateQuestions(studyId, topic, projectRoot);
            if (result.success) {
                this.output.writeln(`Questions generated successfully: ${result.filePath}`);
                return { success: true, data: { filePath: result.filePath }, message: result.message };
            }
            else {
                this.output.writeErrorln(`Failed to generate questions: ${result.message}`);
                return { success: false, message: result.message };
            }
        }
        catch (error) {
            this.output.writeErrorln(`Failed to generate questions: ${error.message}`);
            return { success: false, message: `Failed to generate questions: ${error.message}` };
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
exports.QuestionsCommand = QuestionsCommand;
//# sourceMappingURL=QuestionsCommand.js.map