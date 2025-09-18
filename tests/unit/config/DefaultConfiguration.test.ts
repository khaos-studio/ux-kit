/**
 * Unit Tests for DefaultConfiguration
 */

import { DefaultConfiguration, Configuration } from '../../../src/config/DefaultConfiguration';

describe('DefaultConfiguration', () => {
  describe('getDefault', () => {
    it('should return a valid default configuration', () => {
      const config = DefaultConfiguration.getDefault();
      
      expect(config).toHaveProperty('version');
      expect(config).toHaveProperty('templates');
      expect(config).toHaveProperty('output');
      expect(config).toHaveProperty('research');
      
      expect(config.version).toBe('1.0.0');
      expect(config.templates.directory).toBe('./templates');
      expect(config.templates.format).toBe('markdown');
      expect(config.output.directory).toBe('./output');
      expect(config.output.format).toBe('markdown');
      expect(config.research.defaultStudy).toBe('default-study');
      expect(config.research.autoSave).toBe(true);
    });

    it('should return a new instance each time', () => {
      const config1 = DefaultConfiguration.getDefault();
      const config2 = DefaultConfiguration.getDefault();
      
      expect(config1).not.toBe(config2);
      expect(config1).toEqual(config2);
    });
  });

  describe('getSchemaVersion', () => {
    it('should return the current schema version', () => {
      const version = DefaultConfiguration.getSchemaVersion();
      expect(version).toBe('1.0.0');
    });
  });

  describe('isVersionSupported', () => {
    it('should return true for supported versions', () => {
      expect(DefaultConfiguration.isVersionSupported('1.0.0')).toBe(true);
      expect(DefaultConfiguration.isVersionSupported('0.9.0')).toBe(true);
    });

    it('should return false for unsupported versions', () => {
      expect(DefaultConfiguration.isVersionSupported('2.0.0')).toBe(false);
      expect(DefaultConfiguration.isVersionSupported('0.8.0')).toBe(false);
      expect(DefaultConfiguration.isVersionSupported('invalid')).toBe(false);
    });
  });

  describe('migrate', () => {
    it('should migrate version 0.9.0 format to 1.0.0', () => {
      const oldConfig = {
        version: '0.9.0',
        templateDir: './old-templates',
        templateFormat: 'markdown',
        outputDir: './old-output',
        outputFormat: 'markdown',
        defaultStudy: 'old-study',
        autoSave: false
      };

      const migrated = DefaultConfiguration.migrate(oldConfig);

      expect(migrated.version).toBe('1.0.0');
      expect(migrated.templates.directory).toBe('./old-templates');
      expect(migrated.templates.format).toBe('markdown');
      expect(migrated.output.directory).toBe('./old-output');
      expect(migrated.output.format).toBe('markdown');
      expect(migrated.research.defaultStudy).toBe('old-study');
      expect(migrated.research.autoSave).toBe(false);
    });

    it('should use default values for missing fields in migration', () => {
      const incompleteConfig = {
        version: '0.9.0',
        templateDir: './templates'
      };

      const migrated = DefaultConfiguration.migrate(incompleteConfig);

      expect(migrated.version).toBe('1.0.0');
      expect(migrated.templates.directory).toBe('./templates');
      expect(migrated.templates.format).toBe('markdown'); // default
      expect(migrated.output.directory).toBe('./output'); // default
      expect(migrated.output.format).toBe('markdown'); // default
      expect(migrated.research.defaultStudy).toBe('default-study'); // default
      expect(migrated.research.autoSave).toBe(true); // default
    });

    it('should handle unsupported versions by returning defaults with valid fields', () => {
      const unsupportedConfig = {
        version: '2.0.0',
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

      const migrated = DefaultConfiguration.migrate(unsupportedConfig);

      expect(migrated.version).toBe('1.0.0'); // reset to current version
      expect(migrated.templates.directory).toBe('./custom-templates');
      expect(migrated.templates.format).toBe('markdown');
      expect(migrated.output.directory).toBe('./custom-output');
      expect(migrated.output.format).toBe('markdown');
      expect(migrated.research.defaultStudy).toBe('custom-study');
      expect(migrated.research.autoSave).toBe(false);
    });

    it('should handle empty or invalid config objects', () => {
      const emptyConfig = {};
      const migrated = DefaultConfiguration.migrate(emptyConfig);

      expect(migrated).toEqual(DefaultConfiguration.getDefault());
    });
  });
});
