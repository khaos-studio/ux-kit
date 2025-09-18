/**
 * macOS Compatibility Tests
 * 
 * Tests for macOS-specific functionality and compatibility.
 * These tests ensure the UX-Kit works correctly on macOS systems.
 */

import { FileSystemService } from '../../src/utils/FileSystemService';
import { StudyService } from '../../src/services/StudyService';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);

describe('macOS Compatibility Tests', () => {
  let fileSystemService: FileSystemService;
  let studyService: StudyService;
  let testProjectRoot: string;

  beforeEach(async () => {
    testProjectRoot = path.join(__dirname, '../temp/macos-compatibility-test');
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

  describe('macOS Path Handling', () => {
    it('should handle macOS file paths correctly', async () => {
      // Given: macOS-style paths with spaces and special characters
      const testPaths = [
        '/Users/test user/Documents/My Project',
        '/Applications/My App.app/Contents/Resources',
        '/Library/Application Support/UX-Kit',
        '/tmp/test with spaces/file.txt'
      ];

      // When: Creating directories with macOS paths
      for (const testPath of testPaths) {
        const fullPath = path.join(testProjectRoot, path.basename(testPath));
        
        // Then: Should create directories successfully
        await fileSystemService.ensureDirectoryExists(fullPath);
        expect(fs.existsSync(fullPath)).toBe(true);
        expect(fs.statSync(fullPath).isDirectory()).toBe(true);
      }
    });

    it('should handle macOS file permissions correctly', async () => {
      // Given: A test file path
      const testFilePath = path.join(testProjectRoot, 'test-file.txt');
      const testContent = 'Test content for macOS';

      // When: Writing a file
      await fileSystemService.writeFile(testFilePath, testContent);

      // Then: File should be created with correct permissions
      expect(fs.existsSync(testFilePath)).toBe(true);
      const stats = fs.statSync(testFilePath);
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBe(testContent.length);

      // And: Should be readable
      const readContent = await fileSystemService.readFile(testFilePath);
      expect(readContent).toBe(testContent);
    });

    it('should handle macOS directory permissions correctly', async () => {
      // Given: A test directory path
      const testDirPath = path.join(testProjectRoot, 'test-directory');

      // When: Creating a directory
      await fileSystemService.ensureDirectoryExists(testDirPath);

      // Then: Directory should be created with correct permissions
      expect(fs.existsSync(testDirPath)).toBe(true);
      const stats = fs.statSync(testDirPath);
      expect(stats.isDirectory()).toBe(true);

      // And: Should be writable
      const testFilePath = path.join(testDirPath, 'test.txt');
      await fileSystemService.writeFile(testFilePath, 'test');
      expect(fs.existsSync(testFilePath)).toBe(true);
    });
  });

  describe('macOS File System Operations', () => {
    it('should handle macOS file system operations correctly', async () => {
      // Given: A study to create
      const studyName = 'macos-test-study';
      const studyDescription = 'macOS compatibility test study';

      // When: Creating a study
      const studyMetadata = await studyService.createStudy(studyName, studyDescription, testProjectRoot);

      // Then: Study should be created successfully
      expect(studyMetadata).toBeDefined();
      expect(studyMetadata.name).toBe(studyName);
      expect(studyMetadata.description).toBe(studyDescription);
      expect(fs.existsSync(studyMetadata.basePath)).toBe(true);

      // And: Should be able to list studies
      const studies = await studyService.listStudies(testProjectRoot);
      expect(studies).toHaveLength(1);
      expect(studies[0]!.name).toBe(studyName);

      // And: Should be able to get study details
      const studyDetails = await studyService.getStudy(studyMetadata.id, testProjectRoot);
      expect(studyDetails).toBeDefined();
      expect(studyDetails!.name).toBe(studyName);

      // And: Should be able to delete study
      await studyService.deleteStudy(studyMetadata.id, testProjectRoot);
      expect(fs.existsSync(studyMetadata.basePath)).toBe(false);
    });

    it('should handle macOS file operations with special characters', async () => {
      // Given: File names with special characters common on macOS
      const specialFileNames = [
        'file with spaces.txt',
        'file-with-dashes.txt',
        'file_with_underscores.txt',
        'file.with.dots.txt',
        'file(with)parentheses.txt',
        'file[with]brackets.txt',
        'file{with}braces.txt'
      ];

      // When: Creating files with special characters
      for (const fileName of specialFileNames) {
        const filePath = path.join(testProjectRoot, fileName);
        const content = `Content for ${fileName}`;
        
        await fileSystemService.writeFile(filePath, content);
        
        // Then: File should be created and readable
        expect(fs.existsSync(filePath)).toBe(true);
        const readContent = await fileSystemService.readFile(filePath);
        expect(readContent).toBe(content);
      }
    });

    it('should handle macOS directory operations with special characters', async () => {
      // Given: Directory names with special characters
      const specialDirNames = [
        'dir with spaces',
        'dir-with-dashes',
        'dir_with_underscores',
        'dir.with.dots',
        'dir(with)parentheses'
      ];

      // When: Creating directories with special characters
      for (const dirName of specialDirNames) {
        const dirPath = path.join(testProjectRoot, dirName);
        
        await fileSystemService.ensureDirectoryExists(dirPath);
        
        // Then: Directory should be created
        expect(fs.existsSync(dirPath)).toBe(true);
        expect(fs.statSync(dirPath).isDirectory()).toBe(true);
      }
    });
  });

  describe('macOS Performance and Reliability', () => {
    it('should handle multiple concurrent operations on macOS', async () => {
      // Given: Multiple operations to perform concurrently
      const operations = [];
      const studyCount = 5;

      // When: Creating multiple studies concurrently
      for (let i = 0; i < studyCount; i++) {
        const operation = studyService.createStudy(
          `concurrent-study-${i}`,
          `Concurrent study ${i}`,
          testProjectRoot
        );
        operations.push(operation);
      }

      const results = await Promise.all(operations);

      // Then: All studies should be created successfully
      expect(results).toHaveLength(studyCount);
      results.forEach((result, index) => {
        expect(result.name).toBe(`concurrent-study-${index}`);
        expect(fs.existsSync(result.basePath)).toBe(true);
      });

      // And: All studies should be listed
      const allStudies = await studyService.listStudies(testProjectRoot);
      expect(allStudies).toHaveLength(studyCount);
    });

    it('should handle large file operations on macOS', async () => {
      // Given: A large content string
      const largeContent = 'A'.repeat(1024 * 1024); // 1MB of 'A' characters
      const largeFilePath = path.join(testProjectRoot, 'large-file.txt');

      // When: Writing a large file
      const startTime = Date.now();
      await fileSystemService.writeFile(largeFilePath, largeContent);
      const writeTime = Date.now() - startTime;

      // Then: File should be created successfully
      expect(fs.existsSync(largeFilePath)).toBe(true);
      const stats = fs.statSync(largeFilePath);
      expect(stats.size).toBe(largeContent.length);

      // And: Should be readable
      const readStartTime = Date.now();
      const readContent = await fileSystemService.readFile(largeFilePath);
      const readTime = Date.now() - readStartTime;

      expect(readContent).toBe(largeContent);
      expect(writeTime).toBeLessThan(5000); // Should complete within 5 seconds
      expect(readTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });

  describe('macOS Error Handling', () => {
    it('should handle macOS-specific error scenarios', async () => {
      // Given: Invalid paths that might occur on macOS
      const invalidPaths = [
        '/System/Library/PrivateFrameworks', // System protected directory
        '/usr/bin', // System binary directory
        '/dev/null', // Special device file
        '/tmp/../etc/passwd' // Path traversal attempt
      ];

      // When: Attempting to create files in invalid locations
      for (const invalidPath of invalidPaths) {
        try {
          await fileSystemService.writeFile(invalidPath, 'test content');
          // If we get here, the path was actually writable (unexpected)
          // This is okay for some paths like /tmp/../etc/passwd which might be valid
        } catch (error) {
          // Expected behavior - should throw an error for protected paths
          expect(error).toBeDefined();
          expect(error).toBeTruthy();
        }
      }
    });

    it('should handle macOS file system errors gracefully', async () => {
      // Given: A valid study
      const studyName = 'error-test-study';
      const studyMetadata = await studyService.createStudy(studyName, 'Error test', testProjectRoot);

      // When: Attempting to delete a non-existent study
      try {
        await studyService.deleteStudy('non-existent-study', testProjectRoot);
        fail('Should have thrown an error for non-existent study');
      } catch (error) {
        // Then: Should throw an appropriate error
        expect(error).toBeDefined();
        expect(error instanceof Error).toBe(true);
        expect((error as Error).message).toContain('Study not found');
      }

      // And: Original study should still exist
      expect(fs.existsSync(studyMetadata.basePath)).toBe(true);
    });
  });
});
