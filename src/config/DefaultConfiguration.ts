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

export class DefaultConfiguration {
  private static readonly DEFAULT_CONFIG: Configuration = {
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

  /**
   * Get the default configuration
   */
  static getDefault(): Configuration {
    return JSON.parse(JSON.stringify(this.DEFAULT_CONFIG));
  }

  /**
   * Get the configuration schema version
   */
  static getSchemaVersion(): string {
    return this.DEFAULT_CONFIG.version;
  }

  /**
   * Check if a configuration version is supported
   */
  static isVersionSupported(version: string): boolean {
    const supportedVersions = ['1.0.0', '0.9.0'];
    return supportedVersions.includes(version);
  }

  /**
   * Migrate configuration from old format to current format
   */
  static migrate(config: any): Configuration {
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
