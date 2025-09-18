/**
 * Directory Utilities
 * 
 * Directory operation utilities for UX-Kit.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { Stats } from 'fs';

export class DirectoryUtils {
  /**
   * Create a directory
   */
  static async createDirectory(dirPath: string, recursive: boolean = false): Promise<void> {
    if (recursive) {
      await fs.mkdir(dirPath, { recursive: true });
    } else {
      await fs.mkdir(dirPath);
    }
  }

  /**
   * Ensure a directory exists (create if it doesn't exist)
   */
  static async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error: any) {
      // If directory already exists, that's fine
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  /**
   * Delete a directory
   */
  static async deleteDirectory(dirPath: string, recursive: boolean = false): Promise<void> {
    if (recursive) {
      await fs.rm(dirPath, { recursive: true, force: true });
    } else {
      await fs.rmdir(dirPath);
    }
  }

  /**
   * Check if a directory exists
   */
  static async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * List files in a directory
   */
  static async listFiles(dirPath: string, extension?: string): Promise<string[]> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = entries
      .filter(entry => entry.isFile())
      .map(entry => path.join(dirPath, entry.name));

    if (extension) {
      return files.filter(file => path.extname(file) === extension);
    }

    return files;
  }

  /**
   * List directories in a directory
   */
  static async listDirectories(dirPath: string): Promise<string[]> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => path.join(dirPath, entry.name));
  }

  /**
   * Get directory statistics
   */
  static async getDirectoryStats(dirPath: string): Promise<Stats> {
    return await fs.stat(dirPath);
  }

  /**
   * Copy a directory recursively
   */
  static async copyDirectory(sourcePath: string, destPath: string): Promise<void> {
    await fs.mkdir(destPath, { recursive: true });
    
    const entries = await fs.readdir(sourcePath, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourceEntry = path.join(sourcePath, entry.name);
      const destEntry = path.join(destPath, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(sourceEntry, destEntry);
      } else {
        await fs.copyFile(sourceEntry, destEntry);
      }
    }
  }

  /**
   * Get directory size in bytes
   */
  static async getDirectorySize(dirPath: string): Promise<number> {
    let totalSize = 0;
    
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        totalSize += await this.getDirectorySize(entryPath);
      } else {
        const stats = await fs.stat(entryPath);
        totalSize += stats.size;
      }
    }
    
    return totalSize;
  }

  /**
   * Check if a path is a directory
   */
  static async isDirectory(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }
}
