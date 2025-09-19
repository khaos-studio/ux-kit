/**
 * File System Service
 * 
 * Main service that implements the IFileSystemService interface
 * using the utility classes for cross-platform file operations.
 */

import { IFileSystemService, FileStats } from '../contracts/infrastructure-contracts';
import { PathUtils } from './PathUtils';
import { FileUtils } from './FileUtils';
import { DirectoryUtils } from './DirectoryUtils';

export class FileSystemService implements IFileSystemService {
  /**
   * Check if file exists
   */
  async fileExists(path: string): Promise<boolean> {
    try {
      const stats = await FileUtils.getFileStats(path);
      return stats.isFile();
    } catch {
      return false;
    }
  }

  /**
   * Check if directory exists
   */
  async directoryExists(path: string): Promise<boolean> {
    try {
      const stats = await DirectoryUtils.getDirectoryStats(path);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Create directory recursively
   */
  async createDirectory(path: string): Promise<void> {
    await DirectoryUtils.createDirectory(path, true);
  }

  /**
   * Read file content
   */
  async readFile(path: string): Promise<string> {
    return await FileUtils.readFile(path);
  }

  /**
   * Write file content
   */
  async writeFile(path: string, content: string): Promise<void> {
    await FileUtils.writeFile(path, content);
  }

  /**
   * List files in directory
   */
  async listFiles(directory: string, pattern?: string): Promise<readonly string[]> {
    return await DirectoryUtils.listFiles(directory, pattern);
  }

  /**
   * Delete file
   */
  async deleteFile(path: string): Promise<void> {
    await FileUtils.deleteFile(path);
  }

  /**
   * Get file stats
   */
  async getFileStats(path: string): Promise<FileStats> {
    try {
      const stats = await FileUtils.getFileStats(path);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        permissions: stats.mode.toString(8)
      };
    } catch {
      const stats = await DirectoryUtils.getDirectoryStats(path);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        permissions: stats.mode.toString(8)
      };
    }
  }

  // Additional utility methods for backward compatibility
  /**
   * Ensure a directory exists (create if it doesn't exist)
   */
  async ensureDirectoryExists(path: string): Promise<void> {
    await DirectoryUtils.ensureDirectoryExists(path);
  }

  /**
   * Delete a directory
   */
  async deleteDirectory(path: string, recursive: boolean = false): Promise<void> {
    await DirectoryUtils.deleteDirectory(path, recursive);
  }

  /**
   * Check if a path exists
   */
  async pathExists(path: string): Promise<boolean> {
    return await this.fileExists(path) || await this.directoryExists(path);
  }

  /**
   * Check if a path is a directory
   */
  async isDirectory(path: string): Promise<boolean> {
    return await this.directoryExists(path);
  }

  /**
   * List directories in a directory
   */
  async listDirectories(path: string): Promise<string[]> {
    return await DirectoryUtils.listDirectories(path);
  }

  /**
   * Join multiple path segments into a single path
   */
  joinPaths(...paths: string[]): string {
    return PathUtils.joinPaths(...paths);
  }

  /**
   * Extract the basename from a path
   */
  basename(path: string, ext?: string): string {
    return PathUtils.basename(path, ext);
  }

  /**
   * Extract the directory name from a path
   */
  dirname(path: string): string {
    return PathUtils.dirname(path);
  }
}
