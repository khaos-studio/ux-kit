/**
 * SourcesCommand
 *
 * Handles the collection and organization of research sources for a study.
 */
import { ICommand, CommandResult, ValidationResult } from '../../contracts/presentation-contracts';
import { ResearchService } from '../../services/ResearchService';
import { IOutput } from '../../contracts/presentation-contracts';
export declare class SourcesCommand implements ICommand {
    private researchService;
    private output;
    readonly name = "research:sources";
    readonly description = "Collect and organize research sources for a study";
    readonly usage = "uxkit research:sources [options]";
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
        defaultValue?: never;
    } | {
        name: string;
        description: string;
        type: "string";
        required: boolean;
        aliases?: never;
        defaultValue?: never;
    } | {
        name: string;
        description: string;
        type: "boolean";
        required: boolean;
        defaultValue: boolean;
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
    private generateSourceId;
}
