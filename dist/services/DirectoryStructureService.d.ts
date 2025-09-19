/**
 * DirectoryStructureService - Handles creation of directory structures for Codex integration
 *
 * This service creates the required directory structure for Codex integration
 * including services, contracts, tests, and templates directories.
 */
export interface DirectoryCreationResult {
    success: boolean;
    errors: string[];
    createdDirectories: string[];
    skippedDirectories: string[];
}
export interface DirectoryInfo {
    path: string;
    exists: boolean;
    isDirectory: boolean;
    isWritable: boolean;
}
export declare class DirectoryStructureService {
    private projectRoot;
    constructor(projectRoot?: string);
    /**
     * Creates the complete Codex integration directory structure
     */
    createCodexDirectoryStructure(): Promise<DirectoryCreationResult>;
    /**
     * Creates a directory if it doesn't exist
     */
    private createDirectoryIfNotExists;
    /**
     * Creates a .gitkeep file in the specified directory
     */
    private createGitkeepFile;
    /**
     * Verifies that all required directories exist and are accessible
     */
    verifyDirectoryStructure(): Promise<DirectoryInfo[]>;
    /**
     * Checks if all required directories exist
     */
    areAllDirectoriesCreated(): Promise<boolean>;
    /**
     * Gets the status of directory creation
     */
    getDirectoryStatus(): Promise<{
        allCreated: boolean;
        missingDirectories: string[];
        inaccessibleDirectories: string[];
    }>;
    /**
     * Creates a single directory with error handling
     */
    createDirectory(dirPath: string): Promise<boolean>;
    /**
     * Creates a .gitkeep file in a directory
     */
    createGitkeep(dirPath: string): Promise<boolean>;
}
