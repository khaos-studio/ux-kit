/**
 * CodexCLIService
 * 
 * This service provides CLI interaction functionality for Codex,
 * implementing the ICodexCLIService interface.
 */

import { ICodexCLIService } from '../../contracts/infrastructure-contracts';
import { ICLIExecutionService } from '../../contracts/infrastructure-contracts';
import {
  CodexValidationResponse,
  CodexValidationResult
} from '../../contracts/domain-contracts';
import { CLIExecutionResult } from '../../contracts/infrastructure-contracts';
import * as os from 'os';

/**
 * Service for interacting with Codex CLI
 */
export class CodexCLIService implements ICodexCLIService {
  private readonly commandTimeout: number = 10000; // Default to 10 seconds

  constructor(private cliExecutionService: ICLIExecutionService) {}

  /**
   * Validate Codex CLI installation
   */
  async validateInstallation(): Promise<CodexValidationResponse> {
    try {
      // Check if Codex CLI is available
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return this.createErrorResponse(
          CodexValidationResult.CLI_NOT_FOUND,
          'Codex CLI is not installed or not available in system PATH.',
          [
            'Install Codex CLI',
            'Add Codex CLI to your system PATH environment variable',
            'Restart your terminal or IDE'
          ]
        );
      }

      // Test Codex CLI functionality
      const testResult = await this.cliExecutionService.executeCommand(
        'codex',
        ['--version'],
        {
          timeout: this.commandTimeout,
          captureOutput: true,
          captureError: true
        }
      );

      if (!testResult.success) {
        // Check for timeout (exit code 124 is common for timeout)
        if (testResult.exitCode === 124 || testResult.stderr.includes('timeout') || testResult.stderr.includes('timed out')) {
          return this.createErrorResponse(
            CodexValidationResult.UNKNOWN_ERROR,
            `Codex CLI validation timed out: ${testResult.stderr}`,
            [
              'Check system configuration',
              'Verify Codex CLI installation',
              'Try running the command manually'
            ],
            await this.getCLIPath(),
            await this.getVersion()
          );
        }

        // Check for permission denied
        if (testResult.exitCode === 13 || testResult.stderr.includes('Permission denied')) {
          return this.createErrorResponse(
            CodexValidationResult.PERMISSION_DENIED,
            'Permission denied when accessing Codex CLI',
            [
              'Check file permissions',
              'Run with appropriate privileges',
              'Verify user permissions'
            ],
            await this.getCLIPath(),
            await this.getVersion()
          );
        }

        // Default to CLI_INVALID for other failures
        return this.createErrorResponse(
          CodexValidationResult.CLI_INVALID,
          `Codex CLI is not working properly: ${testResult.stderr}`,
          [
            'Check Codex CLI installation',
            'Verify Codex CLI configuration',
            'Try reinstalling Codex CLI'
          ],
          await this.getCLIPath(),
          await this.getVersion()
        );
      }

      // Success case
      const response: CodexValidationResponse = {
        result: CodexValidationResult.SUCCESS,
        timestamp: new Date()
      };

      const cliPath = await this.getCLIPath();
      const version = await this.getVersion();

      if (cliPath) {
        (response as any).cliPath = cliPath;
      }

      if (version) {
        (response as any).version = version;
      }

      return response;

    } catch (error) {
      return this.createErrorResponse(
        CodexValidationResult.UNKNOWN_ERROR,
        `Unexpected error during validation: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [
          'Check system configuration',
          'Verify Codex CLI installation',
          'Try running the command manually'
        ],
        await this.getCLIPath(),
        await this.getVersion()
      );
    }
  }

  /**
   * Get Codex CLI version
   */
  async getVersion(): Promise<string | null> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return null;
      }

      const result = await this.cliExecutionService.executeCommand(
        'codex',
        ['--version'],
        {
          timeout: this.commandTimeout,
          captureOutput: true
        }
      );

      if (result.success && result.stdout) {
        const versionMatch = result.stdout.match(/(\d+\.\d+\.\d+)/);
        return versionMatch?.[1] || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Execute Codex command
   */
  async executeCodexCommand(command: string, args: readonly string[]): Promise<CLIExecutionResult> {
    const isAvailable = await this.isAvailable();
    if (!isAvailable) {
      throw new Error('Codex CLI is not available');
    }

    const fullArgs = [command, ...args];
    return await this.cliExecutionService.executeCommand(
      'codex',
      fullArgs,
      {
        timeout: this.commandTimeout,
        captureOutput: true,
        captureError: true
      }
    );
  }

  /**
   * Check if Codex CLI is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      return await this.cliExecutionService.isCommandAvailable('codex');
    } catch (error) {
      return false;
    }
  }

  /**
   * Get Codex CLI path
   */
  async getCLIPath(): Promise<string | null> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return null;
      }

      const command = os.platform() === 'win32' ? 'where' : 'which';
      const result = await this.cliExecutionService.executeCommand(command, ['codex'], {
        timeout: this.commandTimeout,
        captureOutput: true
      });

      if (result.success && result.stdout) {
        const paths = result.stdout.trim().split(os.EOL);
        return paths[0] || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Create error response for validation
   */
  private createErrorResponse(
    result: CodexValidationResult,
    errorMessage: string,
    suggestions: string[] = [],
    cliPath?: string | null,
    version?: string | null
  ): CodexValidationResponse {
    const response: CodexValidationResponse = {
      result,
      errorMessage,
      suggestions,
      timestamp: new Date()
    };

    if (cliPath) {
      (response as any).cliPath = cliPath;
    }

    if (version) {
      (response as any).version = version;
    }

    return response;
  }
}
