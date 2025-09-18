/**
 * Output Formatter
 * 
 * Main formatter for CLI output with styling and formatting capabilities.
 */

import { ColorTheme, ColorType } from './ColorTheme';
import { ProgressIndicator } from './ProgressIndicator';
import { TableFormatter } from './TableFormatter';

export class OutputFormatter {
  private colorTheme: ColorTheme;
  private progressIndicator: ProgressIndicator;
  private tableFormatter: TableFormatter;

  constructor() {
    this.colorTheme = new ColorTheme();
    this.progressIndicator = new ProgressIndicator();
    this.tableFormatter = new TableFormatter();
  }

  /**
   * Format a success message
   */
  formatSuccess(message: string): string {
    return this.colorTheme.colorize(`✓ ${message}`, 'success');
  }

  /**
   * Format an error message
   */
  formatError(message: string): string {
    return this.colorTheme.colorize(`✗ ${message}`, 'error');
  }

  /**
   * Format a warning message
   */
  formatWarning(message: string): string {
    return this.colorTheme.colorize(`⚠ ${message}`, 'warning');
  }

  /**
   * Format an info message
   */
  formatInfo(message: string): string {
    return this.colorTheme.colorize(`ℹ ${message}`, 'info');
  }

  /**
   * Format a header
   */
  formatHeader(message: string): string {
    const coloredMessage = this.colorTheme.colorize(message, 'header');
    const underline = '─'.repeat(message.length);
    return `${coloredMessage}\n${this.colorTheme.colorize(underline, 'muted')}`;
  }

  /**
   * Format code
   */
  formatCode(code: string): string {
    const lines = code.split('\n');
    const formattedLines = lines.map(line => 
      this.colorTheme.colorize(`  ${line}`, 'code')
    );
    return formattedLines.join('\n');
  }

  /**
   * Format a study creation message
   */
  formatStudyCreated(studyName: string, studyId: string): string {
    const message = `Study "${studyName}" created with ID: ${studyId}`;
    return this.formatSuccess(message);
  }

  /**
   * Format a command result
   */
  formatCommandResult(command: string, result: string): string {
    const header = this.colorTheme.colorize(`Command: ${command}`, 'header');
    const resultText = this.colorTheme.colorize(result, 'info');
    return `${header}\n${resultText}`;
  }

  /**
   * Format a file generation result
   */
  formatFileGenerated(fileName: string, filePath: string): string {
    const message = `Generated file: ${fileName}`;
    const pathText = this.colorTheme.colorize(`  Path: ${filePath}`, 'muted');
    return `${this.formatSuccess(message)}\n${pathText}`;
  }

  /**
   * Format an error with context
   */
  formatErrorWithContext(error: string, context: string): string {
    const errorText = this.colorTheme.colorize(`Error: ${error}`, 'error');
    const contextText = this.colorTheme.colorize(`Context: ${context}`, 'muted');
    return `${errorText}\n${contextText}`;
  }

  /**
   * Format help information
   */
  formatHelp(command: string, description: string): string {
    const commandText = this.colorTheme.colorize(command, 'header');
    const descriptionText = this.colorTheme.colorize(description, 'info');
    return `${commandText}\n  ${descriptionText}`;
  }

  /**
   * Format a list of items
   */
  formatList(items: string[], title?: string): string {
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
  formatKeyValue(key: string, value: string): string {
    const keyText = this.colorTheme.colorize(key, 'header');
    const valueText = this.colorTheme.colorize(value, 'info');
    return `${keyText}: ${valueText}`;
  }

  /**
   * Format multiple key-value pairs
   */
  formatKeyValuePairs(pairs: Array<{ key: string; value: string }>): string {
    return pairs.map(pair => this.formatKeyValue(pair.key, pair.value)).join('\n');
  }

  /**
   * Format a section with title and content
   */
  formatSection(title: string, content: string): string {
    const header = this.formatHeader(title);
    const contentText = this.colorTheme.colorize(content, 'info');
    return `${header}\n${contentText}`;
  }

  /**
   * Format a note or tip
   */
  formatNote(note: string): string {
    const noteText = this.colorTheme.colorize('Note:', 'warning');
    const content = this.colorTheme.colorize(note, 'muted');
    return `${noteText} ${content}`;
  }

  /**
   * Format a tip
   */
  formatTip(tip: string): string {
    const tipText = this.colorTheme.colorize('Tip:', 'info');
    const content = this.colorTheme.colorize(tip, 'muted');
    return `${tipText} ${content}`;
  }

  /**
   * Format a separator line
   */
  formatSeparator(length: number = 50): string {
    const separator = '─'.repeat(length);
    return this.colorTheme.colorize(separator, 'muted');
  }

  /**
   * Format a table
   */
  formatTable(headers: string[], rows: string[][], options?: any): string {
    return this.tableFormatter.formatTable(headers, rows, options);
  }

  /**
   * Get the progress indicator
   */
  getProgressIndicator(): ProgressIndicator {
    return this.progressIndicator;
  }

  /**
   * Get the color theme
   */
  getColorTheme(): ColorTheme {
    return this.colorTheme;
  }

  /**
   * Get the table formatter
   */
  getTableFormatter(): TableFormatter {
    return this.tableFormatter;
  }

  /**
   * Set color theme
   */
  setColorTheme(theme: ColorTheme): void {
    this.colorTheme = theme;
  }

  /**
   * Enable or disable colors
   */
  setColorsEnabled(enabled: boolean): void {
    this.colorTheme.setEnabled(enabled);
  }

  /**
   * Check if colors are enabled
   */
  areColorsEnabled(): boolean {
    return this.colorTheme.isEnabled();
  }
}
