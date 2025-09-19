"use strict";
/**
 * DirectoryGenerator - Manages directory structure creation
 *
 * This class handles the creation of directory structures for
 * research studies and other organizational needs.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryGenerator = void 0;
class DirectoryGenerator {
    constructor(fileSystem) {
        this.fileSystem = fileSystem;
    }
    /**
     * Creates study directory structure
     * @param basePath The base path for the study
     * @param config The study configuration
     * @returns Generation result
     */
    async createStudyStructure(basePath, config) {
        try {
            // Create base directory
            await this.fileSystem.ensureDirectoryExists(basePath);
            // Create subdirectories
            await this.fileSystem.ensureDirectoryExists(this.fileSystem.joinPaths(basePath, 'interviews'));
            await this.fileSystem.ensureDirectoryExists(this.fileSystem.joinPaths(basePath, 'summaries'));
            await this.fileSystem.ensureDirectoryExists(this.fileSystem.joinPaths(basePath, 'insights'));
            return {
                success: true,
                filePath: basePath
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Creates nested directory structure
     * @param path The full path to create
     * @returns Generation result
     */
    async createNestedDirectories(path) {
        try {
            if (!path || path.trim() === '') {
                return {
                    success: false,
                    error: 'Invalid path'
                };
            }
            // Create the directory and all parent directories
            await this.fileSystem.ensureDirectoryExists(path);
            return {
                success: true,
                filePath: path
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}
exports.DirectoryGenerator = DirectoryGenerator;
//# sourceMappingURL=DirectoryGenerator.js.map