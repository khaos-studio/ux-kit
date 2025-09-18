/**
 * Unit Tests for ConfigurationValidator
 */

import { ConfigurationValidator } from '../../../src/config/ConfigurationValidator';
import { Configuration, PartialConfiguration } from '../../../src/config/DefaultConfiguration';

describe('ConfigurationValidator', () => {
  let validator: ConfigurationValidator;

  beforeEach(() => {
    validator = new ConfigurationValidator();
  });

  describe('validate', () => {
    it('should validate a complete valid configuration', () => {
      const config: Configuration = {
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

      const result = validator.validate(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject null or undefined configuration', () => {
      const result1 = validator.validate(null);
      expect(result1.isValid).toBe(false);
      expect(result1.errors).toContain('Configuration must be an object');

      const result2 = validator.validate(undefined);
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('Configuration must be an object');
    });

    it('should reject non-object configuration', () => {
      const result = validator.validate('invalid');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Configuration must be an object');
    });

    it('should validate version field', () => {
      const config = {
        // Missing version
        templates: { directory: './templates', format: 'markdown' },
        output: { directory: './output', format: 'markdown' },
        research: { defaultStudy: 'study', autoSave: true }
      };

      const result = validator.validate(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('version is required');

      const config2 = {
        version: 123, // Wrong type
        templates: { directory: './templates', format: 'markdown' },
        output: { directory: './output', format: 'markdown' },
        research: { defaultStudy: 'study', autoSave: true }
      };

      const result2 = validator.validate(config2);
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('version must be a string');
    });

    it('should validate templates field', () => {
      const config = {
        version: '1.0.0',
        // Missing templates
        output: { directory: './output', format: 'markdown' },
        research: { defaultStudy: 'study', autoSave: true }
      };

      const result = validator.validate(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('templates is required');

      const config2 = {
        version: '1.0.0',
        templates: 'invalid', // Wrong type
        output: { directory: './output', format: 'markdown' },
        research: { defaultStudy: 'study', autoSave: true }
      };

      const result2 = validator.validate(config2);
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('templates must be an object');
    });

    it('should validate templates.directory field', () => {
      const config = {
        version: '1.0.0',
        templates: {
          // Missing directory
          format: 'markdown'
        },
        output: { directory: './output', format: 'markdown' },
        research: { defaultStudy: 'study', autoSave: true }
      };

      const result = validator.validate(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('templates.directory is required');

      const config2 = {
        version: '1.0.0',
        templates: {
          directory: 123, // Wrong type
          format: 'markdown'
        },
        output: { directory: './output', format: 'markdown' },
        research: { defaultStudy: 'study', autoSave: true }
      };

      const result2 = validator.validate(config2);
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('templates.directory must be a string');
    });

    it('should validate templates.format field', () => {
      const config = {
        version: '1.0.0',
        templates: {
          directory: './templates',
          // Missing format
        },
        output: { directory: './output', format: 'markdown' },
        research: { defaultStudy: 'study', autoSave: true }
      };

      const result = validator.validate(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('templates.format is required');

      const config2 = {
        version: '1.0.0',
        templates: {
          directory: './templates',
          format: 'invalid-format' // Invalid value
        },
        output: { directory: './output', format: 'markdown' },
        research: { defaultStudy: 'study', autoSave: true }
      };

      const result2 = validator.validate(config2);
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('templates.format must be one of: markdown');
    });

    it('should validate output field', () => {
      const config = {
        version: '1.0.0',
        templates: { directory: './templates', format: 'markdown' },
        // Missing output
        research: { defaultStudy: 'study', autoSave: true }
      };

      const result = validator.validate(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('output is required');
    });

    it('should validate research field', () => {
      const config = {
        version: '1.0.0',
        templates: { directory: './templates', format: 'markdown' },
        output: { directory: './output', format: 'markdown' },
        // Missing research
      };

      const result = validator.validate(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('research is required');
    });

    it('should validate research.autoSave field', () => {
      const config = {
        version: '1.0.0',
        templates: { directory: './templates', format: 'markdown' },
        output: { directory: './output', format: 'markdown' },
        research: {
          defaultStudy: 'study',
          autoSave: 'invalid' // Wrong type
        }
      };

      const result = validator.validate(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('research.autoSave must be a boolean');
    });

    it('should collect multiple validation errors', () => {
      const config = {
        version: 123, // Wrong type
        templates: {
          directory: 456, // Wrong type
          format: 'invalid' // Invalid value
        },
        output: { directory: './output', format: 'markdown' },
        research: {
          defaultStudy: 'study',
          autoSave: 'invalid' // Wrong type
        }
      };

      const result = validator.validate(config);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain('version must be a string');
      expect(result.errors).toContain('templates.directory must be a string');
      expect(result.errors).toContain('templates.format must be one of: markdown');
      expect(result.errors).toContain('research.autoSave must be a boolean');
    });
  });

  describe('validateUpdate', () => {
    it('should validate a valid partial update', () => {
      const update: PartialConfiguration = {
        templates: {
          directory: './new-templates',
          format: 'markdown'
        }
      };

      const result = validator.validateUpdate(update);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject null or undefined update', () => {
      const result1 = validator.validateUpdate(null as any);
      expect(result1.isValid).toBe(false);
      expect(result1.errors).toContain('Update must be an object');

      const result2 = validator.validateUpdate(undefined as any);
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('Update must be an object');
    });

    it('should reject non-object update', () => {
      const result = validator.validateUpdate('invalid' as any);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Update must be an object');
    });

    it('should validate templates update', () => {
      const update = {
        templates: {
          directory: 123 as any, // Wrong type
          format: 'invalid' // Invalid value
        }
      };

      const result = validator.validateUpdate(update);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('templates.directory must be a string');
      expect(result.errors).toContain('templates.format must be one of: markdown');
    });

    it('should validate output update', () => {
      const update = {
        output: {
          directory: 123 as any, // Wrong type
          format: 'invalid' // Invalid value
        }
      };

      const result = validator.validateUpdate(update);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('output.directory must be a string');
      expect(result.errors).toContain('output.format must be one of: markdown');
    });

    it('should validate research update', () => {
      const update = {
        research: {
          defaultStudy: 123 as any, // Wrong type
          autoSave: 'invalid' as any // Wrong type
        }
      };

      const result = validator.validateUpdate(update);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('research.defaultStudy must be a string');
      expect(result.errors).toContain('research.autoSave must be a boolean');
    });

    it('should allow empty update object', () => {
      const update = {};
      const result = validator.validateUpdate(update);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
