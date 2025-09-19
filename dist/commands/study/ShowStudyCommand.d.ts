/**
 * Show Study Command
 *
 * Shows detailed information about a specific research study.
 */
import { ICommand, CommandResult, ValidationResult } from '../../contracts/presentation-contracts';
import { StudyService } from '../../services/StudyService';
import { IOutput } from '../../contracts/presentation-contracts';
export declare class ShowStudyCommand implements ICommand {
    private studyService;
    private output;
    readonly name = "study:show";
    readonly description = "Show detailed information about a study";
    readonly usage = "uxkit study show <study-id> [options]";
    readonly arguments: {
        name: string;
        description: string;
        required: boolean;
        type: "string";
    }[];
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
    private displayStudyDetails;
}
