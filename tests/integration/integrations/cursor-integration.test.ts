/**
 * Integration Tests for Cursor Integration
 * 
 * Tests the complete workflow of Cursor IDE integration with UX-Kit.
 */

import { CursorIntegration } from '../../../src/integrations/CursorIntegration';
import { IDEInterface } from '../../../src/integrations/IDEInterface';
import { CommandExecutor } from '../../../src/integrations/CommandExecutor';
import { ISlashCommand, CursorPosition, NotificationType } from '../../../src/contracts/presentation-contracts';

describe('Cursor Integration Integration Tests', () => {
  let cursorIntegration: CursorIntegration;
  let ideInterface: IDEInterface;
  let commandExecutor: CommandExecutor;

  beforeEach(() => {
    ideInterface = new IDEInterface();
    commandExecutor = new CommandExecutor();
    cursorIntegration = new CursorIntegration(ideInterface, commandExecutor);
  });

  describe('Complete Research Workflow', () => {
    it('should execute complete research workflow from study creation to synthesis', async () => {
      // Given: User wants to conduct a complete research study
      const studyName = 'e-commerce-usability-study';
      const studyDescription = 'Comprehensive usability study for e-commerce checkout flow';
      const topic = 'e-commerce checkout process';
      const keywords = 'UX, usability, e-commerce, checkout, user experience';

      // Step 1: Create a new study
      await cursorIntegration.executeSlashCommand('study:create', [
        `--name="${studyName}"`,
        `--description="${studyDescription}"`
      ]);

      // Step 2: Generate research questions
      await cursorIntegration.executeSlashCommand('research:questions', [
        `--study="${studyName}"`,
        `--topic="${topic}"`,
        '--count=5',
        '--format="markdown"'
      ]);

      // Step 3: Gather research sources
      await cursorIntegration.executeSlashCommand('research:sources', [
        `--study="${studyName}"`,
        `--keywords="${keywords}"`,
        '--limit=10'
      ]);

      // Step 4: Process interview data
      await cursorIntegration.executeSlashCommand('research:interview', [
        `--study="${studyName}"`,
        '--participant="P001"',
        '--template="standard"'
      ]);

      // Step 5: Create research summary
      await cursorIntegration.executeSlashCommand('research:summarize', [
        `--study="${studyName}"`,
        '--format="markdown"',
        '--length="detailed"'
      ]);

      // Step 6: Synthesize research insights
      await cursorIntegration.executeSlashCommand('research:synthesize', [
        `--study="${studyName}"`,
        '--insights="key-findings"',
        '--format="report"'
      ]);

      // Then: All commands should execute successfully
      // (This is verified by the fact that no errors are thrown)
    });

    it('should handle study management workflow', async () => {
      // Given: Multiple studies exist
      const study1 = 'study-1';
      const study2 = 'study-2';

      // Step 1: Create first study
      await cursorIntegration.executeSlashCommand('study:create', [
        `--name="${study1}"`,
        '--description="First study"'
      ]);

      // Step 2: Create second study
      await cursorIntegration.executeSlashCommand('study:create', [
        `--name="${study2}"`,
        '--description="Second study"'
      ]);

      // Step 3: List all studies
      await cursorIntegration.executeSlashCommand('study:list', [
        '--format="table"'
      ]);

      // Step 4: Show details of first study
      await cursorIntegration.executeSlashCommand('study:show', [
        `--name="${study1}"`,
        '--format="detailed"'
      ]);

      // Step 5: Delete second study
      await cursorIntegration.executeSlashCommand('study:delete', [
        `--name="${study2}"`,
        '--confirm'
      ]);

      // Then: All commands should execute successfully
    });
  });

  describe('Command Registration and Management Integration', () => {
    it('should allow dynamic command registration and execution', async () => {
      // Given: Custom command definition
      const customCommand: ISlashCommand = {
        name: 'custom:analysis',
        description: 'Custom analysis command',
        parameters: ['data', 'method'],
        examples: ['/custom:analysis --data="user-data" --method="statistical"']
      };

      // When: Custom command is registered
      cursorIntegration.registerSlashCommand(customCommand);

      // Then: Command should be available
      const retrievedCommand = cursorIntegration.getSlashCommand('custom:analysis');
      expect(retrievedCommand).toEqual(customCommand);

      // And: Command should appear in list
      const allCommands = cursorIntegration.listSlashCommands();
      expect(allCommands.find(cmd => cmd.name === 'custom:analysis')).toBeDefined();

      // And: Help should be available
      cursorIntegration.showSlashCommandHelp('custom:analysis');
    });

    it('should handle command unregistration', async () => {
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

  describe('IDE Context Integration', () => {
    it('should use IDE context for command execution', async () => {
      // Given: IDE context is available
      const workspace = '/path/to/research/project';
      const currentFile = 'research-notes.md';
      const selection = 'selected research text';
      const cursorPosition: CursorPosition = { line: 10, character: 5 };

      // Mock IDE interface to return specific context
      jest.spyOn(ideInterface, 'getCurrentWorkspace').mockResolvedValue(workspace);
      jest.spyOn(ideInterface, 'getCurrentFile').mockResolvedValue(currentFile);
      jest.spyOn(ideInterface, 'getSelection').mockResolvedValue(selection);
      jest.spyOn(ideInterface, 'getCursorPosition').mockResolvedValue(cursorPosition);

      // When: Command is executed
      await cursorIntegration.executeSlashCommand('research:questions', [
        '--study="context-test"',
        '--topic="context integration"'
      ]);

      // Then: IDE context should be retrieved
      expect(ideInterface.getCurrentWorkspace).toHaveBeenCalled();
      expect(ideInterface.getCurrentFile).toHaveBeenCalled();
      expect(ideInterface.getSelection).toHaveBeenCalled();
      expect(ideInterface.getCursorPosition).toHaveBeenCalled();
    });

    it('should handle IDE operations for text manipulation', async () => {
      // Given: Text manipulation operations
      const textToInsert = 'Generated research questions:\n1. How do users interact with the system?';
      const replacementText = 'Updated research questions';
      const position: CursorPosition = { line: 5, character: 0 };

      // Mock IDE interface methods
      const insertTextSpy = jest.spyOn(ideInterface, 'insertText').mockResolvedValue(undefined);
      const replaceSelectionSpy = jest.spyOn(ideInterface, 'replaceSelection').mockResolvedValue(undefined);

      // When: Text operations are performed
      await cursorIntegration.insertText(textToInsert, position);
      await cursorIntegration.replaceSelection(replacementText);

      // Then: IDE interface should be called
      expect(insertTextSpy).toHaveBeenCalledWith(textToInsert, position);
      expect(replaceSelectionSpy).toHaveBeenCalledWith(replacementText);
    });

    it('should show notifications for user feedback', async () => {
      // Given: Different notification types
      const infoMessage = 'Research questions generated successfully';
      const errorMessage = 'Failed to generate research questions';
      const warningMessage = 'Some parameters were missing';

      // Mock IDE interface method
      const showNotificationSpy = jest.spyOn(ideInterface, 'showNotification').mockResolvedValue(undefined);

      // When: Notifications are shown
      await cursorIntegration.showNotification(infoMessage, NotificationType.INFO);
      await cursorIntegration.showNotification(errorMessage, NotificationType.ERROR);
      await cursorIntegration.showNotification(warningMessage, NotificationType.WARNING);

      // Then: IDE interface should be called with correct parameters
      expect(showNotificationSpy).toHaveBeenCalledWith(infoMessage, NotificationType.INFO);
      expect(showNotificationSpy).toHaveBeenCalledWith(errorMessage, NotificationType.ERROR);
      expect(showNotificationSpy).toHaveBeenCalledWith(warningMessage, NotificationType.WARNING);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle command execution errors gracefully', async () => {
      // Given: Command with invalid parameters
      const invalidArgs = ['--invalid-param="value"'];

      // When: Invalid command is executed
      await cursorIntegration.executeSlashCommand('research:questions', invalidArgs);

      // Then: Should handle error gracefully (no exception thrown)
      // The error should be handled internally and shown as notification
    });

    it('should handle IDE interface errors', async () => {
      // Given: IDE interface throws error
      jest.spyOn(ideInterface, 'getCurrentWorkspace').mockRejectedValue(new Error('IDE connection failed'));

      // When: Command is executed
      await expect(cursorIntegration.executeSlashCommand('research:questions', [
        '--study="test"',
        '--topic="test"'
      ])).rejects.toThrow('IDE connection failed');
    });

    it('should handle unknown commands', async () => {
      // When: Unknown command is executed
      await expect(cursorIntegration.executeSlashCommand('unknown:command', []))
        .rejects.toThrow('Unknown command: unknown:command');
    });
  });

  describe('Performance and Reliability Integration', () => {
    it('should handle concurrent command execution', async () => {
      // Given: Multiple commands to execute concurrently
      const commands = [
        { name: 'research:questions', args: ['--study="study1"', '--topic="topic1"'] },
        { name: 'research:sources', args: ['--study="study2"', '--keywords="keywords"'] },
        { name: 'study:list', args: [] },
        { name: 'research:summarize', args: ['--study="study3"'] }
      ];

      // When: Commands are executed concurrently
      const startTime = Date.now();
      const results = await Promise.all(
        commands.map(cmd => cursorIntegration.executeSlashCommand(cmd.name, cmd.args))
      );
      const endTime = Date.now();

      // Then: All commands should complete successfully
      expect(results).toHaveLength(4);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should maintain state consistency across operations', async () => {
      // Given: Initial state
      const initialCommands = cursorIntegration.listSlashCommands();
      const initialCount = initialCommands.length;

      // When: Commands are registered and unregistered
      const customCommand: ISlashCommand = {
        name: 'test:command',
        description: 'Test command',
        parameters: ['param'],
        examples: ['/test:command --param="value"']
      };

      cursorIntegration.registerSlashCommand(customCommand);
      expect(cursorIntegration.listSlashCommands()).toHaveLength(initialCount + 1);

      cursorIntegration.unregisterSlashCommand('test:command');
      expect(cursorIntegration.listSlashCommands()).toHaveLength(initialCount);

      // Then: State should remain consistent
      expect(cursorIntegration.getSlashCommand('test:command')).toBeNull();
    });

    it('should execute commands within acceptable time limits', async () => {
      // Given: Command to execute
      const commandName = 'research:questions';
      const args = ['--study="performance-test"', '--topic="performance"'];

      // When: Command is executed
      const startTime = Date.now();
      await cursorIntegration.executeSlashCommand(commandName, args);
      const endTime = Date.now();

      // Then: Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(1000); // Less than 1 second
    });
  });

  describe('Help System Integration', () => {
    it('should provide comprehensive help for all commands', async () => {
      // Given: All available commands
      const commands = cursorIntegration.listSlashCommands();

      // When: Help is requested for each command
      commands.forEach(command => {
        cursorIntegration.showSlashCommandHelp(command.name);
      });

      // Then: All commands should have help available
      expect(commands.length).toBeGreaterThan(0);
    });

    it('should provide general help for all commands', async () => {
      // When: General help is requested
      cursorIntegration.showAllSlashCommands();

      // Then: Should show help for all available commands
      // (This is verified by the fact that no errors are thrown)
    });

    it('should handle help requests for unknown commands', async () => {
      // When: Help is requested for unknown command
      cursorIntegration.showSlashCommandHelp('unknown:command');

      // Then: Should handle gracefully (no exception thrown)
      // The error should be handled internally and shown as notification
    });
  });
});
