/**
 * TemplateEngine - Handles template rendering with variable substitution
 * 
 * This class provides template rendering capabilities using Handlebars-style syntax
 * for variable substitution, conditionals, and iteration.
 */

export interface TemplateVariables {
  [key: string]: any;
}

export interface TemplatePartials {
  [key: string]: string;
}

export class TemplateEngine {
  /**
   * Renders a template with the provided variables
   * @param template The template string to render
   * @param variables The variables to substitute in the template
   * @returns The rendered template string
   */
  async render(template: string, variables: TemplateVariables): Promise<string> {
    try {
      // First validate the template syntax
      if (this.hasUnclosedBraces(template)) {
        throw new Error('Template rendering failed');
      }
      
      return this.renderTemplate(template, variables);
    } catch (error) {
      throw new Error('Template rendering failed');
    }
  }

  /**
   * Renders a template with partials and variables
   * @param template The template string to render
   * @param partials The partial templates to include
   * @param variables The variables to substitute in the template
   * @returns The rendered template string
   */
  async renderWithPartials(
    template: string, 
    partials: TemplatePartials, 
    variables: TemplateVariables
  ): Promise<string> {
    try {
      // First, replace partials in the template
      let processedTemplate = template;
      for (const [name, partial] of Object.entries(partials)) {
        const partialRegex = new RegExp(`{{>\\s*${name}\\s*}}`, 'g');
        processedTemplate = processedTemplate.replace(partialRegex, partial);
      }
      
      // Then render with variables
      return this.renderTemplate(processedTemplate, variables);
    } catch (error) {
      throw new Error('Template rendering failed');
    }
  }

  /**
   * Internal method to render template with variables
   * @param template The template string
   * @param variables The variables to substitute
   * @returns The rendered template string
   */
  private renderTemplate(template: string, variables: TemplateVariables): string {
    let result = template;
    let previousResult = '';

    // Keep processing until no more changes occur (for nested structures)
    while (result !== previousResult) {
      previousResult = result;

      // Handle iteration blocks {{#each array}}...{{/each}} first
      result = this.renderIterations(result, variables);

      // Handle conditional blocks {{#if condition}}...{{/if}}
      result = this.renderConditionals(result, variables);

      // Handle simple variable substitution {{variable}} last
      result = result.replace(/\{\{([^}]+)\}\}/g, (match, variablePath) => {
        const trimmedPath = variablePath.trim();
        
        // Skip control structures that were already processed
        if (trimmedPath.startsWith('#if') || 
            trimmedPath.startsWith('#each') || 
            trimmedPath.startsWith('/if') || 
            trimmedPath.startsWith('/each') ||
            trimmedPath.startsWith('>')) {
          return match;
        }
        
        return this.getVariableValue(variables, trimmedPath);
      });
    }

    return result;
  }

  /**
   * Gets the value of a variable from the variables object
   * @param variables The variables object
   * @param path The dot-notation path to the variable
   * @returns The variable value or empty string if not found
   */
  private getVariableValue(variables: TemplateVariables, path: string): any {
    const parts = path.split('.');
    let current: any = variables;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return '';
      }
    }

    return current !== null && current !== undefined ? current : '';
  }

  /**
   * Renders conditional blocks in the template
   * @param template The template string
   * @param variables The variables object
   * @returns The template with conditionals rendered
   */
  private renderConditionals(template: string, variables: TemplateVariables): string {
    const conditionalRegex = /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
    
    return template.replace(conditionalRegex, (match, condition, content) => {
      const conditionValue = this.getVariableValue(variables, condition.trim());
      const isTruthy = conditionValue && conditionValue !== 'false' && conditionValue !== '0';
      
      // Check if there's an else block
      const elseRegex = /([\s\S]*?)\{\{else\}\}([\s\S]*)/;
      const elseMatch = content.match(elseRegex);
      
      if (elseMatch) {
        const ifContent = elseMatch[1];
        const elseContent = elseMatch[2];
        
        if (isTruthy) {
          // Render the if content with full template processing
          return this.renderTemplate(ifContent, variables);
        } else {
          // Render the else content with full template processing
          return this.renderTemplate(elseContent, variables);
        }
      } else {
        // No else block, just render if content
        if (isTruthy) {
          return this.renderTemplate(content, variables);
        } else {
          return '';
        }
      }
    });
  }

  /**
   * Renders iteration blocks in the template
   * @param template The template string
   * @param variables The variables object
   * @returns The template with iterations rendered
   */
  private renderIterations(template: string, variables: TemplateVariables): string {
    const iterationRegex = /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
    
    return template.replace(iterationRegex, (match, arrayPath, content) => {
      const arrayValue = this.getVariableValue(variables, arrayPath.trim());
      
      if (!Array.isArray(arrayValue)) {
        return '';
      }

      return arrayValue.map((item, index) => {
        let itemContent = content;
        
        // Replace {{this}} with the current item
        itemContent = itemContent.replace(/\{\{this\}\}/g, String(item));
        
        // Replace object properties in the item content
        if (typeof item === 'object' && item !== null) {
          for (const [key, value] of Object.entries(item)) {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            itemContent = itemContent.replace(regex, String(value));
          }
          
          // Handle conditional blocks within the item
          itemContent = this.renderConditionals(itemContent, item);
        }
        
        // Handle {{#unless @last}} blocks
        itemContent = itemContent.replace(/\{\{#unless\s+@last\}\}([\s\S]*?)\{\{\/unless\}\}/g, (_unlessMatch: string, unlessContent: string) => {
          return index < arrayValue.length - 1 ? unlessContent : '';
        });
        
        return itemContent;
      }).join('');
    });
  }

  /**
   * Checks if template has unclosed braces
   * @param template The template string
   * @returns True if there are unclosed braces
   */
  private hasUnclosedBraces(template: string): boolean {
    const openBraces = (template.match(/\{\{/g) || []).length;
    const closeBraces = (template.match(/\}\}/g) || []).length;
    return openBraces !== closeBraces;
  }
}
