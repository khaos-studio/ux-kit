/**
 * Codex CLI Integration
 *
 * Integrates Codex CLI service with existing CLI infrastructure,
 * providing command execution, error handling, logging, and performance tracking.
 */
import { ICLIExecutionService } from '../contracts/infrastructure-contracts';
import { ICodexCLIService } from '../contracts/infrastructure-contracts';
import { IErrorHandlingService } from '../contracts/infrastructure-contracts';
import { CLIExecutionOptions } from '../contracts/infrastructure-contracts';
import { CodexCommandTemplate } from '../contracts/domain-contracts';
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
export declare class CodexCLIIntegration {
    private cliExecutionService;
    private codexCLIService;
    private errorHandlingService;
    constructor(cliExecutionService: ICLIExecutionService, codexCLIService: ICodexCLIService, errorHandlingService: IErrorHandlingService);
    /**
     * Execute a Codex CLI command
     */
    executeCodexCommand(command: string, args: string[], options?: CLIExecutionOptions): Promise<CodexCLIExecutionResult>;
    /**
     * Execute a Codex CLI command with timeout
     */
    executeCodexCommandWithTimeout(command: string, args: string[], timeout: number): Promise<CodexCLIExecutionResult>;
    /**
     * Validate Codex CLI installation
     */
    validateCodexInstallation(): Promise<CodexCLIExecutionResult>;
    /**
     * Generate a Codex command template
     */
    generateCommandTemplate(template: CodexCommandTemplate): Promise<CodexCLIExecutionResult>;
    /**
     * Check if Codex CLI is available
     */
    isCodexAvailable(): Promise<boolean>;
    /**
     * Get Codex CLI version
     */
    getCodexVersion(): Promise<string | null>;
    /**
     * Get Codex CLI path
     */
    getCodexPath(): Promise<string | null>;
    /**
     * Execute multiple Codex CLI commands concurrently
     */
    executeConcurrentCommands(commands: Array<{
        command: string;
        args: string[];
        options?: CLIExecutionOptions;
    }>): Promise<CodexCLIExecutionResult[]>;
    /**
     * Get performance metrics for Codex CLI commands
     */
    getPerformanceMetrics(): {
        totalExecutions: number;
        averageExecutionTime: number;
        successRate: number;
        errorRate: number;
    };
    /**
     * Reset performance metrics
     */
    resetPerformanceMetrics(): void;
}
