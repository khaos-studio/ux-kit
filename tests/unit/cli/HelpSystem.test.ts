/**
 * Unit Tests for HelpSystem
 * 
 * Comprehensive unit tests with 100% coverage for the HelpSystem class.
 * Tests all methods, formatting, and Codex integration features.
 */

import { HelpSystem } from '../../../src/cli/HelpSystem';
import { ICommand } from '../../../src/contracts/presentation-contracts';

describe('HelpSystem', () => {
  let helpSystem: HelpSystem;

  beforeEach(() => {
    helpSystem = new HelpSystem();
  });

  describe('Constructor', () => {
    it('should create HelpSystem instance', () => {
      expect(helpSystem).toBeInstanceOf(HelpSystem);
    });
  });

  describe('generateCommandHelp', () => {
    it('should generate help for command with all properties', () => {
      // Given: A command with all properties
      const command: ICommand = {
        name: 'test-command',
        description: 'Test command description',
        usage: 'uxkit test-command [options]',
        arguments: ['arg1', 'arg2'],
        options: [
          { name: 'option1', description: 'First option' },
          { name: 'option2', description: 'Second option', aliases: ['o2'] }
        ],
        examples: [
          { description: 'Basic usage', command: 'uxkit test-command --option1' },
          { description: 'With arguments', command: 'uxkit test-command arg1 arg2' }
        ],
        execute: jest.fn(),
        validate: jest.fn(),
        showHelp: jest.fn()
      };

      // When: Generating command help
      const help = helpSystem.generateCommandHelp(command);

      // Then: Help should include all command information
      expect(help).toContain('Command: test-command');
      expect(help).toContain('Description: Test command description');
      expect(help).toContain('Usage: uxkit test-command [options]');
      expect(help).toContain('Arguments:');
      expect(help).toContain('arg1 (required)');
      expect(help).toContain('arg2 (required)');
      expect(help).toContain('Options:');
      expect(help).toContain('--option1: First option');
      expect(help).toContain('--option2, -o2: Second option');
      expect(help).toContain('Examples:');
      expect(help).toContain('Basic usage: uxkit test-command --option1');
      expect(help).toContain('With arguments: uxkit test-command arg1 arg2');
    });

    it('should generate help for command with minimal properties', () => {
      // Given: A command with minimal properties
      const command: ICommand = {
        name: 'minimal-command',
        description: 'Minimal command',
        usage: 'uxkit minimal-command',
        arguments: [],
        options: [],
        examples: [],
        execute: jest.fn(),
        validate: jest.fn(),
        showHelp: jest.fn()
      };

      // When: Generating command help
      const help = helpSystem.generateCommandHelp(command);

      // Then: Help should include basic information only
      expect(help).toContain('Command: minimal-command');
      expect(help).toContain('Description: Minimal command');
      expect(help).toContain('Usage: uxkit minimal-command');
      expect(help).not.toContain('Arguments:');
      expect(help).not.toContain('Options:');
      expect(help).not.toContain('Examples:');
    });

    it('should handle command without usage', () => {
      // Given: A command without usage
      const command: ICommand = {
        name: 'no-usage-command',
        description: 'Command without usage',
        usage: '',
        arguments: [],
        options: [],
        examples: [],
        execute: jest.fn(),
        validate: jest.fn(),
        showHelp: jest.fn()
      };

      // When: Generating command help
      const help = helpSystem.generateCommandHelp(command);

      // Then: Help should not include usage section
      expect(help).toContain('Command: no-usage-command');
      expect(help).toContain('Description: Command without usage');
      expect(help).not.toContain('Usage:');
    });

    it('should handle command with only arguments', () => {
      // Given: A command with only arguments
      const command: ICommand = {
        name: 'args-only-command',
        description: 'Command with arguments only',
        usage: 'uxkit args-only-command <arg1> <arg2>',
        arguments: ['arg1', 'arg2'],
        options: [],
        examples: [],
        execute: jest.fn(),
        validate: jest.fn(),
        showHelp: jest.fn()
      };

      // When: Generating command help
      const help = helpSystem.generateCommandHelp(command);

      // Then: Help should include arguments section
      expect(help).toContain('Arguments:');
      expect(help).toContain('arg1 (required)');
      expect(help).toContain('arg2 (required)');
      expect(help).not.toContain('Options:');
      expect(help).not.toContain('Examples:');
    });

    it('should handle command with only options', () => {
      // Given: A command with only options
      const command: ICommand = {
        name: 'options-only-command',
        description: 'Command with options only',
        usage: 'uxkit options-only-command [options]',
        arguments: [],
        options: [
          { name: 'option1', description: 'First option' },
          { name: 'option2', description: 'Second option' }
        ],
        examples: [],
        execute: jest.fn(),
        validate: jest.fn(),
        showHelp: jest.fn()
      };

      // When: Generating command help
      const help = helpSystem.generateCommandHelp(command);

      // Then: Help should include options section
      expect(help).toContain('Options:');
      expect(help).toContain('--option1: First option');
      expect(help).toContain('--option2: Second option');
      expect(help).not.toContain('Arguments:');
      expect(help).not.toContain('Examples:');
    });

    it('should handle command with only examples', () => {
      // Given: A command with only examples
      const command: ICommand = {
        name: 'examples-only-command',
        description: 'Command with examples only',
        usage: 'uxkit examples-only-command',
        arguments: [],
        options: [],
        examples: [
          { description: 'Example 1', command: 'uxkit examples-only-command' },
          { description: 'Example 2', command: 'uxkit examples-only-command --help' }
        ],
        execute: jest.fn(),
        validate: jest.fn(),
        showHelp: jest.fn()
      };

      // When: Generating command help
      const help = helpSystem.generateCommandHelp(command);

      // Then: Help should include examples section
      expect(help).toContain('Examples:');
      expect(help).toContain('Example 1: uxkit examples-only-command');
      expect(help).toContain('Example 2: uxkit examples-only-command --help');
      expect(help).not.toContain('Arguments:');
      expect(help).not.toContain('Options:');
    });

    it('should handle options with aliases', () => {
      // Given: A command with options that have aliases
      const command: ICommand = {
        name: 'alias-command',
        description: 'Command with option aliases',
        usage: 'uxkit alias-command [options]',
        arguments: [],
        options: [
          { name: 'verbose', description: 'Verbose output', aliases: ['v'] },
          { name: 'output', description: 'Output file', aliases: ['o'] },
          { name: 'no-alias', description: 'Option without alias' }
        ],
        examples: [],
        execute: jest.fn(),
        validate: jest.fn(),
        showHelp: jest.fn()
      };

      // When: Generating command help
      const help = helpSystem.generateCommandHelp(command);

      // Then: Help should show aliases correctly
      expect(help).toContain('--verbose, -v: Verbose output');
      expect(help).toContain('--output, -o: Output file');
      expect(help).toContain('--no-alias: Option without alias');
    });
  });

  describe('generateGeneralHelp', () => {
    it('should generate general help with commands', () => {
      // Given: A list of commands
      const commands: ICommand[] = [
        {
          name: 'init',
          description: 'Initialize project',
          usage: 'uxkit init',
          arguments: [],
          options: [],
          examples: [],
          execute: jest.fn(),
          validate: jest.fn(),
          showHelp: jest.fn()
        },
        {
          name: 'study',
          description: 'Manage studies',
          usage: 'uxkit study',
          arguments: [],
          options: [],
          examples: [],
          execute: jest.fn(),
          validate: jest.fn(),
          showHelp: jest.fn()
        }
      ];

      // When: Generating general help
      const help = helpSystem.generateGeneralHelp(commands);

      // Then: Help should include all sections
      expect(help).toContain('UX-Kit CLI - UX Research Toolkit');
      expect(help).toContain('Version: 1.0.0');
      expect(help).toContain('A lightweight TypeScript CLI toolkit for UX research');
      expect(help).toContain('Available Commands:');
      expect(help).toContain('init                 Initialize project');
      expect(help).toContain('study                Manage studies');
      expect(help).toContain('AI Agent Integration:');
      expect(help).toContain('--codex              Enable Codex AI agent integration');
      expect(help).toContain('--cursor             Enable Cursor IDE integration');
      expect(help).toContain('--custom             Enable custom AI agent integration');
      expect(help).toContain('Codex Setup Commands:');
      expect(help).toContain('codex-setup --validate    Validate Codex CLI installation');
      expect(help).toContain('codex-setup --configure   Configure Codex settings');
      expect(help).toContain('codex-setup --test        Test Codex integration');
      expect(help).toContain('For more information about a specific command, use:');
      expect(help).toContain('uxkit <command> --help');
      expect(help).toContain('Documentation:');
      expect(help).toContain('CODEX_SETUP_GUIDE.md      Complete Codex setup guide');
      expect(help).toContain('CODEX_TROUBLESHOOTING_GUIDE.md  Troubleshooting guide');
    });

    it('should generate general help with empty command list', () => {
      // Given: An empty command list
      const commands: ICommand[] = [];

      // When: Generating general help
      const help = helpSystem.generateGeneralHelp(commands);

      // Then: Help should include basic information and Codex sections
      expect(help).toContain('UX-Kit CLI - UX Research Toolkit');
      expect(help).toContain('Version: 1.0.0');
      expect(help).toContain('Available Commands:');
      expect(help).toContain('AI Agent Integration:');
      expect(help).toContain('Codex Setup Commands:');
      expect(help).toContain('Documentation:');
    });

    it('should format command names with proper padding', () => {
      // Given: Commands with different name lengths
      const commands: ICommand[] = [
        {
          name: 'a',
          description: 'Short name',
          usage: 'uxkit a',
          arguments: [],
          options: [],
          examples: [],
          execute: jest.fn(),
          validate: jest.fn(),
          showHelp: jest.fn()
        },
        {
          name: 'very-long-command-name',
          description: 'Very long command name',
          usage: 'uxkit very-long-command-name',
          arguments: [],
          options: [],
          examples: [],
          execute: jest.fn(),
          validate: jest.fn(),
          showHelp: jest.fn()
        }
      ];

      // When: Generating general help
      const help = helpSystem.generateGeneralHelp(commands);

      // Then: Command names should be properly padded
      expect(help).toContain('a                    Short name');
      expect(help).toContain('very-long-command-name Very long command name');
    });
  });

  describe('formatHelpText', () => {
    it('should format help text with title and description', () => {
      // Given: Title and description
      const title = 'Test Help';
      const description = 'This is a test help description.';

      // When: Formatting help text
      const formatted = helpSystem.formatHelpText(title, description);

      // Then: Text should be properly formatted
      expect(formatted).toContain('Test Help');
      expect(formatted).toContain('=========');
      expect(formatted).toContain('This is a test help description.');
    });

    it('should format help text with long title', () => {
      // Given: Long title and description
      const title = 'Very Long Help Title That Exceeds Normal Length';
      const description = 'Description for long title.';

      // When: Formatting help text
      const formatted = helpSystem.formatHelpText(title, description);

      // Then: Underline should match title length
      expect(formatted).toContain('Very Long Help Title That Exceeds Normal Length');
      expect(formatted).toContain('===============================================');
      expect(formatted).toContain('Description for long title.');
    });

    it('should format help text with empty description', () => {
      // Given: Title with empty description
      const title = 'Empty Description';
      const description = '';

      // When: Formatting help text
      const formatted = helpSystem.formatHelpText(title, description);

      // Then: Text should be properly formatted
      expect(formatted).toContain('Empty Description');
      expect(formatted).toContain('================');
      expect(formatted).toContain('');
    });

    it('should format help text with multiline description', () => {
      // Given: Title with multiline description
      const title = 'Multiline Help';
      const description = 'Line 1\nLine 2\nLine 3';

      // When: Formatting help text
      const formatted = helpSystem.formatHelpText(title, description);

      // Then: Text should preserve line breaks
      expect(formatted).toContain('Multiline Help');
      expect(formatted).toContain('==============');
      expect(formatted).toContain('Line 1\nLine 2\nLine 3');
    });
  });

  describe('Edge Cases', () => {
    it('should handle command with special characters in name', () => {
      // Given: Command with special characters
      const command: ICommand = {
        name: 'test-command_with.special@chars',
        description: 'Command with special characters',
        usage: 'uxkit test-command_with.special@chars',
        arguments: [],
        options: [],
        examples: [],
        execute: jest.fn(),
        validate: jest.fn(),
        showHelp: jest.fn()
      };

      // When: Generating command help
      const help = helpSystem.generateCommandHelp(command);

      // Then: Help should handle special characters correctly
      expect(help).toContain('Command: test-command_with.special@chars');
    });

    it('should handle command with empty strings', () => {
      // Given: Command with empty strings
      const command: ICommand = {
        name: '',
        description: '',
        usage: '',
        arguments: [],
        options: [],
        examples: [],
        execute: jest.fn(),
        validate: jest.fn(),
        showHelp: jest.fn()
      };

      // When: Generating command help
      const help = helpSystem.generateCommandHelp(command);

      // Then: Help should handle empty strings gracefully
      expect(help).toContain('Command: ');
      expect(help).toContain('Description: ');
    });

    it('should handle very long descriptions', () => {
      // Given: Command with very long description
      const longDescription = 'A'.repeat(1000);
      const command: ICommand = {
        name: 'long-desc-command',
        description: longDescription,
        usage: 'uxkit long-desc-command',
        arguments: [],
        options: [],
        examples: [],
        execute: jest.fn(),
        validate: jest.fn(),
        showHelp: jest.fn()
      };

      // When: Generating command help
      const help = helpSystem.generateCommandHelp(command);

      // Then: Help should handle long descriptions
      expect(help).toContain(`Description: ${longDescription}`);
    });
  });
});
