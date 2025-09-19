/**
 * List Studies Command
 *
 * Lists all research studies in the project.
 */
import { ICommand, CommandResult, ValidationResult } from '../../contracts/presentation-contracts';
import { StudyService } from '../../services/StudyService';
import { IOutput } from '../../contracts/presentation-contracts';
export declare class ListStudiesCommand implements ICommand {
    private studyService;
    private output;
    readonly name = "study:list";
    readonly description = "List all research studies";
    readonly usage = "uxkit study:list [options]";
    readonly arguments: never[];
    readonly options: {
        name: string;
        description: string;
        type: "string";
        required: boolean;
        defaultValue: string;
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
    private displayStudiesTable;
}
