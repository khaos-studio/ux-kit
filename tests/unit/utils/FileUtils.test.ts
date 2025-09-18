/**
 * FileUtils Unit Tests
 */

import { FileUtils } from '../../../src/utils/FileUtils';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('FileUtils', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fileutils-test-'));
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('writeFile', () => {
    it('should write content to a file', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      const content = 'Hello, World!';

      await FileUtils.writeFile(filePath, content);

      const result = await fs.readFile(filePath, 'utf8');
      expect(result).toBe(content);
    });

    it('should create directory if it does not exist', async () => {
      const filePath = path.join(tempDir, 'nested', 'test.txt');
      const content = 'Hello, World!';

      await FileUtils.writeFile(filePath, content);

      const result = await fs.readFile(filePath, 'utf8');
      expect(result).toBe(content);
    });
  });

  describe('readFile', () => {
    it('should read content from a file', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      const content = 'Hello, World!';
      await fs.writeFile(filePath, content);

      const result = await FileUtils.readFile(filePath);
      expect(result).toBe(content);
    });

    it('should throw error for non-existent file', async () => {
      const filePath = path.join(tempDir, 'non-existent.txt');

      await expect(FileUtils.readFile(filePath)).rejects.toThrow();
    });
  });

  describe('deleteFile', () => {
    it('should delete an existing file', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'content');

      await FileUtils.deleteFile(filePath);

      await expect(fs.access(filePath)).rejects.toThrow();
    });

    it('should throw error for non-existent file', async () => {
      const filePath = path.join(tempDir, 'non-existent.txt');

      await expect(FileUtils.deleteFile(filePath)).rejects.toThrow();
    });
  });

  describe('fileExists', () => {
    it('should return true for existing file', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'content');

      const result = await FileUtils.fileExists(filePath);
      expect(result).toBe(true);
    });

    it('should return false for non-existent file', async () => {
      const filePath = path.join(tempDir, 'non-existent.txt');

      const result = await FileUtils.fileExists(filePath);
      expect(result).toBe(false);
    });

    it('should return false for directory', async () => {
      const dirPath = path.join(tempDir, 'test-dir');
      await fs.mkdir(dirPath);

      const result = await FileUtils.fileExists(dirPath);
      expect(result).toBe(false);
    });
  });

  describe('getFileStats', () => {
    it('should return file statistics', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'content');

      const stats = await FileUtils.getFileStats(filePath);
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBe(7); // 'content'.length
    });
  });

  describe('copyFile', () => {
    it('should copy file to destination', async () => {
      const sourcePath = path.join(tempDir, 'source.txt');
      const destPath = path.join(tempDir, 'dest.txt');
      const content = 'Hello, World!';
      await fs.writeFile(sourcePath, content);

      await FileUtils.copyFile(sourcePath, destPath);

      const result = await fs.readFile(destPath, 'utf8');
      expect(result).toBe(content);
    });

    it('should create destination directory if it does not exist', async () => {
      const sourcePath = path.join(tempDir, 'source.txt');
      const destPath = path.join(tempDir, 'nested', 'dest.txt');
      const content = 'Hello, World!';
      await fs.writeFile(sourcePath, content);

      await FileUtils.copyFile(sourcePath, destPath);

      const result = await fs.readFile(destPath, 'utf8');
      expect(result).toBe(content);
    });
  });

  describe('moveFile', () => {
    it('should move file to destination', async () => {
      const sourcePath = path.join(tempDir, 'source.txt');
      const destPath = path.join(tempDir, 'dest.txt');
      const content = 'Hello, World!';
      await fs.writeFile(sourcePath, content);

      await FileUtils.moveFile(sourcePath, destPath);

      await expect(fs.access(sourcePath)).rejects.toThrow();
      const result = await fs.readFile(destPath, 'utf8');
      expect(result).toBe(content);
    });
  });

  describe('getFileSize', () => {
    it('should return file size in bytes', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      const content = 'Hello, World!';
      await fs.writeFile(filePath, content);

      const size = await FileUtils.getFileSize(filePath);
      expect(size).toBe(content.length);
    });
  });

  describe('getFileModifiedTime', () => {
    it('should return file modification time', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'content');

      const mtime = await FileUtils.getFileModifiedTime(filePath);
      expect(typeof mtime).toBe('object');
      expect(mtime.constructor.name).toBe('Date');
      expect(mtime.getTime()).toBeGreaterThan(0);
    });
  });
});
