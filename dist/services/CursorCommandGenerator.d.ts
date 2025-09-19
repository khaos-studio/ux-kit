/**
 * Cursor Command Generator Service
 *
 * Generates Cursor-specific command files (.cursor-commands/) based on UX-Kit functionality.
 * Creates spec-kit compatible Cursor commands for IDE integration.
 */
import { IFileSystemService } from '../contracts/infrastructure-contracts';
export interface CursorCommand {
    name: string;
    description: string;
    scripts: {
        sh?: string;
        ps?: string;
    };
    content: string;
}
export declare class CursorCommandGenerator {
    private fileSystem;
    constructor(fileSystem: IFileSystemService);
    /**
     * Generate all Cursor commands for the project
     */
    generateCursorCommands(projectRoot: string): Promise<void>;
    /**
     * Generate the main specify command (similar to spec-kit)
     */
    private generateSpecifyCommand;
    /**
     * Generate research command for UX research workflows
     */
    private generateResearchCommand;
    /**
     * Generate study management command
     */
    private generateStudyCommand;
    /**
     * Generate synthesize command for combining research insights
     */
    private generateSynthesizeCommand;
    /**
     * Format cursor command content with frontmatter
     */
    private formatCursorCommand;
    /**
     * Copy the spec-kit compatible specify command template
     */
    private copySpecifyTemplate;
    /**
     * Check if Cursor is available in the system
     */
    isCursorAvailable(): Promise<boolean>;
    /**
     * Prompt user for IDE confirmation
     */
    promptIdeConfirmation(): Promise<boolean>;
    /**
     * Execute shell command (helper method)
     */
    private executeCommand;
}
