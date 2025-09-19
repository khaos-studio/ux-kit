"use strict";
/**
 * FileGenerator - Generates research artifact files using templates
 *
 * This class handles the generation of various research artifact files
 * using templates and data provided by the user.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileGenerator = void 0;
class FileGenerator {
    constructor(fileSystem, templateEngine) {
        this.fileSystem = fileSystem;
        this.templateEngine = templateEngine;
    }
    /**
     * Generates research questions file from template
     * @param outputPath The path where to save the generated file
     * @param templatePath The path to the template file
     * @param data The data to use for template rendering
     * @returns Generation result
     */
    async generateResearchQuestions(outputPath, templatePath, data) {
        try {
            // Load template
            const template = await this.fileSystem.readFile(templatePath);
            // Render template with data
            const renderedContent = await this.templateEngine.render(template, data);
            // Ensure output directory exists
            const outputDir = this.fileSystem.dirname(outputPath);
            await this.fileSystem.ensureDirectoryExists(outputDir);
            // Write generated file
            await this.fileSystem.writeFile(outputPath, renderedContent);
            return {
                success: true,
                filePath: outputPath
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage.includes('File not found') ? 'Template not found' : errorMessage
            };
        }
    }
    /**
     * Generates sources file from template
     * @param outputPath The path where to save the generated file
     * @param templatePath The path to the template file
     * @param data The data to use for template rendering
     * @returns Generation result
     */
    async generateSourcesFile(outputPath, templatePath, data) {
        try {
            // Load template
            const template = await this.fileSystem.readFile(templatePath);
            // Render template with data
            const renderedContent = await this.templateEngine.render(template, data);
            // Ensure output directory exists
            const outputDir = this.fileSystem.dirname(outputPath);
            await this.fileSystem.ensureDirectoryExists(outputDir);
            // Write generated file
            await this.fileSystem.writeFile(outputPath, renderedContent);
            return {
                success: true,
                filePath: outputPath
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage.includes('File not found') ? 'Template not found' : errorMessage
            };
        }
    }
    /**
     * Generates interview file from template
     * @param outputPath The path where to save the generated file
     * @param templatePath The path to the template file
     * @param data The data to use for template rendering
     * @returns Generation result
     */
    async generateInterviewFile(outputPath, templatePath, data) {
        try {
            // Load template
            const template = await this.fileSystem.readFile(templatePath);
            // Render template with data
            const renderedContent = await this.templateEngine.render(template, data);
            // Ensure output directory exists
            const outputDir = this.fileSystem.dirname(outputPath);
            await this.fileSystem.ensureDirectoryExists(outputDir);
            // Write generated file
            await this.fileSystem.writeFile(outputPath, renderedContent);
            return {
                success: true,
                filePath: outputPath
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage.includes('File not found') ? 'Template not found' : errorMessage
            };
        }
    }
    /**
     * Generates complete study structure
     * @param basePath The base path for the study
     * @param data The study data
     * @returns Generation result
     */
    async generateCompleteStudy(basePath, data) {
        try {
            // Create base directory
            await this.fileSystem.ensureDirectoryExists(basePath);
            // Create subdirectories
            await this.fileSystem.ensureDirectoryExists(this.fileSystem.joinPaths(basePath, 'interviews'));
            await this.fileSystem.ensureDirectoryExists(this.fileSystem.joinPaths(basePath, 'summaries'));
            await this.fileSystem.ensureDirectoryExists(this.fileSystem.joinPaths(basePath, 'insights'));
            // Generate questions file if data exists
            if (data.questions) {
                const questionsPath = this.fileSystem.joinPaths(basePath, 'questions.md');
                const questionsTemplate = '# Research Questions for {{studyName}}\n\n## Primary Questions\n{{#each questions.primary}}- {{this}}\n{{/each}}\n\n## Secondary Questions\n{{#each questions.secondary}}- {{this}}\n{{/each}}';
                await this.fileSystem.writeFile(questionsPath, questionsTemplate);
            }
            // Generate sources file if data exists
            if (data.sources) {
                const sourcesPath = this.fileSystem.joinPaths(basePath, 'sources.md');
                const sourcesTemplate = '# Research Sources for {{studyName}}\n\n{{#each sources}}## {{title}}\n**Type**: {{type}}\n**URL**: {{url}}\n---\n{{/each}}';
                await this.fileSystem.writeFile(sourcesPath, sourcesTemplate);
            }
            return {
                success: true,
                filePath: basePath
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}
exports.FileGenerator = FileGenerator;
//# sourceMappingURL=FileGenerator.js.map