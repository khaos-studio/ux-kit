"use strict";
/**
 * Output Formatter
 *
 * Main formatter for CLI output with styling and formatting capabilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputFormatter = void 0;
const ColorTheme_1 = require("./ColorTheme");
const ProgressIndicator_1 = require("./ProgressIndicator");
const TableFormatter_1 = require("./TableFormatter");
class OutputFormatter {
    constructor() {
        this.colorTheme = new ColorTheme_1.ColorTheme();
        this.progressIndicator = new ProgressIndicator_1.ProgressIndicator();
        this.tableFormatter = new TableFormatter_1.TableFormatter();
    }
    /**
     * Format a success message
     */
    formatSuccess(message) {
        return this.colorTheme.colorize(`✓ ${message}`, 'success');
    }
    /**
     * Format an error message
     */
    formatError(message) {
        return this.colorTheme.colorize(`✗ ${message}`, 'error');
    }
    /**
     * Format a warning message
     */
    formatWarning(message) {
        return this.colorTheme.colorize(`⚠ ${message}`, 'warning');
    }
    /**
     * Format an info message
     */
    formatInfo(message) {
        return this.colorTheme.colorize(`ℹ ${message}`, 'info');
    }
    /**
     * Format a header
     */
    formatHeader(message) {
        const coloredMessage = this.colorTheme.colorize(message, 'header');
        const underline = '─'.repeat(message.length);
        return `${coloredMessage}\n${this.colorTheme.colorize(underline, 'muted')}`;
    }
    /**
     * Format code
     */
    formatCode(code) {
        const lines = code.split('\n');
        const formattedLines = lines.map(line => this.colorTheme.colorize(`  ${line}`, 'code'));
        return formattedLines.join('\n');
    }
    /**
     * Format a study creation message
     */
    formatStudyCreated(studyName, studyId) {
        const message = `Study "${studyName}" created with ID: ${studyId}`;
        return this.formatSuccess(message);
    }
    /**
     * Format a command result
     */
    formatCommandResult(command, result) {
        const header = this.colorTheme.colorize(`Command: ${command}`, 'header');
        const resultText = this.colorTheme.colorize(result, 'info');
        return `${header}\n${resultText}`;
    }
    /**
     * Format a file generation result
     */
    formatFileGenerated(fileName, filePath) {
        const message = `Generated file: ${fileName}`;
        const pathText = this.colorTheme.colorize(`  Path: ${filePath}`, 'muted');
        return `${this.formatSuccess(message)}\n${pathText}`;
    }
    /**
     * Format an error with context
     */
    formatErrorWithContext(error, context) {
        const errorText = this.colorTheme.colorize(`Error: ${error}`, 'error');
        const contextText = this.colorTheme.colorize(`Context: ${context}`, 'muted');
        return `${errorText}\n${contextText}`;
    }
    /**
     * Format help information
     */
    formatHelp(command, description) {
        const commandText = this.colorTheme.colorize(command, 'header');
        const descriptionText = this.colorTheme.colorize(description, 'info');
        return `${commandText}\n  ${descriptionText}`;
    }
    /**
     * Format a list of items
     */
    formatList(items, title) {
        let output = '';
        if (title) {
            output += this.formatHeader(title) + '\n';
        }
        items.forEach((item, index) => {
            const bullet = this.colorTheme.colorize('•', 'muted');
            const itemText = this.colorTheme.colorize(item, 'info');
            output += `${bullet} ${itemText}\n`;
        });
        return output.trim();
    }
    /**
     * Format a key-value pair
     */
    formatKeyValue(key, value) {
        const keyText = this.colorTheme.colorize(key, 'header');
        const valueText = this.colorTheme.colorize(value, 'info');
        return `${keyText}: ${valueText}`;
    }
    /**
     * Format multiple key-value pairs
     */
    formatKeyValuePairs(pairs) {
        return pairs.map(pair => this.formatKeyValue(pair.key, pair.value)).join('\n');
    }
    /**
     * Format a section with title and content
     */
    formatSection(title, content) {
        const header = this.formatHeader(title);
        const contentText = this.colorTheme.colorize(content, 'info');
        return `${header}\n${contentText}`;
    }
    /**
     * Format a note or tip
     */
    formatNote(note) {
        const noteText = this.colorTheme.colorize('Note:', 'warning');
        const content = this.colorTheme.colorize(note, 'muted');
        return `${noteText} ${content}`;
    }
    /**
     * Format a tip
     */
    formatTip(tip) {
        const tipText = this.colorTheme.colorize('Tip:', 'info');
        const content = this.colorTheme.colorize(tip, 'muted');
        return `${tipText} ${content}`;
    }
    /**
     * Format a separator line
     */
    formatSeparator(length = 50) {
        const separator = '─'.repeat(length);
        return this.colorTheme.colorize(separator, 'muted');
    }
    /**
     * Format a table
     */
    formatTable(headers, rows, options) {
        return this.tableFormatter.formatTable(headers, rows, options);
    }
    /**
     * Get the progress indicator
     */
    getProgressIndicator() {
        return this.progressIndicator;
    }
    /**
     * Get the color theme
     */
    getColorTheme() {
        return this.colorTheme;
    }
    /**
     * Get the table formatter
     */
    getTableFormatter() {
        return this.tableFormatter;
    }
    /**
     * Set color theme
     */
    setColorTheme(theme) {
        this.colorTheme = theme;
    }
    /**
     * Enable or disable colors
     */
    setColorsEnabled(enabled) {
        this.colorTheme.setEnabled(enabled);
    }
    /**
     * Check if colors are enabled
     */
    areColorsEnabled() {
        return this.colorTheme.isEnabled();
    }
}
exports.OutputFormatter = OutputFormatter;
//# sourceMappingURL=OutputFormatter.js.map