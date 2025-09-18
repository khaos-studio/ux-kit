/**
 * Unit Tests for CommandExecutor
 */

import { CommandExecutor, CommandExecutionContext } from '../../../src/integrations/CommandExecutor';

describe('CommandExecutor', () => {
  let commandExecutor: CommandExecutor;

  beforeEach(() => {
    commandExecutor = new CommandExecutor();
  });

  describe('constructor', () => {
    it('should initialize with default command handlers', () => {
      // When: CommandExecutor is created
      // Then: Should have all default commands available
      const availableCommands = commandExecutor.getAvailableCommands();
      
      expect(availableCommands).toContain('research:questions');
      expect(availableCommands).toContain('research:sources');
      expect(availableCommands).toContain('research:summarize');
      expect(availableCommands).toContain('research:interview');
      expect(availableCommands).toContain('research:synthesize');
      expect(availableCommands).toContain('study:create');
      expect(availableCommands).toContain('study:list');
      expect(availableCommands).toContain('study:show');
      expect(availableCommands).toContain('study:delete');
    });
  });

  describe('execute', () => {
    const mockContext: CommandExecutionContext = {
      workspace: '/test/workspace',
      currentFile: 'test.md',
      selection: 'selected text',
      cursorPosition: { line: 5, character: 10 }
    };

    it('should execute research:questions command successfully', async () => {
      // Given: Valid research questions command
      const args = ['--study="test-study"', '--topic="test-topic"'];

      // When: Command is executed
      const result = await commandExecutor.execute('research:questions', args, mockContext);

      // Then: Should return success result
      expect(result.success).toBe(true);
      expect(result.output).toContain('Research questions generated for study "test-study"');
      expect(result.output).toContain('test-topic');
      expect(result.metadata).toEqual({
        study: 'test-study',
        topic: 'test-topic',
        count: 5,
        format: 'markdown',
        workspace: '/test/workspace'
      });
    });

    it('should execute research:questions command with custom parameters', async () => {
      // Given: Research questions command with custom count and format
      const args = ['--study="test-study"', '--topic="test-topic"', '--count=3', '--format="json"'];

      // When: Command is executed
      const result = await commandExecutor.execute('research:questions', args, mockContext);

      // Then: Should return success result with custom parameters
      expect(result.success).toBe(true);
      expect(result.metadata).toEqual({
        study: 'test-study',
        topic: 'test-topic',
        count: 3,
        format: 'json',
        workspace: '/test/workspace'
      });
    });

    it('should handle missing required parameters for research:questions', async () => {
      // Given: Research questions command missing required parameters
      const args = ['--study="test-study"'];

      // When: Command is executed
      const result = await commandExecutor.execute('research:questions', args, mockContext);

      // Then: Should return error result
      expect(result.success).toBe(false);
      expect(result.error).toBe('Required parameters: study and topic');
    });

    it('should execute study:create command successfully', async () => {
      // Given: Valid study create command
      const args = ['--name="test-study"', '--description="Test study description"'];

      // When: Command is executed
      const result = await commandExecutor.execute('study:create', args, mockContext);

      // Then: Should return success result
      expect(result.success).toBe(true);
      expect(result.output).toContain('Study "test-study" created successfully');
      expect(result.metadata).toEqual({
        name: 'test-study',
        description: 'Test study description',
        template: 'standard',
        format: 'markdown',
        workspace: '/test/workspace'
      });
    });

    it('should execute study:list command successfully', async () => {
      // Given: Study list command
      const args = ['--format="table"'];

      // When: Command is executed
      const result = await commandExecutor.execute('study:list', args, mockContext);

      // Then: Should return success result
      expect(result.success).toBe(true);
      expect(result.output).toContain('Studies listed');
      expect(result.metadata).toEqual({
        format: 'table',
        filter: undefined,
        count: 2,
        workspace: '/test/workspace'
      });
    });

    it('should execute study:delete command with confirmation', async () => {
      // Given: Study delete command with confirmation
      const args = ['--name="test-study"', '--confirm'];

      // When: Command is executed
      const result = await commandExecutor.execute('study:delete', args, mockContext);

      // Then: Should return success result
      expect(result.success).toBe(true);
      expect(result.output).toContain('Study "test-study" deleted successfully');
      expect(result.metadata).toEqual({
        name: 'test-study',
        confirmed: true,
        forced: undefined,
        workspace: '/test/workspace'
      });
    });

    it('should handle study:delete command without confirmation', async () => {
      // Given: Study delete command without confirmation
      const args = ['--name="test-study"'];

      // When: Command is executed
      const result = await commandExecutor.execute('study:delete', args, mockContext);

      // Then: Should return error result
      expect(result.success).toBe(false);
      expect(result.error).toBe('Deletion requires confirmation. Use --confirm or --force flag.');
    });

    it('should handle unknown command', async () => {
      // Given: Unknown command
      const args = ['--param="value"'];

      // When: Command is executed
      await expect(commandExecutor.execute('unknown:command', args, mockContext))
        .rejects.toThrow('Unknown command: unknown:command');
    });

    it('should handle command execution errors', async () => {
      // Given: Custom command handler that throws error
      const errorHandler = jest.fn().mockRejectedValue(new Error('Test error'));
      commandExecutor.registerHandler('test:error', errorHandler);

      // When: Command is executed
      const result = await commandExecutor.execute('test:error', [], mockContext);

      // Then: Should return error result
      expect(result.success).toBe(false);
      expect(result.error).toBe('Test error');
      expect(result.metadata).toEqual({
        command: 'test:error',
        args: [],
        context: mockContext
      });
    });
  });

  describe('registerHandler', () => {
    it('should register a custom command handler', () => {
      // Given: Custom command handler
      const handler = jest.fn().mockResolvedValue({ success: true, output: 'Test output' });

      // When: Handler is registered
      commandExecutor.registerHandler('test:command', handler);

      // Then: Command should be available
      expect(commandExecutor.hasCommand('test:command')).toBe(true);
      expect(commandExecutor.getAvailableCommands()).toContain('test:command');
    });
  });

  describe('unregisterHandler', () => {
    it('should unregister a command handler', () => {
      // Given: Registered command handler
      const handler = jest.fn().mockResolvedValue({ success: true, output: 'Test output' });
      commandExecutor.registerHandler('test:command', handler);

      // When: Handler is unregistered
      commandExecutor.unregisterHandler('test:command');

      // Then: Command should no longer be available
      expect(commandExecutor.hasCommand('test:command')).toBe(false);
      expect(commandExecutor.getAvailableCommands()).not.toContain('test:command');
    });
  });

  describe('getAvailableCommands', () => {
    it('should return list of available commands', () => {
      // When: Available commands are requested
      const commands = commandExecutor.getAvailableCommands();

      // Then: Should return array of command names
      expect(Array.isArray(commands)).toBe(true);
      expect(commands.length).toBeGreaterThan(0);
      expect(commands).toContain('research:questions');
    });
  });

  describe('hasCommand', () => {
    it('should return true for existing command', () => {
      // When: Checking for existing command
      const hasCommand = commandExecutor.hasCommand('research:questions');

      // Then: Should return true
      expect(hasCommand).toBe(true);
    });

    it('should return false for non-existing command', () => {
      // When: Checking for non-existing command
      const hasCommand = commandExecutor.hasCommand('non:existing');

      // Then: Should return false
      expect(hasCommand).toBe(false);
    });
  });

  describe('argument parsing', () => {
    const mockContext: CommandExecutionContext = {
      workspace: '/test/workspace',
      currentFile: 'test.md',
      selection: 'selected text',
      cursorPosition: { line: 5, character: 10 }
    };

    it('should parse arguments with quoted values', async () => {
      // Given: Command with quoted arguments
      const args = ['--study="user interviews 2024"', '--topic="e-commerce & UX"'];

      // When: Command is executed
      const result = await commandExecutor.execute('research:questions', args, mockContext);

      // Then: Should parse quoted values correctly
      expect(result.success).toBe(true);
      expect(result.metadata).toEqual({
        study: 'user interviews 2024',
        topic: 'e-commerce & UX',
        count: 5,
        format: 'markdown',
        workspace: '/test/workspace'
      });
    });

    it('should parse boolean flags', async () => {
      // Given: Command with boolean flags
      const args = ['--name="test-study"', '--confirm', '--force'];

      // When: Command is executed
      const result = await commandExecutor.execute('study:delete', args, mockContext);

      // Then: Should parse boolean flags correctly
      expect(result.success).toBe(true);
      expect(result.metadata).toEqual({
        name: 'test-study',
        confirmed: true,
        forced: true,
        workspace: '/test/workspace'
      });
    });

    it('should handle empty arguments', async () => {
      // Given: Command with no arguments
      const args: string[] = [];

      // When: Command is executed
      const result = await commandExecutor.execute('study:list', args, mockContext);

      // Then: Should handle empty arguments gracefully
      expect(result.success).toBe(true);
    });
  });
});
