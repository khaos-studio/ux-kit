"use strict";
/**
 * Configuration Service for UX-Kit
 *
 * Manages configuration loading, saving, and validation
 * with support for YAML and JSON formats.
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
exports.ConfigurationService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const DefaultConfiguration_1 = require("./DefaultConfiguration");
const ConfigurationValidator_1 = require("./ConfigurationValidator");
class ConfigurationService {
    constructor(configPath) {
        this.configPath = configPath;
        this.validator = new ConfigurationValidator_1.ConfigurationValidator();
    }
    /**
     * Initialize configuration with default values
     */
    async initialize() {
        if (fs.existsSync(this.configPath)) {
            return await this.load();
        }
        const defaultConfig = DefaultConfiguration_1.DefaultConfiguration.getDefault();
        await this.save(defaultConfig);
        return defaultConfig;
    }
    /**
     * Load configuration from file
     */
    async load() {
        if (!fs.existsSync(this.configPath)) {
            return DefaultConfiguration_1.DefaultConfiguration.getDefault();
        }
        try {
            const content = fs.readFileSync(this.configPath, 'utf8');
            const config = this.parseConfig(content);
            // Migrate if needed
            const migratedConfig = DefaultConfiguration_1.DefaultConfiguration.migrate(config);
            // Validate the configuration
            const validation = this.validator.validate(migratedConfig);
            if (!validation.isValid) {
                throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
            }
            return migratedConfig;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('validation failed')) {
                throw error;
            }
            throw new Error(`Failed to parse configuration file: ${error}`);
        }
    }
    /**
     * Update configuration with new values
     */
    async update(updates) {
        const currentConfig = await this.load();
        // Validate the updates
        const validation = this.validator.validateUpdate(updates);
        if (!validation.isValid) {
            throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
        }
        // Merge updates with current configuration
        const updatedConfig = this.mergeConfig(currentConfig, updates);
        // Validate the merged configuration
        const finalValidation = this.validator.validate(updatedConfig);
        if (!finalValidation.isValid) {
            throw new Error(`Configuration validation failed: ${finalValidation.errors.join(', ')}`);
        }
        await this.save(updatedConfig);
        return updatedConfig;
    }
    /**
     * Reset configuration to default values
     */
    async reset() {
        const defaultConfig = DefaultConfiguration_1.DefaultConfiguration.getDefault();
        await this.save(defaultConfig);
        return defaultConfig;
    }
    /**
     * Save configuration to file
     */
    async save(config) {
        try {
            // Create backup if file exists
            if (fs.existsSync(this.configPath)) {
                const backupPath = this.configPath + '.backup';
                fs.copyFileSync(this.configPath, backupPath);
            }
            // Ensure directory exists
            const dir = path.dirname(this.configPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            // Write configuration file
            const content = this.formatConfig(config);
            fs.writeFileSync(this.configPath, content, 'utf8');
        }
        catch (error) {
            throw new Error(`Failed to save configuration: ${error}`);
        }
    }
    /**
     * Parse configuration from file content
     */
    parseConfig(content) {
        try {
            // Try JSON first
            return JSON.parse(content);
        }
        catch {
            try {
                // Try YAML (simple implementation for now)
                const yamlResult = this.parseYaml(content);
                // Validate that we got a reasonable result
                if (!yamlResult || typeof yamlResult !== 'object') {
                    throw new Error('Invalid YAML structure');
                }
                return yamlResult;
            }
            catch {
                throw new Error('Invalid configuration format. Expected JSON or YAML.');
            }
        }
    }
    /**
     * Format configuration for saving
     */
    formatConfig(config) {
        // For now, save as JSON with pretty formatting
        return JSON.stringify(config, null, 2);
    }
    /**
     * Simple YAML parser for basic configuration files
     */
    parseYaml(content) {
        // Check for obviously invalid content
        if (content.includes('{') && !content.includes(':')) {
            throw new Error('Invalid YAML format');
        }
        const lines = content.split('\n');
        const result = {};
        const stack = [result];
        const indentStack = [0];
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) {
                continue;
            }
            const indent = line.length - line.trimStart().length;
            const colonIndex = trimmed.indexOf(':');
            if (colonIndex === -1) {
                continue;
            }
            const key = trimmed.substring(0, colonIndex).trim();
            const value = trimmed.substring(colonIndex + 1).trim();
            if (!key) {
                continue;
            }
            // Adjust stack based on indentation
            while (indentStack.length > 1 && indent <= (indentStack[indentStack.length - 1] ?? 0)) {
                stack.pop();
                indentStack.pop();
            }
            const current = stack[stack.length - 1];
            if (!value) {
                // Object
                current[key] = {};
                stack.push(current[key]);
                indentStack.push(indent);
            }
            else {
                // Value
                current[key] = this.parseYamlValue(value);
            }
        }
        return result;
    }
    /**
     * Parse YAML value
     */
    parseYamlValue(value) {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        if (value === 'null')
            return null;
        if (value.startsWith('"') && value.endsWith('"')) {
            return value.slice(1, -1);
        }
        if (value.startsWith("'") && value.endsWith("'")) {
            return value.slice(1, -1);
        }
        if (!isNaN(Number(value))) {
            return Number(value);
        }
        return value;
    }
    /**
     * Merge configuration objects
     */
    mergeConfig(base, updates) {
        const result = { ...base };
        if (updates.templates) {
            result.templates = { ...result.templates, ...updates.templates };
        }
        if (updates.output) {
            result.output = { ...result.output, ...updates.output };
        }
        if (updates.research) {
            result.research = { ...result.research, ...updates.research };
        }
        if (updates.version) {
            result.version = updates.version;
        }
        return result;
    }
    /**
     * Get configuration file path
     */
    getConfigPath() {
        return this.configPath;
    }
    /**
     * Check if configuration file exists
     */
    exists() {
        return fs.existsSync(this.configPath);
    }
}
exports.ConfigurationService = ConfigurationService;
//# sourceMappingURL=ConfigurationService.js.map