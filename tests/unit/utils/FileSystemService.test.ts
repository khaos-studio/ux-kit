/**
 * FileSystemService Unit Tests
 */

import { FileSystemService } from '../../../src/utils/FileSystemService';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('FileSystemService', () => {
  let fileSystem: FileSystemService;
  let tempDir: string;

  beforeEach(async () => {
    fileSystem = new FileSystemService();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'filesystemservice-test-'));
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

      await fileSystem.createDirectory(dirPath);

      const exists = await fileSystem.pathExists(dirPath);
      const isDir = await fileSystem.isDirectory(dirPath);
      expect(exists).toBe(true);
      expect(isDir).toBe(true);
    });

    it('should create nested directories recursively', async () => {
      const dirPath = path.join(tempDir, 'level1', 'level2', 'level3');

      await fileSystem.createDirectory(dirPath, true);

      const exists = await fileSystem.pathExists(dirPath);
      expect(exists).toBe(true);
    });
  });

  describe('ensureDirectoryExists', () => {
    it('should create directory if it does not exist', async () => {
      const dirPath = path.join(tempDir, 'new-dir');

      await fileSystem.ensureDirectoryExists(dirPath);

      const exists = await fileSystem.pathExists(dirPath);
      expect(exists).toBe(true);
    });

    it('should not throw error if directory already exists', async () => {
      const dirPath = path.join(tempDir, 'existing-dir');
      await fs.mkdir(dirPath);

      await expect(fileSystem.ensureDirectoryExists(dirPath)).resolves.not.toThrow();
    });
  });

  describe('writeFile', () => {
    it('should write content to a file', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      const content = 'Hello, World!';

      await fileSystem.writeFile(filePath, content);

      const result = await fileSystem.readFile(filePath);
      expect(result).toBe(content);
    });

    it('should create directory if it does not exist', async () => {
      const filePath = path.join(tempDir, 'nested', 'test.txt');
      const content = 'Hello, World!';

      await fileSystem.writeFile(filePath, content);

      const result = await fileSystem.readFile(filePath);
      expect(result).toBe(content);
    });
  });

  describe('readFile', () => {
    it('should read content from a file', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      const content = 'Hello, World!';
      await fs.writeFile(filePath, content);

      const result = await fileSystem.readFile(filePath);
      expect(result).toBe(content);
    });

    it('should throw error for non-existent file', async () => {
      const filePath = path.join(tempDir, 'non-existent.txt');

      await expect(fileSystem.readFile(filePath)).rejects.toThrow();
    });
  });

  describe('deleteFile', () => {
    it('should delete an existing file', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'content');

      await fileSystem.deleteFile(filePath);

      const exists = await fileSystem.pathExists(filePath);
      expect(exists).toBe(false);
    });

    it('should throw error for non-existent file', async () => {
      const filePath = path.join(tempDir, 'non-existent.txt');

      await expect(fileSystem.deleteFile(filePath)).rejects.toThrow();
    });
  });

  describe('deleteDirectory', () => {
    it('should delete an empty directory', async () => {
      const dirPath = path.join(tempDir, 'empty-dir');
      await fs.mkdir(dirPath);

      await fileSystem.deleteDirectory(dirPath);

      const exists = await fileSystem.pathExists(dirPath);
      expect(exists).toBe(false);
    });

    it('should delete directory recursively', async () => {
      const dirPath = path.join(tempDir, 'nested-dir');
      const nestedPath = path.join(dirPath, 'level1', 'level2');
      await fs.mkdir(nestedPath, { recursive: true });

      await fileSystem.deleteDirectory(dirPath, true);

      const exists = await fileSystem.pathExists(dirPath);
      expect(exists).toBe(false);
    });
  });

  describe('pathExists', () => {
    it('should return true for existing file', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'content');

      const result = await fileSystem.pathExists(filePath);
      expect(result).toBe(true);
    });

    it('should return true for existing directory', async () => {
      const dirPath = path.join(tempDir, 'test-dir');
      await fs.mkdir(dirPath);

      const result = await fileSystem.pathExists(dirPath);
      expect(result).toBe(true);
    });

    it('should return false for non-existent path', async () => {
      const nonExistentPath = path.join(tempDir, 'non-existent');

      const result = await fileSystem.pathExists(nonExistentPath);
      expect(result).toBe(false);
    });
  });

  describe('isDirectory', () => {
    it('should return true for directory', async () => {
      const dirPath = path.join(tempDir, 'test-dir');
      await fs.mkdir(dirPath);

      const result = await fileSystem.isDirectory(dirPath);
      expect(result).toBe(true);
    });

    it('should return false for file', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'content');

      const result = await fileSystem.isDirectory(filePath);
      expect(result).toBe(false);
    });

    it('should return false for non-existent path', async () => {
      const nonExistentPath = path.join(tempDir, 'non-existent');

      const result = await fileSystem.isDirectory(nonExistentPath);
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

      const files = await fileSystem.listFiles(dirPath);

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

      const txtFiles = await fileSystem.listFiles(dirPath, '.txt');

      expect(txtFiles).toHaveLength(2);
      expect(txtFiles).toContain(path.join(dirPath, 'file1.txt'));
      expect(txtFiles).toContain(path.join(dirPath, 'file3.txt'));
    });
  });

  describe('joinPaths', () => {
    it('should join multiple path segments', () => {
      const result = fileSystem.joinPaths('home', 'user', 'project');
      expect(result).toBe(path.join('home', 'user', 'project'));
    });

    it('should handle single path segment', () => {
      const result = fileSystem.joinPaths('home');
      expect(result).toBe('home');
    });
  });

  describe('basename', () => {
    it('should extract basename without extension', () => {
      const result = fileSystem.basename('/path/to/file.txt');
      expect(result).toBe('file.txt');
    });

    it('should extract basename with extension removed', () => {
      const result = fileSystem.basename('/path/to/file.txt', '.txt');
      expect(result).toBe('file');
    });
  });

  describe('dirname', () => {
    it('should extract directory name from file path', () => {
      const result = fileSystem.dirname('/path/to/file.txt');
      expect(result).toBe('/path/to');
    });

    it('should handle nested paths', () => {
      const result = fileSystem.dirname('/deep/nested/path/document.pdf');
      expect(result).toBe('/deep/nested/path');
    });
  });
});
