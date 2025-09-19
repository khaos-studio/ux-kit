/**
 * T004: Application Contract Tests - Use Case Tests
 * 
 * These tests define the expected behavior for application contracts and services
 * before implementing the actual contract validation logic.
 */

import {
  ICodexIntegrationService,
  IAIAgentSelectionService,
  ICommandTemplateService,
  CodexInitializationRequest,
  CodexInitializationResponse,
  TemplateGenerationRequest,
  TemplateGenerationResponse,
  ValidationRequest,
  ValidationResponse,
  InitializeCodexCommand,
  ValidateCodexCommand,
  GenerateCodexTemplatesCommand,
  ResetCodexCommand,
  GetCodexStatusQuery,
  GetAvailableAgentsQuery,
  GetTemplatesForAgentQuery,
  CodexInitializationStartedEvent,
  CodexInitializationCompletedEvent,
  CodexValidationStartedEvent,
  CodexValidationCompletedEvent,
  TemplateGenerationStartedEvent,
  TemplateGenerationCompletedEvent,
  ICodexInitializationHandler,
  ICodexValidationHandler,
  ITemplateGenerationHandler,
  ICodexResetHandler,
  ICodexStatusQueryHandler,
  IAvailableAgentsQueryHandler,
  ITemplatesQueryHandler,
  CodexApplicationConfig,
  TemplateGenerationConfig,
  CodexApplicationException,
  CodexInitializationException,
  CodexValidationApplicationException,
  TemplateGenerationApplicationException,
  CodexApplicationUtils
} from '../../src/contracts/application-contracts';
import {
  CodexConfiguration,
  CodexValidationResponse,
  CodexCommandTemplate,
  CodexStatus,
  CodexError,
  CodexValidationResult,
  CodexIntegrationStatus
} from '../../src/contracts/domain-contracts';

describe('T004: Application Contract Tests - Use Cases', () => {
  
  describe('Given ICodexIntegrationService interface', () => {
    describe('When implementing Codex integration service', () => {
      it('Then should provide initialization method', () => {
        // Given: ICodexIntegrationService interface
        // When: Implementing the service
        const service: ICodexIntegrationService = {
          async initializeCodex(config: CodexConfiguration): Promise<void> {
            // Implementation would go here
          },
          async validateCodexSetup(): Promise<CodexValidationResponse> {
            return {
              result: CodexValidationResult.SUCCESS,
              timestamp: new Date()
            };
          },
          async generateCodexTemplates(): Promise<void> {
            // Implementation would go here
          },
          async getCodexStatus(): Promise<CodexStatus> {
            return {
              isInitialized: true,
              isConfigured: true,
              cliAvailable: true,
              templatesGenerated: true,
              errorCount: 0,
              status: CodexIntegrationStatus.VALIDATED
            };
          },
          async handleCodexError(error: CodexError): Promise<void> {
            // Implementation would go here
          },
          async resetCodexIntegration(): Promise<void> {
            // Implementation would go here
          }
        };

        // Then: Should have all required methods
        expect(service.initializeCodex).toBeInstanceOf(Function);
        expect(service.validateCodexSetup).toBeInstanceOf(Function);
        expect(service.generateCodexTemplates).toBeInstanceOf(Function);
        expect(service.getCodexStatus).toBeInstanceOf(Function);
        expect(service.handleCodexError).toBeInstanceOf(Function);
        expect(service.resetCodexIntegration).toBeInstanceOf(Function);
      });

      it('Then should handle initialization with configuration', async () => {
        // Given: ICodexIntegrationService interface
        // When: Calling initializeCodex with configuration
        const service: ICodexIntegrationService = {
          async initializeCodex(config: CodexConfiguration): Promise<void> {
            expect(config.enabled).toBe(true);
            expect(config.templatePath).toBe('templates/codex');
          },
          async validateCodexSetup(): Promise<CodexValidationResponse> {
            return { result: CodexValidationResult.SUCCESS, timestamp: new Date() };
          },
          async generateCodexTemplates(): Promise<void> {},
          async getCodexStatus(): Promise<CodexStatus> {
            return { isInitialized: true, isConfigured: true, cliAvailable: true, templatesGenerated: true, errorCount: 0, status: CodexIntegrationStatus.VALIDATED };
          },
          async handleCodexError(error: CodexError): Promise<void> {},
          async resetCodexIntegration(): Promise<void> {}
        };

        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        // Then: Should accept configuration and process it
        await expect(service.initializeCodex(config)).resolves.not.toThrow();
      });
    });
  });

  describe('Given IAIAgentSelectionService interface', () => {
    describe('When implementing AI agent selection service', () => {
      it('Then should provide agent management methods', () => {
        // Given: IAIAgentSelectionService interface
        // When: Implementing the service
        const service: IAIAgentSelectionService = {
          async getAvailableAgents(): Promise<readonly string[]> {
            return ['cursor', 'codex', 'custom'];
          },
          async validateAgent(agentType: string): Promise<boolean> {
            return ['cursor', 'codex', 'custom'].includes(agentType);
          },
          async initializeAgent(agentType: string, config: any): Promise<void> {
            // Implementation would go here
          },
          async getAgentConfiguration(agentType: string): Promise<any> {
            return { type: agentType, enabled: true };
          }
        };

        // Then: Should have all required methods
        expect(service.getAvailableAgents).toBeInstanceOf(Function);
        expect(service.validateAgent).toBeInstanceOf(Function);
        expect(service.initializeAgent).toBeInstanceOf(Function);
        expect(service.getAgentConfiguration).toBeInstanceOf(Function);
      });

      it('Then should return available agents', async () => {
        // Given: IAIAgentSelectionService interface
        // When: Getting available agents
        const service: IAIAgentSelectionService = {
          async getAvailableAgents(): Promise<readonly string[]> {
            return ['cursor', 'codex', 'custom'];
          },
          async validateAgent(agentType: string): Promise<boolean> { return true; },
          async initializeAgent(agentType: string, config: any): Promise<void> {},
          async getAgentConfiguration(agentType: string): Promise<any> { return {}; }
        };

        // Then: Should return list of available agents
        const agents = await service.getAvailableAgents();
        expect(agents).toEqual(['cursor', 'codex', 'custom']);
        expect(agents).toHaveLength(3);
      });
    });
  });

  describe('Given ICommandTemplateService interface', () => {
    describe('When implementing command template service', () => {
      it('Then should provide template management methods', () => {
        // Given: ICommandTemplateService interface
        // When: Implementing the service
        const service: ICommandTemplateService = {
          async generateTemplatesForAgent(agentType: string): Promise<void> {
            // Implementation would go here
          },
          async getTemplatesForAgent(agentType: string): Promise<readonly CodexCommandTemplate[]> {
            return [];
          },
          async validateTemplate(template: CodexCommandTemplate): Promise<boolean> {
            return true;
          },
          async updateTemplateConfiguration(agentType: string, config: any): Promise<void> {
            // Implementation would go here
          }
        };

        // Then: Should have all required methods
        expect(service.generateTemplatesForAgent).toBeInstanceOf(Function);
        expect(service.getTemplatesForAgent).toBeInstanceOf(Function);
        expect(service.validateTemplate).toBeInstanceOf(Function);
        expect(service.updateTemplateConfiguration).toBeInstanceOf(Function);
      });
    });
  });

  describe('Given application DTOs', () => {
    describe('When creating CodexInitializationRequest', () => {
      it('Then should accept all required properties', () => {
        // Given: CodexInitializationRequest interface
        // When: Creating a request
        const request: CodexInitializationRequest = {
          projectPath: '/path/to/project',
          configuration: {
            enabled: true,
            templatePath: 'templates/codex',
            validationEnabled: true,
            fallbackToCustom: false,
            timeout: 5000
          },
          skipValidation: false,
          forceReinit: true
        };

        // Then: Should have all properties
        expect(request.projectPath).toBe('/path/to/project');
        expect(request.configuration.enabled).toBe(true);
        expect(request.skipValidation).toBe(false);
        expect(request.forceReinit).toBe(true);
      });
    });

    describe('When creating CodexInitializationResponse', () => {
      it('Then should include success status and optional error', () => {
        // Given: CodexInitializationResponse interface
        // When: Creating a successful response
        const response: CodexInitializationResponse = {
          success: true,
          status: {
            isInitialized: true,
            isConfigured: true,
            cliAvailable: true,
            templatesGenerated: true,
            errorCount: 0,
            status: CodexIntegrationStatus.VALIDATED
          }
        };

        // Then: Should have success status
        expect(response.success).toBe(true);
        expect(response.status.isInitialized).toBe(true);
        expect(response.error).toBeUndefined();
        expect(response.validationResult).toBeUndefined();
      });

      it('Then should include error information when failed', () => {
        // Given: CodexInitializationResponse interface
        // When: Creating a failed response
        const error: CodexError = {
          code: 'INIT_FAILED',
          message: 'Initialization failed',
          recoverable: true,
          timestamp: new Date()
        };

        const response: CodexInitializationResponse = {
          success: false,
          status: {
            isInitialized: false,
            isConfigured: false,
            cliAvailable: false,
            templatesGenerated: false,
            errorCount: 1,
            status: CodexIntegrationStatus.ERROR
          },
          error
        };

        // Then: Should include error information
        expect(response.success).toBe(false);
        expect(response.error).toBe(error);
        expect(response.status.errorCount).toBe(1);
      });
    });

    describe('When creating TemplateGenerationRequest', () => {
      it('Then should accept all template generation options', () => {
        // Given: TemplateGenerationRequest interface
        // When: Creating a request
        const request: TemplateGenerationRequest = {
          agentType: 'codex',
          outputPath: '/output/templates',
          templateFormat: 'markdown',
          includeExamples: true,
          includeDocumentation: true
        };

        // Then: Should have all properties
        expect(request.agentType).toBe('codex');
        expect(request.outputPath).toBe('/output/templates');
        expect(request.templateFormat).toBe('markdown');
        expect(request.includeExamples).toBe(true);
        expect(request.includeDocumentation).toBe(true);
      });
    });

    describe('When creating ValidationRequest', () => {
      it('Then should accept validation options', () => {
        // Given: ValidationRequest interface
        // When: Creating a request
        const request: ValidationRequest = {
          agentType: 'codex',
          skipCLICheck: false,
          timeout: 10000
        };

        // Then: Should have all properties
        expect(request.agentType).toBe('codex');
        expect(request.skipCLICheck).toBe(false);
        expect(request.timeout).toBe(10000);
      });
    });
  });

  describe('Given application commands', () => {
    describe('When creating InitializeCodexCommand', () => {
      it('Then should have correct command structure', () => {
        // Given: InitializeCodexCommand interface
        // When: Creating a command
        const request: CodexInitializationRequest = {
          projectPath: '/path/to/project',
          configuration: { enabled: true, templatePath: 'templates', validationEnabled: true, fallbackToCustom: false, timeout: 5000 }
        };

        const command: InitializeCodexCommand = {
          type: 'InitializeCodex',
          request,
          timestamp: new Date()
        };

        // Then: Should have correct structure
        expect(command.type).toBe('InitializeCodex');
        expect(command.request).toBe(request);
        expect(command.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('When creating ValidateCodexCommand', () => {
      it('Then should have correct command structure', () => {
        // Given: ValidateCodexCommand interface
        // When: Creating a command
        const request: ValidationRequest = {
          agentType: 'codex',
          skipCLICheck: false,
          timeout: 10000
        };

        const command: ValidateCodexCommand = {
          type: 'ValidateCodex',
          request,
          timestamp: new Date()
        };

        // Then: Should have correct structure
        expect(command.type).toBe('ValidateCodex');
        expect(command.request).toBe(request);
        expect(command.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('When creating GenerateCodexTemplatesCommand', () => {
      it('Then should have correct command structure', () => {
        // Given: GenerateCodexTemplatesCommand interface
        // When: Creating a command
        const request: TemplateGenerationRequest = {
          agentType: 'codex',
          outputPath: '/output',
          templateFormat: 'markdown',
          includeExamples: true,
          includeDocumentation: true
        };

        const command: GenerateCodexTemplatesCommand = {
          type: 'GenerateCodexTemplates',
          request,
          timestamp: new Date()
        };

        // Then: Should have correct structure
        expect(command.type).toBe('GenerateCodexTemplates');
        expect(command.request).toBe(request);
        expect(command.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('When creating ResetCodexCommand', () => {
      it('Then should have correct command structure', () => {
        // Given: ResetCodexCommand interface
        // When: Creating a command
        const command: ResetCodexCommand = {
          type: 'ResetCodex',
          timestamp: new Date()
        };

        // Then: Should have correct structure
        expect(command.type).toBe('ResetCodex');
        expect(command.timestamp).toBeInstanceOf(Date);
      });
    });
  });

  describe('Given application queries', () => {
    describe('When creating GetCodexStatusQuery', () => {
      it('Then should have correct query structure', () => {
        // Given: GetCodexStatusQuery interface
        // When: Creating a query
        const query: GetCodexStatusQuery = {
          type: 'GetCodexStatus',
          timestamp: new Date()
        };

        // Then: Should have correct structure
        expect(query.type).toBe('GetCodexStatus');
        expect(query.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('When creating GetAvailableAgentsQuery', () => {
      it('Then should have correct query structure', () => {
        // Given: GetAvailableAgentsQuery interface
        // When: Creating a query
        const query: GetAvailableAgentsQuery = {
          type: 'GetAvailableAgents',
          timestamp: new Date()
        };

        // Then: Should have correct structure
        expect(query.type).toBe('GetAvailableAgents');
        expect(query.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('When creating GetTemplatesForAgentQuery', () => {
      it('Then should have correct query structure', () => {
        // Given: GetTemplatesForAgentQuery interface
        // When: Creating a query
        const query: GetTemplatesForAgentQuery = {
          type: 'GetTemplatesForAgent',
          agentType: 'codex',
          timestamp: new Date()
        };

        // Then: Should have correct structure
        expect(query.type).toBe('GetTemplatesForAgent');
        expect(query.agentType).toBe('codex');
        expect(query.timestamp).toBeInstanceOf(Date);
      });
    });
  });

  describe('Given application events', () => {
    describe('When creating CodexInitializationStartedEvent', () => {
      it('Then should have correct event structure', () => {
        // Given: CodexInitializationStartedEvent interface
        // When: Creating an event
        const request: CodexInitializationRequest = {
          projectPath: '/path/to/project',
          configuration: { enabled: true, templatePath: 'templates', validationEnabled: true, fallbackToCustom: false, timeout: 5000 }
        };

        const event: CodexInitializationStartedEvent = {
          eventType: 'CodexInitializationStarted',
          request,
          timestamp: new Date()
        };

        // Then: Should have correct structure
        expect(event.eventType).toBe('CodexInitializationStarted');
        expect(event.request).toBe(request);
        expect(event.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('When creating CodexInitializationCompletedEvent', () => {
      it('Then should have correct event structure', () => {
        // Given: CodexInitializationCompletedEvent interface
        // When: Creating an event
        const response: CodexInitializationResponse = {
          success: true,
          status: {
            isInitialized: true,
            isConfigured: true,
            cliAvailable: true,
            templatesGenerated: true,
            errorCount: 0,
            status: CodexIntegrationStatus.VALIDATED
          }
        };

        const event: CodexInitializationCompletedEvent = {
          eventType: 'CodexInitializationCompleted',
          response,
          timestamp: new Date()
        };

        // Then: Should have correct structure
        expect(event.eventType).toBe('CodexInitializationCompleted');
        expect(event.response).toBe(response);
        expect(event.timestamp).toBeInstanceOf(Date);
      });
    });
  });

  describe('Given application handlers', () => {
    describe('When implementing ICodexInitializationHandler', () => {
      it('Then should handle initialization commands', async () => {
        // Given: ICodexInitializationHandler interface
        // When: Implementing the handler
        const handler: ICodexInitializationHandler = {
          async handle(command: InitializeCodexCommand): Promise<CodexInitializationResponse> {
            return {
              success: true,
              status: {
                isInitialized: true,
                isConfigured: true,
                cliAvailable: true,
                templatesGenerated: true,
                errorCount: 0,
                status: CodexIntegrationStatus.VALIDATED
              }
            };
          }
        };

        const command: InitializeCodexCommand = {
          type: 'InitializeCodex',
          request: {
            projectPath: '/path/to/project',
            configuration: { enabled: true, templatePath: 'templates', validationEnabled: true, fallbackToCustom: false, timeout: 5000 }
          },
          timestamp: new Date()
        };

        // Then: Should handle command and return response
        const response = await handler.handle(command);
        expect(response.success).toBe(true);
        expect(response.status.isInitialized).toBe(true);
      });
    });

    describe('When implementing ICodexValidationHandler', () => {
      it('Then should handle validation commands', async () => {
        // Given: ICodexValidationHandler interface
        // When: Implementing the handler
        const handler: ICodexValidationHandler = {
          async handle(command: ValidateCodexCommand): Promise<ValidationResponse> {
            return {
              success: true,
              result: {
                result: CodexValidationResult.SUCCESS,
                timestamp: new Date()
              }
            };
          }
        };

        const command: ValidateCodexCommand = {
          type: 'ValidateCodex',
          request: {
            agentType: 'codex',
            skipCLICheck: false,
            timeout: 10000
          },
          timestamp: new Date()
        };

        // Then: Should handle command and return response
        const response = await handler.handle(command);
        expect(response.success).toBe(true);
        expect(response.result.result).toBe(CodexValidationResult.SUCCESS);
      });
    });
  });

  describe('Given application configuration', () => {
    describe('When creating CodexApplicationConfig', () => {
      it('Then should accept all configuration options', () => {
        // Given: CodexApplicationConfig interface
        // When: Creating configuration
        const config: CodexApplicationConfig = {
          defaultConfiguration: {
            enabled: true,
            templatePath: 'templates/codex',
            validationEnabled: true,
            fallbackToCustom: false,
            timeout: 30000
          },
          validationTimeout: 10000,
          templateGenerationTimeout: 30000,
          maxRetryAttempts: 3,
          retryDelay: 1000,
          enableLogging: true,
          logLevel: 'info'
        };

        // Then: Should have all configuration options
        expect(config.defaultConfiguration.enabled).toBe(true);
        expect(config.validationTimeout).toBe(10000);
        expect(config.templateGenerationTimeout).toBe(30000);
        expect(config.maxRetryAttempts).toBe(3);
        expect(config.retryDelay).toBe(1000);
        expect(config.enableLogging).toBe(true);
        expect(config.logLevel).toBe('info');
      });
    });

    describe('When creating TemplateGenerationConfig', () => {
      it('Then should accept template generation options', () => {
        // Given: TemplateGenerationConfig interface
        // When: Creating configuration
        const config: TemplateGenerationConfig = {
          outputDirectory: '/output/templates',
          templateFormat: 'markdown',
          includeExamples: true,
          includeDocumentation: true,
          customTemplates: ['custom1', 'custom2'],
          validationEnabled: true
        };

        // Then: Should have all configuration options
        expect(config.outputDirectory).toBe('/output/templates');
        expect(config.templateFormat).toBe('markdown');
        expect(config.includeExamples).toBe(true);
        expect(config.includeDocumentation).toBe(true);
        expect(config.customTemplates).toEqual(['custom1', 'custom2']);
        expect(config.validationEnabled).toBe(true);
      });
    });
  });

  describe('Given application exceptions', () => {
    describe('When creating CodexApplicationException', () => {
      it('Then should have correct exception properties', () => {
        // Given: CodexApplicationException
        // When: Creating an exception
        const originalError = new Error('Original error');
        const exception = new CodexApplicationException(
          'Application error occurred',
          'APP_ERROR',
          true,
          originalError
        );

        // Then: Should have correct properties
        expect(exception.message).toBe('Application error occurred');
        expect(exception.code).toBe('APP_ERROR');
        expect(exception.recoverable).toBe(true);
        expect(exception.originalError).toBe(originalError);
        expect(exception.name).toBe('CodexApplicationException');
        expect(exception).toBeInstanceOf(Error);
      });
    });

    describe('When creating CodexInitializationException', () => {
      it('Then should include initialization request', () => {
        // Given: CodexInitializationException
        // When: Creating an exception
        const request: CodexInitializationRequest = {
          projectPath: '/path/to/project',
          configuration: { enabled: true, templatePath: 'templates', validationEnabled: true, fallbackToCustom: false, timeout: 5000 }
        };

        const exception = new CodexInitializationException(
          'Initialization failed',
          request
        );

        // Then: Should include request details
        expect(exception.message).toBe('Initialization failed');
        expect(exception.code).toBe('CODEX_INITIALIZATION_FAILED');
        expect(exception.recoverable).toBe(true);
        expect(exception.request).toBe(request);
        expect(exception.name).toBe('CodexInitializationException');
        expect(exception).toBeInstanceOf(CodexApplicationException);
      });
    });

    describe('When creating CodexValidationApplicationException', () => {
      it('Then should include validation request', () => {
        // Given: CodexValidationApplicationException
        // When: Creating an exception
        const request: ValidationRequest = {
          agentType: 'codex',
          skipCLICheck: false,
          timeout: 10000
        };

        const exception = new CodexValidationApplicationException(
          'Validation failed',
          request
        );

        // Then: Should include request details
        expect(exception.message).toBe('Validation failed');
        expect(exception.code).toBe('CODEX_VALIDATION_APPLICATION_FAILED');
        expect(exception.recoverable).toBe(true);
        expect(exception.request).toBe(request);
        expect(exception.name).toBe('CodexValidationApplicationException');
        expect(exception).toBeInstanceOf(CodexApplicationException);
      });
    });

    describe('When creating TemplateGenerationApplicationException', () => {
      it('Then should include template generation request', () => {
        // Given: TemplateGenerationApplicationException
        // When: Creating an exception
        const request: TemplateGenerationRequest = {
          agentType: 'codex',
          outputPath: '/output',
          templateFormat: 'markdown',
          includeExamples: true,
          includeDocumentation: true
        };

        const exception = new TemplateGenerationApplicationException(
          'Template generation failed',
          request
        );

        // Then: Should include request details
        expect(exception.message).toBe('Template generation failed');
        expect(exception.code).toBe('TEMPLATE_GENERATION_APPLICATION_FAILED');
        expect(exception.recoverable).toBe(false);
        expect(exception.request).toBe(request);
        expect(exception.name).toBe('TemplateGenerationApplicationException');
        expect(exception).toBeInstanceOf(CodexApplicationException);
      });
    });
  });

  describe('Given CodexApplicationUtils', () => {
    describe('When using utility methods', () => {
      it('Then should create default configuration', () => {
        // Given: CodexApplicationUtils
        // When: Creating default configuration
        const config = CodexApplicationUtils.createDefaultConfiguration();

        // Then: Should have default values
        expect(config.enabled).toBe(true);
        expect(config.validationEnabled).toBe(true);
        expect(config.fallbackToCustom).toBe(true);
        expect(config.templatePath).toBe('templates/codex-commands');
        expect(config.timeout).toBe(30000);
      });

      it('Then should validate application configuration', () => {
        // Given: CodexApplicationUtils
        // When: Validating configuration
        const validConfig: CodexApplicationConfig = {
          defaultConfiguration: CodexApplicationUtils.createDefaultConfiguration(),
          validationTimeout: 10000,
          templateGenerationTimeout: 30000,
          maxRetryAttempts: 3,
          retryDelay: 1000,
          enableLogging: true,
          logLevel: 'info'
        };

        const invalidConfig: CodexApplicationConfig = {
          defaultConfiguration: CodexApplicationUtils.createDefaultConfiguration(),
          validationTimeout: -1, // Invalid
          templateGenerationTimeout: 30000,
          maxRetryAttempts: 3,
          retryDelay: 1000,
          enableLogging: true,
          logLevel: 'info'
        };

        // Then: Should validate correctly
        expect(CodexApplicationUtils.validateApplicationConfig(validConfig)).toBe(true);
        expect(CodexApplicationUtils.validateApplicationConfig(invalidConfig)).toBe(false);
      });

      it('Then should create error response', () => {
        // Given: CodexApplicationUtils
        // When: Creating error response
        const error: CodexError = {
          code: 'TEST_ERROR',
          message: 'Test error message',
          details: { test: 'data' },
          suggestions: ['Fix this', 'Try that'],
          recoverable: true,
          timestamp: new Date()
        };

        const response = CodexApplicationUtils.createErrorResponse(error);

        // Then: Should have correct error response structure
        expect(response.success).toBe(false);
        expect(response.error.code).toBe('TEST_ERROR');
        expect(response.error.message).toBe('Test error message');
        expect(response.error.details).toEqual({ test: 'data' });
        expect(response.error.suggestions).toEqual(['Fix this', 'Try that']);
        expect(response.error.recoverable).toBe(true);
      });

      it('Then should create success response', () => {
        // Given: CodexApplicationUtils
        // When: Creating success response
        const data = { result: 'success', count: 5 };
        const response = CodexApplicationUtils.createSuccessResponse(data);

        // Then: Should have correct success response structure
        expect(response.success).toBe(true);
        expect(response.data).toBe(data);
        expect(response.timestamp).toBeInstanceOf(Date);
      });
    });
  });
});
