/**
 * Create Study Command
 *
 * Creates a new research study with proper directory structure and initial files.
 */
import { ICommand, CommandResult, ValidationResult } from '../../contracts/presentation-contracts';
import { StudyService } from '../../services/StudyService';
import { IOutput } from '../../contracts/presentation-contracts';
export declare class CreateStudyCommand implements ICommand {
    private studyService;
    private output;
    readonly name = "study:create";
    readonly description = "Create a new research study";
    readonly usage = "uxkit study:create [options]";
    readonly arguments: Array<{
        name: string;
        description: string;
        required: boolean;
        type: 'string' | 'number' | 'boolean';
    }>;
    readonly options: {
        name: string;
        description: string;
        type: "string";
        required: boolean;
        aliases: string[];
    }[];
    readonly examples: {
        description: string;
        command: string;
    }[];
    constructor(studyService: StudyService, output: IOutput);
    execute(args: string[], options: Record<string, any>): Promise<CommandResult>;
    validate(args: string[], options: Record<string, any>): Promise<ValidationResult>;
    showHelp(): void;
}
