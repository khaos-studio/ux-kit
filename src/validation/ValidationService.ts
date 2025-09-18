/**
 * Validation Service
 * 
 * Main validation service that orchestrates all validation operations.
 */

import { ValidationResult, createSuccessResult, createErrorResult, ValidationRule } from './ValidationResult';
import { InputValidator } from './InputValidator';
import { ConfigValidator, UXKitConfig } from './ConfigValidator';
import { FileValidator } from './FileValidator';

export interface WorkflowInputs {
  studyName: string;
  studyId: string;
  command: string;
  config: UXKitConfig;
}

export interface StudyCreationInputs {
  name: string;
  id: string;
  description?: string;
}

export interface ResearchCommandInputs {
  command: string;
  studyId: string;
  options?: {
    count?: number;
    category?: string;
    [key: string]: any;
  };
}

export class ValidationService {
  private inputValidator: InputValidator;
  private configValidator: ConfigValidator;
  private fileValidator: FileValidator;

  constructor() {
    this.inputValidator = new InputValidator();
    this.configValidator = new ConfigValidator();
    this.fileValidator = new FileValidator();
  }

  /**
   * Validate complete UX-Kit workflow inputs
   */
  validateWorkflow(inputs: WorkflowInputs): ValidationResult {
    const errors: string[] = [];

    // Validate study name
    const studyNameResult = this.inputValidator.validateStudyName(inputs.studyName);
    if (!studyNameResult.isValid) {
      errors.push(...studyNameResult.errors);
    }

    // Validate study ID
    const studyIdResult = this.inputValidator.validateStudyId(inputs.studyId);
    if (!studyIdResult.isValid) {
      errors.push(...studyIdResult.errors);
    }

    // Validate command
    const commandResult = this.inputValidator.validateCommandArgs([inputs.command]);
    if (!commandResult.isValid) {
      errors.push(...commandResult.errors);
    }

    // Validate configuration
    const configResult = this.configValidator.validateConfig(inputs.config);
    if (!configResult.isValid) {
      errors.push(...configResult.errors);
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate study creation inputs
   */
  validateStudyCreation(inputs: StudyCreationInputs | null | undefined): ValidationResult {
    const errors: string[] = [];

    if (!inputs) {
      errors.push('Input is required');
      return createErrorResult(errors);
    }

    // Validate study name
    const studyNameResult = this.inputValidator.validateStudyName(inputs.name);
    if (!studyNameResult.isValid) {
      errors.push(...studyNameResult.errors);
    }

    // Validate study ID
    const studyIdResult = this.inputValidator.validateStudyId(inputs.id);
    if (!studyIdResult.isValid) {
      errors.push(...studyIdResult.errors);
    }

    // Validate description if provided
    if (inputs.description !== undefined) {
      const descriptionResult = this.inputValidator.validateStringLength(
        inputs.description,
        0,
        1000,
        'Description'
      );
      if (!descriptionResult.isValid) {
        errors.push(...descriptionResult.errors);
      }
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate research command inputs
   */
  validateResearchCommand(inputs: ResearchCommandInputs): ValidationResult {
    const errors: string[] = [];

    // Validate command
    const commandResult = this.inputValidator.validateCommandArgs([inputs.command]);
    if (!commandResult.isValid) {
      errors.push(...commandResult.errors);
    }

    // Validate study ID
    const studyIdResult = this.inputValidator.validateStudyId(inputs.studyId);
    if (!studyIdResult.isValid) {
      errors.push(...studyIdResult.errors);
    }

    // Validate options if provided
    if (inputs.options) {
      if (inputs.options.count !== undefined) {
        const countResult = this.inputValidator.validatePositiveNumber(
          inputs.options.count,
          'Question count'
        );
        if (!countResult.isValid) {
          errors.push(...countResult.errors);
        }
      }

      if (inputs.options.category !== undefined && inputs.options.category.trim() === '') {
        errors.push('Category cannot be empty');
      }
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate with custom rules
   */
  validateWithCustomRules(value: string, rules: Record<string, ValidationRule>): ValidationResult {
    const errors: string[] = [];

    for (const [fieldName, rule] of Object.entries(rules)) {
      // Required validation
      if (rule.required && (!value || value.trim().length === 0)) {
        errors.push(`${fieldName} is required`);
        continue;
      }

      // Skip other validations if value is empty and not required
      if (!value || value.trim().length === 0) {
        continue;
      }

      // Length validations
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        errors.push(`${fieldName} must be at least ${rule.minLength} characters long`);
      }

      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        errors.push(`${fieldName} must be ${rule.maxLength} characters or less`);
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(rule.errorMessage || `${fieldName} format is invalid`);
      }

      // Custom validator
      if (rule.customValidator && !rule.customValidator(value)) {
        errors.push(rule.errorMessage || `${fieldName} is invalid`);
      }
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate file upload
   */
  async validateFileUpload(filePath: string, allowedExtensions: string[], maxSizeBytes: number): Promise<ValidationResult> {
    const errors: string[] = [];

    // Validate file path format
    const pathResult = this.fileValidator.validateFilePathFormat(filePath);
    if (!pathResult.isValid) {
      errors.push(...pathResult.errors);
    }

    // Validate file extension
    const extensionResult = this.fileValidator.validateFileExtension(filePath, allowedExtensions);
    if (!extensionResult.isValid) {
      errors.push(...extensionResult.errors);
    }

    // Validate file exists
    const existsResult = await this.fileValidator.validateFileExists(filePath);
    if (!existsResult.isValid) {
      errors.push(...existsResult.errors);
    } else {
      // Validate file size
      try {
        const content = await require('fs/promises').readFile(filePath, 'utf8');
        const sizeResult = this.fileValidator.validateFileSize(content, maxSizeBytes);
        if (!sizeResult.isValid) {
          errors.push(...sizeResult.errors);
        }
      } catch (error) {
        errors.push('Unable to read file for size validation');
      }
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate template file
   */
  validateTemplateFile(content: string, requiredVariables: string[] = []): ValidationResult {
    const errors: string[] = [];

    // Validate template syntax
    const templateResult = this.fileValidator.validateTemplate(content);
    if (!templateResult.isValid) {
      errors.push(...templateResult.errors);
    }

    // Check for required variables
    for (const variable of requiredVariables) {
      const variablePattern = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
      if (!variablePattern.test(content)) {
        errors.push(`Required variable '${variable}' is missing from template`);
      }
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Validate configuration file
   */
  validateConfigurationFile(filePath: string, content: string): ValidationResult {
    const errors: string[] = [];

    // Validate file path
    const pathResult = this.configValidator.validateConfigFilePath(filePath);
    if (!pathResult.isValid) {
      errors.push(...pathResult.errors);
    }

    // Validate YAML content
    const yamlResult = this.configValidator.validateYamlConfig(content);
    if (!yamlResult.isValid) {
      errors.push(...yamlResult.errors);
    }

    return errors.length === 0 ? createSuccessResult() : createErrorResult(errors);
  }

  /**
   * Get input validator
   */
  getInputValidator(): InputValidator {
    return this.inputValidator;
  }

  /**
   * Get config validator
   */
  getConfigValidator(): ConfigValidator {
    return this.configValidator;
  }

  /**
   * Get file validator
   */
  getFileValidator(): FileValidator {
    return this.fileValidator;
  }
}
