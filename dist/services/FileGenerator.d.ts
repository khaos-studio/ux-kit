/**
 * FileGenerator Service
 *
 * Handles the generation of research artifact files using templates
 * and AI integration for content creation.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
export interface GenerationResult {
    success: boolean;
    filePath: string;
    message: string;
    error?: string;
}
export interface Source {
    id: string;
    title: string;
    type: 'web' | 'file' | 'document';
    url?: string;
    filePath?: string;
    dateAdded?: Date;
    tags?: string[];
    summaryStatus?: 'not_summarized' | 'summarized';
}
export declare class FileGenerator {
    private fileSystem;
    constructor(fileSystem: IFileSystemService);
    /**
     * Generate a questions.md file with AI-generated research questions
     */
    generateQuestions(studyId: string, studyName: string, prompt: string, projectRoot: string): Promise<GenerationResult>;
    /**
     * Generate a sources.md file with collected research sources
     */
    generateSources(studyId: string, studyName: string, sources: Source[], projectRoot: string): Promise<GenerationResult>;
    /**
     * Generate a summary file for a specific source
     */
    generateSummary(studyId: string, sourceId: string, sourceTitle: string, sourceContent: string, projectRoot: string): Promise<GenerationResult>;
    /**
     * Generate an interview file from transcript
     */
    generateInterview(studyId: string, participantId: string, transcript: string, projectRoot: string): Promise<GenerationResult>;
    /**
     * Generate insights.md file by synthesizing all research artifacts
     */
    generateInsights(studyId: string, studyName: string, artifacts: string[], projectRoot: string): Promise<GenerationResult>;
    /**
     * Auto-discover relevant files in the project
     */
    autoDiscoverSources(projectRoot: string): Promise<Source[]>;
    private generateQuestionsFromPrompt;
    private generateQuestionsContent;
    private generateSourcesContent;
    private generateSummaryFromContent;
    private generateSummaryContent;
    private processTranscript;
    private generateInterviewContent;
    private synthesizeInsights;
    private generateInsightsContent;
    private getFileExtension;
}
