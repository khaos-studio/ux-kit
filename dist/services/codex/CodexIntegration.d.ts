/**
 * CodexIntegration Service
 *
 * This service provides coordination functionality for Codex integration,
 * implementing the ICodexIntegration interface.
 */
import { ICodexIntegration } from '../../contracts/domain-contracts';
import { ICodexValidator } from '../../contracts/domain-contracts';
import { ICodexCommandGenerator } from '../../contracts/domain-contracts';
import { CodexConfiguration, CodexValidationResponse, CodexStatus } from '../../contracts/domain-contracts';
/**
 * Service for coordinating Codex integration
 */
export declare class CodexIntegration implements ICodexIntegration {
    private readonly validator;
    private readonly commandGenerator;
    private currentConfig;
    private isInitialized;
    private isConfigured;
    private cliAvailable;
    private templatesGenerated;
    private lastValidation;
    private errorCount;
    private status;
    constructor(validator: ICodexValidator, commandGenerator: ICodexCommandGenerator);
    /**
     * Initialize Codex integration
     */
    initialize(config: CodexConfiguration): Promise<void>;
    /**
     * Validate Codex setup
     */
    validate(): Promise<CodexValidationResponse>;
    /**
     * Generate command templates
     */
    generateCommandTemplates(): Promise<void>;
    /**
     * Get current integration status
     */
    getStatus(): Promise<CodexStatus>;
    /**
     * Reset integration to initial state
     */
    reset(): Promise<void>;
}
