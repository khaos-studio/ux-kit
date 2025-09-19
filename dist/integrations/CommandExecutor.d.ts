/**
 * Command Executor
 *
 * Handles execution of slash commands by delegating to appropriate
 * command handlers and managing command lifecycle.
 */
import { ResearchService } from '../services/ResearchService';
import { StudyService } from '../services/StudyService';
export interface CommandExecutionContext {
    workspace: string;
    currentFile?: string | null;
    selection?: string | null;
    cursorPosition?: {
        line: number;
        character: number;
    } | null;
}
export interface CommandExecutionResult {
    success: boolean;
    output?: string;
    error?: string;
    metadata?: Record<string, any>;
}
/**
 * Command Executor for handling slash command execution
 */
export declare class CommandExecutor {
    private commandHandlers;
    private researchService;
    private studyService;
    constructor(researchService: ResearchService, studyService: StudyService);
    /**
     * Execute a command with the given arguments and context
     */
    execute(commandName: string, args: string[], context: CommandExecutionContext): Promise<CommandExecutionResult>;
    /**
     * Register a command handler
     */
    registerHandler(commandName: string, handler: (args: string[], context: CommandExecutionContext) => Promise<CommandExecutionResult>): void;
    /**
     * Unregister a command handler
     */
    unregisterHandler(commandName: string): void;
    /**
     * Get list of available commands
     */
    getAvailableCommands(): string[];
    /**
     * Check if a command is available
     */
    hasCommand(commandName: string): boolean;
    /**
     * Initialize default command handlers
     */
    private initializeCommandHandlers;
    /**
     * Handle research:questions command
     */
    private handleResearchQuestions;
    /**
     * Handle research:sources command
     */
    private handleResearchSources;
    /**
     * Handle research:summarize command
     */
    private handleResearchSummarize;
    /**
     * Handle research:interview command
     */
    private handleResearchInterview;
    /**
     * Handle research:synthesize command
     */
    private handleResearchSynthesize;
    /**
     * Handle study:create command
     */
    private handleStudyCreate;
    /**
     * Handle study:list command
     */
    private handleStudyList;
    /**
     * Handle study:show command
     */
    private handleStudyShow;
    /**
     * Handle study:delete command
     */
    private handleStudyDelete;
    /**
     * Parse command line arguments
     */
    private parseArguments;
    private generateResearchQuestions;
    private formatQuestions;
    private generateResearchSources;
    private formatSources;
    private generateResearchSummary;
    private formatSummary;
    private processInterviewData;
    private formatInterviewData;
    private synthesizeResearchInsights;
    private formatSynthesis;
    private createStudy;
    private formatStudy;
    private listStudies;
    private formatStudyList;
    private getStudy;
    private formatStudyDetails;
    private deleteStudy;
}
