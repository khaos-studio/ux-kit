/**
 * Cursor IDE Integration
 *
 * Implements Cursor IDE integration for slash commands in UX-Kit.
 * Provides seamless integration with Cursor IDE for research workflows.
 */
import { ICursorIntegration, ISlashCommand, CursorPosition, NotificationType } from '../contracts/presentation-contracts';
import { IDEInterface } from './IDEInterface';
import { CommandExecutor } from './CommandExecutor';
/**
 * Cursor IDE Integration implementation
 */
export declare class CursorIntegration implements ICursorIntegration {
    readonly name: "cursor";
    readonly version = "1.0.0";
    readonly supportedCommands: string[];
    private registeredCommands;
    private ideInterface;
    private commandExecutor;
    constructor(ideInterface: IDEInterface, commandExecutor: CommandExecutor);
    /**
     * Check if Cursor is available
     */
    isAvailable(): Promise<boolean>;
    /**
     * Get Cursor version
     */
    getVersion(): Promise<string | null>;
    /**
     * Register a slash command
     */
    registerSlashCommand(command: ISlashCommand): void;
    /**
     * Unregister a slash command
     */
    unregisterSlashCommand(name: string): void;
    /**
     * Get a registered slash command
     */
    getSlashCommand(name: string): ISlashCommand | null;
    /**
     * List all registered slash commands
     */
    listSlashCommands(): ISlashCommand[];
    /**
     * Execute a slash command
     */
    executeSlashCommand(name: string, args: string[]): Promise<void>;
    /**
     * Show help for a specific slash command
     */
    showSlashCommandHelp(name: string): void;
    /**
     * Show help for all available slash commands
     */
    showAllSlashCommands(): void;
    /**
     * Get current workspace from Cursor
     */
    getCurrentWorkspace(): Promise<string>;
    /**
     * Get current file from Cursor
     */
    getCurrentFile(): Promise<string | null>;
    /**
     * Get current selection from Cursor
     */
    getSelection(): Promise<string | null>;
    /**
     * Get cursor position from Cursor
     */
    getCursorPosition(): Promise<CursorPosition | null>;
    /**
     * Insert text at cursor position
     */
    insertText(text: string, position?: CursorPosition): Promise<void>;
    /**
     * Replace current selection with new text
     */
    replaceSelection(text: string): Promise<void>;
    /**
     * Show notification to user
     */
    showNotification(message: string, type?: NotificationType): Promise<void>;
    /**
     * Create execute function for slash commands
     */
    private createExecuteFunction;
    /**
     * Initialize default commands
     */
    private initializeDefaultCommands;
    /**
     * Format command help text
     */
    private formatCommandHelp;
    /**
     * Format all commands help text
     */
    private formatAllCommandsHelp;
}
