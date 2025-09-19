"use strict";
/**
 * TemplateManager - Manages template files in the file system
 *
 * This class handles loading, saving, and listing template files.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateManager = void 0;
class TemplateManager {
    constructor(fileSystem) {
        this.fileSystem = fileSystem;
    }
    /**
     * Loads a template from the file system
     * @param templatePath The path to the template file
     * @returns The template content
     * @throws Error if template file is not found
     */
    async loadTemplate(templatePath) {
        try {
            return await this.fileSystem.readFile(templatePath);
        }
        catch (error) {
            throw new Error('Template not found');
        }
    }
    /**
     * Saves a template to the file system
     * @param templatePath The path where to save the template
     * @param templateContent The template content to save
     */
    async saveTemplate(templatePath, templateContent) {
        // Ensure the directory exists
        const directory = this.fileSystem.dirname(templatePath);
        await this.fileSystem.ensureDirectoryExists(directory);
        // Save the template file
        await this.fileSystem.writeFile(templatePath, templateContent);
    }
    /**
     * Lists all template files in a directory
     * @param templateDirectory The directory to search for templates
     * @returns Array of template file paths
     */
    async listTemplates(templateDirectory) {
        try {
            return [...await this.fileSystem.listFiles(templateDirectory)];
        }
        catch (error) {
            return [];
        }
    }
    /**
     * Checks if a template file exists
     * @param templatePath The path to the template file
     * @returns True if the template exists, false otherwise
     */
    async templateExists(templatePath) {
        try {
            return await this.fileSystem.pathExists(templatePath);
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Deletes a template file
     * @param templatePath The path to the template file to delete
     */
    async deleteTemplate(templatePath) {
        try {
            const exists = await this.fileSystem.pathExists(templatePath);
            if (!exists) {
                throw new Error('Template file does not exist');
            }
            await this.fileSystem.deleteFile(templatePath);
        }
        catch (error) {
            throw new Error('Failed to delete template');
        }
    }
    /**
     * Copies a template from one location to another
     * @param sourcePath The source template path
     * @param destinationPath The destination template path
     */
    async copyTemplate(sourcePath, destinationPath) {
        try {
            const content = await this.loadTemplate(sourcePath);
            await this.saveTemplate(destinationPath, content);
        }
        catch (error) {
            throw new Error('Failed to copy template');
        }
    }
}
exports.TemplateManager = TemplateManager;
//# sourceMappingURL=TemplateManager.js.map