/**
 * CodexCommandGenerator Service
 *
 * This service provides template generation functionality for Codex commands,
 * implementing the ICodexCommandGenerator interface.
 */
import { ICodexCommandGenerator } from '../../contracts/domain-contracts';
import { IFileSystemService } from '../../contracts/infrastructure-contracts';
import { CodexConfiguration, CodexCommandTemplate } from '../../contracts/domain-contracts';
/**
 * Service for generating and managing Codex command templates
 */
export declare class CodexCommandGenerator implements ICodexCommandGenerator {
    private readonly fileSystemService;
    private readonly defaultTemplatePath;
    constructor(fileSystemService: IFileSystemService);
    /**
     * Generate Codex v2 configuration file
     */
    generateTemplates(config: CodexConfiguration): Promise<void>;
    /**
     * Get specific template by name
     */
    getTemplate(name: string): Promise<CodexCommandTemplate | null>;
    /**
     * List all available templates
     */
    listTemplates(): Promise<readonly CodexCommandTemplate[]>;
    /**
     * Validate template structure
     */
    validateTemplate(template: CodexCommandTemplate): boolean;
    /**
     * Generate template for specific command
     */
    generateCommandTemplate(commandName: string, config: CodexConfiguration): Promise<CodexCommandTemplate>;
    /**
     * Format template as markdown
     */
    formatTemplateAsMarkdown(template: CodexCommandTemplate): string;
    /**
     * Parse markdown template
     */
    parseMarkdownTemplate(name: string, markdown: string): CodexCommandTemplate;
    /**
     * Generate Codex v2 configuration file content
     */
    generateCodexConfig(): string;
    /**
     * Generate README for .codex directory
     */
    generateCodexReadme(): string;
    /**
     * Get default template definitions (kept for backward compatibility)
     */
    getDefaultTemplates(): readonly CodexCommandTemplate[];
}
