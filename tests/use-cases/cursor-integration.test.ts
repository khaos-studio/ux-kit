/**
 * Use Case Tests for Cursor IDE Integration
 * 
 * These tests define the complete user journey and expected behavior
 * for Cursor IDE integration in UX-Kit.
 */

import { CursorIntegration } from '../../src/integrations/CursorIntegration';
import { IDEInterface } from '../../src/integrations/IDEInterface';
import { CommandExecutor } from '../../src/integrations/CommandExecutor';
import { ResearchService } from '../../src/services/ResearchService';
import { StudyService } from '../../src/services/StudyService';
import { ICursorIntegration, ISlashCommand, CursorPosition, NotificationType } from '../../src/contracts/presentation-contracts';

describe('Cursor IDE Integration Use Cases', () => {
  let cursorIntegration: CursorIntegration;
  let ideInterface: IDEInterface;
  let commandExecutor: CommandExecutor;
  let mockResearchService: jest.Mocked<ResearchService>;
  let mockStudyService: jest.Mocked<StudyService>;

  beforeEach(() => {
    ideInterface = new IDEInterface();
    mockResearchService = {} as jest.Mocked<ResearchService>;
    mockStudyService = {} as jest.Mocked<StudyService>;
    commandExecutor = new CommandExecutor(mockResearchService, mockStudyService);
    cursorIntegration = new CursorIntegration(ideInterface, commandExecutor);
  });

  describe('UC001: Cursor Integration Initialization', () => {
    it('should initialize Cursor integration with proper configuration', () => {
      // Given: Cursor IDE is available
      // When: Cursor integration is initialized
      // Then: Should have correct name, version, and supported commands
      expect(cursorIntegration.name).toBe('cursor');
      expect(cursorIntegration.version).toBeDefined();
      expect(cursorIntegration.supportedCommands).toContain('research:questions');
      expect(cursorIntegration.supportedCommands).toContain('research:sources');
      expect(cursorIntegration.supportedCommands).toContain('study:create');
    });

    it('should register all available slash commands on initialization', () => {
      // Given: Cursor integration is initialized
      // When: Commands are registered
      const registeredCommands = cursorIntegration.listSlashCommands();
      
      // Then: All research and study commands should be registered
      expect(registeredCommands).toHaveLength(9);
      expect(registeredCommands.map((cmd: ISlashCommand) => cmd.name)).toContain('research:questions');
      expect(registeredCommands.map((cmd: ISlashCommand) => cmd.name)).toContain('research:sources');
      expect(registeredCommands.map((cmd: ISlashCommand) => cmd.name)).toContain('research:summarize');
      expect(registeredCommands.map((cmd: ISlashCommand) => cmd.name)).toContain('research:interview');
      expect(registeredCommands.map((cmd: ISlashCommand) => cmd.name)).toContain('research:synthesize');
      expect(registeredCommands.map((cmd: ISlashCommand) => cmd.name)).toContain('study:create');
      expect(registeredCommands.map((cmd: ISlashCommand) => cmd.name)).toContain('study:list');
      expect(registeredCommands.map((cmd: ISlashCommand) => cmd.name)).toContain('study:show');
      expect(registeredCommands.map((cmd: ISlashCommand) => cmd.name)).toContain('study:delete');
    });
  });

  describe('UC002: Slash Command Registration and Management', () => {
    it('should register a new slash command', () => {
      // Given: A new slash command definition
      const newCommand: ISlashCommand = {
        name: 'custom:command',
        description: 'A custom command for testing',
        parameters: ['param1', 'param2'],
        examples: ['/custom:command --param1="value1" --param2="value2"'],
        execute: async (params: Record<string, any>) => {
          // Mock implementation
        }
      };

      // When: Command is registered
      cursorIntegration.registerSlashCommand(newCommand);

      // Then: Command should be available
      const retrievedCommand = cursorIntegration.getSlashCommand('custom:command');
      expect(retrievedCommand).toEqual(newCommand);
      expect(cursorIntegration.listSlashCommands()).toContain(newCommand);
    });

    it('should unregister a slash command', () => {
      // Given: A registered command
      const command = cursorIntegration.getSlashCommand('research:questions');
      expect(command).toBeDefined();

      // When: Command is unregistered
      cursorIntegration.unregisterSlashCommand('research:questions');

      // Then: Command should no longer be available
      expect(cursorIntegration.getSlashCommand('research:questions')).toBeNull();
      expect(cursorIntegration.listSlashCommands().find((cmd: ISlashCommand) => cmd.name === 'research:questions')).toBeUndefined();
    });

    it('should handle registration of duplicate commands', () => {
      // Given: An existing command
      const existingCommand = cursorIntegration.getSlashCommand('research:questions');
      expect(existingCommand).toBeDefined();

      // When: Same command is registered again
      const newCommand: ISlashCommand = {
        name: 'research:questions',
        description: 'Updated description',
        parameters: ['study', 'topic'],
        examples: ['/research:questions --study="test" --topic="test"'],
        execute: async (params: Record<string, any>) => {
          // Mock implementation
        }
      };

      cursorIntegration.registerSlashCommand(newCommand);

      // Then: Command should be updated
      const updatedCommand = cursorIntegration.getSlashCommand('research:questions');
      expect(updatedCommand?.description).toBe('Updated description');
    });
  });

  describe('UC003: Slash Command Execution', () => {
    it('should execute a research questions command', async () => {
      // Given: User types slash command in Cursor
      const command = '/research:questions --study="user-interviews" --topic="e-commerce checkout"';

      // When: Command is executed
      await cursorIntegration.executeSlashCommand('research:questions', ['--study="user-interviews"', '--topic="e-commerce checkout"']);

      // Then: Command should be processed successfully
      // (This would be verified through command executor and IDE interface interactions)
    });

    it('should execute a study creation command', async () => {
      // Given: User types study creation command
      const command = '/study:create --name="e-commerce-usability" --description="Usability study for checkout flow"';

      // When: Command is executed
      await cursorIntegration.executeSlashCommand('study:create', ['--name="e-commerce-usability"', '--description="Usability study for checkout flow"']);

      // Then: Study should be created successfully
      // (This would be verified through command executor interactions)
    });

    it('should handle command execution errors gracefully', async () => {
      // Given: An invalid command
      const invalidCommand = 'invalid:command';

      // When: Invalid command is executed
      await expect(cursorIntegration.executeSlashCommand(invalidCommand, [])).rejects.toThrow('Unknown command: invalid:command');
    });

    it('should execute commands with proper context from Cursor', async () => {
      // Given: User is in a specific workspace and file
      const workspace = '/path/to/workspace';
      const currentFile = 'research.md';
      
      // Mock IDE interface to return context
      jest.spyOn(ideInterface, 'getCurrentWorkspace').mockResolvedValue(workspace);
      jest.spyOn(ideInterface, 'getCurrentFile').mockResolvedValue(currentFile);

      // When: Command is executed
      await cursorIntegration.executeSlashCommand('research:questions', ['--study="test"', '--topic="test"']);

      // Then: Command should be executed with proper context
      expect(ideInterface.getCurrentWorkspace).toHaveBeenCalled();
      expect(ideInterface.getCurrentFile).toHaveBeenCalled();
    });
  });

  describe('UC004: Cursor-Specific Operations', () => {
    it('should get current workspace from Cursor', async () => {
      // Given: Cursor is open with a workspace
      const expectedWorkspace = '/path/to/current/workspace';
      jest.spyOn(ideInterface, 'getCurrentWorkspace').mockResolvedValue(expectedWorkspace);

      // When: Current workspace is requested
      const workspace = await cursorIntegration.getCurrentWorkspace();

      // Then: Should return the current workspace path
      expect(workspace).toBe(expectedWorkspace);
    });

    it('should get current file from Cursor', async () => {
      // Given: Cursor has a file open
      const expectedFile = '/path/to/current/file.md';
      jest.spyOn(ideInterface, 'getCurrentFile').mockResolvedValue(expectedFile);

      // When: Current file is requested
      const currentFile = await cursorIntegration.getCurrentFile();

      // Then: Should return the current file path
      expect(currentFile).toBe(expectedFile);
    });

    it('should get current selection from Cursor', async () => {
      // Given: User has text selected in Cursor
      const expectedSelection = 'selected text content';
      jest.spyOn(ideInterface, 'getSelection').mockResolvedValue(expectedSelection);

      // When: Current selection is requested
      const selection = await cursorIntegration.getSelection();

      // Then: Should return the selected text
      expect(selection).toBe(expectedSelection);
    });

    it('should get cursor position from Cursor', async () => {
      // Given: Cursor is positioned in a file
      const expectedPosition: CursorPosition = { line: 10, character: 5, file: 'test.ts' };
      jest.spyOn(ideInterface, 'getCursorPosition').mockResolvedValue(expectedPosition);

      // When: Cursor position is requested
      const position = await cursorIntegration.getCursorPosition();

      // Then: Should return the cursor position
      expect(position).toEqual(expectedPosition);
    });

    it('should insert text at cursor position', async () => {
      // Given: Text to insert and position
      const textToInsert = 'Research questions:\n1. How do users navigate the checkout process?';
      const position: CursorPosition = { line: 5, character: 0, file: 'test.ts' };
      jest.spyOn(ideInterface, 'insertText').mockResolvedValue(undefined);

      // When: Text is inserted
      await cursorIntegration.insertText(textToInsert, position);

      // Then: Should insert text at specified position
      expect(ideInterface.insertText).toHaveBeenCalledWith(textToInsert, position);
    });

    it('should replace current selection with new text', async () => {
      // Given: Text to replace selection with
      const replacementText = 'Updated research questions';
      jest.spyOn(ideInterface, 'replaceSelection').mockResolvedValue(undefined);

      // When: Selection is replaced
      await cursorIntegration.replaceSelection(replacementText);

      // Then: Should replace selection with new text
      expect(ideInterface.replaceSelection).toHaveBeenCalledWith(replacementText);
    });

    it('should show notification to user', async () => {
      // Given: Notification message and type
      const message = 'Research questions generated successfully!';
      const type = NotificationType.INFO;
      jest.spyOn(ideInterface, 'showNotification').mockResolvedValue(undefined);

      // When: Notification is shown
      await cursorIntegration.showNotification(message, type);

      // Then: Should show notification with correct message and type
      expect(ideInterface.showNotification).toHaveBeenCalledWith(message, type);
    });
  });

  describe('UC005: Command Help and Documentation', () => {
    it('should show help for a specific command', async () => {
      // Given: A registered command
      const commandName = 'research:questions';

      // When: Help is requested for the command
      cursorIntegration.showSlashCommandHelp(commandName);

      // Then: Should display command help
      // (This would be verified through IDE interface interactions)
    });

    it('should show help for all available commands', async () => {
      // Given: Multiple registered commands
      const commands = cursorIntegration.listSlashCommands();
      expect(commands.length).toBeGreaterThan(0);

      // When: Help is requested for all commands
      cursorIntegration.showAllSlashCommands();

      // Then: Should display help for all commands
      // (This would be verified through IDE interface interactions)
    });

    it('should handle help request for unknown command', async () => {
      // Given: An unknown command
      const unknownCommand = 'unknown:command';

      // When: Help is requested for unknown command
      cursorIntegration.showSlashCommandHelp(unknownCommand);

      // Then: Should show appropriate error message
      // (This would be verified through IDE interface interactions)
    });
  });

  describe('UC006: Error Handling and Edge Cases', () => {
    it('should handle IDE interface errors gracefully', async () => {
      // Given: IDE interface throws an error
      jest.spyOn(ideInterface, 'getCurrentWorkspace').mockRejectedValue(new Error('IDE connection failed'));

      // When: IDE operation is attempted
      await expect(cursorIntegration.getCurrentWorkspace()).rejects.toThrow('IDE connection failed');
    });

    it('should handle command executor errors gracefully', async () => {
      // Given: Command executor throws an error
      jest.spyOn(commandExecutor, 'execute').mockRejectedValue(new Error('Command execution failed'));

      // When: Command is executed
      await expect(cursorIntegration.executeSlashCommand('research:questions', ['--study="test"'])).rejects.toThrow('Command execution failed');
    });

    it('should handle null/undefined values from IDE operations', async () => {
      // Given: IDE interface returns null values
      jest.spyOn(ideInterface, 'getCurrentFile').mockResolvedValue(null);
      jest.spyOn(ideInterface, 'getSelection').mockResolvedValue(null);
      jest.spyOn(ideInterface, 'getCursorPosition').mockResolvedValue(null);

      // When: IDE operations are performed
      const currentFile = await cursorIntegration.getCurrentFile();
      const selection = await cursorIntegration.getSelection();
      const position = await cursorIntegration.getCursorPosition();

      // Then: Should handle null values gracefully
      expect(currentFile).toBeNull();
      expect(selection).toBeNull();
      expect(position).toBeNull();
    });

    it('should handle empty command arguments', async () => {
      // Given: Command with empty arguments
      const commandName = 'research:questions';
      const emptyArgs: string[] = [];

      // When: Command is executed with empty arguments
      await cursorIntegration.executeSlashCommand(commandName, emptyArgs);

      // Then: Should handle empty arguments gracefully
      // (This would be verified through command executor interactions)
    });

    it('should handle malformed command arguments', async () => {
      // Given: Command with malformed arguments
      const commandName = 'research:questions';
      const malformedArgs = ['--study', '--topic='];

      // When: Command is executed with malformed arguments
      await cursorIntegration.executeSlashCommand(commandName, malformedArgs);

      // Then: Should handle malformed arguments gracefully
      // (This would be verified through command executor interactions)
    });
  });

  describe('UC007: Integration Performance and Reliability', () => {
    it('should execute commands within acceptable time limits', async () => {
      // Given: A command to execute
      const commandName = 'research:questions';
      const args = ['--study="test"', '--topic="test"'];

      // When: Command is executed
      const startTime = Date.now();
      await cursorIntegration.executeSlashCommand(commandName, args);
      const endTime = Date.now();

      // Then: Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(1000); // Less than 1 second
    });

    it('should handle concurrent command execution', async () => {
      // Given: Multiple commands to execute concurrently
      const commands = [
        { name: 'research:questions', args: ['--study="study1"', '--topic="topic1"'] },
        { name: 'research:sources', args: ['--study="study2"', '--keywords="keywords"'] },
        { name: 'study:list', args: [] }
      ];

      // When: Commands are executed concurrently
      const startTime = Date.now();
      const results = await Promise.all(
        commands.map(cmd => cursorIntegration.executeSlashCommand(cmd.name, cmd.args))
      );
      const endTime = Date.now();

      // Then: All commands should complete successfully
      expect(results).toHaveLength(3);
      expect(endTime - startTime).toBeLessThan(2000); // Less than 2 seconds for all
    });

    it('should maintain state consistency across operations', async () => {
      // Given: Initial state
      const initialCommands = cursorIntegration.listSlashCommands();
      const initialCount = initialCommands.length;

      // When: Commands are registered and unregistered
      const newCommand: ISlashCommand = {
        name: 'test:command',
        description: 'Test command',
        parameters: ['param'],
        examples: ['/test:command --param="value"'],
        execute: async (params: Record<string, any>) => {
          // Mock implementation
        }
      };

      cursorIntegration.registerSlashCommand(newCommand);
      expect(cursorIntegration.listSlashCommands()).toHaveLength(initialCount + 1);

      cursorIntegration.unregisterSlashCommand('test:command');
      expect(cursorIntegration.listSlashCommands()).toHaveLength(initialCount);

      // Then: State should remain consistent
      expect(cursorIntegration.getSlashCommand('test:command')).toBeNull();
    });
  });
});
