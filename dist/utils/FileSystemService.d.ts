/**
 * File System Service
 *
 * Main service that implements the IFileSystemService interface
 * using the utility classes for cross-platform file operations.
 */
import { IFileSystemService, FileStats } from '../contracts/infrastructure-contracts';
export declare class FileSystemService implements IFileSystemService {
    /**
     * Check if file exists
     */
    fileExists(path: string): Promise<boolean>;
    /**
     * Check if directory exists
     */
    directoryExists(path: string): Promise<boolean>;
    /**
     * Create directory recursively
     */
    createDirectory(path: string): Promise<void>;
    /**
     * Read file content
     */
    readFile(path: string): Promise<string>;
    /**
     * Write file content
     */
    writeFile(path: string, content: string): Promise<void>;
    /**
     * List files in directory
     */
    listFiles(directory: string, pattern?: string): Promise<readonly string[]>;
    /**
     * Delete file
     */
    deleteFile(path: string): Promise<void>;
    /**
     * Get file stats
     */
    getFileStats(path: string): Promise<FileStats>;
    /**
     * Ensure a directory exists (create if it doesn't exist)
     */
    ensureDirectoryExists(path: string): Promise<void>;
    /**
     * Delete a directory
     */
    deleteDirectory(path: string, recursive?: boolean): Promise<void>;
    /**
     * Check if a path exists
     */
    pathExists(path: string): Promise<boolean>;
    /**
     * Check if a path is a directory
     */
    isDirectory(path: string): Promise<boolean>;
    /**
     * List directories in a directory
     */
    listDirectories(path: string): Promise<string[]>;
    /**
     * Join multiple path segments into a single path
     */
    joinPaths(...paths: string[]): string;
    /**
     * Extract the basename from a path
     */
    basename(path: string, ext?: string): string;
    /**
     * Extract the directory name from a path
     */
    dirname(path: string): string;
}
