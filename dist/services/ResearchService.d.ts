/**
 * ResearchService
 *
 * Orchestrates research workflow operations and coordinates between
 * file generation and study management.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
import { FileGenerator, Source } from './FileGenerator';
export interface ResearchResult {
    success: boolean;
    filePath: string;
    message: string;
    error?: string | undefined;
}
export declare class ResearchService {
    private fileSystem;
    private fileGenerator;
    constructor(fileSystem: IFileSystemService, fileGenerator: FileGenerator);
    /**
     * Generate research questions for a study
     */
    generateQuestions(studyId: string, prompt: string, projectRoot: string): Promise<ResearchResult>;
    /**
     * Collect and organize research sources
     */
    collectSources(studyId: string, sources: Source[], projectRoot: string, autoDiscover?: boolean): Promise<ResearchResult>;
    /**
     * Summarize a specific research source
     */
    summarizeSource(studyId: string, sourceId: string, projectRoot: string): Promise<ResearchResult>;
    /**
     * Process an interview transcript
     */
    processInterview(studyId: string, transcript: string, participantId: string, projectRoot: string): Promise<ResearchResult>;
    /**
     * Synthesize insights from all research artifacts
     */
    synthesizeInsights(studyId: string, projectRoot: string): Promise<ResearchResult>;
    private getStudyInfo;
    private getSourceInfo;
    private getSourceContent;
    private collectResearchArtifacts;
    private parseYamlConfig;
}
