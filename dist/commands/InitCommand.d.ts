/**
 * Init Command
 *
 * Initializes UX-Kit in a project by creating the .uxkit/ directory structure.
 */
import { ICommand, CommandResult, ValidationResult } from '../contracts/presentation-contracts';
import { DirectoryService } from '../services/DirectoryService';
import { TemplateService } from '../services/TemplateService';
import { CursorCommandGenerator } from '../services/CursorCommandGenerator';
import { InputService } from '../utils/InputService';
import { IOutput } from '../contracts/presentation-contracts';
import { ICodexIntegration } from '../contracts/domain-contracts';
export declare class InitCommand implements ICommand {
    private directoryService;
    private templateService;
    private cursorCommandGenerator;
    private inputService;
    private output;
    private codexIntegration?;
    readonly name = "init";
    readonly description = "Initialize UX-Kit in the current project";
    readonly usage = "uxkit init [options]";
    readonly arguments: never[];
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
        defaultValue: string;
        aliases: string[];
    })[];
    readonly examples: {
        description: string;
        command: string;
    }[];
    constructor(directoryService: DirectoryService, templateService: TemplateService, cursorCommandGenerator: CursorCommandGenerator, inputService: InputService, output: IOutput, codexIntegration?: ICodexIntegration | undefined);
    execute(args: string[], options: Record<string, any>): Promise<CommandResult>;
    validate(args: string[], options: Record<string, any>): Promise<ValidationResult>;
    /**
     * Display ASCII art banner for UX-Kit
     */
    private displayBanner;
    /**
     * Enhanced setup process with progress indicators
     */
    private setupWithProgress;
    /**
     * Interactive prompt for AI agent selection
     */
    private promptForAiAgent;
    /**
     * Handle IDE confirmation and Cursor command generation
     */
    private handleIdeConfirmation;
    /**
     * Handle Codex initialization and setup
     */
    private handleCodexInitialization;
    showHelp(): void;
}
