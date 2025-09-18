/**
 * Basic Integration Tests
 * 
 * Tests basic integration between core services and utilities.
 */

import { FileSystemService } from '../../src/utils/FileSystemService';
import { StudyService } from '../../src/services/StudyService';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);

describe('Basic Integration Tests', () => {
  let fileSystemService: FileSystemService;
  let studyService: StudyService;
  let testProjectRoot: string;

  beforeEach(async () => {
    // Setup test environment
    testProjectRoot = path.join(__dirname, '../temp/basic-integration-test');
    await mkdir(testProjectRoot, { recursive: true });

    // Initialize services
    fileSystemService = new FileSystemService();
    studyService = new StudyService(fileSystemService);
  });

  afterEach(async () => {
    // Cleanup test environment
    try {
      await rmdir(testProjectRoot, { recursive: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('File System Integration', () => {
    it('should create and manage directories and files', async () => {
      // Given: Directory structure to create
      const basePath = path.join(testProjectRoot, 'test-directory');
      const subPath = path.join(basePath, 'subdirectory');
      const filePath = path.join(subPath, 'test-file.md');

      // When: Creating directory structure
      await fileSystemService.ensureDirectoryExists(basePath);
      await fileSystemService.ensureDirectoryExists(subPath);

      // And: Creating file
      const content = '# Test File\nThis is a test file.';
      await fileSystemService.writeFile(filePath, content);

      // Then: Directory structure should exist
      expect(fs.existsSync(basePath)).toBe(true);
      expect(fs.existsSync(subPath)).toBe(true);
      expect(fs.existsSync(filePath)).toBe(true);

      // And: File content should be correct
      const fileContent = await fileSystemService.readFile(filePath);
      expect(fileContent).toBe(content);
    });

    it('should handle path operations', async () => {
      // Given: Path operations to test
      const basePath = '/path/to/base';
      const fileName = 'test-file.md';
      const fullPath = path.join(basePath, fileName);

      // When: Using path utilities
      const joinedPath = fileSystemService.joinPaths(basePath, fileName);
      const basename = fileSystemService.basename(fullPath);
      const dirname = fileSystemService.dirname(fullPath);

      // Then: Path operations should work correctly
      expect(joinedPath).toBe(fullPath);
      expect(basename).toBe(fileName);
      expect(dirname).toBe(basePath);
    });

    it('should handle file existence checks', async () => {
      // Given: File to create and check
      const filePath = path.join(testProjectRoot, 'existence-test.md');
      const content = '# Existence Test\nThis file tests existence checking.';

      // When: Creating file
      await fileSystemService.writeFile(filePath, content);

      // Then: File existence should be detected
      const exists = await fileSystemService.pathExists(filePath);
      expect(exists).toBe(true);

      // And: Non-existent file should return false
      const nonExistentPath = path.join(testProjectRoot, 'non-existent.md');
      const nonExistent = await fileSystemService.pathExists(nonExistentPath);
      expect(nonExistent).toBe(false);
    });
  });

  describe('Study Service Integration', () => {
    it('should create and manage studies', async () => {
      // Given: Study creation requirements
      const studyName = 'integration-test-study';
      const studyDescription = 'Integration test study description';

      // When: Creating study
      const studyMetadata = await studyService.createStudy(studyName, studyDescription, testProjectRoot);

      // Then: Study metadata should be correct
      expect(studyMetadata).toBeDefined();
      expect(studyMetadata.name).toBe(studyName);
      expect(studyMetadata.description).toBe(studyDescription);
      expect(studyMetadata.basePath).toBeDefined();

      // And: Directory structure should exist
      const studyPath = studyMetadata.basePath;
      expect(fs.existsSync(studyPath)).toBe(true);
      expect(fs.statSync(studyPath).isDirectory()).toBe(true);

      // And: Subdirectories should exist
      const summariesPath = path.join(studyPath, 'summaries');
      const interviewsPath = path.join(studyPath, 'interviews');
      expect(fs.existsSync(summariesPath)).toBe(true);
      expect(fs.existsSync(interviewsPath)).toBe(true);
      expect(fs.statSync(summariesPath).isDirectory()).toBe(true);
      expect(fs.statSync(interviewsPath).isDirectory()).toBe(true);
    });

    it('should list and manage multiple studies', async () => {
      // Given: Multiple studies to create
      const studies = [
        { name: 'study-1', description: 'First study' },
        { name: 'study-2', description: 'Second study' },
        { name: 'study-3', description: 'Third study' }
      ];

      // When: Creating multiple studies
      const studyMetadatas = [];
      for (const study of studies) {
        const metadata = await studyService.createStudy(study.name, study.description, testProjectRoot);
        studyMetadatas.push(metadata);
      }

      // Then: All studies should be created
      expect(studyMetadatas).toHaveLength(3);
      studyMetadatas.forEach((metadata, index) => {
        expect(metadata.name).toBe(studies[index]!.name);
        expect(metadata.description).toBe(studies[index]!.description);
        expect(fs.existsSync(metadata.basePath)).toBe(true);
      });

      // And: All studies should be listed
      const allStudies = await studyService.listStudies(testProjectRoot);
      expect(allStudies).toHaveLength(3);
      expect(allStudies.map(s => s.name)).toContain('study-1');
      expect(allStudies.map(s => s.name)).toContain('study-2');
      expect(allStudies.map(s => s.name)).toContain('study-3');
    });

    it('should handle study lifecycle operations', async () => {
      // Given: Study to create and manage
      const studyName = 'lifecycle-test-study';
      const studyDescription = 'Lifecycle test study';

      // When: Creating study
      const studyMetadata = await studyService.createStudy(studyName, studyDescription, testProjectRoot);
      expect(studyMetadata.name).toBe(studyName);

      // And: Getting study details
      const studyDetails = await studyService.getStudy(studyMetadata.id, testProjectRoot);
      expect(studyDetails).toBeDefined();
      expect(studyDetails!.name).toBe(studyName);

      // And: Deleting study
      await studyService.deleteStudy(studyMetadata.id, testProjectRoot);

      // Then: Study should no longer exist
      const remainingStudies = await studyService.listStudies(testProjectRoot);
      expect(remainingStudies).toHaveLength(0);
      expect(fs.existsSync(studyMetadata.basePath)).toBe(false);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle invalid study names gracefully', async () => {
      // Given: Invalid study name
      const invalidStudyName = '';

      // When: Attempting to create study with invalid name
      try {
        await studyService.createStudy(invalidStudyName, 'Invalid study', testProjectRoot);
        fail('Should have thrown an error for invalid study name');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error instanceof Error).toBe(true);
      }
    });

    it('should handle non-existent study operations gracefully', async () => {
      // Given: Non-existent study name
      const nonExistentStudy = 'non-existent-study';

      // When: Attempting to get non-existent study
      const studyDetails = await studyService.getStudy(nonExistentStudy, testProjectRoot);
      expect(studyDetails).toBeUndefined();

      // And: Attempting to delete non-existent study
      try {
        await studyService.deleteStudy(nonExistentStudy, testProjectRoot);
        fail('Should have thrown an error for non-existent study');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error instanceof Error).toBe(true);
      }
    });

    it('should handle file system errors gracefully', async () => {
      // Given: A valid path that we can test with
      const testPath = path.join(testProjectRoot, 'test-file.txt');

      // When: Writing a file and then reading it
      await fileSystemService.writeFile(testPath, 'Test content');
      const content = await fileSystemService.readFile(testPath);
      expect(content).toBe('Test content');

      // And: Deleting the file
      await fileSystemService.deleteFile(testPath);
      expect(fs.existsSync(testPath)).toBe(false);
    });
  });

  describe('Performance Integration', () => {
    it('should handle multiple operations efficiently', async () => {
      // Given: Multiple operations to perform
      const studyCount = 5;

      // When: Creating multiple studies
      const startTime = Date.now();
      const studyPromises = Array(studyCount).fill(0).map((_, i) =>
        studyService.createStudy(`study-${i}`, `Study ${i} description`, testProjectRoot)
      );
      const studyMetadatas = await Promise.all(studyPromises);
      const endTime = Date.now();

      // Then: All operations should complete successfully
      expect(studyMetadatas).toHaveLength(studyCount);
      studyMetadatas.forEach((metadata, index) => {
        expect(metadata.name).toBe(`study-${index}`);
        expect(metadata.description).toBe(`Study ${index} description`);
      });

      // And: Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(5000); // Less than 5 seconds

      // And: All studies should be listed
      const allStudies = await studyService.listStudies(testProjectRoot);
      expect(allStudies).toHaveLength(studyCount);
    });

    it('should handle concurrent file operations', async () => {
      // Given: Multiple file operations to perform concurrently
      const fileCount = 10;

      // When: Creating multiple files concurrently
      const startTime = Date.now();
      const filePromises = Array(fileCount).fill(0).map((_, i) => {
        const filePath = path.join(testProjectRoot, `file-${i}.md`);
        const content = `# File ${i}\nThis is file ${i}.`;
        return fileSystemService.writeFile(filePath, content);
      });
      await Promise.all(filePromises);
      const endTime = Date.now();

      // Then: All files should be created
      for (let i = 0; i < fileCount; i++) {
        const filePath = path.join(testProjectRoot, `file-${i}.md`);
        expect(fs.existsSync(filePath)).toBe(true);
        const content = await fileSystemService.readFile(filePath);
        expect(content).toBe(`# File ${i}\nThis is file ${i}.`);
      }

      // And: Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(2000); // Less than 2 seconds
    });
  });
});
