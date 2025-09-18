/**
 * Cursor IDE Integration
 * 
 * Implements Cursor IDE integration for slash commands in UX-Kit.
 * Provides seamless integration with Cursor IDE for research workflows.
 */

import { ICursorIntegration, ISlashCommand, CursorPosition, NotificationType } from '../contracts/presentation-contracts';
import { IDEInterface } from './IDEInterface';
import { CommandExecutor, CommandExecutionContext } from './CommandExecutor';

/**
 * Cursor IDE Integration implementation
 */
export class CursorIntegration implements ICursorIntegration {
  readonly name = 'cursor' as const;
  readonly version = '1.0.0';
  readonly supportedCommands: string[] = [
    'research:questions',
    'research:sources',
    'research:summarize',
    'research:interview',
    'research:synthesize',
    'study:create',
    'study:list',
    'study:show',
    'study:delete'
  ];

  private registeredCommands: Map<string, ISlashCommand> = new Map();
  private ideInterface: IDEInterface;
  private commandExecutor: CommandExecutor;

  constructor(ideInterface: IDEInterface, commandExecutor: CommandExecutor) {
    this.ideInterface = ideInterface;
    this.commandExecutor = commandExecutor;
    this.initializeDefaultCommands();
  }

  /**
   * Register a slash command
   */
  registerSlashCommand(command: ISlashCommand): void {
    this.registeredCommands.set(command.name, command);
  }

  /**
   * Unregister a slash command
   */
  unregisterSlashCommand(name: string): void {
    this.registeredCommands.delete(name);
  }

  /**
   * Get a registered slash command
   */
  getSlashCommand(name: string): ISlashCommand | null {
    return this.registeredCommands.get(name) || null;
  }

  /**
   * List all registered slash commands
   */
  listSlashCommands(): ISlashCommand[] {
    return Array.from(this.registeredCommands.values());
  }

  /**
   * Execute a slash command
   */
  async executeSlashCommand(name: string, args: string[]): Promise<void> {
    const command = this.getSlashCommand(name);
    if (!command) {
      throw new Error(`Unknown command: ${name}`);
    }

    // Get current context from IDE
    const context: CommandExecutionContext = {
      workspace: await this.getCurrentWorkspace(),
      currentFile: await this.getCurrentFile(),
      selection: await this.getSelection(),
      cursorPosition: await this.getCursorPosition()
    };

    try {
      // Execute the command
      const result = await this.commandExecutor.execute(name, args, context);

      if (result.success) {
        // Show success notification
        await this.showNotification(
          `Command "${name}" executed successfully`,
          NotificationType.SUCCESS
        );

        // If there's output, insert it at cursor position
        if (result.output) {
          await this.insertText(result.output);
        }
      } else {
        // Show error notification
        await this.showNotification(
          `Command "${name}" failed: ${result.error}`,
          NotificationType.ERROR
        );
      }
    } catch (error) {
      // Show error notification
      await this.showNotification(
        `Command "${name}" failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        NotificationType.ERROR
      );
      throw error;
    }
  }

  /**
   * Show help for a specific slash command
   */
  showSlashCommandHelp(name: string): void {
    const command = this.getSlashCommand(name);
    if (!command) {
      this.showNotification(`Command "${name}" not found`, NotificationType.ERROR);
      return;
    }

    const help = this.formatCommandHelp(command);
    this.showNotification(help, NotificationType.INFO);
  }

  /**
   * Show help for all available slash commands
   */
  showAllSlashCommands(): void {
    const commands = this.listSlashCommands();
    if (commands.length === 0) {
      this.showNotification('No commands available', NotificationType.INFO);
      return;
    }

    const help = this.formatAllCommandsHelp(commands);
    this.showNotification(help, NotificationType.INFO);
  }

  /**
   * Get current workspace from Cursor
   */
  async getCurrentWorkspace(): Promise<string> {
    return await this.ideInterface.getCurrentWorkspace();
  }

  /**
   * Get current file from Cursor
   */
  async getCurrentFile(): Promise<string | null> {
    return await this.ideInterface.getCurrentFile();
  }

  /**
   * Get current selection from Cursor
   */
  async getSelection(): Promise<string | null> {
    return await this.ideInterface.getSelection();
  }

  /**
   * Get cursor position from Cursor
   */
  async getCursorPosition(): Promise<CursorPosition | null> {
    return await this.ideInterface.getCursorPosition();
  }

  /**
   * Insert text at cursor position
   */
  async insertText(text: string, position?: CursorPosition): Promise<void> {
    await this.ideInterface.insertText(text, position);
  }

  /**
   * Replace current selection with new text
   */
  async replaceSelection(text: string): Promise<void> {
    await this.ideInterface.replaceSelection(text);
  }

  /**
   * Show notification to user
   */
  async showNotification(message: string, type: NotificationType = NotificationType.INFO): Promise<void> {
    await this.ideInterface.showNotification(message, type);
  }

  /**
   * Initialize default commands
   */
  private initializeDefaultCommands(): void {
    // Research commands
    this.registerSlashCommand({
      name: 'research:questions',
      description: 'Generate research questions for a study',
      parameters: ['study (required)', 'topic (required)', 'count (optional)', 'format (optional)'],
      examples: [
        '/research:questions --study="user-interviews" --topic="e-commerce checkout"',
        '/research:questions --study="usability-test" --topic="mobile app" --count=10 --format="markdown"'
      ]
    });

    this.registerSlashCommand({
      name: 'research:sources',
      description: 'Gather research sources and references',
      parameters: ['study (required)', 'keywords (required)', 'format (optional)', 'limit (optional)'],
      examples: [
        '/research:sources --study="user-interviews" --keywords="UX, usability, e-commerce"',
        '/research:sources --study="usability-test" --keywords="mobile, app, design" --limit=20'
      ]
    });

    this.registerSlashCommand({
      name: 'research:summarize',
      description: 'Create a summary of research findings',
      parameters: ['study (required)', 'format (optional)', 'length (optional)'],
      examples: [
        '/research:summarize --study="user-interviews"',
        '/research:summarize --study="usability-test" --format="markdown" --length="brief"'
      ]
    });

    this.registerSlashCommand({
      name: 'research:interview',
      description: 'Process and format interview data',
      parameters: ['study (required)', 'participant (required)', 'format (optional)', 'template (optional)'],
      examples: [
        '/research:interview --study="user-interviews" --participant="P001"',
        '/research:interview --study="usability-test" --participant="P002" --template="standard"'
      ]
    });

    this.registerSlashCommand({
      name: 'research:synthesize',
      description: 'Synthesize research insights and findings',
      parameters: ['study (required)', 'insights (required)', 'format (optional)', 'output (optional)'],
      examples: [
        '/research:synthesize --study="user-interviews" --insights="key-findings"',
        '/research:synthesize --study="usability-test" --insights="patterns" --format="report"'
      ]
    });

    // Study commands
    this.registerSlashCommand({
      name: 'study:create',
      description: 'Create a new research study',
      parameters: ['name (required)', 'description (required)', 'template (optional)', 'format (optional)'],
      examples: [
        '/study:create --name="e-commerce-usability" --description="Usability study for checkout flow"',
        '/study:create --name="mobile-app-test" --description="Mobile app usability testing" --template="standard"'
      ]
    });

    this.registerSlashCommand({
      name: 'study:list',
      description: 'List all available studies',
      parameters: ['format (optional)', 'filter (optional)'],
      examples: [
        '/study:list',
        '/study:list --format="table" --filter="active"'
      ]
    });

    this.registerSlashCommand({
      name: 'study:show',
      description: 'Show details of a specific study',
      parameters: ['name (required)', 'format (optional)', 'details (optional)'],
      examples: [
        '/study:show --name="e-commerce-usability"',
        '/study:show --name="mobile-app-test" --format="detailed" --details'
      ]
    });

    this.registerSlashCommand({
      name: 'study:delete',
      description: 'Delete a research study',
      parameters: ['name (required)', 'confirm (optional)', 'force (optional)'],
      examples: [
        '/study:delete --name="old-study" --confirm',
        '/study:delete --name="test-study" --confirm --force'
      ]
    });
  }

  /**
   * Format command help text
   */
  private formatCommandHelp(command: ISlashCommand): string {
    return `# ${command.name}\n\n${command.description}\n\n**Parameters:**\n${command.parameters.map(p => `- ${p}`).join('\n')}\n\n**Examples:**\n${command.examples.map(e => `- ${e}`).join('\n')}`;
  }

  /**
   * Format all commands help text
   */
  private formatAllCommandsHelp(commands: ISlashCommand[]): string {
    const commandList = commands.map(cmd => `- ${cmd.name}: ${cmd.description}`).join('\n');
    return `# Available Commands\n\n${commandList}\n\nUse \`/help <command>\` for detailed information about a specific command.`;
  }
}
