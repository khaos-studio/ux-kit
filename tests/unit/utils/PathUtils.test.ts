/**
 * PathUtils Unit Tests
 */

import { PathUtils } from '../../../src/utils/PathUtils';
import * as path from 'path';

describe('PathUtils', () => {
  describe('joinPaths', () => {
    it('should join multiple path segments', () => {
      const result = PathUtils.joinPaths('home', 'user', 'project');
      expect(result).toBe(path.join('home', 'user', 'project'));
    });

    it('should handle single path segment', () => {
      const result = PathUtils.joinPaths('home');
      expect(result).toBe('home');
    });

    it('should handle empty path segments', () => {
      const result = PathUtils.joinPaths('home', '', 'project');
      expect(result).toBe(path.join('home', '', 'project'));
    });
  });

  describe('basename', () => {
    it('should extract basename without extension', () => {
      const result = PathUtils.basename('/path/to/file.txt');
      expect(result).toBe('file.txt');
    });

    it('should extract basename with extension removed', () => {
      const result = PathUtils.basename('/path/to/file.txt', '.txt');
      expect(result).toBe('file');
    });

    it('should handle nested paths', () => {
      const result = PathUtils.basename('/deep/nested/path/document.pdf', '.pdf');
      expect(result).toBe('document');
    });
  });

  describe('dirname', () => {
    it('should extract directory name from file path', () => {
      const result = PathUtils.dirname('/path/to/file.txt');
      expect(result).toBe('/path/to');
    });

    it('should handle nested paths', () => {
      const result = PathUtils.dirname('/deep/nested/path/document.pdf');
      expect(result).toBe('/deep/nested/path');
    });

    it('should handle root paths', () => {
      const result = PathUtils.dirname('/file.txt');
      expect(result).toBe('/');
    });
  });

  describe('getExtension', () => {
    it('should extract file extension', () => {
      const result = PathUtils.getExtension('file.txt');
      expect(result).toBe('.txt');
    });

    it('should return empty string for files without extension', () => {
      const result = PathUtils.getExtension('file');
      expect(result).toBe('');
    });

    it('should handle multiple dots in filename', () => {
      const result = PathUtils.getExtension('file.backup.txt');
      expect(result).toBe('.txt');
    });
  });

  describe('isAbsolute', () => {
    it('should identify absolute paths', () => {
      const result = PathUtils.isAbsolute('/path/to/file');
      expect(result).toBe(true);
    });

    it('should identify relative paths', () => {
      const result = PathUtils.isAbsolute('path/to/file');
      expect(result).toBe(false);
    });
  });

  describe('resolve', () => {
    it('should resolve paths to absolute paths', () => {
      const result = PathUtils.resolve('path', 'to', 'file');
      expect(path.isAbsolute(result)).toBe(true);
    });
  });

  describe('normalize', () => {
    it('should normalize path with dots', () => {
      const result = PathUtils.normalize('/path/./to/../file');
      expect(result).toBe('/path/file');
    });
  });

  describe('relative', () => {
    it('should get relative path between two paths', () => {
      const result = PathUtils.relative('/path/to', '/path/to/file');
      expect(result).toBe('file');
    });
  });
});
