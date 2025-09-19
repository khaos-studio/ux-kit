/**
 * T001: Project Structure Setup
 *
 * Creates the directory structure and initial files for the remote installation system.
 */
export declare class ProjectStructureSetup {
    private projectRoot;
    constructor(projectRoot?: string);
    /**
     * Creates the complete directory structure for the remote installation system
     */
    setupProjectStructure(): Promise<void>;
    /**
     * Creates the main directory structure
     */
    private createMainDirectories;
    /**
     * Creates module files
     */
    private createModuleFiles;
    /**
     * Creates utility files
     */
    private createUtilityFiles;
    /**
     * Creates install scripts
     */
    private createInstallScripts;
    /**
     * Ensures a directory exists, creating it if necessary
     */
    private ensureDirectoryExists;
    /**
     * Creates a shell script with proper permissions
     */
    private createShellScript;
    /**
     * Gets template content for core modules
     */
    private getModuleTemplate;
    /**
     * Gets template content for package manager modules
     */
    private getPackageManagerTemplate;
    /**
     * Gets template content for utility files
     */
    private getUtilityTemplate;
    /**
     * Gets template content for install scripts
     */
    private getInstallScriptTemplate;
}
