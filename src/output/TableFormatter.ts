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

export class TableFormatter {
  /**
   * Format data into a table
   */
  formatTable(headers: string[], rows: string[][], options: TableOptions = {}): string {
    const {
      border = false,
      padding = 1,
      align = 'left',
      maxWidth = 80
    } = options;

    if (headers.length === 0) {
      return '';
    }

    // Calculate column widths
    const columnWidths = this.calculateColumnWidths(headers, rows, maxWidth);
    
    // Build the table
    let table = '';
    
    if (border) {
      table += this.createBorder(columnWidths) + '\n';
    }
    
    // Add header row
    table += this.formatRow(headers, columnWidths, padding, align);
    
    if (border) {
      table += '\n' + this.createSeparator(columnWidths) + '\n';
    } else {
      table += '\n';
    }
    
    // Add data rows
    rows.forEach((row, index) => {
      table += this.formatRow(row, columnWidths, padding, align);
      if (index < rows.length - 1) {
        table += '\n';
      }
    });
    
    if (border) {
      table += '\n' + this.createBorder(columnWidths);
    }
    
    return table;
  }

  /**
   * Calculate optimal column widths
   */
  private calculateColumnWidths(headers: string[], rows: string[][], maxWidth: number): number[] {
    const columnCount = headers.length;
    const columnWidths: number[] = new Array(columnCount).fill(0);
    
    // Find maximum width for each column
    headers.forEach((header, index) => {
      const currentWidth = columnWidths[index] || 0;
      columnWidths[index] = Math.max(currentWidth, header.length);
    });
    
    rows.forEach(row => {
      row.forEach((cell, index) => {
        if (index < columnCount) {
          const currentWidth = columnWidths[index] || 0;
          columnWidths[index] = Math.max(currentWidth, cell.length);
        }
      });
    });
    
    // Adjust for max width if needed
    const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    const paddingWidth = (columnCount - 1) * 3; // Space for separators
    const availableWidth = maxWidth - paddingWidth;
    
    if (totalWidth > availableWidth) {
      // Proportionally reduce column widths
      const scale = availableWidth / totalWidth;
      columnWidths.forEach((width, index) => {
        columnWidths[index] = Math.max(1, Math.floor(width * scale));
      });
    }
    
    return columnWidths;
  }

  /**
   * Format a single row
   */
  private formatRow(row: string[], columnWidths: number[], padding: number, align: 'left' | 'center' | 'right'): string {
    const paddedRow = row.map((cell, index) => {
      const width = columnWidths[index] || 0;
      return this.padCell(cell, width, padding, align);
    });
    
    return '│ ' + paddedRow.join(' │ ') + ' │';
  }

  /**
   * Pad a cell to the specified width
   */
  private padCell(cell: string, width: number, padding: number, align: 'left' | 'center' | 'right'): string {
    const truncatedCell = this.truncateText(cell, width);
    const totalWidth = width + (padding * 2);
    
    switch (align) {
      case 'center':
        return truncatedCell.padStart((totalWidth + truncatedCell.length) / 2).padEnd(totalWidth);
      case 'right':
        return truncatedCell.padStart(totalWidth);
      case 'left':
      default:
        return truncatedCell.padEnd(totalWidth);
    }
  }

  /**
   * Truncate text to fit within width
   */
  private truncateText(text: string, width: number): string {
    if (text.length <= width) {
      return text;
    }
    
    if (width <= 3) {
      return '.'.repeat(width);
    }
    
    return text.substring(0, width - 3) + '...';
  }

  /**
   * Create top/bottom border
   */
  private createBorder(columnWidths: number[]): string {
    const borderParts = columnWidths.map(width => '─'.repeat(width + 2));
    return '┌' + borderParts.join('┬') + '┐';
  }

  /**
   * Create header separator
   */
  private createSeparator(columnWidths: number[]): string {
    const separatorParts = columnWidths.map(width => '─'.repeat(width + 2));
    return '├' + separatorParts.join('┼') + '┤';
  }

  /**
   * Format a simple list as a table
   */
  formatList(items: string[], options: TableOptions = {}): string {
    const headers = ['Item'];
    const rows = items.map(item => [item]);
    return this.formatTable(headers, rows, options);
  }

  /**
   * Format key-value pairs as a table
   */
  formatKeyValue(pairs: Array<{ key: string; value: string }>, options: TableOptions = {}): string {
    const headers = ['Key', 'Value'];
    const rows = pairs.map(pair => [pair.key, pair.value]);
    return this.formatTable(headers, rows, options);
  }

  /**
   * Format a simple two-column table
   */
  formatTwoColumn(leftColumn: string[], rightColumn: string[], options: TableOptions = {}): string {
    const maxLength = Math.max(leftColumn.length, rightColumn.length);
    const rows: string[][] = [];
    
    for (let i = 0; i < maxLength; i++) {
      const left = leftColumn[i] || '';
      const right = rightColumn[i] || '';
      rows.push([left, right]);
    }
    
    return this.formatTable(['Left', 'Right'], rows, options);
  }
}
