/**
 * Command Parser for Slash Commands
 * 
 * Parses slash commands and extracts command name and parameters.
 */

export interface ParsedCommand {
  command: string;
  parameters: Record<string, any>;
}

export interface CommandSchema {
  name: string;
  required: string[];
  optional: string[];
  types: Record<string, 'string' | 'number' | 'boolean'>;
}

export class CommandParser {
  private commandSchemas: Map<string, CommandSchema> = new Map();

  constructor() {
    this.initializeCommandSchemas();
  }

  /**
   * Parse a slash command string
   */
  parse(commandString: string): ParsedCommand {
    if (!commandString || !commandString.trim()) {
      throw new Error('Empty command');
    }

    const trimmed = commandString.trim();

    if (!trimmed.startsWith('/')) {
      throw new Error('Command must start with /');
    }

    const parts = this.parseCommandParts(trimmed.substring(1));
    const command = parts[0];

    if (!command) {
      throw new Error('Invalid command format');
    }

    const parameters = this.parseParameters(parts.slice(1));

    return {
      command,
      parameters
    };
  }

  /**
   * Validate parsed command against schema
   */
  validate(parsedCommand: ParsedCommand): { isValid: boolean; errors: string[] } {
    const schema = this.commandSchemas.get(parsedCommand.command);
    const errors: string[] = [];

    if (!schema) {
      return {
        isValid: false,
        errors: ['Unknown command']
      };
    }

    // Check required parameters
    for (const required of schema.required) {
      if (!(required in parsedCommand.parameters)) {
        errors.push(`Required parameter missing: ${required}`);
      }
    }

    // Validate parameter types
    for (const [key, value] of Object.entries(parsedCommand.parameters)) {
      const expectedType = schema.types[key];
      if (expectedType && !this.isValidType(value, expectedType)) {
        errors.push(`Invalid parameter type for ${key}: expected ${expectedType}, got ${typeof value}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Parse command parts handling quoted strings
   */
  private parseCommandParts(commandString: string): string[] {
    const parts: string[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < commandString.length; i++) {
      const char = commandString[i];

      if (!inQuotes && (char === '"' || char === "'")) {
        inQuotes = true;
        quoteChar = char;
      } else if (inQuotes && char === quoteChar) {
        inQuotes = false;
        quoteChar = '';
      } else if (!inQuotes && char === ' ') {
        if (current.trim()) {
          parts.push(current.trim());
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      parts.push(current.trim());
    }

    return parts;
  }

  /**
   * Parse command parameters from string array
   */
  private parseParameters(parts: string[]): Record<string, any> {
    const parameters: Record<string, any> = {};

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (part && part.startsWith('--')) {
        const key = part.substring(2);
        
        // Check if this is a key=value format
        if (key.includes('=')) {
          const [paramKey, paramValue] = key.split('=', 2);
          if (paramKey && paramValue !== undefined) {
            parameters[paramKey] = this.parseValue(paramValue);
          }
        } else {
          const nextPart = parts[i + 1];

          if (nextPart && !nextPart.startsWith('--')) {
            // Parameter with value
            parameters[key] = this.parseValue(nextPart);
            i++; // Skip the value part
          } else {
            // Boolean flag
            parameters[key] = true;
          }
        }
      }
    }

    return parameters;
  }

  /**
   * Parse a parameter value
   */
  private parseValue(value: string): any {
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }

    // Try to parse as number
    if (!isNaN(Number(value))) {
      return Number(value);
    }

    // Try to parse as boolean
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Return as string
    return value;
  }

  /**
   * Check if value matches expected type
   */
  private isValidType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      default:
        return false;
    }
  }

  /**
   * Initialize command schemas
   */
  private initializeCommandSchemas(): void {
    // Research commands
    this.commandSchemas.set('research:questions', {
      name: 'research:questions',
      required: ['study', 'topic'],
      optional: ['count', 'format'],
      types: {
        study: 'string',
        topic: 'string',
        count: 'number',
        format: 'string'
      }
    });

    this.commandSchemas.set('research:sources', {
      name: 'research:sources',
      required: ['study', 'keywords'],
      optional: ['format', 'limit'],
      types: {
        study: 'string',
        keywords: 'string',
        format: 'string',
        limit: 'number'
      }
    });

    this.commandSchemas.set('research:summarize', {
      name: 'research:summarize',
      required: ['study'],
      optional: ['format', 'length'],
      types: {
        study: 'string',
        format: 'string',
        length: 'string'
      }
    });

    this.commandSchemas.set('research:interview', {
      name: 'research:interview',
      required: ['study', 'participant'],
      optional: ['format', 'template'],
      types: {
        study: 'string',
        participant: 'string',
        format: 'string',
        template: 'string'
      }
    });

    this.commandSchemas.set('research:synthesize', {
      name: 'research:synthesize',
      required: ['study', 'insights'],
      optional: ['format', 'output'],
      types: {
        study: 'string',
        insights: 'string',
        format: 'string',
        output: 'string'
      }
    });

    // Study commands
    this.commandSchemas.set('study:create', {
      name: 'study:create',
      required: ['name', 'description'],
      optional: ['template', 'format'],
      types: {
        name: 'string',
        description: 'string',
        template: 'string',
        format: 'string'
      }
    });

    this.commandSchemas.set('study:list', {
      name: 'study:list',
      required: [],
      optional: ['format', 'filter'],
      types: {
        format: 'string',
        filter: 'string'
      }
    });

    this.commandSchemas.set('study:show', {
      name: 'study:show',
      required: ['name'],
      optional: ['format', 'details'],
      types: {
        name: 'string',
        format: 'string',
        details: 'boolean'
      }
    });

    this.commandSchemas.set('study:delete', {
      name: 'study:delete',
      required: ['name'],
      optional: ['confirm', 'force'],
      types: {
        name: 'string',
        confirm: 'boolean',
        force: 'boolean'
      }
    });
  }

  /**
   * Get available commands
   */
  getAvailableCommands(): string[] {
    return Array.from(this.commandSchemas.keys());
  }

  /**
   * Get command schema
   */
  getCommandSchema(command: string): CommandSchema | undefined {
    return this.commandSchemas.get(command);
  }
}
