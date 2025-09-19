"use strict";
/**
 * InterviewCommand
 *
 * Handles the processing and formatting of interview transcripts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewCommand = void 0;
class InterviewCommand {
    constructor(researchService, output) {
        this.researchService = researchService;
        this.output = output;
        this.name = 'research:interview';
        this.description = 'Process and format an interview transcript';
        this.usage = 'uxkit research:interview [options]';
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
                name: 'transcript',
                description: 'Interview transcript content or file path',
                type: 'string',
                required: true
            },
            {
                name: 'participant',
                description: 'Participant ID (auto-generated if not provided)',
                type: 'string',
                required: false
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
                description: 'Process an interview transcript',
                command: 'uxkit research:interview --study 001-user-research --transcript "Interview transcript content..."'
            },
            {
                description: 'Process interview with specific participant ID',
                command: 'uxkit research:interview --study 001-user-research --transcript "Interview transcript content..." --participant P001'
            }
        ];
    }
    async execute(args, options) {
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
            }
            else {
                this.output.writeErrorln(`Failed to process interview: ${result.message}`);
                return { success: false, message: result.message };
            }
        }
        catch (error) {
            this.output.writeErrorln(`Failed to process interview: ${error.message}`);
            return { success: false, message: `Failed to process interview: ${error.message}` };
        }
    }
    async validate(args, options) {
        const errors = [];
        if (!args[0]) {
            errors.push({
                field: 'transcript',
                message: 'Interview transcript is required',
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
    generateParticipantId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 6);
        return `P${timestamp.substring(-4)}${random}`.toUpperCase();
    }
}
exports.InterviewCommand = InterviewCommand;
//# sourceMappingURL=InterviewCommand.js.map