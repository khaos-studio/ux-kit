/**
 * Unit Tests for CommandParser
 */

import { CommandParser, ParsedCommand } from '../../../src/slash/CommandParser';

describe('CommandParser', () => {
  let parser: CommandParser;

  beforeEach(() => {
    parser = new CommandParser();
  });

  describe('parse', () => {
    it('should parse simple command without parameters', () => {
      const result = parser.parse('/study:list');

      expect(result.command).toBe('study:list');
      expect(result.parameters).toEqual({});
    });

    it('should parse command with single parameter', () => {
      const result = parser.parse('/study:show --name="test-study"');

      expect(result.command).toBe('study:show');
      expect(result.parameters).toEqual({
        name: 'test-study'
      });
    });

    it('should parse command with multiple parameters', () => {
      const result = parser.parse('/research:questions --study="user-interviews" --topic="e-commerce" --count=10');

      expect(result.command).toBe('research:questions');
      expect(result.parameters).toEqual({
        study: 'user-interviews',
        topic: 'e-commerce',
        count: 10
      });
    });

    it('should parse command with boolean flags', () => {
      const result = parser.parse('/study:delete --name="test-study" --confirm --force');

      expect(result.command).toBe('study:delete');
      expect(result.parameters).toEqual({
        name: 'test-study',
        confirm: true,
        force: true
      });
    });

    it('should parse command with mixed parameter types', () => {
      const result = parser.parse('/research:questions --study="user-interviews" --count=5 --format="markdown" --verbose');

      expect(result.command).toBe('research:questions');
      expect(result.parameters).toEqual({
        study: 'user-interviews',
        count: 5,
        format: 'markdown',
        verbose: true
      });
    });

    it('should handle quoted strings with spaces', () => {
      const result = parser.parse('/research:sources --study="user interviews 2024" --keywords="UX research, usability testing"');

      expect(result.command).toBe('research:sources');
      expect(result.parameters).toEqual({
        study: 'user interviews 2024',
        keywords: 'UX research, usability testing'
      });
    });

    it('should handle single quotes', () => {
      const result = parser.parse("/research:questions --study='user-interviews' --topic='e-commerce checkout'");

      expect(result.command).toBe('research:questions');
      expect(result.parameters).toEqual({
        study: 'user-interviews',
        topic: 'e-commerce checkout'
      });
    });

    it('should handle key=value format', () => {
      const result = parser.parse('/study:list --format="table" --filter="active"');

      expect(result.command).toBe('study:list');
      expect(result.parameters).toEqual({
        format: 'table',
        filter: 'active'
      });
    });

    it('should throw error for empty command', () => {
      expect(() => parser.parse('')).toThrow('Empty command');
      expect(() => parser.parse('   ')).toThrow('Empty command');
    });

    it('should throw error for command without slash prefix', () => {
      expect(() => parser.parse('study:list')).toThrow('Command must start with /');
    });

    it('should throw error for invalid command format', () => {
      expect(() => parser.parse('/')).toThrow('Invalid command format');
    });

    it('should handle special characters in values', () => {
      const result = parser.parse('/research:questions --study="user-interviews-2024" --topic="e-commerce & UX"');

      expect(result.command).toBe('research:questions');
      expect(result.parameters).toEqual({
        study: 'user-interviews-2024',
        topic: 'e-commerce & UX'
      });
    });

    it('should parse numeric values correctly', () => {
      const result = parser.parse('/research:questions --count=10 --limit=25');

      expect(result.command).toBe('research:questions');
      expect(result.parameters).toEqual({
        count: 10,
        limit: 25
      });
    });

    it('should parse boolean values correctly', () => {
      const result = parser.parse('/research:questions --verbose=true --debug=false');

      expect(result.command).toBe('research:questions');
      expect(result.parameters).toEqual({
        verbose: true,
        debug: false
      });
    });
  });

  describe('validate', () => {
    it('should validate valid command', () => {
      const parsedCommand: ParsedCommand = {
        command: 'research:questions',
        parameters: {
          study: 'user-interviews',
          topic: 'e-commerce'
        }
      };

      const result = parser.validate(parsedCommand);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject unknown command', () => {
      const parsedCommand: ParsedCommand = {
        command: 'unknown:command',
        parameters: {}
      };

      const result = parser.validate(parsedCommand);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Unknown command');
    });

    it('should reject command with missing required parameters', () => {
      const parsedCommand: ParsedCommand = {
        command: 'research:questions',
        parameters: {
          study: 'user-interviews'
          // Missing required 'topic' parameter
        }
      };

      const result = parser.validate(parsedCommand);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Required parameter missing: topic');
    });

    it('should reject command with invalid parameter type', () => {
      const parsedCommand: ParsedCommand = {
        command: 'research:questions',
        parameters: {
          study: 'user-interviews',
          topic: 'e-commerce',
          count: 'invalid' // Should be number
        }
      };

      const result = parser.validate(parsedCommand);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid parameter type for count: expected number, got string');
    });

    it('should collect multiple validation errors', () => {
      const parsedCommand: ParsedCommand = {
        command: 'research:questions',
        parameters: {
          study: 123, // Wrong type
          count: 'invalid' // Wrong type
          // Missing required 'topic' parameter
        }
      };

      const result = parser.validate(parsedCommand);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain('Required parameter missing: topic');
      expect(result.errors).toContain('Invalid parameter type for study: expected string, got number');
      expect(result.errors).toContain('Invalid parameter type for count: expected number, got string');
    });

    it('should validate optional parameters', () => {
      const parsedCommand: ParsedCommand = {
        command: 'research:questions',
        parameters: {
          study: 'user-interviews',
          topic: 'e-commerce',
          count: 10, // Optional parameter
          format: 'markdown' // Optional parameter
        }
      };

      const result = parser.validate(parsedCommand);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('getAvailableCommands', () => {
    it('should return list of available commands', () => {
      const commands = parser.getAvailableCommands();

      expect(commands).toContain('research:questions');
      expect(commands).toContain('research:sources');
      expect(commands).toContain('research:summarize');
      expect(commands).toContain('research:interview');
      expect(commands).toContain('research:synthesize');
      expect(commands).toContain('study:create');
      expect(commands).toContain('study:list');
      expect(commands).toContain('study:show');
      expect(commands).toContain('study:delete');
    });
  });

  describe('getCommandSchema', () => {
    it('should return command schema for valid command', () => {
      const schema = parser.getCommandSchema('research:questions');

      expect(schema).toBeDefined();
      expect(schema?.name).toBe('research:questions');
      expect(schema?.required).toContain('study');
      expect(schema?.required).toContain('topic');
      expect(schema?.optional).toContain('count');
      expect(schema?.optional).toContain('format');
    });

    it('should return undefined for invalid command', () => {
      const schema = parser.getCommandSchema('unknown:command');

      expect(schema).toBeUndefined();
    });
  });
});
