/**
 * File Permission Tests
 * 
 * Tests for file permission handling across different platforms.
 * These tests ensure the UX-Kit handles file permissions correctly.
 */

import { FileSystemService } from '../../src/utils/FileSystemService';
import { StudyService } from '../../src/services/StudyService';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);

describe('File Permission Tests', () => {
  let fileSystemService: FileSystemService;
  let studyService: StudyService;
  let testProjectRoot: string;

  beforeEach(async () => {
    testProjectRoot = path.join(__dirname, '../temp/file-permission-test');
    await mkdir(testProjectRoot, { recursive: true });

    fileSystemService = new FileSystemService();
    studyService = new StudyService(fileSystemService);
  });

  afterEach(async () => {
    try {
      await rmdir(testProjectRoot, { recursive: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('File Creation Permissions', () => {
    it('should create files with appropriate permissions', async () => {
      // Given: A test file path
      const testFilePath = path.join(testProjectRoot, 'test-file.txt');
      const testContent = 'Test content for permission testing';

      // When: Creating a file
      await fileSystemService.writeFile(testFilePath, testContent);

      // Then: File should be created with appropriate permissions
      expect(fs.existsSync(testFilePath)).toBe(true);
      const stats = fs.statSync(testFilePath);
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBe(testContent.length);

      // And: File should be readable
      const readContent = await fileSystemService.readFile(testFilePath);
      expect(readContent).toBe(testContent);
    });

    it('should create directories with appropriate permissions', async () => {
      // Given: A test directory path
      const testDirPath = path.join(testProjectRoot, 'test-directory');

      // When: Creating a directory
      await fileSystemService.ensureDirectoryExists(testDirPath);

      // Then: Directory should be created with appropriate permissions
      expect(fs.existsSync(testDirPath)).toBe(true);
      const stats = fs.statSync(testDirPath);
      expect(stats.isDirectory()).toBe(true);

      // And: Directory should be writable
      const testFilePath = path.join(testDirPath, 'test.txt');
      await fileSystemService.writeFile(testFilePath, 'test content');
      expect(fs.existsSync(testFilePath)).toBe(true);
    });

    it('should handle nested directory creation with permissions', async () => {
      // Given: Nested directory structure
      const nestedPath = path.join(testProjectRoot, 'level1', 'level2', 'level3');

      // When: Creating nested directories
      await fileSystemService.ensureDirectoryExists(nestedPath);

      // Then: All directories should be created with appropriate permissions
      expect(fs.existsSync(nestedPath)).toBe(true);
      const stats = fs.statSync(nestedPath);
      expect(stats.isDirectory()).toBe(true);

      // And: Should be able to create files in nested directory
      const testFilePath = path.join(nestedPath, 'test.txt');
      await fileSystemService.writeFile(testFilePath, 'nested test content');
      expect(fs.existsSync(testFilePath)).toBe(true);
    });
  });

  describe('File Access Permissions', () => {
    it('should handle file read permissions correctly', async () => {
      // Given: A test file
      const testFilePath = path.join(testProjectRoot, 'read-test.txt');
      const testContent = 'Content for read permission testing';
      await fileSystemService.writeFile(testFilePath, testContent);

      // When: Reading the file
      const readContent = await fileSystemService.readFile(testFilePath);

      // Then: File should be readable
      expect(readContent).toBe(testContent);
    });

    it('should handle file write permissions correctly', async () => {
      // Given: A test file
      const testFilePath = path.join(testProjectRoot, 'write-test.txt');
      const initialContent = 'Initial content';
      const updatedContent = 'Updated content';

      // When: Writing initial content
      await fileSystemService.writeFile(testFilePath, initialContent);
      expect(fs.existsSync(testFilePath)).toBe(true);

      // And: Updating the content
      await fileSystemService.writeFile(testFilePath, updatedContent);

      // Then: File should be writable and updated
      const readContent = await fileSystemService.readFile(testFilePath);
      expect(readContent).toBe(updatedContent);
    });

    it('should handle file deletion permissions correctly', async () => {
      // Given: A test file
      const testFilePath = path.join(testProjectRoot, 'delete-test.txt');
      await fileSystemService.writeFile(testFilePath, 'Content to be deleted');
      expect(fs.existsSync(testFilePath)).toBe(true);

      // When: Deleting the file
      await fileSystemService.deleteFile(testFilePath);

      // Then: File should be deleted
      expect(fs.existsSync(testFilePath)).toBe(false);
    });

    it('should handle directory deletion permissions correctly', async () => {
      // Given: A test directory with files
      const testDirPath = path.join(testProjectRoot, 'delete-dir-test');
      await fileSystemService.ensureDirectoryExists(testDirPath);
      
      const testFilePath = path.join(testDirPath, 'test.txt');
      await fileSystemService.writeFile(testFilePath, 'Content in directory');
      
      expect(fs.existsSync(testDirPath)).toBe(true);
      expect(fs.existsSync(testFilePath)).toBe(true);

      // When: Deleting the directory
      await fileSystemService.deleteDirectory(testDirPath, true);

      // Then: Directory should be deleted
      expect(fs.existsSync(testDirPath)).toBe(false);
    });
  });

  describe('Study Service Permission Handling', () => {
    it('should handle study creation with proper permissions', async () => {
      // Given: Study creation parameters
      const studyName = 'permission-test-study';
      const studyDescription = 'Study for permission testing';

      // When: Creating a study
      const studyMetadata = await studyService.createStudy(studyName, studyDescription, testProjectRoot);

      // Then: Study should be created with proper permissions
      expect(studyMetadata).toBeDefined();
      expect(fs.existsSync(studyMetadata.basePath)).toBe(true);
      
      const stats = fs.statSync(studyMetadata.basePath);
      expect(stats.isDirectory()).toBe(true);

      // And: Study files should be accessible
      const configPath = path.join(studyMetadata.basePath, 'study-config.yaml');
      expect(fs.existsSync(configPath)).toBe(true);
      
      const configContent = await fileSystemService.readFile(configPath);
      expect(configContent).toContain(studyName);
      expect(configContent).toContain(studyDescription);
    });

    it('should handle study file operations with proper permissions', async () => {
      // Given: A created study
      const studyMetadata = await studyService.createStudy('file-ops-study', 'File operations test', testProjectRoot);

      // When: Creating additional files in the study
      const additionalFilePath = path.join(studyMetadata.basePath, 'additional-file.txt');
      const additionalContent = 'Additional content for permission testing';
      
      await fileSystemService.writeFile(additionalFilePath, additionalContent);

      // Then: File should be created with proper permissions
      expect(fs.existsSync(additionalFilePath)).toBe(true);
      
      const readContent = await fileSystemService.readFile(additionalFilePath);
      expect(readContent).toBe(additionalContent);

      // And: Should be able to update the file
      const updatedContent = 'Updated additional content';
      await fileSystemService.writeFile(additionalFilePath, updatedContent);
      
      const updatedReadContent = await fileSystemService.readFile(additionalFilePath);
      expect(updatedReadContent).toBe(updatedContent);
    });

    it('should handle study deletion with proper permissions', async () => {
      // Given: A created study
      const studyMetadata = await studyService.createStudy('delete-study', 'Study for deletion test', testProjectRoot);
      expect(fs.existsSync(studyMetadata.basePath)).toBe(true);

      // When: Deleting the study
      await studyService.deleteStudy(studyMetadata.id, testProjectRoot);

      // Then: Study directory should be deleted
      expect(fs.existsSync(studyMetadata.basePath)).toBe(false);
    });
  });

  describe('Permission Error Handling', () => {
    it('should handle permission errors gracefully', async () => {
      // Given: A test file
      const testFilePath = path.join(testProjectRoot, 'permission-error-test.txt');
      await fileSystemService.writeFile(testFilePath, 'Test content');

      // When: Attempting to read a non-existent file
      try {
        await fileSystemService.readFile(path.join(testProjectRoot, 'non-existent-file.txt'));
        fail('Should have thrown an error for non-existent file');
      } catch (error) {
        // Then: Should throw an appropriate error
        expect(error).toBeDefined();
        expect(error).toBeTruthy();
      }

      // And: Original file should still be accessible
      const content = await fileSystemService.readFile(testFilePath);
      expect(content).toBe('Test content');
    });

    it('should handle directory permission errors gracefully', async () => {
      // Given: A test directory
      const testDirPath = path.join(testProjectRoot, 'permission-error-dir');
      await fileSystemService.ensureDirectoryExists(testDirPath);

      // When: Attempting to create a file in a non-existent parent directory
      try {
        const invalidFilePath = path.join(testProjectRoot, 'non-existent-parent', 'file.txt');
        await fileSystemService.writeFile(invalidFilePath, 'Test content');
        fail('Should have thrown an error for non-existent parent directory');
      } catch (error) {
        // Then: Should throw an appropriate error
        expect(error).toBeDefined();
        expect(error).toBeTruthy();
      }

      // And: Original directory should still be accessible
      expect(fs.existsSync(testDirPath)).toBe(true);
    });

    it('should handle concurrent file operations with permissions', async () => {
      // Given: Multiple concurrent file operations
      const operations = [];
      const fileCount = 5;

      // When: Creating multiple files concurrently
      for (let i = 0; i < fileCount; i++) {
        const filePath = path.join(testProjectRoot, `concurrent-file-${i}.txt`);
        const content = `Content for file ${i}`;
        const operation = fileSystemService.writeFile(filePath, content);
        operations.push(operation);
      }

      await Promise.all(operations);

      // Then: All files should be created with proper permissions
      for (let i = 0; i < fileCount; i++) {
        const filePath = path.join(testProjectRoot, `concurrent-file-${i}.txt`);
        expect(fs.existsSync(filePath)).toBe(true);
        
        const content = await fileSystemService.readFile(filePath);
        expect(content).toBe(`Content for file ${i}`);
      }
    });
  });

  describe('Cross-Platform Permission Compatibility', () => {
    it('should handle permission operations consistently across platforms', async () => {
      // Given: Various file and directory operations
      const operations = [
        { type: 'file', path: 'cross-platform-file.txt', content: 'Cross-platform content' },
        { type: 'directory', path: 'cross-platform-dir' },
        { type: 'nested-file', path: 'cross-platform-dir/nested-file.txt', content: 'Nested content' }
      ];

      // When: Performing operations
      for (const operation of operations) {
        const fullPath = path.join(testProjectRoot, operation.path);
        
        if (operation.type === 'file' || operation.type === 'nested-file') {
          // Ensure parent directory exists for nested files
          if (operation.type === 'nested-file') {
            const parentDir = path.dirname(fullPath);
            await fileSystemService.ensureDirectoryExists(parentDir);
          }
          
          await fileSystemService.writeFile(fullPath, operation.content!);
          expect(fs.existsSync(fullPath)).toBe(true);
          
          const readContent = await fileSystemService.readFile(fullPath);
          expect(readContent).toBe(operation.content);
        } else if (operation.type === 'directory') {
          await fileSystemService.ensureDirectoryExists(fullPath);
          expect(fs.existsSync(fullPath)).toBe(true);
          expect(fs.statSync(fullPath).isDirectory()).toBe(true);
        }
      }
    });

    it('should handle special characters in file names with permissions', async () => {
      // Given: File names with special characters
      const specialFileNames = [
        'file with spaces.txt',
        'file-with-dashes.txt',
        'file_with_underscores.txt',
        'file.with.dots.txt',
        'file(with)parentheses.txt'
      ];

      // When: Creating files with special characters
      for (const fileName of specialFileNames) {
        const filePath = path.join(testProjectRoot, fileName);
        const content = `Content for ${fileName}`;
        
        await fileSystemService.writeFile(filePath, content);
        
        // Then: File should be created with proper permissions
        expect(fs.existsSync(filePath)).toBe(true);
        
        const readContent = await fileSystemService.readFile(filePath);
        expect(readContent).toBe(content);
      }
    });
  });
});
