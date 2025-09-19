/**
 * CLI Execution Service
 * 
 * Simple implementation for executing CLI commands.
 */

import { ICLIExecutionService, CLIExecutionResult, CLIExecutionOptions } from '../contracts/infrastructure-contracts';
import { spawn } from 'child_process';

export class CLIExecutionService implements ICLIExecutionService {
  /**
   * Execute a CLI command
   */
  async executeCommand(
    command: string,
    args: readonly string[],
    options?: CLIExecutionOptions
  ): Promise<CLIExecutionResult> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const timeout = options?.timeout || 30000;
      const captureOutput = options?.captureOutput !== false;
      const captureError = options?.captureError !== false;

      let stdout = '';
      let stderr = '';
      let isResolved = false;

      const child = spawn(command, args, {
        stdio: captureOutput ? 'pipe' : 'inherit'
      });

      // Set up timeout
      const timeoutId = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          child.kill('SIGTERM');
          reject(new Error(`Command timeout after ${timeout}ms`));
        }
      }, timeout);

      // Capture output
      if (captureOutput && child.stdout) {
        child.stdout.on('data', (data) => {
          stdout += data.toString();
        });
      }

      if (captureError && child.stderr) {
        child.stderr.on('data', (data) => {
          stderr += data.toString();
        });
      }

      // Handle process completion
      child.on('close', (code) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId);
          
          resolve({
            success: code === 0,
            exitCode: code || 0,
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            executionTime: Date.now() - startTime
          });
        }
      });

      child.on('error', (error) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId);
          reject(error);
        }
      });
    });
  }

  /**
   * Check if a command is available
   */
  async isCommandAvailable(command: string): Promise<boolean> {
    try {
      const result = await this.executeCommand(command, ['--version'], {
        timeout: 5000,
        captureOutput: true,
        captureError: true
      });
      return result.success;
    } catch (error) {
      // Try alternative check
      try {
        const result = await this.executeCommand('which', [command], {
          timeout: 5000,
          captureOutput: true,
          captureError: true
        });
        return result.success && result.stdout.trim() !== '';
      } catch (altError) {
        return false;
      }
    }
  }

  /**
   * Get command version
   */
  async getCommandVersion(command: string): Promise<string | null> {
    try {
      const result = await this.executeCommand(command, ['--version'], {
        timeout: 5000,
        captureOutput: true,
        captureError: true
      });
      if (result.success && result.stdout) {
        return result.stdout.trim();
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Execute command with timeout
   */
  async executeCommandWithTimeout(
    command: string,
    args: readonly string[],
    timeout: number
  ): Promise<CLIExecutionResult> {
    return this.executeCommand(command, args, { timeout });
  }
}
