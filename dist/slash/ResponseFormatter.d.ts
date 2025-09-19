/**
 * Response Formatter for Slash Commands
 *
 * Formats command execution results into consistent response structures.
 */
export interface CommandResponse {
    success: boolean;
    command: string;
    parameters: Record<string, any>;
    response?: string | undefined;
    error?: string | undefined;
    timestamp: Date;
    executionTime: number;
    metadata?: Record<string, any> | undefined;
}
export interface IDECommandRequest {
    command: string;
    context?: {
        workspace?: string;
        file?: string;
        line?: number;
        column?: number;
    };
}
export interface IDECommandResponse {
    success: boolean;
    response?: string | undefined;
    error?: string | undefined;
    context?: Record<string, any> | undefined;
    timestamp: Date;
    executionTime: number;
}
export declare class ResponseFormatter {
    /**
     * Format successful command response
     */
    formatSuccess(command: string, parameters: Record<string, any>, response: string, executionTime: number, metadata?: Record<string, any>): CommandResponse;
    /**
     * Format error command response
     */
    formatError(command: string, parameters: Record<string, any>, error: string, executionTime: number, metadata?: Record<string, any>): CommandResponse;
    /**
     * Format IDE command response
     */
    formatIDEResponse(request: IDECommandRequest, success: boolean, response?: string, error?: string, executionTime?: number): IDECommandResponse;
    /**
     * Format help response
     */
    formatHelpResponse(command: string, help: string, executionTime: number): CommandResponse;
    /**
     * Format command list response
     */
    formatCommandListResponse(commands: string[], executionTime: number): CommandResponse;
    /**
     * Format validation error response
     */
    formatValidationError(command: string, parameters: Record<string, any>, errors: string[], executionTime: number): CommandResponse;
    /**
     * Format parsing error response
     */
    formatParsingError(commandString: string, error: string, executionTime: number): CommandResponse;
    /**
     * Format execution error response
     */
    formatExecutionError(command: string, parameters: Record<string, any>, error: string, executionTime: number): CommandResponse;
    /**
     * Format response for display in IDE
     */
    formatForDisplay(response: CommandResponse): string;
    /**
     * Format response as JSON
     */
    formatAsJSON(response: CommandResponse): string;
    /**
     * Format response as markdown
     */
    formatAsMarkdown(response: CommandResponse): string;
    /**
     * Format parameters as markdown
     */
    private formatParametersAsMarkdown;
    /**
     * Add metadata to response
     */
    addMetadata(response: CommandResponse, metadata: Record<string, any>): CommandResponse;
    /**
     * Get response summary
     */
    getResponseSummary(response: CommandResponse): string;
}
