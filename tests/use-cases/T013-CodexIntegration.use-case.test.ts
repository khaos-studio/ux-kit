/**
 * T013: CodexIntegration Service - Use Case Tests
 * 
 * These tests define the expected behavior for the CodexIntegration service
 * before implementing the actual service logic.
 */

import { CodexIntegration } from '../../src/services/codex/CodexIntegration';
import { ICodexValidator } from '../../src/contracts/domain-contracts';
import { ICodexCommandGenerator } from '../../src/contracts/domain-contracts';
import {
  CodexConfiguration,
  CodexValidationResponse,
  CodexStatus,
  CodexIntegrationStatus,
  CodexValidationResult
} from '../../src/contracts/domain-contracts';

// Mock the validator and command generator services
jest.mock('../../src/contracts/domain-contracts');

describe('T013: CodexIntegration Service - Use Cases', () => {
  
  describe('Given a CodexIntegration service', () => {
    let codexIntegration: CodexIntegration;
    let mockValidator: jest.Mocked<ICodexValidator>;
    let mockCommandGenerator: jest.Mocked<ICodexCommandGenerator>;

    beforeEach(() => {
      // Create mock validator service
      mockValidator = {
        validateCodexCLI: jest.fn(),
        isCodexAvailable: jest.fn(),
        getCodexPath: jest.fn(),
        getCodexVersion: jest.fn()
      } as jest.Mocked<ICodexValidator>;

      // Create mock command generator service
      mockCommandGenerator = {
        generateTemplates: jest.fn(),
        getTemplate: jest.fn(),
        listTemplates: jest.fn(),
        validateTemplate: jest.fn(),
        generateCommandTemplate: jest.fn()
      } as jest.Mocked<ICodexCommandGenerator>;

      // Create CodexIntegration instance
      codexIntegration = new CodexIntegration(mockValidator, mockCommandGenerator);
    });

    describe('When initializing Codex integration', () => {
      it('Then should initialize with valid configuration and set status to initialized', async () => {
        // Given: Valid configuration
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        mockValidator.isCodexAvailable.mockResolvedValue(true);
        mockCommandGenerator.generateTemplates.mockResolvedValue();

        // When: Initializing integration
        await codexIntegration.initialize(config);

        // Then: Should be initialized and configured
        const status = await codexIntegration.getStatus();
        expect(status.isInitialized).toBe(true);
        expect(status.isConfigured).toBe(true);
        expect(status.status).toBe(CodexIntegrationStatus.INITIALIZED);
        expect(status.errorCount).toBe(0);
      });

      it('Then should handle initialization errors gracefully', async () => {
        // Given: Configuration that causes error
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        mockValidator.isCodexAvailable.mockRejectedValue(new Error('CLI not available'));

        // When: Initializing integration
        await codexIntegration.initialize(config);

        // Then: Should be initialized but with error status
        const status = await codexIntegration.getStatus();
        expect(status.isInitialized).toBe(true);
        expect(status.isConfigured).toBe(true);
        expect(status.status).toBe(CodexIntegrationStatus.ERROR);
        expect(status.errorCount).toBeGreaterThan(0);
      });

      it('Then should generate templates during initialization', async () => {
        // Given: Valid configuration
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        mockValidator.isCodexAvailable.mockResolvedValue(true);
        mockCommandGenerator.generateTemplates.mockResolvedValue();

        // When: Initializing integration
        await codexIntegration.initialize(config);

        // Then: Should generate templates
        expect(mockCommandGenerator.generateTemplates).toHaveBeenCalledWith(config);
      });

      it('Then should not generate templates if Codex CLI is not available', async () => {
        // Given: Configuration with unavailable CLI
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        mockValidator.isCodexAvailable.mockResolvedValue(false);

        // When: Initializing integration
        await codexIntegration.initialize(config);

        // Then: Should not generate templates
        expect(mockCommandGenerator.generateTemplates).not.toHaveBeenCalled();
      });
    });

    describe('When validating Codex setup', () => {
      it('Then should return success when Codex CLI is available and working', async () => {
        // Given: Integration is initialized and Codex CLI is available
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        await codexIntegration.initialize(config);

        const validationResponse: CodexValidationResponse = {
          result: CodexValidationResult.SUCCESS,
          cliPath: '/usr/local/bin/codex',
          version: '1.0.0',
          timestamp: new Date()
        };

        mockValidator.validateCodexCLI.mockResolvedValue(validationResponse);

        // When: Validating setup
        const result = await codexIntegration.validate();

        // Then: Should return success response
        expect(result.result).toBe(CodexValidationResult.SUCCESS);
        expect(result.cliPath).toBe('/usr/local/bin/codex');
        expect(result.version).toBe('1.0.0');
      });

      it('Then should return error when Codex CLI is not available', async () => {
        // Given: Integration is initialized and Codex CLI is not available
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        await codexIntegration.initialize(config);

        const validationResponse: CodexValidationResponse = {
          result: CodexValidationResult.CLI_NOT_FOUND,
          errorMessage: 'Codex CLI is not installed',
          suggestions: ['Install Codex CLI'],
          timestamp: new Date()
        };

        mockValidator.validateCodexCLI.mockResolvedValue(validationResponse);

        // When: Validating setup
        const result = await codexIntegration.validate();

        // Then: Should return error response
        expect(result.result).toBe(CodexValidationResult.CLI_NOT_FOUND);
        expect(result.errorMessage).toBe('Codex CLI is not installed');
        expect(result.suggestions).toContain('Install Codex CLI');
      });

      it('Then should update status after validation', async () => {
        // Given: Integration is initialized and Codex CLI is available
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        await codexIntegration.initialize(config);

        const validationResponse: CodexValidationResponse = {
          result: CodexValidationResult.SUCCESS,
          cliPath: '/usr/local/bin/codex',
          version: '1.0.0',
          timestamp: new Date()
        };

        mockValidator.validateCodexCLI.mockResolvedValue(validationResponse);

        // When: Validating setup
        await codexIntegration.validate();

        // Then: Should update status
        const status = await codexIntegration.getStatus();
        expect(status.lastValidation).toBeDefined();
        expect(status.status).toBe(CodexIntegrationStatus.VALIDATED);
      });

      it('Then should handle validation errors gracefully', async () => {
        // Given: Integration is initialized and validation throws error
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        await codexIntegration.initialize(config);
        mockValidator.validateCodexCLI.mockRejectedValue(new Error('Validation failed'));

        // When: Validating setup
        // Then: Should throw error
        await expect(codexIntegration.validate()).rejects.toThrow('Validation failed');
      });
    });

    describe('When generating command templates', () => {
      it('Then should generate templates successfully', async () => {
        // Given: Integration is initialized
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        await codexIntegration.initialize(config);
        mockCommandGenerator.generateTemplates.mockResolvedValue();

        // When: Generating command templates
        await codexIntegration.generateCommandTemplates();

        // Then: Should generate templates
        expect(mockCommandGenerator.generateTemplates).toHaveBeenCalled();
      });

      it('Then should update status after template generation', async () => {
        // Given: Integration is initialized
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        await codexIntegration.initialize(config);
        mockCommandGenerator.generateTemplates.mockResolvedValue();

        // When: Generating command templates
        await codexIntegration.generateCommandTemplates();

        // Then: Should update status
        const status = await codexIntegration.getStatus();
        expect(status.templatesGenerated).toBe(true);
      });

      it('Then should handle template generation errors', async () => {
        // Given: Integration is initialized
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        await codexIntegration.initialize(config);
        mockCommandGenerator.generateTemplates.mockRejectedValue(new Error('Template generation failed'));

        // When: Generating command templates
        // Then: Should throw error
        await expect(codexIntegration.generateCommandTemplates()).rejects.toThrow('Template generation failed');
      });

      it('Then should throw error if not initialized', async () => {
        // Given: Integration is not initialized
        // When: Generating command templates
        // Then: Should throw error
        await expect(codexIntegration.generateCommandTemplates()).rejects.toThrow('Integration not initialized');
      });
    });

    describe('When getting integration status', () => {
      it('Then should return not initialized status by default', async () => {
        // Given: New integration instance
        // When: Getting status
        const status = await codexIntegration.getStatus();

        // Then: Should return not initialized status
        expect(status.isInitialized).toBe(false);
        expect(status.isConfigured).toBe(false);
        expect(status.cliAvailable).toBe(false);
        expect(status.templatesGenerated).toBe(false);
        expect(status.status).toBe(CodexIntegrationStatus.NOT_INITIALIZED);
        expect(status.errorCount).toBe(0);
      });

      it('Then should return initialized status after initialization', async () => {
        // Given: Valid configuration
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        mockValidator.isCodexAvailable.mockResolvedValue(true);
        mockCommandGenerator.generateTemplates.mockResolvedValue();

        // When: Initializing and getting status
        await codexIntegration.initialize(config);
        const status = await codexIntegration.getStatus();

        // Then: Should return initialized status
        expect(status.isInitialized).toBe(true);
        expect(status.isConfigured).toBe(true);
        expect(status.cliAvailable).toBe(true);
        expect(status.templatesGenerated).toBe(true);
        expect(status.status).toBe(CodexIntegrationStatus.INITIALIZED);
      });

      it('Then should return error status when errors occur', async () => {
        // Given: Configuration that causes errors
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        mockValidator.isCodexAvailable.mockRejectedValue(new Error('CLI error'));

        // When: Initializing and getting status
        await codexIntegration.initialize(config);
        const status = await codexIntegration.getStatus();

        // Then: Should return error status
        expect(status.isInitialized).toBe(true);
        expect(status.isConfigured).toBe(true);
        expect(status.status).toBe(CodexIntegrationStatus.ERROR);
        expect(status.errorCount).toBeGreaterThan(0);
      });
    });

    describe('When resetting integration', () => {
      it('Then should reset to initial state', async () => {
        // Given: Initialized integration
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        await codexIntegration.initialize(config);

        // When: Resetting integration
        await codexIntegration.reset();

        // Then: Should return to initial state
        const status = await codexIntegration.getStatus();
        expect(status.isInitialized).toBe(false);
        expect(status.isConfigured).toBe(false);
        expect(status.cliAvailable).toBe(false);
        expect(status.templatesGenerated).toBe(false);
        expect(status.status).toBe(CodexIntegrationStatus.NOT_INITIALIZED);
        expect(status.errorCount).toBe(0);
      });

      it('Then should clear all status information', async () => {
        // Given: Initialized integration with validation
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        await codexIntegration.initialize(config);
        const validationResponse: CodexValidationResponse = {
          result: CodexValidationResult.SUCCESS,
          cliPath: '/usr/local/bin/codex',
          version: '1.0.0',
          timestamp: new Date()
        };
        mockValidator.validateCodexCLI.mockResolvedValue(validationResponse);
        await codexIntegration.validate();

        // When: Resetting integration
        await codexIntegration.reset();

        // Then: Should clear all information
        const status = await codexIntegration.getStatus();
        expect(status.lastValidation).toBeUndefined();
        expect(status.errorCount).toBe(0);
      });
    });

    describe('When handling integration workflow', () => {
      it('Then should complete full initialization workflow', async () => {
        // Given: Valid configuration
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        mockValidator.isCodexAvailable.mockResolvedValue(true);
        mockCommandGenerator.generateTemplates.mockResolvedValue();

        // When: Completing full workflow
        await codexIntegration.initialize(config);
        const status = await codexIntegration.getStatus();

        // Then: Should be fully initialized
        expect(status.isInitialized).toBe(true);
        expect(status.isConfigured).toBe(true);
        expect(status.cliAvailable).toBe(true);
        expect(status.templatesGenerated).toBe(true);
        expect(status.status).toBe(CodexIntegrationStatus.INITIALIZED);
      });

      it('Then should handle partial initialization failures', async () => {
        // Given: Configuration with CLI available but template generation fails
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        mockValidator.isCodexAvailable.mockResolvedValue(true);
        mockCommandGenerator.generateTemplates.mockRejectedValue(new Error('Template generation failed'));

        // When: Initializing integration
        await codexIntegration.initialize(config);
        const status = await codexIntegration.getStatus();

        // Then: Should be initialized but with error status
        expect(status.isInitialized).toBe(true);
        expect(status.isConfigured).toBe(true);
        expect(status.cliAvailable).toBe(true);
        expect(status.templatesGenerated).toBe(false);
        expect(status.status).toBe(CodexIntegrationStatus.ERROR);
        expect(status.errorCount).toBeGreaterThan(0);
      });

      it('Then should track error count across operations', async () => {
        // Given: Configuration that causes multiple errors
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        mockValidator.isCodexAvailable.mockRejectedValue(new Error('CLI error'));
        mockCommandGenerator.generateTemplates.mockRejectedValue(new Error('Template error'));

        // When: Initializing and attempting operations
        await codexIntegration.initialize(config);
        try {
          await codexIntegration.generateCommandTemplates();
        } catch (error) {
          // Expected to fail
        }

        // Then: Should track error count
        const status = await codexIntegration.getStatus();
        expect(status.errorCount).toBeGreaterThan(0);
      });
    });

    describe('When handling configuration changes', () => {
      it('Then should reinitialize with new configuration', async () => {
        // Given: Initial configuration
        const initialConfig: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        mockValidator.isCodexAvailable.mockResolvedValue(true);
        mockCommandGenerator.generateTemplates.mockResolvedValue();

        await codexIntegration.initialize(initialConfig);

        // When: Reinitializing with new configuration
        const newConfig: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex-v2',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 10000
        };

        await codexIntegration.initialize(newConfig);

        // Then: Should use new configuration
        expect(mockCommandGenerator.generateTemplates).toHaveBeenCalledWith(newConfig);
        const status = await codexIntegration.getStatus();
        expect(status.isInitialized).toBe(true);
        expect(status.isConfigured).toBe(true);
      });
    });
  });
});
