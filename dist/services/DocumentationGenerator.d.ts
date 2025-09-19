/**
 * Documentation Generator Service
 *
 * Orchestrates the generation of comprehensive documentation for UX-Kit.
 * This service coordinates all documentation generation tasks including
 * CLI commands, configuration, API, user guides, and examples.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
import { CommandDocumentationGenerator } from './CommandDocumentationGenerator';
import { ConfigurationDocumentationGenerator } from './ConfigurationDocumentationGenerator';
import { APIDocumentationGenerator } from './APIDocumentationGenerator';
import { UserGuideGenerator } from './UserGuideGenerator';
export declare class DocumentationGenerator {
    private fileSystem;
    private commandDocGenerator;
    private configDocGenerator;
    private apiDocGenerator;
    private userGuideGenerator;
    constructor(fileSystem: IFileSystemService, commandDocGenerator: CommandDocumentationGenerator, configDocGenerator: ConfigurationDocumentationGenerator, apiDocGenerator: APIDocumentationGenerator, userGuideGenerator: UserGuideGenerator);
    /**
     * Generate all documentation for the project
     */
    generateAllDocumentation(projectRoot: string, outputPath: string): Promise<void>;
    /**
     * Ensure all documentation directories exist
     */
    private ensureDocumentationDirectories;
    /**
     * Generate the main documentation index
     */
    private generateMainIndex;
    /**
     * Generate examples and tutorials
     */
    private generateExamples;
    /**
     * Generate template documentation
     */
    private generateTemplateDocumentation;
}
