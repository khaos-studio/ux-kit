/**
 * MarkdownGenerator - Generates markdown files with proper formatting
 *
 * This class handles the generation of markdown files with various
 * formatting options including tables, code blocks, and sections.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
export interface GenerationResult {
    success: boolean;
    filePath?: string;
    error?: string;
}
export interface MarkdownContent {
    title: string;
    sections?: Array<{
        heading: string;
        content: string;
    }>;
    table?: {
        headers: string[];
        rows: string[][];
    };
    codeBlocks?: Array<{
        language: string;
        code: string;
    }>;
}
export declare class MarkdownGenerator {
    private fileSystem;
    constructor(fileSystem: IFileSystemService);
    /**
     * Generates markdown file with basic content
     * @param outputPath The path where to save the generated file
     * @param content The markdown content
     * @returns Generation result
     */
    generateMarkdown(outputPath: string, content: MarkdownContent): Promise<GenerationResult>;
    /**
     * Generates markdown file with table
     * @param outputPath The path where to save the generated file
     * @param content The markdown content with table
     * @returns Generation result
     */
    generateMarkdownWithTable(outputPath: string, content: MarkdownContent): Promise<GenerationResult>;
    /**
     * Generates markdown file with code blocks
     * @param outputPath The path where to save the generated file
     * @param content The markdown content with code blocks
     * @returns Generation result
     */
    generateMarkdownWithCode(outputPath: string, content: MarkdownContent): Promise<GenerationResult>;
}
