"use strict";
/**
 * List Studies Command
 *
 * Lists all research studies in the project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListStudiesCommand = void 0;
class ListStudiesCommand {
    constructor(studyService, output) {
        this.studyService = studyService;
        this.output = output;
        this.name = 'study:list';
        this.description = 'List all research studies';
        this.usage = 'uxkit study:list [options]';
        this.arguments = [];
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
                description: 'List all studies in table format',
                command: 'uxkit study list'
            },
            {
                description: 'List all studies in JSON format',
                command: 'uxkit study list --format json'
            }
        ];
    }
    async execute(args, options) {
        try {
            const projectRoot = options.projectRoot || process.cwd();
            const format = options.format || 'table';
            this.output.writeln('Fetching studies...');
            const studies = await this.studyService.listStudies(projectRoot);
            if (studies.length === 0) {
                this.output.writeln('No studies found. Create your first study with: uxkit study create "Study Name"');
                return {
                    success: true,
                    message: 'No studies found',
                    data: []
                };
            }
            if (format === 'json') {
                this.output.writeln(JSON.stringify(studies, null, 2));
            }
            else {
                this.displayStudiesTable(studies);
            }
            return {
                success: true,
                message: `Found ${studies.length} studies`,
                data: studies
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            this.output.writeErrorln(`Failed to list studies: ${errorMessage}`);
            return {
                success: false,
                message: `Failed to list studies: ${errorMessage}`,
                errors: [errorMessage]
            };
        }
    }
    async validate(args, options) {
        const errors = [];
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
    displayStudiesTable(studies) {
        this.output.writeln('\nResearch Studies:');
        this.output.writeln('================');
        studies.forEach(study => {
            this.output.writeln(`ID: ${study.id}`);
            this.output.writeln(`Name: ${study.name}`);
            if (study.description) {
                this.output.writeln(`Description: ${study.description}`);
            }
            this.output.writeln(`Path: ${study.basePath}`);
            this.output.writeln('---');
        });
    }
}
exports.ListStudiesCommand = ListStudiesCommand;
//# sourceMappingURL=ListStudiesCommand.js.map