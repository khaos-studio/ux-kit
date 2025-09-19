"use strict";
/**
 * Domain Contracts for Codex Support Integration
 *
 * These contracts define the core domain interfaces and types for Codex integration
 * following the existing UX-Kit architecture patterns.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodexConfigurationException = exports.CodexTemplateGenerationException = exports.CodexValidationException = exports.CodexCLINotFoundException = exports.CodexDomainException = exports.CodexConfigurationValidation = exports.CodexCommand = exports.CodexValidationResult = exports.CodexIntegrationStatus = exports.AIAgentType = void 0;
// ============================================================================
// Core Domain Types
// ============================================================================
/**
 * AI Agent types supported by UX-Kit
 */
var AIAgentType;
(function (AIAgentType) {
    AIAgentType["CURSOR"] = "cursor";
    AIAgentType["CODEX"] = "codex";
    AIAgentType["CUSTOM"] = "custom";
})(AIAgentType || (exports.AIAgentType = AIAgentType = {}));
/**
 * Codex integration status
 */
var CodexIntegrationStatus;
(function (CodexIntegrationStatus) {
    CodexIntegrationStatus["NOT_INITIALIZED"] = "not_initialized";
    CodexIntegrationStatus["INITIALIZING"] = "initializing";
    CodexIntegrationStatus["INITIALIZED"] = "initialized";
    CodexIntegrationStatus["VALIDATING"] = "validating";
    CodexIntegrationStatus["VALIDATED"] = "validated";
    CodexIntegrationStatus["ERROR"] = "error";
})(CodexIntegrationStatus || (exports.CodexIntegrationStatus = CodexIntegrationStatus = {}));
/**
 * Codex CLI validation result
 */
var CodexValidationResult;
(function (CodexValidationResult) {
    CodexValidationResult["SUCCESS"] = "success";
    CodexValidationResult["CLI_NOT_FOUND"] = "cli_not_found";
    CodexValidationResult["CLI_INVALID"] = "cli_invalid";
    CodexValidationResult["PERMISSION_DENIED"] = "permission_denied";
    CodexValidationResult["UNKNOWN_ERROR"] = "unknown_error";
})(CodexValidationResult || (exports.CodexValidationResult = CodexValidationResult = {}));
// ============================================================================
// Domain Value Objects
// ============================================================================
/**
 * Value object representing a Codex command
 */
class CodexCommand {
    constructor(name, template, parameters = new Map()) {
        this.name = name;
        this.template = template;
        this.parameters = parameters;
    }
    /**
     * Validate command parameters
     */
    validate() {
        for (const param of this.template.parameters) {
            if (param.required && !this.parameters.has(param.name)) {
                return false;
            }
            const value = this.parameters.get(param.name);
            if (value !== undefined && param.validation && !param.validation(value)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Get command as string
     */
    toString() {
        let command = this.template.command;
        for (const [key, value] of this.parameters) {
            const placeholder = `{${key}}`;
            if (command.includes(placeholder)) {
                command = command.replace(placeholder, String(value));
            }
        }
        return command;
    }
}
exports.CodexCommand = CodexCommand;
/**
 * Value object representing Codex configuration validation result
 */
class CodexConfigurationValidation {
    constructor(isValid, errors = [], warnings = []) {
        this.isValid = isValid;
        this.errors = errors;
        this.warnings = warnings;
    }
    /**
     * Check if configuration has errors
     */
    hasErrors() {
        return this.errors.length > 0;
    }
    /**
     * Check if configuration has warnings
     */
    hasWarnings() {
        return this.warnings.length > 0;
    }
    /**
     * Get all issues (errors and warnings)
     */
    getAllIssues() {
        return [...this.errors, ...this.warnings];
    }
}
exports.CodexConfigurationValidation = CodexConfigurationValidation;
// ============================================================================
// Domain Exceptions
// ============================================================================
/**
 * Base exception for Codex domain errors
 */
class CodexDomainException extends Error {
    constructor(message, code, recoverable = false) {
        super(message);
        this.code = code;
        this.recoverable = recoverable;
        this.name = 'CodexDomainException';
    }
}
exports.CodexDomainException = CodexDomainException;
/**
 * Exception thrown when Codex CLI is not found
 */
class CodexCLINotFoundException extends CodexDomainException {
    constructor(message = 'Codex CLI not found') {
        super(message, 'CODEX_CLI_NOT_FOUND', true);
        this.name = 'CodexCLINotFoundException';
    }
}
exports.CodexCLINotFoundException = CodexCLINotFoundException;
/**
 * Exception thrown when Codex CLI validation fails
 */
class CodexValidationException extends CodexDomainException {
    constructor(message, validationResult) {
        super(message, 'CODEX_VALIDATION_FAILED', true);
        this.validationResult = validationResult;
        this.name = 'CodexValidationException';
    }
}
exports.CodexValidationException = CodexValidationException;
/**
 * Exception thrown when template generation fails
 */
class CodexTemplateGenerationException extends CodexDomainException {
    constructor(message, templateName) {
        super(message, 'CODEX_TEMPLATE_GENERATION_FAILED', false);
        this.templateName = templateName;
        this.name = 'CodexTemplateGenerationException';
    }
}
exports.CodexTemplateGenerationException = CodexTemplateGenerationException;
/**
 * Exception thrown when configuration is invalid
 */
class CodexConfigurationException extends CodexDomainException {
    constructor(message, validation) {
        super(message, 'CODEX_CONFIGURATION_INVALID', true);
        this.validation = validation;
        this.name = 'CodexConfigurationException';
    }
}
exports.CodexConfigurationException = CodexConfigurationException;
//# sourceMappingURL=domain-contracts.js.map