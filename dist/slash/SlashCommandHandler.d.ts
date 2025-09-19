/**
 * Slash Command Handler
 *
 * Main handler for processing slash commands in IDE integration.
 */
import { CommandParser } from './CommandParser';
import { ResponseFormatter, CommandResponse, IDECommandRequest } from './ResponseFormatter';
import { IDEIntegration } from './IDEIntegration';
export declare class SlashCommandHandler {
    private commandParser;
    private responseFormatter;
    private ideIntegration;
    constructor(commandParser: CommandParser, responseFormatter: ResponseFormatter, ideIntegration: IDEIntegration);
    /**
     * Handle a slash command
     */
    handleCommand(commandString: string): Promise<CommandResponse>;
    /**
     * Handle IDE command request
     */
    handleIDECommand(request: IDECommandRequest): Promise<CommandResponse>;
    /**
     * Get help for commands
     */
    getHelp(command?: string): Promise<CommandResponse>;
    /**
     * List available commands
     */
    listCommands(): Promise<CommandResponse>;
    /**
     * Register commands with IDE
     */
    registerCommands(commands: string[]): Promise<CommandResponse>;
    /**
     * Execute a parsed command
     */
    private executeCommand;
    /**
     * Execute research:questions command
     */
    private executeResearchQuestions;
    /**
     * Execute research:sources command
     */
    private executeResearchSources;
    /**
     * Execute research:summarize command
     */
    private executeResearchSummarize;
    /**
     * Execute research:interview command
     */
    private executeResearchInterview;
    /**
     * Execute research:synthesize command
     */
    private executeResearchSynthesize;
    /**
     * Execute study:create command
     */
    private executeStudyCreate;
    /**
     * Execute study:list command
     */
    private executeStudyList;
    /**
     * Execute study:show command
     */
    private executeStudyShow;
    /**
     * Execute study:delete command
     */
    private executeStudyDelete;
}
