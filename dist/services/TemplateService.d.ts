/**
 * Template Service
 *
 * Handles copying and management of template files.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
export declare class TemplateService {
    private fileSystem;
    constructor(fileSystem: IFileSystemService);
    copyTemplates(projectRoot: string, _templateSource?: string): Promise<void>;
    private createQuestionsTemplate;
    private createSourcesTemplate;
    private createSummarizeTemplate;
    private createInterviewTemplate;
    private createSynthesisTemplate;
}
