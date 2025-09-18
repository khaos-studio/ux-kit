/**
 * Use Case Tests for Configuration Management System
 * 
 * These tests define the complete user journey and expected behavior
 * for the configuration management system in UX-Kit.
 */

import { ConfigurationService } from '../../src/config/ConfigurationService';
import { ConfigurationValidator } from '../../src/config/ConfigurationValidator';
import { DefaultConfiguration } from '../../src/config/DefaultConfiguration';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('Configuration Management Use Cases', () => {
  let configService: ConfigurationService;
  let tempDir: string;
  let configPath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uxkit-config-test-'));
    configPath = path.join(tempDir, 'uxkit-config.yaml');
    configService = new ConfigurationService(configPath);
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('UC001: Initialize Configuration with Defaults', () => {
    it('should create a new configuration file with default values when none exists', async () => {
      // Given: No configuration file exists
      expect(fs.existsSync(configPath)).toBe(false);

      // When: User initializes configuration
      const config = await configService.initialize();

      // Then: Configuration file should be created with default values
      expect(fs.existsSync(configPath)).toBe(true);
      expect(config).toEqual(DefaultConfiguration.getDefault());
      
      const fileContent = fs.readFileSync(configPath, 'utf8');
      expect(fileContent).toContain('"version": "1.0.0"');
      expect(fileContent).toContain('"templates"');
      expect(fileContent).toContain('"output"');
    });

    it('should preserve existing configuration when file already exists', async () => {
      // Given: Configuration file exists with custom values
      const customConfig = {
        version: '1.0.0',
        templates: {
          directory: './custom-templates',
          format: 'markdown'
        },
        output: {
          directory: './custom-output',
          format: 'markdown'
        },
        research: {
          defaultStudy: 'custom-study',
          autoSave: true
        }
      };
      fs.writeFileSync(configPath, JSON.stringify(customConfig, null, 2));

      // When: User initializes configuration
      const config = await configService.initialize();

      // Then: Existing configuration should be preserved
      expect(config).toEqual(customConfig);
    });
  });

  describe('UC002: Load and Validate Configuration', () => {
    it('should load valid configuration from file', async () => {
      // Given: Valid configuration file exists
      const validConfig = DefaultConfiguration.getDefault();
      fs.writeFileSync(configPath, JSON.stringify(validConfig, null, 2));

      // When: User loads configuration
      const config = await configService.load();

      // Then: Configuration should be loaded successfully
      expect(config).toEqual(validConfig);
    });

    it('should throw error when loading invalid configuration', async () => {
      // Given: Invalid configuration file exists
      const invalidConfig = {
        version: 'invalid-version',
        templates: {
          directory: null, // Invalid: should be string
          format: 'invalid-format'
        }
      };
      fs.writeFileSync(configPath, JSON.stringify(invalidConfig, null, 2));

      // When: User loads configuration
      // Then: Should throw validation error
      await expect(configService.load()).rejects.toThrow('Configuration validation failed');
    });

    it('should return default configuration when file does not exist', async () => {
      // Given: No configuration file exists
      expect(fs.existsSync(configPath)).toBe(false);

      // When: User loads configuration
      const config = await configService.load();

      // Then: Should return default configuration
      expect(config).toEqual(DefaultConfiguration.getDefault());
    });
  });

  describe('UC003: Update Configuration Values', () => {
    beforeEach(async () => {
      await configService.initialize();
    });

    it('should update specific configuration values', async () => {
      // Given: Valid configuration exists
      const originalConfig = await configService.load();

      // When: User updates specific values
      const updates = {
        templates: {
          directory: './updated-templates',
          format: 'markdown'
        },
        research: {
          defaultStudy: 'updated-study',
          autoSave: false
        }
      };
      await configService.update(updates);

      // Then: Configuration should be updated
      const updatedConfig = await configService.load();
      expect(updatedConfig.templates.directory).toBe('./updated-templates');
      expect(updatedConfig.research.defaultStudy).toBe('updated-study');
      expect(updatedConfig.research.autoSave).toBe(false);
      
      // And: Other values should remain unchanged
      expect(updatedConfig.version).toBe(originalConfig.version);
      expect(updatedConfig.output).toEqual(originalConfig.output);
    });

    it('should validate updates before applying them', async () => {
      // Given: Valid configuration exists
      await configService.load();

      // When: User attempts to update with invalid values
      const invalidUpdates = {
        templates: {
          directory: null as any, // Invalid: should be string
          format: 'invalid-format'
        }
      };

      // Then: Should throw validation error
      await expect(configService.update(invalidUpdates)).rejects.toThrow('Configuration validation failed');
    });
  });

  describe('UC004: Reset Configuration to Defaults', () => {
    it('should reset configuration to default values', async () => {
      // Given: Configuration exists with custom values
      await configService.initialize();
      await configService.update({
        templates: { directory: './custom', format: 'markdown' },
        research: { defaultStudy: 'custom-study', autoSave: true }
      });

      // When: User resets configuration
      await configService.reset();

      // Then: Configuration should be reset to defaults
      const config = await configService.load();
      expect(config).toEqual(DefaultConfiguration.getDefault());
    });
  });

  describe('UC005: Configuration Validation', () => {
    it('should validate required fields are present', () => {
      // Given: Configuration with missing required fields
      const invalidConfig = {
        // Missing version
        templates: {
          directory: './templates',
          format: 'markdown'
        }
      };

      // When: Validating configuration
      const validator = new ConfigurationValidator();
      const result = validator.validate(invalidConfig);

      // Then: Should return validation errors
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('version is required');
    });

    it('should validate field types and formats', () => {
      // Given: Configuration with invalid field types
      const invalidConfig = {
        version: '1.0.0',
        templates: {
          directory: 123, // Invalid: should be string
          format: 'invalid-format' // Invalid: should be 'markdown'
        },
        output: {
          directory: './output',
          format: 'markdown'
        },
        research: {
          defaultStudy: 'study',
          autoSave: 'invalid-boolean' // Invalid: should be boolean
        }
      };

      // When: Validating configuration
      const validator = new ConfigurationValidator();
      const result = validator.validate(invalidConfig);

      // Then: Should return validation errors
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('templates.directory must be a string');
      expect(result.errors).toContain('templates.format must be one of: markdown');
      expect(result.errors).toContain('research.autoSave must be a boolean');
    });

    it('should validate nested object structures', () => {
      // Given: Configuration with invalid nested structure
      const invalidConfig = {
        version: '1.0.0',
        templates: {
          // Missing required directory field
          format: 'markdown'
        },
        output: {
          directory: './output',
          format: 'markdown'
        },
        research: {
          defaultStudy: 'study',
          autoSave: true
        }
      };

      // When: Validating configuration
      const validator = new ConfigurationValidator();
      const result = validator.validate(invalidConfig);

      // Then: Should return validation errors
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('templates.directory is required');
    });
  });

  describe('UC006: Configuration File Management', () => {
    it('should handle file system errors gracefully', async () => {
      // Given: Invalid file path (read-only directory)
      const readOnlyPath = '/readonly/uxkit-config.yaml';
      const readOnlyService = new ConfigurationService(readOnlyPath);

      // When: User attempts to save configuration
      // Then: Should throw appropriate error
      await expect(readOnlyService.update({ templates: { directory: './test', format: 'markdown' } }))
        .rejects.toThrow('Failed to save configuration');
    });

    it('should handle corrupted configuration files', async () => {
      // Given: Corrupted configuration file
      fs.writeFileSync(configPath, 'invalid yaml content {');

      // When: User loads configuration
      // Then: Should throw parsing error
      await expect(configService.load()).rejects.toThrow('Failed to parse configuration file');
    });

    it('should create backup before overwriting configuration', async () => {
      // Given: Existing configuration file
      await configService.initialize();
      const originalContent = fs.readFileSync(configPath, 'utf8');

      // When: User updates configuration
      await configService.update({ templates: { directory: './updated', format: 'markdown' } });

      // Then: Backup should be created
      const backupPath = configPath + '.backup';
      expect(fs.existsSync(backupPath)).toBe(true);
      expect(fs.readFileSync(backupPath, 'utf8')).toBe(originalContent);
    });
  });

  describe('UC007: Configuration Schema Evolution', () => {
    it('should migrate old configuration format to new format', async () => {
      // Given: Old configuration format
      const oldConfig = {
        version: '0.9.0',
        templateDir: './templates', // Old field name
        outputDir: './output', // Old field name
        autoSave: true
      };
      fs.writeFileSync(configPath, JSON.stringify(oldConfig, null, 2));

      // When: User loads configuration
      const config = await configService.load();

      // Then: Should migrate to new format
      expect(config.version).toBe('1.0.0');
      expect(config.templates.directory).toBe('./templates');
      expect(config.output.directory).toBe('./output');
      expect(config.research.autoSave).toBe(true);
    });

    it('should add missing fields with default values during migration', async () => {
      // Given: Configuration missing new fields
      const incompleteConfig = {
        version: '0.9.0',
        templateDir: './templates'
      };
      fs.writeFileSync(configPath, JSON.stringify(incompleteConfig, null, 2));

      // When: User loads configuration
      const config = await configService.load();

      // Then: Should add missing fields with defaults
      expect(config.output.directory).toBe('./output');
      expect(config.research.defaultStudy).toBe('default-study');
      expect(config.research.autoSave).toBe(true);
    });
  });
});
