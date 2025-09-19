/**
 * Unit tests for CodexCommandGenerator service
 * 
 * These tests verify the CodexCommandGenerator service works correctly
 * and provide comprehensive coverage for all service methods.
 */

import { CodexCommandGenerator } from '../../../../src/services/codex/CodexCommandGenerator';
import { IFileSystemService } from '../../../../src/contracts/infrastructure-contracts';
import {
  CodexConfiguration,
  CodexCommandTemplate,
  CodexCommandParameter
} from '../../../../src/contracts/domain-contracts';

describe('CodexCommandGenerator', () => {
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

  describe('constructor', () => {
    it('should create instance with file system service', () => {
      expect(codexCommandGenerator).toBeInstanceOf(CodexCommandGenerator);
    });
  });

  describe('generateTemplates', () => {
    it('should create directory and write template files', async () => {
      // Given: Valid configuration
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

      // Then: Should create directory and write files
      expect(mockFileSystemService.directoryExists).toHaveBeenCalledWith('templates/codex');
      expect(mockFileSystemService.createDirectory).toHaveBeenCalledWith('templates/codex');
      expect(mockFileSystemService.writeFile).toHaveBeenCalledTimes(5);
    });

    it('should use existing directory if it exists', async () => {
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

      // Then: Should not create directory
      expect(mockFileSystemService.directoryExists).toHaveBeenCalledWith('templates/codex');
      expect(mockFileSystemService.createDirectory).not.toHaveBeenCalled();
      expect(mockFileSystemService.writeFile).toHaveBeenCalledTimes(5);
    });

    it('should use default template path when not specified', async () => {
      // Given: Configuration without template path
      const config: CodexConfiguration = {
        enabled: true,
        templatePath: '',
        validationEnabled: true,
        fallbackToCustom: false,
        timeout: 5000
      };

      mockFileSystemService.directoryExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockResolvedValue();
      mockFileSystemService.writeFile.mockResolvedValue();

      // When: Generating templates
      await codexCommandGenerator.generateTemplates(config);

      // Then: Should use default path
      expect(mockFileSystemService.directoryExists).toHaveBeenCalledWith('templates/codex');
      expect(mockFileSystemService.createDirectory).toHaveBeenCalledWith('templates/codex');
    });

    it('should throw error when file system operations fail', async () => {
      // Given: File system error
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
      await expect(codexCommandGenerator.generateTemplates(config))
        .rejects.toThrow('Failed to generate templates: Permission denied');
    });

    it('should write correct template content', async () => {
      // Given: Valid configuration
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

      // Then: Should write correct content
      expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
        'templates/codex/create-project.md',
        expect.stringContaining('# Create Project Template')
      );
      expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
        'templates/codex/generate-component.md',
        expect.stringContaining('# Generate Component Template')
      );
    });
  });

  describe('getTemplate', () => {
    it('should return template when file exists', async () => {
      // Given: Template file exists
      const templateContent = `# Create Project Template

## Description
Create a new project

## Command
\`codex create {projectName}\`

## Parameters
- projectName (string, required): Name of the project

## Examples

## Category
project

## Version
1.0.0`;

      mockFileSystemService.fileExists.mockResolvedValue(true);
      mockFileSystemService.readFile.mockResolvedValue(templateContent);

      // When: Getting template
      const template = await codexCommandGenerator.getTemplate('create-project');

      // Then: Should return parsed template
      expect(template).not.toBeNull();
      expect(template?.name).toBe('create-project');
      expect(template?.description).toBe('Create a new project');
      expect(template?.command).toBe('codex create {projectName}');
    });

    it('should return null when file does not exist', async () => {
      // Given: File does not exist
      mockFileSystemService.fileExists.mockResolvedValue(false);

      // When: Getting template
      const template = await codexCommandGenerator.getTemplate('non-existent');

      // Then: Should return null
      expect(template).toBeNull();
    });

    it('should return null when file read fails', async () => {
      // Given: File exists but read fails
      mockFileSystemService.fileExists.mockResolvedValue(true);
      mockFileSystemService.readFile.mockRejectedValue(new Error('Read failed'));

      // When: Getting template
      const template = await codexCommandGenerator.getTemplate('create-project');

      // Then: Should return null
      expect(template).toBeNull();
    });
  });

  describe('listTemplates', () => {
    it('should return all templates from directory', async () => {
      // Given: Directory with template files
      const files = ['create-project.md', 'generate-component.md', 'run-tests.md'];
      mockFileSystemService.listFiles.mockResolvedValue(files);
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
      expect(templates).toHaveLength(3);
      expect(templates[0]?.name).toBe('create-project');
      expect(templates[1]?.name).toBe('generate-component');
      expect(templates[2]?.name).toBe('run-tests');
    });

    it('should return empty array when no files exist', async () => {
      // Given: Empty directory
      mockFileSystemService.listFiles.mockResolvedValue([]);

      // When: Listing templates
      const templates = await codexCommandGenerator.listTemplates();

      // Then: Should return empty array
      expect(templates).toHaveLength(0);
    });

    it('should filter out non-markdown files', async () => {
      // Given: Directory with mixed file types
      const files = ['create-project.md', 'config.json', 'generate-component.md'];
      mockFileSystemService.listFiles.mockResolvedValue(files);
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
      expect(templates).toHaveLength(2);
      expect(templates[0]?.name).toBe('create-project');
      expect(templates[1]?.name).toBe('generate-component');
    });

    it('should return empty array when listFiles fails', async () => {
      // Given: listFiles fails
      mockFileSystemService.listFiles.mockRejectedValue(new Error('List failed'));

      // When: Listing templates
      const templates = await codexCommandGenerator.listTemplates();

      // Then: Should return empty array
      expect(templates).toHaveLength(0);
    });
  });

  describe('validateTemplate', () => {
    it('should return true for valid template', () => {
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

    it('should return false for template with missing name', () => {
      // Given: Template with missing name
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

    it('should return false for template with missing description', () => {
      // Given: Template with missing description
      const template: CodexCommandTemplate = {
        name: 'test-template',
        description: '',
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

    it('should return false for template with missing command', () => {
      // Given: Template with missing command
      const template: CodexCommandTemplate = {
        name: 'test-template',
        description: 'A test template',
        command: '',
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

    it('should return false for template with missing category', () => {
      // Given: Template with missing category
      const template: CodexCommandTemplate = {
        name: 'test-template',
        description: 'A test template',
        command: 'codex test',
        parameters: [],
        examples: [],
        category: '',
        version: '1.0.0'
      };

      // When: Validating template
      const isValid = codexCommandGenerator.validateTemplate(template);

      // Then: Should return false
      expect(isValid).toBe(false);
    });

    it('should return false for template with missing version', () => {
      // Given: Template with missing version
      const template: CodexCommandTemplate = {
        name: 'test-template',
        description: 'A test template',
        command: 'codex test',
        parameters: [],
        examples: [],
        category: 'test',
        version: ''
      };

      // When: Validating template
      const isValid = codexCommandGenerator.validateTemplate(template);

      // Then: Should return false
      expect(isValid).toBe(false);
    });

    it('should return false for template with invalid parameter', () => {
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

    it('should return false for template with parameter missing type', () => {
      // Given: Template with parameter missing type
      const template: CodexCommandTemplate = {
        name: 'test-template',
        description: 'A test template',
        command: 'codex test {param}',
        parameters: [{
          name: 'param',
          type: 'string',
          required: true,
          description: ''
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

  describe('generateCommandTemplate', () => {
    it('should return template for known command', async () => {
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
      expect(template.description).toBe('Create a new project with specified configuration');
      expect(template.command).toBe('codex create {projectName} --template {templateType}');
      expect(template.category).toBe('project');
      expect(template.version).toBe('1.0.0');
    });

    it('should throw error for unknown command', async () => {
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

  describe('formatTemplateAsMarkdown', () => {
    it('should format template as proper markdown', () => {
      // Given: Template
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

      // When: Formatting as markdown
      const markdown = codexCommandGenerator.formatTemplateAsMarkdown(template);

      // Then: Should return properly formatted markdown
      expect(markdown).toContain('# Test Template');
      expect(markdown).toContain('## Description');
      expect(markdown).toContain('A test template');
      expect(markdown).toContain('## Command');
      expect(markdown).toContain('`codex test {param}`');
      expect(markdown).toContain('## Parameters');
      expect(markdown).toContain('- param (string, required): Test parameter');
      expect(markdown).toContain('## Examples');
      expect(markdown).toContain('- `codex test value`');
      expect(markdown).toContain('## Category');
      expect(markdown).toContain('test');
      expect(markdown).toContain('## Version');
      expect(markdown).toContain('1.0.0');
    });

    it('should handle template without parameters', () => {
      // Given: Template without parameters
      const template: CodexCommandTemplate = {
        name: 'simple-template',
        description: 'A simple template',
        command: 'codex simple',
        parameters: [],
        examples: [],
        category: 'simple',
        version: '1.0.0'
      };

      // When: Formatting as markdown
      const markdown = codexCommandGenerator.formatTemplateAsMarkdown(template);

      // Then: Should include empty parameters section
      expect(markdown).toContain('## Parameters');
      expect(markdown).toContain('## Examples');
    });

    it('should handle template with optional parameters', () => {
      // Given: Template with optional parameter
      const template: CodexCommandTemplate = {
        name: 'optional-template',
        description: 'A template with optional parameter',
        command: 'codex optional {param}',
        parameters: [{
          name: 'param',
          type: 'string',
          required: false,
          description: 'Optional parameter'
        }],
        examples: [],
        category: 'optional',
        version: '1.0.0'
      };

      // When: Formatting as markdown
      const markdown = codexCommandGenerator.formatTemplateAsMarkdown(template);

      // Then: Should show parameter as optional
      expect(markdown).toContain('- param (string, optional): Optional parameter');
    });
  });

  describe('parseMarkdownTemplate', () => {
    it('should parse valid markdown template correctly', () => {
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

    it('should handle template without parameters', () => {
      // Given: Markdown template without parameters
      const markdown = `# Simple Template

## Description
A simple template

## Command
\`codex simple\`

## Parameters

## Examples

## Category
simple

## Version
1.0.0`;

      // When: Parsing markdown
      const template = codexCommandGenerator.parseMarkdownTemplate('simple', markdown);

      // Then: Should return template with empty parameters
      expect(template.name).toBe('simple');
      expect(template.parameters).toHaveLength(0);
      expect(template.examples).toHaveLength(0);
    });

    it('should throw error for malformed markdown', () => {
      // Given: Malformed markdown
      const markdown = `# Incomplete Template

## Description
Missing required sections`;

      // When: Parsing markdown
      // Then: Should throw error
      expect(() => codexCommandGenerator.parseMarkdownTemplate('incomplete', markdown))
        .toThrow('Invalid template format');
    });

    it('should handle markdown with extra whitespace', () => {
      // Given: Markdown with extra whitespace
      const markdown = `# Test Template

## Description
   A test template with whitespace   

## Command
\`codex test {param}\`

## Parameters
- param (string, required): Test parameter

## Examples

## Category
test

## Version
1.0.0`;

      // When: Parsing markdown
      const template = codexCommandGenerator.parseMarkdownTemplate('test', markdown);

      // Then: Should parse correctly
      expect(template.name).toBe('test');
      expect(template.description).toBe('A test template with whitespace');
    });
  });

  describe('getDefaultTemplates', () => {
    it('should return all default templates', () => {
      // Given: CodexCommandGenerator instance
      // When: Getting default templates
      const templates = codexCommandGenerator.getDefaultTemplates();

      // Then: Should return all default templates
      expect(templates).toHaveLength(5);
      expect(templates.map(t => t.name)).toContain('create-project');
      expect(templates.map(t => t.name)).toContain('generate-component');
      expect(templates.map(t => t.name)).toContain('run-tests');
      expect(templates.map(t => t.name)).toContain('deploy-app');
      expect(templates.map(t => t.name)).toContain('setup-database');
    });

    it('should have valid structure for all default templates', () => {
      // Given: CodexCommandGenerator instance
      // When: Getting default templates
      const templates = codexCommandGenerator.getDefaultTemplates();

      // Then: All templates should be valid
      templates.forEach(template => {
        expect(codexCommandGenerator.validateTemplate(template)).toBe(true);
      });
    });

    it('should have correct categories for default templates', () => {
      // Given: CodexCommandGenerator instance
      // When: Getting default templates
      const templates = codexCommandGenerator.getDefaultTemplates();

      // Then: Should have correct categories
      const createProject = templates.find(t => t.name === 'create-project');
      expect(createProject?.category).toBe('project');

      const generateComponent = templates.find(t => t.name === 'generate-component');
      expect(generateComponent?.category).toBe('component');

      const runTests = templates.find(t => t.name === 'run-tests');
      expect(runTests?.category).toBe('testing');

      const deployApp = templates.find(t => t.name === 'deploy-app');
      expect(deployApp?.category).toBe('deployment');

      const setupDatabase = templates.find(t => t.name === 'setup-database');
      expect(setupDatabase?.category).toBe('database');
    });
  });
});
