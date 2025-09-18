/**
 * Unit Tests for SlashCommandHandler
 */

import { SlashCommandHandler } from '../../../src/slash/SlashCommandHandler';
import { CommandParser } from '../../../src/slash/CommandParser';
import { ResponseFormatter, IDECommandRequest } from '../../../src/slash/ResponseFormatter';
import { IDEIntegration } from '../../../src/slash/IDEIntegration';

describe('SlashCommandHandler', () => {
  let commandHandler: SlashCommandHandler;
  let commandParser: CommandParser;
  let responseFormatter: ResponseFormatter;
  let ideIntegration: IDEIntegration;

  beforeEach(() => {
    commandParser = new CommandParser();
    responseFormatter = new ResponseFormatter();
    ideIntegration = new IDEIntegration();
    commandHandler = new SlashCommandHandler(commandParser, responseFormatter, ideIntegration);
  });

  describe('handleCommand', () => {
    it('should handle valid research:questions command', async () => {
      const result = await commandHandler.handleCommand('/research:questions --study="user-interviews" --topic="e-commerce"');

      expect(result.success).toBe(true);
      expect(result.command).toBe('research:questions');
      expect(result.parameters).toEqual({
        study: 'user-interviews',
        topic: 'e-commerce'
      });
      expect(result.response).toContain('Research questions generated');
      expect(result.executionTime).toBeGreaterThan(0);
    });

    it('should handle valid study:list command', async () => {
      const result = await commandHandler.handleCommand('/study:list');

      expect(result.success).toBe(true);
      expect(result.command).toBe('study:list');
      expect(result.parameters).toEqual({});
      expect(result.response).toContain('Studies listed successfully');
      expect(result.executionTime).toBeGreaterThan(0);
    });

    it('should handle command with boolean flags', async () => {
      const result = await commandHandler.handleCommand('/study:delete --name="test-study" --confirm --force');

      expect(result.success).toBe(true);
      expect(result.command).toBe('study:delete');
      expect(result.parameters).toEqual({
        name: 'test-study',
        confirm: true,
        force: true
      });
      expect(result.response).toContain('deleted successfully');
    });

    it('should handle command with numeric parameters', async () => {
      const result = await commandHandler.handleCommand('/research:questions --study="user-interviews" --topic="e-commerce" --count=10');

      expect(result.success).toBe(true);
      expect(result.command).toBe('research:questions');
      expect(result.parameters).toEqual({
        study: 'user-interviews',
        topic: 'e-commerce',
        count: 10
      });
    });

    it('should handle validation errors', async () => {
      const result = await commandHandler.handleCommand('/research:questions --study="user-interviews"');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Validation failed');
      expect(result.error).toContain('Required parameter missing: topic');
    });

    it('should handle parsing errors', async () => {
      const result = await commandHandler.handleCommand('research:questions --study="user-interviews"');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Parsing error');
      expect(result.error).toContain('Command must start with /');
    });

    it('should handle empty commands', async () => {
      const result = await commandHandler.handleCommand('   ');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Parsing error');
      expect(result.error).toContain('Empty command');
    });

    it('should handle unknown commands', async () => {
      const result = await commandHandler.handleCommand('/unknown:command --param="value"');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown command');
    });

    it('should handle malformed commands', async () => {
      const result = await commandHandler.handleCommand('/research:questions --study=user-interviews --topic');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Validation failed');
    });
  });

  describe('handleIDECommand', () => {
    it('should handle successful IDE command request', async () => {
      const request: IDECommandRequest = {
        command: '/research:questions --study="user-interviews" --topic="e-commerce"',
        context: {
          workspace: '/path/to/workspace',
          file: 'research.md'
        }
      };

      const result = await commandHandler.handleIDECommand(request);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Research questions generated successfully');
      expect(result.metadata?.context).toEqual({
        workspace: '/path/to/workspace',
        file: 'research.md'
      });
    });

    it('should handle failed IDE command request', async () => {
      const request: IDECommandRequest = {
        command: '/unknown:command --param="value"',
        context: {
          workspace: '/path/to/workspace'
        }
      };

      const result = await commandHandler.handleIDECommand(request);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown command');
      expect(result.metadata?.context).toEqual({
        workspace: '/path/to/workspace'
      });
    });
  });

  describe('getHelp', () => {
    it('should get help for specific command', async () => {
      const result = await commandHandler.getHelp('research:questions');

      expect(result.success).toBe(true);
      expect(result.command).toBe('help');
      expect(result.parameters).toEqual({ command: 'research:questions' });
      expect(result.response).toContain('# research:questions');
      expect(result.response).toContain('Generate research questions');
    });

    it('should get help for all commands', async () => {
      const result = await commandHandler.getHelp();

      expect(result.success).toBe(true);
      expect(result.command).toBe('help');
      expect(result.parameters).toEqual({ command: 'all' });
      expect(result.response).toContain('# Available Commands');
    });

    it('should handle help request for unknown command', async () => {
      const result = await commandHandler.getHelp('unknown:command');

      expect(result.success).toBe(false);
      expect(result.error).toContain("Command 'unknown:command' not found");
    });
  });

  describe('listCommands', () => {
    it('should list available commands', async () => {
      const result = await commandHandler.listCommands();

      expect(result.success).toBe(true);
      expect(result.command).toBe('list');
      expect(result.response).toContain('Available commands:');
      expect(result.response).toContain('- research:questions');
      expect(result.response).toContain('- research:sources');
      expect(result.response).toContain('- study:list');
    });
  });

  describe('registerCommands', () => {
    it('should register valid commands', async () => {
      const commands = ['research:questions', 'research:sources', 'study:list'];

      const result = await commandHandler.registerCommands(commands);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Successfully registered 3 commands');
      expect(result.metadata?.registeredCommands).toEqual(commands);
    });

    it('should handle registration with invalid commands', async () => {
      const commands = ['research:questions', 'invalid:command', 'study:list'];

      const result = await commandHandler.registerCommands(commands);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Registration failed');
      expect(result.metadata?.errors).toContain('Unknown command: invalid:command');
    });
  });

  describe('command execution methods', () => {
    it('should execute research:questions command', async () => {
      const result = await commandHandler.handleCommand('/research:questions --study="user-interviews" --topic="e-commerce" --count=5');

      expect(result.success).toBe(true);
      expect(result.response).toContain('Research questions generated for study "user-interviews" on topic "e-commerce" (5 questions, markdown format)');
    });

    it('should execute research:sources command', async () => {
      const result = await commandHandler.handleCommand('/research:sources --study="user-interviews" --keywords="UX, usability" --limit=20');

      expect(result.success).toBe(true);
      expect(result.response).toContain('Research sources gathered for study "user-interviews" with keywords "UX, usability" (20 sources, markdown format)');
    });

    it('should execute research:summarize command', async () => {
      const result = await commandHandler.handleCommand('/research:summarize --study="user-interviews" --format="markdown" --length="brief"');

      expect(result.success).toBe(true);
      expect(result.response).toContain('Research summary created for study "user-interviews" (brief length, markdown format)');
    });

    it('should execute research:interview command', async () => {
      const result = await commandHandler.handleCommand('/research:interview --study="user-interviews" --participant="P001" --template="standard"');

      expect(result.success).toBe(true);
      expect(result.response).toContain('Interview data processed for study "user-interviews" participant "P001" (standard template, markdown format)');
    });

    it('should execute research:synthesize command', async () => {
      const result = await commandHandler.handleCommand('/research:synthesize --study="user-interviews" --insights="key-findings" --output="report"');

      expect(result.success).toBe(true);
      expect(result.response).toContain('Research synthesis completed for study "user-interviews" with insights "key-findings" (report output, markdown format)');
    });

    it('should execute study:create command', async () => {
      const result = await commandHandler.handleCommand('/study:create --name="e-commerce-usability" --description="Usability study for checkout flow" --template="standard"');

      expect(result.success).toBe(true);
      expect(result.response).toContain('Study "e-commerce-usability" created successfully: Usability study for checkout flow (standard template, markdown format)');
    });

    it('should execute study:show command', async () => {
      const result = await commandHandler.handleCommand('/study:show --name="e-commerce-usability" --format="detailed" --details');

      expect(result.success).toBe(true);
      expect(result.response).toContain('Study details for "e-commerce-usability" (detailed format with full details)');
    });

    it('should execute study:delete command with confirmation', async () => {
      const result = await commandHandler.handleCommand('/study:delete --name="test-study" --confirm');

      expect(result.success).toBe(true);
      expect(result.response).toContain('Study "test-study" deleted successfully');
    });

    it('should reject study:delete command without confirmation', async () => {
      const result = await commandHandler.handleCommand('/study:delete --name="test-study"');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Execution error');
      expect(result.error).toContain('Deletion requires confirmation');
    });
  });

  describe('error handling', () => {
    it('should handle execution errors gracefully', async () => {
      const result = await commandHandler.handleCommand('/study:delete --name="test-study"');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Execution error');
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });

    it('should handle unknown command execution', async () => {
      const result = await commandHandler.handleCommand('/unknown:command --param="value"');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown command');
    });
  });

  describe('performance', () => {
    it('should execute commands within reasonable time', async () => {
      const startTime = Date.now();
      const result = await commandHandler.handleCommand('/study:list');
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // Less than 1 second
      expect(result.executionTime).toBeLessThan(1000);
    });

    it('should handle concurrent command execution', async () => {
      const commands = [
        '/study:list',
        '/research:questions --study="study1" --topic="topic1"',
        '/research:sources --study="study2" --keywords="keywords"'
      ];

      const results = await Promise.all(
        commands.map(cmd => commandHandler.handleCommand(cmd))
      );

      results.forEach(result => {
        expect(result.success).toBe(true);
        expect(result.executionTime).toBeLessThan(1000);
      });
    });
  });
});
