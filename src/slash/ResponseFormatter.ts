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

export class ResponseFormatter {
  /**
   * Format successful command response
   */
  formatSuccess(
    command: string,
    parameters: Record<string, any>,
    response: string,
    executionTime: number,
    metadata?: Record<string, any>
  ): CommandResponse {
    return {
      success: true,
      command,
      parameters,
      response,
      timestamp: new Date(),
      executionTime,
      metadata
    };
  }

  /**
   * Format error command response
   */
  formatError(
    command: string,
    parameters: Record<string, any>,
    error: string,
    executionTime: number,
    metadata?: Record<string, any>
  ): CommandResponse {
    return {
      success: false,
      command,
      parameters,
      error,
      timestamp: new Date(),
      executionTime,
      metadata
    };
  }

  /**
   * Format IDE command response
   */
  formatIDEResponse(
    request: IDECommandRequest,
    success: boolean,
    response?: string,
    error?: string,
    executionTime: number = 0
  ): IDECommandResponse {
    return {
      success,
      response,
      error,
      context: request.context,
      timestamp: new Date(),
      executionTime
    };
  }

  /**
   * Format help response
   */
  formatHelpResponse(
    command: string,
    help: string,
    executionTime: number
  ): CommandResponse {
    return {
      success: true,
      command: 'help',
      parameters: { command },
      response: help,
      timestamp: new Date(),
      executionTime
    };
  }

  /**
   * Format command list response
   */
  formatCommandListResponse(
    commands: string[],
    executionTime: number
  ): CommandResponse {
    const response = commands.map(cmd => `- ${cmd}`).join('\n');
    
    return {
      success: true,
      command: 'list',
      parameters: {},
      response: `Available commands:\n${response}`,
      timestamp: new Date(),
      executionTime
    };
  }

  /**
   * Format validation error response
   */
  formatValidationError(
    command: string,
    parameters: Record<string, any>,
    errors: string[],
    executionTime: number
  ): CommandResponse {
    const errorMessage = `Validation failed:\n${errors.map(e => `- ${e}`).join('\n')}`;
    
    return {
      success: false,
      command,
      parameters,
      error: errorMessage,
      timestamp: new Date(),
      executionTime
    };
  }

  /**
   * Format parsing error response
   */
  formatParsingError(
    commandString: string,
    error: string,
    executionTime: number
  ): CommandResponse {
    return {
      success: false,
      command: 'unknown',
      parameters: { original: commandString },
      error: `Parsing error: ${error}`,
      timestamp: new Date(),
      executionTime
    };
  }

  /**
   * Format execution error response
   */
  formatExecutionError(
    command: string,
    parameters: Record<string, any>,
    error: string,
    executionTime: number
  ): CommandResponse {
    return {
      success: false,
      command,
      parameters,
      error: `Execution error: ${error}`,
      timestamp: new Date(),
      executionTime
    };
  }

  /**
   * Format response for display in IDE
   */
  formatForDisplay(response: CommandResponse): string {
    if (response.success) {
      return `✅ ${response.command}\n${response.response || 'Command executed successfully'}`;
    } else {
      return `❌ ${response.command}\n${response.error || 'Command failed'}`;
    }
  }

  /**
   * Format response as JSON
   */
  formatAsJSON(response: CommandResponse): string {
    return JSON.stringify(response, null, 2);
  }

  /**
   * Format response as markdown
   */
  formatAsMarkdown(response: CommandResponse): string {
    if (response.success) {
      return `## ✅ ${response.command}\n\n${response.response || 'Command executed successfully'}\n\n**Parameters:**\n${this.formatParametersAsMarkdown(response.parameters)}\n\n**Execution Time:** ${response.executionTime}ms`;
    } else {
      return `## ❌ ${response.command}\n\n${response.error || 'Command failed'}\n\n**Parameters:**\n${this.formatParametersAsMarkdown(response.parameters)}\n\n**Execution Time:** ${response.executionTime}ms`;
    }
  }

  /**
   * Format parameters as markdown
   */
  private formatParametersAsMarkdown(parameters: Record<string, any>): string {
    if (Object.keys(parameters).length === 0) {
      return 'None';
    }

    return Object.entries(parameters)
      .map(([key, value]) => `- **${key}:** ${value}`)
      .join('\n');
  }

  /**
   * Add metadata to response
   */
  addMetadata(response: CommandResponse, metadata: Record<string, any>): CommandResponse {
    return {
      ...response,
      metadata: {
        ...response.metadata,
        ...metadata
      }
    };
  }

  /**
   * Get response summary
   */
  getResponseSummary(response: CommandResponse): string {
    const status = response.success ? 'SUCCESS' : 'FAILED';
    const time = `${response.executionTime}ms`;
    return `${status} - ${response.command} (${time})`;
  }
}
