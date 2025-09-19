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
export declare class ColorTheme {
    private enabled;
    private theme;
    private lightScheme;
    private darkScheme;
    constructor();
    /**
     * Get color code for a specific type
     */
    getColor(type: ColorType): string;
    /**
     * Set the color theme
     */
    setTheme(theme: ThemeType): void;
    /**
     * Enable or disable colors
     */
    setEnabled(enabled: boolean): void;
    /**
     * Check if colors are enabled
     */
    isEnabled(): boolean;
    /**
     * Get the current theme
     */
    getTheme(): ThemeType;
    /**
     * Apply color to text
     */
    colorize(text: string, type: ColorType): string;
    /**
     * Get the current color scheme based on theme
     */
    private getCurrentScheme;
    /**
     * Auto-detect theme based on environment
     */
    private detectTheme;
    /**
     * Reset all colors
     */
    reset(): string;
    /**
     * Make text bold
     */
    bold(text: string): string;
    /**
     * Make text italic
     */
    italic(text: string): string;
    /**
     * Make text underlined
     */
    underline(text: string): string;
}
