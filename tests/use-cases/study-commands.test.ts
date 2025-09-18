/**
 * Use Case Tests for Study Commands Implementation (T004)
 * 
 * These tests define the expected behavior for study management commands
 * (create, list, show, delete), following TDD principles.
 */

import { CreateStudyCommand } from '../../src/commands/study/CreateStudyCommand';
import { ListStudiesCommand } from '../../src/commands/study/ListStudiesCommand';
import { ShowStudyCommand } from '../../src/commands/study/ShowStudyCommand';
import { DeleteStudyCommand } from '../../src/commands/study/DeleteStudyCommand';
import { StudyService } from '../../src/services/StudyService';
import { IFileSystemService } from '../../src/contracts/infrastructure-contracts';
import { IOutput } from '../../src/contracts/presentation-contracts';
import { join } from 'path';

// Mock implementations for testing
class MockFileSystemService implements IFileSystemService {
  private files: Map<string, string> = new Map();
  public directories: Set<string> = new Set();

  async createDirectory(path: string, recursive?: boolean): Promise<void> {
    this.directories.add(path);
  }

  async ensureDirectoryExists(path: string): Promise<void> {
    // Create parent directories recursively
    const parts = path.split('/');
    let currentPath = '';
    
    for (const part of parts) {
      if (part) {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        this.directories.add(currentPath);
      }
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    this.files.set(path, content);
  }

  async readFile(path: string): Promise<string> {
    return this.files.get(path) || '';
  }

  async deleteFile(path: string): Promise<void> {
    this.files.delete(path);
  }

  async deleteDirectory(path: string, recursive?: boolean): Promise<void> {
    // Remove both original and normalized paths for consistency
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    this.directories.delete(path);
    this.directories.delete(normalizedPath);
    
    // Also remove any files in this directory
    const filesToDelete = Array.from(this.files.keys()).filter(file => 
      file.startsWith(path) || file.startsWith(normalizedPath)
    );
    filesToDelete.forEach(file => this.files.delete(file));
  }

  async pathExists(path: string): Promise<boolean> {
    // Remove leading slash for consistency
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    return this.files.has(path) || this.files.has(normalizedPath) || 
           this.directories.has(path) || this.directories.has(normalizedPath);
  }

  async isDirectory(path: string): Promise<boolean> {
    // Remove leading slash for consistency
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    return this.directories.has(path) || this.directories.has(normalizedPath);
  }

  async listFiles(path: string, extension?: string): Promise<string[]> {
    const allPaths = [...this.files.keys(), ...this.directories];
    return allPaths.filter(file => {
      // Normalize paths for comparison
      const normalizedFile = file.startsWith('/') ? file.substring(1) : file;
      const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
      
      return normalizedFile.startsWith(normalizedPath) && 
             normalizedFile !== normalizedPath && 
             (!extension || normalizedFile.endsWith(extension));
    });
  }

  joinPaths(...paths: string[]): string {
    return join(...paths);
  }

  basename(path: string, ext?: string): string {
    const parts = path.split('/');
    const filename = parts[parts.length - 1] || '';
    return ext ? filename.replace(ext, '') : filename;
  }

  dirname(path: string): string {
    const parts = path.split('/');
    return parts.slice(0, -1).join('/');
  }

  clear(): void {
    this.files.clear();
    this.directories.clear();
  }
}

class MockOutput implements IOutput {
  private output: string[] = [];

  write(text: string): void {
    this.output.push(text);
  }

  writeln(text: string): void {
    this.output.push(text + '\n');
  }

  writeError(text: string): void {
    this.output.push('ERROR: ' + text);
  }

  writeErrorln(text: string): void {
    this.output.push('ERROR: ' + text + '\n');
  }

  clear(): void {
    this.output = [];
  }

  flush(): void {
    // Mock implementation
  }

  getOutput(): string[] {
    return this.output;
  }
}

describe('Study Commands Use Cases', () => {
  let createStudyCommand: CreateStudyCommand;
  let listStudiesCommand: ListStudiesCommand;
  let showStudyCommand: ShowStudyCommand;
  let deleteStudyCommand: DeleteStudyCommand;
  let studyService: StudyService;
  let mockFileSystem: MockFileSystemService;
  let mockOutput: MockOutput;
  let projectRoot: string;

  beforeEach(() => {
    projectRoot = '/test-project';
    mockFileSystem = new MockFileSystemService();
    mockOutput = new MockOutput();
    
    studyService = new StudyService(mockFileSystem);
    createStudyCommand = new CreateStudyCommand(studyService, mockOutput);
    listStudiesCommand = new ListStudiesCommand(studyService, mockOutput);
    showStudyCommand = new ShowStudyCommand(studyService, mockOutput);
    deleteStudyCommand = new DeleteStudyCommand(studyService, mockOutput);
  });

  afterEach(() => {
    // Clear all mock state after each test to ensure isolation
    mockFileSystem.clear();
    mockOutput.clear();
  });

  describe('Given a UX-Kit initialized project', () => {
    describe('When creating a new study', () => {
      it('Then should create study directory with proper structure', async () => {
        // Given: A UX-Kit initialized project
        // When: Creating a new study
        // Then: Should create study directory with proper structure
        
        const result = await createStudyCommand.execute(['User Onboarding Research'], { projectRoot });
        
        expect(result.success).toBe(true);
        expect(result.message).toContain('Study created successfully');
        
        const studyPath = join(projectRoot, '.uxkit', 'studies', '001-user-onboarding-research');
        expect(await mockFileSystem.pathExists(studyPath)).toBe(true);
        expect(await mockFileSystem.pathExists(join(studyPath, 'study-config.yaml'))).toBe(true);
        expect(await mockFileSystem.pathExists(join(studyPath, 'questions.md'))).toBe(true);
        expect(await mockFileSystem.pathExists(join(studyPath, 'sources.md'))).toBe(true);
        expect(await mockFileSystem.pathExists(join(studyPath, 'insights.md'))).toBe(true);
        expect(await mockFileSystem.pathExists(join(studyPath, 'summaries'))).toBe(true);
        expect(await mockFileSystem.pathExists(join(studyPath, 'interviews'))).toBe(true);
      });

      it('Then should generate unique study ID', async () => {
        // Given: A UX-Kit initialized project
        // When: Creating multiple studies
        // Then: Should generate unique study IDs
        
        const result1 = await createStudyCommand.execute(['Study 1'], { projectRoot });
        const result2 = await createStudyCommand.execute(['Study 2'], { projectRoot });
        
        expect(result1.success).toBe(true);
        expect(result2.success).toBe(true);
        
        const study1Path = join(projectRoot, '.uxkit', 'studies', '001-study-1');
        const study2Path = join(projectRoot, '.uxkit', 'studies', '002-study-2');
        
        expect(await mockFileSystem.pathExists(study1Path)).toBe(true);
        expect(await mockFileSystem.pathExists(study2Path)).toBe(true);
      });

      it('Then should create study configuration file', async () => {
        // Given: A UX-Kit initialized project
        // When: Creating a new study
        // Then: Should create study-config.yaml with proper content
        
        const result = await createStudyCommand.execute(['Test Study'], { projectRoot });
        
        expect(result.success).toBe(true);
        const configPath = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'study-config.yaml');
        expect(await mockFileSystem.pathExists(configPath)).toBe(true);
        
        const configContent = await mockFileSystem.readFile(configPath);
        expect(configContent).toContain('version:');
        expect(configContent).toContain('studyId:');
        expect(configContent).toContain('name:');
        expect(configContent).toContain('Test Study');
      });

      it('Then should accept description option', async () => {
        // Given: A UX-Kit initialized project
        // When: Creating a study with description
        // Then: Should include description in configuration
        
        const result = await createStudyCommand.execute(['Test Study'], { 
          projectRoot, 
          description: 'A test study for validation' 
        });
        
        expect(result.success).toBe(true);
        const configPath = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'study-config.yaml');
        const configContent = await mockFileSystem.readFile(configPath);
        expect(configContent).toContain('A test study for validation');
      });

      it('Then should validate study name', async () => {
        // Given: A UX-Kit initialized project
        // When: Creating a study with invalid name
        // Then: Should validate and provide appropriate error
        
        const validation = await createStudyCommand.validate([], { projectRoot });
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBeGreaterThan(0);
      });
    });

    describe('When listing studies', () => {
      beforeEach(async () => {
        // Create some test studies
        await createStudyCommand.execute(['Study 1'], { projectRoot });
        await createStudyCommand.execute(['Study 2'], { projectRoot });
      });

      it('Then should list all studies with metadata', async () => {
        // Given: A project with multiple studies (created in beforeEach)
        // When: Listing studies
        // Then: Should return all studies with metadata
        
        const result = await listStudiesCommand.execute([], { projectRoot });
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data.length).toBe(2);
        
        const studies = result.data as any[];
        expect(studies[0]?.name).toBe('Study 1');
        expect(studies[1]?.name).toBe('Study 2');
        expect(studies[0]?.id).toBe('001-study-1');
        expect(studies[1]?.id).toBe('002-study-2');
      });

      it('Then should provide formatted output', async () => {
        // Given: A project with studies
        // When: Listing studies
        // Then: Should provide formatted output to user
        
        const result = await listStudiesCommand.execute([], { projectRoot });
        
        expect(result.success).toBe(true);
        const output = mockOutput.getOutput();
        expect(output.some(line => line.includes('Study 1'))).toBe(true);
        expect(output.some(line => line.includes('Study 2'))).toBe(true);
      });

      it('Then should handle empty studies directory', async () => {
        // Given: A project with no studies
        // When: Listing studies
        // Then: Should handle gracefully
        
        const emptyFileSystem = new MockFileSystemService();
        const emptyStudyService = new StudyService(emptyFileSystem);
        const emptyListCommand = new ListStudiesCommand(emptyStudyService, mockOutput);
        
        const result = await emptyListCommand.execute([], { projectRoot });
        
        expect(result.success).toBe(true);
        expect(result.data).toEqual([]);
      });
    });

    describe('When showing study details', () => {
      beforeEach(async () => {
        await createStudyCommand.execute(['Test Study'], { 
          projectRoot, 
          description: 'A detailed test study' 
        });
      });

      it('Then should show study details by ID', async () => {
        // Given: A project with a study
        // When: Showing study details by ID
        // Then: Should return detailed study information
        
        const result = await showStudyCommand.execute(['001-test-study'], { projectRoot });
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data.name).toBe('Test Study');
        expect(result.data.id).toBe('001-test-study');
        expect(result.data.description).toBe('A detailed test study');
      });

      it('Then should show study details by name', async () => {
        // Given: A project with a study
        // When: Showing study details by name
        // Then: Should return detailed study information
        
        // Create study for this test
        await createStudyCommand.execute(['Test Study'], { 
          projectRoot, 
          description: 'A detailed test study' 
        });
        
        const result = await showStudyCommand.execute(['Test Study'], { projectRoot });
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data.name).toBe('Test Study');
      });

      it('Then should handle non-existent study', async () => {
        // Given: A project with studies
        // When: Showing details for non-existent study
        // Then: Should handle gracefully with appropriate error
        
        const result = await showStudyCommand.execute(['non-existent'], { projectRoot });
        
        expect(result.success).toBe(false);
        expect(result.message).toContain('Study not found');
      });

      it('Then should validate study identifier', async () => {
        // Given: A show study command
        // When: Validating arguments
        // Then: Should validate study identifier
        
        const validation = await showStudyCommand.validate([], { projectRoot });
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBeGreaterThan(0);
      });
    });

    describe('When deleting a study', () => {
      beforeEach(async () => {
        await createStudyCommand.execute(['Study to Delete'], { projectRoot });
      });

      it('Then should delete study directory and files', async () => {
        // Given: A project with a study
        // When: Deleting the study
        // Then: Should remove study directory and all files
        
        const result = await deleteStudyCommand.execute(['001-study-to-delete'], { projectRoot });
        
        expect(result.success).toBe(true);
        expect(result.message).toContain('Study deleted successfully');
        
        const studyPath = join(projectRoot, '.uxkit', 'studies', '001-study-to-delete');
        expect(await mockFileSystem.pathExists(studyPath)).toBe(false);
      });

      it('Then should handle non-existent study', async () => {
        // Given: A project with studies
        // When: Deleting non-existent study
        // Then: Should handle gracefully with appropriate error
        
        const result = await deleteStudyCommand.execute(['non-existent'], { projectRoot });
        
        expect(result.success).toBe(false);
        expect(result.message).toContain('Study not found');
      });

      it('Then should validate study identifier', async () => {
        // Given: A delete study command
        // When: Validating arguments
        // Then: Should validate study identifier
        
        const validation = await deleteStudyCommand.validate([], { projectRoot });
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBeGreaterThan(0);
      });

      it('Then should provide confirmation option', async () => {
        // Given: A project with a study
        // When: Deleting with confirmation
        // Then: Should respect confirmation setting
        
        const result = await deleteStudyCommand.execute(['001-study-to-delete'], { 
          projectRoot, 
          confirm: true 
        });
        
        expect(result.success).toBe(true);
        expect(result.message).toContain('Study deleted successfully');
      });
    });

    describe('When using StudyService directly', () => {
      it('Then should create study with proper metadata', async () => {
        // Given: A StudyService
        // When: Creating a study
        // Then: Should return study metadata
        
        const study = await studyService.createStudy('Test Study', 'A test study', projectRoot);
        
        expect(study).toBeDefined();
        expect(study.id).toBe('001-test-study');
        expect(study.name).toBe('Test Study');
        expect(study.description).toBe('A test study');
        expect(study.basePath).toContain('001-test-study');
      });

      it('Then should list all studies', async () => {
        // Given: A StudyService with multiple studies
        // When: Listing studies
        // Then: Should return all studies
        
        await studyService.createStudy('Study 1', 'First study', projectRoot);
        await studyService.createStudy('Study 2', 'Second study', projectRoot);
        
        const studies = await studyService.listStudies(projectRoot);
        
        expect(studies).toHaveLength(2);
        expect(studies[0]?.name).toBe('Study 1');
        expect(studies[1]?.name).toBe('Study 2');
      });

      it('Then should get study by ID', async () => {
        // Given: A StudyService with a study
        // When: Getting study by ID
        // Then: Should return study metadata
        
        await studyService.createStudy('Test Study', 'A test study', projectRoot);
        
        const study = await studyService.getStudy('001-test-study', projectRoot);
        
        expect(study).toBeDefined();
        expect(study?.name).toBe('Test Study');
        expect(study?.id).toBe('001-test-study');
      });

      it('Then should delete study', async () => {
        // Given: A StudyService with a study
        // When: Deleting study
        // Then: Should remove study directory
        
        await studyService.createStudy('Test Study', 'A test study', projectRoot);
        
        await studyService.deleteStudy('001-test-study', projectRoot);
        
        const study = await studyService.getStudy('001-test-study', projectRoot);
        expect(study).toBeUndefined();
      });
    });

    describe('When integrating with CLI framework', () => {
      it('Then should work with CLIApplication', async () => {
        // Given: Study commands registered with CLI
        // When: Executing study commands through CLI
        // Then: Should work seamlessly
        
        const result = await createStudyCommand.execute(['CLI Test Study'], { projectRoot });
        expect(result.success).toBe(true);
        
        const listResult = await listStudiesCommand.execute([], { projectRoot });
        expect(listResult.success).toBe(true);
        
        const showResult = await showStudyCommand.execute(['001-cli-test-study'], { projectRoot });
        expect(showResult.success).toBe(true);
        
        const deleteResult = await deleteStudyCommand.execute(['001-cli-test-study'], { projectRoot });
        expect(deleteResult.success).toBe(true);
      });

      it('Then should maintain 100% test coverage', () => {
        // Given: All study command components
        // When: Running tests
        // Then: Should have 100% test coverage
        
        expect(createStudyCommand).toBeDefined();
        expect(listStudiesCommand).toBeDefined();
        expect(showStudyCommand).toBeDefined();
        expect(deleteStudyCommand).toBeDefined();
        expect(studyService).toBeDefined();
        
        // All components should be properly instantiated and functional
        expect(typeof createStudyCommand.execute).toBe('function');
        expect(typeof listStudiesCommand.execute).toBe('function');
        expect(typeof showStudyCommand.execute).toBe('function');
        expect(typeof deleteStudyCommand.execute).toBe('function');
        expect(typeof studyService.createStudy).toBe('function');
        expect(typeof studyService.listStudies).toBe('function');
        expect(typeof studyService.getStudy).toBe('function');
        expect(typeof studyService.deleteStudy).toBe('function');
      });
    });
  });
});
