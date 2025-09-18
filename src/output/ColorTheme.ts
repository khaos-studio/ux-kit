/**
 * Color Theme
 * 
 * Manages color schemes and styling for CLI output.
 */

export type ColorType = 'success' | 'error' | 'warning' | 'info' | 'header' | 'code' | 'muted';
export type ThemeType = 'light' | 'dark' | 'auto';

export interface ColorScheme {
  success: string;
  error: string;
  warning: string;
  info: string;
  header: string;
  code: string;
  muted: string;
}

export class ColorTheme {
  private enabled: boolean = true;
  private theme: ThemeType = 'auto';
  private lightScheme: ColorScheme;
  private darkScheme: ColorScheme;

  constructor() {
    this.lightScheme = {
      success: '\x1b[32m', // Green
      error: '\x1b[31m',   // Red
      warning: '\x1b[33m', // Yellow
      info: '\x1b[34m',    // Blue
      header: '\x1b[1m\x1b[36m', // Bold Cyan
      code: '\x1b[90m',    // Gray
      muted: '\x1b[37m'    // White
    };

    this.darkScheme = {
      success: '\x1b[92m', // Bright Green
      error: '\x1b[91m',   // Bright Red
      warning: '\x1b[93m', // Bright Yellow
      info: '\x1b[94m',    // Bright Blue
      header: '\x1b[1m\x1b[96m', // Bold Bright Cyan
      code: '\x1b[37m',    // White
      muted: '\x1b[90m'    // Gray
    };
  }

  /**
   * Get color code for a specific type
   */
  getColor(type: ColorType): string {
    if (!this.enabled) {
      return '';
    }

    const scheme = this.getCurrentScheme();
    return scheme[type] || '';
  }

  /**
   * Set the color theme
   */
  setTheme(theme: ThemeType): void {
    this.theme = theme;
  }

  /**
   * Enable or disable colors
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if colors are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get the current theme
   */
  getTheme(): ThemeType {
    return this.theme;
  }

  /**
   * Apply color to text
   */
  colorize(text: string, type: ColorType): string {
    const color = this.getColor(type);
    const reset = this.enabled ? '\x1b[0m' : '';
    return `${color}${text}${reset}`;
  }

  /**
   * Get the current color scheme based on theme
   */
  private getCurrentScheme(): ColorScheme {
    if (this.theme === 'auto') {
      // Auto-detect based on environment
      return this.detectTheme();
    }
    
    return this.theme === 'dark' ? this.darkScheme : this.lightScheme;
  }

  /**
   * Auto-detect theme based on environment
   */
  private detectTheme(): ColorScheme {
    // Default to light theme for now
    // In a real implementation, this could check terminal capabilities
    // or user preferences
    return this.lightScheme;
  }

  /**
   * Reset all colors
   */
  reset(): string {
    return this.enabled ? '\x1b[0m' : '';
  }

  /**
   * Make text bold
   */
  bold(text: string): string {
    if (!this.enabled) return text;
    return `\x1b[1m${text}\x1b[0m`;
  }

  /**
   * Make text italic
   */
  italic(text: string): string {
    if (!this.enabled) return text;
    return `\x1b[3m${text}\x1b[0m`;
  }

  /**
   * Make text underlined
   */
  underline(text: string): string {
    if (!this.enabled) return text;
    return `\x1b[4m${text}\x1b[0m`;
  }
}
