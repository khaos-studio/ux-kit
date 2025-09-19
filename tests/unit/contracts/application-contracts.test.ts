/**
 * Unit tests for application contracts
 * 
 * These tests verify the application contracts and interfaces work correctly
 * and provide comprehensive coverage for all application layer types.
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
} from '../../../src/contracts/application-contracts';
import {
  CodexConfiguration,
  CodexValidationResponse,
  CodexCommandTemplate,
  CodexStatus,
  CodexError,
  CodexValidationResult,
  CodexIntegrationStatus
} from '../../../src/contracts/domain-contracts';

describe('Application Contracts', () => {
  
  describe('ICodexIntegrationService interface', () => {
    it('should define all required methods', () => {
      const service: ICodexIntegrationService = {
        async initializeCodex(config: CodexConfiguration): Promise<void> {},
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

      expect(service.initializeCodex).toBeInstanceOf(Function);
      expect(service.validateCodexSetup).toBeInstanceOf(Function);
      expect(service.generateCodexTemplates).toBeInstanceOf(Function);
      expect(service.getCodexStatus).toBeInstanceOf(Function);
      expect(service.handleCodexError).toBeInstanceOf(Function);
      expect(service.resetCodexIntegration).toBeInstanceOf(Function);
    });

    it('should accept CodexConfiguration for initialization', async () => {
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

      await expect(service.initializeCodex(config)).resolves.not.toThrow();
    });
  });

  describe('IAIAgentSelectionService interface', () => {
    it('should define all required methods', () => {
      const service: IAIAgentSelectionService = {
        async getAvailableAgents(): Promise<readonly string[]> { return []; },
        async validateAgent(agentType: string): Promise<boolean> { return true; },
        async initializeAgent(agentType: string, config: any): Promise<void> {},
        async getAgentConfiguration(agentType: string): Promise<any> { return {}; }
      };

      expect(service.getAvailableAgents).toBeInstanceOf(Function);
      expect(service.validateAgent).toBeInstanceOf(Function);
      expect(service.initializeAgent).toBeInstanceOf(Function);
      expect(service.getAgentConfiguration).toBeInstanceOf(Function);
    });

    it('should return available agents', async () => {
      const service: IAIAgentSelectionService = {
        async getAvailableAgents(): Promise<readonly string[]> {
          return ['cursor', 'codex', 'custom'];
        },
        async validateAgent(agentType: string): Promise<boolean> { return true; },
        async initializeAgent(agentType: string, config: any): Promise<void> {},
        async getAgentConfiguration(agentType: string): Promise<any> { return {}; }
      };

      const agents = await service.getAvailableAgents();
      expect(agents).toEqual(['cursor', 'codex', 'custom']);
      expect(agents).toHaveLength(3);
    });
  });

  describe('ICommandTemplateService interface', () => {
    it('should define all required methods', () => {
      const service: ICommandTemplateService = {
        async generateTemplatesForAgent(agentType: string): Promise<void> {},
        async getTemplatesForAgent(agentType: string): Promise<readonly CodexCommandTemplate[]> { return []; },
        async validateTemplate(template: CodexCommandTemplate): Promise<boolean> { return true; },
        async updateTemplateConfiguration(agentType: string, config: any): Promise<void> {}
      };

      expect(service.generateTemplatesForAgent).toBeInstanceOf(Function);
      expect(service.getTemplatesForAgent).toBeInstanceOf(Function);
      expect(service.validateTemplate).toBeInstanceOf(Function);
      expect(service.updateTemplateConfiguration).toBeInstanceOf(Function);
    });
  });

  describe('Application DTOs', () => {
    describe('CodexInitializationRequest', () => {
      it('should accept all required properties', () => {
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

        expect(request.projectPath).toBe('/path/to/project');
        expect(request.configuration.enabled).toBe(true);
        expect(request.skipValidation).toBe(false);
        expect(request.forceReinit).toBe(true);
      });

      it('should allow optional properties', () => {
        const request: CodexInitializationRequest = {
          projectPath: '/path/to/project',
          configuration: {
            enabled: true,
            templatePath: 'templates/codex',
            validationEnabled: true,
            fallbackToCustom: false,
            timeout: 5000
          }
        };

        expect(request.projectPath).toBe('/path/to/project');
        expect(request.skipValidation).toBeUndefined();
        expect(request.forceReinit).toBeUndefined();
      });
    });

    describe('CodexInitializationResponse', () => {
      it('should include success status', () => {
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

        expect(response.success).toBe(true);
        expect(response.status.isInitialized).toBe(true);
        expect(response.error).toBeUndefined();
        expect(response.validationResult).toBeUndefined();
      });

      it('should include error information when failed', () => {
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

        expect(response.success).toBe(false);
        expect(response.error).toBe(error);
        expect(response.status.errorCount).toBe(1);
      });
    });

    describe('TemplateGenerationRequest', () => {
      it('should accept all template generation options', () => {
        const request: TemplateGenerationRequest = {
          agentType: 'codex',
          outputPath: '/output/templates',
          templateFormat: 'markdown',
          includeExamples: true,
          includeDocumentation: true
        };

        expect(request.agentType).toBe('codex');
        expect(request.outputPath).toBe('/output/templates');
        expect(request.templateFormat).toBe('markdown');
        expect(request.includeExamples).toBe(true);
        expect(request.includeDocumentation).toBe(true);
      });

      it('should accept different template formats', () => {
        const formats: Array<'markdown' | 'json' | 'yaml'> = ['markdown', 'json', 'yaml'];
        
        formats.forEach(format => {
          const request: TemplateGenerationRequest = {
            agentType: 'codex',
            outputPath: '/output',
            templateFormat: format,
            includeExamples: false,
            includeDocumentation: false
          };
          expect(request.templateFormat).toBe(format);
        });
      });
    });

    describe('TemplateGenerationResponse', () => {
      it('should include success status and template count', () => {
        const response: TemplateGenerationResponse = {
          success: true,
          templatesGenerated: 5,
          outputPath: '/output/templates'
        };

        expect(response.success).toBe(true);
        expect(response.templatesGenerated).toBe(5);
        expect(response.outputPath).toBe('/output/templates');
        expect(response.error).toBeUndefined();
      });

      it('should include error information when failed', () => {
        const error: CodexError = {
          code: 'TEMPLATE_GEN_FAILED',
          message: 'Template generation failed',
          recoverable: false,
          timestamp: new Date()
        };

        const response: TemplateGenerationResponse = {
          success: false,
          templatesGenerated: 0,
          outputPath: '/output/templates',
          error
        };

        expect(response.success).toBe(false);
        expect(response.templatesGenerated).toBe(0);
        expect(response.error).toBe(error);
      });
    });

    describe('ValidationRequest', () => {
      it('should accept validation options', () => {
        const request: ValidationRequest = {
          agentType: 'codex',
          skipCLICheck: false,
          timeout: 10000
        };

        expect(request.agentType).toBe('codex');
        expect(request.skipCLICheck).toBe(false);
        expect(request.timeout).toBe(10000);
      });

      it('should allow optional properties', () => {
        const request: ValidationRequest = {
          agentType: 'codex'
        };

        expect(request.agentType).toBe('codex');
        expect(request.skipCLICheck).toBeUndefined();
        expect(request.timeout).toBeUndefined();
      });
    });

    describe('ValidationResponse', () => {
      it('should include validation result', () => {
        const validationResult: CodexValidationResponse = {
          result: CodexValidationResult.SUCCESS,
          cliPath: '/usr/local/bin/codex',
          version: '1.0.0',
          timestamp: new Date()
        };

        const response: ValidationResponse = {
          success: true,
          result: validationResult
        };

        expect(response.success).toBe(true);
        expect(response.result).toBe(validationResult);
        expect(response.error).toBeUndefined();
      });

      it('should include error information when failed', () => {
        const error: CodexError = {
          code: 'VALIDATION_FAILED',
          message: 'Validation failed',
          recoverable: true,
          timestamp: new Date()
        };

        const response: ValidationResponse = {
          success: false,
          result: {
            result: CodexValidationResult.CLI_NOT_FOUND,
            timestamp: new Date()
          },
          error
        };

        expect(response.success).toBe(false);
        expect(response.error).toBe(error);
      });
    });
  });

  describe('Application Commands', () => {
    describe('InitializeCodexCommand', () => {
      it('should have correct command structure', () => {
        const request: CodexInitializationRequest = {
          projectPath: '/path/to/project',
          configuration: {
            enabled: true,
            templatePath: 'templates',
            validationEnabled: true,
            fallbackToCustom: false,
            timeout: 5000
          }
        };

        const command: InitializeCodexCommand = {
          type: 'InitializeCodex',
          request,
          timestamp: new Date()
        };

        expect(command.type).toBe('InitializeCodex');
        expect(command.request).toBe(request);
        expect(command.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('ValidateCodexCommand', () => {
      it('should have correct command structure', () => {
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

        expect(command.type).toBe('ValidateCodex');
        expect(command.request).toBe(request);
        expect(command.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('GenerateCodexTemplatesCommand', () => {
      it('should have correct command structure', () => {
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

        expect(command.type).toBe('GenerateCodexTemplates');
        expect(command.request).toBe(request);
        expect(command.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('ResetCodexCommand', () => {
      it('should have correct command structure', () => {
        const command: ResetCodexCommand = {
          type: 'ResetCodex',
          timestamp: new Date()
        };

        expect(command.type).toBe('ResetCodex');
        expect(command.timestamp).toBeInstanceOf(Date);
      });
    });
  });

  describe('Application Queries', () => {
    describe('GetCodexStatusQuery', () => {
      it('should have correct query structure', () => {
        const query: GetCodexStatusQuery = {
          type: 'GetCodexStatus',
          timestamp: new Date()
        };

        expect(query.type).toBe('GetCodexStatus');
        expect(query.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('GetAvailableAgentsQuery', () => {
      it('should have correct query structure', () => {
        const query: GetAvailableAgentsQuery = {
          type: 'GetAvailableAgents',
          timestamp: new Date()
        };

        expect(query.type).toBe('GetAvailableAgents');
        expect(query.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('GetTemplatesForAgentQuery', () => {
      it('should have correct query structure', () => {
        const query: GetTemplatesForAgentQuery = {
          type: 'GetTemplatesForAgent',
          agentType: 'codex',
          timestamp: new Date()
        };

        expect(query.type).toBe('GetTemplatesForAgent');
        expect(query.agentType).toBe('codex');
        expect(query.timestamp).toBeInstanceOf(Date);
      });
    });
  });

  describe('Application Events', () => {
    describe('CodexInitializationStartedEvent', () => {
      it('should have correct event structure', () => {
        const request: CodexInitializationRequest = {
          projectPath: '/path/to/project',
          configuration: {
            enabled: true,
            templatePath: 'templates',
            validationEnabled: true,
            fallbackToCustom: false,
            timeout: 5000
          }
        };

        const event: CodexInitializationStartedEvent = {
          eventType: 'CodexInitializationStarted',
          request,
          timestamp: new Date()
        };

        expect(event.eventType).toBe('CodexInitializationStarted');
        expect(event.request).toBe(request);
        expect(event.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('CodexInitializationCompletedEvent', () => {
      it('should have correct event structure', () => {
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

        expect(event.eventType).toBe('CodexInitializationCompleted');
        expect(event.response).toBe(response);
        expect(event.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('CodexValidationStartedEvent', () => {
      it('should have correct event structure', () => {
        const request: ValidationRequest = {
          agentType: 'codex',
          skipCLICheck: false,
          timeout: 10000
        };

        const event: CodexValidationStartedEvent = {
          eventType: 'CodexValidationStarted',
          request,
          timestamp: new Date()
        };

        expect(event.eventType).toBe('CodexValidationStarted');
        expect(event.request).toBe(request);
        expect(event.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('CodexValidationCompletedEvent', () => {
      it('should have correct event structure', () => {
        const response: ValidationResponse = {
          success: true,
          result: {
            result: CodexValidationResult.SUCCESS,
            timestamp: new Date()
          }
        };

        const event: CodexValidationCompletedEvent = {
          eventType: 'CodexValidationCompleted',
          response,
          timestamp: new Date()
        };

        expect(event.eventType).toBe('CodexValidationCompleted');
        expect(event.response).toBe(response);
        expect(event.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('TemplateGenerationStartedEvent', () => {
      it('should have correct event structure', () => {
        const request: TemplateGenerationRequest = {
          agentType: 'codex',
          outputPath: '/output',
          templateFormat: 'markdown',
          includeExamples: true,
          includeDocumentation: true
        };

        const event: TemplateGenerationStartedEvent = {
          eventType: 'TemplateGenerationStarted',
          request,
          timestamp: new Date()
        };

        expect(event.eventType).toBe('TemplateGenerationStarted');
        expect(event.request).toBe(request);
        expect(event.timestamp).toBeInstanceOf(Date);
      });
    });

    describe('TemplateGenerationCompletedEvent', () => {
      it('should have correct event structure', () => {
        const response: TemplateGenerationResponse = {
          success: true,
          templatesGenerated: 5,
          outputPath: '/output/templates'
        };

        const event: TemplateGenerationCompletedEvent = {
          eventType: 'TemplateGenerationCompleted',
          response,
          timestamp: new Date()
        };

        expect(event.eventType).toBe('TemplateGenerationCompleted');
        expect(event.response).toBe(response);
        expect(event.timestamp).toBeInstanceOf(Date);
      });
    });
  });

  describe('Application Handlers', () => {
    describe('ICodexInitializationHandler', () => {
      it('should handle initialization commands', async () => {
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
            configuration: {
              enabled: true,
              templatePath: 'templates',
              validationEnabled: true,
              fallbackToCustom: false,
              timeout: 5000
            }
          },
          timestamp: new Date()
        };

        const response = await handler.handle(command);
        expect(response.success).toBe(true);
        expect(response.status.isInitialized).toBe(true);
      });
    });

    describe('ICodexValidationHandler', () => {
      it('should handle validation commands', async () => {
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

        const response = await handler.handle(command);
        expect(response.success).toBe(true);
        expect(response.result.result).toBe(CodexValidationResult.SUCCESS);
      });
    });

    describe('ITemplateGenerationHandler', () => {
      it('should handle template generation commands', async () => {
        const handler: ITemplateGenerationHandler = {
          async handle(command: GenerateCodexTemplatesCommand): Promise<TemplateGenerationResponse> {
            return {
              success: true,
              templatesGenerated: 3,
              outputPath: '/output/templates'
            };
          }
        };

        const command: GenerateCodexTemplatesCommand = {
          type: 'GenerateCodexTemplates',
          request: {
            agentType: 'codex',
            outputPath: '/output',
            templateFormat: 'markdown',
            includeExamples: true,
            includeDocumentation: true
          },
          timestamp: new Date()
        };

        const response = await handler.handle(command);
        expect(response.success).toBe(true);
        expect(response.templatesGenerated).toBe(3);
      });
    });

    describe('ICodexResetHandler', () => {
      it('should handle reset commands', async () => {
        const handler: ICodexResetHandler = {
          async handle(command: ResetCodexCommand): Promise<void> {
            // Reset implementation
          }
        };

        const command: ResetCodexCommand = {
          type: 'ResetCodex',
          timestamp: new Date()
        };

        await expect(handler.handle(command)).resolves.not.toThrow();
      });
    });

    describe('ICodexStatusQueryHandler', () => {
      it('should handle status queries', async () => {
        const handler: ICodexStatusQueryHandler = {
          async handle(query: GetCodexStatusQuery): Promise<CodexStatus> {
            return {
              isInitialized: true,
              isConfigured: true,
              cliAvailable: true,
              templatesGenerated: true,
              errorCount: 0,
              status: CodexIntegrationStatus.VALIDATED
            };
          }
        };

        const query: GetCodexStatusQuery = {
          type: 'GetCodexStatus',
          timestamp: new Date()
        };

        const status = await handler.handle(query);
        expect(status.isInitialized).toBe(true);
        expect(status.status).toBe(CodexIntegrationStatus.VALIDATED);
      });
    });

    describe('IAvailableAgentsQueryHandler', () => {
      it('should handle available agents queries', async () => {
        const handler: IAvailableAgentsQueryHandler = {
          async handle(query: GetAvailableAgentsQuery): Promise<readonly string[]> {
            return ['cursor', 'codex', 'custom'];
          }
        };

        const query: GetAvailableAgentsQuery = {
          type: 'GetAvailableAgents',
          timestamp: new Date()
        };

        const agents = await handler.handle(query);
        expect(agents).toEqual(['cursor', 'codex', 'custom']);
      });
    });

    describe('ITemplatesQueryHandler', () => {
      it('should handle templates queries', async () => {
        const handler: ITemplatesQueryHandler = {
          async handle(query: GetTemplatesForAgentQuery): Promise<readonly CodexCommandTemplate[]> {
            return [{
              name: 'test-template',
              description: 'Test template',
              command: 'test command',
              parameters: [],
              examples: [],
              category: 'test',
              version: '1.0.0'
            }];
          }
        };

        const query: GetTemplatesForAgentQuery = {
          type: 'GetTemplatesForAgent',
          agentType: 'codex',
          timestamp: new Date()
        };

        const templates = await handler.handle(query);
        expect(templates).toHaveLength(1);
        expect(templates[0]?.name).toBe('test-template');
      });
    });
  });

  describe('Application Configuration', () => {
    describe('CodexApplicationConfig', () => {
      it('should accept all configuration options', () => {
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

        expect(config.defaultConfiguration.enabled).toBe(true);
        expect(config.validationTimeout).toBe(10000);
        expect(config.templateGenerationTimeout).toBe(30000);
        expect(config.maxRetryAttempts).toBe(3);
        expect(config.retryDelay).toBe(1000);
        expect(config.enableLogging).toBe(true);
        expect(config.logLevel).toBe('info');
      });

      it('should accept different log levels', () => {
        const logLevels: Array<'debug' | 'info' | 'warn' | 'error'> = ['debug', 'info', 'warn', 'error'];
        
        logLevels.forEach(level => {
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
            logLevel: level
          };
          expect(config.logLevel).toBe(level);
        });
      });
    });

    describe('TemplateGenerationConfig', () => {
      it('should accept template generation options', () => {
        const config: TemplateGenerationConfig = {
          outputDirectory: '/output/templates',
          templateFormat: 'markdown',
          includeExamples: true,
          includeDocumentation: true,
          customTemplates: ['custom1', 'custom2'],
          validationEnabled: true
        };

        expect(config.outputDirectory).toBe('/output/templates');
        expect(config.templateFormat).toBe('markdown');
        expect(config.includeExamples).toBe(true);
        expect(config.includeDocumentation).toBe(true);
        expect(config.customTemplates).toEqual(['custom1', 'custom2']);
        expect(config.validationEnabled).toBe(true);
      });

      it('should accept different template formats', () => {
        const formats: Array<'markdown' | 'json' | 'yaml'> = ['markdown', 'json', 'yaml'];
        
        formats.forEach(format => {
          const config: TemplateGenerationConfig = {
            outputDirectory: '/output',
            templateFormat: format,
            includeExamples: false,
            includeDocumentation: false,
            customTemplates: [],
            validationEnabled: true
          };
          expect(config.templateFormat).toBe(format);
        });
      });
    });
  });

  describe('Application Exceptions', () => {
    describe('CodexApplicationException', () => {
      it('should have correct exception properties', () => {
        const originalError = new Error('Original error');
        const exception = new CodexApplicationException(
          'Application error occurred',
          'APP_ERROR',
          true,
          originalError
        );

        expect(exception.message).toBe('Application error occurred');
        expect(exception.code).toBe('APP_ERROR');
        expect(exception.recoverable).toBe(true);
        expect(exception.originalError).toBe(originalError);
        expect(exception.name).toBe('CodexApplicationException');
        expect(exception).toBeInstanceOf(Error);
      });

      it('should default recoverable to false', () => {
        const exception = new CodexApplicationException(
          'Application error occurred',
          'APP_ERROR'
        );

        expect(exception.recoverable).toBe(false);
        expect(exception.originalError).toBeUndefined();
      });
    });

    describe('CodexInitializationException', () => {
      it('should include initialization request', () => {
        const request: CodexInitializationRequest = {
          projectPath: '/path/to/project',
          configuration: {
            enabled: true,
            templatePath: 'templates',
            validationEnabled: true,
            fallbackToCustom: false,
            timeout: 5000
          }
        };

        const exception = new CodexInitializationException(
          'Initialization failed',
          request
        );

        expect(exception.message).toBe('Initialization failed');
        expect(exception.code).toBe('CODEX_INITIALIZATION_FAILED');
        expect(exception.recoverable).toBe(true);
        expect(exception.request).toBe(request);
        expect(exception.name).toBe('CodexInitializationException');
        expect(exception).toBeInstanceOf(CodexApplicationException);
      });

      it('should allow original error', () => {
        const request: CodexInitializationRequest = {
          projectPath: '/path/to/project',
          configuration: {
            enabled: true,
            templatePath: 'templates',
            validationEnabled: true,
            fallbackToCustom: false,
            timeout: 5000
          }
        };

        const originalError = new Error('Original error');
        const exception = new CodexInitializationException(
          'Initialization failed',
          request,
          originalError
        );

        expect(exception.originalError).toBe(originalError);
      });
    });

    describe('CodexValidationApplicationException', () => {
      it('should include validation request', () => {
        const request: ValidationRequest = {
          agentType: 'codex',
          skipCLICheck: false,
          timeout: 10000
        };

        const exception = new CodexValidationApplicationException(
          'Validation failed',
          request
        );

        expect(exception.message).toBe('Validation failed');
        expect(exception.code).toBe('CODEX_VALIDATION_APPLICATION_FAILED');
        expect(exception.recoverable).toBe(true);
        expect(exception.request).toBe(request);
        expect(exception.name).toBe('CodexValidationApplicationException');
        expect(exception).toBeInstanceOf(CodexApplicationException);
      });
    });

    describe('TemplateGenerationApplicationException', () => {
      it('should include template generation request', () => {
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

        expect(exception.message).toBe('Template generation failed');
        expect(exception.code).toBe('TEMPLATE_GENERATION_APPLICATION_FAILED');
        expect(exception.recoverable).toBe(false);
        expect(exception.request).toBe(request);
        expect(exception.name).toBe('TemplateGenerationApplicationException');
        expect(exception).toBeInstanceOf(CodexApplicationException);
      });
    });
  });

  describe('CodexApplicationUtils', () => {
    describe('createDefaultConfiguration', () => {
      it('should create default configuration', () => {
        const config = CodexApplicationUtils.createDefaultConfiguration();

        expect(config.enabled).toBe(true);
        expect(config.validationEnabled).toBe(true);
        expect(config.fallbackToCustom).toBe(true);
        expect(config.templatePath).toBe('templates/codex-commands');
        expect(config.timeout).toBe(30000);
      });
    });

    describe('validateApplicationConfig', () => {
      it('should validate valid configuration', () => {
        const validConfig: CodexApplicationConfig = {
          defaultConfiguration: CodexApplicationUtils.createDefaultConfiguration(),
          validationTimeout: 10000,
          templateGenerationTimeout: 30000,
          maxRetryAttempts: 3,
          retryDelay: 1000,
          enableLogging: true,
          logLevel: 'info'
        };

        expect(CodexApplicationUtils.validateApplicationConfig(validConfig)).toBe(true);
      });

      it('should reject invalid configuration', () => {
        const invalidConfigs: CodexApplicationConfig[] = [
          {
            defaultConfiguration: CodexApplicationUtils.createDefaultConfiguration(),
            validationTimeout: -1, // Invalid
            templateGenerationTimeout: 30000,
            maxRetryAttempts: 3,
            retryDelay: 1000,
            enableLogging: true,
            logLevel: 'info'
          },
          {
            defaultConfiguration: CodexApplicationUtils.createDefaultConfiguration(),
            validationTimeout: 10000,
            templateGenerationTimeout: -1, // Invalid
            maxRetryAttempts: 3,
            retryDelay: 1000,
            enableLogging: true,
            logLevel: 'info'
          },
          {
            defaultConfiguration: CodexApplicationUtils.createDefaultConfiguration(),
            validationTimeout: 10000,
            templateGenerationTimeout: 30000,
            maxRetryAttempts: -1, // Invalid
            retryDelay: 1000,
            enableLogging: true,
            logLevel: 'info'
          },
          {
            defaultConfiguration: CodexApplicationUtils.createDefaultConfiguration(),
            validationTimeout: 10000,
            templateGenerationTimeout: 30000,
            maxRetryAttempts: 3,
            retryDelay: -1, // Invalid
            enableLogging: true,
            logLevel: 'info'
          }
        ];

        invalidConfigs.forEach(config => {
          expect(CodexApplicationUtils.validateApplicationConfig(config)).toBe(false);
        });
      });
    });

    describe('createErrorResponse', () => {
      it('should create error response', () => {
        const error: CodexError = {
          code: 'TEST_ERROR',
          message: 'Test error message',
          details: { test: 'data' },
          suggestions: ['Fix this', 'Try that'],
          recoverable: true,
          timestamp: new Date()
        };

        const response = CodexApplicationUtils.createErrorResponse(error);

        expect(response.success).toBe(false);
        expect(response.error.code).toBe('TEST_ERROR');
        expect(response.error.message).toBe('Test error message');
        expect(response.error.details).toEqual({ test: 'data' });
        expect(response.error.suggestions).toEqual(['Fix this', 'Try that']);
        expect(response.error.recoverable).toBe(true);
        expect(response.error.timestamp).toBe(error.timestamp);
      });
    });

    describe('createSuccessResponse', () => {
      it('should create success response', () => {
        const data = { result: 'success', count: 5 };
        const response = CodexApplicationUtils.createSuccessResponse(data);

        expect(response.success).toBe(true);
        expect(response.data).toBe(data);
        expect(response.timestamp).toBeInstanceOf(Date);
      });

      it('should create success response with different data types', () => {
        const stringData = 'success';
        const numberData = 42;
        const arrayData = [1, 2, 3];
        const objectData = { key: 'value' };

        expect(CodexApplicationUtils.createSuccessResponse(stringData).data).toBe(stringData);
        expect(CodexApplicationUtils.createSuccessResponse(numberData).data).toBe(numberData);
        expect(CodexApplicationUtils.createSuccessResponse(arrayData).data).toBe(arrayData);
        expect(CodexApplicationUtils.createSuccessResponse(objectData).data).toBe(objectData);
      });
    });
  });
});
