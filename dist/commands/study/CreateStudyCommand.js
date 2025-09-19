"use strict";
/**
 * Create Study Command
 *
 * Creates a new research study with proper directory structure and initial files.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStudyCommand = void 0;
class CreateStudyCommand {
    constructor(studyService, output) {
        this.studyService = studyService;
        this.output = output;
        this.name = 'study:create';
        this.description = 'Create a new research study';
        this.usage = 'uxkit study:create [options]';
        this.arguments = [];
        this.options = [
            {
                name: 'name',
                description: 'Name of the study',
                type: 'string',
                required: true,
                aliases: ['n']
            },
            {
                name: 'description',
                description: 'Description of the study',
                type: 'string',
                required: false,
                aliases: ['d']
            }
        ];
        this.examples = [
            {
                description: 'Create a basic study',
                command: 'uxkit study:create --name "User Onboarding Research"'
            },
            {
                description: 'Create a study with description',
                command: 'uxkit study:create --name "User Onboarding Research" --description "Research into improving the new user onboarding flow"'
            }
        ];
    }
    async execute(args, options) {
        try {
            const projectRoot = options.projectRoot || process.cwd();
            const studyName = options.name || '';
            const description = options.description || '';
            if (!studyName) {
                return { success: false, message: 'Study name is required. Use --name option.' };
            }
            this.output.writeln(`Creating study: ${studyName}`);
            const study = await this.studyService.createStudy(studyName, description, projectRoot);
            this.output.writeln(`Study created successfully with ID: ${study.id}`);
            this.output.writeln(`Study directory: ${study.basePath}`);
            return {
                success: true,
                message: `Study created successfully: ${study.name}`,
                data: study
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            this.output.writeErrorln(`Failed to create study: ${errorMessage}`);
            return {
                success: false,
                message: `Failed to create study: ${errorMessage}`,
                errors: [errorMessage]
            };
        }
    }
    async validate(args, options) {
        const errors = [];
        // Validate study name
        if (!args[0] || args[0].trim().length === 0) {
            errors.push({
                field: 'name',
                message: 'Study name is required',
                value: args[0]
            });
        }
        else if (args[0].length < 3) {
            errors.push({
                field: 'name',
                message: 'Study name must be at least 3 characters long',
                value: args[0]
            });
        }
        // Validate description if provided
        if (options.description && typeof options.description !== 'string') {
            errors.push({
                field: 'description',
                message: 'Description must be a string',
                value: options.description
            });
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
    showHelp() {
        this.output.writeln(`Usage: ${this.usage}`);
        this.output.writeln(`\n${this.description}`);
        this.output.writeln('\nArguments:');
        this.arguments.forEach(arg => {
            this.output.writeln(`  ${arg.name}${arg.required ? ' (required)' : ' (optional)'}: ${arg.description}`);
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
exports.CreateStudyCommand = CreateStudyCommand;
//# sourceMappingURL=CreateStudyCommand.js.map