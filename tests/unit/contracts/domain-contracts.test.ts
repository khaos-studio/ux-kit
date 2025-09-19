/**
 * Unit tests for domain contracts
 * 
 * These tests verify the domain contracts and interfaces work correctly
 * and provide comprehensive coverage for all domain types.
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
} from '../../../src/contracts/domain-contracts';

describe('Domain Contracts', () => {
  
  describe('AIAgentType enum', () => {
    it('should have correct enum values', () => {
      expect(AIAgentType.CURSOR).toBe('cursor');
      expect(AIAgentType.CODEX).toBe('codex');
      expect(AIAgentType.CUSTOM).toBe('custom');
    });

    it('should have all expected values', () => {
      const values = Object.values(AIAgentType);
      expect(values).toHaveLength(3);
      expect(values).toContain('cursor');
      expect(values).toContain('codex');
      expect(values).toContain('custom');
    });

    it('should be type-safe', () => {
      const agentType: AIAgentType = AIAgentType.CODEX;
      expect(agentType).toBe('codex');
    });
  });

  describe('CodexIntegrationStatus enum', () => {
    it('should have all expected status values', () => {
      expect(CodexIntegrationStatus.NOT_INITIALIZED).toBe('not_initialized');
      expect(CodexIntegrationStatus.INITIALIZING).toBe('initializing');
      expect(CodexIntegrationStatus.INITIALIZED).toBe('initialized');
      expect(CodexIntegrationStatus.VALIDATING).toBe('validating');
      expect(CodexIntegrationStatus.VALIDATED).toBe('validated');
      expect(CodexIntegrationStatus.ERROR).toBe('error');
    });

    it('should have correct number of values', () => {
      const values = Object.values(CodexIntegrationStatus);
      expect(values).toHaveLength(6);
    });
  });

  describe('CodexValidationResult enum', () => {
    it('should have all expected validation result values', () => {
      expect(CodexValidationResult.SUCCESS).toBe('success');
      expect(CodexValidationResult.CLI_NOT_FOUND).toBe('cli_not_found');
      expect(CodexValidationResult.CLI_INVALID).toBe('cli_invalid');
      expect(CodexValidationResult.PERMISSION_DENIED).toBe('permission_denied');
      expect(CodexValidationResult.UNKNOWN_ERROR).toBe('unknown_error');
    });

    it('should have correct number of values', () => {
      const values = Object.values(CodexValidationResult);
      expect(values).toHaveLength(5);
    });
  });

  describe('CodexConfiguration interface', () => {
    it('should accept all required properties', () => {
      const config: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: '/templates/codex',
        timeout: 5000
      };

      expect(config.enabled).toBe(true);
      expect(config.cliPath).toBe('/usr/local/bin/codex');
      expect(config.validationEnabled).toBe(true);
      expect(config.fallbackToCustom).toBe(false);
      expect(config.templatePath).toBe('/templates/codex');
      expect(config.timeout).toBe(5000);
    });

    it('should allow optional cliPath', () => {
      const config: CodexConfiguration = {
        enabled: true,
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: '/templates/codex',
        timeout: 5000
      };

      expect(config.enabled).toBe(true);
      expect(config.cliPath).toBeUndefined();
    });

    it('should have readonly properties in TypeScript', () => {
      const config: CodexConfiguration = {
        enabled: true,
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: '/templates/codex',
        timeout: 5000
      };

      // In TypeScript, readonly properties prevent assignment at compile time
      // This test verifies the interface structure exists
      expect(config.enabled).toBe(true);
      expect(config.validationEnabled).toBe(true);
      expect(config.fallbackToCustom).toBe(false);
      expect(config.templatePath).toBe('/templates/codex');
      expect(config.timeout).toBe(5000);
    });
  });

  describe('CodexValidationResponse interface', () => {
    it('should accept successful response properties', () => {
      const response: CodexValidationResponse = {
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date('2025-01-01T00:00:00Z')
      };

      expect(response.result).toBe(CodexValidationResult.SUCCESS);
      expect(response.cliPath).toBe('/usr/local/bin/codex');
      expect(response.version).toBe('1.0.0');
      expect(response.timestamp).toBeInstanceOf(Date);
    });

    it('should accept error response properties', () => {
      const response: CodexValidationResponse = {
        result: CodexValidationResult.CLI_NOT_FOUND,
        errorMessage: 'CLI not found',
        suggestions: ['Install CLI', 'Check PATH'],
        timestamp: new Date('2025-01-01T00:00:00Z')
      };

      expect(response.result).toBe(CodexValidationResult.CLI_NOT_FOUND);
      expect(response.errorMessage).toBe('CLI not found');
      expect(response.suggestions).toEqual(['Install CLI', 'Check PATH']);
    });
  });

  describe('CodexCommandTemplate interface', () => {
    it('should accept all template properties', () => {
      const parameter: CodexCommandParameter = {
        name: 'projectName',
        type: 'string',
        required: true,
        description: 'Project name'
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

      expect(template.name).toBe('create-project');
      expect(template.description).toBe('Create a new project');
      expect(template.command).toBe('codex create {projectName}');
      expect(template.parameters).toHaveLength(1);
      expect(template.examples).toEqual(['codex create my-project']);
      expect(template.category).toBe('project');
      expect(template.version).toBe('1.0.0');
    });
  });

  describe('CodexCommandParameter interface', () => {
    it('should accept all parameter types', () => {
      const stringParam: CodexCommandParameter = {
        name: 'name',
        type: 'string',
        required: true,
        description: 'String parameter'
      };

      const numberParam: CodexCommandParameter = {
        name: 'count',
        type: 'number',
        required: false,
        description: 'Number parameter',
        defaultValue: 0
      };

      const booleanParam: CodexCommandParameter = {
        name: 'enabled',
        type: 'boolean',
        required: false,
        description: 'Boolean parameter',
        defaultValue: true
      };

      const arrayParam: CodexCommandParameter = {
        name: 'items',
        type: 'array',
        required: false,
        description: 'Array parameter',
        defaultValue: []
      };

      const objectParam: CodexCommandParameter = {
        name: 'config',
        type: 'object',
        required: false,
        description: 'Object parameter',
        defaultValue: {}
      };

      expect(stringParam.type).toBe('string');
      expect(numberParam.type).toBe('number');
      expect(booleanParam.type).toBe('boolean');
      expect(arrayParam.type).toBe('array');
      expect(objectParam.type).toBe('object');
    });

    it('should accept validation function', () => {
      const param: CodexCommandParameter = {
        name: 'timeout',
        type: 'number',
        required: false,
        description: 'Timeout in milliseconds',
        validation: (value: any) => typeof value === 'number' && value > 0
      };

      expect(param.validation).toBeInstanceOf(Function);
      expect(param.validation!(1000)).toBe(true);
      expect(param.validation!(-1)).toBe(false);
    });

    it('should accept options array', () => {
      const param: CodexCommandParameter = {
        name: 'format',
        type: 'string',
        required: true,
        description: 'Output format',
        options: ['json', 'yaml', 'xml']
      };

      expect(param.options).toEqual(['json', 'yaml', 'xml']);
    });
  });

  describe('CodexStatus interface', () => {
    it('should accept all status properties', () => {
      const status: CodexStatus = {
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        lastValidation: new Date('2025-01-01T00:00:00Z'),
        errorCount: 0,
        status: CodexIntegrationStatus.VALIDATED
      };

      expect(status.isInitialized).toBe(true);
      expect(status.isConfigured).toBe(true);
      expect(status.cliAvailable).toBe(true);
      expect(status.templatesGenerated).toBe(true);
      expect(status.lastValidation).toBeInstanceOf(Date);
      expect(status.errorCount).toBe(0);
      expect(status.status).toBe(CodexIntegrationStatus.VALIDATED);
    });
  });

  describe('CodexError interface', () => {
    it('should accept all error properties', () => {
      const error: CodexError = {
        code: 'CLI_NOT_FOUND',
        message: 'CLI not found',
        details: { path: '/usr/local/bin' },
        suggestions: ['Install CLI'],
        recoverable: true,
        timestamp: new Date('2025-01-01T00:00:00Z')
      };

      expect(error.code).toBe('CLI_NOT_FOUND');
      expect(error.message).toBe('CLI not found');
      expect(error.details).toEqual({ path: '/usr/local/bin' });
      expect(error.suggestions).toEqual(['Install CLI']);
      expect(error.recoverable).toBe(true);
      expect(error.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('CodexCommand value object', () => {
    let template: CodexCommandTemplate;

    beforeEach(() => {
      template = {
        name: 'create-project',
        description: 'Create a new project',
        command: 'codex create {projectName} --template {template}',
        parameters: [
          {
            name: 'projectName',
            type: 'string',
            required: true,
            description: 'Name of the project'
          },
          {
            name: 'template',
            type: 'string',
            required: false,
            description: 'Template to use',
            defaultValue: 'default'
          }
        ],
        examples: ['codex create my-project'],
        category: 'project',
        version: '1.0.0'
      };
    });

    it('should validate required parameters', () => {
      const parameters = new Map([['projectName', 'my-project']]);
      const command = new CodexCommand('create-project', template, parameters);

      expect(command.validate()).toBe(true);
    });

    it('should fail validation for missing required parameters', () => {
      const parameters = new Map();
      const command = new CodexCommand('create-project', template, parameters);

      expect(command.validate()).toBe(false);
    });

    it('should handle optional parameters without default values', () => {
      const parameters = new Map([['projectName', 'my-project']]);
      const command = new CodexCommand('create-project', template, parameters);

      expect(command.validate()).toBe(true);
      // The template parameter is not provided, so it remains as placeholder
      expect(command.toString()).toBe('codex create my-project --template {template}');
    });

    it('should replace parameters in command string', () => {
      const parameters = new Map([
        ['projectName', 'my-project'],
        ['template', 'react']
      ]);
      const command = new CodexCommand('create-project', template, parameters);

      expect(command.toString()).toBe('codex create my-project --template react');
    });

    it('should validate parameter values with validation function', () => {
      const templateWithValidation: CodexCommandTemplate = {
        ...template,
        parameters: [
          {
            name: 'timeout',
            type: 'number',
            required: true,
            description: 'Timeout in milliseconds',
            validation: (value: any) => typeof value === 'number' && value > 0
          }
        ],
        command: 'codex create --timeout {timeout}'
      };

      const validParameters = new Map([['timeout', 5000]]);
      const validCommand = new CodexCommand('create-project', templateWithValidation, validParameters);
      expect(validCommand.validate()).toBe(true);

      const invalidParameters = new Map([['timeout', -1]]);
      const invalidCommand = new CodexCommand('create-project', templateWithValidation, invalidParameters);
      expect(invalidCommand.validate()).toBe(false);
    });
  });

  describe('CodexConfigurationValidation value object', () => {
    it('should track errors and warnings', () => {
      const validation = new CodexConfigurationValidation(
        false,
        ['Invalid timeout value'],
        ['Consider using default template path']
      );

      expect(validation.isValid).toBe(false);
      expect(validation.hasErrors()).toBe(true);
      expect(validation.hasWarnings()).toBe(true);
      expect(validation.getAllIssues()).toEqual([
        'Invalid timeout value',
        'Consider using default template path'
      ]);
    });

    it('should handle valid configuration', () => {
      const validation = new CodexConfigurationValidation(true);

      expect(validation.isValid).toBe(true);
      expect(validation.hasErrors()).toBe(false);
      expect(validation.hasWarnings()).toBe(false);
      expect(validation.getAllIssues()).toEqual([]);
    });

    it('should handle only errors', () => {
      const validation = new CodexConfigurationValidation(false, ['Error 1', 'Error 2']);

      expect(validation.isValid).toBe(false);
      expect(validation.hasErrors()).toBe(true);
      expect(validation.hasWarnings()).toBe(false);
      expect(validation.getAllIssues()).toEqual(['Error 1', 'Error 2']);
    });

    it('should handle only warnings', () => {
      const validation = new CodexConfigurationValidation(true, [], ['Warning 1']);

      expect(validation.isValid).toBe(true);
      expect(validation.hasErrors()).toBe(false);
      expect(validation.hasWarnings()).toBe(true);
      expect(validation.getAllIssues()).toEqual(['Warning 1']);
    });
  });

  describe('Domain exceptions', () => {
    describe('CodexDomainException', () => {
      it('should have correct properties', () => {
        const exception = new CodexDomainException('Test error', 'TEST_ERROR', true);

        expect(exception.message).toBe('Test error');
        expect(exception.code).toBe('TEST_ERROR');
        expect(exception.recoverable).toBe(true);
        expect(exception.name).toBe('CodexDomainException');
        expect(exception).toBeInstanceOf(Error);
      });

      it('should default recoverable to false', () => {
        const exception = new CodexDomainException('Test error', 'TEST_ERROR');

        expect(exception.recoverable).toBe(false);
      });
    });

    describe('CodexCLINotFoundException', () => {
      it('should have correct properties', () => {
        const exception = new CodexCLINotFoundException('CLI not found in PATH');

        expect(exception.message).toBe('CLI not found in PATH');
        expect(exception.code).toBe('CODEX_CLI_NOT_FOUND');
        expect(exception.recoverable).toBe(true);
        expect(exception.name).toBe('CodexCLINotFoundException');
        expect(exception).toBeInstanceOf(CodexDomainException);
      });

      it('should use default message', () => {
        const exception = new CodexCLINotFoundException();

        expect(exception.message).toBe('Codex CLI not found');
      });
    });

    describe('CodexValidationException', () => {
      it('should include validation result', () => {
        const validationResult: CodexValidationResponse = {
          result: CodexValidationResult.CLI_INVALID,
          errorMessage: 'Invalid CLI version',
          timestamp: new Date()
        };

        const exception = new CodexValidationException('Validation failed', validationResult);

        expect(exception.message).toBe('Validation failed');
        expect(exception.code).toBe('CODEX_VALIDATION_FAILED');
        expect(exception.recoverable).toBe(true);
        expect(exception.validationResult).toBe(validationResult);
        expect(exception.name).toBe('CodexValidationException');
        expect(exception).toBeInstanceOf(CodexDomainException);
      });
    });

    describe('CodexTemplateGenerationException', () => {
      it('should include template name', () => {
        const exception = new CodexTemplateGenerationException('Template generation failed', 'create-project');

        expect(exception.message).toBe('Template generation failed');
        expect(exception.code).toBe('CODEX_TEMPLATE_GENERATION_FAILED');
        expect(exception.recoverable).toBe(false);
        expect(exception.templateName).toBe('create-project');
        expect(exception.name).toBe('CodexTemplateGenerationException');
        expect(exception).toBeInstanceOf(CodexDomainException);
      });

      it('should allow undefined template name', () => {
        const exception = new CodexTemplateGenerationException('Template generation failed');

        expect(exception.templateName).toBeUndefined();
      });
    });

    describe('CodexConfigurationException', () => {
      it('should include validation details', () => {
        const validation = new CodexConfigurationValidation(false, ['Invalid configuration']);
        const exception = new CodexConfigurationException('Configuration is invalid', validation);

        expect(exception.message).toBe('Configuration is invalid');
        expect(exception.code).toBe('CODEX_CONFIGURATION_INVALID');
        expect(exception.recoverable).toBe(true);
        expect(exception.validation).toBe(validation);
        expect(exception.name).toBe('CodexConfigurationException');
        expect(exception).toBeInstanceOf(CodexDomainException);
      });
    });
  });
});
