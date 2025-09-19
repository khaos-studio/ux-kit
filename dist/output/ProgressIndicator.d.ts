/**
 * Progress Indicator
 *
 * Displays progress for long-running operations.
 */
export declare class ProgressIndicator {
    private active;
    private current;
    private total;
    private message;
    private indeterminate;
    private startTime;
    /**
     * Start a progress indicator with a total
     */
    start(message: string, total: number): void;
    /**
     * Start an indeterminate progress indicator
     */
    startIndeterminate(message: string): void;
    /**
     * Update progress
     */
    update(current: number, message?: string): void;
    /**
     * Stop the progress indicator
     */
    stop(): void;
    /**
     * Check if progress indicator is active
     */
    isActive(): boolean;
    /**
     * Get current progress percentage
     */
    getPercentage(): number;
    /**
     * Get elapsed time in milliseconds
     */
    getElapsedTime(): number;
    /**
     * Display the progress indicator
     */
    private display;
    /**
     * Display determinate progress
     */
    private displayDeterminate;
    /**
     * Display indeterminate progress
     */
    private displayIndeterminate;
    /**
     * Get spinner character for indeterminate progress
     */
    private getSpinner;
    /**
     * Clear the current line
     */
    private clear;
}
