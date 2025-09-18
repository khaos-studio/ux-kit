/**
 * File Utilities
 * 
 * File operation utilities for UX-Kit.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { Stats } from 'fs';

export class FileUtils {
  /**
   * Write content to a file
   */
  static async writeFile(filePath: string, content: string): Promise<void> {
    // Ensure directory exists before writing
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(filePath, content, 'utf8');
  }

  /**
   * Read content from a file
   */
  static async readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf8');
  }

  /**
   * Delete a file
   */
  static async deleteFile(filePath: string): Promise<void> {
    await fs.unlink(filePath);
  }

  /**
   * Check if a file exists
   */
  static async fileExists(filePath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(filePath);
      return stats.isFile();
    } catch {
      return false;
    }
  }

  /**
   * Get file statistics
   */
  static async getFileStats(filePath: string): Promise<Stats> {
    return await fs.stat(filePath);
  }

  /**
   * Copy a file from source to destination
   */
  static async copyFile(sourcePath: string, destPath: string): Promise<void> {
    // Ensure destination directory exists
    const destDir = path.dirname(destPath);
    await fs.mkdir(destDir, { recursive: true });
    
    await fs.copyFile(sourcePath, destPath);
  }

  /**
   * Move a file from source to destination
   */
  static async moveFile(sourcePath: string, destPath: string): Promise<void> {
    // Ensure destination directory exists
    const destDir = path.dirname(destPath);
    await fs.mkdir(destDir, { recursive: true });
    
    await fs.rename(sourcePath, destPath);
  }

  /**
   * Get file size in bytes
   */
  static async getFileSize(filePath: string): Promise<number> {
    const stats = await fs.stat(filePath);
    return stats.size;
  }

  /**
   * Get file modification time
   */
  static async getFileModifiedTime(filePath: string): Promise<Date> {
    const stats = await fs.stat(filePath);
    return stats.mtime;
  }
}
