/**
 * Use Case Tests for Slash Command System
 * 
 * These tests define the complete user journey and expected behavior
 * for the slash command system in UX-Kit IDE integration.
 */

import { SlashCommandHandler } from '../../src/slash/SlashCommandHandler';
import { CommandParser } from '../../src/slash/CommandParser';
import { ResponseFormatter } from '../../src/slash/ResponseFormatter';
import { IDEIntegration } from '../../src/slash/IDEIntegration';

describe('Slash Command System Use Cases', () => {
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

  describe('UC001: Parse and Execute Research Commands', () => {
    it('should parse and execute /research:questions command', async () => {
      // Given: User types slash command in IDE
      const command = '/research:questions --study="user-interviews" --topic="e-commerce checkout"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should parse command correctly and execute
      expect(result.success).toBe(true);
      expect(result.command).toBe('research:questions');
      expect(result.parameters).toEqual({
        study: 'user-interviews',
        topic: 'e-commerce checkout'
      });
      expect(result.response).toContain('Research questions generated');
    });

    it('should parse and execute /research:sources command', async () => {
      // Given: User types slash command in IDE
      const command = '/research:sources --study="user-interviews" --keywords="UX, usability, e-commerce"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should parse command correctly and execute
      expect(result.success).toBe(true);
      expect(result.command).toBe('research:sources');
      expect(result.parameters).toEqual({
        study: 'user-interviews',
        keywords: 'UX, usability, e-commerce'
      });
      expect(result.response).toContain('Research sources gathered');
    });

    it('should parse and execute /research:summarize command', async () => {
      // Given: User types slash command in IDE
      const command = '/research:summarize --study="user-interviews" --format="markdown"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should parse command correctly and execute
      expect(result.success).toBe(true);
      expect(result.command).toBe('research:summarize');
      expect(result.parameters).toEqual({
        study: 'user-interviews',
        format: 'markdown'
      });
      expect(result.response).toContain('Research summary created');
    });

    it('should parse and execute /research:interview command', async () => {
      // Given: User types slash command in IDE
      const command = '/research:interview --study="user-interviews" --participant="P001"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should parse command correctly and execute
      expect(result.success).toBe(true);
      expect(result.command).toBe('research:interview');
      expect(result.parameters).toEqual({
        study: 'user-interviews',
        participant: 'P001'
      });
      expect(result.response).toContain('Interview data processed');
    });

    it('should parse and execute /research:synthesize command', async () => {
      // Given: User types slash command in IDE
      const command = '/research:synthesize --study="user-interviews" --insights="key-findings"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should parse command correctly and execute
      expect(result.success).toBe(true);
      expect(result.command).toBe('research:synthesize');
      expect(result.parameters).toEqual({
        study: 'user-interviews',
        insights: 'key-findings'
      });
      expect(result.response).toContain('Research synthesis completed');
    });
  });

  describe('UC002: Parse and Execute Study Commands', () => {
    it('should parse and execute /study:create command', async () => {
      // Given: User types slash command in IDE
      const command = '/study:create --name="e-commerce-usability" --description="Usability study for checkout flow"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should parse command correctly and execute
      expect(result.success).toBe(true);
      expect(result.command).toBe('study:create');
      expect(result.parameters).toEqual({
        name: 'e-commerce-usability',
        description: 'Usability study for checkout flow'
      });
      expect(result.response).toContain('created successfully');
    });

    it('should parse and execute /study:list command', async () => {
      // Given: User types slash command in IDE
      const command = '/study:list --format="table"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should parse command correctly and execute
      expect(result.success).toBe(true);
      expect(result.command).toBe('study:list');
      expect(result.parameters).toEqual({
        format: 'table'
      });
      expect(result.response).toContain('Studies listed');
    });

    it('should parse and execute /study:show command', async () => {
      // Given: User types slash command in IDE
      const command = '/study:show --name="e-commerce-usability"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should parse command correctly and execute
      expect(result.success).toBe(true);
      expect(result.command).toBe('study:show');
      expect(result.parameters).toEqual({
        name: 'e-commerce-usability'
      });
      expect(result.response).toContain('Study details');
    });

    it('should parse and execute /study:delete command', async () => {
      // Given: User types slash command in IDE
      const command = '/study:delete --name="e-commerce-usability" --confirm';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should parse command correctly and execute
      expect(result.success).toBe(true);
      expect(result.command).toBe('study:delete');
      expect(result.parameters).toEqual({
        name: 'e-commerce-usability',
        confirm: true
      });
      expect(result.response).toContain('deleted successfully');
    });
  });

  describe('UC003: Command Parsing and Validation', () => {
    it('should parse commands with multiple parameters', async () => {
      // Given: User types complex slash command
      const command = '/research:questions --study="user-interviews" --topic="e-commerce" --count=10 --format="markdown"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should parse all parameters correctly
      expect(result.success).toBe(true);
      expect(result.parameters).toEqual({
        study: 'user-interviews',
        topic: 'e-commerce',
        count: 10,
        format: 'markdown'
      });
    });

    it('should handle commands with boolean flags', async () => {
      // Given: User types command with boolean flags
      const command = '/study:delete --name="test-study" --confirm --force';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should parse boolean flags correctly
      expect(result.success).toBe(true);
      expect(result.parameters).toEqual({
        name: 'test-study',
        confirm: true,
        force: true
      });
    });

    it('should handle commands with quoted values containing spaces', async () => {
      // Given: User types command with quoted values
      const command = '/research:sources --study="user interviews 2024" --keywords="UX research, usability testing, user experience"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should parse quoted values correctly
      expect(result.success).toBe(true);
      expect(result.parameters).toEqual({
        study: 'user interviews 2024',
        keywords: 'UX research, usability testing, user experience'
      });
    });

    it('should validate required parameters', async () => {
      // Given: User types command missing required parameters
      const command = '/research:questions --topic="e-commerce"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should return validation error
      expect(result.success).toBe(false);
      expect(result.error).toContain('Required parameter missing');
      expect(result.error).toContain('study');
    });

    it('should validate parameter types', async () => {
      // Given: User types command with invalid parameter type
      const command = '/research:questions --study="user-interviews" --topic="e-commerce" --count="invalid"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should return validation error
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid parameter type');
      expect(result.error).toContain('count');
    });
  });

  describe('UC004: Response Formatting', () => {
    it('should format successful responses with proper structure', async () => {
      // Given: User executes successful command
      const command = '/research:questions --study="user-interviews" --topic="e-commerce"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Response should be properly formatted
      expect(result.success).toBe(true);
      expect(result.response).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.executionTime).toBeGreaterThan(0);
    });

    it('should format error responses with proper structure', async () => {
      // Given: User executes invalid command
      const command = '/invalid:command --param="value"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Error response should be properly formatted
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });

    it('should include execution metadata in responses', async () => {
      // Given: User executes command
      const command = '/study:list';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Response should include metadata
      expect(result.success).toBe(true);
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.executionTime).toBeGreaterThan(0);
      expect(result.command).toBe('study:list');
    });
  });

  describe('UC005: IDE Integration', () => {
    it('should register commands with IDE', async () => {
      // Given: IDE integration is available
      const commands = [
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

      // When: Commands are registered
      const result = await ideIntegration.registerCommands(commands);

      // Then: All commands should be registered successfully
      expect(result.success).toBe(true);
      expect(result.registeredCommands).toHaveLength(9);
      expect(result.registeredCommands).toEqual(expect.arrayContaining(commands));
    });

    it('should handle IDE command execution requests', async () => {
      // Given: IDE sends command execution request
      const request = {
        command: '/research:questions --study="user-interviews" --topic="e-commerce"',
        context: {
          workspace: '/path/to/workspace',
          file: 'research.md'
        }
      };

      // When: Request is processed
      const result = await ideIntegration.executeCommand(request);

      // Then: Command should be executed successfully
      expect(result.success).toBe(true);
      expect(result.response).toBeDefined();
      expect(result.context).toEqual(request.context);
    });

    it('should provide command suggestions and help', async () => {
      // Given: User requests help for commands
      const helpRequest = {
        type: 'help'
      };

      // When: Help is requested
      const result = await ideIntegration.getHelp(helpRequest);

      // Then: Should return helpful information
      expect(result.success).toBe(true);
      expect(result.help).toContain('research:questions');
      expect(result.help).toContain('research:sources');
      expect(result.help).toContain('research:summarize');
      expect(result.help).toContain('research:interview');
      expect(result.help).toContain('research:synthesize');
    });
  });

  describe('UC006: Error Handling and Edge Cases', () => {
    it('should handle malformed commands gracefully', async () => {
      // Given: User types malformed command
      const command = '/research:questions --study=user-interviews --topic';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should return appropriate error
      expect(result.success).toBe(false);
      expect(result.error).toContain('Validation failed');
    });

    it('should handle unknown commands gracefully', async () => {
      // Given: User types unknown command
      const command = '/unknown:command --param="value"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should return appropriate error
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown command');
    });

    it('should handle commands with special characters', async () => {
      // Given: User types command with special characters
      const command = '/research:questions --study="user-interviews-2024" --topic="e-commerce & UX"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should handle special characters correctly
      expect(result.success).toBe(true);
      expect(result.parameters).toEqual({
        study: 'user-interviews-2024',
        topic: 'e-commerce & UX'
      });
    });

    it('should handle empty or whitespace-only commands', async () => {
      // Given: User types empty command
      const command = '   ';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should return appropriate error
      expect(result.success).toBe(false);
      expect(result.error).toContain('Empty command');
    });

    it('should handle commands without slash prefix', async () => {
      // Given: User types command without slash
      const command = 'research:questions --study="user-interviews"';

      // When: Command is processed
      const result = await commandHandler.handleCommand(command);

      // Then: Should return appropriate error
      expect(result.success).toBe(false);
      expect(result.error).toContain('Command must start with /');
    });
  });

  describe('UC007: Command Execution Performance', () => {
    it('should execute commands within acceptable time limits', async () => {
      // Given: User executes command
      const command = '/study:list';

      // When: Command is processed
      const startTime = Date.now();
      const result = await commandHandler.handleCommand(command);
      const endTime = Date.now();

      // Then: Should complete within reasonable time
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // Less than 1 second
      expect(result.executionTime).toBeLessThan(1000);
    });

    it('should handle concurrent command execution', async () => {
      // Given: Multiple commands are executed concurrently
      const commands = [
        '/study:list',
        '/research:questions --study="study1" --topic="topic1"',
        '/research:sources --study="study2" --keywords="keywords"'
      ];

      // When: Commands are processed concurrently
      const results = await Promise.all(
        commands.map(cmd => commandHandler.handleCommand(cmd))
      );

      // Then: All commands should complete successfully
      results.forEach(result => {
        expect(result.success).toBe(true);
        expect(result.executionTime).toBeLessThan(1000);
      });
    });
  });
});
