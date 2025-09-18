/**
 * Unit Tests for ConfigurationService
 */

import { ConfigurationService } from '../../../src/config/ConfigurationService';
import { Configuration, PartialConfiguration } from '../../../src/config/DefaultConfiguration';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('ConfigurationService', () => {
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

  describe('constructor', () => {
    it('should initialize with config path', () => {
      const service = new ConfigurationService('/path/to/config.yaml');
      expect(service.getConfigPath()).toBe('/path/to/config.yaml');
    });
  });

  describe('getConfigPath', () => {
    it('should return the configuration file path', () => {
      expect(configService.getConfigPath()).toBe(configPath);
    });
  });

  describe('exists', () => {
    it('should return false when config file does not exist', () => {
      expect(configService.exists()).toBe(false);
    });

    it('should return true when config file exists', async () => {
      await configService.initialize();
      expect(configService.exists()).toBe(true);
    });
  });

  describe('initialize', () => {
    it('should create config file with default values when none exists', async () => {
      expect(fs.existsSync(configPath)).toBe(false);

      const config = await configService.initialize();

      expect(fs.existsSync(configPath)).toBe(true);
      expect(config).toEqual({
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
      });
    });

    it('should return existing config when file already exists', async () => {
      const existingConfig = {
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
          autoSave: false
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(existingConfig, null, 2));

      const config = await configService.initialize();

      expect(config).toEqual(existingConfig);
    });
  });

  describe('load', () => {
    it('should load valid JSON configuration', async () => {
      const config = {
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
          defaultStudy: 'study',
          autoSave: true
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      const loadedConfig = await configService.load();

      expect(loadedConfig).toEqual(config);
    });

    it('should load valid YAML configuration', async () => {
      const yamlContent = `version: "1.0.0"
templates:
  directory: "./templates"
  format: "markdown"
output:
  directory: "./output"
  format: "markdown"
research:
  defaultStudy: "study"
  autoSave: true`;

      fs.writeFileSync(configPath, yamlContent);

      const loadedConfig = await configService.load();

      expect(loadedConfig.version).toBe('1.0.0');
      expect(loadedConfig.templates.directory).toBe('./templates');
      expect(loadedConfig.templates.format).toBe('markdown');
      expect(loadedConfig.output.directory).toBe('./output');
      expect(loadedConfig.output.format).toBe('markdown');
      expect(loadedConfig.research.defaultStudy).toBe('study');
      expect(loadedConfig.research.autoSave).toBe(true);
    });

    it('should return default config when file does not exist', async () => {
      const config = await configService.load();

      expect(config).toEqual({
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
      });
    });

    it('should throw error for invalid JSON', async () => {
      fs.writeFileSync(configPath, 'invalid json {');

      await expect(configService.load()).rejects.toThrow('Invalid configuration format');
    });

    it('should throw error for invalid YAML', async () => {
      fs.writeFileSync(configPath, 'invalid yaml content {');

      await expect(configService.load()).rejects.toThrow('Invalid configuration format');
    });

    it('should throw error for invalid configuration structure', async () => {
      const invalidConfig = {
        version: '1.0.0',
        templates: {
          directory: null, // Invalid
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

      fs.writeFileSync(configPath, JSON.stringify(invalidConfig, null, 2));

      await expect(configService.load()).rejects.toThrow('Configuration validation failed');
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      await configService.initialize();
    });

    it('should update configuration with valid partial update', async () => {
      const update: PartialConfiguration = {
        templates: {
          directory: './new-templates',
          format: 'markdown'
        },
        research: {
          defaultStudy: 'new-study',
          autoSave: false
        }
      };

      const updatedConfig = await configService.update(update);

      expect(updatedConfig.templates.directory).toBe('./new-templates');
      expect(updatedConfig.research.defaultStudy).toBe('new-study');
      expect(updatedConfig.research.autoSave).toBe(false);
      expect(updatedConfig.version).toBe('1.0.0'); // unchanged
      expect(updatedConfig.output.directory).toBe('./output'); // unchanged
    });

    it('should throw error for invalid update', async () => {
      const invalidUpdate = {
        templates: {
          directory: null as any, // Invalid
          format: 'invalid-format'
        }
      };

      await expect(configService.update(invalidUpdate)).rejects.toThrow('Configuration validation failed');
    });

    it('should create backup before updating', async () => {
      const originalContent = fs.readFileSync(configPath, 'utf8');

      await configService.update({
        templates: {
          directory: './updated',
          format: 'markdown'
        }
      });

      const backupPath = configPath + '.backup';
      expect(fs.existsSync(backupPath)).toBe(true);
      expect(fs.readFileSync(backupPath, 'utf8')).toBe(originalContent);
    });
  });

  describe('reset', () => {
    it('should reset configuration to default values', async () => {
      await configService.initialize();
      await configService.update({
        templates: {
          directory: './custom',
          format: 'markdown'
        }
      });

      const resetConfig = await configService.reset();

      expect(resetConfig).toEqual({
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
      });
    });
  });

  describe('migration', () => {
    it('should migrate version 0.9.0 configuration', async () => {
      const oldConfig = {
        version: '0.9.0',
        templateDir: './old-templates',
        templateFormat: 'markdown',
        outputDir: './old-output',
        outputFormat: 'markdown',
        defaultStudy: 'old-study',
        autoSave: false
      };

      fs.writeFileSync(configPath, JSON.stringify(oldConfig, null, 2));

      const migratedConfig = await configService.load();

      expect(migratedConfig.version).toBe('1.0.0');
      expect(migratedConfig.templates.directory).toBe('./old-templates');
      expect(migratedConfig.templates.format).toBe('markdown');
      expect(migratedConfig.output.directory).toBe('./old-output');
      expect(migratedConfig.output.format).toBe('markdown');
      expect(migratedConfig.research.defaultStudy).toBe('old-study');
      expect(migratedConfig.research.autoSave).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle file system errors gracefully', async () => {
      const readOnlyPath = '/readonly/uxkit-config.yaml';
      const readOnlyService = new ConfigurationService(readOnlyPath);

      await expect(readOnlyService.update({
        templates: {
          directory: './test',
          format: 'markdown'
        }
      })).rejects.toThrow('Failed to save configuration');
    });
  });
});
