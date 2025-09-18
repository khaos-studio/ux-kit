/**
 * Progress Indicator
 * 
 * Displays progress for long-running operations.
 */

export class ProgressIndicator {
  private active: boolean = false;
  private current: number = 0;
  private total: number = 0;
  private message: string = '';
  private indeterminate: boolean = false;
  private startTime: number = 0;

  /**
   * Start a progress indicator with a total
   */
  start(message: string, total: number): void {
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
  startIndeterminate(message: string): void {
    this.message = message;
    this.active = true;
    this.indeterminate = true;
    this.startTime = Date.now();
    this.display();
  }

  /**
   * Update progress
   */
  update(current: number, message?: string): void {
    if (!this.active) return;

    this.current = current;
    if (message) {
      this.message = message;
    }

    this.display();
  }

  /**
   * Stop the progress indicator
   */
  stop(): void {
    this.active = false;
    this.clear();
  }

  /**
   * Check if progress indicator is active
   */
  isActive(): boolean {
    return this.active;
  }

  /**
   * Get current progress percentage
   */
  getPercentage(): number {
    if (this.indeterminate || this.total === 0) {
      return 0;
    }
    return Math.round((this.current / this.total) * 100);
  }

  /**
   * Get elapsed time in milliseconds
   */
  getElapsedTime(): number {
    if (!this.startTime) return 0;
    return Date.now() - this.startTime;
  }

  /**
   * Display the progress indicator
   */
  private display(): void {
    if (!this.active) return;

    this.clear();

    if (this.indeterminate) {
      this.displayIndeterminate();
    } else {
      this.displayDeterminate();
    }
  }

  /**
   * Display determinate progress
   */
  private displayDeterminate(): void {
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
  private displayIndeterminate(): void {
    const elapsed = this.getElapsedTime();
    const elapsedSeconds = Math.round(elapsed / 1000);
    const spinner = this.getSpinner();
    
    process.stdout.write(`\r${spinner} ${this.message} (${elapsedSeconds}s)`);
  }

  /**
   * Get spinner character for indeterminate progress
   */
  private getSpinner(): string {
    const spinners = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    const elapsed = this.getElapsedTime();
    const index = Math.floor(elapsed / 100) % spinners.length;
    return spinners[index] || '⠋';
  }

  /**
   * Clear the current line
   */
  private clear(): void {
    process.stdout.write('\r\x1b[K');
  }
}
