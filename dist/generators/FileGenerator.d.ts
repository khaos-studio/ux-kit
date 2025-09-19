/**
 * FileGenerator - Generates research artifact files using templates
 *
 * This class handles the generation of various research artifact files
 * using templates and data provided by the user.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
import { TemplateEngine } from '../templates/TemplateEngine';
export interface GenerationResult {
    success: boolean;
    filePath?: string;
    error?: string;
}
export interface StudyData {
    [key: string]: any;
}
export declare class FileGenerator {
    private fileSystem;
    private templateEngine;
    constructor(fileSystem: IFileSystemService, templateEngine: TemplateEngine);
    /**
     * Generates research questions file from template
     * @param outputPath The path where to save the generated file
     * @param templatePath The path to the template file
     * @param data The data to use for template rendering
     * @returns Generation result
     */
    generateResearchQuestions(outputPath: string, templatePath: string, data: StudyData): Promise<GenerationResult>;
    /**
     * Generates sources file from template
     * @param outputPath The path where to save the generated file
     * @param templatePath The path to the template file
     * @param data The data to use for template rendering
     * @returns Generation result
     */
    generateSourcesFile(outputPath: string, templatePath: string, data: StudyData): Promise<GenerationResult>;
    /**
     * Generates interview file from template
     * @param outputPath The path where to save the generated file
     * @param templatePath The path to the template file
     * @param data The data to use for template rendering
     * @returns Generation result
     */
    generateInterviewFile(outputPath: string, templatePath: string, data: StudyData): Promise<GenerationResult>;
    /**
     * Generates complete study structure
     * @param basePath The base path for the study
     * @param data The study data
     * @returns Generation result
     */
    generateCompleteStudy(basePath: string, data: StudyData): Promise<GenerationResult>;
}
