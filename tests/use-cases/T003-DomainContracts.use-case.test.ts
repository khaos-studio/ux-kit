/**
 * T003: Domain Contract Tests - Use Case Tests
 * 
 * These tests define the expected behavior for domain contracts and interfaces
 * before implementing the actual contract validation logic.
 */

import {
  AIAgentType,
  CodexIntegrationStatus,
  CodexValidationResult,
  CodexConfiguration,
  CodexValidationResponse,
  CodexCommandTemplate,
  CodexCommandParameter,
  CodexStatus,
  CodexError,
  CodexCommand,
  CodexConfigurationValidation,
  CodexDomainException,
  CodexCLINotFoundException,
  CodexValidationException,
  CodexTemplateGenerationException,
  CodexConfigurationException
} from '../../src/contracts/domain-contracts';

describe('T003: Domain Contract Tests - Use Cases', () => {
  
  describe('Given AIAgentType enum', () => {
    describe('When accessing enum values', () => {
      it('Then should have CURSOR value', () => {
        // Given: AIAgentType enum
        // When: Accessing CURSOR value
        // Then: Should return correct string value
        expect(AIAgentType.CURSOR).toBe('cursor');
      });

      it('Then should have CODEX value', () => {
        // Given: AIAgentType enum
        // When: Accessing CODEX value
        // Then: Should return correct string value
        expect(AIAgentType.CODEX).toBe('codex');
      });

      it('Then should have CUSTOM value', () => {
        // Given: AIAgentType enum
        // When: Accessing CUSTOM value
        // Then: Should return correct string value
        expect(AIAgentType.CUSTOM).toBe('custom');
      });

      it('Then should have all expected values', () => {
        // Given: AIAgentType enum
        // When: Getting all enum values
        // Then: Should have exactly 3 values
        const values = Object.values(AIAgentType);
        expect(values).toHaveLength(3);
        expect(values).toContain('cursor');
        expect(values).toContain('codex');
        expect(values).toContain('custom');
      });
    });
  });

  describe('Given CodexIntegrationStatus enum', () => {
    describe('When accessing enum values', () => {
      it('Then should have all expected status values', () => {
        // Given: CodexIntegrationStatus enum
        // When: Getting all enum values
        // Then: Should have all expected status values
        const values = Object.values(CodexIntegrationStatus);
        expect(values).toContain('not_initialized');
        expect(values).toContain('initializing');
        expect(values).toContain('initialized');
        expect(values).toContain('validating');
        expect(values).toContain('validated');
        expect(values).toContain('error');
      });
    });
  });

  describe('Given CodexValidationResult enum', () => {
    describe('When accessing enum values', () => {
      it('Then should have all expected validation result values', () => {
        // Given: CodexValidationResult enum
        // When: Getting all enum values
        // Then: Should have all expected validation result values
        const values = Object.values(CodexValidationResult);
        expect(values).toContain('success');
        expect(values).toContain('cli_not_found');
        expect(values).toContain('cli_invalid');
        expect(values).toContain('permission_denied');
        expect(values).toContain('unknown_error');
      });
    });
  });

  describe('Given CodexConfiguration interface', () => {
    describe('When creating a valid configuration', () => {
      it('Then should accept all required properties', () => {
        // Given: CodexConfiguration interface
        // When: Creating a valid configuration
        const config: CodexConfiguration = {
          enabled: true,
          cliPath: '/usr/local/bin/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          templatePath: '/templates/codex',
          timeout: 5000
        };

        // Then: Should have all required properties
        expect(config.enabled).toBe(true);
        expect(config.cliPath).toBe('/usr/local/bin/codex');
        expect(config.validationEnabled).toBe(true);
        expect(config.fallbackToCustom).toBe(false);
        expect(config.templatePath).toBe('/templates/codex');
        expect(config.timeout).toBe(5000);
      });

      it('Then should allow optional cliPath', () => {
        // Given: CodexConfiguration interface
        // When: Creating configuration without cliPath
        const config: CodexConfiguration = {
          enabled: true,
          validationEnabled: true,
          fallbackToCustom: false,
          templatePath: '/templates/codex',
          timeout: 5000
        };

        // Then: Should be valid without cliPath
        expect(config.enabled).toBe(true);
        expect(config.cliPath).toBeUndefined();
        expect(config.templatePath).toBe('/templates/codex');
      });
    });
  });

  describe('Given CodexValidationResponse interface', () => {
    describe('When creating a successful validation response', () => {
      it('Then should include all required properties', () => {
        // Given: CodexValidationResponse interface
        // When: Creating a successful response
        const response: CodexValidationResponse = {
          result: CodexValidationResult.SUCCESS,
          cliPath: '/usr/local/bin/codex',
          version: '1.0.0',
          timestamp: new Date('2025-01-01T00:00:00Z')
        };

        // Then: Should have all required properties
        expect(response.result).toBe(CodexValidationResult.SUCCESS);
        expect(response.cliPath).toBe('/usr/local/bin/codex');
        expect(response.version).toBe('1.0.0');
        expect(response.timestamp).toBeInstanceOf(Date);
        expect(response.errorMessage).toBeUndefined();
        expect(response.suggestions).toBeUndefined();
      });
    });

    describe('When creating an error validation response', () => {
      it('Then should include error information', () => {
        // Given: CodexValidationResponse interface
        // When: Creating an error response
        const response: CodexValidationResponse = {
          result: CodexValidationResult.CLI_NOT_FOUND,
          errorMessage: 'Codex CLI not found in PATH',
          suggestions: ['Install Codex CLI', 'Add to PATH'],
          timestamp: new Date('2025-01-01T00:00:00Z')
        };

        // Then: Should have error information
        expect(response.result).toBe(CodexValidationResult.CLI_NOT_FOUND);
        expect(response.errorMessage).toBe('Codex CLI not found in PATH');
        expect(response.suggestions).toEqual(['Install Codex CLI', 'Add to PATH']);
        expect(response.cliPath).toBeUndefined();
        expect(response.version).toBeUndefined();
      });
    });
  });

  describe('Given CodexCommandTemplate interface', () => {
    describe('When creating a valid command template', () => {
      it('Then should include all required properties', () => {
        // Given: CodexCommandTemplate interface
        // When: Creating a valid template
        const parameter: CodexCommandParameter = {
          name: 'projectName',
          type: 'string',
          required: true,
          description: 'Name of the project'
        };

        const template: CodexCommandTemplate = {
          name: 'create-project',
          description: 'Create a new project',
          command: 'codex create {projectName}',
          parameters: [parameter],
          examples: ['codex create my-project'],
          category: 'project',
          version: '1.0.0'
        };

        // Then: Should have all required properties
        expect(template.name).toBe('create-project');
        expect(template.description).toBe('Create a new project');
        expect(template.command).toBe('codex create {projectName}');
        expect(template.parameters).toHaveLength(1);
        expect(template.examples).toEqual(['codex create my-project']);
        expect(template.category).toBe('project');
        expect(template.version).toBe('1.0.0');
      });
    });
  });

  describe('Given CodexCommandParameter interface', () => {
    describe('When creating a parameter with validation', () => {
      it('Then should include validation function', () => {
        // Given: CodexCommandParameter interface
        // When: Creating a parameter with validation
        const parameter: CodexCommandParameter = {
          name: 'timeout',
          type: 'number',
          required: false,
          description: 'Timeout in milliseconds',
          defaultValue: 5000,
          validation: (value: any) => typeof value === 'number' && value > 0,
          options: ['1000', '5000', '10000']
        };

        // Then: Should have validation function
        expect(parameter.name).toBe('timeout');
        expect(parameter.type).toBe('number');
        expect(parameter.required).toBe(false);
        expect(parameter.defaultValue).toBe(5000);
        expect(parameter.validation).toBeInstanceOf(Function);
        expect(parameter.options).toEqual(['1000', '5000', '10000']);
      });
    });
  });

  describe('Given CodexStatus interface', () => {
    describe('When creating a status object', () => {
      it('Then should include all status properties', () => {
        // Given: CodexStatus interface
        // When: Creating a status object
        const status: CodexStatus = {
          isInitialized: true,
          isConfigured: true,
          cliAvailable: true,
          templatesGenerated: true,
          lastValidation: new Date('2025-01-01T00:00:00Z'),
          errorCount: 0,
          status: CodexIntegrationStatus.VALIDATED
        };

        // Then: Should have all status properties
        expect(status.isInitialized).toBe(true);
        expect(status.isConfigured).toBe(true);
        expect(status.cliAvailable).toBe(true);
        expect(status.templatesGenerated).toBe(true);
        expect(status.lastValidation).toBeInstanceOf(Date);
        expect(status.errorCount).toBe(0);
        expect(status.status).toBe(CodexIntegrationStatus.VALIDATED);
      });
    });
  });

  describe('Given CodexError interface', () => {
    describe('When creating an error object', () => {
      it('Then should include all error properties', () => {
        // Given: CodexError interface
        // When: Creating an error object
        const error: CodexError = {
          code: 'CLI_NOT_FOUND',
          message: 'Codex CLI not found',
          details: { path: '/usr/local/bin' },
          suggestions: ['Install Codex CLI'],
          recoverable: true,
          timestamp: new Date('2025-01-01T00:00:00Z')
        };

        // Then: Should have all error properties
        expect(error.code).toBe('CLI_NOT_FOUND');
        expect(error.message).toBe('Codex CLI not found');
        expect(error.details).toEqual({ path: '/usr/local/bin' });
        expect(error.suggestions).toEqual(['Install Codex CLI']);
        expect(error.recoverable).toBe(true);
        expect(error.timestamp).toBeInstanceOf(Date);
      });
    });
  });

  describe('Given CodexCommand value object', () => {
    describe('When creating a valid command', () => {
      it('Then should validate parameters correctly', () => {
        // Given: CodexCommand value object
        // When: Creating a command with valid parameters
        const template: CodexCommandTemplate = {
          name: 'create-project',
          description: 'Create a new project',
          command: 'codex create {projectName}',
          parameters: [{
            name: 'projectName',
            type: 'string',
            required: true,
            description: 'Name of the project'
          }],
          examples: [],
          category: 'project',
          version: '1.0.0'
        };

        const parameters = new Map([['projectName', 'my-project']]);
        const command = new CodexCommand('create-project', template, parameters);

        // Then: Should validate correctly
        expect(command.validate()).toBe(true);
        expect(command.toString()).toBe('codex create my-project');
      });

      it('Then should fail validation for missing required parameters', () => {
        // Given: CodexCommand value object
        // When: Creating a command with missing required parameters
        const template: CodexCommandTemplate = {
          name: 'create-project',
          description: 'Create a new project',
          command: 'codex create {projectName}',
          parameters: [{
            name: 'projectName',
            type: 'string',
            required: true,
            description: 'Name of the project'
          }],
          examples: [],
          category: 'project',
          version: '1.0.0'
        };

        const parameters = new Map();
        const command = new CodexCommand('create-project', template, parameters);

        // Then: Should fail validation
        expect(command.validate()).toBe(false);
      });
    });
  });

  describe('Given CodexConfigurationValidation value object', () => {
    describe('When creating a validation result', () => {
      it('Then should track errors and warnings', () => {
        // Given: CodexConfigurationValidation value object
        // When: Creating a validation with errors and warnings
        const validation = new CodexConfigurationValidation(
          false,
          ['Invalid timeout value'],
          ['Consider using default template path']
        );

        // Then: Should track errors and warnings
        expect(validation.isValid).toBe(false);
        expect(validation.hasErrors()).toBe(true);
        expect(validation.hasWarnings()).toBe(true);
        expect(validation.getAllIssues()).toEqual([
          'Invalid timeout value',
          'Consider using default template path'
        ]);
      });

      it('Then should handle valid configuration', () => {
        // Given: CodexConfigurationValidation value object
        // When: Creating a validation for valid configuration
        const validation = new CodexConfigurationValidation(true);

        // Then: Should be valid
        expect(validation.isValid).toBe(true);
        expect(validation.hasErrors()).toBe(false);
        expect(validation.hasWarnings()).toBe(false);
        expect(validation.getAllIssues()).toEqual([]);
      });
    });
  });

  describe('Given domain exceptions', () => {
    describe('When creating CodexDomainException', () => {
      it('Then should have correct properties', () => {
        // Given: CodexDomainException
        // When: Creating an exception
        const exception = new CodexDomainException('Test error', 'TEST_ERROR', true);

        // Then: Should have correct properties
        expect(exception.message).toBe('Test error');
        expect(exception.code).toBe('TEST_ERROR');
        expect(exception.recoverable).toBe(true);
        expect(exception.name).toBe('CodexDomainException');
      });
    });

    describe('When creating CodexCLINotFoundException', () => {
      it('Then should have correct properties', () => {
        // Given: CodexCLINotFoundException
        // When: Creating an exception
        const exception = new CodexCLINotFoundException('CLI not found in PATH');

        // Then: Should have correct properties
        expect(exception.message).toBe('CLI not found in PATH');
        expect(exception.code).toBe('CODEX_CLI_NOT_FOUND');
        expect(exception.recoverable).toBe(true);
        expect(exception.name).toBe('CodexCLINotFoundException');
      });
    });

    describe('When creating CodexValidationException', () => {
      it('Then should include validation result', () => {
        // Given: CodexValidationException
        // When: Creating an exception with validation result
        const validationResult: CodexValidationResponse = {
          result: CodexValidationResult.CLI_INVALID,
          errorMessage: 'Invalid CLI version',
          timestamp: new Date()
        };

        const exception = new CodexValidationException('Validation failed', validationResult);

        // Then: Should include validation result
        expect(exception.message).toBe('Validation failed');
        expect(exception.code).toBe('CODEX_VALIDATION_FAILED');
        expect(exception.recoverable).toBe(true);
        expect(exception.validationResult).toBe(validationResult);
        expect(exception.name).toBe('CodexValidationException');
      });
    });

    describe('When creating CodexTemplateGenerationException', () => {
      it('Then should include template name', () => {
        // Given: CodexTemplateGenerationException
        // When: Creating an exception with template name
        const exception = new CodexTemplateGenerationException('Template generation failed', 'create-project');

        // Then: Should include template name
        expect(exception.message).toBe('Template generation failed');
        expect(exception.code).toBe('CODEX_TEMPLATE_GENERATION_FAILED');
        expect(exception.recoverable).toBe(false);
        expect(exception.templateName).toBe('create-project');
        expect(exception.name).toBe('CodexTemplateGenerationException');
      });
    });

    describe('When creating CodexConfigurationException', () => {
      it('Then should include validation details', () => {
        // Given: CodexConfigurationException
        // When: Creating an exception with validation
        const validation = new CodexConfigurationValidation(false, ['Invalid configuration']);
        const exception = new CodexConfigurationException('Configuration is invalid', validation);

        // Then: Should include validation details
        expect(exception.message).toBe('Configuration is invalid');
        expect(exception.code).toBe('CODEX_CONFIGURATION_INVALID');
        expect(exception.recoverable).toBe(true);
        expect(exception.validation).toBe(validation);
        expect(exception.name).toBe('CodexConfigurationException');
      });
    });
  });
});
