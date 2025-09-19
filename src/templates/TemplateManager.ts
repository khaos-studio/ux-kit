/**
 * TemplateManager - Manages template files in the file system
 * 
 * This class handles loading, saving, and listing template files.
 */

import { IFileSystemService } from '../contracts/infrastructure-contracts';

export class TemplateManager {
  constructor(private fileSystem: IFileSystemService) {}

  /**
   * Loads a template from the file system
   * @param templatePath The path to the template file
   * @returns The template content
   * @throws Error if template file is not found
   */
  async loadTemplate(templatePath: string): Promise<string> {
    try {
      return await this.fileSystem.readFile(templatePath);
    } catch (error) {
      throw new Error('Template not found');
    }
  }

  /**
   * Saves a template to the file system
   * @param templatePath The path where to save the template
   * @param templateContent The template content to save
   */
  async saveTemplate(templatePath: string, templateContent: string): Promise<void> {
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
  async listTemplates(templateDirectory: string): Promise<string[]> {
    try {
      return [...await this.fileSystem.listFiles(templateDirectory)];
    } catch (error) {
      return [];
    }
  }

  /**
   * Checks if a template file exists
   * @param templatePath The path to the template file
   * @returns True if the template exists, false otherwise
   */
  async templateExists(templatePath: string): Promise<boolean> {
    try {
      return await this.fileSystem.pathExists(templatePath);
    } catch (error) {
      return false;
    }
  }

  /**
   * Deletes a template file
   * @param templatePath The path to the template file to delete
   */
  async deleteTemplate(templatePath: string): Promise<void> {
    try {
      const exists = await this.fileSystem.pathExists(templatePath);
      if (!exists) {
        throw new Error('Template file does not exist');
      }
      await this.fileSystem.deleteFile(templatePath);
    } catch (error) {
      throw new Error('Failed to delete template');
    }
  }

  /**
   * Copies a template from one location to another
   * @param sourcePath The source template path
   * @param destinationPath The destination template path
   */
  async copyTemplate(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      const content = await this.loadTemplate(sourcePath);
      await this.saveTemplate(destinationPath, content);
    } catch (error) {
      throw new Error('Failed to copy template');
    }
  }
}
