/**
 * Validation System Use Case Tests
 * 
 * These tests define the expected behavior and user scenarios for the validation system
 * before any implementation code is written (TDD Red Phase).
 */

import { ValidationService } from '../../src/validation/ValidationService';
import { InputValidator } from '../../src/validation/InputValidator';
import { ConfigValidator } from '../../src/validation/ConfigValidator';
import { FileValidator } from '../../src/validation/FileValidator';

describe('Validation System Use Cases', () => {
  let validationService: ValidationService;
  let inputValidator: InputValidator;
  let configValidator: ConfigValidator;
  let fileValidator: FileValidator;

  beforeEach(() => {
    validationService = new ValidationService();
    inputValidator = new InputValidator();
    configValidator = new ConfigValidator();
    fileValidator = new FileValidator();
  });

  describe('Input Validation', () => {
    it('should validate study names correctly', () => {
      // Given an InputValidator instance
      // When validating study names
      const validName = inputValidator.validateStudyName('User Research Study 2024');
      const invalidName = inputValidator.validateStudyName('');
      const invalidName2 = inputValidator.validateStudyName('a'.repeat(101));
      
      // Then it should return appropriate validation results
      expect(validName.isValid).toBe(true);
      expect(invalidName.isValid).toBe(false);
      expect(invalidName2.isValid).toBe(false);
      expect(invalidName.errors).toContain('Study name is required');
      expect(invalidName2.errors).toContain('Study name must be 100 characters or less');
    });

    it('should validate study IDs correctly', () => {
      // Given an InputValidator instance
      // When validating study IDs
      const validId = inputValidator.validateStudyId('study-123');
      const invalidId = inputValidator.validateStudyId('invalid id with spaces');
      const invalidId2 = inputValidator.validateStudyId('UPPERCASE');
      
      // Then it should return appropriate validation results
      expect(validId.isValid).toBe(true);
      expect(invalidId.isValid).toBe(false);
      expect(invalidId2.isValid).toBe(false);
      expect(invalidId.errors).toContain('Study ID must contain only lowercase letters, numbers, and hyphens');
    });

    it('should validate file paths correctly', () => {
      // Given an InputValidator instance
      // When validating file paths
      const validPath = inputValidator.validateFilePath('/path/to/file.md');
      const invalidPath = inputValidator.validateFilePath('');
      const invalidPath2 = inputValidator.validateFilePath('invalid<>path');
      
      // Then it should return appropriate validation results
      expect(validPath.isValid).toBe(true);
      expect(invalidPath.isValid).toBe(false);
      expect(invalidPath2.isValid).toBe(false);
      expect(invalidPath.errors).toContain('File path is required');
      expect(invalidPath2.errors).toContain('File path contains invalid characters');
    });

    it('should validate command arguments correctly', () => {
      // Given an InputValidator instance
      // When validating command arguments
      const validArgs = inputValidator.validateCommandArgs(['questions', 'study-123']);
      const invalidArgs = inputValidator.validateCommandArgs([]);
      const invalidArgs2 = inputValidator.validateCommandArgs(['invalid-command']);
      
      // Then it should return appropriate validation results
      expect(validArgs.isValid).toBe(true);
      expect(invalidArgs.isValid).toBe(false);
      expect(invalidArgs2.isValid).toBe(false);
      expect(invalidArgs.errors).toContain('Command is required');
      expect(invalidArgs2.errors).toContain('Invalid command: invalid-command');
    });

    it('should validate email addresses correctly', () => {
      // Given an InputValidator instance
      // When validating email addresses
      const validEmail = inputValidator.validateEmail('user@example.com');
      const invalidEmail = inputValidator.validateEmail('invalid-email');
      const invalidEmail2 = inputValidator.validateEmail('');
      
      // Then it should return appropriate validation results
      expect(validEmail.isValid).toBe(true);
      expect(invalidEmail.isValid).toBe(false);
      expect(invalidEmail2.isValid).toBe(false);
      expect(invalidEmail.errors).toContain('Invalid email format');
      expect(invalidEmail2.errors).toContain('Email is required');
    });
  });

  describe('Configuration Validation', () => {
    it('should validate UX-Kit configuration files', () => {
      // Given a ConfigValidator instance and valid configuration
      const validConfig = {
        version: '1.0.0',
        aiAgent: {
          provider: 'cursor',
          settings: {}
        },
        storage: {
          basePath: './.uxkit/studies',
          format: 'markdown'
        }
      };
      
      // When validating the configuration
      const result = configValidator.validateConfig(validConfig);
      
      // Then it should be valid
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate configuration with missing required fields', () => {
      // Given a ConfigValidator instance and invalid configuration
      const invalidConfig = {
        version: '1.0.0'
        // Missing required fields
      };
      
      // When validating the configuration
      const result = configValidator.validateConfig(invalidConfig);
      
      // Then it should be invalid with appropriate errors
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('aiAgent is required');
      expect(result.errors).toContain('storage is required');
    });

    it('should validate configuration with invalid values', () => {
      // Given a ConfigValidator instance and invalid configuration
      const invalidConfig = {
        version: 'invalid-version',
        aiAgent: {
          provider: 'invalid-provider',
          settings: {}
        },
        storage: {
          basePath: '',
          format: 'invalid-format'
        }
      };
      
      // When validating the configuration
      const result = configValidator.validateConfig(invalidConfig);
      
      // Then it should be invalid with appropriate errors
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid version format');
      expect(result.errors).toContain('Invalid AI agent provider');
      expect(result.errors).toContain('Storage base path is required');
      expect(result.errors).toContain('Invalid storage format');
    });

    it('should validate YAML configuration files', () => {
      // Given a ConfigValidator instance and YAML content
      const yamlContent = `
version: 1.0.0
aiAgent:
  provider: cursor
  settings: {}
storage:
  basePath: ./.uxkit/studies
  format: markdown
`;
      
      // When validating YAML configuration
      const result = configValidator.validateYamlConfig(yamlContent);
      
      // Then it should be valid
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate invalid YAML configuration', () => {
      // Given a ConfigValidator instance and invalid YAML content
      const invalidYaml = `
version: 1.0.0
aiAgent:
  provider: cursor
  # Missing closing brace
storage:
  basePath: ./.uxkit/studies
`;
      
      // When validating invalid YAML configuration
      const result = configValidator.validateYamlConfig(invalidYaml);
      
      // Then it should be invalid
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('File Validation', () => {
    it('should validate markdown files correctly', () => {
      // Given a FileValidator instance and markdown content
      const validMarkdown = '# Research Questions\n\n- What are the main user pain points?';
      const invalidMarkdown = 'Not a valid markdown file';
      
      // When validating markdown files
      const validResult = fileValidator.validateMarkdown(validMarkdown);
      const invalidResult = fileValidator.validateMarkdown(invalidMarkdown);
      
      // Then it should return appropriate validation results
      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors).toContain('Markdown file must have a header');
    });

    it('should validate template files correctly', () => {
      // Given a FileValidator instance and template content
      const validTemplate = '# {{studyName}}\n\n**Study ID**: {{studyId}}\n\n## Questions\n\n{{questions}}';
      const invalidTemplate = 'Invalid template without proper syntax';
      
      // When validating template files
      const validResult = fileValidator.validateTemplate(validTemplate);
      const invalidResult = fileValidator.validateTemplate(invalidTemplate);
      
      // Then it should return appropriate validation results
      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors).toContain('Template must contain at least one variable');
    });

    it('should validate file extensions correctly', () => {
      // Given a FileValidator instance
      // When validating file extensions
      const validMd = fileValidator.validateFileExtension('questions.md', ['.md', '.txt']);
      const validTxt = fileValidator.validateFileExtension('notes.txt', ['.md', '.txt']);
      const invalidExt = fileValidator.validateFileExtension('document.pdf', ['.md', '.txt']);
      
      // Then it should return appropriate validation results
      expect(validMd.isValid).toBe(true);
      expect(validTxt.isValid).toBe(true);
      expect(invalidExt.isValid).toBe(false);
      expect(invalidExt.errors).toContain('File extension .pdf is not allowed');
    });

    it('should validate file size correctly', () => {
      // Given a FileValidator instance
      // When validating file sizes
      const smallContent = 'Small content';
      const largeContent = 'x'.repeat(1000000); // 1MB
      
      const validSize = fileValidator.validateFileSize(smallContent, 5000000); // 5MB limit
      const invalidSize = fileValidator.validateFileSize(largeContent, 100000); // 100KB limit
      
      // Then it should return appropriate validation results
      expect(validSize.isValid).toBe(true);
      expect(invalidSize.isValid).toBe(false);
      expect(invalidSize.errors[0]).toContain('File size exceeds maximum allowed size');
    });

    it('should validate file permissions correctly', async () => {
      // Given a FileValidator instance
      // When validating file permissions
      const validPath = '/valid/path/to/file.md';
      const invalidPath = '/invalid/path/with/restricted/access';
      
      // Mock file system responses - these will fail in test environment
      const validResult = await fileValidator.validateFilePermissions(validPath, 'read');
      const invalidResult = await fileValidator.validateFilePermissions(invalidPath, 'write');
      
      // Then it should return appropriate validation results
      // In test environment, both will likely fail due to file system access
      expect(validResult.isValid).toBe(false);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors).toContain('Insufficient permissions for write access');
    });
  });

  describe('Validation Service Integration', () => {
    it('should validate complete UX-Kit workflow inputs', () => {
      // Given a ValidationService instance and workflow inputs
      const workflowInputs = {
        studyName: 'User Research Study',
        studyId: 'study-123',
        command: 'questions',
        config: {
          version: '1.0.0',
          aiAgent: { provider: 'cursor', settings: {} },
          storage: { basePath: './.uxkit/studies', format: 'markdown' }
        }
      };
      
      // When validating the complete workflow
      const result = validationService.validateWorkflow(workflowInputs);
      
      // Then it should be valid
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate and report multiple errors', () => {
      // Given a ValidationService instance and invalid workflow inputs
      const invalidInputs = {
        studyName: '',
        studyId: 'INVALID ID',
        command: 'invalid-command',
        config: {
          version: 'invalid',
          aiAgent: { provider: 'invalid', settings: {} },
          storage: { basePath: '', format: 'invalid' }
        }
      };
      
      // When validating the invalid workflow
      const result = validationService.validateWorkflow(invalidInputs);
      
      // Then it should be invalid with multiple errors
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(5);
    });

    it('should provide detailed error reporting', () => {
      // Given a ValidationService instance
      // When validation fails
      const result = validationService.validateStudyCreation({
        name: '',
        id: 'INVALID',
        description: 'a'.repeat(1001)
      });
      
      // Then it should provide detailed error information
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Study name is required');
      expect(result.errors).toContain('Study ID must contain only lowercase letters, numbers, and hyphens');
      expect(result.errors).toContain('Description must be 1000 characters or less');
    });

    it('should validate research command inputs', () => {
      // Given a ValidationService instance
      // When validating research command inputs
      const validInputs = validationService.validateResearchCommand({
        command: 'questions',
        studyId: 'study-123',
        options: { count: 5, category: 'user-research' }
      });
      
      const invalidInputs = validationService.validateResearchCommand({
        command: 'invalid-command',
        studyId: 'INVALID',
        options: { count: -1, category: '' }
      });
      
      // Then it should return appropriate validation results
      expect(validInputs.isValid).toBe(true);
      expect(invalidInputs.isValid).toBe(false);
      expect(invalidInputs.errors).toContain('Invalid command: invalid-command');
      expect(invalidInputs.errors).toContain('Study ID must contain only lowercase letters, numbers, and hyphens');
      expect(invalidInputs.errors).toContain('Question count must be positive');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle null and undefined inputs gracefully', () => {
      // Given a ValidationService instance
      // When validating null or undefined inputs
      const nullResult = validationService.validateStudyCreation(null as any);
      const undefinedResult = validationService.validateStudyCreation(undefined as any);
      
      // Then it should handle gracefully
      expect(nullResult.isValid).toBe(false);
      expect(undefinedResult.isValid).toBe(false);
      expect(nullResult.errors).toContain('Input is required');
      expect(undefinedResult.errors).toContain('Input is required');
    });

    it('should handle malformed configuration objects', () => {
      // Given a ConfigValidator instance
      // When validating malformed configuration
      const malformedConfig = {
        version: 123, // Should be string
        aiAgent: 'not-an-object', // Should be object
        storage: null // Should be object
      };
      
      const result = configValidator.validateConfig(malformedConfig);
      
      // Then it should handle gracefully
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate with custom validation rules', () => {
      // Given a ValidationService instance with custom rules
      const customRules = {
        studyName: {
          field: 'studyName',
          minLength: 5,
          maxLength: 50,
          pattern: /^[A-Za-z0-9\s-]+$/
        }
      };
      
      // When validating with custom rules
      const validResult = validationService.validateWithCustomRules('Study 123', customRules);
      const invalidResult = validationService.validateWithCustomRules('Ab', customRules);
      
      // Then it should apply custom rules
      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors).toContain('studyName must be at least 5 characters long');
    });
  });
});
