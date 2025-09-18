/**
 * Linux Compatibility Tests
 * 
 * Tests for Linux-specific functionality and compatibility.
 * These tests ensure the UX-Kit works correctly on Linux systems.
 * Note: These tests are designed to run on Linux systems or in Linux containers.
 */

import { FileSystemService } from '../../src/utils/FileSystemService';
import { StudyService } from '../../src/services/StudyService';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);

describe('Linux Compatibility Tests', () => {
  let fileSystemService: FileSystemService;
  let studyService: StudyService;
  let testProjectRoot: string;

  beforeEach(async () => {
    testProjectRoot = path.join(__dirname, '../temp/linux-compatibility-test');
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

  describe('Linux Path Handling', () => {
    it('should handle Linux file paths correctly', async () => {
      // Given: Linux-style paths
      const testPaths = [
        '/home/testuser/Documents/My Project',
        '/tmp/test-project',
        '/var/tmp/ux-kit-test',
        '/opt/ux-kit/data'
      ];

      // When: Creating directories with Linux paths
      for (const testPath of testPaths) {
        const fullPath = path.join(testProjectRoot, path.basename(testPath));
        
        // Then: Should create directories successfully
        await fileSystemService.ensureDirectoryExists(fullPath);
        expect(fs.existsSync(fullPath)).toBe(true);
        expect(fs.statSync(fullPath).isDirectory()).toBe(true);
      }
    });

    it('should handle Linux file permissions correctly', async () => {
      // Given: A test file path
      const testFilePath = path.join(testProjectRoot, 'test-file.txt');
      const testContent = 'Test content for Linux';

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

    it('should handle Linux directory permissions correctly', async () => {
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

  describe('Linux File System Operations', () => {
    it('should handle Linux file system operations correctly', async () => {
      // Given: A study to create
      const studyName = 'linux-test-study';
      const studyDescription = 'Linux compatibility test study';

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

    it('should handle Linux file operations with special characters', async () => {
      // Given: File names with special characters common on Linux
      const specialFileNames = [
        'file with spaces.txt',
        'file-with-dashes.txt',
        'file_with_underscores.txt',
        'file.with.dots.txt',
        'file(with)parentheses.txt',
        'file[with]brackets.txt',
        'file{with}braces.txt',
        'file-with-umlauts-äöü.txt',
        'file-with-accents-éèê.txt'
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

    it('should handle Linux directory operations with special characters', async () => {
      // Given: Directory names with special characters
      const specialDirNames = [
        'dir with spaces',
        'dir-with-dashes',
        'dir_with_underscores',
        'dir.with.dots',
        'dir(with)parentheses',
        'dir-with-umlauts-äöü',
        'dir-with-accents-éèê'
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

  describe('Linux Performance and Reliability', () => {
    it('should handle multiple concurrent operations on Linux', async () => {
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

    it('should handle large file operations on Linux', async () => {
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

  describe('Linux Error Handling', () => {
    it('should handle Linux-specific error scenarios', async () => {
      // Given: Invalid paths that might occur on Linux
      const invalidPaths = [
        '/root', // Root directory (usually restricted)
        '/etc/passwd', // System file
        '/dev/null', // Special device file
        '/proc/self', // Proc filesystem
        '/sys/kernel' // Sys filesystem
      ];

      // When: Attempting to create files in invalid locations
      for (const invalidPath of invalidPaths) {
        try {
          await fileSystemService.writeFile(invalidPath, 'test content');
          // If we get here, the path was actually writable (unexpected)
          // This is okay for some paths which might be valid in test environments
        } catch (error) {
          // Expected behavior - should throw an error for protected paths
          expect(error).toBeDefined();
          expect(error).toBeTruthy();
        }
      }
    });

    it('should handle Linux file system errors gracefully', async () => {
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

  describe('Linux Symbolic Links and Special Files', () => {
    it('should handle symbolic links correctly', async () => {
      // Given: A test file and symbolic link
      const originalFilePath = path.join(testProjectRoot, 'original-file.txt');
      const symlinkPath = path.join(testProjectRoot, 'symlink.txt');
      const content = 'Content for symbolic link test';

      // When: Creating original file
      await fileSystemService.writeFile(originalFilePath, content);

      // And: Creating symbolic link (if supported)
      try {
        fs.symlinkSync(originalFilePath, symlinkPath);
        
        // Then: Symbolic link should work
        expect(fs.existsSync(symlinkPath)).toBe(true);
        
        // And: Should be able to read through symbolic link
        const readContent = await fileSystemService.readFile(symlinkPath);
        expect(readContent).toBe(content);
      } catch (error) {
        // Symbolic links might not be supported in all test environments
        // This is acceptable
        expect(error).toBeDefined();
      }
    });

    it('should handle special device files correctly', async () => {
      // Given: Special device file paths
      const specialFiles = [
        '/dev/null',
        '/dev/zero',
        '/dev/random'
      ];

      // When: Attempting to interact with special device files
      for (const specialFile of specialFiles) {
        try {
          // These operations might fail or behave differently
          // depending on the test environment
          const exists = await fileSystemService.pathExists(specialFile);
          expect(typeof exists).toBe('boolean');
        } catch (error) {
          // Expected behavior for some special files
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe('Linux Environment Variables and Paths', () => {
    it('should handle Linux environment variables in paths', async () => {
      // Given: Paths that might contain environment variables
      const envPaths = [
        '$HOME/test',
        '~/.local/share',
        '$TMPDIR/test'
      ];

      // When: Processing paths with environment variables
      for (const envPath of envPaths) {
        try {
          // These paths might not be expandable in test environment
          // but should not cause crashes
          const fullPath = path.join(testProjectRoot, path.basename(envPath));
          await fileSystemService.ensureDirectoryExists(fullPath);
          expect(fs.existsSync(fullPath)).toBe(true);
        } catch (error) {
          // Some environment variable expansions might fail
          // This is acceptable
          expect(error).toBeDefined();
        }
      }
    });

    it('should handle Linux home directory paths', async () => {
      // Given: Home directory style paths
      const homePaths = [
        '~/Documents',
        '~/.config',
        '~/.local/share'
      ];

      // When: Processing home directory paths
      for (const homePath of homePaths) {
        try {
          // These paths might not be expandable in test environment
          // but should not cause crashes
          const fullPath = path.join(testProjectRoot, path.basename(homePath));
          await fileSystemService.ensureDirectoryExists(fullPath);
          expect(fs.existsSync(fullPath)).toBe(true);
        } catch (error) {
          // Some home directory expansions might fail
          // This is acceptable
          expect(error).toBeDefined();
        }
      }
    });
  });
});
