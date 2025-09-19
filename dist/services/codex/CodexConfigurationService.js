"use strict";
/**
 * CodexConfigurationService
 *
 * This service provides configuration management functionality for Codex,
 * implementing the IConfigurationService interface.
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
exports.CodexConfigurationService = void 0;
const path = __importStar(require("path"));
/**
 * Service for managing Codex configuration
 */
class CodexConfigurationService {
    constructor(fileSystemService) {
        this.fileSystemService = fileSystemService;
    }
    /**
     * Load configuration from file
     */
    async loadConfiguration(filePath) {
        try {
            // Check if file exists
            const fileExists = await this.fileSystemService.fileExists(filePath);
            if (!fileExists) {
                throw new Error('Configuration file not found');
            }
            // Read file content
            const content = await this.fileSystemService.readFile(filePath);
            // Parse JSON
            let configData;
            try {
                configData = JSON.parse(content);
            }
            catch (error) {
                throw new Error('Invalid configuration file format');
            }
            // Validate configuration
            const isValid = await this.validateConfiguration(configData);
            if (!isValid) {
                throw new Error('Invalid configuration');
            }
            return configData;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Failed to load configuration: ${error}`);
        }
    }
    /**
     * Save configuration to file
     */
    async saveConfiguration(config, filePath) {
        try {
            // Validate configuration
            const isValid = await this.validateConfiguration(config);
            if (!isValid) {
                throw new Error('Invalid configuration');
            }
            // Create directory if it doesn't exist
            const dirPath = path.dirname(filePath);
            const dirExists = await this.fileSystemService.directoryExists(dirPath);
            if (!dirExists) {
                await this.fileSystemService.createDirectory(dirPath);
            }
            // Write configuration to file
            const content = JSON.stringify(config, null, 2);
            await this.fileSystemService.writeFile(filePath, content);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Failed to save configuration: ${error}`);
        }
    }
    /**
     * Validate configuration
     */
    async validateConfiguration(config) {
        try {
            // Check if config is an object
            if (!config || typeof config !== 'object') {
                return false;
            }
            // Check required fields
            if (typeof config.enabled !== 'boolean') {
                return false;
            }
            if (typeof config.validationEnabled !== 'boolean') {
                return false;
            }
            if (typeof config.fallbackToCustom !== 'boolean') {
                return false;
            }
            if (typeof config.templatePath !== 'string' || config.templatePath.trim() === '') {
                return false;
            }
            if (typeof config.timeout !== 'number' || config.timeout <= 0) {
                return false;
            }
            // Check optional CLI path if provided
            if (config.cliPath !== undefined) {
                if (typeof config.cliPath !== 'string' || config.cliPath.trim() === '') {
                    return false;
                }
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Get default configuration
     */
    getDefaultConfiguration() {
        return {
            enabled: true,
            validationEnabled: true,
            fallbackToCustom: false,
            templatePath: '.codex/templates',
            timeout: 10000
        };
    }
    /**
     * Merge configurations
     */
    mergeConfigurations(base, override) {
        const result = {
            enabled: override.enabled !== undefined ? override.enabled : base.enabled,
            validationEnabled: override.validationEnabled !== undefined ? override.validationEnabled : base.validationEnabled,
            fallbackToCustom: override.fallbackToCustom !== undefined ? override.fallbackToCustom : base.fallbackToCustom,
            templatePath: override.templatePath !== undefined ? override.templatePath : base.templatePath,
            timeout: override.timeout !== undefined ? override.timeout : base.timeout
        };
        if ('cliPath' in override) {
            result.cliPath = override.cliPath;
        }
        else if (base.cliPath !== undefined) {
            result.cliPath = base.cliPath;
        }
        return result;
    }
}
exports.CodexConfigurationService = CodexConfigurationService;
//# sourceMappingURL=CodexConfigurationService.js.map