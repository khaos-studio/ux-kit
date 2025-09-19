/**
 * DirectoryGenerator - Manages directory structure creation
 *
 * This class handles the creation of directory structures for
 * research studies and other organizational needs.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
export interface GenerationResult {
    success: boolean;
    filePath?: string;
    error?: string;
}
export interface StudyConfig {
    studyId: string;
    studyName: string;
    [key: string]: any;
}
export declare class DirectoryGenerator {
    private fileSystem;
    constructor(fileSystem: IFileSystemService);
    /**
     * Creates study directory structure
     * @param basePath The base path for the study
     * @param config The study configuration
     * @returns Generation result
     */
    createStudyStructure(basePath: string, config: StudyConfig): Promise<GenerationResult>;
    /**
     * Creates nested directory structure
     * @param path The full path to create
     * @returns Generation result
     */
    createNestedDirectories(path: string): Promise<GenerationResult>;
}
