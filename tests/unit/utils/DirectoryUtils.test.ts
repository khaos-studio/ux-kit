/**
 * DirectoryUtils Unit Tests
 */

import { DirectoryUtils } from '../../../src/utils/DirectoryUtils';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('DirectoryUtils', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'directoryutils-test-'));
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('createDirectory', () => {
    it('should create a directory', async () => {
      const dirPath = path.join(tempDir, 'test-dir');

      await DirectoryUtils.createDirectory(dirPath);

      const stats = await fs.stat(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });

    it('should create nested directories recursively', async () => {
      const dirPath = path.join(tempDir, 'level1', 'level2', 'level3');

      await DirectoryUtils.createDirectory(dirPath, true);

      const stats = await fs.stat(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });

    it('should throw error when creating nested directories without recursive flag', async () => {
      const dirPath = path.join(tempDir, 'level1', 'level2');

      await expect(DirectoryUtils.createDirectory(dirPath, false)).rejects.toThrow();
    });
  });

  describe('ensureDirectoryExists', () => {
    it('should create directory if it does not exist', async () => {
      const dirPath = path.join(tempDir, 'new-dir');

      await DirectoryUtils.ensureDirectoryExists(dirPath);

      const stats = await fs.stat(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });

    it('should not throw error if directory already exists', async () => {
      const dirPath = path.join(tempDir, 'existing-dir');
      await fs.mkdir(dirPath);

      await expect(DirectoryUtils.ensureDirectoryExists(dirPath)).resolves.not.toThrow();
    });
  });

  describe('deleteDirectory', () => {
    it('should delete an empty directory', async () => {
      const dirPath = path.join(tempDir, 'empty-dir');
      await fs.mkdir(dirPath);

      await DirectoryUtils.deleteDirectory(dirPath);

      await expect(fs.access(dirPath)).rejects.toThrow();
    });

    it('should delete directory recursively', async () => {
      const dirPath = path.join(tempDir, 'nested-dir');
      const nestedPath = path.join(dirPath, 'level1', 'level2');
      await fs.mkdir(nestedPath, { recursive: true });

      await DirectoryUtils.deleteDirectory(dirPath, true);

      await expect(fs.access(dirPath)).rejects.toThrow();
    });
  });

  describe('directoryExists', () => {
    it('should return true for existing directory', async () => {
      const dirPath = path.join(tempDir, 'test-dir');
      await fs.mkdir(dirPath);

      const result = await DirectoryUtils.directoryExists(dirPath);
      expect(result).toBe(true);
    });

    it('should return false for non-existent directory', async () => {
      const dirPath = path.join(tempDir, 'non-existent-dir');

      const result = await DirectoryUtils.directoryExists(dirPath);
      expect(result).toBe(false);
    });

    it('should return false for file', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'content');

      const result = await DirectoryUtils.directoryExists(filePath);
      expect(result).toBe(false);
    });
  });

  describe('listFiles', () => {
    it('should list all files in directory', async () => {
      const dirPath = path.join(tempDir, 'list-test');
      await fs.mkdir(dirPath);
      await fs.writeFile(path.join(dirPath, 'file1.txt'), 'content1');
      await fs.writeFile(path.join(dirPath, 'file2.md'), 'content2');
      await fs.writeFile(path.join(dirPath, 'file3.js'), 'content3');

      const files = await DirectoryUtils.listFiles(dirPath);

      expect(files).toHaveLength(3);
      expect(files).toContain(path.join(dirPath, 'file1.txt'));
      expect(files).toContain(path.join(dirPath, 'file2.md'));
      expect(files).toContain(path.join(dirPath, 'file3.js'));
    });

    it('should filter files by extension', async () => {
      const dirPath = path.join(tempDir, 'filter-test');
      await fs.mkdir(dirPath);
      await fs.writeFile(path.join(dirPath, 'file1.txt'), 'content1');
      await fs.writeFile(path.join(dirPath, 'file2.md'), 'content2');
      await fs.writeFile(path.join(dirPath, 'file3.txt'), 'content3');

      const txtFiles = await DirectoryUtils.listFiles(dirPath, '.txt');

      expect(txtFiles).toHaveLength(2);
      expect(txtFiles).toContain(path.join(dirPath, 'file1.txt'));
      expect(txtFiles).toContain(path.join(dirPath, 'file3.txt'));
    });
  });

  describe('listDirectories', () => {
    it('should list all directories', async () => {
      const dirPath = path.join(tempDir, 'list-dirs-test');
      await fs.mkdir(dirPath);
      await fs.mkdir(path.join(dirPath, 'dir1'));
      await fs.mkdir(path.join(dirPath, 'dir2'));
      await fs.writeFile(path.join(dirPath, 'file.txt'), 'content');

      const directories = await DirectoryUtils.listDirectories(dirPath);

      expect(directories).toHaveLength(2);
      expect(directories).toContain(path.join(dirPath, 'dir1'));
      expect(directories).toContain(path.join(dirPath, 'dir2'));
    });
  });

  describe('getDirectoryStats', () => {
    it('should return directory statistics', async () => {
      const dirPath = path.join(tempDir, 'stats-test');
      await fs.mkdir(dirPath);

      const stats = await DirectoryUtils.getDirectoryStats(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });
  });

  describe('copyDirectory', () => {
    it('should copy directory recursively', async () => {
      const sourcePath = path.join(tempDir, 'source');
      const destPath = path.join(tempDir, 'dest');
      
      // Create source directory structure
      await fs.mkdir(sourcePath, { recursive: true });
      await fs.mkdir(path.join(sourcePath, 'subdir'), { recursive: true });
      await fs.writeFile(path.join(sourcePath, 'file1.txt'), 'content1');
      await fs.writeFile(path.join(sourcePath, 'subdir', 'file2.txt'), 'content2');

      await DirectoryUtils.copyDirectory(sourcePath, destPath);

      // Check that files were copied
      const file1Content = await fs.readFile(path.join(destPath, 'file1.txt'), 'utf8');
      const file2Content = await fs.readFile(path.join(destPath, 'subdir', 'file2.txt'), 'utf8');
      
      expect(file1Content).toBe('content1');
      expect(file2Content).toBe('content2');
    });
  });

  describe('getDirectorySize', () => {
    it('should calculate directory size', async () => {
      const dirPath = path.join(tempDir, 'size-test');
      await fs.mkdir(dirPath);
      await fs.writeFile(path.join(dirPath, 'file1.txt'), 'content1');
      await fs.writeFile(path.join(dirPath, 'file2.txt'), 'content2');

      const size = await DirectoryUtils.getDirectorySize(dirPath);
      expect(size).toBe(16); // 'content1'.length + 'content2'.length
    });
  });

  describe('isDirectory', () => {
    it('should return true for directory', async () => {
      const dirPath = path.join(tempDir, 'test-dir');
      await fs.mkdir(dirPath);

      const result = await DirectoryUtils.isDirectory(dirPath);
      expect(result).toBe(true);
    });

    it('should return false for file', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'content');

      const result = await DirectoryUtils.isDirectory(filePath);
      expect(result).toBe(false);
    });

    it('should return false for non-existent path', async () => {
      const nonExistentPath = path.join(tempDir, 'non-existent');

      const result = await DirectoryUtils.isDirectory(nonExistentPath);
      expect(result).toBe(false);
    });
  });
});
