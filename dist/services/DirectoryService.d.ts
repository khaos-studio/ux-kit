/**
 * Directory Service
 *
 * Handles creation and management of UX-Kit directory structure.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
export declare class DirectoryService {
    private fileSystem;
    constructor(fileSystem: IFileSystemService);
    createUXKitStructure(projectRoot: string): Promise<void>;
    createConfigFile(projectRoot: string, options?: {
        aiAgent?: string;
    }): Promise<void>;
    createPrinciplesFile(projectRoot: string): Promise<void>;
    isUXKitInitialized(projectRoot: string): Promise<boolean>;
    private convertToYaml;
}
