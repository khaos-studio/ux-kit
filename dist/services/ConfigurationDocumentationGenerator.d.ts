/**
 * Configuration Documentation Generator
 *
 * Generates comprehensive documentation for UX-Kit configuration options.
 * This includes default configuration, customization options, and environment variables.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
export declare class ConfigurationDocumentationGenerator {
    private fileSystem;
    constructor(fileSystem: IFileSystemService);
    /**
     * Generate configuration documentation
     */
    generateConfigurationDocumentation(projectRoot: string, outputPath: string): Promise<void>;
    /**
     * Generate main configuration README
     */
    private generateConfigurationReadme;
    /**
     * Generate default configuration documentation
     */
    private generateDefaultConfigDoc;
    /**
     * Generate customization documentation
     */
    private generateCustomizationDoc;
}
