/**
 * CodexConfigurationService
 * 
 * This service provides configuration management functionality for Codex,
 * implementing the IConfigurationService interface.
 */

import { IConfigurationService } from '../../contracts/infrastructure-contracts';
import { IFileSystemService } from '../../contracts/infrastructure-contracts';
import { CodexConfiguration } from '../../contracts/domain-contracts';
import * as path from 'path';

/**
 * Service for managing Codex configuration
 */
export class CodexConfigurationService implements IConfigurationService {
  constructor(private fileSystemService: IFileSystemService) {}

  /**
   * Load configuration from file
   */
  async loadConfiguration(filePath: string): Promise<CodexConfiguration> {
    try {
      // Check if file exists
      const fileExists = await this.fileSystemService.fileExists(filePath);
      if (!fileExists) {
        throw new Error('Configuration file not found');
      }

      // Read file content
      const content = await this.fileSystemService.readFile(filePath);
      
      // Parse JSON
      let configData: any;
      try {
        configData = JSON.parse(content);
      } catch (error) {
        throw new Error('Invalid configuration file format');
      }

      // Validate configuration
      const isValid = await this.validateConfiguration(configData);
      if (!isValid) {
        throw new Error('Invalid configuration');
      }

      return configData as CodexConfiguration;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to load configuration: ${error}`);
    }
  }

  /**
   * Save configuration to file
   */
  async saveConfiguration(config: CodexConfiguration, filePath: string): Promise<void> {
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
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to save configuration: ${error}`);
    }
  }

  /**
   * Validate configuration
   */
  async validateConfiguration(config: any): Promise<boolean> {
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
    } catch (error) {
      return false;
    }
  }

  /**
   * Get default configuration
   */
  getDefaultConfiguration(): CodexConfiguration {
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
  mergeConfigurations(base: CodexConfiguration, override: Partial<CodexConfiguration>): CodexConfiguration {
    const result: CodexConfiguration = {
      enabled: override.enabled !== undefined ? override.enabled : base.enabled,
      validationEnabled: override.validationEnabled !== undefined ? override.validationEnabled : base.validationEnabled,
      fallbackToCustom: override.fallbackToCustom !== undefined ? override.fallbackToCustom : base.fallbackToCustom,
      templatePath: override.templatePath !== undefined ? override.templatePath : base.templatePath,
      timeout: override.timeout !== undefined ? override.timeout : base.timeout
    };

    if ('cliPath' in override) {
      (result as any).cliPath = override.cliPath;
    } else if (base.cliPath !== undefined) {
      (result as any).cliPath = base.cliPath;
    }

    return result;
  }
}
