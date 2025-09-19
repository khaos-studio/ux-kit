/**
 * Command Parser for Slash Commands
 *
 * Parses slash commands and extracts command name and parameters.
 */
export interface ParsedCommand {
    command: string;
    parameters: Record<string, any>;
}
export interface CommandSchema {
    name: string;
    required: string[];
    optional: string[];
    types: Record<string, 'string' | 'number' | 'boolean'>;
}
export declare class CommandParser {
    private commandSchemas;
    constructor();
    /**
     * Parse a slash command string
     */
    parse(commandString: string): ParsedCommand;
    /**
     * Validate parsed command against schema
     */
    validate(parsedCommand: ParsedCommand): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Parse command parts handling quoted strings
     */
    private parseCommandParts;
    /**
     * Parse command parameters from string array
     */
    private parseParameters;
    /**
     * Parse a parameter value
     */
    private parseValue;
    /**
     * Check if value matches expected type
     */
    private isValidType;
    /**
     * Initialize command schemas
     */
    private initializeCommandSchemas;
    /**
     * Get available commands
     */
    getAvailableCommands(): string[];
    /**
     * Get command schema
     */
    getCommandSchema(command: string): CommandSchema | undefined;
}
