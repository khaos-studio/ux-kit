/**
 * API Documentation Generator
 *
 * Generates comprehensive API documentation for UX-Kit services and interfaces.
 * This includes service documentation, contract definitions, and usage examples.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
export declare class APIDocumentationGenerator {
    private fileSystem;
    constructor(fileSystem: IFileSystemService);
    /**
     * Generate API documentation
     */
    generateAPIDocumentation(projectRoot: string, outputPath: string): Promise<void>;
    /**
     * Generate main API README
     */
    private generateAPIReadme;
    /**
     * Generate services documentation
     */
    private generateServicesDoc;
    /**
     * Generate contracts documentation
     */
    private generateContractsDoc;
    /**
     * Generate examples documentation
     */
    private generateExamplesDoc;
}
