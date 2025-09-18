/**
 * Unit tests for ListStudiesCommand
 * 
 * Tests the study listing command functionality including:
 * - Command execution with various format options
 * - Validation of format options
 * - Error handling and edge cases
 * - Help system functionality
 * - Table display functionality
 */

import { ListStudiesCommand } from '../../../../src/commands/study/ListStudiesCommand';
import { StudyService } from '../../../../src/services/StudyService';
import { IOutput } from '../../../../src/contracts/presentation-contracts';

describe('ListStudiesCommand', () => {
  let listStudiesCommand: ListStudiesCommand;
  let mockStudyService: jest.Mocked<StudyService>;
  let mockOutput: jest.Mocked<IOutput>;

  beforeEach(() => {
    // Create mocks
    mockStudyService = {
      listStudies: jest.fn()
    } as any;

    mockOutput = {
      writeln: jest.fn(),
      writeErrorln: jest.fn()
    } as any;

    // Create command instance
    listStudiesCommand = new ListStudiesCommand(
      mockStudyService,
      mockOutput
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Command Properties', () => {
    it('should have correct command properties', () => {
      expect(listStudiesCommand.name).toBe('list');
      expect(listStudiesCommand.description).toBe('List all research studies');
      expect(listStudiesCommand.usage).toBe('uxkit study list [options]');
      expect(listStudiesCommand.arguments).toHaveLength(0);
      expect(listStudiesCommand.options).toHaveLength(1);
      expect(listStudiesCommand.examples).toHaveLength(2);
    });

    it('should have correct options configuration', () => {
      const formatOption = listStudiesCommand.options[0];
      expect(formatOption).toBeDefined();
      expect(formatOption!.name).toBe('format');
      expect(formatOption!.description).toBe('Output format (table, json)');
      expect(formatOption!.type).toBe('string');
      expect(formatOption!.required).toBe(false);
      expect(formatOption!.defaultValue).toBe('table');
      expect(formatOption!.aliases).toEqual(['f']);
    });
  });

  describe('execute', () => {
    const mockStudies = [
      {
        id: 'study-1',
        name: 'User Onboarding Research',
        description: 'Research into improving the new user onboarding flow',
        basePath: '/test/project/.uxkit/studies/user-onboarding-research',
        createdAt: new Date('2024-01-18T10:00:00Z')
      },
      {
        id: 'study-2',
        name: 'E-commerce Usability Study',
        description: 'Usability testing for e-commerce checkout flow',
        basePath: '/test/project/.uxkit/studies/e-commerce-usability-study',
        createdAt: new Date('2024-01-19T10:00:00Z')
      }
    ];

    it('should successfully list studies in table format by default', async () => {
      // Arrange
      const args: string[] = [];
      const options = { projectRoot: '/test/project' };
      mockStudyService.listStudies.mockResolvedValue(mockStudies);

      // Act
      const result = await listStudiesCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Found 2 studies');
      expect(result.data).toEqual(mockStudies);

      // Verify service call
      expect(mockStudyService.listStudies).toHaveBeenCalledWith('/test/project');

      // Verify output messages
      expect(mockOutput.writeln).toHaveBeenCalledWith('Fetching studies...');
      expect(mockOutput.writeln).toHaveBeenCalledWith('\nResearch Studies:');
      expect(mockOutput.writeln).toHaveBeenCalledWith('================');
      expect(mockOutput.writeln).toHaveBeenCalledWith('ID: study-1');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Name: User Onboarding Research');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Description: Research into improving the new user onboarding flow');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Path: /test/project/.uxkit/studies/user-onboarding-research');
      expect(mockOutput.writeln).toHaveBeenCalledWith('---');
    });

    it('should successfully list studies in JSON format', async () => {
      // Arrange
      const args: string[] = [];
      const options = { 
        projectRoot: '/test/project',
        format: 'json'
      };
      mockStudyService.listStudies.mockResolvedValue(mockStudies);

      // Act
      const result = await listStudiesCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Found 2 studies');
      expect(result.data).toEqual(mockStudies);

      // Verify JSON output
      expect(mockOutput.writeln).toHaveBeenCalledWith('Fetching studies...');
      expect(mockOutput.writeln).toHaveBeenCalledWith(JSON.stringify(mockStudies, null, 2));
    });

    it('should handle empty studies list', async () => {
      // Arrange
      const args: string[] = [];
      const options = { projectRoot: '/test/project' };
      mockStudyService.listStudies.mockResolvedValue([]);

      // Act
      const result = await listStudiesCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('No studies found');
      expect(result.data).toEqual([]);

      // Verify output messages
      expect(mockOutput.writeln).toHaveBeenCalledWith('Fetching studies...');
      expect(mockOutput.writeln).toHaveBeenCalledWith('No studies found. Create your first study with: uxkit study create "Study Name"');
    });

    it('should use process.cwd() when projectRoot is not provided', async () => {
      // Arrange
      const args: string[] = [];
      const options = {};
      mockStudyService.listStudies.mockResolvedValue(mockStudies);

      // Act
      await listStudiesCommand.execute(args, options);

      // Assert
      expect(mockStudyService.listStudies).toHaveBeenCalledWith(process.cwd());
    });

    it('should use default table format when format is not provided', async () => {
      // Arrange
      const args: string[] = [];
      const options = { projectRoot: '/test/project' };
      mockStudyService.listStudies.mockResolvedValue(mockStudies);

      // Act
      await listStudiesCommand.execute(args, options);

      // Assert
      expect(mockOutput.writeln).toHaveBeenCalledWith('\nResearch Studies:');
      expect(mockOutput.writeln).toHaveBeenCalledWith('================');
    });

    it('should handle studies without descriptions in table format', async () => {
      // Arrange
      const studiesWithoutDescription = [
        {
          id: 'study-1',
          name: 'Study Without Description',
          basePath: '/test/project/.uxkit/studies/study-without-description',
          createdAt: new Date('2024-01-18T10:00:00Z')
        }
      ];
      const args: string[] = [];
      const options = { projectRoot: '/test/project' };
      mockStudyService.listStudies.mockResolvedValue(studiesWithoutDescription);

      // Act
      await listStudiesCommand.execute(args, options);

      // Assert
      expect(mockOutput.writeln).toHaveBeenCalledWith('ID: study-1');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Name: Study Without Description');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Path: /test/project/.uxkit/studies/study-without-description');
      expect(mockOutput.writeln).toHaveBeenCalledWith('---');
      // Should not call writeln for description
      expect(mockOutput.writeln).not.toHaveBeenCalledWith('Description: Study Without Description');
    });

    it('should handle errors during study listing', async () => {
      // Arrange
      const args: string[] = [];
      const options = { projectRoot: '/test/project' };
      const error = new Error('Failed to read studies directory');
      mockStudyService.listStudies.mockRejectedValue(error);

      // Act
      const result = await listStudiesCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to list studies: Failed to read studies directory');
      expect(result.errors).toEqual(['Failed to read studies directory']);
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith('Failed to list studies: Failed to read studies directory');
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      const args: string[] = [];
      const options = { projectRoot: '/test/project' };
      mockStudyService.listStudies.mockRejectedValue('String error');

      // Act
      const result = await listStudiesCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to list studies: Unknown error occurred');
      expect(result.errors).toEqual(['Unknown error occurred']);
    });
  });

  describe('validate', () => {
    it('should return valid result for valid options', async () => {
      // Test valid formats
      const validFormats = ['table', 'json'];
      
      for (const format of validFormats) {
        const result = await listStudiesCommand.validate([], { format });
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }
    });

    it('should validate format option values', async () => {
      // Test invalid format
      const result = await listStudiesCommand.validate([], { format: 'invalid' });
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toBeDefined();
      expect(result.errors[0]!.field).toBe('format');
      expect(result.errors[0]!.message).toBe('Format must be either "table" or "json"');
      expect(result.errors[0]!.value).toBe('invalid');
    });

    it('should handle empty options', async () => {
      // Act
      const result = await listStudiesCommand.validate([], {});

      // Assert
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('showHelp', () => {
    it('should display help information correctly', () => {
      // Act
      listStudiesCommand.showHelp();

      // Assert
      expect(mockOutput.writeln).toHaveBeenCalledWith('Usage: uxkit study list [options]');
      expect(mockOutput.writeln).toHaveBeenCalledWith('\nList all research studies');
      expect(mockOutput.writeln).toHaveBeenCalledWith('\nOptions:');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  --format, -f    Output format (table, json)');
      expect(mockOutput.writeln).toHaveBeenCalledWith('\nExamples:');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  List all studies in table format: uxkit study list');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  List all studies in JSON format: uxkit study list --format json');
    });
  });

  describe('displayStudiesTable', () => {
    it('should display studies in table format correctly', () => {
      // Arrange
      const studies = [
        {
          id: 'study-1',
          name: 'Test Study 1',
          description: 'Test Description 1',
          basePath: '/test/path/1'
        },
        {
          id: 'study-2',
          name: 'Test Study 2',
          basePath: '/test/path/2'
        }
      ];

      // Act
      (listStudiesCommand as any).displayStudiesTable(studies);

      // Assert
      expect(mockOutput.writeln).toHaveBeenCalledWith('\nResearch Studies:');
      expect(mockOutput.writeln).toHaveBeenCalledWith('================');
      expect(mockOutput.writeln).toHaveBeenCalledWith('ID: study-1');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Name: Test Study 1');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Description: Test Description 1');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Path: /test/path/1');
      expect(mockOutput.writeln).toHaveBeenCalledWith('---');
      expect(mockOutput.writeln).toHaveBeenCalledWith('ID: study-2');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Name: Test Study 2');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Path: /test/path/2');
      expect(mockOutput.writeln).toHaveBeenCalledWith('---');
    });
  });
});
