/**
 * Unit Tests for IDEIntegration
 */

import { IDEIntegration } from '../../../src/slash/IDEIntegration';
import { IDECommandRequest } from '../../../src/slash/ResponseFormatter';

describe('IDEIntegration', () => {
  let ideIntegration: IDEIntegration;

  beforeEach(() => {
    ideIntegration = new IDEIntegration();
  });

  describe('registerCommands', () => {
    it('should register valid commands successfully', async () => {
      const commands = ['research:questions', 'research:sources', 'study:list'];

      const result = await ideIntegration.registerCommands(commands);

      expect(result.success).toBe(true);
      expect(result.registeredCommands).toEqual(commands);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle mixed valid and invalid commands', async () => {
      const commands = ['research:questions', 'invalid:command', 'study:list'];

      const result = await ideIntegration.registerCommands(commands);

      expect(result.success).toBe(false);
      expect(result.registeredCommands).toEqual(['research:questions', 'study:list']);
      expect(result.errors).toContain('Unknown command: invalid:command');
    });

    it('should handle all invalid commands', async () => {
      const commands = ['invalid:command1', 'invalid:command2'];

      const result = await ideIntegration.registerCommands(commands);

      expect(result.success).toBe(false);
      expect(result.registeredCommands).toHaveLength(0);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContain('Unknown command: invalid:command1');
      expect(result.errors).toContain('Unknown command: invalid:command2');
    });

    it('should register all available commands', async () => {
      const allCommands = [
        'research:questions',
        'research:sources',
        'research:summarize',
        'research:interview',
        'research:synthesize',
        'study:create',
        'study:list',
        'study:show',
        'study:delete'
      ];

      const result = await ideIntegration.registerCommands(allCommands);

      expect(result.success).toBe(true);
      expect(result.registeredCommands).toEqual(allCommands);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('executeCommand', () => {
    it('should execute valid command successfully', async () => {
      const request: IDECommandRequest = {
        command: '/research:questions --study="user-interviews" --topic="e-commerce"',
        context: {
          workspace: '/path/to/workspace',
          file: 'research.md'
        }
      };

      const result = await ideIntegration.executeCommand(request);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Research questions generated successfully');
      expect(result.context).toEqual({
        workspace: '/path/to/workspace',
        file: 'research.md'
      });
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should handle command execution error', async () => {
      const request: IDECommandRequest = {
        command: '/unknown:command --param="value"',
        context: {
          workspace: '/path/to/workspace'
        }
      };

      const result = await ideIntegration.executeCommand(request);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown command');
      expect(result.context).toEqual({
        workspace: '/path/to/workspace'
      });
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });

    it('should handle request without context', async () => {
      const request: IDECommandRequest = {
        command: '/study:list'
      };

      const result = await ideIntegration.executeCommand(request);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Studies listed successfully');
      expect(result.context).toBeUndefined();
    });

    it('should handle empty command', async () => {
      const request: IDECommandRequest = {
        command: ''
      };

      const result = await ideIntegration.executeCommand(request);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Command is required');
    });
  });

  describe('getHelp', () => {
    it('should get help for specific command', async () => {
      const request = {
        type: 'help',
        command: 'research:questions'
      };

      const result = await ideIntegration.getHelp(request);

      expect(result.success).toBe(true);
      expect(result.help).toContain('# research:questions');
      expect(result.help).toContain('Generate research questions for a study');
      expect(result.help).toContain('**Parameters:**');
      expect(result.help).toContain('**Examples:**');
      expect(result.commands).toEqual(['research:questions']);
      expect(result.examples).toBeDefined();
    });

    it('should get help for all commands', async () => {
      const request = {
        type: 'help'
      };

      const result = await ideIntegration.getHelp(request);

      expect(result.success).toBe(true);
      expect(result.help).toContain('# Available Commands');
      expect(result.help).toContain('- research:questions');
      expect(result.help).toContain('- research:sources');
      expect(result.help).toContain('- study:list');
      expect(result.commands).toBeDefined();
      expect(result.commands?.length).toBeGreaterThan(0);
    });

    it('should handle help request for unknown command', async () => {
      const request = {
        type: 'help',
        command: 'unknown:command'
      };

      const result = await ideIntegration.getHelp(request);

      expect(result.success).toBe(false);
      expect(result.help).toContain("Command 'unknown:command' not found");
    });

    it('should handle invalid help request', async () => {
      const request = {
        type: 'invalid'
      };

      const result = await ideIntegration.getHelp(request);

      expect(result.success).toBe(false);
      expect(result.help).toContain('Invalid help request');
    });
  });

  describe('isCommandRegistered', () => {
    it('should return false for unregistered command', () => {
      expect(ideIntegration.isCommandRegistered('research:questions')).toBe(false);
    });

    it('should return true for registered command', async () => {
      await ideIntegration.registerCommands(['research:questions']);
      expect(ideIntegration.isCommandRegistered('research:questions')).toBe(true);
    });
  });

  describe('getRegisteredCommands', () => {
    it('should return empty array initially', () => {
      const commands = ideIntegration.getRegisteredCommands();
      expect(commands).toEqual([]);
    });

    it('should return registered commands', async () => {
      await ideIntegration.registerCommands(['research:questions', 'study:list']);
      const commands = ideIntegration.getRegisteredCommands();
      expect(commands).toEqual(['research:questions', 'study:list']);
    });
  });

  describe('getCommandRegistration', () => {
    it('should return command registration for valid command', () => {
      const registration = ideIntegration.getCommandRegistration('research:questions');

      expect(registration).toBeDefined();
      expect(registration?.command).toBe('research:questions');
      expect(registration?.description).toContain('Generate research questions');
      expect(registration?.parameters).toContain('study (required)');
      expect(registration?.parameters).toContain('topic (required)');
      expect(registration?.examples).toHaveLength(2);
    });

    it('should return undefined for invalid command', () => {
      const registration = ideIntegration.getCommandRegistration('unknown:command');
      expect(registration).toBeUndefined();
    });
  });

  describe('command execution simulation', () => {
    it('should simulate research:questions command', async () => {
      const request: IDECommandRequest = {
        command: '/research:questions --study="user-interviews" --topic="e-commerce"'
      };

      const result = await ideIntegration.executeCommand(request);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Research questions generated successfully');
    });

    it('should simulate research:sources command', async () => {
      const request: IDECommandRequest = {
        command: '/research:sources --study="user-interviews" --keywords="UX, usability"'
      };

      const result = await ideIntegration.executeCommand(request);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Research sources gathered successfully');
    });

    it('should simulate study:create command', async () => {
      const request: IDECommandRequest = {
        command: '/study:create --name="test-study" --description="Test description"'
      };

      const result = await ideIntegration.executeCommand(request);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Study created successfully');
    });

    it('should simulate study:list command', async () => {
      const request: IDECommandRequest = {
        command: '/study:list'
      };

      const result = await ideIntegration.executeCommand(request);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Studies listed successfully');
    });
  });
});
