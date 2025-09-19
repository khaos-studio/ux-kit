/**
 * CodexCLIService
 *
 * This service provides CLI interaction functionality for Codex,
 * implementing the ICodexCLIService interface.
 */
import { ICodexCLIService } from '../../contracts/infrastructure-contracts';
import { ICLIExecutionService } from '../../contracts/infrastructure-contracts';
import { CodexValidationResponse } from '../../contracts/domain-contracts';
import { CLIExecutionResult } from '../../contracts/infrastructure-contracts';
/**
 * Service for interacting with Codex CLI
 */
export declare class CodexCLIService implements ICodexCLIService {
    private cliExecutionService;
    private readonly commandTimeout;
    constructor(cliExecutionService: ICLIExecutionService);
    /**
     * Validate Codex CLI installation
     */
    validateInstallation(): Promise<CodexValidationResponse>;
    /**
     * Get Codex CLI version
     */
    getVersion(): Promise<string | null>;
    /**
     * Execute Codex command
     */
    executeCodexCommand(command: string, args: readonly string[]): Promise<CLIExecutionResult>;
    /**
     * Check if Codex CLI is available
     */
    isAvailable(): Promise<boolean>;
    /**
     * Get Codex CLI path
     */
    getCLIPath(): Promise<string | null>;
    /**
     * Create error response for validation
     */
    private createErrorResponse;
}
