/**
 * Configuration Service for UX-Kit
 * 
 * Manages configuration loading, saving, and validation
 * with support for YAML and JSON formats.
 */

import * as fs from 'fs';
import * as path from 'path';
import { Configuration, PartialConfiguration, DefaultConfiguration } from './DefaultConfiguration';
import { ConfigurationValidator } from './ConfigurationValidator';

export class ConfigurationService {
  private configPath: string;
  private validator: ConfigurationValidator;

  constructor(configPath: string) {
    this.configPath = configPath;
    this.validator = new ConfigurationValidator();
  }

  /**
   * Initialize configuration with default values
   */
  async initialize(): Promise<Configuration> {
    if (fs.existsSync(this.configPath)) {
      return await this.load();
    }

    const defaultConfig = DefaultConfiguration.getDefault();
    await this.save(defaultConfig);
    return defaultConfig;
  }

  /**
   * Load configuration from file
   */
  async load(): Promise<Configuration> {
    if (!fs.existsSync(this.configPath)) {
      return DefaultConfiguration.getDefault();
    }

    try {
      const content = fs.readFileSync(this.configPath, 'utf8');
      const config = this.parseConfig(content);
      
      // Migrate if needed
      const migratedConfig = DefaultConfiguration.migrate(config);
      
      // Validate the configuration
      const validation = this.validator.validate(migratedConfig);
      if (!validation.isValid) {
        throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
      }

      return migratedConfig;
    } catch (error) {
      if (error instanceof Error && error.message.includes('validation failed')) {
        throw error;
      }
      throw new Error(`Failed to parse configuration file: ${error}`);
    }
  }

  /**
   * Update configuration with new values
   */
  async update(updates: PartialConfiguration): Promise<Configuration> {
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
  async reset(): Promise<Configuration> {
    const defaultConfig = DefaultConfiguration.getDefault();
    await this.save(defaultConfig);
    return defaultConfig;
  }

  /**
   * Save configuration to file
   */
  private async save(config: Configuration): Promise<void> {
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
    } catch (error) {
      throw new Error(`Failed to save configuration: ${error}`);
    }
  }

  /**
   * Parse configuration from file content
   */
  private parseConfig(content: string): any {
    try {
      // Try JSON first
      return JSON.parse(content);
    } catch {
      try {
        // Try YAML (simple implementation for now)
        const yamlResult = this.parseYaml(content);
        // Validate that we got a reasonable result
        if (!yamlResult || typeof yamlResult !== 'object') {
          throw new Error('Invalid YAML structure');
        }
        return yamlResult;
      } catch {
        throw new Error('Invalid configuration format. Expected JSON or YAML.');
      }
    }
  }

  /**
   * Format configuration for saving
   */
  private formatConfig(config: Configuration): string {
    // For now, save as JSON with pretty formatting
    return JSON.stringify(config, null, 2);
  }

  /**
   * Simple YAML parser for basic configuration files
   */
  private parseYaml(content: string): any {
    // Check for obviously invalid content
    if (content.includes('{') && !content.includes(':')) {
      throw new Error('Invalid YAML format');
    }

    const lines = content.split('\n');
    const result: any = {};
    const stack: any[] = [result];
    const indentStack: number[] = [0];

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
      } else {
        // Value
        current[key] = this.parseYamlValue(value);
      }
    }

    return result;
  }

  /**
   * Parse YAML value
   */
  private parseYamlValue(value: string): any {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
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
  private mergeConfig(base: Configuration, updates: PartialConfiguration): Configuration {
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
  getConfigPath(): string {
    return this.configPath;
  }

  /**
   * Check if configuration file exists
   */
  exists(): boolean {
    return fs.existsSync(this.configPath);
  }
}
