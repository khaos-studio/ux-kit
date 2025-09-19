/**
 * File Utilities
 *
 * File operation utilities for UX-Kit.
 */
import { Stats } from 'fs';
export declare class FileUtils {
    /**
     * Write content to a file
     */
    static writeFile(filePath: string, content: string): Promise<void>;
    /**
     * Read content from a file
     */
    static readFile(filePath: string): Promise<string>;
    /**
     * Delete a file
     */
    static deleteFile(filePath: string): Promise<void>;
    /**
     * Check if a file exists
     */
    static fileExists(filePath: string): Promise<boolean>;
    /**
     * Get file statistics
     */
    static getFileStats(filePath: string): Promise<Stats>;
    /**
     * Copy a file from source to destination
     */
    static copyFile(sourcePath: string, destPath: string): Promise<void>;
    /**
     * Move a file from source to destination
     */
    static moveFile(sourcePath: string, destPath: string): Promise<void>;
    /**
     * Get file size in bytes
     */
    static getFileSize(filePath: string): Promise<number>;
    /**
     * Get file modification time
     */
    static getFileModifiedTime(filePath: string): Promise<Date>;
}
