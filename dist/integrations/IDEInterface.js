"use strict";
/**
 * IDE Interface
 *
 * Abstract interface for IDE operations that can be implemented
 * by different IDE integrations (Cursor, VS Code, etc.).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDEInterface = void 0;
const presentation_contracts_1 = require("../contracts/presentation-contracts");
/**
 * Base IDE Interface implementation
 *
 * Provides a foundation for IDE-specific implementations.
 */
class IDEInterface {
    /**
     * Get the current workspace path
     */
    async getCurrentWorkspace() {
        // Default implementation - should be overridden by specific IDE implementations
        return process.cwd();
    }
    /**
     * Get the current file path
     */
    async getCurrentFile() {
        // Default implementation - should be overridden by specific IDE implementations
        return null;
    }
    /**
     * Get the currently selected text
     */
    async getSelection() {
        // Default implementation - should be overridden by specific IDE implementations
        return null;
    }
    /**
     * Get the current cursor position
     */
    async getCursorPosition() {
        // Default implementation - should be overridden by specific IDE implementations
        return null;
    }
    /**
     * Insert text at the specified position
     */
    async insertText(text, position) {
        // Default implementation - should be overridden by specific IDE implementations
        // For now, just log the operation
        console.log(`Inserting text: "${text}" at position:`, position);
    }
    /**
     * Replace the current selection with new text
     */
    async replaceSelection(text) {
        // Default implementation - should be overridden by specific IDE implementations
        // For now, just log the operation
        console.log(`Replacing selection with: "${text}"`);
    }
    /**
     * Show a notification to the user
     */
    async showNotification(message, type = presentation_contracts_1.NotificationType.INFO) {
        // Default implementation - should be overridden by specific IDE implementations
        // For now, just log the notification
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
    /**
     * Check if Cursor is available
     */
    async isCursorAvailable() {
        // Default implementation - should be overridden by specific IDE implementations
        return false;
    }
    /**
     * Get Cursor version
     */
    async getCursorVersion() {
        // Default implementation - should be overridden by specific IDE implementations
        return null;
    }
}
exports.IDEInterface = IDEInterface;
//# sourceMappingURL=IDEInterface.js.map