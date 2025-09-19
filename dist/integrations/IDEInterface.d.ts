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
    isCursorAvailable(): Promise<boolean>;
    getCursorVersion(): Promise<string | null>;
}
/**
 * Base IDE Interface implementation
 *
 * Provides a foundation for IDE-specific implementations.
 */
export declare class IDEInterface {
}
