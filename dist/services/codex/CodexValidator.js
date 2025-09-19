"use strict";
/**
 * CodexValidator Service
 *
 * This service provides validation functionality for Codex CLI installation
 * and configuration, implementing the ICodexValidator interface.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodexValidator = void 0;
const domain_contracts_1 = require("../../contracts/domain-contracts");
/**
 * Service for validating Codex CLI installation and configuration
 */
class CodexValidator {
    constructor(cliService) {
        this.commandTimeout = 10000; // 10 seconds
        this.cliService = cliService;
    }
    /**
     * Validate Codex CLI installation and configuration
     */
    async validateCodexCLI() {
        try {
            // Check if Codex CLI is available
            const isAvailable = await this.cliService.isCommandAvailable('codex');
            if (!isAvailable) {
                return this.createErrorResponse(domain_contracts_1.CodexValidationResult.CLI_NOT_FOUND, 'Codex CLI is not installed or not available in PATH', [
                    'Install Codex CLI',
                    'Add Codex CLI to your PATH',
                    'Verify Codex CLI installation'
                ]);
            }
            // Get Codex CLI path
            const cliPath = await this.getCodexPath();
            // Get Codex CLI version
            const version = await this.getCodexVersion();
            // Test Codex CLI functionality
            const testResult = await this.cliService.executeCommand('codex', ['--version'], {
                timeout: this.commandTimeout,
                captureOutput: true,
                captureError: true
            });
            if (!testResult.success) {
                // Check for timeout (exit code 124 is common for timeout)
                if (testResult.exitCode === 124 || testResult.stderr.includes('timeout') || testResult.stderr.includes('timed out')) {
                    return this.createErrorResponse(domain_contracts_1.CodexValidationResult.UNKNOWN_ERROR, `Codex CLI validation timed out: ${testResult.stderr}`, [
                        'Check system configuration',
                        'Verify Codex CLI installation',
                        'Try running the command manually'
                    ]);
                }
                // Check for permission denied
                if (testResult.exitCode === 13 || testResult.stderr.includes('Permission denied')) {
                    return this.createErrorResponse(domain_contracts_1.CodexValidationResult.PERMISSION_DENIED, 'Permission denied when accessing Codex CLI', [
                        'Check file permissions',
                        'Run with appropriate privileges',
                        'Verify user permissions'
                    ]);
                }
                // Default to CLI_INVALID for other failures
                return this.createErrorResponse(domain_contracts_1.CodexValidationResult.CLI_INVALID, `Codex CLI is not working properly: ${testResult.stderr}`, [
                    'Check Codex CLI installation',
                    'Verify Codex CLI configuration',
                    'Try reinstalling Codex CLI'
                ]);
            }
            // Success case
            const response = {
                result: domain_contracts_1.CodexValidationResult.SUCCESS,
                timestamp: new Date()
            };
            if (cliPath) {
                response.cliPath = cliPath;
            }
            if (version) {
                response.version = version;
            }
            return response;
        }
        catch (error) {
            return this.createErrorResponse(domain_contracts_1.CodexValidationResult.UNKNOWN_ERROR, `Unexpected error during validation: ${error instanceof Error ? error.message : 'Unknown error'}`, [
                'Check system configuration',
                'Verify Codex CLI installation',
                'Try running the command manually'
            ]);
        }
    }
    /**
     * Quick check for Codex CLI availability
     */
    async isCodexAvailable() {
        try {
            return await this.cliService.isCommandAvailable('codex');
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Find Codex CLI executable path
     */
    async getCodexPath() {
        try {
            const command = process.platform === 'win32' ? 'where' : 'which';
            const result = await this.cliService.executeCommand(command, ['codex'], {
                timeout: this.commandTimeout,
                captureOutput: true,
                captureError: true
            });
            if (result.success && result.stdout.trim()) {
                return result.stdout.trim();
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Get Codex CLI version information
     */
    async getCodexVersion() {
        try {
            return await this.cliService.getCommandVersion('codex');
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Create error response with suggestions
     */
    createErrorResponse(result, errorMessage, suggestions) {
        return {
            result,
            errorMessage,
            suggestions,
            timestamp: new Date()
        };
    }
}
exports.CodexValidator = CodexValidator;
//# sourceMappingURL=CodexValidator.js.map