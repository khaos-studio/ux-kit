/**
 * Study Service
 *
 * Handles creation, management, and operations on research studies.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
export interface StudyMetadata {
    id: string;
    name: string;
    description?: string;
    basePath: string;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}
export declare class StudyService {
    private fileSystem;
    constructor(fileSystem: IFileSystemService);
    createStudy(name: string, description: string | undefined, projectRoot: string): Promise<StudyMetadata>;
    listStudies(projectRoot: string): Promise<StudyMetadata[]>;
    getStudy(studyId: string, projectRoot: string): Promise<StudyMetadata | undefined>;
    deleteStudy(studyId: string, projectRoot: string): Promise<void>;
    private generateStudyId;
    private createStudyConfig;
    private createInitialArtifacts;
    private convertToYaml;
    private parseYamlConfig;
}
