/**
 * File System Service
 * 
 * Main service that implements the IFileSystemService interface
 * using the utility classes for cross-platform file operations.
 */

import { IFileSystemService } from '../contracts/infrastructure-contracts';
import { PathUtils } from './PathUtils';
import { FileUtils } from './FileUtils';
import { DirectoryUtils } from './DirectoryUtils';

export class FileSystemService implements IFileSystemService {
  /**
   * Create a directory
   */
  async createDirectory(path: string, recursive: boolean = false): Promise<void> {
    await DirectoryUtils.createDirectory(path, recursive);
  }

  /**
   * Ensure a directory exists (create if it doesn't exist)
   */
  async ensureDirectoryExists(path: string): Promise<void> {
    await DirectoryUtils.ensureDirectoryExists(path);
  }

  /**
   * Write content to a file
   */
  async writeFile(path: string, content: string): Promise<void> {
    await FileUtils.writeFile(path, content);
  }

  /**
   * Read content from a file
   */
  async readFile(path: string): Promise<string> {
    return await FileUtils.readFile(path);
  }

  /**
   * Delete a file
   */
  async deleteFile(path: string): Promise<void> {
    await FileUtils.deleteFile(path);
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
    try {
      const stats = await FileUtils.getFileStats(path);
      return true;
    } catch {
      try {
        const stats = await DirectoryUtils.getDirectoryStats(path);
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * Check if a path is a directory
   */
  async isDirectory(path: string): Promise<boolean> {
    return await DirectoryUtils.isDirectory(path);
  }

  /**
   * List files in a directory
   */
  async listFiles(path: string, extension?: string): Promise<string[]> {
    return await DirectoryUtils.listFiles(path, extension);
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
