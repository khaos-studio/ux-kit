/**
 * User Guide Generator
 *
 * Generates comprehensive user guides and tutorials for UX-Kit.
 * This includes getting started guides, tutorials, and troubleshooting information.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
export declare class UserGuideGenerator {
    private fileSystem;
    constructor(fileSystem: IFileSystemService);
    /**
     * Generate user guide
     */
    generateUserGuide(projectRoot: string, outputPath: string): Promise<void>;
    /**
     * Generate main user guide README
     */
    private generateUserGuideReadme;
    /**
     * Generate getting started documentation
     */
    private generateGettingStartedDoc;
    /**
     * Generate tutorials documentation
     */
    private generateTutorialsDoc;
    /**
     * Generate examples documentation
     */
    private generateExamplesDoc;
    /**
     * Generate troubleshooting documentation
     */
    private generateTroubleshootingDoc;
}
