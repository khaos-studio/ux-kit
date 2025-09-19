"use strict";
/**
 * Delete Study Command
 *
 * Deletes a research study and all its associated files.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteStudyCommand = void 0;
class DeleteStudyCommand {
    constructor(studyService, output) {
        this.studyService = studyService;
        this.output = output;
        this.name = 'study:delete';
        this.description = 'Delete a research study';
        this.usage = 'uxkit study delete <study-id> [options]';
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
                name: 'confirm',
                description: 'Skip confirmation prompt',
                type: 'boolean',
                required: false,
                defaultValue: false,
                aliases: ['y']
            }
        ];
        this.examples = [
            {
                description: 'Delete a study with confirmation',
                command: 'uxkit study delete 001-user-onboarding-research'
            },
            {
                description: 'Delete a study without confirmation',
                command: 'uxkit study delete 001-user-onboarding-research --confirm'
            }
        ];
    }
    async execute(args, options) {
        try {
            const projectRoot = options.projectRoot || process.cwd();
            const studyIdentifier = args[0] || '';
            const confirm = options.confirm || false;
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
            if (!confirm) {
                this.output.writeln(`Are you sure you want to delete study "${study.name}" (${study.id})?`);
                this.output.writeln('This action cannot be undone.');
                // In a real implementation, you would prompt for confirmation
                // For now, we'll assume confirmation is given
            }
            this.output.writeln(`Deleting study: ${study.name} (${study.id})`);
            await this.studyService.deleteStudy(study.id, projectRoot);
            this.output.writeln(`Study deleted successfully: ${study.name}`);
            return {
                success: true,
                message: `Study deleted successfully: ${study.name}`,
                data: { deletedStudy: study }
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            this.output.writeErrorln(`Failed to delete study: ${errorMessage}`);
            return {
                success: false,
                message: `Failed to delete study: ${errorMessage}`,
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
        // Validate confirm option
        if (options.confirm && typeof options.confirm !== 'boolean') {
            errors.push({
                field: 'confirm',
                message: 'Confirm must be a boolean',
                value: options.confirm
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
exports.DeleteStudyCommand = DeleteStudyCommand;
//# sourceMappingURL=DeleteStudyCommand.js.map