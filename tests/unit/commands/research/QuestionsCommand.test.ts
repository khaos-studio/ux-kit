/**
 * Unit tests for QuestionsCommand
 * 
 * Tests the research questions generation command functionality including:
 * - Command execution with various arguments and options
 * - Validation of required parameters
 * - Error handling and edge cases
 * - Service integration
 */

import { QuestionsCommand } from '../../../../src/commands/research/QuestionsCommand';
import { ResearchService } from '../../../../src/services/ResearchService';
import { IOutput } from '../../../../src/contracts/presentation-contracts';

describe('QuestionsCommand', () => {
  let questionsCommand: QuestionsCommand;
  let mockResearchService: jest.Mocked<ResearchService>;
  let mockOutput: jest.Mocked<IOutput>;

  beforeEach(() => {
    // Create mocks
    mockResearchService = {
      generateQuestions: jest.fn()
    } as any;

    mockOutput = {
      writeln: jest.fn(),
      writeErrorln: jest.fn()
    } as any;

    // Create command instance
    questionsCommand = new QuestionsCommand(
      mockResearchService,
      mockOutput
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Command Properties', () => {
    it('should have correct command properties', () => {
      expect(QuestionsCommand.command).toBe('questions <prompt>');
      expect(QuestionsCommand.description).toBe('Generate research questions for a study');
      expect(QuestionsCommand.options).toHaveLength(2);
    });

    it('should have correct options configuration', () => {
      const studyOption = QuestionsCommand.options.find(opt => opt.flags.includes('--study'));
      const projectRootOption = QuestionsCommand.options.find(opt => opt.flags.includes('--projectRoot'));

      expect(studyOption).toBeDefined();
      expect(studyOption?.flags).toBe('-s, --study <studyId>');
      expect(studyOption?.description).toBe('Study ID or name');
      expect(studyOption?.required).toBe(true);

      expect(projectRootOption).toBeDefined();
      expect(projectRootOption?.flags).toBe('-p, --projectRoot <path>');
      expect(projectRootOption?.description).toBe('Specify the project root directory');
      expect(projectRootOption?.required).toBeFalsy();
    });
  });

  describe('execute', () => {
    const mockSuccessResult = {
      success: true,
      message: 'Questions generated successfully',
      filePath: '/test/project/.uxkit/studies/test-study/questions.md'
    };

    it('should successfully generate research questions', async () => {
      // Arrange
      const args = ['How do users interact with e-commerce checkout?'];
      const options = {
        study: 'test-study',
        projectRoot: '/test/project'
      };
      mockResearchService.generateQuestions.mockResolvedValue(mockSuccessResult);

      // Act
      const result = await questionsCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Questions generated successfully');
      expect(result.data).toEqual({ filePath: mockSuccessResult.filePath });

      // Verify service call
      expect(mockResearchService.generateQuestions).toHaveBeenCalledWith(
        'test-study',
        'How do users interact with e-commerce checkout?',
        '/test/project'
      );

      // Verify output messages
      expect(mockOutput.writeln).toHaveBeenCalledWith('Generating research questions for study: test-study');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Prompt: How do users interact with e-commerce checkout?');
      expect(mockOutput.writeln).toHaveBeenCalledWith('Questions generated successfully: /test/project/.uxkit/studies/test-study/questions.md');
    });

    it('should use process.cwd() when projectRoot is not provided', async () => {
      // Arrange
      const args = ['Test prompt'];
      const options = { study: 'test-study' };
      mockResearchService.generateQuestions.mockResolvedValue(mockSuccessResult);

      // Act
      await questionsCommand.execute(args, options);

      // Assert
      expect(mockResearchService.generateQuestions).toHaveBeenCalledWith(
        'test-study',
        'Test prompt',
        process.cwd()
      );
    });

    it('should return error when study ID is missing', async () => {
      // Arrange
      const args = ['Test prompt'];
      const options = { projectRoot: '/test/project' };

      // Act
      const result = await questionsCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Study ID is required. Use --study option.');
      expect(mockResearchService.generateQuestions).not.toHaveBeenCalled();
    });

    it('should return error when prompt is missing', async () => {
      // Arrange
      const args: string[] = [];
      const options = {
        study: 'test-study',
        projectRoot: '/test/project'
      };

      // Act
      const result = await questionsCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Research prompt is required.');
      expect(mockResearchService.generateQuestions).not.toHaveBeenCalled();
    });

    it('should handle service failure', async () => {
      // Arrange
      const args = ['Test prompt'];
      const options = {
        study: 'test-study',
        projectRoot: '/test/project'
      };
      const serviceError = {
        success: false,
        filePath: '',
        message: 'Study not found'
      };
      mockResearchService.generateQuestions.mockResolvedValue(serviceError);

      // Act
      const result = await questionsCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Study not found');
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith('Failed to generate questions: Study not found');
    });

    it('should handle service exceptions', async () => {
      // Arrange
      const args = ['Test prompt'];
      const options = {
        study: 'test-study',
        projectRoot: '/test/project'
      };
      const error = new Error('Service unavailable');
      mockResearchService.generateQuestions.mockRejectedValue(error);

      // Act
      const result = await questionsCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to generate questions: Service unavailable');
      expect(mockOutput.writeErrorln).toHaveBeenCalledWith('Failed to generate questions: Service unavailable');
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      const args = ['Test prompt'];
      const options = {
        study: 'test-study',
        projectRoot: '/test/project'
      };
      mockResearchService.generateQuestions.mockRejectedValue('String error');

      // Act
      const result = await questionsCommand.execute(args, options);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to generate questions: undefined');
    });
  });

  describe('validate', () => {
    it('should return valid result for valid arguments and options', async () => {
      // Arrange
      const args = ['Test research prompt'];
      const options = { study: 'test-study' };

      // Act
      const result = await questionsCommand.validate(args, options);

      // Assert
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate required prompt argument', async () => {
      // Test missing prompt
      const result1 = await questionsCommand.validate([], { study: 'test-study' });
      expect(result1.valid).toBe(false);
      expect(result1.errors).toContain('Research prompt is required');

      // Test empty prompt
      const result2 = await questionsCommand.validate([''], { study: 'test-study' });
      expect(result2.valid).toBe(false);
      expect(result2.errors).toContain('Research prompt is required');
    });

    it('should validate required study option', async () => {
      // Test missing study
      const result1 = await questionsCommand.validate(['Test prompt'], {});
      expect(result1.valid).toBe(false);
      expect(result1.errors).toContain('Study ID is required. Use --study option.');

      // Test empty study
      const result2 = await questionsCommand.validate(['Test prompt'], { study: '' });
      expect(result2.valid).toBe(false);
      expect(result2.errors).toContain('Study ID is required. Use --study option.');
    });

    it('should handle multiple validation errors', async () => {
      // Arrange
      const args: string[] = [];
      const options = {};

      // Act
      const result = await questionsCommand.validate(args, options);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContain('Research prompt is required');
      expect(result.errors).toContain('Study ID is required. Use --study option.');
    });

    it('should handle valid arguments with additional options', async () => {
      // Arrange
      const args = ['Test research prompt'];
      const options = {
        study: 'test-study',
        projectRoot: '/test/project',
        additionalOption: 'value'
      };

      // Act
      const result = await questionsCommand.validate(args, options);

      // Assert
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
