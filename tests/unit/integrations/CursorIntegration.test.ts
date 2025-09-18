/**
 * Unit Tests for CursorIntegration
 */

import { CursorIntegration } from '../../../src/integrations/CursorIntegration';
import { IDEInterface } from '../../../src/integrations/IDEInterface';
import { CommandExecutor } from '../../../src/integrations/CommandExecutor';
import { ISlashCommand, CursorPosition, NotificationType } from '../../../src/contracts/presentation-contracts';

describe('CursorIntegration', () => {
  let cursorIntegration: CursorIntegration;
  let mockIDEInterface: jest.Mocked<IDEInterface>;
  let mockCommandExecutor: jest.Mocked<CommandExecutor>;

  beforeEach(() => {
    mockIDEInterface = {
      getCurrentWorkspace: jest.fn(),
      getCurrentFile: jest.fn(),
      getSelection: jest.fn(),
      getCursorPosition: jest.fn(),
      insertText: jest.fn(),
      replaceSelection: jest.fn(),
      showNotification: jest.fn()
    } as any;

    mockCommandExecutor = {
      execute: jest.fn(),
      registerHandler: jest.fn(),
      unregisterHandler: jest.fn(),
      getAvailableCommands: jest.fn(),
      hasCommand: jest.fn()
    } as any;

    cursorIntegration = new CursorIntegration(mockIDEInterface, mockCommandExecutor);
  });

  describe('constructor', () => {
    it('should initialize with correct properties', () => {
      // Then: Should have correct name, version, and supported commands
      expect(cursorIntegration.name).toBe('cursor');
      expect(cursorIntegration.version).toBe('1.0.0');
      expect(cursorIntegration.supportedCommands).toHaveLength(9);
      expect(cursorIntegration.supportedCommands).toContain('research:questions');
      expect(cursorIntegration.supportedCommands).toContain('study:create');
    });

    it('should register default commands on initialization', () => {
      // Then: Should have all default commands registered
      const commands = cursorIntegration.listSlashCommands();
      expect(commands).toHaveLength(9);
      
      const commandNames = commands.map(cmd => cmd.name);
      expect(commandNames).toContain('research:questions');
      expect(commandNames).toContain('research:sources');
      expect(commandNames).toContain('research:summarize');
      expect(commandNames).toContain('research:interview');
      expect(commandNames).toContain('research:synthesize');
      expect(commandNames).toContain('study:create');
      expect(commandNames).toContain('study:list');
      expect(commandNames).toContain('study:show');
      expect(commandNames).toContain('study:delete');
    });
  });

  describe('registerSlashCommand', () => {
    it('should register a new slash command', () => {
      // Given: New slash command
      const newCommand: ISlashCommand = {
        name: 'test:command',
        description: 'Test command',
        parameters: ['param1'],
        examples: ['/test:command --param1="value"']
      };

      // When: Command is registered
      cursorIntegration.registerSlashCommand(newCommand);

      // Then: Command should be available
      const retrievedCommand = cursorIntegration.getSlashCommand('test:command');
      expect(retrievedCommand).toEqual(newCommand);
      expect(cursorIntegration.listSlashCommands()).toContain(newCommand);
    });

    it('should update existing command when registering duplicate', () => {
      // Given: Existing command
      const originalCommand = cursorIntegration.getSlashCommand('research:questions');
      expect(originalCommand).toBeDefined();

      // When: Same command is registered with updated description
      const updatedCommand: ISlashCommand = {
        name: 'research:questions',
        description: 'Updated description',
        parameters: ['study', 'topic'],
        examples: ['/research:questions --study="test" --topic="test"']
      };
      cursorIntegration.registerSlashCommand(updatedCommand);

      // Then: Command should be updated
      const retrievedCommand = cursorIntegration.getSlashCommand('research:questions');
      expect(retrievedCommand?.description).toBe('Updated description');
    });
  });

  describe('unregisterSlashCommand', () => {
    it('should unregister a slash command', () => {
      // Given: Registered command
      const command = cursorIntegration.getSlashCommand('research:questions');
      expect(command).toBeDefined();

      // When: Command is unregistered
      cursorIntegration.unregisterSlashCommand('research:questions');

      // Then: Command should no longer be available
      expect(cursorIntegration.getSlashCommand('research:questions')).toBeNull();
      expect(cursorIntegration.listSlashCommands().find(cmd => cmd.name === 'research:questions')).toBeUndefined();
    });
  });

  describe('getSlashCommand', () => {
    it('should return registered command', () => {
      // When: Getting registered command
      const command = cursorIntegration.getSlashCommand('research:questions');

      // Then: Should return the command
      expect(command).toBeDefined();
      expect(command?.name).toBe('research:questions');
    });

    it('should return null for unregistered command', () => {
      // When: Getting unregistered command
      const command = cursorIntegration.getSlashCommand('non:existing');

      // Then: Should return null
      expect(command).toBeNull();
    });
  });

  describe('listSlashCommands', () => {
    it('should return all registered commands', () => {
      // When: Listing commands
      const commands = cursorIntegration.listSlashCommands();

      // Then: Should return array of commands
      expect(Array.isArray(commands)).toBe(true);
      expect(commands.length).toBe(9);
      commands.forEach(cmd => {
        expect(cmd).toHaveProperty('name');
        expect(cmd).toHaveProperty('description');
        expect(cmd).toHaveProperty('parameters');
        expect(cmd).toHaveProperty('examples');
      });
    });
  });

  describe('executeSlashCommand', () => {
    beforeEach(() => {
      mockIDEInterface.getCurrentWorkspace.mockResolvedValue('/test/workspace');
      mockIDEInterface.getCurrentFile.mockResolvedValue('test.md');
      mockIDEInterface.getSelection.mockResolvedValue('selected text');
      mockIDEInterface.getCursorPosition.mockResolvedValue({ line: 5, character: 10 });
    });

    it('should execute command successfully', async () => {
      // Given: Successful command execution
      mockCommandExecutor.execute.mockResolvedValue({
        success: true,
        output: 'Test output',
        metadata: { test: 'data' }
      });

      // When: Command is executed
      await cursorIntegration.executeSlashCommand('research:questions', ['--study="test"', '--topic="test"']);

      // Then: Should call command executor with correct parameters
      expect(mockCommandExecutor.execute).toHaveBeenCalledWith(
        'research:questions',
        ['--study="test"', '--topic="test"'],
        {
          workspace: '/test/workspace',
          currentFile: 'test.md',
          selection: 'selected text',
          cursorPosition: { line: 5, character: 10 }
        }
      );

      // And: Should show success notification
      expect(mockIDEInterface.showNotification).toHaveBeenCalledWith(
        'Command "research:questions" executed successfully',
        NotificationType.SUCCESS
      );

      // And: Should insert output text
      expect(mockIDEInterface.insertText).toHaveBeenCalledWith('Test output', undefined);
    });

    it('should handle command execution failure', async () => {
      // Given: Failed command execution
      mockCommandExecutor.execute.mockResolvedValue({
        success: false,
        error: 'Test error',
        metadata: { test: 'data' }
      });

      // When: Command is executed
      await cursorIntegration.executeSlashCommand('research:questions', ['--study="test"']);

      // Then: Should show error notification
      expect(mockIDEInterface.showNotification).toHaveBeenCalledWith(
        'Command "research:questions" failed: Test error',
        NotificationType.ERROR
      );

      // And: Should not insert text
      expect(mockIDEInterface.insertText).not.toHaveBeenCalled();
    });

    it('should handle unknown command', async () => {
      // When: Unknown command is executed
      await expect(cursorIntegration.executeSlashCommand('unknown:command', []))
        .rejects.toThrow('Unknown command: unknown:command');
    });

    it('should handle command executor exceptions', async () => {
      // Given: Command executor throws exception
      mockCommandExecutor.execute.mockRejectedValue(new Error('Executor error'));

      // When: Command is executed
      await expect(cursorIntegration.executeSlashCommand('research:questions', []))
        .rejects.toThrow('Executor error');

      // Then: Should show error notification
      expect(mockIDEInterface.showNotification).toHaveBeenCalledWith(
        'Command "research:questions" failed: Executor error',
        NotificationType.ERROR
      );
    });

    it('should handle null/undefined values from IDE operations', async () => {
      // Given: IDE operations return null values
      mockIDEInterface.getCurrentFile.mockResolvedValue(null);
      mockIDEInterface.getSelection.mockResolvedValue(null);
      mockIDEInterface.getCursorPosition.mockResolvedValue(null);
      mockCommandExecutor.execute.mockResolvedValue({
        success: true,
        output: 'Test output'
      });

      // When: Command is executed
      await cursorIntegration.executeSlashCommand('research:questions', []);

      // Then: Should call command executor with null values
      expect(mockCommandExecutor.execute).toHaveBeenCalledWith(
        'research:questions',
        [],
        {
          workspace: '/test/workspace',
          currentFile: null,
          selection: null,
          cursorPosition: null
        }
      );
    });
  });

  describe('showSlashCommandHelp', () => {
    it('should show help for existing command', () => {
      // When: Help is requested for existing command
      cursorIntegration.showSlashCommandHelp('research:questions');

      // Then: Should show notification with help text
      expect(mockIDEInterface.showNotification).toHaveBeenCalledWith(
        expect.stringContaining('# research:questions'),
        NotificationType.INFO
      );
    });

    it('should show error for unknown command', () => {
      // When: Help is requested for unknown command
      cursorIntegration.showSlashCommandHelp('unknown:command');

      // Then: Should show error notification
      expect(mockIDEInterface.showNotification).toHaveBeenCalledWith(
        'Command "unknown:command" not found',
        NotificationType.ERROR
      );
    });
  });

  describe('showAllSlashCommands', () => {
    it('should show help for all commands', () => {
      // When: Help is requested for all commands
      cursorIntegration.showAllSlashCommands();

      // Then: Should show notification with all commands
      expect(mockIDEInterface.showNotification).toHaveBeenCalledWith(
        expect.stringContaining('# Available Commands'),
        NotificationType.INFO
      );
    });
  });

  describe('IDE operations delegation', () => {
    it('should delegate getCurrentWorkspace to IDE interface', async () => {
      // Given: IDE interface returns workspace
      mockIDEInterface.getCurrentWorkspace.mockResolvedValue('/test/workspace');

      // When: Current workspace is requested
      const workspace = await cursorIntegration.getCurrentWorkspace();

      // Then: Should return workspace from IDE interface
      expect(workspace).toBe('/test/workspace');
      expect(mockIDEInterface.getCurrentWorkspace).toHaveBeenCalled();
    });

    it('should delegate getCurrentFile to IDE interface', async () => {
      // Given: IDE interface returns file
      mockIDEInterface.getCurrentFile.mockResolvedValue('test.md');

      // When: Current file is requested
      const file = await cursorIntegration.getCurrentFile();

      // Then: Should return file from IDE interface
      expect(file).toBe('test.md');
      expect(mockIDEInterface.getCurrentFile).toHaveBeenCalled();
    });

    it('should delegate getSelection to IDE interface', async () => {
      // Given: IDE interface returns selection
      mockIDEInterface.getSelection.mockResolvedValue('selected text');

      // When: Current selection is requested
      const selection = await cursorIntegration.getSelection();

      // Then: Should return selection from IDE interface
      expect(selection).toBe('selected text');
      expect(mockIDEInterface.getSelection).toHaveBeenCalled();
    });

    it('should delegate getCursorPosition to IDE interface', async () => {
      // Given: IDE interface returns position
      const position: CursorPosition = { line: 5, character: 10 };
      mockIDEInterface.getCursorPosition.mockResolvedValue(position);

      // When: Cursor position is requested
      const result = await cursorIntegration.getCursorPosition();

      // Then: Should return position from IDE interface
      expect(result).toEqual(position);
      expect(mockIDEInterface.getCursorPosition).toHaveBeenCalled();
    });

    it('should delegate insertText to IDE interface', async () => {
      // Given: Text and position
      const text = 'Test text';
      const position: CursorPosition = { line: 5, character: 10 };

      // When: Text is inserted
      await cursorIntegration.insertText(text, position);

      // Then: Should call IDE interface
      expect(mockIDEInterface.insertText).toHaveBeenCalledWith(text, position);
    });

    it('should delegate replaceSelection to IDE interface', async () => {
      // Given: Replacement text
      const text = 'Replacement text';

      // When: Selection is replaced
      await cursorIntegration.replaceSelection(text);

      // Then: Should call IDE interface
      expect(mockIDEInterface.replaceSelection).toHaveBeenCalledWith(text);
    });

    it('should delegate showNotification to IDE interface', async () => {
      // Given: Notification message and type
      const message = 'Test notification';
      const type = NotificationType.WARNING;

      // When: Notification is shown
      await cursorIntegration.showNotification(message, type);

      // Then: Should call IDE interface
      expect(mockIDEInterface.showNotification).toHaveBeenCalledWith(message, type);
    });
  });
});
