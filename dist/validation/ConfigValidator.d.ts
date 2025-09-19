/**
 * Config Validator
 *
 * Validates UX-Kit configuration files and objects.
 */
import { ValidationResult } from './ValidationResult';
export interface UXKitConfig {
    version: string;
    aiAgent: {
        provider: string;
        settings: Record<string, any>;
    };
    storage: {
        basePath: string;
        format: string;
    };
    research?: {
        defaultTemplates?: Record<string, string>;
        autoSave?: boolean;
    };
}
export declare class ConfigValidator {
    private readonly validProviders;
    private readonly validFormats;
    private readonly versionPattern;
    /**
     * Validate configuration object
     */
    validateConfig(config: any): ValidationResult;
    /**
     * Validate YAML configuration
     */
    validateYamlConfig(yamlContent: string): ValidationResult;
    /**
     * Validate AI agent configuration
     */
    private validateAiAgent;
    /**
     * Validate storage configuration
     */
    private validateStorage;
    /**
     * Validate research configuration
     */
    private validateResearch;
    /**
     * Validate configuration file path
     */
    validateConfigFilePath(filePath: string): ValidationResult;
    /**
     * Validate configuration schema version
     */
    validateSchemaVersion(version: string): ValidationResult;
    /**
     * Get default configuration
     */
    getDefaultConfig(): UXKitConfig;
    /**
     * Merge configuration with defaults
     */
    mergeWithDefaults(config: Partial<UXKitConfig>): UXKitConfig;
}
