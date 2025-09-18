/**
 * Path Utilities
 * 
 * Cross-platform path handling utilities for UX-Kit.
 */

import * as path from 'path';

export class PathUtils {
  /**
   * Join multiple path segments into a single path
   */
  static joinPaths(...paths: string[]): string {
    return path.join(...paths);
  }

  /**
   * Extract the basename from a path
   */
  static basename(filePath: string, ext?: string): string {
    return path.basename(filePath, ext);
  }

  /**
   * Extract the directory name from a path
   */
  static dirname(filePath: string): string {
    return path.dirname(filePath);
  }

  /**
   * Get the file extension from a path
   */
  static getExtension(filePath: string): string {
    return path.extname(filePath);
  }

  /**
   * Check if a path is absolute
   */
  static isAbsolute(filePath: string): boolean {
    return path.isAbsolute(filePath);
  }

  /**
   * Resolve a path to an absolute path
   */
  static resolve(...paths: string[]): string {
    return path.resolve(...paths);
  }

  /**
   * Normalize a path by resolving '..' and '.' segments
   */
  static normalize(filePath: string): string {
    return path.normalize(filePath);
  }

  /**
   * Get the relative path from one path to another
   */
  static relative(from: string, to: string): string {
    return path.relative(from, to);
  }
}
