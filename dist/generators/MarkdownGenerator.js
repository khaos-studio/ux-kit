"use strict";
/**
 * MarkdownGenerator - Generates markdown files with proper formatting
 *
 * This class handles the generation of markdown files with various
 * formatting options including tables, code blocks, and sections.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownGenerator = void 0;
class MarkdownGenerator {
    constructor(fileSystem) {
        this.fileSystem = fileSystem;
    }
    /**
     * Generates markdown file with basic content
     * @param outputPath The path where to save the generated file
     * @param content The markdown content
     * @returns Generation result
     */
    async generateMarkdown(outputPath, content) {
        try {
            let markdown = `# ${content.title}\n\n`;
            if (content.sections) {
                for (const section of content.sections) {
                    markdown += `## ${section.heading}\n\n${section.content}\n\n`;
                }
            }
            // Ensure output directory exists
            const outputDir = this.fileSystem.dirname(outputPath);
            await this.fileSystem.ensureDirectoryExists(outputDir);
            // Write generated file
            await this.fileSystem.writeFile(outputPath, markdown);
            return {
                success: true,
                filePath: outputPath
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Generates markdown file with table
     * @param outputPath The path where to save the generated file
     * @param content The markdown content with table
     * @returns Generation result
     */
    async generateMarkdownWithTable(outputPath, content) {
        try {
            let markdown = `# ${content.title}\n\n`;
            if (content.table) {
                // Generate table header
                markdown += `| ${content.table.headers.join(' | ')} |\n`;
                markdown += `| ${content.table.headers.map(() => '---').join(' | ')} |\n`;
                // Generate table rows
                for (const row of content.table.rows) {
                    markdown += `| ${row.join(' | ')} |\n`;
                }
                markdown += '\n';
            }
            // Ensure output directory exists
            const outputDir = this.fileSystem.dirname(outputPath);
            await this.fileSystem.ensureDirectoryExists(outputDir);
            // Write generated file
            await this.fileSystem.writeFile(outputPath, markdown);
            return {
                success: true,
                filePath: outputPath
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Generates markdown file with code blocks
     * @param outputPath The path where to save the generated file
     * @param content The markdown content with code blocks
     * @returns Generation result
     */
    async generateMarkdownWithCode(outputPath, content) {
        try {
            let markdown = `# ${content.title}\n\n`;
            if (content.codeBlocks) {
                for (const codeBlock of content.codeBlocks) {
                    markdown += `\`\`\`${codeBlock.language}\n${codeBlock.code}\n\`\`\`\n\n`;
                }
            }
            // Ensure output directory exists
            const outputDir = this.fileSystem.dirname(outputPath);
            await this.fileSystem.ensureDirectoryExists(outputDir);
            // Write generated file
            await this.fileSystem.writeFile(outputPath, markdown);
            return {
                success: true,
                filePath: outputPath
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
exports.MarkdownGenerator = MarkdownGenerator;
//# sourceMappingURL=MarkdownGenerator.js.map