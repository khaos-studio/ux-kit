"use strict";
/**
 * File System Service
 *
 * Main service that implements the IFileSystemService interface
 * using the utility classes for cross-platform file operations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemService = void 0;
const PathUtils_1 = require("./PathUtils");
const FileUtils_1 = require("./FileUtils");
const DirectoryUtils_1 = require("./DirectoryUtils");
class FileSystemService {
    /**
     * Check if file exists
     */
    async fileExists(path) {
        try {
            const stats = await FileUtils_1.FileUtils.getFileStats(path);
            return stats.isFile();
        }
        catch {
            return false;
        }
    }
    /**
     * Check if directory exists
     */
    async directoryExists(path) {
        try {
            const stats = await DirectoryUtils_1.DirectoryUtils.getDirectoryStats(path);
            return stats.isDirectory();
        }
        catch {
            return false;
        }
    }
    /**
     * Create directory recursively
     */
    async createDirectory(path) {
        await DirectoryUtils_1.DirectoryUtils.createDirectory(path, true);
    }
    /**
     * Read file content
     */
    async readFile(path) {
        return await FileUtils_1.FileUtils.readFile(path);
    }
    /**
     * Write file content
     */
    async writeFile(path, content) {
        await FileUtils_1.FileUtils.writeFile(path, content);
    }
    /**
     * List files in directory
     */
    async listFiles(directory, pattern) {
        return await DirectoryUtils_1.DirectoryUtils.listFiles(directory, pattern);
    }
    /**
     * Delete file
     */
    async deleteFile(path) {
        await FileUtils_1.FileUtils.deleteFile(path);
    }
    /**
     * Get file stats
     */
    async getFileStats(path) {
        try {
            const stats = await FileUtils_1.FileUtils.getFileStats(path);
            return {
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                isFile: stats.isFile(),
                isDirectory: stats.isDirectory(),
                permissions: stats.mode.toString(8)
            };
        }
        catch {
            const stats = await DirectoryUtils_1.DirectoryUtils.getDirectoryStats(path);
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
    async ensureDirectoryExists(path) {
        await DirectoryUtils_1.DirectoryUtils.ensureDirectoryExists(path);
    }
    /**
     * Delete a directory
     */
    async deleteDirectory(path, recursive = false) {
        await DirectoryUtils_1.DirectoryUtils.deleteDirectory(path, recursive);
    }
    /**
     * Check if a path exists
     */
    async pathExists(path) {
        return await this.fileExists(path) || await this.directoryExists(path);
    }
    /**
     * Check if a path is a directory
     */
    async isDirectory(path) {
        return await this.directoryExists(path);
    }
    /**
     * List directories in a directory
     */
    async listDirectories(path) {
        return await DirectoryUtils_1.DirectoryUtils.listDirectories(path);
    }
    /**
     * Join multiple path segments into a single path
     */
    joinPaths(...paths) {
        return PathUtils_1.PathUtils.joinPaths(...paths);
    }
    /**
     * Extract the basename from a path
     */
    basename(path, ext) {
        return PathUtils_1.PathUtils.basename(path, ext);
    }
    /**
     * Extract the directory name from a path
     */
    dirname(path) {
        return PathUtils_1.PathUtils.dirname(path);
    }
}
exports.FileSystemService = FileSystemService;
//# sourceMappingURL=FileSystemService.js.map