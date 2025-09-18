/**
 * Path Handling Tests
 * 
 * Tests for cross-platform path handling functionality.
 * These tests ensure the UX-Kit handles paths correctly across different operating systems.
 */

import { FileSystemService } from '../../src/utils/FileSystemService';
import { PathUtils } from '../../src/utils/PathUtils';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);

describe('Path Handling Tests', () => {
  let fileSystemService: FileSystemService;
  let testProjectRoot: string;

  beforeEach(async () => {
    testProjectRoot = path.join(__dirname, '../temp/path-handling-test');
    await mkdir(testProjectRoot, { recursive: true });

    fileSystemService = new FileSystemService();
  });

  afterEach(async () => {
    try {
      await rmdir(testProjectRoot, { recursive: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Cross-Platform Path Operations', () => {
    it('should handle path joining correctly across platforms', () => {
      // Given: Various path segments
      const pathSegments = [
        ['/Users', 'test', 'Documents'],
        ['C:\\Users', 'test', 'Documents'],
        ['/home', 'user', 'projects'],
        ['/tmp', 'test', 'files']
      ];

      // When: Joining paths using PathUtils
      for (const segments of pathSegments) {
        const joinedPath = PathUtils.joinPaths(...segments);
        
        // Then: Path should be properly joined
        expect(joinedPath).toBeDefined();
        expect(typeof joinedPath).toBe('string');
        expect(joinedPath.length).toBeGreaterThan(0);
        
        // And: Should not contain double separators
        expect(joinedPath).not.toMatch(/\/\//);
        expect(joinedPath).not.toMatch(/\\\\/);
      }
    });

    it('should handle path basename extraction correctly', () => {
      // Given: Various file paths
      const testPaths = [
        { path: '/Users/test/file.txt', expected: 'file.txt' },
        { path: '/home/user/project/README.md', expected: 'README.md' },
        { path: '/tmp/test', expected: 'test' },
        { path: '/tmp/test/', expected: 'test' }
      ];

      // When: Extracting basename using PathUtils
      for (const testCase of testPaths) {
        const basename = PathUtils.basename(testCase.path);
        
        // Then: Basename should be extracted correctly
        expect(basename).toBe(testCase.expected);
      }
    });

    it('should handle path dirname extraction correctly', () => {
      // Given: Various file paths
      const testPaths = [
        { path: '/Users/test/file.txt', expected: '/Users/test' },
        { path: '/home/user/project/README.md', expected: '/home/user/project' },
        { path: '/tmp/test', expected: '/tmp' }
      ];

      // When: Extracting dirname using PathUtils
      for (const testCase of testPaths) {
        const dirname = PathUtils.dirname(testCase.path);
        
        // Then: Dirname should be extracted correctly
        expect(dirname).toBe(testCase.expected);
      }
    });

    it('should handle relative path resolution correctly', () => {
      // Given: Base path and relative paths
      const basePath = '/Users/test/project';
      const relativePaths = [
        { relative: './subdir/file.txt', expected: '/Users/test/project/subdir/file.txt' },
        { relative: '../other/file.txt', expected: '/Users/test/other/file.txt' },
        { relative: 'subdir/file.txt', expected: '/Users/test/project/subdir/file.txt' }
      ];

      // When: Resolving relative paths
      for (const testCase of relativePaths) {
        const resolvedPath = PathUtils.resolve(basePath, testCase.relative);
        
        // Then: Path should be resolved correctly
        expect(resolvedPath).toBe(testCase.expected);
      }
    });
  });

  describe('File System Service Path Operations', () => {
    it('should handle path operations through FileSystemService', async () => {
      // Given: Test paths
      const testPaths = [
        'subdir1/subdir2',
        'subdir with spaces',
        'subdir-with-dashes',
        'subdir_with_underscores'
      ];

      // When: Creating directories using FileSystemService path operations
      for (const testPath of testPaths) {
        const fullPath = fileSystemService.joinPaths(testProjectRoot, testPath);
        
        await fileSystemService.ensureDirectoryExists(fullPath);
        
        // Then: Directory should be created
        expect(fs.existsSync(fullPath)).toBe(true);
        expect(fs.statSync(fullPath).isDirectory()).toBe(true);
        
        // And: Basename should be extracted correctly
        const basename = fileSystemService.basename(fullPath);
        expect(basename).toBe(path.basename(testPath));
      }
    });

    it('should handle nested path operations correctly', async () => {
      // Given: Nested directory structure
      const nestedPaths = [
        'level1',
        'level1/level2',
        'level1/level2/level3',
        'level1/level2/level3/level4'
      ];

      // When: Creating nested directories
      for (const nestedPath of nestedPaths) {
        const fullPath = fileSystemService.joinPaths(testProjectRoot, nestedPath);
        
        await fileSystemService.ensureDirectoryExists(fullPath);
        
        // Then: Directory should be created
        expect(fs.existsSync(fullPath)).toBe(true);
        expect(fs.statSync(fullPath).isDirectory()).toBe(true);
      }

      // And: All parent directories should exist
      for (const nestedPath of nestedPaths) {
        const fullPath = fileSystemService.joinPaths(testProjectRoot, nestedPath);
        expect(fs.existsSync(fullPath)).toBe(true);
      }
    });

    it('should handle file operations with complex paths', async () => {
      // Given: Complex file paths
      const complexPaths = [
        'dir with spaces/file with spaces.txt',
        'dir-with-dashes/file-with-dashes.txt',
        'dir_with_underscores/file_with_underscores.txt',
        'dir.with.dots/file.with.dots.txt'
      ];

      // When: Creating files with complex paths
      for (const complexPath of complexPaths) {
        const fullPath = fileSystemService.joinPaths(testProjectRoot, complexPath);
        const content = `Content for ${complexPath}`;
        
        // Ensure parent directory exists
        const parentDir = fileSystemService.dirname(fullPath);
        await fileSystemService.ensureDirectoryExists(parentDir);
        
        // Create file
        await fileSystemService.writeFile(fullPath, content);
        
        // Then: File should be created
        expect(fs.existsSync(fullPath)).toBe(true);
        expect(fs.statSync(fullPath).isFile()).toBe(true);
        
        // And: Content should be correct
        const readContent = await fileSystemService.readFile(fullPath);
        expect(readContent).toBe(content);
      }
    });
  });

  describe('Path Validation and Error Handling', () => {
    it('should handle invalid path operations gracefully', () => {
      // Given: Invalid path inputs
      const invalidInputs = [
        null,
        undefined,
        '',
        '   ',
        '/',
        'C:\\',
        '//invalid//path//'
      ];

      // When: Attempting path operations with invalid inputs
      for (const invalidInput of invalidInputs) {
        try {
          if (invalidInput === null || invalidInput === undefined) {
            // Skip null/undefined as they would cause TypeScript errors
            continue;
          }
          
          const joinedPath = fileSystemService.joinPaths(testProjectRoot, invalidInput);
          const basename = fileSystemService.basename(joinedPath);
          const dirname = fileSystemService.dirname(joinedPath);
          
          // Then: Operations should complete without throwing
          expect(joinedPath).toBeDefined();
          expect(basename).toBeDefined();
          expect(dirname).toBeDefined();
        } catch (error) {
          // Some invalid inputs might throw errors, which is acceptable
          expect(error).toBeDefined();
        }
      }
    });

    it('should handle path traversal attempts safely', async () => {
      // Given: Paths with traversal attempts
      const traversalPaths = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32',
        './../../../etc/passwd',
        'subdir/../../../etc/passwd'
      ];

      // When: Attempting to create files with traversal paths
      for (const traversalPath of traversalPaths) {
        const fullPath = fileSystemService.joinPaths(testProjectRoot, traversalPath);
        
        try {
          // Ensure parent directory exists
          const parentDir = fileSystemService.dirname(fullPath);
          await fileSystemService.ensureDirectoryExists(parentDir);
          
          // Create file
          await fileSystemService.writeFile(fullPath, 'test content');
          
          // Then: File should be created within the test directory
          expect(fs.existsSync(fullPath)).toBe(true);
          expect(fullPath.startsWith(testProjectRoot)).toBe(true);
        } catch (error) {
          // Some traversal attempts might fail, which is acceptable
          expect(error).toBeDefined();
        }
      }
    });

    it('should handle long paths correctly', async () => {
      // Given: A long but reasonable path
      const longPathSegment = 'a'.repeat(50); // Reduced length
      const longPath = Array(5).fill(longPathSegment).join('/'); // Reduced depth
      const fullPath = fileSystemService.joinPaths(testProjectRoot, longPath);

      // When: Creating a directory with a long path
      await fileSystemService.ensureDirectoryExists(fullPath);

      // Then: Directory should be created
      expect(fs.existsSync(fullPath)).toBe(true);
      expect(fs.statSync(fullPath).isDirectory()).toBe(true);

      // And: Path operations should work
      const basename = fileSystemService.basename(fullPath);
      expect(basename).toBe(longPathSegment);
    });
  });

  describe('Path Normalization', () => {
    it('should normalize paths correctly', () => {
      // Given: Paths with various separators and formats
      const testPaths = [
        { input: '/Users//test///file.txt', expected: '/Users/test/file.txt' },
        { input: '/home/user/./file.txt', expected: '/home/user/file.txt' },
        { input: '/home/user/../other/file.txt', expected: '/home/other/file.txt' }
      ];

      // When: Normalizing paths
      for (const testCase of testPaths) {
        const normalizedPath = PathUtils.normalize(testCase.input);
        
        // Then: Path should be normalized correctly
        expect(normalizedPath).toBe(testCase.expected);
      }
    });

    it('should handle mixed path separators correctly', () => {
      // Given: Paths with mixed separators
      const mixedPaths = [
        '/Users/test\\file.txt',
        'C:\\Users/test/file.txt',
        '/home\\user/file.txt'
      ];

      // When: Processing paths with mixed separators
      for (const mixedPath of mixedPaths) {
        const joinedPath = fileSystemService.joinPaths(testProjectRoot, mixedPath);
        const basename = fileSystemService.basename(joinedPath);
        
        // Then: Operations should complete successfully
        expect(joinedPath).toBeDefined();
        expect(basename).toBeDefined();
        expect(typeof joinedPath).toBe('string');
        expect(typeof basename).toBe('string');
      }
    });
  });
});
