/**
 * Command Documentation Generator
 *
 * Generates comprehensive documentation for all CLI commands.
 * This includes command descriptions, usage examples, options, and parameters.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
export declare class CommandDocumentationGenerator {
    private fileSystem;
    constructor(fileSystem: IFileSystemService);
    /**
     * Generate command documentation
     */
    generateCommandDocumentation(projectRoot: string, outputPath: string): Promise<void>;
    /**
     * Generate main commands README
     */
    private generateCommandsReadme;
    /**
     * Generate init command documentation
     */
    private generateInitCommandDoc;
    /**
     * Generate study command documentation
     */
    private generateStudyCommandDoc;
    /**
     * Generate research command documentation
     */
    private generateResearchCommandDoc;
}
