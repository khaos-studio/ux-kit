/**
 * Unit Tests for ResponseFormatter
 */

import { ResponseFormatter, CommandResponse, IDECommandRequest } from '../../../src/slash/ResponseFormatter';

describe('ResponseFormatter', () => {
  let formatter: ResponseFormatter;

  beforeEach(() => {
    formatter = new ResponseFormatter();
  });

  describe('formatSuccess', () => {
    it('should format successful command response', () => {
      const response = formatter.formatSuccess(
        'research:questions',
        { study: 'user-interviews', topic: 'e-commerce' },
        'Research questions generated successfully',
        150,
        { timestamp: '2024-01-18' }
      );

      expect(response.success).toBe(true);
      expect(response.command).toBe('research:questions');
      expect(response.parameters).toEqual({ study: 'user-interviews', topic: 'e-commerce' });
      expect(response.response).toBe('Research questions generated successfully');
      expect(response.executionTime).toBe(150);
      expect(response.metadata).toEqual({ timestamp: '2024-01-18' });
      expect(response.timestamp).toBeInstanceOf(Date);
    });

    it('should format successful response without metadata', () => {
      const response = formatter.formatSuccess(
        'study:list',
        {},
        'Studies listed successfully',
        50
      );

      expect(response.success).toBe(true);
      expect(response.command).toBe('study:list');
      expect(response.parameters).toEqual({});
      expect(response.response).toBe('Studies listed successfully');
      expect(response.executionTime).toBe(50);
      expect(response.metadata).toBeUndefined();
    });
  });

  describe('formatError', () => {
    it('should format error command response', () => {
      const response = formatter.formatError(
        'research:questions',
        { study: 'user-interviews' },
        'Required parameter missing: topic',
        25,
        { errorCode: 'VALIDATION_ERROR' }
      );

      expect(response.success).toBe(false);
      expect(response.command).toBe('research:questions');
      expect(response.parameters).toEqual({ study: 'user-interviews' });
      expect(response.error).toBe('Required parameter missing: topic');
      expect(response.executionTime).toBe(25);
      expect(response.metadata).toEqual({ errorCode: 'VALIDATION_ERROR' });
      expect(response.timestamp).toBeInstanceOf(Date);
    });

    it('should format error response without metadata', () => {
      const response = formatter.formatError(
        'unknown:command',
        {},
        'Unknown command',
        10
      );

      expect(response.success).toBe(false);
      expect(response.command).toBe('unknown:command');
      expect(response.parameters).toEqual({});
      expect(response.error).toBe('Unknown command');
      expect(response.executionTime).toBe(10);
      expect(response.metadata).toBeUndefined();
    });
  });

  describe('formatIDEResponse', () => {
    it('should format successful IDE command response', () => {
      const request: IDECommandRequest = {
        command: '/research:questions --study="user-interviews"',
        context: {
          workspace: '/path/to/workspace',
          file: 'research.md'
        }
      };

      const response = formatter.formatIDEResponse(
        request,
        true,
        'Command executed successfully',
        undefined,
        100
      );

      expect(response.success).toBe(true);
      expect(response.response).toBe('Command executed successfully');
      expect(response.error).toBeUndefined();
      expect(response.context).toEqual({
        workspace: '/path/to/workspace',
        file: 'research.md'
      });
      expect(response.executionTime).toBe(100);
      expect(response.timestamp).toBeInstanceOf(Date);
    });

    it('should format error IDE command response', () => {
      const request: IDECommandRequest = {
        command: '/invalid:command',
        context: {
          workspace: '/path/to/workspace'
        }
      };

      const response = formatter.formatIDEResponse(
        request,
        false,
        undefined,
        'Command execution failed',
        50
      );

      expect(response.success).toBe(false);
      expect(response.response).toBeUndefined();
      expect(response.error).toBe('Command execution failed');
      expect(response.context).toEqual({
        workspace: '/path/to/workspace'
      });
      expect(response.executionTime).toBe(50);
    });
  });

  describe('formatHelpResponse', () => {
    it('should format help response', () => {
      const response = formatter.formatHelpResponse(
        'research:questions',
        'Help text for research:questions command',
        25
      );

      expect(response.success).toBe(true);
      expect(response.command).toBe('help');
      expect(response.parameters).toEqual({ command: 'research:questions' });
      expect(response.response).toBe('Help text for research:questions command');
      expect(response.executionTime).toBe(25);
    });
  });

  describe('formatCommandListResponse', () => {
    it('should format command list response', () => {
      const commands = ['research:questions', 'research:sources', 'study:list'];
      const response = formatter.formatCommandListResponse(commands, 30);

      expect(response.success).toBe(true);
      expect(response.command).toBe('list');
      expect(response.parameters).toEqual({});
      expect(response.response).toContain('Available commands:');
      expect(response.response).toContain('- research:questions');
      expect(response.response).toContain('- research:sources');
      expect(response.response).toContain('- study:list');
      expect(response.executionTime).toBe(30);
    });
  });

  describe('formatValidationError', () => {
    it('should format validation error response', () => {
      const errors = ['Required parameter missing: study', 'Invalid parameter type for count'];
      const response = formatter.formatValidationError(
        'research:questions',
        { topic: 'e-commerce' },
        errors,
        20
      );

      expect(response.success).toBe(false);
      expect(response.command).toBe('research:questions');
      expect(response.parameters).toEqual({ topic: 'e-commerce' });
      expect(response.error).toContain('Validation failed:');
      expect(response.error).toContain('- Required parameter missing: study');
      expect(response.error).toContain('- Invalid parameter type for count');
      expect(response.executionTime).toBe(20);
    });
  });

  describe('formatParsingError', () => {
    it('should format parsing error response', () => {
      const response = formatter.formatParsingError(
        '/invalid command format',
        'Command must start with /',
        15
      );

      expect(response.success).toBe(false);
      expect(response.command).toBe('unknown');
      expect(response.parameters).toEqual({ original: '/invalid command format' });
      expect(response.error).toBe('Parsing error: Command must start with /');
      expect(response.executionTime).toBe(15);
    });
  });

  describe('formatExecutionError', () => {
    it('should format execution error response', () => {
      const response = formatter.formatExecutionError(
        'research:questions',
        { study: 'user-interviews', topic: 'e-commerce' },
        'Command execution failed',
        200
      );

      expect(response.success).toBe(false);
      expect(response.command).toBe('research:questions');
      expect(response.parameters).toEqual({ study: 'user-interviews', topic: 'e-commerce' });
      expect(response.error).toBe('Execution error: Command execution failed');
      expect(response.executionTime).toBe(200);
    });
  });

  describe('formatForDisplay', () => {
    it('should format successful response for display', () => {
      const response: CommandResponse = {
        success: true,
        command: 'research:questions',
        parameters: { study: 'user-interviews' },
        response: 'Research questions generated successfully',
        timestamp: new Date(),
        executionTime: 150
      };

      const displayText = formatter.formatForDisplay(response);

      expect(displayText).toContain('✅ research:questions');
      expect(displayText).toContain('Research questions generated successfully');
    });

    it('should format error response for display', () => {
      const response: CommandResponse = {
        success: false,
        command: 'research:questions',
        parameters: { study: 'user-interviews' },
        error: 'Required parameter missing: topic',
        timestamp: new Date(),
        executionTime: 25
      };

      const displayText = formatter.formatForDisplay(response);

      expect(displayText).toContain('❌ research:questions');
      expect(displayText).toContain('Required parameter missing: topic');
    });
  });

  describe('formatAsJSON', () => {
    it('should format response as JSON', () => {
      const response: CommandResponse = {
        success: true,
        command: 'study:list',
        parameters: {},
        response: 'Studies listed successfully',
        timestamp: new Date(),
        executionTime: 50
      };

      const json = formatter.formatAsJSON(response);
      const parsed = JSON.parse(json);

      expect(parsed.success).toBe(true);
      expect(parsed.command).toBe('study:list');
      expect(parsed.response).toBe('Studies listed successfully');
      expect(parsed.executionTime).toBe(50);
    });
  });

  describe('formatAsMarkdown', () => {
    it('should format successful response as markdown', () => {
      const response: CommandResponse = {
        success: true,
        command: 'research:questions',
        parameters: { study: 'user-interviews', topic: 'e-commerce' },
        response: 'Research questions generated successfully',
        timestamp: new Date(),
        executionTime: 150
      };

      const markdown = formatter.formatAsMarkdown(response);

      expect(markdown).toContain('## ✅ research:questions');
      expect(markdown).toContain('Research questions generated successfully');
      expect(markdown).toContain('**Parameters:**');
      expect(markdown).toContain('- **study:** user-interviews');
      expect(markdown).toContain('- **topic:** e-commerce');
      expect(markdown).toContain('**Execution Time:** 150ms');
    });

    it('should format error response as markdown', () => {
      const response: CommandResponse = {
        success: false,
        command: 'research:questions',
        parameters: { study: 'user-interviews' },
        error: 'Required parameter missing: topic',
        timestamp: new Date(),
        executionTime: 25
      };

      const markdown = formatter.formatAsMarkdown(response);

      expect(markdown).toContain('## ❌ research:questions');
      expect(markdown).toContain('Required parameter missing: topic');
      expect(markdown).toContain('**Parameters:**');
      expect(markdown).toContain('- **study:** user-interviews');
      expect(markdown).toContain('**Execution Time:** 25ms');
    });

    it('should handle empty parameters in markdown', () => {
      const response: CommandResponse = {
        success: true,
        command: 'study:list',
        parameters: {},
        response: 'Studies listed successfully',
        timestamp: new Date(),
        executionTime: 50
      };

      const markdown = formatter.formatAsMarkdown(response);

      expect(markdown).toContain('**Parameters:**');
      expect(markdown).toContain('None');
    });
  });

  describe('addMetadata', () => {
    it('should add metadata to response', () => {
      const response: CommandResponse = {
        success: true,
        command: 'research:questions',
        parameters: { study: 'user-interviews' },
        response: 'Research questions generated successfully',
        timestamp: new Date(),
        executionTime: 150,
        metadata: { existing: 'value' }
      };

      const updatedResponse = formatter.addMetadata(response, { new: 'metadata' });

      expect(updatedResponse.metadata).toEqual({
        existing: 'value',
        new: 'metadata'
      });
    });

    it('should add metadata to response without existing metadata', () => {
      const response: CommandResponse = {
        success: true,
        command: 'study:list',
        parameters: {},
        response: 'Studies listed successfully',
        timestamp: new Date(),
        executionTime: 50
      };

      const updatedResponse = formatter.addMetadata(response, { new: 'metadata' });

      expect(updatedResponse.metadata).toEqual({ new: 'metadata' });
    });
  });

  describe('getResponseSummary', () => {
    it('should get response summary for successful response', () => {
      const response: CommandResponse = {
        success: true,
        command: 'research:questions',
        parameters: { study: 'user-interviews' },
        response: 'Research questions generated successfully',
        timestamp: new Date(),
        executionTime: 150
      };

      const summary = formatter.getResponseSummary(response);

      expect(summary).toBe('SUCCESS - research:questions (150ms)');
    });

    it('should get response summary for error response', () => {
      const response: CommandResponse = {
        success: false,
        command: 'research:questions',
        parameters: { study: 'user-interviews' },
        error: 'Required parameter missing: topic',
        timestamp: new Date(),
        executionTime: 25
      };

      const summary = formatter.getResponseSummary(response);

      expect(summary).toBe('FAILED - research:questions (25ms)');
    });
  });
});
