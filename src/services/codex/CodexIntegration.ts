/**
 * CodexIntegration Service
 * 
 * This service provides coordination functionality for Codex integration,
 * implementing the ICodexIntegration interface.
 */

import { ICodexIntegration } from '../../contracts/domain-contracts';
import { ICodexValidator } from '../../contracts/domain-contracts';
import { ICodexCommandGenerator } from '../../contracts/domain-contracts';
import {
  CodexConfiguration,
  CodexValidationResponse,
  CodexStatus,
  CodexIntegrationStatus
} from '../../contracts/domain-contracts';

/**
 * Service for coordinating Codex integration
 */
export class CodexIntegration implements ICodexIntegration {
  private readonly validator: ICodexValidator;
  private readonly commandGenerator: ICodexCommandGenerator;
  private currentConfig: CodexConfiguration | null = null;
  private isInitialized: boolean = false;
  private isConfigured: boolean = false;
  private cliAvailable: boolean = false;
  private templatesGenerated: boolean = false;
  private lastValidation: Date | undefined = undefined;
  private errorCount: number = 0;
  private status: CodexIntegrationStatus = CodexIntegrationStatus.NOT_INITIALIZED;

  constructor(validator: ICodexValidator, commandGenerator: ICodexCommandGenerator) {
    this.validator = validator;
    this.commandGenerator = commandGenerator;
  }

  /**
   * Initialize Codex integration
   */
  async initialize(config: CodexConfiguration): Promise<void> {
    try {
      this.status = CodexIntegrationStatus.INITIALIZING;
      this.currentConfig = config;
      this.isConfigured = true;

      // Check if Codex CLI is available (only if validation is enabled)
      if (config.validationEnabled) {
        try {
          this.cliAvailable = await this.validator.isCodexAvailable();
        } catch (error) {
          this.errorCount++;
          this.cliAvailable = false;
        }
      } else {
        // For Codex v2, we don't need CLI validation
        this.cliAvailable = false;
      }

      // Generate templates regardless of CLI availability for Codex v2
      try {
        await this.commandGenerator.generateTemplates(config);
        this.templatesGenerated = true;
      } catch (error) {
        this.errorCount++;
        this.templatesGenerated = false;
        throw error; // Re-throw template generation errors
      }

      this.isInitialized = true;
      this.status = this.errorCount > 0 ? CodexIntegrationStatus.ERROR : CodexIntegrationStatus.INITIALIZED;
    } catch (error) {
      this.errorCount++;
      this.status = CodexIntegrationStatus.ERROR;
      this.isInitialized = true;
      this.isConfigured = true;
      throw error;
    }
  }

  /**
   * Validate Codex setup
   */
  async validate(): Promise<CodexValidationResponse> {
    if (!this.isInitialized) {
      throw new Error('Integration not initialized');
    }

    try {
      this.status = CodexIntegrationStatus.VALIDATING;
      const result = await this.validator.validateCodexCLI();
      this.lastValidation = new Date();
      this.status = CodexIntegrationStatus.VALIDATED;
      return result;
    } catch (error) {
      this.errorCount++;
      this.status = CodexIntegrationStatus.ERROR;
      throw error;
    }
  }

  /**
   * Generate command templates
   */
  async generateCommandTemplates(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Integration not initialized');
    }

    if (!this.currentConfig) {
      throw new Error('No configuration available');
    }

    try {
      await this.commandGenerator.generateTemplates(this.currentConfig);
      this.templatesGenerated = true;
    } catch (error) {
      this.errorCount++;
      throw error;
    }
  }

  /**
   * Get current integration status
   */
  async getStatus(): Promise<CodexStatus> {
    const status: CodexStatus = {
      isInitialized: this.isInitialized,
      isConfigured: this.isConfigured,
      cliAvailable: this.cliAvailable,
      templatesGenerated: this.templatesGenerated,
      errorCount: this.errorCount,
      status: this.status
    };

    if (this.lastValidation) {
      (status as any).lastValidation = this.lastValidation;
    }

    return status;
  }

  /**
   * Reset integration to initial state
   */
  async reset(): Promise<void> {
    this.isInitialized = false;
    this.isConfigured = false;
    this.cliAvailable = false;
    this.templatesGenerated = false;
    this.lastValidation = undefined;
    this.errorCount = 0;
    this.status = CodexIntegrationStatus.NOT_INITIALIZED;
    this.currentConfig = null;
  }
}
