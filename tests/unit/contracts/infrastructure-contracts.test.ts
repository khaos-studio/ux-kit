/**
 * Unit tests for infrastructure contracts
 * 
 * These tests verify the infrastructure contracts and interfaces work correctly
 * and provide comprehensive coverage for all infrastructure layer types.
 */

import {
  IFileSystemService,
  ICLIExecutionService,
  ICodexCLIService,
  ITemplateFileService,
  IConfigurationService,
  ILoggingService,
  IValidationService,
  IErrorHandlingService,
  IExternalServiceIntegration,
  FileStats,
  CLIExecutionOptions,
  CLIExecutionResult,
  TemplateFormat,
  LogLevel,
  ServiceStatus,
  ServiceRequest,
  ServiceResponse,
  ServiceError,
  CodexInfrastructureException,
  CodexFileSystemException,
  CodexCLIExecutionException,
  CodexExternalServiceException,
  CodexInfrastructureUtils
} from '../../../src/contracts/infrastructure-contracts';
import {
  CodexConfiguration,
  CodexValidationResponse,
  CodexCommandTemplate,
  CodexError,
  CodexValidationResult
} from '../../../src/contracts/domain-contracts';

describe('Infrastructure Contracts', () => {
  
  describe('IFileSystemService interface', () => {
    it('should define all required methods', () => {
      const service: IFileSystemService = {
        async fileExists(path: string): Promise<boolean> { return true; },
        async directoryExists(path: string): Promise<boolean> { return true; },
        async createDirectory(path: string): Promise<void> {},
        async readFile(path: string): Promise<string> { return 'content'; },
        async writeFile(path: string, content: string): Promise<void> {},
        async listFiles(directory: string, pattern?: string): Promise<readonly string[]> { return []; },
        async deleteFile(path: string): Promise<void> {},
        async getFileStats(path: string): Promise<FileStats> {
          return {
            size: 0,
            created: new Date(),
            modified: new Date(),
            isFile: true,
            isDirectory: false,
            permissions: 'rw-r--r--'
          };
        }
      };

      expect(service.fileExists).toBeInstanceOf(Function);
      expect(service.directoryExists).toBeInstanceOf(Function);
      expect(service.createDirectory).toBeInstanceOf(Function);
      expect(service.readFile).toBeInstanceOf(Function);
      expect(service.writeFile).toBeInstanceOf(Function);
      expect(service.listFiles).toBeInstanceOf(Function);
      expect(service.deleteFile).toBeInstanceOf(Function);
      expect(service.getFileStats).toBeInstanceOf(Function);
    });

    it('should handle file operations correctly', async () => {
      const service: IFileSystemService = {
        async fileExists(path: string): Promise<boolean> {
          return path === '/valid/file.txt';
        },
        async directoryExists(path: string): Promise<boolean> { return true; },
        async createDirectory(path: string): Promise<void> {},
        async readFile(path: string): Promise<string> {
          return 'file content';
        },
        async writeFile(path: string, content: string): Promise<void> {},
        async listFiles(directory: string, pattern?: string): Promise<readonly string[]> {
          return ['file1.txt', 'file2.txt'];
        },
        async deleteFile(path: string): Promise<void> {},
        async getFileStats(path: string): Promise<FileStats> {
          return {
            size: 100,
            created: new Date('2025-01-01'),
            modified: new Date('2025-01-02'),
            isFile: true,
            isDirectory: false,
            permissions: 'rw-r--r--'
          };
        }
      };

      expect(await service.fileExists('/valid/file.txt')).toBe(true);
      expect(await service.fileExists('/invalid/file.txt')).toBe(false);
      expect(await service.readFile('/test.txt')).toBe('file content');
      expect(await service.listFiles('/test')).toEqual(['file1.txt', 'file2.txt']);
    });
  });

  describe('ICLIExecutionService interface', () => {
    it('should define all required methods', () => {
      const service: ICLIExecutionService = {
        async executeCommand(command: string, args: readonly string[], options?: CLIExecutionOptions): Promise<CLIExecutionResult> {
          return {
            exitCode: 0,
            stdout: 'output',
            stderr: '',
            executionTime: 100,
            success: true
          };
        },
        async isCommandAvailable(command: string): Promise<boolean> { return true; },
        async getCommandVersion(command: string): Promise<string | null> { return '1.0.0'; },
        async executeCommandWithTimeout(command: string, args: readonly string[], timeout: number): Promise<CLIExecutionResult> {
          return {
            exitCode: 0,
            stdout: 'output',
            stderr: '',
            executionTime: 100,
            success: true
          };
        }
      };

      expect(service.executeCommand).toBeInstanceOf(Function);
      expect(service.isCommandAvailable).toBeInstanceOf(Function);
      expect(service.getCommandVersion).toBeInstanceOf(Function);
      expect(service.executeCommandWithTimeout).toBeInstanceOf(Function);
    });

    it('should execute commands with proper options', async () => {
      const service: ICLIExecutionService = {
        async executeCommand(command: string, args: readonly string[], options?: CLIExecutionOptions): Promise<CLIExecutionResult> {
          expect(command).toBe('test-command');
          expect(args).toEqual(['arg1', 'arg2']);
          expect(options?.timeout).toBe(5000);
          return {
            exitCode: 0,
            stdout: 'success',
            stderr: '',
            executionTime: 50,
            success: true
          };
        },
        async isCommandAvailable(command: string): Promise<boolean> { return true; },
        async getCommandVersion(command: string): Promise<string | null> { return '1.0.0'; },
        async executeCommandWithTimeout(command: string, args: readonly string[], timeout: number): Promise<CLIExecutionResult> {
          return {
            exitCode: 0,
            stdout: 'output',
            stderr: '',
            executionTime: 100,
            success: true
          };
        }
      };

      const options: CLIExecutionOptions = {
        timeout: 5000,
        captureOutput: true,
        captureError: true
      };

      const result = await service.executeCommand('test-command', ['arg1', 'arg2'], options);
      expect(result.success).toBe(true);
      expect(result.stdout).toBe('success');
    });
  });

  describe('ICodexCLIService interface', () => {
    it('should define all required methods', () => {
      const service: ICodexCLIService = {
        async validateInstallation(): Promise<CodexValidationResponse> {
          return {
            result: CodexValidationResult.SUCCESS,
            timestamp: new Date()
          };
        },
        async getVersion(): Promise<string | null> { return '1.0.0'; },
        async executeCodexCommand(command: string, args: readonly string[]): Promise<CLIExecutionResult> {
          return {
            exitCode: 0,
            stdout: 'output',
            stderr: '',
            executionTime: 100,
            success: true
          };
        },
        async isAvailable(): Promise<boolean> { return true; },
        async getCLIPath(): Promise<string | null> { return '/usr/local/bin/codex'; }
      };

      expect(service.validateInstallation).toBeInstanceOf(Function);
      expect(service.getVersion).toBeInstanceOf(Function);
      expect(service.executeCodexCommand).toBeInstanceOf(Function);
      expect(service.isAvailable).toBeInstanceOf(Function);
      expect(service.getCLIPath).toBeInstanceOf(Function);
    });

    it('should validate Codex installation', async () => {
      const service: ICodexCLIService = {
        async validateInstallation(): Promise<CodexValidationResponse> {
          return {
            result: CodexValidationResult.SUCCESS,
            cliPath: '/usr/local/bin/codex',
            version: '1.0.0',
            timestamp: new Date()
          };
        },
        async getVersion(): Promise<string | null> { return '1.0.0'; },
        async executeCodexCommand(command: string, args: readonly string[]): Promise<CLIExecutionResult> {
          return {
            exitCode: 0,
            stdout: 'output',
            stderr: '',
            executionTime: 100,
            success: true
          };
        },
        async isAvailable(): Promise<boolean> { return true; },
        async getCLIPath(): Promise<string | null> { return '/usr/local/bin/codex'; }
      };

      const response = await service.validateInstallation();
      expect(response.result).toBe(CodexValidationResult.SUCCESS);
      expect(response.cliPath).toBe('/usr/local/bin/codex');
      expect(response.version).toBe('1.0.0');
    });
  });

  describe('ITemplateFileService interface', () => {
    it('should define all required methods', () => {
      const service: ITemplateFileService = {
        async generateTemplateFile(template: CodexCommandTemplate, outputPath: string, format: TemplateFormat): Promise<void> {},
        async readTemplateFile(filePath: string): Promise<CodexCommandTemplate> {
          return {
            name: 'test-template',
            description: 'Test template',
            command: 'test command',
            parameters: [],
            examples: [],
            category: 'test',
            version: '1.0.0'
          };
        },
        async validateTemplateFile(filePath: string): Promise<boolean> { return true; },
        async listTemplateFiles(directory: string): Promise<readonly string[]> { return []; },
        async deleteTemplateFile(filePath: string): Promise<void> {}
      };

      expect(service.generateTemplateFile).toBeInstanceOf(Function);
      expect(service.readTemplateFile).toBeInstanceOf(Function);
      expect(service.validateTemplateFile).toBeInstanceOf(Function);
      expect(service.listTemplateFiles).toBeInstanceOf(Function);
      expect(service.deleteTemplateFile).toBeInstanceOf(Function);
    });

    it('should handle template file operations', async () => {
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
        examples: ['codex create my-project'],
        category: 'project',
        version: '1.0.0'
      };

      const service: ITemplateFileService = {
        async generateTemplateFile(template: CodexCommandTemplate, outputPath: string, format: TemplateFormat): Promise<void> {
          expect(template.name).toBe('create-project');
          expect(outputPath).toBe('/output/template.md');
          expect(format).toBe(TemplateFormat.MARKDOWN);
        },
        async readTemplateFile(filePath: string): Promise<CodexCommandTemplate> {
          return template;
        },
        async validateTemplateFile(filePath: string): Promise<boolean> { return true; },
        async listTemplateFiles(directory: string): Promise<readonly string[]> { return ['template1.md', 'template2.md']; },
        async deleteTemplateFile(filePath: string): Promise<void> {}
      };

      await service.generateTemplateFile(template, '/output/template.md', TemplateFormat.MARKDOWN);
      const readTemplate = await service.readTemplateFile('/test.md');
      expect(readTemplate.name).toBe('create-project');
      expect(await service.listTemplateFiles('/templates')).toEqual(['template1.md', 'template2.md']);
    });
  });

  describe('Infrastructure DTOs and types', () => {
    describe('FileStats', () => {
      it('should include all file statistics', () => {
        const stats: FileStats = {
          size: 1024,
          created: new Date('2025-01-01'),
          modified: new Date('2025-01-02'),
          isFile: true,
          isDirectory: false,
          permissions: 'rw-r--r--'
        };

        expect(stats.size).toBe(1024);
        expect(stats.created).toBeInstanceOf(Date);
        expect(stats.modified).toBeInstanceOf(Date);
        expect(stats.isFile).toBe(true);
        expect(stats.isDirectory).toBe(false);
        expect(stats.permissions).toBe('rw-r--r--');
      });
    });

    describe('CLIExecutionOptions', () => {
      it('should accept all execution options', () => {
        const options: CLIExecutionOptions = {
          workingDirectory: '/project',
          environment: { NODE_ENV: 'test' },
          timeout: 5000,
          captureOutput: true,
          captureError: true
        };

        expect(options.workingDirectory).toBe('/project');
        expect(options.environment).toEqual({ NODE_ENV: 'test' });
        expect(options.timeout).toBe(5000);
        expect(options.captureOutput).toBe(true);
        expect(options.captureError).toBe(true);
      });

      it('should allow optional properties', () => {
        const options: CLIExecutionOptions = {
          timeout: 5000
        };

        expect(options.timeout).toBe(5000);
        expect(options.workingDirectory).toBeUndefined();
        expect(options.environment).toBeUndefined();
        expect(options.captureOutput).toBeUndefined();
        expect(options.captureError).toBeUndefined();
      });
    });

    describe('CLIExecutionResult', () => {
      it('should include all execution results', () => {
        const result: CLIExecutionResult = {
          exitCode: 0,
          stdout: 'command output',
          stderr: 'error output',
          executionTime: 150,
          success: true
        };

        expect(result.exitCode).toBe(0);
        expect(result.stdout).toBe('command output');
        expect(result.stderr).toBe('error output');
        expect(result.executionTime).toBe(150);
        expect(result.success).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should include error information when failed', () => {
        const result: CLIExecutionResult = {
          exitCode: 1,
          stdout: '',
          stderr: 'Command not found',
          executionTime: 100,
          success: false,
          error: 'Command execution failed'
        };

        expect(result.exitCode).toBe(1);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Command execution failed');
      });
    });

    describe('TemplateFormat enum', () => {
      it('should have all expected format values', () => {
        expect(TemplateFormat.MARKDOWN).toBe('markdown');
        expect(TemplateFormat.JSON).toBe('json');
        expect(TemplateFormat.YAML).toBe('yaml');
      });

      it('should have correct number of values', () => {
        const values = Object.values(TemplateFormat);
        expect(values).toHaveLength(3);
      });
    });

    describe('LogLevel enum', () => {
      it('should have all expected log level values', () => {
        expect(LogLevel.DEBUG).toBe('debug');
        expect(LogLevel.INFO).toBe('info');
        expect(LogLevel.WARN).toBe('warn');
        expect(LogLevel.ERROR).toBe('error');
      });

      it('should have correct number of values', () => {
        const values = Object.values(LogLevel);
        expect(values).toHaveLength(4);
      });
    });
  });

  describe('Service interfaces', () => {
    describe('IConfigurationService', () => {
      it('should define all required methods', () => {
        const service: IConfigurationService = {
          async loadConfiguration(filePath: string): Promise<CodexConfiguration> {
            return {
              enabled: true,
              templatePath: 'templates',
              validationEnabled: true,
              fallbackToCustom: false,
              timeout: 5000
            };
          },
          async saveConfiguration(config: CodexConfiguration, filePath: string): Promise<void> {},
          async validateConfiguration(config: CodexConfiguration): Promise<boolean> { return true; },
          getDefaultConfiguration(): CodexConfiguration {
            return {
              enabled: true,
              templatePath: 'templates',
              validationEnabled: true,
              fallbackToCustom: false,
              timeout: 5000
            };
          },
          mergeConfigurations(base: CodexConfiguration, override: Partial<CodexConfiguration>): CodexConfiguration {
            return { ...base, ...override };
          }
        };

        expect(service.loadConfiguration).toBeInstanceOf(Function);
        expect(service.saveConfiguration).toBeInstanceOf(Function);
        expect(service.validateConfiguration).toBeInstanceOf(Function);
        expect(service.getDefaultConfiguration).toBeInstanceOf(Function);
        expect(service.mergeConfigurations).toBeInstanceOf(Function);
      });
    });

    describe('ILoggingService', () => {
      it('should define all required methods', () => {
        const service: ILoggingService = {
          debug(message: string, context?: any): void {},
          info(message: string, context?: any): void {},
          warn(message: string, context?: any): void {},
          error(message: string, error?: Error, context?: any): void {},
          setLogLevel(level: LogLevel): void {},
          setEnabled(enabled: boolean): void {}
        };

        expect(service.debug).toBeInstanceOf(Function);
        expect(service.info).toBeInstanceOf(Function);
        expect(service.warn).toBeInstanceOf(Function);
        expect(service.error).toBeInstanceOf(Function);
        expect(service.setLogLevel).toBeInstanceOf(Function);
        expect(service.setEnabled).toBeInstanceOf(Function);
      });
    });

    describe('IValidationService', () => {
      it('should define all required methods', () => {
        const service: IValidationService = {
          async validateFilePath(path: string): Promise<boolean> { return true; },
          async validateDirectoryPath(path: string): Promise<boolean> { return true; },
          async validateCommandTemplate(template: CodexCommandTemplate): Promise<boolean> { return true; },
          async validateConfiguration(config: CodexConfiguration): Promise<boolean> { return true; },
          async validateCLICommand(command: string): Promise<boolean> { return true; }
        };

        expect(service.validateFilePath).toBeInstanceOf(Function);
        expect(service.validateDirectoryPath).toBeInstanceOf(Function);
        expect(service.validateCommandTemplate).toBeInstanceOf(Function);
        expect(service.validateConfiguration).toBeInstanceOf(Function);
        expect(service.validateCLICommand).toBeInstanceOf(Function);
      });
    });

    describe('IErrorHandlingService', () => {
      it('should define all required methods', () => {
        const service: IErrorHandlingService = {
          handleFileSystemError(error: Error, operation: string): CodexError {
            return {
              code: 'FILESYSTEM_ERROR',
              message: error.message,
              recoverable: true,
              timestamp: new Date()
            };
          },
          handleCLIExecutionError(error: Error, command: string): CodexError {
            return {
              code: 'CLI_ERROR',
              message: error.message,
              recoverable: true,
              timestamp: new Date()
            };
          },
          handleValidationError(error: Error, context: string): CodexError {
            return {
              code: 'VALIDATION_ERROR',
              message: error.message,
              recoverable: true,
              timestamp: new Date()
            };
          },
          handleConfigurationError(error: Error, config: any): CodexError {
            return {
              code: 'CONFIG_ERROR',
              message: error.message,
              recoverable: true,
              timestamp: new Date()
            };
          },
          createUserFriendlyError(error: CodexError): string {
            return `Error: ${error.message}`;
          }
        };

        expect(service.handleFileSystemError).toBeInstanceOf(Function);
        expect(service.handleCLIExecutionError).toBeInstanceOf(Function);
        expect(service.handleValidationError).toBeInstanceOf(Function);
        expect(service.handleConfigurationError).toBeInstanceOf(Function);
        expect(service.createUserFriendlyError).toBeInstanceOf(Function);
      });
    });

    describe('IExternalServiceIntegration', () => {
      it('should define all required methods', () => {
        const service: IExternalServiceIntegration = {
          async isServiceAvailable(): Promise<boolean> { return true; },
          async getServiceStatus(): Promise<ServiceStatus> {
            return {
              available: true,
              version: '1.0.0',
              lastChecked: new Date()
            };
          },
          async executeRequest(request: ServiceRequest): Promise<ServiceResponse> {
            return {
              statusCode: 200,
              headers: {},
              body: {},
              success: true
            };
          },
          async handleServiceError(error: Error): Promise<ServiceError> {
            return {
              code: 'SERVICE_ERROR',
              message: error.message,
              recoverable: true,
              timestamp: new Date()
            };
          }
        };

        expect(service.isServiceAvailable).toBeInstanceOf(Function);
        expect(service.getServiceStatus).toBeInstanceOf(Function);
        expect(service.executeRequest).toBeInstanceOf(Function);
        expect(service.handleServiceError).toBeInstanceOf(Function);
      });
    });
  });

  describe('Service DTOs', () => {
    describe('ServiceStatus', () => {
      it('should include all status properties', () => {
        const status: ServiceStatus = {
          available: true,
          version: '1.0.0',
          lastChecked: new Date('2025-01-01')
        };

        expect(status.available).toBe(true);
        expect(status.version).toBe('1.0.0');
        expect(status.lastChecked).toBeInstanceOf(Date);
        expect(status.error).toBeUndefined();
      });

      it('should include error information when unavailable', () => {
        const status: ServiceStatus = {
          available: false,
          lastChecked: new Date('2025-01-01'),
          error: 'Service unavailable'
        };

        expect(status.available).toBe(false);
        expect(status.error).toBe('Service unavailable');
        expect(status.version).toBeUndefined();
      });
    });

    describe('ServiceRequest', () => {
      it('should include all request properties', () => {
        const request: ServiceRequest = {
          endpoint: '/api/test',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { test: 'data' },
          timeout: 5000
        };

        expect(request.endpoint).toBe('/api/test');
        expect(request.method).toBe('POST');
        expect(request.headers).toEqual({ 'Content-Type': 'application/json' });
        expect(request.body).toEqual({ test: 'data' });
        expect(request.timeout).toBe(5000);
      });

      it('should allow optional properties', () => {
        const request: ServiceRequest = {
          endpoint: '/api/test',
          method: 'GET'
        };

        expect(request.endpoint).toBe('/api/test');
        expect(request.method).toBe('GET');
        expect(request.headers).toBeUndefined();
        expect(request.body).toBeUndefined();
        expect(request.timeout).toBeUndefined();
      });
    });

    describe('ServiceResponse', () => {
      it('should include all response properties', () => {
        const response: ServiceResponse = {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: { result: 'success' },
          success: true
        };

        expect(response.statusCode).toBe(200);
        expect(response.headers).toEqual({ 'Content-Type': 'application/json' });
        expect(response.body).toEqual({ result: 'success' });
        expect(response.success).toBe(true);
        expect(response.error).toBeUndefined();
      });

      it('should include error information when failed', () => {
        const response: ServiceResponse = {
          statusCode: 500,
          headers: {},
          body: {},
          success: false,
          error: 'Internal server error'
        };

        expect(response.statusCode).toBe(500);
        expect(response.success).toBe(false);
        expect(response.error).toBe('Internal server error');
      });
    });

    describe('ServiceError', () => {
      it('should include all error properties', () => {
        const error: ServiceError = {
          code: 'SERVICE_ERROR',
          message: 'Service operation failed',
          statusCode: 500,
          recoverable: true,
          timestamp: new Date('2025-01-01')
        };

        expect(error.code).toBe('SERVICE_ERROR');
        expect(error.message).toBe('Service operation failed');
        expect(error.statusCode).toBe(500);
        expect(error.recoverable).toBe(true);
        expect(error.timestamp).toBeInstanceOf(Date);
      });

      it('should allow optional status code', () => {
        const error: ServiceError = {
          code: 'SERVICE_ERROR',
          message: 'Service operation failed',
          recoverable: false,
          timestamp: new Date('2025-01-01')
        };

        expect(error.statusCode).toBeUndefined();
      });
    });
  });

  describe('Infrastructure Exceptions', () => {
    describe('CodexInfrastructureException', () => {
      it('should have correct exception properties', () => {
        const originalError = new Error('Original error');
        const exception = new CodexInfrastructureException(
          'Infrastructure error occurred',
          'INFRA_ERROR',
          true,
          originalError
        );

        expect(exception.message).toBe('Infrastructure error occurred');
        expect(exception.code).toBe('INFRA_ERROR');
        expect(exception.recoverable).toBe(true);
        expect(exception.originalError).toBe(originalError);
        expect(exception.name).toBe('CodexInfrastructureException');
        expect(exception).toBeInstanceOf(Error);
      });

      it('should default recoverable to false', () => {
        const exception = new CodexInfrastructureException(
          'Infrastructure error occurred',
          'INFRA_ERROR'
        );

        expect(exception.recoverable).toBe(false);
        expect(exception.originalError).toBeUndefined();
      });
    });

    describe('CodexFileSystemException', () => {
      it('should include file system details', () => {
        const exception = new CodexFileSystemException(
          'File operation failed',
          '/path/to/file.txt',
          'read'
        );

        expect(exception.message).toBe('File operation failed');
        expect(exception.code).toBe('CODEX_FILESYSTEM_ERROR');
        expect(exception.recoverable).toBe(true);
        expect(exception.filePath).toBe('/path/to/file.txt');
        expect(exception.operation).toBe('read');
        expect(exception.name).toBe('CodexFileSystemException');
        expect(exception).toBeInstanceOf(CodexInfrastructureException);
      });

      it('should allow original error', () => {
        const originalError = new Error('Original error');
        const exception = new CodexFileSystemException(
          'File operation failed',
          '/path/to/file.txt',
          'read',
          originalError
        );

        expect(exception.originalError).toBe(originalError);
      });
    });

    describe('CodexCLIExecutionException', () => {
      it('should include CLI execution details', () => {
        const result: CLIExecutionResult = {
          exitCode: 1,
          stdout: '',
          stderr: 'Command not found',
          executionTime: 100,
          success: false
        };

        const exception = new CodexCLIExecutionException(
          'CLI execution failed',
          'test-command',
          result
        );

        expect(exception.message).toBe('CLI execution failed');
        expect(exception.code).toBe('CODEX_CLI_EXECUTION_ERROR');
        expect(exception.recoverable).toBe(true);
        expect(exception.command).toBe('test-command');
        expect(exception.result).toBe(result);
        expect(exception.name).toBe('CodexCLIExecutionException');
        expect(exception).toBeInstanceOf(CodexInfrastructureException);
      });
    });

    describe('CodexExternalServiceException', () => {
      it('should include external service details', () => {
        const request: ServiceRequest = {
          endpoint: '/api/test',
          method: 'POST'
        };

        const exception = new CodexExternalServiceException(
          'External service failed',
          'test-service',
          request
        );

        expect(exception.message).toBe('External service failed');
        expect(exception.code).toBe('CODEX_EXTERNAL_SERVICE_ERROR');
        expect(exception.recoverable).toBe(true);
        expect(exception.service).toBe('test-service');
        expect(exception.request).toBe(request);
        expect(exception.name).toBe('CodexExternalServiceException');
        expect(exception).toBeInstanceOf(CodexInfrastructureException);
      });
    });
  });

  describe('CodexInfrastructureUtils', () => {
    describe('createDefaultCLIOptions', () => {
      it('should create default CLI options', () => {
        const options = CodexInfrastructureUtils.createDefaultCLIOptions();

        expect(options.timeout).toBe(30000);
        expect(options.captureOutput).toBe(true);
        expect(options.captureError).toBe(true);
        expect(options.workingDirectory).toBeUndefined();
        expect(options.environment).toBeUndefined();
      });
    });

    describe('isValidFilePath', () => {
      it('should validate file paths correctly', () => {
        expect(CodexInfrastructureUtils.isValidFilePath('/valid/path.txt')).toBe(true);
        expect(CodexInfrastructureUtils.isValidFilePath('relative/path.txt')).toBe(true);
        expect(CodexInfrastructureUtils.isValidFilePath('')).toBe(false);
        expect(CodexInfrastructureUtils.isValidFilePath('/path/with\0null.txt')).toBe(false);
        expect(CodexInfrastructureUtils.isValidFilePath('/path/with\0null')).toBe(false);
      });
    });

    describe('isValidDirectoryPath', () => {
      it('should validate directory paths correctly', () => {
        expect(CodexInfrastructureUtils.isValidDirectoryPath('/valid/directory')).toBe(true);
        expect(CodexInfrastructureUtils.isValidDirectoryPath('relative/directory')).toBe(true);
        expect(CodexInfrastructureUtils.isValidDirectoryPath('')).toBe(false);
        expect(CodexInfrastructureUtils.isValidDirectoryPath('/path/with\0null')).toBe(false);
        expect(CodexInfrastructureUtils.isValidDirectoryPath('/path/with\0null/')).toBe(false);
      });
    });

    describe('createErrorFromCLIResult', () => {
      it('should create error from CLI result', () => {
        const result: CLIExecutionResult = {
          exitCode: 1,
          stdout: 'output',
          stderr: 'error message',
          executionTime: 200,
          success: false
        };

        const error = CodexInfrastructureUtils.createErrorFromCLIResult(result, 'test-command');

        expect(error.code).toBe('CLI_EXECUTION_FAILED');
        expect(error.message).toBe("Command 'test-command' failed with exit code 1");
        expect(error.details.exitCode).toBe(1);
        expect(error.details.stdout).toBe('output');
        expect(error.details.stderr).toBe('error message');
        expect(error.details.executionTime).toBe(200);
        expect(error.suggestions).toHaveLength(3);
        expect(error.suggestions).toContain('Check if the command is installed and available in PATH');
        expect(error.suggestions).toContain('Verify command syntax and arguments');
        expect(error.suggestions).toContain('Check file permissions and access rights');
        expect(error.recoverable).toBe(true);
        expect(error.timestamp).toBeInstanceOf(Date);
      });

      it('should handle different exit codes', () => {
        const result: CLIExecutionResult = {
          exitCode: 127,
          stdout: '',
          stderr: 'command not found',
          executionTime: 50,
          success: false
        };

        const error = CodexInfrastructureUtils.createErrorFromCLIResult(result, 'missing-command');

        expect(error.message).toBe("Command 'missing-command' failed with exit code 127");
        expect(error.details.exitCode).toBe(127);
      });
    });
  });
});
