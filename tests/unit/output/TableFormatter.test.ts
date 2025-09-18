/**
 * TableFormatter Unit Tests
 */

import { TableFormatter, TableOptions } from '../../../src/output/TableFormatter';

describe('TableFormatter', () => {
  let tableFormatter: TableFormatter;

  beforeEach(() => {
    tableFormatter = new TableFormatter();
  });

  describe('formatTable', () => {
    it('should format a simple table', () => {
      const headers = ['Name', 'Status'];
      const rows = [
        ['Study 1', 'Complete'],
        ['Study 2', 'In Progress']
      ];
      
      const table = tableFormatter.formatTable(headers, rows);
      
      expect(table).toContain('Study 1');
      expect(table).toContain('Study 2');
      expect(table).toContain('Complete');
      expect(table).toContain('In Progress');
    });

    it('should handle empty table', () => {
      const headers = ['Name', 'Status'];
      const rows: string[][] = [];
      
      const table = tableFormatter.formatTable(headers, rows);
      
      expect(table).toContain('Name');
      expect(table).toContain('Status');
    });

    it('should handle table with borders', () => {
      const headers = ['Name', 'Status'];
      const rows = [['Study 1', 'Complete']];
      const options: TableOptions = { border: true };
      
      const table = tableFormatter.formatTable(headers, rows, options);
      
      expect(table).toContain('┌');
      expect(table).toContain('┐');
      expect(table).toContain('├');
      expect(table).toContain('┤');
    });

    it('should handle different column widths', () => {
      const headers = ['Short', 'Very Long Column Name', 'Medium'];
      const rows = [
        ['A', 'This is a very long piece of data', 'Medium data']
      ];
      
      const table = tableFormatter.formatTable(headers, rows);
      
      expect(table).toContain('Short');
      expect(table).toContain('Very Long Column Name');
      expect(table).toContain('Medium');
    });

    it('should truncate long text', () => {
      const headers = ['Name'];
      const rows = [['This is a very long piece of text that should be truncated']];
      const options: TableOptions = { maxWidth: 20 };
      
      const table = tableFormatter.formatTable(headers, rows, options);
      
      expect(table).toContain('...');
    });

    it('should handle different alignments', () => {
      const headers = ['Name', 'Value'];
      const rows = [['Item', '100']];
      const options: TableOptions = { align: 'center' };
      
      const table = tableFormatter.formatTable(headers, rows, options);
      
      expect(table).toContain('Item');
      expect(table).toContain('100');
    });
  });

  describe('formatList', () => {
    it('should format a list as a table', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      
      const table = tableFormatter.formatList(items);
      
      expect(table).toContain('Item 1');
      expect(table).toContain('Item 2');
      expect(table).toContain('Item 3');
    });

    it('should handle empty list', () => {
      const items: string[] = [];
      
      const table = tableFormatter.formatList(items);
      
      expect(table).toContain('Item');
    });
  });

  describe('formatKeyValue', () => {
    it('should format key-value pairs as a table', () => {
      const pairs = [
        { key: 'Name', value: 'Study 1' },
        { key: 'Status', value: 'Complete' }
      ];
      
      const table = tableFormatter.formatKeyValue(pairs);
      
      expect(table).toContain('Name');
      expect(table).toContain('Study 1');
      expect(table).toContain('Status');
      expect(table).toContain('Complete');
    });

    it('should handle empty key-value pairs', () => {
      const pairs: Array<{ key: string; value: string }> = [];
      
      const table = tableFormatter.formatKeyValue(pairs);
      
      expect(table).toContain('Key');
      expect(table).toContain('Value');
    });
  });

  describe('formatTwoColumn', () => {
    it('should format two columns', () => {
      const leftColumn = ['Item 1', 'Item 2'];
      const rightColumn = ['Value 1', 'Value 2'];
      
      const table = tableFormatter.formatTwoColumn(leftColumn, rightColumn);
      
      expect(table).toContain('Item 1');
      expect(table).toContain('Value 1');
      expect(table).toContain('Item 2');
      expect(table).toContain('Value 2');
    });

    it('should handle mismatched column lengths', () => {
      const leftColumn = ['Item 1', 'Item 2', 'Item 3'];
      const rightColumn = ['Value 1', 'Value 2'];
      
      const table = tableFormatter.formatTwoColumn(leftColumn, rightColumn);
      
      expect(table).toContain('Item 1');
      expect(table).toContain('Item 2');
      expect(table).toContain('Item 3');
      expect(table).toContain('Value 1');
      expect(table).toContain('Value 2');
    });
  });
});
