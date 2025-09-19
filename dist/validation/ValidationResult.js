"use strict";
/**
 * Validation Result
 *
 * Common types and interfaces for validation results.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
exports.createValidationResult = createValidationResult;
exports.createSuccessResult = createSuccessResult;
exports.createErrorResult = createErrorResult;
class ValidationError extends Error {
    constructor(message, field, code) {
        super(message);
        this.field = field;
        this.code = code;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
function createValidationResult(isValid, errors = [], warnings = []) {
    return {
        isValid,
        errors,
        warnings
    };
}
function createSuccessResult() {
    return createValidationResult(true);
}
function createErrorResult(errors) {
    return createValidationResult(false, errors);
}
//# sourceMappingURL=ValidationResult.js.map