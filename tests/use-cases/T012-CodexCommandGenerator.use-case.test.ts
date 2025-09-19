/**
 * T012: CodexCommandGenerator Service - Use Case Tests
 * 
 * These tests define the expected behavior for the CodexCommandGenerator service
 * before implementing the actual service logic.
 */

import { CodexCommandGenerator } from '../../src/services/codex/CodexCommandGenerator';
import { IFileSystemService } from '../../src/contracts/infrastructure-contracts';
import {
  CodexConfiguration,
  CodexCommandTemplate,
  CodexCommandParameter
} from '../../src/contracts/domain-contracts';

// Mock the file system service
jest.mock('../../src/contracts/infrastructure-contracts');

describe('T012: CodexCommandGenerator Service - Use Cases', () => {
  
  describe('Given a CodexCommandGenerator service', () => {
    let codexCommandGenerator: CodexCommandGenerator;
    let mockFileSystemService: jest.Mocked<IFileSystemService>;

    beforeEach(() => {
      // Create mock file system service
      mockFileSystemService = {
        fileExists: jest.fn(),
        directoryExists: jest.fn(),
        createDirectory: jest.fn(),
        readFile: jest.fn(),
        writeFile: jest.fn(),
        listFiles: jest.fn(),
        deleteFile: jest.fn(),
        getFileStats: jest.fn()
      } as jest.Mocked<IFileSystemService>;

      // Create CodexCommandGenerator instance
      codexCommandGenerator = new CodexCommandGenerator(mockFileSystemService);
    });

    describe('When generating all Codex command templates', () => {
      it('Then should create all default templates in the specified directory', async () => {
        // Given: Valid configuration with template path
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        mockFileSystemService.directoryExists.mockResolvedValue(false);
        mockFileSystemService.createDirectory.mockResolvedValue();
        mockFileSystemService.writeFile.mockResolvedValue();

        // When: Generating templates
        await codexCommandGenerator.generateTemplates(config);

        // Then: Should create directory and write template files
        expect(mockFileSystemService.directoryExists).toHaveBeenCalledWith('templates/codex');
        expect(mockFileSystemService.createDirectory).toHaveBeenCalledWith('templates/codex');
        expect(mockFileSystemService.writeFile).toHaveBeenCalledTimes(5); // 5 default templates
      });

      it('Then should use existing directory if it already exists', async () => {
        // Given: Directory already exists
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        mockFileSystemService.directoryExists.mockResolvedValue(true);
        mockFileSystemService.writeFile.mockResolvedValue();

        // When: Generating templates
        await codexCommandGenerator.generateTemplates(config);

        // Then: Should not create directory but should write files
        expect(mockFileSystemService.directoryExists).toHaveBeenCalledWith('templates/codex');
        expect(mockFileSystemService.createDirectory).not.toHaveBeenCalled();
        expect(mockFileSystemService.writeFile).toHaveBeenCalledTimes(5);
      });

      it('Then should handle file system errors gracefully', async () => {
        // Given: File system error occurs
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        mockFileSystemService.directoryExists.mockRejectedValue(new Error('Permission denied'));

        // When: Generating templates
        // Then: Should throw error
        await expect(codexCommandGenerator.generateTemplates(config)).rejects.toThrow('Permission denied');
      });
    });

    describe('When getting a specific template by name', () => {
      it('Then should return template when it exists', async () => {
        // Given: Template file exists
        const templateContent = `# Create Project Template

## Description
Create a new project with specified configuration

## Command
\`codex create {projectName} --template {templateType}\`

## Parameters
- projectName (string, required): Name of the project to create
- templateType (string, optional): Type of template to use

## Examples
- \`codex create my-app --template react\`
- \`codex create my-api --template node\`

## Category
project

## Version
1.0.0`;

        mockFileSystemService.fileExists.mockResolvedValue(true);
        mockFileSystemService.readFile.mockResolvedValue(templateContent);

        // When: Getting template by name
        const template = await codexCommandGenerator.getTemplate('create-project');

        // Then: Should return parsed template
        expect(template).not.toBeNull();
        expect(template?.name).toBe('create-project');
        expect(template?.description).toBe('Create a new project with specified configuration');
        expect(template?.command).toBe('codex create {projectName} --template {templateType}');
        expect(template?.parameters).toHaveLength(2);
        expect(template?.examples).toHaveLength(2);
        expect(template?.category).toBe('project');
        expect(template?.version).toBe('1.0.0');
      });

      it('Then should return null when template does not exist', async () => {
        // Given: Template file does not exist
        mockFileSystemService.fileExists.mockResolvedValue(false);

        // When: Getting template by name
        const template = await codexCommandGenerator.getTemplate('non-existent');

        // Then: Should return null
        expect(template).toBeNull();
      });

      it('Then should return null when file read fails', async () => {
        // Given: File exists but read fails
        mockFileSystemService.fileExists.mockResolvedValue(true);
        mockFileSystemService.readFile.mockRejectedValue(new Error('Read failed'));

        // When: Getting template by name
        const template = await codexCommandGenerator.getTemplate('create-project');

        // Then: Should return null
        expect(template).toBeNull();
      });
    });

    describe('When listing all available templates', () => {
      it('Then should return all templates in the template directory', async () => {
        // Given: Template directory with multiple files
        const templateFiles = [
          'create-project.md',
          'generate-component.md',
          'run-tests.md',
          'deploy-app.md',
          'setup-database.md'
        ];

        mockFileSystemService.listFiles.mockResolvedValue(templateFiles);
        mockFileSystemService.fileExists.mockResolvedValue(true);
        mockFileSystemService.readFile.mockResolvedValue(`# Template

## Description
Test template

## Command
\`codex test\`

## Parameters

## Examples

## Category
test

## Version
1.0.0`);

        // When: Listing templates
        const templates = await codexCommandGenerator.listTemplates();

        // Then: Should return all templates
        expect(templates).toHaveLength(5);
        expect(templates[0]?.name).toBe('create-project');
        expect(templates[1]?.name).toBe('generate-component');
        expect(templates[2]?.name).toBe('run-tests');
        expect(templates[3]?.name).toBe('deploy-app');
        expect(templates[4]?.name).toBe('setup-database');
      });

      it('Then should return empty array when no templates exist', async () => {
        // Given: Empty template directory
        mockFileSystemService.listFiles.mockResolvedValue([]);

        // When: Listing templates
        const templates = await codexCommandGenerator.listTemplates();

        // Then: Should return empty array
        expect(templates).toHaveLength(0);
      });

      it('Then should filter out non-markdown files', async () => {
        // Given: Directory with mixed file types
        const templateFiles = [
          'create-project.md',
          'config.json',
          'generate-component.md',
          'README.txt',
          'run-tests.md'
        ];

        mockFileSystemService.listFiles.mockResolvedValue(templateFiles);
        mockFileSystemService.fileExists.mockResolvedValue(true);
        mockFileSystemService.readFile.mockResolvedValue(`# Template

## Description
Test template

## Command
\`codex test\`

## Parameters

## Examples

## Category
test

## Version
1.0.0`);

        // When: Listing templates
        const templates = await codexCommandGenerator.listTemplates();

        // Then: Should only return markdown files
        expect(templates).toHaveLength(3);
        expect(templates[0]?.name).toBe('create-project');
        expect(templates[1]?.name).toBe('generate-component');
        expect(templates[2]?.name).toBe('run-tests');
      });
    });

    describe('When validating template structure', () => {
      it('Then should return true for valid template', () => {
        // Given: Valid template
        const template: CodexCommandTemplate = {
          name: 'test-template',
          description: 'A test template',
          command: 'codex test {param}',
          parameters: [{
            name: 'param',
            type: 'string',
            required: true,
            description: 'Test parameter'
          }],
          examples: ['codex test value'],
          category: 'test',
          version: '1.0.0'
        };

        // When: Validating template
        const isValid = codexCommandGenerator.validateTemplate(template);

        // Then: Should return true
        expect(isValid).toBe(true);
      });

      it('Then should return false for template with missing required fields', () => {
        // Given: Invalid template with missing name
        const template: CodexCommandTemplate = {
          name: '',
          description: 'A test template',
          command: 'codex test',
          parameters: [],
          examples: [],
          category: 'test',
          version: '1.0.0'
        };

        // When: Validating template
        const isValid = codexCommandGenerator.validateTemplate(template);

        // Then: Should return false
        expect(isValid).toBe(false);
      });

      it('Then should return false for template with invalid parameters', () => {
        // Given: Template with invalid parameter
        const template: CodexCommandTemplate = {
          name: 'test-template',
          description: 'A test template',
          command: 'codex test {param}',
          parameters: [{
            name: '',
            type: 'string',
            required: true,
            description: 'Invalid parameter'
          }],
          examples: [],
          category: 'test',
          version: '1.0.0'
        };

        // When: Validating template
        const isValid = codexCommandGenerator.validateTemplate(template);

        // Then: Should return false
        expect(isValid).toBe(false);
      });
    });

    describe('When generating template for specific command', () => {
      it('Then should generate template with correct structure', async () => {
        // Given: Valid configuration
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        // When: Generating command template
        const template = await codexCommandGenerator.generateCommandTemplate('create-project', config);

        // Then: Should return valid template
        expect(template.name).toBe('create-project');
        expect(template.description).toBeDefined();
        expect(template.command).toBeDefined();
        expect(template.parameters).toBeDefined();
        expect(template.examples).toBeDefined();
        expect(template.category).toBeDefined();
        expect(template.version).toBeDefined();
      });

      it('Then should throw error for unknown command', async () => {
        // Given: Valid configuration
        const config: CodexConfiguration = {
          enabled: true,
          templatePath: 'templates/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          timeout: 5000
        };

        // When: Generating template for unknown command
        // Then: Should throw error
        await expect(codexCommandGenerator.generateCommandTemplate('unknown-command', config))
          .rejects.toThrow('Unknown command: unknown-command');
      });
    });

    describe('When handling markdown formatting', () => {
      it('Then should format template as proper markdown', async () => {
        // Given: Template content
        const template: CodexCommandTemplate = {
          name: 'test-template',
          description: 'A test template',
          command: 'codex test {param}',
          parameters: [{
            name: 'param',
            type: 'string',
            required: true,
            description: 'Test parameter'
          }],
          examples: ['codex test value'],
          category: 'test',
          version: '1.0.0'
        };

        // When: Getting formatted markdown
        const markdown = codexCommandGenerator.formatTemplateAsMarkdown(template);

        // Then: Should return properly formatted markdown
        expect(markdown).toContain('# Test Template');
        expect(markdown).toContain('## Description');
        expect(markdown).toContain('A test template');
        expect(markdown).toContain('## Command');
        expect(markdown).toContain('`codex test {param}`');
        expect(markdown).toContain('## Parameters');
        expect(markdown).toContain('## Examples');
        expect(markdown).toContain('## Category');
        expect(markdown).toContain('## Version');
      });
    });

    describe('When parsing markdown templates', () => {
      it('Then should parse valid markdown template correctly', () => {
        // Given: Valid markdown template
        const markdown = `# Create Project Template

## Description
Create a new project with specified configuration

## Command
\`codex create {projectName} --template {templateType}\`

## Parameters
- projectName (string, required): Name of the project to create
- templateType (string, optional): Type of template to use

## Examples
- \`codex create my-app --template react\`
- \`codex create my-api --template node\`

## Category
project

## Version
1.0.0`;

        // When: Parsing markdown
        const template = codexCommandGenerator.parseMarkdownTemplate('create-project', markdown);

        // Then: Should return parsed template
        expect(template.name).toBe('create-project');
        expect(template.description).toBe('Create a new project with specified configuration');
        expect(template.command).toBe('codex create {projectName} --template {templateType}');
        expect(template.parameters).toHaveLength(2);
        expect(template.parameters[0]?.name).toBe('projectName');
        expect(template.parameters[0]?.type).toBe('string');
        expect(template.parameters[0]?.required).toBe(true);
        expect(template.parameters[1]?.name).toBe('templateType');
        expect(template.parameters[1]?.type).toBe('string');
        expect(template.parameters[1]?.required).toBe(false);
        expect(template.examples).toHaveLength(2);
        expect(template.category).toBe('project');
        expect(template.version).toBe('1.0.0');
      });

      it('Then should handle malformed markdown gracefully', () => {
        // Given: Malformed markdown
        const markdown = `# Incomplete Template

## Description
Missing required sections`;

        // When: Parsing markdown
        // Then: Should throw error or return null
        expect(() => codexCommandGenerator.parseMarkdownTemplate('incomplete', markdown))
          .toThrow('Invalid template format');
      });
    });

    describe('When working with default templates', () => {
      it('Then should provide all default template definitions', () => {
        // Given: CodexCommandGenerator instance
        // When: Getting default templates
        const defaultTemplates = codexCommandGenerator.getDefaultTemplates();

        // Then: Should return all default templates
        expect(defaultTemplates).toHaveLength(5);
        expect(defaultTemplates.map((t: CodexCommandTemplate) => t.name)).toContain('create-project');
        expect(defaultTemplates.map((t: CodexCommandTemplate) => t.name)).toContain('generate-component');
        expect(defaultTemplates.map((t: CodexCommandTemplate) => t.name)).toContain('run-tests');
        expect(defaultTemplates.map((t: CodexCommandTemplate) => t.name)).toContain('deploy-app');
        expect(defaultTemplates.map((t: CodexCommandTemplate) => t.name)).toContain('setup-database');
      });

      it('Then should have valid structure for all default templates', () => {
        // Given: CodexCommandGenerator instance
        // When: Getting default templates
        const defaultTemplates = codexCommandGenerator.getDefaultTemplates();

        // Then: All templates should be valid
        defaultTemplates.forEach((template: CodexCommandTemplate) => {
          expect(codexCommandGenerator.validateTemplate(template)).toBe(true);
        });
      });
    });
  });
});
