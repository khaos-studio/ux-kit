/**
 * Path Utilities
 *
 * Cross-platform path handling utilities for UX-Kit.
 */
export declare class PathUtils {
    /**
     * Join multiple path segments into a single path
     */
    static joinPaths(...paths: string[]): string;
    /**
     * Extract the basename from a path
     */
    static basename(filePath: string, ext?: string): string;
    /**
     * Extract the directory name from a path
     */
    static dirname(filePath: string): string;
    /**
     * Get the file extension from a path
     */
    static getExtension(filePath: string): string;
    /**
     * Check if a path is absolute
     */
    static isAbsolute(filePath: string): boolean;
    /**
     * Resolve a path to an absolute path
     */
    static resolve(...paths: string[]): string;
    /**
     * Normalize a path by resolving '..' and '.' segments
     */
    static normalize(filePath: string): string;
    /**
     * Get the relative path from one path to another
     */
    static relative(from: string, to: string): string;
}
