/**
 * IDE Integration for Slash Commands
 *
 * Handles integration with IDEs like Cursor for slash command execution.
 */
import { IDECommandRequest, IDECommandResponse } from './ResponseFormatter';
export interface CommandRegistration {
    command: string;
    description: string;
    parameters: string[];
    examples: string[];
}
export interface HelpResponse {
    success: boolean;
    help: string;
    commands?: string[];
    examples?: string[];
}
export interface CommandRegistrationResult {
    success: boolean;
    registeredCommands: string[];
    errors: string[];
}
export declare class IDEIntegration {
    private registeredCommands;
    private commandRegistry;
    constructor();
    /**
     * Register commands with the IDE
     */
    registerCommands(commands: string[]): Promise<CommandRegistrationResult>;
    /**
     * Execute command from IDE request
     */
    executeCommand(request: IDECommandRequest): Promise<IDECommandResponse>;
    /**
     * Get help for commands
     */
    getHelp(request: {
        type: string;
        command?: string | undefined;
    }): Promise<HelpResponse>;
    /**
     * Check if command is registered
     */
    isCommandRegistered(command: string): boolean;
    /**
     * Get registered commands
     */
    getRegisteredCommands(): string[];
    /**
     * Get command registration details
     */
    getCommandRegistration(command: string): CommandRegistration | undefined;
    /**
     * Simulate command execution (placeholder for actual implementation)
     */
    private simulateCommandExecution;
    /**
     * Get help for specific command
     */
    private getCommandHelp;
    /**
     * Get help for all commands
     */
    private getAllCommandsHelp;
    /**
     * Initialize command registry with available commands
     */
    private initializeCommandRegistry;
}
