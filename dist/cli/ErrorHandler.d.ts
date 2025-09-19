/**
 * Error Handler
 *
 * Handles and formats errors for CLI application.
 */
import { ValidationError } from '../contracts/presentation-contracts';
export declare class ErrorHandler {
    handleError(error: Error): {
        success: boolean;
        message: string;
        errors?: string[];
    };
    handleValidationErrors(errors: ValidationError[]): {
        success: boolean;
        message: string;
        errors: string[];
    };
    handleCLIError(error: Error): {
        success: boolean;
        message: string;
    };
    handleSystemError(error: Error): {
        success: boolean;
        message: string;
    };
}
