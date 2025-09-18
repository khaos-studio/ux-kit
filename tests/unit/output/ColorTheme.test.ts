/**
 * ColorTheme Unit Tests
 */

import { ColorTheme, ColorType, ThemeType } from '../../../src/output/ColorTheme';

describe('ColorTheme', () => {
  let colorTheme: ColorTheme;

  beforeEach(() => {
    colorTheme = new ColorTheme();
  });

  describe('getColor', () => {
    it('should return color codes for different types', () => {
      const successColor = colorTheme.getColor('success');
      const errorColor = colorTheme.getColor('error');
      const warningColor = colorTheme.getColor('warning');
      const infoColor = colorTheme.getColor('info');
      const headerColor = colorTheme.getColor('header');
      const codeColor = colorTheme.getColor('code');
      const mutedColor = colorTheme.getColor('muted');

      expect(successColor).toBeDefined();
      expect(errorColor).toBeDefined();
      expect(warningColor).toBeDefined();
      expect(infoColor).toBeDefined();
      expect(headerColor).toBeDefined();
      expect(codeColor).toBeDefined();
      expect(mutedColor).toBeDefined();
    });

    it('should return empty string when colors are disabled', () => {
      colorTheme.setEnabled(false);
      
      const color = colorTheme.getColor('success');
      expect(color).toBe('');
    });
  });

  describe('setTheme', () => {
    it('should set the theme correctly', () => {
      colorTheme.setTheme('dark');
      expect(colorTheme.getTheme()).toBe('dark');
      
      colorTheme.setTheme('light');
      expect(colorTheme.getTheme()).toBe('light');
      
      colorTheme.setTheme('auto');
      expect(colorTheme.getTheme()).toBe('auto');
    });
  });

  describe('setEnabled', () => {
    it('should enable and disable colors', () => {
      colorTheme.setEnabled(false);
      expect(colorTheme.isEnabled()).toBe(false);
      
      colorTheme.setEnabled(true);
      expect(colorTheme.isEnabled()).toBe(true);
    });
  });

  describe('colorize', () => {
    it('should colorize text with appropriate color', () => {
      const text = 'Hello World';
      const colored = colorTheme.colorize(text, 'success');
      
      expect(colored).toContain(text);
      expect(colored.length).toBeGreaterThan(text.length);
    });

    it('should not colorize when colors are disabled', () => {
      colorTheme.setEnabled(false);
      
      const text = 'Hello World';
      const colored = colorTheme.colorize(text, 'success');
      
      expect(colored).toBe(text);
    });
  });

  describe('reset', () => {
    it('should return reset code when enabled', () => {
      const reset = colorTheme.reset();
      expect(reset).toBe('\x1b[0m');
    });

    it('should return empty string when disabled', () => {
      colorTheme.setEnabled(false);
      const reset = colorTheme.reset();
      expect(reset).toBe('');
    });
  });

  describe('bold', () => {
    it('should make text bold when enabled', () => {
      const text = 'Bold Text';
      const bold = colorTheme.bold(text);
      
      expect(bold).toContain(text);
      expect(bold).toContain('\x1b[1m');
      expect(bold).toContain('\x1b[0m');
    });

    it('should return plain text when disabled', () => {
      colorTheme.setEnabled(false);
      
      const text = 'Bold Text';
      const bold = colorTheme.bold(text);
      
      expect(bold).toBe(text);
    });
  });

  describe('italic', () => {
    it('should make text italic when enabled', () => {
      const text = 'Italic Text';
      const italic = colorTheme.italic(text);
      
      expect(italic).toContain(text);
      expect(italic).toContain('\x1b[3m');
      expect(italic).toContain('\x1b[0m');
    });

    it('should return plain text when disabled', () => {
      colorTheme.setEnabled(false);
      
      const text = 'Italic Text';
      const italic = colorTheme.italic(text);
      
      expect(italic).toBe(text);
    });
  });

  describe('underline', () => {
    it('should underline text when enabled', () => {
      const text = 'Underlined Text';
      const underlined = colorTheme.underline(text);
      
      expect(underlined).toContain(text);
      expect(underlined).toContain('\x1b[4m');
      expect(underlined).toContain('\x1b[0m');
    });

    it('should return plain text when disabled', () => {
      colorTheme.setEnabled(false);
      
      const text = 'Underlined Text';
      const underlined = colorTheme.underline(text);
      
      expect(underlined).toBe(text);
    });
  });
});
