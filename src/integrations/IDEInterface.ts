/**
 * IDE Interface
 * 
 * Abstract interface for IDE operations that can be implemented
 * by different IDE integrations (Cursor, VS Code, etc.).
 */

import { CursorPosition, NotificationType } from '../contracts/presentation-contracts';

export interface IDEInterface {
  getCurrentWorkspace(): Promise<string>;
  getCurrentFile(): Promise<string | null>;
  getSelection(): Promise<string | null>;
  getCursorPosition(): Promise<CursorPosition | null>;
  insertText(text: string, position?: CursorPosition): Promise<void>;
  replaceSelection(text: string): Promise<void>;
  showNotification(message: string, type?: NotificationType): Promise<void>;
}

/**
 * Base IDE Interface implementation
 * 
 * Provides a foundation for IDE-specific implementations.
 */
export class IDEInterface {
  /**
   * Get the current workspace path
   */
  async getCurrentWorkspace(): Promise<string> {
    // Default implementation - should be overridden by specific IDE implementations
    return process.cwd();
  }

  /**
   * Get the current file path
   */
  async getCurrentFile(): Promise<string | null> {
    // Default implementation - should be overridden by specific IDE implementations
    return null;
  }

  /**
   * Get the currently selected text
   */
  async getSelection(): Promise<string | null> {
    // Default implementation - should be overridden by specific IDE implementations
    return null;
  }

  /**
   * Get the current cursor position
   */
  async getCursorPosition(): Promise<CursorPosition | null> {
    // Default implementation - should be overridden by specific IDE implementations
    return null;
  }

  /**
   * Insert text at the specified position
   */
  async insertText(text: string, position?: CursorPosition): Promise<void> {
    // Default implementation - should be overridden by specific IDE implementations
    // For now, just log the operation
    console.log(`Inserting text: "${text}" at position:`, position);
  }

  /**
   * Replace the current selection with new text
   */
  async replaceSelection(text: string): Promise<void> {
    // Default implementation - should be overridden by specific IDE implementations
    // For now, just log the operation
    console.log(`Replacing selection with: "${text}"`);
  }

  /**
   * Show a notification to the user
   */
  async showNotification(message: string, type: NotificationType = NotificationType.INFO): Promise<void> {
    // Default implementation - should be overridden by specific IDE implementations
    // For now, just log the notification
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}
