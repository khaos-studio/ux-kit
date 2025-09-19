"use strict";
/**
 * Directory Utilities
 *
 * Directory operation utilities for UX-Kit.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryUtils = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class DirectoryUtils {
    /**
     * Create a directory
     */
    static async createDirectory(dirPath, recursive = false) {
        if (recursive) {
            await fs.mkdir(dirPath, { recursive: true });
        }
        else {
            await fs.mkdir(dirPath);
        }
    }
    /**
     * Ensure a directory exists (create if it doesn't exist)
     */
    static async ensureDirectoryExists(dirPath) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        }
        catch (error) {
            // If directory already exists, that's fine
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }
    /**
     * Delete a directory
     */
    static async deleteDirectory(dirPath, recursive = false) {
        if (recursive) {
            await fs.rm(dirPath, { recursive: true, force: true });
        }
        else {
            await fs.rmdir(dirPath);
        }
    }
    /**
     * Check if a directory exists
     */
    static async directoryExists(dirPath) {
        try {
            const stats = await fs.stat(dirPath);
            return stats.isDirectory();
        }
        catch {
            return false;
        }
    }
    /**
     * List files in a directory
     */
    static async listFiles(dirPath, extension) {
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
    static async listDirectories(dirPath) {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        return entries
            .filter(entry => entry.isDirectory())
            .map(entry => path.join(dirPath, entry.name));
    }
    /**
     * Get directory statistics
     */
    static async getDirectoryStats(dirPath) {
        return await fs.stat(dirPath);
    }
    /**
     * Copy a directory recursively
     */
    static async copyDirectory(sourcePath, destPath) {
        await fs.mkdir(destPath, { recursive: true });
        const entries = await fs.readdir(sourcePath, { withFileTypes: true });
        for (const entry of entries) {
            const sourceEntry = path.join(sourcePath, entry.name);
            const destEntry = path.join(destPath, entry.name);
            if (entry.isDirectory()) {
                await this.copyDirectory(sourceEntry, destEntry);
            }
            else {
                await fs.copyFile(sourceEntry, destEntry);
            }
        }
    }
    /**
     * Get directory size in bytes
     */
    static async getDirectorySize(dirPath) {
        let totalSize = 0;
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        for (const entry of entries) {
            const entryPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                totalSize += await this.getDirectorySize(entryPath);
            }
            else {
                const stats = await fs.stat(entryPath);
                totalSize += stats.size;
            }
        }
        return totalSize;
    }
    /**
     * Check if a path is a directory
     */
    static async isDirectory(dirPath) {
        try {
            const stats = await fs.stat(dirPath);
            return stats.isDirectory();
        }
        catch {
            return false;
        }
    }
}
exports.DirectoryUtils = DirectoryUtils;
//# sourceMappingURL=DirectoryUtils.js.map