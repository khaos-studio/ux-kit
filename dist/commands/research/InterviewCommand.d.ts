/**
 * InterviewCommand
 *
 * Handles the processing and formatting of interview transcripts.
 */
import { ICommand, CommandResult, ValidationResult } from '../../contracts/presentation-contracts';
import { ResearchService } from '../../services/ResearchService';
import { IOutput } from '../../contracts/presentation-contracts';
export declare class InterviewCommand implements ICommand {
    private researchService;
    private output;
    readonly name = "research:interview";
    readonly description = "Process and format an interview transcript";
    readonly usage = "uxkit research:interview [options]";
    readonly arguments: Array<{
        name: string;
        description: string;
        required: boolean;
        type: 'string' | 'number' | 'boolean';
    }>;
    readonly options: ({
        name: string;
        description: string;
        type: "string";
        required: boolean;
        aliases: string[];
    } | {
        name: string;
        description: string;
        type: "string";
        required: boolean;
        aliases?: never;
    })[];
    readonly examples: {
        description: string;
        command: string;
    }[];
    constructor(researchService: ResearchService, output: IOutput);
    execute(args: string[], options: Record<string, any>): Promise<CommandResult>;
    validate(args: string[], options: Record<string, any>): Promise<ValidationResult>;
    showHelp(): void;
    private generateParticipantId;
}
