/**
 * TemplateManager - Manages template files in the file system
 *
 * This class handles loading, saving, and listing template files.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
export declare class TemplateManager {
    private fileSystem;
    constructor(fileSystem: IFileSystemService);
    /**
     * Loads a template from the file system
     * @param templatePath The path to the template file
     * @returns The template content
     * @throws Error if template file is not found
     */
    loadTemplate(templatePath: string): Promise<string>;
    /**
     * Saves a template to the file system
     * @param templatePath The path where to save the template
     * @param templateContent The template content to save
     */
    saveTemplate(templatePath: string, templateContent: string): Promise<void>;
    /**
     * Lists all template files in a directory
     * @param templateDirectory The directory to search for templates
     * @returns Array of template file paths
     */
    listTemplates(templateDirectory: string): Promise<string[]>;
    /**
     * Checks if a template file exists
     * @param templatePath The path to the template file
     * @returns True if the template exists, false otherwise
     */
    templateExists(templatePath: string): Promise<boolean>;
    /**
     * Deletes a template file
     * @param templatePath The path to the template file to delete
     */
    deleteTemplate(templatePath: string): Promise<void>;
    /**
     * Copies a template from one location to another
     * @param sourcePath The source template path
     * @param destinationPath The destination template path
     */
    copyTemplate(sourcePath: string, destinationPath: string): Promise<void>;
}
