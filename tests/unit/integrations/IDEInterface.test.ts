/**
 * Unit Tests for IDEInterface
 */

import { IDEInterface } from '../../../src/integrations/IDEInterface';
import { CursorPosition, NotificationType } from '../../../src/contracts/presentation-contracts';

describe('IDEInterface', () => {
  let ideInterface: IDEInterface;

  beforeEach(() => {
    ideInterface = new IDEInterface();
  });

  describe('getCurrentWorkspace', () => {
    it('should return current working directory by default', async () => {
      // When: Current workspace is requested
      const workspace = await ideInterface.getCurrentWorkspace();

      // Then: Should return current working directory
      expect(workspace).toBe(process.cwd());
    });
  });

  describe('getCurrentFile', () => {
    it('should return null by default', async () => {
      // When: Current file is requested
      const currentFile = await ideInterface.getCurrentFile();

      // Then: Should return null
      expect(currentFile).toBeNull();
    });
  });

  describe('getSelection', () => {
    it('should return null by default', async () => {
      // When: Current selection is requested
      const selection = await ideInterface.getSelection();

      // Then: Should return null
      expect(selection).toBeNull();
    });
  });

  describe('getCursorPosition', () => {
    it('should return null by default', async () => {
      // When: Cursor position is requested
      const position = await ideInterface.getCursorPosition();

      // Then: Should return null
      expect(position).toBeNull();
    });
  });

  describe('insertText', () => {
    it('should log insertion operation', async () => {
      // Given: Text to insert
      const text = 'Test text';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // When: Text is inserted
      await ideInterface.insertText(text);

      // Then: Should log the operation
      expect(consoleSpy).toHaveBeenCalledWith('Inserting text: "Test text" at position:', undefined);
      
      consoleSpy.mockRestore();
    });

    it('should log insertion operation with position', async () => {
      // Given: Text and position
      const text = 'Test text';
      const position: CursorPosition = { line: 5, character: 10 };
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // When: Text is inserted with position
      await ideInterface.insertText(text, position);

      // Then: Should log the operation with position
      expect(consoleSpy).toHaveBeenCalledWith('Inserting text: "Test text" at position:', position);
      
      consoleSpy.mockRestore();
    });
  });

  describe('replaceSelection', () => {
    it('should log replacement operation', async () => {
      // Given: Text to replace selection with
      const text = 'Replacement text';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // When: Selection is replaced
      await ideInterface.replaceSelection(text);

      // Then: Should log the operation
      expect(consoleSpy).toHaveBeenCalledWith('Replacing selection with: "Replacement text"');
      
      consoleSpy.mockRestore();
    });
  });

  describe('showNotification', () => {
    it('should log notification with default type', async () => {
      // Given: Notification message
      const message = 'Test notification';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // When: Notification is shown
      await ideInterface.showNotification(message);

      // Then: Should log with INFO type
      expect(consoleSpy).toHaveBeenCalledWith('[INFO] Test notification');
      
      consoleSpy.mockRestore();
    });

    it('should log notification with specified type', async () => {
      // Given: Notification message and type
      const message = 'Error notification';
      const type = NotificationType.ERROR;
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // When: Notification is shown with type
      await ideInterface.showNotification(message, type);

      // Then: Should log with specified type
      expect(consoleSpy).toHaveBeenCalledWith('[ERROR] Error notification');
      
      consoleSpy.mockRestore();
    });

    it('should handle all notification types', async () => {
      // Given: Different notification types
      const message = 'Test message';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // When: Notifications are shown with different types
      await ideInterface.showNotification(message, NotificationType.INFO);
      await ideInterface.showNotification(message, NotificationType.WARNING);
      await ideInterface.showNotification(message, NotificationType.ERROR);
      await ideInterface.showNotification(message, NotificationType.SUCCESS);

      // Then: Should log with correct types
      expect(consoleSpy).toHaveBeenCalledWith('[INFO] Test message');
      expect(consoleSpy).toHaveBeenCalledWith('[WARNING] Test message');
      expect(consoleSpy).toHaveBeenCalledWith('[ERROR] Test message');
      expect(consoleSpy).toHaveBeenCalledWith('[SUCCESS] Test message');
      
      consoleSpy.mockRestore();
    });
  });
});
