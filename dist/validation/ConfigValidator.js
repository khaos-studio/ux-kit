"use strict";
/**
 * Config Validator
 *
 * Validates UX-Kit configuration files and objects.
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
exports.ConfigValidator = void 0;
const ValidationResult_1 = require("./ValidationResult");
const yaml = __importStar(require("js-yaml"));
class ConfigValidator {
    constructor() {
        this.validProviders = ['cursor', 'codex', 'claude', 'gpt'];
        this.validFormats = ['markdown', 'json', 'yaml'];
        this.versionPattern = /^\d+\.\d+\.\d+$/;
    }
    /**
     * Validate configuration object
     */
    validateConfig(config) {
        const errors = [];
        if (!config || typeof config !== 'object') {
            errors.push('Configuration must be an object');
            return (0, ValidationResult_1.createErrorResult)(errors);
        }
        // Validate version
        if (!config.version) {
            errors.push('Version is required');
        }
        else if (!this.versionPattern.test(config.version)) {
            errors.push('Invalid version format');
        }
        // Validate aiAgent
        if (!config.aiAgent) {
            errors.push('aiAgent is required');
        }
        else {
            const aiAgentErrors = this.validateAiAgent(config.aiAgent);
            errors.push(...aiAgentErrors);
        }
        // Validate storage
        if (!config.storage) {
            errors.push('storage is required');
        }
        else {
            const storageErrors = this.validateStorage(config.storage);
            errors.push(...storageErrors);
        }
        // Validate research (optional)
        if (config.research) {
            const researchErrors = this.validateResearch(config.research);
            errors.push(...researchErrors);
        }
        return errors.length === 0 ? (0, ValidationResult_1.createSuccessResult)() : (0, ValidationResult_1.createErrorResult)(errors);
    }
    /**
     * Validate YAML configuration
     */
    validateYamlConfig(yamlContent) {
        const errors = [];
        try {
            const config = yaml.load(yamlContent);
            return this.validateConfig(config);
        }
        catch (error) {
            errors.push(`Invalid YAML: ${error.message}`);
            return (0, ValidationResult_1.createErrorResult)(errors);
        }
    }
    /**
     * Validate AI agent configuration
     */
    validateAiAgent(aiAgent) {
        const errors = [];
        if (!aiAgent.provider) {
            errors.push('AI agent provider is required');
        }
        else if (!this.validProviders.includes(aiAgent.provider)) {
            errors.push('Invalid AI agent provider');
        }
        if (aiAgent.settings && typeof aiAgent.settings !== 'object') {
            errors.push('AI agent settings must be an object');
        }
        return errors;
    }
    /**
     * Validate storage configuration
     */
    validateStorage(storage) {
        const errors = [];
        if (!storage.basePath) {
            errors.push('Storage base path is required');
        }
        else if (typeof storage.basePath !== 'string') {
            errors.push('Storage base path must be a string');
        }
        if (!storage.format) {
            errors.push('Storage format is required');
        }
        else if (!this.validFormats.includes(storage.format)) {
            errors.push('Invalid storage format');
        }
        return errors;
    }
    /**
     * Validate research configuration
     */
    validateResearch(research) {
        const errors = [];
        if (research.defaultTemplates && typeof research.defaultTemplates !== 'object') {
            errors.push('Default templates must be an object');
        }
        if (research.autoSave !== undefined && typeof research.autoSave !== 'boolean') {
            errors.push('Auto save must be a boolean');
        }
        return errors;
    }
    /**
     * Validate configuration file path
     */
    validateConfigFilePath(filePath) {
        const errors = [];
        if (!filePath || filePath.trim().length === 0) {
            errors.push('Configuration file path is required');
        }
        else if (!filePath.endsWith('.yaml') && !filePath.endsWith('.yml')) {
            errors.push('Configuration file must have .yaml or .yml extension');
        }
        return errors.length === 0 ? (0, ValidationResult_1.createSuccessResult)() : (0, ValidationResult_1.createErrorResult)(errors);
    }
    /**
     * Validate configuration schema version
     */
    validateSchemaVersion(version) {
        const errors = [];
        if (!version) {
            errors.push('Schema version is required');
        }
        else if (!this.versionPattern.test(version)) {
            errors.push('Invalid schema version format');
        }
        else {
            const parts = version.split('.').map(Number);
            const major = parts[0] || 0;
            const minor = parts[1] || 0;
            if (major < 1 || (major === 1 && minor < 0)) {
                errors.push('Schema version must be 1.0.0 or higher');
            }
        }
        return errors.length === 0 ? (0, ValidationResult_1.createSuccessResult)() : (0, ValidationResult_1.createErrorResult)(errors);
    }
    /**
     * Get default configuration
     */
    getDefaultConfig() {
        return {
            version: '1.0.0',
            aiAgent: {
                provider: 'cursor',
                settings: {}
            },
            storage: {
                basePath: './.uxkit/studies',
                format: 'markdown'
            },
            research: {
                defaultTemplates: {
                    questions: 'questions-template.md',
                    sources: 'sources-template.md',
                    summarize: 'summarize-template.md',
                    interview: 'interview-template.md',
                    synthesize: 'synthesis-template.md'
                },
                autoSave: true
            }
        };
    }
    /**
     * Merge configuration with defaults
     */
    mergeWithDefaults(config) {
        const defaults = this.getDefaultConfig();
        return {
            ...defaults,
            ...config,
            aiAgent: {
                ...defaults.aiAgent,
                ...config.aiAgent,
                settings: {
                    ...defaults.aiAgent.settings,
                    ...config.aiAgent?.settings
                }
            },
            storage: {
                ...defaults.storage,
                ...config.storage
            },
            research: {
                ...defaults.research,
                ...config.research,
                defaultTemplates: {
                    ...defaults.research?.defaultTemplates,
                    ...config.research?.defaultTemplates
                }
            }
        };
    }
}
exports.ConfigValidator = ConfigValidator;
//# sourceMappingURL=ConfigValidator.js.map