/**
 * Table Formatter
 *
 * Formats data into tables for CLI output.
 */
export interface TableOptions {
    border?: boolean;
    padding?: number;
    align?: 'left' | 'center' | 'right';
    maxWidth?: number;
}
export declare class TableFormatter {
    /**
     * Format data into a table
     */
    formatTable(headers: string[], rows: string[][], options?: TableOptions): string;
    /**
     * Calculate optimal column widths
     */
    private calculateColumnWidths;
    /**
     * Format a single row
     */
    private formatRow;
    /**
     * Pad a cell to the specified width
     */
    private padCell;
    /**
     * Truncate text to fit within width
     */
    private truncateText;
    /**
     * Create top/bottom border
     */
    private createBorder;
    /**
     * Create header separator
     */
    private createSeparator;
    /**
     * Format a simple list as a table
     */
    formatList(items: string[], options?: TableOptions): string;
    /**
     * Format key-value pairs as a table
     */
    formatKeyValue(pairs: Array<{
        key: string;
        value: string;
    }>, options?: TableOptions): string;
    /**
     * Format a simple two-column table
     */
    formatTwoColumn(leftColumn: string[], rightColumn: string[], options?: TableOptions): string;
}
