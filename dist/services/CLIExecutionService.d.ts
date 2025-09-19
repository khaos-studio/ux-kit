/**
 * CLI Execution Service
 *
 * Simple implementation for executing CLI commands.
 */
import { ICLIExecutionService, CLIExecutionResult, CLIExecutionOptions } from '../contracts/infrastructure-contracts';
export declare class CLIExecutionService implements ICLIExecutionService {
    /**
     * Execute a CLI command
     */
    executeCommand(command: string, args: readonly string[], options?: CLIExecutionOptions): Promise<CLIExecutionResult>;
    /**
     * Check if a command is available
     */
    isCommandAvailable(command: string): Promise<boolean>;
    /**
     * Get command version
     */
    getCommandVersion(command: string): Promise<string | null>;
    /**
     * Execute command with timeout
     */
    executeCommandWithTimeout(command: string, args: readonly string[], timeout: number): Promise<CLIExecutionResult>;
}
