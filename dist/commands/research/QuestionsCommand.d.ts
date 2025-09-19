/**
 * QuestionsCommand
 *
 * Handles the generation of research questions for a study.
 */
import { ICommand, CommandResult, ValidationResult } from '../../contracts/presentation-contracts';
import { ResearchService } from '../../services/ResearchService';
import { IOutput } from '../../contracts/presentation-contracts';
export declare class QuestionsCommand implements ICommand {
    private researchService;
    private output;
    readonly name = "research:questions";
    readonly description = "Generate research questions for a study";
    readonly usage = "uxkit research:questions [options]";
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
    constructor(researchService: ResearchService, output: IOutput);
    execute(args: string[], options: Record<string, any>): Promise<CommandResult>;
    validate(args: string[], options: Record<string, any>): Promise<ValidationResult>;
    showHelp(): void;
}
