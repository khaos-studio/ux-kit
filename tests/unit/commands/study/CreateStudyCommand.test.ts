/**
 * Unit tests for CreateStudyCommand
 * 
 * Tests the study creation command functionality including:
 * - Command execution with various arguments and options
 * - Validation of study name and description
 * - Error handling and edge cases
 * - Help system functionality
 */

import { CreateStudyCommand } from '../../../../src/commands/study/CreateStudyCommand';
import { StudyService } from '../../../../src/services/StudyService';
import { IOutput } from '../../../../src/contracts/presentation-contracts';

describe('CreateStudyCommand', () => {
  let createStudyCommand: CreateStudyCommand;
  let mockStudyService: jest.Mocked<StudyService>;
  let mockOutput: jest.Mocked<IOutput>;

  beforeEach(() => {
    // Create mocks
    mockStudyService = {
      createStudy: jest.fn()
    } as any;

    mockOutput = {
      writeln: jest.fn(),
      writeErrorln: jest.fn()
    } as any;

    // Create command instance
    createStudyCommand = new CreateStudyCommand(
      mockStudyService,
      mockOutput
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Command Properties', () => {
    it('should have correct command properties', () => {
      expect(createStudyCommand.name).toBe('create');
      expect(createStudyCommand.description).toBe('Create a new research study');
      expect(createStudyCommand.usage).toBe('uxkit study create <name> [options]');
      expect(createStudyCommand.arguments).toHaveLength(1);
      expect(createStudyCommand.options).toHaveLength(1);
      expect(createStudyCommand.examples).toHaveLength(2);
    });

    it('should have correct arguments configuration', () => {
      const nameArgument = createStudyCommand.arguments[0];
      expect(nameArgument).toBeDefined();
      expect(nameArgument!.name).toBe('name');
      expect(nameArgument!.description).toBe('Name of the study');
      expect(nameArgument!.required).toBe(true);
      expect(nameArgument!.type).toBe('string');
    });

    it('should have correct options configuration', () => {
      const descriptionOption = createStudyCommand.options[0];
      expect(descriptionOption).toBeDefined();
      expect(descriptionOption!.name).toBe('description');
      expect(descriptionOption!.description).toBe('Description of the study');
      expect(descriptionOption!.type).toBe('string');
      expect(descriptionOption!.required).toBe(false);
      expect(descriptionOption!.aliases).toEqual(['d']);
    });
  });

  describe('execute', () => {
    const mockStudy = {
      id: 'study-123',
      name: 'User Onboarding Research',
      description: 'Research into improving the new user onboarding flow',
      basePath: '/test/project/.uxkit/studies/user-onboarding-research',
      createdAt: new Date('2024-01-18T10:00:00Z')
    };

    it('should successfully create a study with name only', async () => {
      // Arrange
      const args = ['User Onboarding Research'];
      const options = { projectRoot: '/test/project' };
      mockStudyService.createStudy.mockResolvedValue(mockStudy);

      // Act
      const result = await createStudyCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Study created successfully: User Onboarding Research');
      expect(result.data).toEqual(mockStudy);

      // Verify service call
      expect(mockStudyService.createStudy).toHaveBeenCalledWith(
        'User Onboarding Research',
        '',
        '/test/project'
      );

      // Verify output messages
      expect(mockOutput.writeln).toHaveBeenCalledWith('Creating study: User Onboarding Research');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Study created successfully with ID: study-123');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Study directory: /test/project/.uxkit/studies/user-onboarding-research');
    });

    it('should successfully create a study with name and description', async () => {
      // Arrange
      const args = ['User Onboarding Research'];
      const options = {
        projectRoot: '/test/project',
        description: 'Research into improving the new user onboarding flow'
      };
      mockStudyService.createStudy.mockResolvedValue(mockStudy);

      // Act
      const result = await createStudyCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockStudy);

      // Verify service call with description
      expect(mockStudyService.createStudy).toHaveBeenCalledWith(
        'User Onboarding Research',
        'Research into improving the new user onboarding flow',
        '/test/project'
      );
    });

    it('should use process.cwd() when projectRoot is not provided', async () => {
      // Arrange
      const args = ['Test Study'];
      const options = {};
      mockStudyService.createStudy.mockResolvedValue(mockStudy);

      // Act
      await createStudyCommand.execute(args, options);

      // Assert
      expect(mockStudyService.createStudy).toHaveBeenCalledWith(
        'Test Study',
        '',
        process.cwd()
      );
    });

    it('should handle empty study name', async () => {
      // Arrange
      const args = [''];
      const options = { projectRoot: '/test/project' };
      mockStudyService.createStudy.mockResolvedValue(mockStudy);

      // Act
      const result = await createStudyCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(true);
      expect(mockStudyService.createStudy).toHaveBeenCalledWith('', '', '/test/project');
    });

    it('should handle errors during study creation', async () => {
      // Arrange
      const args = ['Test Study'];
      const options = { projectRoot: '/test/project' };
      const error = new Error('Study already exists');
      mockStudyService.createStudy.mockRejectedValue(error);

      // Act
      const result = await createStudyCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to create study: Study already exists');
      expect(result.errors).toEqual(['Study already exists']);
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith('Failed to create study: Study already exists');
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      const args = ['Test Study'];
      const options = { projectRoot: '/test/project' };
      mockStudyService.createStudy.mockRejectedValue('String error');

      // Act
      const result = await createStudyCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to create study: Unknown error occurred');
      expect(result.errors).toEqual(['Unknown error occurred']);
    });
  });

  describe('validate', () => {
    it('should return valid result for valid arguments and options', async () => {
      // Arrange
      const args = ['User Onboarding Research'];
      const options = { description: 'A valid description' };

      // Act
      const result = await createStudyCommand.validate(args, options);

      // Assert
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate study name is required', async () => {
      // Test missing name
      const result1 = await createStudyCommand.validate([], {});
      expect(result1.valid).toBe(false);
      expect(result1.errors).toHaveLength(1);
      expect(result1.errors[0]).toBeDefined();
      expect(result1.errors[0]!.field).toBe('name');
      expect(result1.errors[0]!.message).toBe('Study name is required');
      expect(result1.errors[0]!.value).toBeUndefined();

      // Test empty name
      const result2 = await createStudyCommand.validate([''], {});
      expect(result2.valid).toBe(false);
      expect(result2.errors).toHaveLength(1);
      expect(result2.errors[0]).toBeDefined();
      expect(result2.errors[0]!.field).toBe('name');
      expect(result2.errors[0]!.message).toBe('Study name is required');
      expect(result2.errors[0]!.value).toBe('');

      // Test whitespace-only name
      const result3 = await createStudyCommand.validate(['   '], {});
      expect(result3.valid).toBe(false);
      expect(result3.errors).toHaveLength(1);
      expect(result3.errors[0]).toBeDefined();
      expect(result3.errors[0]!.field).toBe('name');
      expect(result3.errors[0]!.message).toBe('Study name is required');
      expect(result3.errors[0]!.value).toBe('   ');
    });

    it('should validate study name minimum length', async () => {
      // Test name too short
      const result = await createStudyCommand.validate(['AB'], {});
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toBeDefined();
      expect(result.errors[0]!.field).toBe('name');
      expect(result.errors[0]!.message).toBe('Study name must be at least 3 characters long');
      expect(result.errors[0]!.value).toBe('AB');

      // Test name with minimum length
      const result2 = await createStudyCommand.validate(['ABC'], {});
      expect(result2.valid).toBe(true);
    });

    it('should validate description type', async () => {
      // Test valid description (string)
      const result1 = await createStudyCommand.validate(['Valid Study'], { description: 'Valid description' });
      expect(result1.valid).toBe(true);

      // Test invalid description (non-string)
      const result2 = await createStudyCommand.validate(['Valid Study'], { description: 123 });
      expect(result2.valid).toBe(false);
      expect(result2.errors).toHaveLength(1);
      expect(result2.errors[0]).toBeDefined();
      expect(result2.errors[0]!.field).toBe('description');
      expect(result2.errors[0]!.message).toBe('Description must be a string');
      expect(result2.errors[0]!.value).toBe(123);
    });

    it('should handle multiple validation errors', async () => {
      // Arrange
      const args = ['AB']; // Too short
      const options = { description: 123 }; // Wrong type

      // Act
      const result = await createStudyCommand.validate(args, options);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0]).toBeDefined();
      expect(result.errors[1]).toBeDefined();
      expect(result.errors[0]!.field).toBe('name');
      expect(result.errors[1]!.field).toBe('description');
    });

    it('should handle empty options', async () => {
      // Act
      const result = await createStudyCommand.validate(['Valid Study'], {});

      // Assert
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('showHelp', () => {
    it('should display help information correctly', () => {
      // Act
      createStudyCommand.showHelp();

      // Assert
      expect(mockOutput.writeln).toHaveBeenCalledWith('Usage: uxkit study create <name> [options]');
      expect(mockOutput.writeln).toHaveBeenCalledWith('\nCreate a new research study');
      expect(mockOutput.writeln).toHaveBeenCalledWith('\nArguments:');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  name (required): Name of the study');
      expect(mockOutput.writeln).toHaveBeenCalledWith('\nOptions:');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  --description, -d    Description of the study');
      expect(mockOutput.writeln).toHaveBeenCalledWith('\nExamples:');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  Create a basic study: uxkit study create "User Onboarding Research"');
      expect(mockOutput.writeln).toHaveBeenCalledWith('  Create a study with description: uxkit study create "User Onboarding Research" --description "Research into improving the new user onboarding flow"');
    });
  });
});
