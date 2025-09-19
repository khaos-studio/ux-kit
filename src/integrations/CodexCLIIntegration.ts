/**
 * Codex CLI Integration
 * 
 * Integrates Codex CLI service with existing CLI infrastructure,
 * providing command execution, error handling, logging, and performance tracking.
 */

import { ICLIExecutionService } from '../contracts/infrastructure-contracts';
import { ICodexCLIService } from '../contracts/infrastructure-contracts';
import { IErrorHandlingService } from '../contracts/infrastructure-contracts';
import { CLIExecutionResult, CLIExecutionOptions } from '../contracts/infrastructure-contracts';
import { CodexValidationResponse, CodexValidationResult, CodexCommandTemplate } from '../contracts/domain-contracts';

/**
 * Result of Codex CLI command execution
 */
export interface CodexCLIExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
  logs?: {
    command: string;
    executionTime: number;
    timestamp: Date;
  };
  performanceMetrics?: {
    optimized?: boolean;
    concurrent?: boolean;
  };
  suggestions?: string[] | undefined;
}

/**
 * Codex CLI Integration service
 */
export class CodexCLIIntegration {
  constructor(
    private cliExecutionService: ICLIExecutionService,
    private codexCLIService: ICodexCLIService,
    private errorHandlingService: IErrorHandlingService
  ) {}

  /**
   * Execute a Codex CLI command
   */
  async executeCodexCommand(
    command: string, 
    args: string[], 
    options?: CLIExecutionOptions
  ): Promise<CodexCLIExecutionResult> {
    const startTime = Date.now();
    
    try {
      // Execute the command using the CLI execution service
      const result = await this.cliExecutionService.executeCommand(command, args, options);
      const executionTime = Date.now() - startTime;

      if (result.success) {
        return {
          success: true,
          output: result.stdout,
          executionTime: result.executionTime || executionTime,
          logs: {
            command: `${command} ${args.join(' ')}`,
            executionTime: result.executionTime || executionTime,
            timestamp: new Date()
          },
          performanceMetrics: {
            optimized: (result.executionTime || executionTime) < (options?.timeout || 30000) / 2
          }
        };
      } else {
        // Handle CLI execution error
        const error = this.errorHandlingService.handleCLIExecutionError(
          new Error(result.stderr || 'Command execution failed'),
          `${command} ${args.join(' ')}`
        );

        return {
          success: false,
          error: this.errorHandlingService.createUserFriendlyError(error),
          executionTime: result.executionTime || executionTime,
          suggestions: error.suggestions ? [...error.suggestions] : undefined
        };
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      // Handle unexpected errors
      const handledError = this.errorHandlingService.handleCLIExecutionError(
        error instanceof Error ? error : new Error('Unknown error'),
        `${command} ${args.join(' ')}`
      );

      return {
        success: false,
        error: this.errorHandlingService.createUserFriendlyError(handledError),
        executionTime,
        suggestions: handledError.suggestions ? [...handledError.suggestions] : undefined
      };
    }
  }

  /**
   * Execute a Codex CLI command with timeout
   */
  async executeCodexCommandWithTimeout(
    command: string,
    args: string[],
    timeout: number
  ): Promise<CodexCLIExecutionResult> {
    const startTime = Date.now();
    
    try {
      // Execute the command with timeout
      const result = await this.cliExecutionService.executeCommandWithTimeout(command, args, timeout);
      const executionTime = Date.now() - startTime;

      if (result.success) {
        return {
          success: true,
          output: result.stdout,
          executionTime: result.executionTime || executionTime,
          logs: {
            command: `${command} ${args.join(' ')}`,
            executionTime: result.executionTime || executionTime,
            timestamp: new Date()
          },
          performanceMetrics: {
            optimized: (result.executionTime || executionTime) < timeout / 2
          }
        };
      } else {
        // Handle timeout or execution error
        const error = this.errorHandlingService.handleCLIExecutionError(
          new Error(result.stderr || 'Command execution failed'),
          `${command} ${args.join(' ')}`
        );

        return {
          success: false,
          error: this.errorHandlingService.createUserFriendlyError(error),
          executionTime: result.executionTime || executionTime,
          suggestions: error.suggestions ? [...error.suggestions] : undefined
        };
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      // Handle timeout or unexpected errors
      const handledError = this.errorHandlingService.handleCLIExecutionError(
        error instanceof Error ? error : new Error('Unknown error'),
        `${command} ${args.join(' ')}`
      );

      return {
        success: false,
        error: this.errorHandlingService.createUserFriendlyError(handledError),
        executionTime,
        suggestions: handledError.suggestions ? [...handledError.suggestions] : undefined
      };
    }
  }

  /**
   * Validate Codex CLI installation
   */
  async validateCodexInstallation(): Promise<CodexCLIExecutionResult> {
    try {
      const validationResponse = await this.codexCLIService.validateInstallation();
      
      if (validationResponse.result === CodexValidationResult.SUCCESS) {
        return {
          success: true,
          output: `Codex CLI validated successfully. Version: ${validationResponse.version || 'Unknown'}`,
          logs: {
            command: 'codex validation',
            executionTime: 0,
            timestamp: new Date()
          }
        };
      } else {
        return {
          success: false,
          error: validationResponse.errorMessage || 'Codex CLI validation failed',
          suggestions: validationResponse.suggestions ? [...validationResponse.suggestions] : undefined
        };
      }
    } catch (error) {
      const handledError = this.errorHandlingService.handleValidationError(
        error instanceof Error ? error : new Error('Validation failed'),
        'Codex CLI installation'
      );

      return {
        success: false,
        error: this.errorHandlingService.createUserFriendlyError(handledError),
        suggestions: handledError.suggestions ? [...handledError.suggestions] : undefined
      };
    }
  }

  /**
   * Generate a Codex command template
   */
  async generateCommandTemplate(template: CodexCommandTemplate): Promise<CodexCLIExecutionResult> {
    try {
      // Extract command and arguments from template
      const commandParts = template.command.split(' ');
      const command = commandParts[0] || 'codex';
      const args = commandParts.slice(1);

      // Add parameters as arguments
      const parameterArgs = template.parameters
        .filter(param => param.required)
        .map(param => `--${param.name}`);

      const allArgs = [...args, ...parameterArgs];

      // Execute the command using Codex CLI service
      const result = await this.codexCLIService.executeCodexCommand(command, allArgs);
      
      if (result.success) {
        return {
          success: true,
          output: result.stdout,
          executionTime: result.executionTime,
          logs: {
            command: template.command,
            executionTime: result.executionTime,
            timestamp: new Date()
          }
        };
      } else {
        // Handle template generation error
        const error = this.errorHandlingService.handleCLIExecutionError(
          new Error(result.stderr || 'Template generation failed'),
          template.command
        );

        return {
          success: false,
          error: this.errorHandlingService.createUserFriendlyError(error),
          executionTime: result.executionTime,
          suggestions: error.suggestions ? [...error.suggestions] : undefined
        };
      }
    } catch (error) {
      const handledError = this.errorHandlingService.handleCLIExecutionError(
        error instanceof Error ? error : new Error('Template generation failed'),
        template.command
      );

      return {
        success: false,
        error: this.errorHandlingService.createUserFriendlyError(handledError),
        suggestions: handledError.suggestions ? [...handledError.suggestions] : undefined
      };
    }
  }

  /**
   * Check if Codex CLI is available
   */
  async isCodexAvailable(): Promise<boolean> {
    try {
      return await this.codexCLIService.isAvailable();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get Codex CLI version
   */
  async getCodexVersion(): Promise<string | null> {
    try {
      return await this.codexCLIService.getVersion();
    } catch (error) {
      return null;
    }
  }

  /**
   * Get Codex CLI path
   */
  async getCodexPath(): Promise<string | null> {
    try {
      return await this.codexCLIService.getCLIPath();
    } catch (error) {
      return null;
    }
  }

  /**
   * Execute multiple Codex CLI commands concurrently
   */
  async executeConcurrentCommands(
    commands: Array<{ command: string; args: string[]; options?: CLIExecutionOptions }>
  ): Promise<CodexCLIExecutionResult[]> {
    try {
      const results = await Promise.all(
        commands.map(cmd => this.executeCodexCommand(cmd.command, cmd.args, cmd.options))
      );

      // Mark results as concurrent
      results.forEach(result => {
        if (result.performanceMetrics) {
          result.performanceMetrics.concurrent = true;
        }
      });

      return results;
    } catch (error) {
      const handledError = this.errorHandlingService.handleCLIExecutionError(
        error instanceof Error ? error : new Error('Concurrent execution failed'),
        'multiple commands'
      );

      return [{
        success: false,
        error: this.errorHandlingService.createUserFriendlyError(handledError),
        suggestions: handledError.suggestions ? [...handledError.suggestions] : undefined
      }];
    }
  }

  /**
   * Get performance metrics for Codex CLI commands
   */
  getPerformanceMetrics(): {
    totalExecutions: number;
    averageExecutionTime: number;
    successRate: number;
    errorRate: number;
  } {
    // This would typically be implemented with actual metrics collection
    // For now, return mock data
    return {
      totalExecutions: 0,
      averageExecutionTime: 0,
      successRate: 0,
      errorRate: 0
    };
  }

  /**
   * Reset performance metrics
   */
  resetPerformanceMetrics(): void {
    // This would typically reset actual metrics collection
    // For now, it's a no-op
  }
}
