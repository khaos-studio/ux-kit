/**
 * Config Validator
 * 
 * Validates UX-Kit configuration files and objects.
 */

import { ValidationResult, createSuccessResult, createErrorResult } from './ValidationResult';
import * as yaml from 'js-yaml';

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

export class ConfigValidator {
  private readonly validProviders = ['cursor', 'codex', 'claude', 'gpt'];
  private readonly validFormats = ['markdown', 'json', 'yaml'];
  private readonly versionPattern = /^\d+\.\d+\.\d+$/;

  /**
   * Validate configuration object
   */
  validateConfig(config: any): ValidationResult {
    const errors: string[] = [];

    if (!config || typeof config !== 'object') {
      errors.push('Configuration must be an object');
      return createErrorResult(errors);
    }

    // Validate version
    if (!config.version) {
      errors.push('Version is required');
    } else if (!this.versionPattern.test(config.version)) {
      errors.push('Invalid version format');
    }

    // Validate aiAgent
    if (!config.aiAgent) {
      errors.push('aiAgent is required');
    } else {
      const aiAgentErrors = this.validateAiAgent(config.aiAgent);
      errors.push(...aiAgentErrors);
    }

    // Validate storage
    if (!config.storage) {
      errors.push('storage is required');
    } else {
      const storageErrors = this.validateStorage(config.storage);
      errors.push(...storageErrors);
    }

    // Validate research (optional)
    if (config.research) {
      const researchErrors = this.validateResearch(config.research);
      errors.push(...researchErrors);
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate YAML configuration
   */
  validateYamlConfig(yamlContent: string): ValidationResult {
    const errors: string[] = [];

    try {
      const config = yaml.load(yamlContent) as any;
      return this.validateConfig(config);
    } catch (error: any) {
      errors.push(`Invalid YAML: ${error.message}`);
      return createErrorResult(errors);
    }
  }

  /**
   * Validate AI agent configuration
   */
  private validateAiAgent(aiAgent: any): string[] {
    const errors: string[] = [];

    if (!aiAgent.provider) {
      errors.push('AI agent provider is required');
    } else if (!this.validProviders.includes(aiAgent.provider)) {
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
  private validateStorage(storage: any): string[] {
    const errors: string[] = [];

    if (!storage.basePath) {
      errors.push('Storage base path is required');
    } else if (typeof storage.basePath !== 'string') {
      errors.push('Storage base path must be a string');
    }

    if (!storage.format) {
      errors.push('Storage format is required');
    } else if (!this.validFormats.includes(storage.format)) {
      errors.push('Invalid storage format');
    }

    return errors;
  }

  /**
   * Validate research configuration
   */
  private validateResearch(research: any): string[] {
    const errors: string[] = [];

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
  validateConfigFilePath(filePath: string): ValidationResult {
    const errors: string[] = [];

    if (!filePath || filePath.trim().length === 0) {
      errors.push('Configuration file path is required');
    } else if (!filePath.endsWith('.yaml') && !filePath.endsWith('.yml')) {
      errors.push('Configuration file must have .yaml or .yml extension');
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate configuration schema version
   */
  validateSchemaVersion(version: string): ValidationResult {
    const errors: string[] = [];

    if (!version) {
      errors.push('Schema version is required');
    } else if (!this.versionPattern.test(version)) {
      errors.push('Invalid schema version format');
    } else {
      const parts = version.split('.').map(Number);
      const major = parts[0] || 0;
      const minor = parts[1] || 0;
      if (major < 1 || (major === 1 && minor < 0)) {
        errors.push('Schema version must be 1.0.0 or higher');
      }
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Get default configuration
   */
  getDefaultConfig(): UXKitConfig {
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
  mergeWithDefaults(config: Partial<UXKitConfig>): UXKitConfig {
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
