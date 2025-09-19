"use strict";
/**
 * Color Theme
 *
 * Manages color schemes and styling for CLI output.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorTheme = void 0;
class ColorTheme {
    constructor() {
        this.enabled = true;
        this.theme = 'auto';
        this.lightScheme = {
            success: '\x1b[32m', // Green
            error: '\x1b[31m', // Red
            warning: '\x1b[33m', // Yellow
            info: '\x1b[34m', // Blue
            header: '\x1b[1m\x1b[36m', // Bold Cyan
            code: '\x1b[90m', // Gray
            muted: '\x1b[37m' // White
        };
        this.darkScheme = {
            success: '\x1b[92m', // Bright Green
            error: '\x1b[91m', // Bright Red
            warning: '\x1b[93m', // Bright Yellow
            info: '\x1b[94m', // Bright Blue
            header: '\x1b[1m\x1b[96m', // Bold Bright Cyan
            code: '\x1b[37m', // White
            muted: '\x1b[90m' // Gray
        };
    }
    /**
     * Get color code for a specific type
     */
    getColor(type) {
        if (!this.enabled) {
            return '';
        }
        const scheme = this.getCurrentScheme();
        return scheme[type] || '';
    }
    /**
     * Set the color theme
     */
    setTheme(theme) {
        this.theme = theme;
    }
    /**
     * Enable or disable colors
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    /**
     * Check if colors are enabled
     */
    isEnabled() {
        return this.enabled;
    }
    /**
     * Get the current theme
     */
    getTheme() {
        return this.theme;
    }
    /**
     * Apply color to text
     */
    colorize(text, type) {
        const color = this.getColor(type);
        const reset = this.enabled ? '\x1b[0m' : '';
        return `${color}${text}${reset}`;
    }
    /**
     * Get the current color scheme based on theme
     */
    getCurrentScheme() {
        if (this.theme === 'auto') {
            // Auto-detect based on environment
            return this.detectTheme();
        }
        return this.theme === 'dark' ? this.darkScheme : this.lightScheme;
    }
    /**
     * Auto-detect theme based on environment
     */
    detectTheme() {
        // Default to light theme for now
        // In a real implementation, this could check terminal capabilities
        // or user preferences
        return this.lightScheme;
    }
    /**
     * Reset all colors
     */
    reset() {
        return this.enabled ? '\x1b[0m' : '';
    }
    /**
     * Make text bold
     */
    bold(text) {
        if (!this.enabled)
            return text;
        return `\x1b[1m${text}\x1b[0m`;
    }
    /**
     * Make text italic
     */
    italic(text) {
        if (!this.enabled)
            return text;
        return `\x1b[3m${text}\x1b[0m`;
    }
    /**
     * Make text underlined
     */
    underline(text) {
        if (!this.enabled)
            return text;
        return `\x1b[4m${text}\x1b[0m`;
    }
}
exports.ColorTheme = ColorTheme;
//# sourceMappingURL=ColorTheme.js.map