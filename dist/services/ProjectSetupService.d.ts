/**
 * ProjectSetupService - Handles project setup verification and dependency management
 *
 * This service verifies that the project meets all requirements for Codex integration
 * including TypeScript version, Node.js version, and existing dependencies.
 */
export interface ProjectSetupResult {
    success: boolean;
    errors: string[];
    warnings: string[];
    details: {
        nodeVersion: string;
        typescriptVersion: string;
        dependenciesInstalled: boolean;
        strictModeEnabled: boolean;
        testFrameworkConfigured: boolean;
    };
}
export interface DependencyInfo {
    name: string;
    version: string;
    required: boolean;
    installed: boolean;
}
export declare class ProjectSetupService {
    private projectRoot;
    constructor(projectRoot?: string);
    /**
     * Verifies the complete project setup for Codex integration
     */
    verifyProjectSetup(): Promise<ProjectSetupResult>;
    /**
     * Gets the current Node.js version
     */
    private getNodeVersion;
    /**
     * Gets the current TypeScript version
     */
    private getTypeScriptVersion;
    /**
     * Validates Node.js version meets minimum requirement
     */
    private isNodeVersionValid;
    /**
     * Validates TypeScript version meets minimum requirement
     */
    private isTypeScriptVersionValid;
    /**
     * Verifies the project has required directory structure
     */
    private verifyProjectStructure;
    /**
     * Verifies that all required dependencies are installed
     */
    private verifyDependencies;
    /**
     * Verifies TypeScript strict mode configuration
     */
    private verifyTypeScriptConfig;
    /**
     * Verifies test framework configuration
     */
    private verifyTestFramework;
    /**
     * Installs project dependencies
     */
    installDependencies(): Promise<boolean>;
    /**
     * Gets information about project dependencies
     */
    getDependencyInfo(): DependencyInfo[];
    /**
     * Checks if a specific dependency is installed
     */
    private isDependencyInstalled;
}
