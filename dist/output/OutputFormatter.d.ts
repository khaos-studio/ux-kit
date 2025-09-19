/**
 * Output Formatter
 *
 * Main formatter for CLI output with styling and formatting capabilities.
 */
import { ColorTheme } from './ColorTheme';
import { ProgressIndicator } from './ProgressIndicator';
import { TableFormatter } from './TableFormatter';
export declare class OutputFormatter {
    private colorTheme;
    private progressIndicator;
    private tableFormatter;
    constructor();
    /**
     * Format a success message
     */
    formatSuccess(message: string): string;
    /**
     * Format an error message
     */
    formatError(message: string): string;
    /**
     * Format a warning message
     */
    formatWarning(message: string): string;
    /**
     * Format an info message
     */
    formatInfo(message: string): string;
    /**
     * Format a header
     */
    formatHeader(message: string): string;
    /**
     * Format code
     */
    formatCode(code: string): string;
    /**
     * Format a study creation message
     */
    formatStudyCreated(studyName: string, studyId: string): string;
    /**
     * Format a command result
     */
    formatCommandResult(command: string, result: string): string;
    /**
     * Format a file generation result
     */
    formatFileGenerated(fileName: string, filePath: string): string;
    /**
     * Format an error with context
     */
    formatErrorWithContext(error: string, context: string): string;
    /**
     * Format help information
     */
    formatHelp(command: string, description: string): string;
    /**
     * Format a list of items
     */
    formatList(items: string[], title?: string): string;
    /**
     * Format a key-value pair
     */
    formatKeyValue(key: string, value: string): string;
    /**
     * Format multiple key-value pairs
     */
    formatKeyValuePairs(pairs: Array<{
        key: string;
        value: string;
    }>): string;
    /**
     * Format a section with title and content
     */
    formatSection(title: string, content: string): string;
    /**
     * Format a note or tip
     */
    formatNote(note: string): string;
    /**
     * Format a tip
     */
    formatTip(tip: string): string;
    /**
     * Format a separator line
     */
    formatSeparator(length?: number): string;
    /**
     * Format a table
     */
    formatTable(headers: string[], rows: string[][], options?: any): string;
    /**
     * Get the progress indicator
     */
    getProgressIndicator(): ProgressIndicator;
    /**
     * Get the color theme
     */
    getColorTheme(): ColorTheme;
    /**
     * Get the table formatter
     */
    getTableFormatter(): TableFormatter;
    /**
     * Set color theme
     */
    setColorTheme(theme: ColorTheme): void;
    /**
     * Enable or disable colors
     */
    setColorsEnabled(enabled: boolean): void;
    /**
     * Check if colors are enabled
     */
    areColorsEnabled(): boolean;
}
