/**
 * ProgressIndicator Unit Tests
 */

import { ProgressIndicator } from '../../../src/output/ProgressIndicator';

// Mock process.stdout.write to avoid console output during tests
const mockWrite = jest.fn();
const originalWrite = process.stdout.write;

beforeAll(() => {
  process.stdout.write = mockWrite;
});

afterAll(() => {
  process.stdout.write = originalWrite;
});

beforeEach(() => {
  mockWrite.mockClear();
});

describe('ProgressIndicator', () => {
  let progressIndicator: ProgressIndicator;

  beforeEach(() => {
    progressIndicator = new ProgressIndicator();
  });

  describe('start', () => {
    it('should start progress indicator with total', () => {
      progressIndicator.start('Processing...', 100);
      
      expect(progressIndicator.isActive()).toBe(true);
      expect(progressIndicator.getPercentage()).toBe(0);
      expect(mockWrite).toHaveBeenCalled();
    });
  });

  describe('startIndeterminate', () => {
    it('should start indeterminate progress indicator', () => {
      progressIndicator.startIndeterminate('Loading...');
      
      expect(progressIndicator.isActive()).toBe(true);
      expect(mockWrite).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update progress', () => {
      progressIndicator.start('Processing...', 100);
      progressIndicator.update(50);
      
      expect(progressIndicator.getPercentage()).toBe(50);
      expect(mockWrite).toHaveBeenCalled();
    });

    it('should update progress with custom message', () => {
      progressIndicator.start('Processing...', 100);
      progressIndicator.update(50, 'Halfway done...');
      
      expect(progressIndicator.getPercentage()).toBe(50);
      expect(mockWrite).toHaveBeenCalled();
    });

    it('should not update when not active', () => {
      progressIndicator.update(50);
      
      expect(progressIndicator.getPercentage()).toBe(0);
      expect(mockWrite).not.toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should stop progress indicator', () => {
      progressIndicator.start('Processing...', 100);
      progressIndicator.stop();
      
      expect(progressIndicator.isActive()).toBe(false);
      expect(mockWrite).toHaveBeenCalled();
    });
  });

  describe('isActive', () => {
    it('should return correct active state', () => {
      expect(progressIndicator.isActive()).toBe(false);
      
      progressIndicator.start('Processing...', 100);
      expect(progressIndicator.isActive()).toBe(true);
      
      progressIndicator.stop();
      expect(progressIndicator.isActive()).toBe(false);
    });
  });

  describe('getPercentage', () => {
    it('should return correct percentage', () => {
      progressIndicator.start('Processing...', 100);
      
      progressIndicator.update(0);
      expect(progressIndicator.getPercentage()).toBe(0);
      
      progressIndicator.update(25);
      expect(progressIndicator.getPercentage()).toBe(25);
      
      progressIndicator.update(50);
      expect(progressIndicator.getPercentage()).toBe(50);
      
      progressIndicator.update(100);
      expect(progressIndicator.getPercentage()).toBe(100);
    });

    it('should return 0 for indeterminate progress', () => {
      progressIndicator.startIndeterminate('Loading...');
      expect(progressIndicator.getPercentage()).toBe(0);
    });

    it('should return 0 when not active', () => {
      expect(progressIndicator.getPercentage()).toBe(0);
    });
  });

  describe('getElapsedTime', () => {
    it('should return elapsed time', (done) => {
      progressIndicator.start('Processing...', 100);
      
      setTimeout(() => {
        const elapsed = progressIndicator.getElapsedTime();
        expect(elapsed).toBeGreaterThan(0);
        progressIndicator.stop();
        done();
      }, 10);
    });

    it('should return 0 when not started', () => {
      expect(progressIndicator.getElapsedTime()).toBe(0);
    });
  });
});
