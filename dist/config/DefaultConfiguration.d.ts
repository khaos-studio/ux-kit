/**
 * Default Configuration for UX-Kit
 *
 * Provides default configuration values and schema definitions
 * for the UX-Kit CLI tool.
 */
export interface Configuration {
    version: string;
    templates: {
        directory: string;
        format: string;
    };
    output: {
        directory: string;
        format: string;
    };
    research: {
        defaultStudy: string;
        autoSave: boolean;
    };
}
export interface PartialConfiguration {
    version?: string;
    templates?: {
        directory?: string;
        format?: string;
    };
    output?: {
        directory?: string;
        format?: string;
    };
    research?: {
        defaultStudy?: string;
        autoSave?: boolean;
    };
}
export declare class DefaultConfiguration {
    private static readonly DEFAULT_CONFIG;
    /**
     * Get the default configuration
     */
    static getDefault(): Configuration;
    /**
     * Get the configuration schema version
     */
    static getSchemaVersion(): string;
    /**
     * Check if a configuration version is supported
     */
    static isVersionSupported(version: string): boolean;
    /**
     * Migrate configuration from old format to current format
     */
    static migrate(config: any): Configuration;
}
