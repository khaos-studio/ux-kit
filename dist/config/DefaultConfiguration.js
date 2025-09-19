"use strict";
/**
 * Default Configuration for UX-Kit
 *
 * Provides default configuration values and schema definitions
 * for the UX-Kit CLI tool.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultConfiguration = void 0;
class DefaultConfiguration {
    /**
     * Get the default configuration
     */
    static getDefault() {
        return JSON.parse(JSON.stringify(this.DEFAULT_CONFIG));
    }
    /**
     * Get the configuration schema version
     */
    static getSchemaVersion() {
        return this.DEFAULT_CONFIG.version;
    }
    /**
     * Check if a configuration version is supported
     */
    static isVersionSupported(version) {
        const supportedVersions = ['1.0.0', '0.9.0'];
        return supportedVersions.includes(version);
    }
    /**
     * Migrate configuration from old format to current format
     */
    static migrate(config) {
        const defaultConfig = this.getDefault();
        // Handle version 0.9.0 format
        if (config.version === '0.9.0') {
            return {
                ...defaultConfig,
                templates: {
                    directory: config.templateDir || defaultConfig.templates.directory,
                    format: config.templateFormat || defaultConfig.templates.format
                },
                output: {
                    directory: config.outputDir || defaultConfig.output.directory,
                    format: config.outputFormat || defaultConfig.output.format
                },
                research: {
                    defaultStudy: config.defaultStudy || defaultConfig.research.defaultStudy,
                    autoSave: config.autoSave !== undefined ? config.autoSave : defaultConfig.research.autoSave
                }
            };
        }
        // For unsupported versions, return default with any valid fields
        return {
            ...defaultConfig,
            ...config,
            version: defaultConfig.version
        };
    }
}
exports.DefaultConfiguration = DefaultConfiguration;
DefaultConfiguration.DEFAULT_CONFIG = {
    version: '1.0.0',
    templates: {
        directory: './templates',
        format: 'markdown'
    },
    output: {
        directory: './output',
        format: 'markdown'
    },
    research: {
        defaultStudy: 'default-study',
        autoSave: true
    }
};
//# sourceMappingURL=DefaultConfiguration.js.map