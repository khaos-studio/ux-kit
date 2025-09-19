"use strict";
/**
 * Response Formatter for Slash Commands
 *
 * Formats command execution results into consistent response structures.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseFormatter = void 0;
class ResponseFormatter {
    /**
     * Format successful command response
     */
    formatSuccess(command, parameters, response, executionTime, metadata) {
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
    formatError(command, parameters, error, executionTime, metadata) {
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
    formatIDEResponse(request, success, response, error, executionTime = 0) {
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
    formatHelpResponse(command, help, executionTime) {
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
    formatCommandListResponse(commands, executionTime) {
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
    formatValidationError(command, parameters, errors, executionTime) {
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
    formatParsingError(commandString, error, executionTime) {
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
    formatExecutionError(command, parameters, error, executionTime) {
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
    formatForDisplay(response) {
        if (response.success) {
            return `✅ ${response.command}\n${response.response || 'Command executed successfully'}`;
        }
        else {
            return `❌ ${response.command}\n${response.error || 'Command failed'}`;
        }
    }
    /**
     * Format response as JSON
     */
    formatAsJSON(response) {
        return JSON.stringify(response, null, 2);
    }
    /**
     * Format response as markdown
     */
    formatAsMarkdown(response) {
        if (response.success) {
            return `## ✅ ${response.command}\n\n${response.response || 'Command executed successfully'}\n\n**Parameters:**\n${this.formatParametersAsMarkdown(response.parameters)}\n\n**Execution Time:** ${response.executionTime}ms`;
        }
        else {
            return `## ❌ ${response.command}\n\n${response.error || 'Command failed'}\n\n**Parameters:**\n${this.formatParametersAsMarkdown(response.parameters)}\n\n**Execution Time:** ${response.executionTime}ms`;
        }
    }
    /**
     * Format parameters as markdown
     */
    formatParametersAsMarkdown(parameters) {
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
    addMetadata(response, metadata) {
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
    getResponseSummary(response) {
        const status = response.success ? 'SUCCESS' : 'FAILED';
        const time = `${response.executionTime}ms`;
        return `${status} - ${response.command} (${time})`;
    }
}
exports.ResponseFormatter = ResponseFormatter;
//# sourceMappingURL=ResponseFormatter.js.map