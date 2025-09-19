"use strict";
/**
 * Show Study Command
 *
 * Shows detailed information about a specific research study.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowStudyCommand = void 0;
class ShowStudyCommand {
    constructor(studyService, output) {
        this.studyService = studyService;
        this.output = output;
        this.name = 'study:show';
        this.description = 'Show detailed information about a study';
        this.usage = 'uxkit study show <study-id> [options]';
        this.arguments = [
            {
                name: 'study-id',
                description: 'Study ID or name',
                required: true,
                type: 'string'
            }
        ];
        this.options = [
            {
                name: 'format',
                description: 'Output format (table, json)',
                type: 'string',
                required: false,
                defaultValue: 'table',
                aliases: ['f']
            }
        ];
        this.examples = [
            {
                description: 'Show study details',
                command: 'uxkit study show 001-user-onboarding-research'
            },
            {
                description: 'Show study details in JSON format',
                command: 'uxkit study show 001-user-onboarding-research --format json'
            }
        ];
    }
    async execute(args, options) {
        try {
            const projectRoot = options.projectRoot || process.cwd();
            const studyIdentifier = args[0] || '';
            const format = options.format || 'table';
            this.output.writeln(`Fetching study: ${studyIdentifier}`);
            // Try to find study by ID first, then by name
            let study = await this.studyService.getStudy(studyIdentifier, projectRoot);
            if (!study) {
                // Try to find by name
                const studies = await this.studyService.listStudies(projectRoot);
                study = studies.find(s => s.name.toLowerCase() === studyIdentifier.toLowerCase());
            }
            if (!study) {
                return {
                    success: false,
                    message: `Study not found: ${studyIdentifier}`,
                    errors: [`Study not found: ${studyIdentifier}`]
                };
            }
            if (format === 'json') {
                this.output.writeln(JSON.stringify(study, null, 2));
            }
            else {
                this.displayStudyDetails(study);
            }
            return {
                success: true,
                message: `Study details for: ${study.name}`,
                data: study
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            this.output.writeErrorln(`Failed to show study: ${errorMessage}`);
            return {
                success: false,
                message: `Failed to show study: ${errorMessage}`,
                errors: [errorMessage]
            };
        }
    }
    async validate(args, options) {
        const errors = [];
        // Validate study identifier
        if (!args[0] || args[0].trim().length === 0) {
            errors.push({
                field: 'study-id',
                message: 'Study ID or name is required',
                value: args[0]
            });
        }
        // Validate format option
        if (options.format && !['table', 'json'].includes(options.format)) {
            errors.push({
                field: 'format',
                message: 'Format must be either "table" or "json"',
                value: options.format
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
    displayStudyDetails(study) {
        this.output.writeln('\nStudy Details:');
        this.output.writeln('==============');
        this.output.writeln(`ID: ${study.id}`);
        this.output.writeln(`Name: ${study.name}`);
        if (study.description) {
            this.output.writeln(`Description: ${study.description}`);
        }
        this.output.writeln(`Path: ${study.basePath}`);
        if (study.createdAt) {
            this.output.writeln(`Created: ${study.createdAt}`);
        }
        if (study.updatedAt) {
            this.output.writeln(`Updated: ${study.updatedAt}`);
        }
    }
}
exports.ShowStudyCommand = ShowStudyCommand;
//# sourceMappingURL=ShowStudyCommand.js.map