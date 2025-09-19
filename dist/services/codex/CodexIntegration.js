"use strict";
/**
 * CodexIntegration Service
 *
 * This service provides coordination functionality for Codex integration,
 * implementing the ICodexIntegration interface.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodexIntegration = void 0;
const domain_contracts_1 = require("../../contracts/domain-contracts");
/**
 * Service for coordinating Codex integration
 */
class CodexIntegration {
    constructor(validator, commandGenerator) {
        this.currentConfig = null;
        this.isInitialized = false;
        this.isConfigured = false;
        this.cliAvailable = false;
        this.templatesGenerated = false;
        this.lastValidation = undefined;
        this.errorCount = 0;
        this.status = domain_contracts_1.CodexIntegrationStatus.NOT_INITIALIZED;
        this.validator = validator;
        this.commandGenerator = commandGenerator;
    }
    /**
     * Initialize Codex integration
     */
    async initialize(config) {
        try {
            this.status = domain_contracts_1.CodexIntegrationStatus.INITIALIZING;
            this.currentConfig = config;
            this.isConfigured = true;
            // Check if Codex CLI is available (only if validation is enabled)
            if (config.validationEnabled) {
                try {
                    this.cliAvailable = await this.validator.isCodexAvailable();
                }
                catch (error) {
                    this.errorCount++;
                    this.cliAvailable = false;
                }
            }
            else {
                // For Codex v2, we don't need CLI validation
                this.cliAvailable = false;
            }
            // Generate templates regardless of CLI availability for Codex v2
            try {
                await this.commandGenerator.generateTemplates(config);
                this.templatesGenerated = true;
            }
            catch (error) {
                this.errorCount++;
                this.templatesGenerated = false;
                throw error; // Re-throw template generation errors
            }
            this.isInitialized = true;
            this.status = this.errorCount > 0 ? domain_contracts_1.CodexIntegrationStatus.ERROR : domain_contracts_1.CodexIntegrationStatus.INITIALIZED;
        }
        catch (error) {
            this.errorCount++;
            this.status = domain_contracts_1.CodexIntegrationStatus.ERROR;
            this.isInitialized = true;
            this.isConfigured = true;
            throw error;
        }
    }
    /**
     * Validate Codex setup
     */
    async validate() {
        if (!this.isInitialized) {
            throw new Error('Integration not initialized');
        }
        try {
            this.status = domain_contracts_1.CodexIntegrationStatus.VALIDATING;
            const result = await this.validator.validateCodexCLI();
            this.lastValidation = new Date();
            this.status = domain_contracts_1.CodexIntegrationStatus.VALIDATED;
            return result;
        }
        catch (error) {
            this.errorCount++;
            this.status = domain_contracts_1.CodexIntegrationStatus.ERROR;
            throw error;
        }
    }
    /**
     * Generate command templates
     */
    async generateCommandTemplates() {
        if (!this.isInitialized) {
            throw new Error('Integration not initialized');
        }
        if (!this.currentConfig) {
            throw new Error('No configuration available');
        }
        try {
            await this.commandGenerator.generateTemplates(this.currentConfig);
            this.templatesGenerated = true;
        }
        catch (error) {
            this.errorCount++;
            throw error;
        }
    }
    /**
     * Get current integration status
     */
    async getStatus() {
        const status = {
            isInitialized: this.isInitialized,
            isConfigured: this.isConfigured,
            cliAvailable: this.cliAvailable,
            templatesGenerated: this.templatesGenerated,
            errorCount: this.errorCount,
            status: this.status
        };
        if (this.lastValidation) {
            status.lastValidation = this.lastValidation;
        }
        return status;
    }
    /**
     * Reset integration to initial state
     */
    async reset() {
        this.isInitialized = false;
        this.isConfigured = false;
        this.cliAvailable = false;
        this.templatesGenerated = false;
        this.lastValidation = undefined;
        this.errorCount = 0;
        this.status = domain_contracts_1.CodexIntegrationStatus.NOT_INITIALIZED;
        this.currentConfig = null;
    }
}
exports.CodexIntegration = CodexIntegration;
//# sourceMappingURL=CodexIntegration.js.map