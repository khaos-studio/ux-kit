/**
 * Configuration Service for UX-Kit
 *
 * Manages configuration loading, saving, and validation
 * with support for YAML and JSON formats.
 */
import { Configuration, PartialConfiguration } from './DefaultConfiguration';
export declare class ConfigurationService {
    private configPath;
    private validator;
    constructor(configPath: string);
    /**
     * Initialize configuration with default values
     */
    initialize(): Promise<Configuration>;
    /**
     * Load configuration from file
     */
    load(): Promise<Configuration>;
    /**
     * Update configuration with new values
     */
    update(updates: PartialConfiguration): Promise<Configuration>;
    /**
     * Reset configuration to default values
     */
    reset(): Promise<Configuration>;
    /**
     * Save configuration to file
     */
    private save;
    /**
     * Parse configuration from file content
     */
    private parseConfig;
    /**
     * Format configuration for saving
     */
    private formatConfig;
    /**
     * Simple YAML parser for basic configuration files
     */
    private parseYaml;
    /**
     * Parse YAML value
     */
    private parseYamlValue;
    /**
     * Merge configuration objects
     */
    private mergeConfig;
    /**
     * Get configuration file path
     */
    getConfigPath(): string;
    /**
     * Check if configuration file exists
     */
    exists(): boolean;
}
