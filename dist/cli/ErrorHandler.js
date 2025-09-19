"use strict";
/**
 * Error Handler
 *
 * Handles and formats errors for CLI application.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
class ErrorHandler {
    handleError(error) {
        let message = error.message;
        // Provide user-friendly messages for common errors
        if (error.message.includes('ENOENT')) {
            message = 'File not found: ' + error.message;
        }
        else if (error.message.includes('EACCES')) {
            message = 'Permission denied: ' + error.message;
        }
        else if (error.message.includes('Command not found')) {
            message = 'Command not found: ' + error.message;
        }
        return {
            success: false,
            message: message
        };
    }
    handleValidationErrors(errors) {
        const errorMessages = errors.map(error => `${error.field}: ${error.message}`);
        return {
            success: false,
            message: 'Validation failed',
            errors: errorMessages
        };
    }
    handleCLIError(error) {
        return {
            success: false,
            message: `CLI Error: ${error.message}`
        };
    }
    handleSystemError(error) {
        return {
            success: false,
            message: `System Error: ${error.message}`
        };
    }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=ErrorHandler.js.map