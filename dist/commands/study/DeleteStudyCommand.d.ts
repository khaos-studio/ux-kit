/**
 * Delete Study Command
 *
 * Deletes a research study and all its associated files.
 */
import { ICommand, CommandResult, ValidationResult } from '../../contracts/presentation-contracts';
import { StudyService } from '../../services/StudyService';
import { IOutput } from '../../contracts/presentation-contracts';
export declare class DeleteStudyCommand implements ICommand {
    private studyService;
    private output;
    readonly name = "study:delete";
    readonly description = "Delete a research study";
    readonly usage = "uxkit study delete <study-id> [options]";
    readonly arguments: {
        name: string;
        description: string;
        required: boolean;
        type: "string";
    }[];
    readonly options: {
        name: string;
        description: string;
        type: "boolean";
        required: boolean;
        defaultValue: boolean;
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
