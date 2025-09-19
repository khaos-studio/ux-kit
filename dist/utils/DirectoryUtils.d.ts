/**
 * Directory Utilities
 *
 * Directory operation utilities for UX-Kit.
 */
import { Stats } from 'fs';
export declare class DirectoryUtils {
    /**
     * Create a directory
     */
    static createDirectory(dirPath: string, recursive?: boolean): Promise<void>;
    /**
     * Ensure a directory exists (create if it doesn't exist)
     */
    static ensureDirectoryExists(dirPath: string): Promise<void>;
    /**
     * Delete a directory
     */
    static deleteDirectory(dirPath: string, recursive?: boolean): Promise<void>;
    /**
     * Check if a directory exists
     */
    static directoryExists(dirPath: string): Promise<boolean>;
    /**
     * List files in a directory
     */
    static listFiles(dirPath: string, extension?: string): Promise<string[]>;
    /**
     * List directories in a directory
     */
    static listDirectories(dirPath: string): Promise<string[]>;
    /**
     * Get directory statistics
     */
    static getDirectoryStats(dirPath: string): Promise<Stats>;
    /**
     * Copy a directory recursively
     */
    static copyDirectory(sourcePath: string, destPath: string): Promise<void>;
    /**
     * Get directory size in bytes
     */
    static getDirectorySize(dirPath: string): Promise<number>;
    /**
     * Check if a path is a directory
     */
    static isDirectory(dirPath: string): Promise<boolean>;
}
