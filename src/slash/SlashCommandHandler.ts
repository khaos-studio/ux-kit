/**
 * Slash Command Handler
 * 
 * Main handler for processing slash commands in IDE integration.
 */

import { CommandParser, ParsedCommand } from './CommandParser';
import { ResponseFormatter, CommandResponse, IDECommandRequest } from './ResponseFormatter';
import { IDEIntegration } from './IDEIntegration';

export class SlashCommandHandler {
  private commandParser: CommandParser;
  private responseFormatter: ResponseFormatter;
  private ideIntegration: IDEIntegration;

  constructor(
    commandParser: CommandParser,
    responseFormatter: ResponseFormatter,
    ideIntegration: IDEIntegration
  ) {
    this.commandParser = commandParser;
    this.responseFormatter = responseFormatter;
    this.ideIntegration = ideIntegration;
  }

  /**
   * Handle a slash command
   */
  async handleCommand(commandString: string): Promise<CommandResponse> {
    const startTime = Date.now();

    try {
      // Parse the command
      const parsedCommand = this.commandParser.parse(commandString);

      // Validate the command
      const validation = this.commandParser.validate(parsedCommand);
      if (!validation.isValid) {
        const executionTime = Date.now() - startTime;
        return this.responseFormatter.formatValidationError(
          parsedCommand.command,
          parsedCommand.parameters,
          validation.errors,
          executionTime
        );
      }

      // Execute the command
      const result = await this.executeCommand(parsedCommand);

      const executionTime = Date.now() - startTime;

      return this.responseFormatter.formatSuccess(
        parsedCommand.command,
        parsedCommand.parameters,
        result,
        executionTime
      );

    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      if (error instanceof Error) {
        if (error.message.includes('Empty command') || 
            error.message.includes('Command must start with /') ||
            error.message.includes('Invalid command format') ||
            error.message.includes('Malformed command')) {
          return this.responseFormatter.formatParsingError(
            commandString,
            error.message,
            executionTime
          );
        } else if (error.message.includes('Unknown command')) {
          return this.responseFormatter.formatError(
            'unknown',
            {},
            error.message,
            executionTime
          );
        }
      }

      return this.responseFormatter.formatExecutionError(
        'unknown',
        {},
        error instanceof Error ? error.message : 'Unknown error',
        executionTime
      );
    }
  }

  /**
   * Handle IDE command request
   */
  async handleIDECommand(request: IDECommandRequest): Promise<CommandResponse> {
    const startTime = Date.now();

    try {
      const ideResponse = await this.ideIntegration.executeCommand(request);
      const executionTime = Date.now() - startTime;

      if (ideResponse.success) {
        return this.responseFormatter.formatSuccess(
          'ide-command',
          { originalCommand: request.command },
          ideResponse.response || 'Command executed successfully',
          executionTime,
          { context: ideResponse.context }
        );
      } else {
        return this.responseFormatter.formatError(
          'ide-command',
          { originalCommand: request.command },
          ideResponse.error || 'Command execution failed',
          executionTime,
          { context: ideResponse.context }
        );
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      return this.responseFormatter.formatExecutionError(
        'ide-command',
        { originalCommand: request.command },
        error instanceof Error ? error.message : 'Unknown error',
        executionTime
      );
    }
  }

  /**
   * Get help for commands
   */
  async getHelp(command?: string): Promise<CommandResponse> {
    const startTime = Date.now();

    try {
      const helpResponse = await this.ideIntegration.getHelp({
        type: 'help',
        command
      });

      const executionTime = Date.now() - startTime;

      if (helpResponse.success) {
        return this.responseFormatter.formatHelpResponse(
          command || 'all',
          helpResponse.help,
          executionTime
        );
      } else {
        return this.responseFormatter.formatError(
          'help',
          { command },
          helpResponse.help,
          executionTime
        );
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      return this.responseFormatter.formatExecutionError(
        'help',
        { command },
        error instanceof Error ? error.message : 'Unknown error',
        executionTime
      );
    }
  }

  /**
   * List available commands
   */
  async listCommands(): Promise<CommandResponse> {
    const startTime = Date.now();

    try {
      const commands = this.commandParser.getAvailableCommands();
      const executionTime = Date.now() - startTime;

      return this.responseFormatter.formatCommandListResponse(
        commands,
        executionTime
      );
    } catch (error) {
      const executionTime = Date.now() - startTime;
      return this.responseFormatter.formatExecutionError(
        'list',
        {},
        error instanceof Error ? error.message : 'Unknown error',
        executionTime
      );
    }
  }

  /**
   * Register commands with IDE
   */
  async registerCommands(commands: string[]): Promise<CommandResponse> {
    const startTime = Date.now();

    try {
      const result = await this.ideIntegration.registerCommands(commands);
      const executionTime = Date.now() - startTime;

      if (result.success) {
        return this.responseFormatter.formatSuccess(
          'register',
          { commands },
          `Successfully registered ${result.registeredCommands.length} commands`,
          executionTime,
          { registeredCommands: result.registeredCommands }
        );
      } else {
        return this.responseFormatter.formatError(
          'register',
          { commands },
          `Registration failed: ${result.errors.join(', ')}`,
          executionTime,
          { errors: result.errors }
        );
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      return this.responseFormatter.formatExecutionError(
        'register',
        { commands },
        error instanceof Error ? error.message : 'Unknown error',
        executionTime
      );
    }
  }

  /**
   * Execute a parsed command
   */
  private async executeCommand(parsedCommand: ParsedCommand): Promise<string> {
    const { command, parameters } = parsedCommand;

    // Simulate command execution based on command type
    switch (command) {
      case 'research:questions':
        return this.executeResearchQuestions(parameters);
      case 'research:sources':
        return this.executeResearchSources(parameters);
      case 'research:summarize':
        return this.executeResearchSummarize(parameters);
      case 'research:interview':
        return this.executeResearchInterview(parameters);
      case 'research:synthesize':
        return this.executeResearchSynthesize(parameters);
      case 'study:create':
        return this.executeStudyCreate(parameters);
      case 'study:list':
        return this.executeStudyList(parameters);
      case 'study:show':
        return this.executeStudyShow(parameters);
      case 'study:delete':
        return this.executeStudyDelete(parameters);
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  }

  /**
   * Execute research:questions command
   */
  private async executeResearchQuestions(parameters: Record<string, any>): Promise<string> {
    const { study, topic, count = 5, format = 'markdown' } = parameters;
    // Add small delay to make execution time measurable
    await new Promise(resolve => setTimeout(resolve, 1));
    return `Research questions generated for study "${study}" on topic "${topic}" (${count} questions, ${format} format)`;
  }

  /**
   * Execute research:sources command
   */
  private async executeResearchSources(parameters: Record<string, any>): Promise<string> {
    const { study, keywords, format = 'markdown', limit = 10 } = parameters;
    await new Promise(resolve => setTimeout(resolve, 1));
    return `Research sources gathered for study "${study}" with keywords "${keywords}" (${limit} sources, ${format} format)`;
  }

  /**
   * Execute research:summarize command
   */
  private async executeResearchSummarize(parameters: Record<string, any>): Promise<string> {
    const { study, format = 'markdown', length = 'medium' } = parameters;
    await new Promise(resolve => setTimeout(resolve, 1));
    return `Research summary created for study "${study}" (${length} length, ${format} format)`;
  }

  /**
   * Execute research:interview command
   */
  private async executeResearchInterview(parameters: Record<string, any>): Promise<string> {
    const { study, participant, format = 'markdown', template = 'standard' } = parameters;
    await new Promise(resolve => setTimeout(resolve, 1));
    return `Interview data processed for study "${study}" participant "${participant}" (${template} template, ${format} format)`;
  }

  /**
   * Execute research:synthesize command
   */
  private async executeResearchSynthesize(parameters: Record<string, any>): Promise<string> {
    const { study, insights, format = 'markdown', output = 'report' } = parameters;
    await new Promise(resolve => setTimeout(resolve, 1));
    return `Research synthesis completed for study "${study}" with insights "${insights}" (${output} output, ${format} format)`;
  }

  /**
   * Execute study:create command
   */
  private async executeStudyCreate(parameters: Record<string, any>): Promise<string> {
    const { name, description, template = 'standard', format = 'markdown' } = parameters;
    await new Promise(resolve => setTimeout(resolve, 1));
    return `Study "${name}" created successfully: ${description} (${template} template, ${format} format)`;
  }

  /**
   * Execute study:list command
   */
  private async executeStudyList(parameters: Record<string, any>): Promise<string> {
    const { format = 'table', filter } = parameters;
    const filterText = filter ? ` with filter "${filter}"` : '';
    await new Promise(resolve => setTimeout(resolve, 1));
    return `Studies listed successfully (${format} format${filterText})`;
  }

  /**
   * Execute study:show command
   */
  private async executeStudyShow(parameters: Record<string, any>): Promise<string> {
    const { name, format = 'detailed', details = false } = parameters;
    const detailsText = details ? ' with full details' : '';
    await new Promise(resolve => setTimeout(resolve, 1));
    return `Study details for "${name}" (${format} format${detailsText})`;
  }

  /**
   * Execute study:delete command
   */
  private async executeStudyDelete(parameters: Record<string, any>): Promise<string> {
    const { name, confirm = false, force = false } = parameters;
    if (!confirm) {
      throw new Error('Deletion requires confirmation. Use --confirm flag.');
    }
    const forceText = force ? ' (forced)' : '';
    await new Promise(resolve => setTimeout(resolve, 1));
    return `Study "${name}" deleted successfully${forceText}`;
  }
}
