/**
 * Output Formatting Use Case Tests
 * 
 * These tests define the expected behavior and user scenarios for the output formatting system
 * before any implementation code is written (TDD Red Phase).
 */

import { OutputFormatter } from '../../src/output/OutputFormatter';
import { ColorTheme } from '../../src/output/ColorTheme';
import { ProgressIndicator } from '../../src/output/ProgressIndicator';
import { TableFormatter } from '../../src/output/TableFormatter';

describe('Output Formatting Use Cases', () => {
  let outputFormatter: OutputFormatter;
  let colorTheme: ColorTheme;
  let progressIndicator: ProgressIndicator;
  let tableFormatter: TableFormatter;

  beforeEach(() => {
    outputFormatter = new OutputFormatter();
    colorTheme = new ColorTheme();
    progressIndicator = new ProgressIndicator();
    tableFormatter = new TableFormatter();
  });

  describe('Color Theme Management', () => {
    it('should provide consistent color schemes for different contexts', () => {
      // Given a ColorTheme instance
      // When requesting colors for different contexts
      const successColor = colorTheme.getColor('success');
      const errorColor = colorTheme.getColor('error');
      const warningColor = colorTheme.getColor('warning');
      const infoColor = colorTheme.getColor('info');
      
      // Then colors should be defined and consistent
      expect(successColor).toBeDefined();
      expect(errorColor).toBeDefined();
      expect(warningColor).toBeDefined();
      expect(infoColor).toBeDefined();
      expect(typeof successColor).toBe('string');
    });

    it('should support different color themes', () => {
      // Given a ColorTheme instance
      // When switching between different themes
      colorTheme.setTheme('dark');
      const darkSuccessColor = colorTheme.getColor('success');
      
      colorTheme.setTheme('light');
      const lightSuccessColor = colorTheme.getColor('success');
      
      // Then colors should be theme-appropriate
      expect(darkSuccessColor).toBeDefined();
      expect(lightSuccessColor).toBeDefined();
    });

    it('should handle disabled colors gracefully', () => {
      // Given a ColorTheme instance with colors disabled
      colorTheme.setEnabled(false);
      
      // When requesting colors
      const color = colorTheme.getColor('success');
      
      // Then it should return empty string or no color codes
      expect(color).toBe('');
    });
  });

  describe('Text Formatting', () => {
    it('should format success messages with appropriate styling', () => {
      // Given an OutputFormatter instance
      // When formatting a success message
      const message = 'Operation completed successfully';
      const formatted = outputFormatter.formatSuccess(message);
      
      // Then it should include success styling
      expect(formatted).toContain(message);
      expect(typeof formatted).toBe('string');
    });

    it('should format error messages with appropriate styling', () => {
      // Given an OutputFormatter instance
      // When formatting an error message
      const message = 'Operation failed';
      const formatted = outputFormatter.formatError(message);
      
      // Then it should include error styling
      expect(formatted).toContain(message);
      expect(typeof formatted).toBe('string');
    });

    it('should format warning messages with appropriate styling', () => {
      // Given an OutputFormatter instance
      // When formatting a warning message
      const message = 'This is a warning';
      const formatted = outputFormatter.formatWarning(message);
      
      // Then it should include warning styling
      expect(formatted).toContain(message);
      expect(typeof formatted).toBe('string');
    });

    it('should format info messages with appropriate styling', () => {
      // Given an OutputFormatter instance
      // When formatting an info message
      const message = 'This is information';
      const formatted = outputFormatter.formatInfo(message);
      
      // Then it should include info styling
      expect(formatted).toContain(message);
      expect(typeof formatted).toBe('string');
    });

    it('should format headers with appropriate styling', () => {
      // Given an OutputFormatter instance
      // When formatting a header
      const header = 'UX-Kit Research Results';
      const formatted = outputFormatter.formatHeader(header);
      
      // Then it should include header styling
      expect(formatted).toContain(header);
      expect(typeof formatted).toBe('string');
    });

    it('should format code blocks with appropriate styling', () => {
      // Given an OutputFormatter instance
      // When formatting a code block
      const code = 'const result = await researchService.generateQuestions();';
      const formatted = outputFormatter.formatCode(code);
      
      // Then it should include code styling
      expect(formatted).toContain(code);
      expect(typeof formatted).toBe('string');
    });
  });

  describe('Progress Indicators', () => {
    it('should display progress for long-running operations', () => {
      // Given a ProgressIndicator instance
      // When showing progress
      progressIndicator.start('Processing research data...', 100);
      progressIndicator.update(50);
      progressIndicator.update(100);
      progressIndicator.stop();
      
      // Then progress should be tracked correctly
      expect(progressIndicator.isActive()).toBe(false);
    });

    it('should handle indeterminate progress', () => {
      // Given a ProgressIndicator instance
      // When showing indeterminate progress
      progressIndicator.startIndeterminate('Loading...');
      progressIndicator.stop();
      
      // Then it should handle indeterminate state
      expect(progressIndicator.isActive()).toBe(false);
    });

    it('should provide progress percentage', () => {
      // Given a ProgressIndicator instance
      // When updating progress
      progressIndicator.start('Processing...', 100);
      progressIndicator.update(25);
      
      // Then it should provide correct percentage
      expect(progressIndicator.getPercentage()).toBe(25);
    });

    it('should handle progress with custom messages', () => {
      // Given a ProgressIndicator instance
      // When updating progress with custom message
      progressIndicator.start('Initial processing...', 100);
      progressIndicator.update(50, 'Halfway done...');
      progressIndicator.update(100, 'Complete!');
      progressIndicator.stop();
      
      // Then it should handle custom messages
      expect(progressIndicator.isActive()).toBe(false);
    });
  });

  describe('Table Formatting', () => {
    it('should format simple data tables', () => {
      // Given a TableFormatter instance and simple data
      const headers = ['Name', 'Status', 'Date'];
      const rows = [
        ['Study 1', 'Complete', '2024-01-15'],
        ['Study 2', 'In Progress', '2024-01-16'],
        ['Study 3', 'Pending', '2024-01-17']
      ];
      
      // When formatting a table
      const table = tableFormatter.formatTable(headers, rows);
      
      // Then it should create a properly formatted table
      expect(table).toContain('Study 1');
      expect(table).toContain('Study 2');
      expect(table).toContain('Study 3');
      expect(typeof table).toBe('string');
    });

    it('should handle empty tables gracefully', () => {
      // Given a TableFormatter instance with empty data
      const headers = ['Name', 'Status'];
      const rows: string[][] = [];
      
      // When formatting an empty table
      const table = tableFormatter.formatTable(headers, rows);
      
      // Then it should handle empty data gracefully
      expect(table).toContain('Name');
      expect(table).toContain('Status');
      expect(typeof table).toBe('string');
    });

    it('should format tables with different column widths', () => {
      // Given a TableFormatter instance with varying data lengths
      const headers = ['Short', 'Very Long Column Name', 'Medium'];
      const rows = [
        ['A', 'This is a very long piece of data', 'Medium data'],
        ['B', 'Short', 'This is also medium length data']
      ];
      
      // When formatting a table
      const table = tableFormatter.formatTable(headers, rows);
      
      // Then it should handle different column widths
      expect(table).toContain('Short');
      expect(table).toContain('Very Long Column Name');
      expect(table).toContain('Medium');
      expect(typeof table).toBe('string');
    });

    it('should support table styling options', () => {
      // Given a TableFormatter instance
      // When formatting a table with styling options
      const headers = ['Name', 'Status'];
      const rows = [['Study 1', 'Complete']];
      const options = { border: true, padding: 2 };
      
      const table = tableFormatter.formatTable(headers, rows, options);
      
      // Then it should apply styling options
      expect(table).toContain('Study 1');
      expect(table).toContain('Complete');
      expect(typeof table).toBe('string');
    });
  });

  describe('UX-Kit Specific Formatting', () => {
    it('should format study creation messages', () => {
      // Given an OutputFormatter instance
      // When formatting study creation success
      const studyName = 'User Research Study';
      const studyId = 'study-123';
      const message = outputFormatter.formatStudyCreated(studyName, studyId);
      
      // Then it should include study information
      expect(message).toContain(studyName);
      expect(message).toContain(studyId);
      expect(typeof message).toBe('string');
    });

    it('should format research command results', () => {
      // Given an OutputFormatter instance
      // When formatting research command results
      const command = 'questions';
      const result = 'Generated 5 research questions';
      const message = outputFormatter.formatCommandResult(command, result);
      
      // Then it should include command and result information
      expect(message).toContain(command);
      expect(message).toContain(result);
      expect(typeof message).toBe('string');
    });

    it('should format file generation results', () => {
      // Given an OutputFormatter instance
      // When formatting file generation results
      const fileName = 'questions.md';
      const filePath = '/path/to/questions.md';
      const message = outputFormatter.formatFileGenerated(fileName, filePath);
      
      // Then it should include file information
      expect(message).toContain(fileName);
      expect(message).toContain(filePath);
      expect(typeof message).toBe('string');
    });

    it('should format error messages with context', () => {
      // Given an OutputFormatter instance
      // When formatting error messages with context
      const error = 'File not found';
      const context = 'questions.md';
      const message = outputFormatter.formatErrorWithContext(error, context);
      
      // Then it should include error and context information
      expect(message).toContain(error);
      expect(message).toContain(context);
      expect(typeof message).toBe('string');
    });

    it('should format help information', () => {
      // Given an OutputFormatter instance
      // When formatting help information
      const command = 'uxkit research questions';
      const description = 'Generate research questions for a study';
      const message = outputFormatter.formatHelp(command, description);
      
      // Then it should include command and description
      expect(message).toContain(command);
      expect(message).toContain(description);
      expect(typeof message).toBe('string');
    });
  });

  describe('Integration Scenarios', () => {
    it('should format complete UX-Kit workflow output', () => {
      // Given an OutputFormatter instance
      // When formatting a complete workflow
      const workflow = [
        outputFormatter.formatHeader('UX-Kit Research Workflow'),
        outputFormatter.formatInfo('Initializing study...'),
        outputFormatter.formatSuccess('Study created: user-research-2024'),
        outputFormatter.formatInfo('Generating research questions...'),
        outputFormatter.formatSuccess('Generated 5 research questions'),
        outputFormatter.formatInfo('Creating source collection...'),
        outputFormatter.formatSuccess('Sources template created'),
        outputFormatter.formatHeader('Workflow Complete')
      ];
      
      // Then all components should work together
      expect(workflow).toHaveLength(8);
      workflow.forEach(message => {
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });

    it('should handle mixed content formatting', () => {
      // Given an OutputFormatter instance
      // When formatting mixed content
      const content = [
        outputFormatter.formatHeader('Research Results'),
        outputFormatter.formatTable(['Metric', 'Value'], [['Users Interviewed', '15'], ['Response Rate', '85%']]),
        outputFormatter.formatCode('const insights = analyzeData(responses);'),
        outputFormatter.formatSuccess('Analysis complete!')
      ];
      
      // Then all content types should be properly formatted
      expect(content).toHaveLength(4);
      content.forEach(message => {
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });
});
