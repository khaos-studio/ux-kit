"use strict";
/**
 * CodexCLIService
 *
 * This service provides CLI interaction functionality for Codex,
 * implementing the ICodexCLIService interface.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodexCLIService = void 0;
const domain_contracts_1 = require("../../contracts/domain-contracts");
const os = __importStar(require("os"));
/**
 * Service for interacting with Codex CLI
 */
class CodexCLIService {
    constructor(cliExecutionService) {
        this.cliExecutionService = cliExecutionService;
        this.commandTimeout = 10000; // Default to 10 seconds
    }
    /**
     * Validate Codex CLI installation
     */
    async validateInstallation() {
        try {
            // Check if Codex CLI is available
            const isAvailable = await this.isAvailable();
            if (!isAvailable) {
                return this.createErrorResponse(domain_contracts_1.CodexValidationResult.CLI_NOT_FOUND, 'Codex CLI is not installed or not available in system PATH.', [
                    'Install Codex CLI',
                    'Add Codex CLI to your system PATH environment variable',
                    'Restart your terminal or IDE'
                ]);
            }
            // Test Codex CLI functionality
            const testResult = await this.cliExecutionService.executeCommand('codex', ['--version'], {
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
                    ], await this.getCLIPath(), await this.getVersion());
                }
                // Check for permission denied
                if (testResult.exitCode === 13 || testResult.stderr.includes('Permission denied')) {
                    return this.createErrorResponse(domain_contracts_1.CodexValidationResult.PERMISSION_DENIED, 'Permission denied when accessing Codex CLI', [
                        'Check file permissions',
                        'Run with appropriate privileges',
                        'Verify user permissions'
                    ], await this.getCLIPath(), await this.getVersion());
                }
                // Default to CLI_INVALID for other failures
                return this.createErrorResponse(domain_contracts_1.CodexValidationResult.CLI_INVALID, `Codex CLI is not working properly: ${testResult.stderr}`, [
                    'Check Codex CLI installation',
                    'Verify Codex CLI configuration',
                    'Try reinstalling Codex CLI'
                ], await this.getCLIPath(), await this.getVersion());
            }
            // Success case
            const response = {
                result: domain_contracts_1.CodexValidationResult.SUCCESS,
                timestamp: new Date()
            };
            const cliPath = await this.getCLIPath();
            const version = await this.getVersion();
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
            ], await this.getCLIPath(), await this.getVersion());
        }
    }
    /**
     * Get Codex CLI version
     */
    async getVersion() {
        try {
            const isAvailable = await this.isAvailable();
            if (!isAvailable) {
                return null;
            }
            const result = await this.cliExecutionService.executeCommand('codex', ['--version'], {
                timeout: this.commandTimeout,
                captureOutput: true
            });
            if (result.success && result.stdout) {
                const versionMatch = result.stdout.match(/(\d+\.\d+\.\d+)/);
                return versionMatch?.[1] || null;
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Execute Codex command
     */
    async executeCodexCommand(command, args) {
        const isAvailable = await this.isAvailable();
        if (!isAvailable) {
            throw new Error('Codex CLI is not available');
        }
        const fullArgs = [command, ...args];
        return await this.cliExecutionService.executeCommand('codex', fullArgs, {
            timeout: this.commandTimeout,
            captureOutput: true,
            captureError: true
        });
    }
    /**
     * Check if Codex CLI is available
     */
    async isAvailable() {
        try {
            return await this.cliExecutionService.isCommandAvailable('codex');
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Get Codex CLI path
     */
    async getCLIPath() {
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
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Create error response for validation
     */
    createErrorResponse(result, errorMessage, suggestions = [], cliPath, version) {
        const response = {
            result,
            errorMessage,
            suggestions,
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
}
exports.CodexCLIService = CodexCLIService;
//# sourceMappingURL=CodexCLIService.js.map