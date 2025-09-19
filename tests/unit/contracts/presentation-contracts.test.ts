/**
 * Unit tests for presentation contracts
 * 
 * These tests verify the presentation contracts and interfaces work correctly
 * and provide comprehensive coverage for all presentation layer types.
 */

import {
  ICLICommand,
  IUserInterface,
  IOutputFormatter,
  IInteractivePrompt,
  IProgressReporter,
  ICommandLineInterface,
  IDisplayService,
  IThemeService,
  CLICommandOption,
  CLICommandResult,
  MessageType,
  OutputFormat,
  ParsedArguments,
  ThemeColors,
  TextStyle,
  CodexPresentationException,
  CodexCLICommandException,
  CodexUserInterfaceException,
  CodexOutputFormattingException,
  CodexPresentationUtils
} from '../../../src/contracts/presentation-contracts';
import {
  CodexConfiguration,
  CodexValidationResponse,
  CodexCommandTemplate,
  CodexStatus,
  CodexError,
  CodexValidationResult,
  CodexIntegrationStatus
} from '../../../src/contracts/domain-contracts';

describe('Presentation Contracts', () => {
  
  describe('ICLICommand interface', () => {
    it('should define all required properties and methods', () => {
      const command: ICLICommand = {
        name: 'test-command',
        description: 'Test command description',
        usage: 'test-command [options]',
        options: [],
        async execute(args: readonly string[], options: Record<string, any>): Promise<CLICommandResult> {
          return {
            success: true,
            message: 'Command executed successfully',
            exitCode: 0
          };
        },
        async validate(args: readonly string[], options: Record<string, any>): Promise<boolean> {
          return true;
        },
        getHelp(): string {
          return 'Help text for test command';
        }
      };

      expect(command.name).toBe('test-command');
      expect(command.description).toBe('Test command description');
      expect(command.usage).toBe('test-command [options]');
      expect(command.options).toEqual([]);
      expect(command.execute).toBeInstanceOf(Function);
      expect(command.validate).toBeInstanceOf(Function);
      expect(command.getHelp).toBeInstanceOf(Function);
    });

    it('should execute command with arguments and options', async () => {
      const command: ICLICommand = {
        name: 'create-project',
        description: 'Create a new project',
        usage: 'create-project <name> [options]',
        options: [{
          name: 'template',
          shortName: 't',
          description: 'Project template',
          type: 'string',
          required: false,
          defaultValue: 'default'
        }],
        async execute(args: readonly string[], options: Record<string, any>): Promise<CLICommandResult> {
          expect(args).toEqual(['my-project']);
          expect(options.template).toBe('react');
          return {
            success: true,
            message: 'Project created successfully',
            data: { projectName: 'my-project', template: 'react' },
            exitCode: 0
          };
        },
        async validate(args: readonly string[], options: Record<string, any>): Promise<boolean> {
          return args.length > 0;
        },
        getHelp(): string {
          return 'Create a new project with specified name and template';
        }
      };

      const result = await command.execute(['my-project'], { template: 'react' });
      expect(result.success).toBe(true);
      expect(result.message).toBe('Project created successfully');
      expect(result.data).toEqual({ projectName: 'my-project', template: 'react' });
      expect(result.exitCode).toBe(0);
    });

    it('should validate command arguments', async () => {
      const command: ICLICommand = {
        name: 'test-command',
        description: 'Test command',
        usage: 'test-command <required>',
        options: [],
        async execute(args: readonly string[], options: Record<string, any>): Promise<CLICommandResult> {
          return { success: true, message: 'Success', exitCode: 0 };
        },
        async validate(args: readonly string[], options: Record<string, any>): Promise<boolean> {
          return args.length > 0;
        },
        getHelp(): string { return 'Help'; }
      };

      expect(await command.validate(['arg1'], {})).toBe(true);
      expect(await command.validate([], {})).toBe(false);
    });
  });

  describe('IUserInterface interface', () => {
    it('should define all required methods', () => {
      const ui: IUserInterface = {
        displayMessage(message: string, type?: MessageType): void {},
        displayError(error: CodexError): void {},
        displayProgress(message: string, progress: number): void {},
        async displayConfirmation(message: string): Promise<boolean> { return true; },
        async displaySelection(message: string, choices: readonly string[]): Promise<string> { return choices[0] || ''; },
        async displayInput(message: string, defaultValue?: string): Promise<string> { return 'input'; },
        clearScreen(): void {},
        displayHelp(helpText: string): void {}
      };

      expect(ui.displayMessage).toBeInstanceOf(Function);
      expect(ui.displayError).toBeInstanceOf(Function);
      expect(ui.displayProgress).toBeInstanceOf(Function);
      expect(ui.displayConfirmation).toBeInstanceOf(Function);
      expect(ui.displaySelection).toBeInstanceOf(Function);
      expect(ui.displayInput).toBeInstanceOf(Function);
      expect(ui.clearScreen).toBeInstanceOf(Function);
      expect(ui.displayHelp).toBeInstanceOf(Function);
    });

    it('should handle different message types', () => {
      const ui: IUserInterface = {
        displayMessage(message: string, type?: MessageType): void {
          expect(message).toBe('Test message');
          expect(type).toBe(MessageType.SUCCESS);
        },
        displayError(error: CodexError): void {},
        displayProgress(message: string, progress: number): void {},
        async displayConfirmation(message: string): Promise<boolean> { return true; },
        async displaySelection(message: string, choices: readonly string[]): Promise<string> { return choices[0] || ''; },
        async displayInput(message: string, defaultValue?: string): Promise<string> { return 'input'; },
        clearScreen(): void {},
        displayHelp(helpText: string): void {}
      };

      ui.displayMessage('Test message', MessageType.SUCCESS);
    });

    it('should handle user interactions', async () => {
      const ui: IUserInterface = {
        displayMessage(message: string, type?: MessageType): void {},
        displayError(error: CodexError): void {},
        displayProgress(message: string, progress: number): void {},
        async displayConfirmation(message: string): Promise<boolean> {
          expect(message).toBe('Are you sure?');
          return true;
        },
        async displaySelection(message: string, choices: readonly string[]): Promise<string> {
          expect(message).toBe('Choose an option:');
          expect(choices).toEqual(['option1', 'option2']);
          return 'option1';
        },
        async displayInput(message: string, defaultValue?: string): Promise<string> {
          expect(message).toBe('Enter value:');
          expect(defaultValue).toBe('default');
          return 'user input';
        },
        clearScreen(): void {},
        displayHelp(helpText: string): void {}
      };

      expect(await ui.displayConfirmation('Are you sure?')).toBe(true);
      expect(await ui.displaySelection('Choose an option:', ['option1', 'option2'])).toBe('option1');
      expect(await ui.displayInput('Enter value:', 'default')).toBe('user input');
    });
  });

  describe('IOutputFormatter interface', () => {
    it('should define all required methods', () => {
      const formatter: IOutputFormatter = {
        formatValidationResponse(response: CodexValidationResponse): string { return 'formatted response'; },
        formatStatus(status: CodexStatus): string { return 'formatted status'; },
        formatCommandTemplates(templates: readonly CodexCommandTemplate[]): string { return 'formatted templates'; },
        formatError(error: CodexError): string { return 'formatted error'; },
        formatConfiguration(config: CodexConfiguration): string { return 'formatted config'; },
        formatHelp(helpText: string): string { return 'formatted help'; }
      };

      expect(formatter.formatValidationResponse).toBeInstanceOf(Function);
      expect(formatter.formatStatus).toBeInstanceOf(Function);
      expect(formatter.formatCommandTemplates).toBeInstanceOf(Function);
      expect(formatter.formatError).toBeInstanceOf(Function);
      expect(formatter.formatConfiguration).toBeInstanceOf(Function);
      expect(formatter.formatHelp).toBeInstanceOf(Function);
    });

    it('should format validation response', () => {
      const response: CodexValidationResponse = {
        result: CodexValidationResult.SUCCESS,
        cliPath: '/usr/local/bin/codex',
        version: '1.0.0',
        timestamp: new Date()
      };

      const formatter: IOutputFormatter = {
        formatValidationResponse(response: CodexValidationResponse): string {
          expect(response.result).toBe(CodexValidationResult.SUCCESS);
          expect(response.version).toBe('1.0.0');
          return `✓ Codex CLI validation successful (${response.version})`;
        },
        formatStatus(status: CodexStatus): string { return 'formatted status'; },
        formatCommandTemplates(templates: readonly CodexCommandTemplate[]): string { return 'formatted templates'; },
        formatError(error: CodexError): string { return 'formatted error'; },
        formatConfiguration(config: CodexConfiguration): string { return 'formatted config'; },
        formatHelp(helpText: string): string { return 'formatted help'; }
      };

      const formatted = formatter.formatValidationResponse(response);
      expect(formatted).toBe('✓ Codex CLI validation successful (1.0.0)');
    });

    it('should format status information', () => {
      const status: CodexStatus = {
        isInitialized: true,
        isConfigured: true,
        cliAvailable: true,
        templatesGenerated: true,
        lastValidation: new Date('2025-01-01'),
        errorCount: 0,
        status: CodexIntegrationStatus.VALIDATED
      };

      const formatter: IOutputFormatter = {
        formatValidationResponse(response: CodexValidationResponse): string { return 'formatted response'; },
        formatStatus(status: CodexStatus): string {
          expect(status.isInitialized).toBe(true);
          expect(status.status).toBe(CodexIntegrationStatus.VALIDATED);
          return `Status: ${status.status}\nInitialized: ${status.isInitialized ? 'Yes' : 'No'}`;
        },
        formatCommandTemplates(templates: readonly CodexCommandTemplate[]): string { return 'formatted templates'; },
        formatError(error: CodexError): string { return 'formatted error'; },
        formatConfiguration(config: CodexConfiguration): string { return 'formatted config'; },
        formatHelp(helpText: string): string { return 'formatted help'; }
      };

      const formatted = formatter.formatStatus(status);
      expect(formatted).toContain('Status: validated');
      expect(formatted).toContain('Initialized: Yes');
    });
  });

  describe('IInteractivePrompt interface', () => {
    it('should define all required methods', () => {
      const prompt: IInteractivePrompt = {
        async displayAIAgentSelection(): Promise<string> { return 'codex'; },
        async displayCodexConfigurationPrompt(): Promise<Partial<CodexConfiguration>> { return {}; },
        async displayValidationConfirmation(): Promise<boolean> { return true; },
        async displayTemplateGenerationConfirmation(): Promise<boolean> { return true; },
        async displayErrorResolutionPrompt(error: CodexError): Promise<string> { return 'retry'; }
      };

      expect(prompt.displayAIAgentSelection).toBeInstanceOf(Function);
      expect(prompt.displayCodexConfigurationPrompt).toBeInstanceOf(Function);
      expect(prompt.displayValidationConfirmation).toBeInstanceOf(Function);
      expect(prompt.displayTemplateGenerationConfirmation).toBeInstanceOf(Function);
      expect(prompt.displayErrorResolutionPrompt).toBeInstanceOf(Function);
    });

    it('should handle AI agent selection', async () => {
      const prompt: IInteractivePrompt = {
        async displayAIAgentSelection(): Promise<string> {
          return 'codex';
        },
        async displayCodexConfigurationPrompt(): Promise<Partial<CodexConfiguration>> { return {}; },
        async displayValidationConfirmation(): Promise<boolean> { return true; },
        async displayTemplateGenerationConfirmation(): Promise<boolean> { return true; },
        async displayErrorResolutionPrompt(error: CodexError): Promise<string> { return 'retry'; }
      };

      const selectedAgent = await prompt.displayAIAgentSelection();
      expect(selectedAgent).toBe('codex');
    });

    it('should handle configuration prompts', async () => {
      const prompt: IInteractivePrompt = {
        async displayAIAgentSelection(): Promise<string> { return 'codex'; },
        async displayCodexConfigurationPrompt(): Promise<Partial<CodexConfiguration>> {
          return {
            enabled: true,
            templatePath: 'templates/codex',
            validationEnabled: true,
            fallbackToCustom: false,
            timeout: 30000
          };
        },
        async displayValidationConfirmation(): Promise<boolean> { return true; },
        async displayTemplateGenerationConfirmation(): Promise<boolean> { return true; },
        async displayErrorResolutionPrompt(error: CodexError): Promise<string> { return 'retry'; }
      };

      const config = await prompt.displayCodexConfigurationPrompt();
      expect(config.enabled).toBe(true);
      expect(config.templatePath).toBe('templates/codex');
      expect(config.timeout).toBe(30000);
    });
  });

  describe('Presentation DTOs and types', () => {
    describe('CLICommandOption', () => {
      it('should include all option properties', () => {
        const option: CLICommandOption = {
          name: 'template',
          shortName: 't',
          description: 'Project template to use',
          type: 'string',
          required: false,
          defaultValue: 'default',
          choices: ['default', 'react', 'vue', 'angular']
        };

        expect(option.name).toBe('template');
        expect(option.shortName).toBe('t');
        expect(option.description).toBe('Project template to use');
        expect(option.type).toBe('string');
        expect(option.required).toBe(false);
        expect(option.defaultValue).toBe('default');
        expect(option.choices).toEqual(['default', 'react', 'vue', 'angular']);
      });

      it('should allow optional properties', () => {
        const option: CLICommandOption = {
          name: 'verbose',
          description: 'Enable verbose output',
          type: 'boolean',
          required: false
        };

        expect(option.name).toBe('verbose');
        expect(option.shortName).toBeUndefined();
        expect(option.defaultValue).toBeUndefined();
        expect(option.choices).toBeUndefined();
      });
    });

    describe('CLICommandResult', () => {
      it('should include all result properties', () => {
        const result: CLICommandResult = {
          success: true,
          message: 'Command executed successfully',
          data: { projectName: 'my-project' },
          exitCode: 0
        };

        expect(result.success).toBe(true);
        expect(result.message).toBe('Command executed successfully');
        expect(result.data).toEqual({ projectName: 'my-project' });
        expect(result.error).toBeUndefined();
        expect(result.exitCode).toBe(0);
      });

      it('should include error information when failed', () => {
        const error: CodexError = {
          code: 'COMMAND_FAILED',
          message: 'Command execution failed',
          recoverable: true,
          timestamp: new Date()
        };

        const result: CLICommandResult = {
          success: false,
          message: 'Command failed',
          error,
          exitCode: 1
        };

        expect(result.success).toBe(false);
        expect(result.error).toBe(error);
        expect(result.exitCode).toBe(1);
      });
    });

    describe('ParsedArguments', () => {
      it('should include all parsed argument properties', () => {
        const parsed: ParsedArguments = {
          command: 'create-project',
          args: ['my-project'],
          options: { template: 'react', verbose: true },
          valid: true,
          errors: []
        };

        expect(parsed.command).toBe('create-project');
        expect(parsed.args).toEqual(['my-project']);
        expect(parsed.options).toEqual({ template: 'react', verbose: true });
        expect(parsed.valid).toBe(true);
        expect(parsed.errors).toEqual([]);
      });

      it('should include errors when invalid', () => {
        const parsed: ParsedArguments = {
          command: 'invalid-command',
          args: [],
          options: {},
          valid: false,
          errors: ['Unknown command', 'Missing required argument']
        };

        expect(parsed.valid).toBe(false);
        expect(parsed.errors).toEqual(['Unknown command', 'Missing required argument']);
      });
    });

    describe('ThemeColors', () => {
      it('should include all theme color properties', () => {
        const colors: ThemeColors = {
          primary: '#007acc',
          secondary: '#6c757d',
          success: '#28a745',
          warning: '#ffc107',
          error: '#dc3545',
          info: '#17a2b8',
          background: '#ffffff',
          foreground: '#000000'
        };

        expect(colors.primary).toBe('#007acc');
        expect(colors.secondary).toBe('#6c757d');
        expect(colors.success).toBe('#28a745');
        expect(colors.warning).toBe('#ffc107');
        expect(colors.error).toBe('#dc3545');
        expect(colors.info).toBe('#17a2b8');
        expect(colors.background).toBe('#ffffff');
        expect(colors.foreground).toBe('#000000');
      });
    });
  });

  describe('Enums', () => {
    describe('MessageType', () => {
      it('should have all expected message type values', () => {
        expect(MessageType.INFO).toBe('info');
        expect(MessageType.SUCCESS).toBe('success');
        expect(MessageType.WARNING).toBe('warning');
        expect(MessageType.ERROR).toBe('error');
        expect(MessageType.DEBUG).toBe('debug');
      });

      it('should have correct number of values', () => {
        const values = Object.values(MessageType);
        expect(values).toHaveLength(5);
      });
    });

    describe('OutputFormat', () => {
      it('should have all expected output format values', () => {
        expect(OutputFormat.TEXT).toBe('text');
        expect(OutputFormat.JSON).toBe('json');
        expect(OutputFormat.YAML).toBe('yaml');
        expect(OutputFormat.TABLE).toBe('table');
        expect(OutputFormat.MARKDOWN).toBe('markdown');
      });

      it('should have correct number of values', () => {
        const values = Object.values(OutputFormat);
        expect(values).toHaveLength(5);
      });
    });

    describe('TextStyle', () => {
      it('should have all expected text style values', () => {
        expect(TextStyle.BOLD).toBe('bold');
        expect(TextStyle.ITALIC).toBe('italic');
        expect(TextStyle.UNDERLINE).toBe('underline');
        expect(TextStyle.STRIKETHROUGH).toBe('strikethrough');
        expect(TextStyle.DIM).toBe('dim');
        expect(TextStyle.INVERSE).toBe('inverse');
      });

      it('should have correct number of values', () => {
        const values = Object.values(TextStyle);
        expect(values).toHaveLength(6);
      });
    });
  });

  describe('Additional interfaces', () => {
    describe('IProgressReporter', () => {
      it('should define all required methods', () => {
        const reporter: IProgressReporter = {
          startProgress(message: string): void {},
          updateProgress(progress: number, message?: string): void {},
          completeProgress(message?: string): void {},
          reportError(error: CodexError): void {},
          stopProgress(): void {}
        };

        expect(reporter.startProgress).toBeInstanceOf(Function);
        expect(reporter.updateProgress).toBeInstanceOf(Function);
        expect(reporter.completeProgress).toBeInstanceOf(Function);
        expect(reporter.reportError).toBeInstanceOf(Function);
        expect(reporter.stopProgress).toBeInstanceOf(Function);
      });
    });

    describe('ICommandLineInterface', () => {
      it('should define all required methods', () => {
        const cli: ICommandLineInterface = {
          parseArguments(args: readonly string[]): ParsedArguments {
            return {
              command: 'test',
              args: [],
              options: {},
              valid: true,
              errors: []
            };
          },
          displayHelp(command: string): void {},
          displayVersion(): void {},
          async executeCommand(command: string, args: readonly string[]): Promise<void> {},
          registerCommand(command: ICLICommand): void {},
          getAvailableCommands(): readonly string[] { return []; }
        };

        expect(cli.parseArguments).toBeInstanceOf(Function);
        expect(cli.displayHelp).toBeInstanceOf(Function);
        expect(cli.displayVersion).toBeInstanceOf(Function);
        expect(cli.executeCommand).toBeInstanceOf(Function);
        expect(cli.registerCommand).toBeInstanceOf(Function);
        expect(cli.getAvailableCommands).toBeInstanceOf(Function);
      });
    });

    describe('IDisplayService', () => {
      it('should define all required methods', () => {
        const display: IDisplayService = {
          displayTable(data: readonly any[], columns: readonly string[]): void {},
          displayList(items: readonly string[], title?: string): void {},
          displayCodeBlock(code: string, language?: string): void {},
          displayJSON(data: any): void {},
          displayYAML(data: any): void {},
          displayMarkdown(markdown: string): void {}
        };

        expect(display.displayTable).toBeInstanceOf(Function);
        expect(display.displayList).toBeInstanceOf(Function);
        expect(display.displayCodeBlock).toBeInstanceOf(Function);
        expect(display.displayJSON).toBeInstanceOf(Function);
        expect(display.displayYAML).toBeInstanceOf(Function);
        expect(display.displayMarkdown).toBeInstanceOf(Function);
      });
    });

    describe('IThemeService', () => {
      it('should define all required methods', () => {
        const theme: IThemeService = {
          getColors(): ThemeColors {
            return {
              primary: '#007acc',
              secondary: '#6c757d',
              success: '#28a745',
              warning: '#ffc107',
              error: '#dc3545',
              info: '#17a2b8',
              background: '#ffffff',
              foreground: '#000000'
            };
          },
          applyTheme(text: string, style: TextStyle): string { return text; },
          getStyledMessage(message: string, type: MessageType): string { return message; },
          getStyledError(error: CodexError): string { return error.message; },
          getStyledSuccess(message: string): string { return message; }
        };

        expect(theme.getColors).toBeInstanceOf(Function);
        expect(theme.applyTheme).toBeInstanceOf(Function);
        expect(theme.getStyledMessage).toBeInstanceOf(Function);
        expect(theme.getStyledError).toBeInstanceOf(Function);
        expect(theme.getStyledSuccess).toBeInstanceOf(Function);
      });
    });
  });

  describe('Presentation Exceptions', () => {
    describe('CodexPresentationException', () => {
      it('should have correct exception properties', () => {
        const originalError = new Error('Original error');
        const exception = new CodexPresentationException(
          'Presentation error occurred',
          'PRESENTATION_ERROR',
          true,
          originalError
        );

        expect(exception.message).toBe('Presentation error occurred');
        expect(exception.code).toBe('PRESENTATION_ERROR');
        expect(exception.recoverable).toBe(true);
        expect(exception.originalError).toBe(originalError);
        expect(exception.name).toBe('CodexPresentationException');
        expect(exception).toBeInstanceOf(Error);
      });

      it('should default recoverable to false', () => {
        const exception = new CodexPresentationException(
          'Presentation error occurred',
          'PRESENTATION_ERROR'
        );

        expect(exception.recoverable).toBe(false);
        expect(exception.originalError).toBeUndefined();
      });
    });

    describe('CodexCLICommandException', () => {
      it('should include CLI command details', () => {
        const exception = new CodexCLICommandException(
          'CLI command failed',
          'test-command',
          ['arg1', 'arg2']
        );

        expect(exception.message).toBe('CLI command failed');
        expect(exception.code).toBe('CODEX_CLI_COMMAND_ERROR');
        expect(exception.recoverable).toBe(true);
        expect(exception.command).toBe('test-command');
        expect(exception.args).toEqual(['arg1', 'arg2']);
        expect(exception.name).toBe('CodexCLICommandException');
        expect(exception).toBeInstanceOf(CodexPresentationException);
      });

      it('should allow original error', () => {
        const originalError = new Error('Original error');
        const exception = new CodexCLICommandException(
          'CLI command failed',
          'test-command',
          ['arg1'],
          originalError
        );

        expect(exception.originalError).toBe(originalError);
      });
    });

    describe('CodexUserInterfaceException', () => {
      it('should include user interface details', () => {
        const exception = new CodexUserInterfaceException(
          'User interface operation failed',
          'displayMessage'
        );

        expect(exception.message).toBe('User interface operation failed');
        expect(exception.code).toBe('CODEX_USER_INTERFACE_ERROR');
        expect(exception.recoverable).toBe(true);
        expect(exception.operation).toBe('displayMessage');
        expect(exception.name).toBe('CodexUserInterfaceException');
        expect(exception).toBeInstanceOf(CodexPresentationException);
      });
    });

    describe('CodexOutputFormattingException', () => {
      it('should include output formatting details', () => {
        const data = { test: 'data' };
        const exception = new CodexOutputFormattingException(
          'Output formatting failed',
          OutputFormat.JSON,
          data
        );

        expect(exception.message).toBe('Output formatting failed');
        expect(exception.code).toBe('CODEX_OUTPUT_FORMATTING_ERROR');
        expect(exception.recoverable).toBe(false);
        expect(exception.format).toBe(OutputFormat.JSON);
        expect(exception.data).toBe(data);
        expect(exception.name).toBe('CodexOutputFormattingException');
        expect(exception).toBeInstanceOf(CodexPresentationException);
      });
    });
  });

  describe('CodexPresentationUtils', () => {
    describe('createDefaultCLIOptions', () => {
      it('should create default CLI options', () => {
        const options = CodexPresentationUtils.createDefaultCLIOptions();

        expect(options).toHaveLength(3);
        expect(options[0]?.name).toBe('help');
        expect(options[0]?.shortName).toBe('h');
        expect(options[0]?.type).toBe('boolean');
        expect(options[1]?.name).toBe('verbose');
        expect(options[1]?.shortName).toBe('v');
        expect(options[2]?.name).toBe('output');
        expect(options[2]?.choices).toEqual(['text', 'json', 'yaml', 'table', 'markdown']);
      });
    });

    describe('formatValidationResponse', () => {
      it('should format successful validation response', () => {
        const response: CodexValidationResponse = {
          result: CodexValidationResult.SUCCESS,
          version: '1.0.0',
          timestamp: new Date()
        };

        const formatted = CodexPresentationUtils.formatValidationResponse(response);
        expect(formatted).toBe('✓ Codex CLI validation successful (1.0.0)');
      });

      it('should format failed validation response', () => {
        const response: CodexValidationResponse = {
          result: CodexValidationResult.CLI_NOT_FOUND,
          errorMessage: 'CLI not found',
          timestamp: new Date()
        };

        const formatted = CodexPresentationUtils.formatValidationResponse(response);
        expect(formatted).toBe('✗ Codex CLI validation failed: CLI not found');
      });
    });

    describe('formatStatus', () => {
      it('should format status information', () => {
        const status: CodexStatus = {
          isInitialized: true,
          isConfigured: true,
          cliAvailable: true,
          templatesGenerated: true,
          lastValidation: new Date('2025-01-01T00:00:00Z'),
          errorCount: 0,
          status: CodexIntegrationStatus.VALIDATED
        };

        const formatted = CodexPresentationUtils.formatStatus(status);
        expect(formatted).toContain('Status: validated');
        expect(formatted).toContain('Initialized: Yes');
        expect(formatted).toContain('Configured: Yes');
        expect(formatted).toContain('CLI Available: Yes');
        expect(formatted).toContain('Templates Generated: Yes');
        expect(formatted).toContain('Error Count: 0');
        expect(formatted).toContain('Last Validation: 2025-01-01T00:00:00.000Z');
      });

      it('should format status without last validation', () => {
        const status: CodexStatus = {
          isInitialized: false,
          isConfigured: false,
          cliAvailable: false,
          templatesGenerated: false,
          errorCount: 1,
          status: CodexIntegrationStatus.NOT_INITIALIZED
        };

        const formatted = CodexPresentationUtils.formatStatus(status);
        expect(formatted).toContain('Status: not_initialized');
        expect(formatted).toContain('Initialized: No');
        expect(formatted).toContain('Error Count: 1');
        expect(formatted).not.toContain('Last Validation:');
      });
    });

    describe('createUserFriendlyError', () => {
      it('should create user-friendly error message', () => {
        const error: CodexError = {
          code: 'TEST_ERROR',
          message: 'Test error occurred',
          suggestions: ['Try again', 'Check configuration'],
          recoverable: true,
          timestamp: new Date()
        };

        const friendlyMessage = CodexPresentationUtils.createUserFriendlyError(error);
        expect(friendlyMessage).toContain('Error: Test error occurred');
        expect(friendlyMessage).toContain('Suggestions:');
        expect(friendlyMessage).toContain('• Try again');
        expect(friendlyMessage).toContain('• Check configuration');
        expect(friendlyMessage).toContain('This error is recoverable');
      });

      it('should create user-friendly error without suggestions', () => {
        const error: CodexError = {
          code: 'TEST_ERROR',
          message: 'Test error occurred',
          recoverable: false,
          timestamp: new Date()
        };

        const friendlyMessage = CodexPresentationUtils.createUserFriendlyError(error);
        expect(friendlyMessage).toContain('Error: Test error occurred');
        expect(friendlyMessage).not.toContain('Suggestions:');
        expect(friendlyMessage).not.toContain('This error is recoverable');
      });

      it('should create user-friendly error with empty suggestions', () => {
        const error: CodexError = {
          code: 'TEST_ERROR',
          message: 'Test error occurred',
          suggestions: [],
          recoverable: true,
          timestamp: new Date()
        };

        const friendlyMessage = CodexPresentationUtils.createUserFriendlyError(error);
        expect(friendlyMessage).toContain('Error: Test error occurred');
        expect(friendlyMessage).not.toContain('Suggestions:');
        expect(friendlyMessage).toContain('This error is recoverable');
      });
    });
  });
});
