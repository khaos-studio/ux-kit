/**
 * OutputFormatter Unit Tests
 */

import { OutputFormatter } from '../../../src/output/OutputFormatter';
import { ColorTheme } from '../../../src/output/ColorTheme';

describe('OutputFormatter', () => {
  let outputFormatter: OutputFormatter;

  beforeEach(() => {
    outputFormatter = new OutputFormatter();
  });

  describe('formatSuccess', () => {
    it('should format success message', () => {
      const message = 'Operation completed successfully';
      const formatted = outputFormatter.formatSuccess(message);
      
      expect(formatted).toContain('✓');
      expect(formatted).toContain(message);
    });
  });

  describe('formatError', () => {
    it('should format error message', () => {
      const message = 'Operation failed';
      const formatted = outputFormatter.formatError(message);
      
      expect(formatted).toContain('✗');
      expect(formatted).toContain(message);
    });
  });

  describe('formatWarning', () => {
    it('should format warning message', () => {
      const message = 'This is a warning';
      const formatted = outputFormatter.formatWarning(message);
      
      expect(formatted).toContain('⚠');
      expect(formatted).toContain(message);
    });
  });

  describe('formatInfo', () => {
    it('should format info message', () => {
      const message = 'This is information';
      const formatted = outputFormatter.formatInfo(message);
      
      expect(formatted).toContain('ℹ');
      expect(formatted).toContain(message);
    });
  });

  describe('formatHeader', () => {
    it('should format header with underline', () => {
      const header = 'UX-Kit Research Results';
      const formatted = outputFormatter.formatHeader(header);
      
      expect(formatted).toContain(header);
      expect(formatted).toContain('─');
    });
  });

  describe('formatCode', () => {
    it('should format code with indentation', () => {
      const code = 'const result = await researchService.generateQuestions();';
      const formatted = outputFormatter.formatCode(code);
      
      expect(formatted).toContain(code);
      expect(formatted).toContain('  ');
    });

    it('should format multi-line code', () => {
      const code = 'const result = await researchService.generateQuestions();\nconsole.log(result);';
      const formatted = outputFormatter.formatCode(code);
      
      expect(formatted).toContain('const result');
      expect(formatted).toContain('console.log');
    });
  });

  describe('formatStudyCreated', () => {
    it('should format study creation message', () => {
      const studyName = 'User Research Study';
      const studyId = 'study-123';
      const formatted = outputFormatter.formatStudyCreated(studyName, studyId);
      
      expect(formatted).toContain(studyName);
      expect(formatted).toContain(studyId);
      expect(formatted).toContain('✓');
    });
  });

  describe('formatCommandResult', () => {
    it('should format command result', () => {
      const command = 'questions';
      const result = 'Generated 5 research questions';
      const formatted = outputFormatter.formatCommandResult(command, result);
      
      expect(formatted).toContain(command);
      expect(formatted).toContain(result);
    });
  });

  describe('formatFileGenerated', () => {
    it('should format file generation result', () => {
      const fileName = 'questions.md';
      const filePath = '/path/to/questions.md';
      const formatted = outputFormatter.formatFileGenerated(fileName, filePath);
      
      expect(formatted).toContain(fileName);
      expect(formatted).toContain(filePath);
      expect(formatted).toContain('✓');
    });
  });

  describe('formatErrorWithContext', () => {
    it('should format error with context', () => {
      const error = 'File not found';
      const context = 'questions.md';
      const formatted = outputFormatter.formatErrorWithContext(error, context);
      
      expect(formatted).toContain(error);
      expect(formatted).toContain(context);
      expect(formatted).toContain('Error:');
    });
  });

  describe('formatHelp', () => {
    it('should format help information', () => {
      const command = 'uxkit research questions';
      const description = 'Generate research questions for a study';
      const formatted = outputFormatter.formatHelp(command, description);
      
      expect(formatted).toContain(command);
      expect(formatted).toContain(description);
    });
  });

  describe('formatList', () => {
    it('should format list of items', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      const formatted = outputFormatter.formatList(items);
      
      expect(formatted).toContain('Item 1');
      expect(formatted).toContain('Item 2');
      expect(formatted).toContain('Item 3');
      expect(formatted).toContain('•');
    });

    it('should format list with title', () => {
      const items = ['Item 1', 'Item 2'];
      const title = 'Test List';
      const formatted = outputFormatter.formatList(items, title);
      
      expect(formatted).toContain(title);
      expect(formatted).toContain('Item 1');
      expect(formatted).toContain('Item 2');
    });
  });

  describe('formatKeyValue', () => {
    it('should format key-value pair', () => {
      const key = 'Name';
      const value = 'Study 1';
      const formatted = outputFormatter.formatKeyValue(key, value);
      
      expect(formatted).toContain(key);
      expect(formatted).toContain(value);
    });
  });

  describe('formatKeyValuePairs', () => {
    it('should format multiple key-value pairs', () => {
      const pairs = [
        { key: 'Name', value: 'Study 1' },
        { key: 'Status', value: 'Complete' }
      ];
      const formatted = outputFormatter.formatKeyValuePairs(pairs);
      
      expect(formatted).toContain('Name');
      expect(formatted).toContain('Study 1');
      expect(formatted).toContain('Status');
      expect(formatted).toContain('Complete');
    });
  });

  describe('formatSection', () => {
    it('should format section with title and content', () => {
      const title = 'Research Results';
      const content = 'This is the content';
      const formatted = outputFormatter.formatSection(title, content);
      
      expect(formatted).toContain(title);
      expect(formatted).toContain(content);
    });
  });

  describe('formatNote', () => {
    it('should format note', () => {
      const note = 'This is a note';
      const formatted = outputFormatter.formatNote(note);
      
      expect(formatted).toContain('Note:');
      expect(formatted).toContain(note);
    });
  });

  describe('formatTip', () => {
    it('should format tip', () => {
      const tip = 'This is a tip';
      const formatted = outputFormatter.formatTip(tip);
      
      expect(formatted).toContain('Tip:');
      expect(formatted).toContain(tip);
    });
  });

  describe('formatSeparator', () => {
    it('should format separator line', () => {
      const separator = outputFormatter.formatSeparator(10);
      
      expect(separator).toContain('─');
      expect(separator.length).toBeGreaterThan(10);
    });

    it('should use default length', () => {
      const separator = outputFormatter.formatSeparator();
      
      expect(separator).toContain('─');
      expect(separator.length).toBeGreaterThan(50);
    });
  });

  describe('formatTable', () => {
    it('should format table', () => {
      const headers = ['Name', 'Status'];
      const rows = [['Study 1', 'Complete']];
      const formatted = outputFormatter.formatTable(headers, rows);
      
      expect(formatted).toContain('Study 1');
      expect(formatted).toContain('Complete');
    });
  });

  describe('getters and setters', () => {
    it('should get progress indicator', () => {
      const progressIndicator = outputFormatter.getProgressIndicator();
      expect(progressIndicator).toBeDefined();
    });

    it('should get color theme', () => {
      const colorTheme = outputFormatter.getColorTheme();
      expect(colorTheme).toBeDefined();
    });

    it('should get table formatter', () => {
      const tableFormatter = outputFormatter.getTableFormatter();
      expect(tableFormatter).toBeDefined();
    });

    it('should set color theme', () => {
      const newColorTheme = new ColorTheme();
      outputFormatter.setColorTheme(newColorTheme);
      
      const retrievedTheme = outputFormatter.getColorTheme();
      expect(retrievedTheme).toBe(newColorTheme);
    });

    it('should enable and disable colors', () => {
      outputFormatter.setColorsEnabled(false);
      expect(outputFormatter.areColorsEnabled()).toBe(false);
      
      outputFormatter.setColorsEnabled(true);
      expect(outputFormatter.areColorsEnabled()).toBe(true);
    });
  });
});
