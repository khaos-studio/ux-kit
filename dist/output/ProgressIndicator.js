"use strict";
/**
 * Progress Indicator
 *
 * Displays progress for long-running operations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressIndicator = void 0;
class ProgressIndicator {
    constructor() {
        this.active = false;
        this.current = 0;
        this.total = 0;
        this.message = '';
        this.indeterminate = false;
        this.startTime = 0;
    }
    /**
     * Start a progress indicator with a total
     */
    start(message, total) {
        this.message = message;
        this.total = total;
        this.current = 0;
        this.active = true;
        this.indeterminate = false;
        this.startTime = Date.now();
        this.display();
    }
    /**
     * Start an indeterminate progress indicator
     */
    startIndeterminate(message) {
        this.message = message;
        this.active = true;
        this.indeterminate = true;
        this.startTime = Date.now();
        this.display();
    }
    /**
     * Update progress
     */
    update(current, message) {
        if (!this.active)
            return;
        this.current = current;
        if (message) {
            this.message = message;
        }
        this.display();
    }
    /**
     * Stop the progress indicator
     */
    stop() {
        this.active = false;
        this.clear();
    }
    /**
     * Check if progress indicator is active
     */
    isActive() {
        return this.active;
    }
    /**
     * Get current progress percentage
     */
    getPercentage() {
        if (this.indeterminate || this.total === 0) {
            return 0;
        }
        return Math.round((this.current / this.total) * 100);
    }
    /**
     * Get elapsed time in milliseconds
     */
    getElapsedTime() {
        if (!this.startTime)
            return 0;
        return Date.now() - this.startTime;
    }
    /**
     * Display the progress indicator
     */
    display() {
        if (!this.active)
            return;
        this.clear();
        if (this.indeterminate) {
            this.displayIndeterminate();
        }
        else {
            this.displayDeterminate();
        }
    }
    /**
     * Display determinate progress
     */
    displayDeterminate() {
        const percentage = this.getPercentage();
        const barLength = 20;
        const filledLength = Math.round((percentage / 100) * barLength);
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
        const elapsed = this.getElapsedTime();
        const elapsedSeconds = Math.round(elapsed / 1000);
        process.stdout.write(`\r${this.message} [${bar}] ${percentage}% (${elapsedSeconds}s)`);
    }
    /**
     * Display indeterminate progress
     */
    displayIndeterminate() {
        const elapsed = this.getElapsedTime();
        const elapsedSeconds = Math.round(elapsed / 1000);
        const spinner = this.getSpinner();
        process.stdout.write(`\r${spinner} ${this.message} (${elapsedSeconds}s)`);
    }
    /**
     * Get spinner character for indeterminate progress
     */
    getSpinner() {
        const spinners = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        const elapsed = this.getElapsedTime();
        const index = Math.floor(elapsed / 100) % spinners.length;
        return spinners[index] || '⠋';
    }
    /**
     * Clear the current line
     */
    clear() {
        process.stdout.write('\r\x1b[K');
    }
}
exports.ProgressIndicator = ProgressIndicator;
//# sourceMappingURL=ProgressIndicator.js.map