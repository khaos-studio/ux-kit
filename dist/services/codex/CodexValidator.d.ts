/**
 * CodexValidator Service
 *
 * This service provides validation functionality for Codex CLI installation
 * and configuration, implementing the ICodexValidator interface.
 */
import { ICodexValidator } from '../../contracts/domain-contracts';
import { ICLIExecutionService } from '../../contracts/infrastructure-contracts';
import { CodexValidationResponse } from '../../contracts/domain-contracts';
/**
 * Service for validating Codex CLI installation and configuration
 */
export declare class CodexValidator implements ICodexValidator {
    private readonly cliService;
    private readonly commandTimeout;
    constructor(cliService: ICLIExecutionService);
    /**
     * Validate Codex CLI installation and configuration
     */
    validateCodexCLI(): Promise<CodexValidationResponse>;
    /**
     * Quick check for Codex CLI availability
     */
    isCodexAvailable(): Promise<boolean>;
    /**
     * Find Codex CLI executable path
     */
    getCodexPath(): Promise<string | null>;
    /**
     * Get Codex CLI version information
     */
    getCodexVersion(): Promise<string | null>;
    /**
     * Create error response with suggestions
     */
    private createErrorResponse;
}
