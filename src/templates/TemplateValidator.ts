/**
 * TemplateValidator - Validates template syntax and variables
 * 
 * This class provides validation for template syntax, variables, and file existence.
 */

import { IFileSystemService } from '../contracts/infrastructure-contracts';
import { TemplateVariables } from './TemplateEngine';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class TemplateValidator {
  /**
   * Validates template syntax
   * @param template The template string to validate
   * @returns Validation result with errors if any
   */
  async validate(template: string): Promise<ValidationResult> {
    const errors: string[] = [];

    // Check for unclosed braces
    const openBraces = (template.match(/\{\{/g) || []).length;
    const closeBraces = (template.match(/\}\}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      errors.push('Unclosed template braces detected');
    }

    // Check for malformed conditionals
    const ifBlocks = (template.match(/\{\{#if\s+[^}]+\}\}/g) || []).length;
    const endIfBlocks = (template.match(/\{\{\/if\}\}/g) || []).length;
    
    if (ifBlocks !== endIfBlocks) {
      errors.push('Mismatched {{#if}} and {{/if}} blocks');
    }

    // Check for malformed iterations
    const eachBlocks = (template.match(/\{\{#each\s+[^}]+\}\}/g) || []).length;
    const endEachBlocks = (template.match(/\{\{\/each\}\}/g) || []).length;
    
    if (eachBlocks !== endEachBlocks) {
      errors.push('Mismatched {{#each}} and {{/each}} blocks');
    }

    // Check for nested braces (basic check)
    if (template.includes('{{{{') || template.includes('}}}}')) {
      errors.push('Nested braces detected');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates that all required variables are provided
   * @param template The template string
   * @param variables The variables object
   * @returns Validation result with missing variables if any
   */
  async validateVariables(template: string, variables: TemplateVariables): Promise<ValidationResult> {
    const errors: string[] = [];
    
    // Extract all variable references from the template
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const requiredVariables = new Set<string>();
    
    let match;
    while ((match = variableRegex.exec(template)) !== null) {
      const variablePath = match[1]?.trim() || '';
      
      // Skip control structures
      if (variablePath.startsWith('#if') || 
          variablePath.startsWith('#each') || 
          variablePath.startsWith('/if') || 
          variablePath.startsWith('/each') ||
          variablePath.startsWith('>')) {
        continue;
      }
      
      // Skip 'this' in each blocks
      if (variablePath === 'this') {
        continue;
      }
      
      requiredVariables.add(variablePath);
    }

    // Check if all required variables are provided
    for (const variablePath of requiredVariables) {
      if (!this.hasVariable(variables, variablePath)) {
        errors.push(`Missing required variable: ${variablePath}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates that a template file exists and is readable
   * @param templatePath The path to the template file
   * @param fileSystem The file system service
   * @returns Validation result
   */
  async validateFile(templatePath: string, fileSystem: IFileSystemService): Promise<ValidationResult> {
    const errors: string[] = [];

    try {
      const exists = await fileSystem.pathExists(templatePath);
      if (!exists) {
        errors.push('Template file does not exist');
      } else {
        // Try to read the file to ensure it's readable
        try {
          await fileSystem.readFile(templatePath);
        } catch (readError) {
          errors.push('Template file is not readable');
        }
      }
    } catch (error) {
      errors.push('Template file does not exist');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates template content for common issues
   * @param template The template content
   * @returns Validation result with warnings and errors
   */
  async validateContent(template: string): Promise<ValidationResult> {
    const errors: string[] = [];

    // Check for empty template
    if (!template || template.trim().length === 0) {
      errors.push('Template is empty');
    }

    // Check for very long lines (potential issues)
    const lines = template.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line && line.length > 200) {
        errors.push(`Line ${i + 1} is very long (${line.length} characters)`);
      }
    }

    // Check for potential infinite loops in each blocks
    const eachBlocks = template.match(/\{\{#each\s+[^}]+\}[\s\S]*?\{\{\/each\}\}/g) || [];
    for (const block of eachBlocks) {
      if (block.includes('{{#each') && block.includes('{{/each}}')) {
        const nestedEach = block.match(/\{\{#each/g) || [];
        if (nestedEach.length > 1) {
          errors.push('Nested {{#each}} blocks detected - may cause performance issues');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Checks if a variable exists in the variables object
   * @param variables The variables object
   * @param path The dot-notation path to the variable
   * @returns True if the variable exists, false otherwise
   */
  private hasVariable(variables: TemplateVariables, path: string): boolean {
    const parts = path.split('.');
    let current: any = variables;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return false;
      }
    }

    return current !== null && current !== undefined;
  }
}
