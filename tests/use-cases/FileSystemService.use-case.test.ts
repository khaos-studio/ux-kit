/**
 * FileSystemService Use Case Tests
 * 
 * These tests define the expected behavior and user scenarios for the FileSystemService
 * before any implementation code is written (TDD Red Phase).
 */

import { FileSystemService } from '../../src/utils/FileSystemService';
import { PathUtils } from '../../src/utils/PathUtils';
import { FileUtils } from '../../src/utils/FileUtils';
import { DirectoryUtils } from '../../src/utils/DirectoryUtils';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('FileSystemService Use Cases', () => {
  let fileSystem: FileSystemService;
  let tempDir: string;

  beforeEach(async () => {
    fileSystem = new FileSystemService();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'uxkit-test-'));
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Cross-Platform Path Operations', () => {
    it('should handle path joining correctly on different platforms', () => {
      // Given a FileSystemService instance
      // When joining paths on different platforms
      const unixPath = fileSystem.joinPaths('home', 'user', 'project');
      const windowsPath = fileSystem.joinPaths('C:', 'Users', 'user', 'project');
      
      // Then paths should be correctly formatted for the current platform
      expect(unixPath).toBeDefined();
      expect(windowsPath).toBeDefined();
      expect(typeof unixPath).toBe('string');
      expect(typeof windowsPath).toBe('string');
    });

    it('should extract basename correctly with and without extension', () => {
      // Given a FileSystemService instance
      // When extracting basename from various paths
      const basenameWithExt = fileSystem.basename('/path/to/file.txt', '.txt');
      const basenameWithoutExt = fileSystem.basename('/path/to/file.txt');
      const basenameNested = fileSystem.basename('/deep/nested/path/document.pdf', '.pdf');
      
      // Then basenames should be extracted correctly
      expect(basenameWithExt).toBe('file');
      expect(basenameWithoutExt).toBe('file.txt');
      expect(basenameNested).toBe('document');
    });

    it('should extract dirname correctly', () => {
      // Given a FileSystemService instance
      // When extracting dirname from various paths
      const dirnameSimple = fileSystem.dirname('/path/to/file.txt');
      const dirnameNested = fileSystem.dirname('/deep/nested/path/document.pdf');
      const dirnameRoot = fileSystem.dirname('/file.txt');
      
      // Then dirnames should be extracted correctly
      expect(dirnameSimple).toBe('/path/to');
      expect(dirnameNested).toBe('/deep/nested/path');
      expect(dirnameRoot).toBe('/');
    });
  });

  describe('Directory Operations', () => {
    it('should create directories recursively', async () => {
      // Given a FileSystemService instance and a nested directory path
      const nestedPath = fileSystem.joinPaths(tempDir, 'level1', 'level2', 'level3');
      
      // When creating a directory recursively
      await fileSystem.createDirectory(nestedPath, true);
      
      // Then the directory should exist
      const exists = await fileSystem.pathExists(nestedPath);
      const isDir = await fileSystem.isDirectory(nestedPath);
      expect(exists).toBe(true);
      expect(isDir).toBe(true);
    });

    it('should ensure directory exists without throwing if already exists', async () => {
      // Given a FileSystemService instance and a directory path
      const dirPath = fileSystem.joinPaths(tempDir, 'existing-dir');
      await fileSystem.createDirectory(dirPath);
      
      // When ensuring the directory exists again
      // Then it should not throw an error
      await expect(fileSystem.ensureDirectoryExists(dirPath)).resolves.not.toThrow();
      
      // And the directory should still exist
      const exists = await fileSystem.pathExists(dirPath);
      expect(exists).toBe(true);
    });

    it('should delete directories recursively', async () => {
      // Given a FileSystemService instance and a nested directory structure
      const nestedPath = fileSystem.joinPaths(tempDir, 'nested', 'deep', 'structure');
      await fileSystem.createDirectory(nestedPath, true);
      
      // When deleting the parent directory recursively
      const parentPath = fileSystem.joinPaths(tempDir, 'nested');
      await fileSystem.deleteDirectory(parentPath, true);
      
      // Then the directory should no longer exist
      const exists = await fileSystem.pathExists(parentPath);
      expect(exists).toBe(false);
    });
  });

  describe('File Operations', () => {
    it('should write and read files correctly', async () => {
      // Given a FileSystemService instance and file content
      const filePath = fileSystem.joinPaths(tempDir, 'test-file.txt');
      const content = 'Hello, UX-Kit! This is a test file.';
      
      // When writing content to a file
      await fileSystem.writeFile(filePath, content);
      
      // Then the file should exist and contain the correct content
      const exists = await fileSystem.pathExists(filePath);
      const readContent = await fileSystem.readFile(filePath);
      expect(exists).toBe(true);
      expect(readContent).toBe(content);
    });

    it('should handle file deletion', async () => {
      // Given a FileSystemService instance and an existing file
      const filePath = fileSystem.joinPaths(tempDir, 'delete-me.txt');
      await fileSystem.writeFile(filePath, 'This file will be deleted');
      
      // When deleting the file
      await fileSystem.deleteFile(filePath);
      
      // Then the file should no longer exist
      const exists = await fileSystem.pathExists(filePath);
      expect(exists).toBe(false);
    });

    it('should list files in a directory', async () => {
      // Given a FileSystemService instance and multiple files in a directory
      const testDir = fileSystem.joinPaths(tempDir, 'list-test');
      await fileSystem.createDirectory(testDir);
      
      await fileSystem.writeFile(fileSystem.joinPaths(testDir, 'file1.txt'), 'content1');
      await fileSystem.writeFile(fileSystem.joinPaths(testDir, 'file2.md'), 'content2');
      await fileSystem.writeFile(fileSystem.joinPaths(testDir, 'file3.js'), 'content3');
      
      // When listing files in the directory
      const allFiles = await fileSystem.listFiles(testDir);
      const txtFiles = await fileSystem.listFiles(testDir, '.txt');
      
      // Then it should return the correct files
      expect(allFiles).toHaveLength(3);
      expect(allFiles).toContain(fileSystem.joinPaths(testDir, 'file1.txt'));
      expect(allFiles).toContain(fileSystem.joinPaths(testDir, 'file2.md'));
      expect(allFiles).toContain(fileSystem.joinPaths(testDir, 'file3.js'));
      
      expect(txtFiles).toHaveLength(1);
      expect(txtFiles).toContain(fileSystem.joinPaths(testDir, 'file1.txt'));
    });
  });

  describe('Path Existence and Type Checking', () => {
    it('should correctly identify existing and non-existing paths', async () => {
      // Given a FileSystemService instance
      const existingFile = fileSystem.joinPaths(tempDir, 'existing.txt');
      const nonExistingFile = fileSystem.joinPaths(tempDir, 'non-existing.txt');
      
      await fileSystem.writeFile(existingFile, 'content');
      
      // When checking path existence
      const existingExists = await fileSystem.pathExists(existingFile);
      const nonExistingExists = await fileSystem.pathExists(nonExistingFile);
      
      // Then it should return correct results
      expect(existingExists).toBe(true);
      expect(nonExistingExists).toBe(false);
    });

    it('should correctly identify directories vs files', async () => {
      // Given a FileSystemService instance with both files and directories
      const testDir = fileSystem.joinPaths(tempDir, 'type-test');
      const testFile = fileSystem.joinPaths(tempDir, 'type-test.txt');
      
      await fileSystem.createDirectory(testDir);
      await fileSystem.writeFile(testFile, 'content');
      
      // When checking if paths are directories
      const dirIsDir = await fileSystem.isDirectory(testDir);
      const fileIsDir = await fileSystem.isDirectory(testFile);
      
      // Then it should return correct results
      expect(dirIsDir).toBe(true);
      expect(fileIsDir).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle file operations on non-existent directories gracefully', async () => {
      // Given a FileSystemService instance and a non-existent directory path
      const nonExistentDir = fileSystem.joinPaths(tempDir, 'non-existent', 'file.txt');
      
      // When trying to write to a non-existent directory
      // Then it should create the directory and write the file successfully
      await expect(fileSystem.writeFile(nonExistentDir, 'content')).resolves.not.toThrow();
      
      // And the file should exist
      const exists = await fileSystem.pathExists(nonExistentDir);
      expect(exists).toBe(true);
    });

    it('should handle reading non-existent files gracefully', async () => {
      // Given a FileSystemService instance and a non-existent file path
      const nonExistentFile = fileSystem.joinPaths(tempDir, 'non-existent.txt');
      
      // When trying to read a non-existent file
      // Then it should throw an appropriate error
      await expect(fileSystem.readFile(nonExistentFile)).rejects.toThrow();
    });

    it('should handle deleting non-existent files gracefully', async () => {
      // Given a FileSystemService instance and a non-existent file path
      const nonExistentFile = fileSystem.joinPaths(tempDir, 'non-existent.txt');
      
      // When trying to delete a non-existent file
      // Then it should throw an appropriate error
      await expect(fileSystem.deleteFile(nonExistentFile)).rejects.toThrow();
    });
  });

  describe('UX-Kit Specific Use Cases', () => {
    it('should support creating UX-Kit directory structure', async () => {
      // Given a FileSystemService instance and a project root
      const projectRoot = tempDir;
      const uxkitRoot = fileSystem.joinPaths(projectRoot, '.uxkit');
      const studiesDir = fileSystem.joinPaths(uxkitRoot, 'studies');
      const templatesDir = fileSystem.joinPaths(uxkitRoot, 'templates');
      const memoryDir = fileSystem.joinPaths(uxkitRoot, 'memory');
      
      // When creating the UX-Kit directory structure
      await fileSystem.createDirectory(uxkitRoot);
      await fileSystem.createDirectory(studiesDir);
      await fileSystem.createDirectory(templatesDir);
      await fileSystem.createDirectory(memoryDir);
      
      // Then all directories should exist
      expect(await fileSystem.pathExists(uxkitRoot)).toBe(true);
      expect(await fileSystem.pathExists(studiesDir)).toBe(true);
      expect(await fileSystem.pathExists(templatesDir)).toBe(true);
      expect(await fileSystem.pathExists(memoryDir)).toBe(true);
    });

    it('should support creating study-specific directory structures', async () => {
      // Given a FileSystemService instance and a study ID
      const studyId = 'study-123';
      const studyPath = fileSystem.joinPaths(tempDir, '.uxkit', 'studies', studyId);
      const summariesPath = fileSystem.joinPaths(studyPath, 'summaries');
      const interviewsPath = fileSystem.joinPaths(studyPath, 'interviews');
      
      // When creating a study directory structure
      await fileSystem.createDirectory(studyPath, true);
      await fileSystem.createDirectory(summariesPath);
      await fileSystem.createDirectory(interviewsPath);
      
      // Then all study directories should exist
      expect(await fileSystem.pathExists(studyPath)).toBe(true);
      expect(await fileSystem.pathExists(summariesPath)).toBe(true);
      expect(await fileSystem.pathExists(interviewsPath)).toBe(true);
    });

    it('should support generating research artifact files', async () => {
      // Given a FileSystemService instance and research content
      const studyPath = fileSystem.joinPaths(tempDir, 'study-123');
      const questionsPath = fileSystem.joinPaths(studyPath, 'questions.md');
      const sourcesPath = fileSystem.joinPaths(studyPath, 'sources.md');
      
      const questionsContent = '# Research Questions\n\n- What are the main user pain points?';
      const sourcesContent = '# Research Sources\n\n- Source 1: User interviews';
      
      // When creating research artifact files
      await fileSystem.createDirectory(studyPath);
      await fileSystem.writeFile(questionsPath, questionsContent);
      await fileSystem.writeFile(sourcesPath, sourcesContent);
      
      // Then the files should exist with correct content
      expect(await fileSystem.pathExists(questionsPath)).toBe(true);
      expect(await fileSystem.pathExists(sourcesPath)).toBe(true);
      expect(await fileSystem.readFile(questionsPath)).toBe(questionsContent);
      expect(await fileSystem.readFile(sourcesPath)).toBe(sourcesContent);
    });
  });
});
