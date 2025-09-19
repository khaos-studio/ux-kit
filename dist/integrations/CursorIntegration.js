"use strict";
/**
 * Cursor IDE Integration
 *
 * Implements Cursor IDE integration for slash commands in UX-Kit.
 * Provides seamless integration with Cursor IDE for research workflows.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursorIntegration = void 0;
const presentation_contracts_1 = require("../contracts/presentation-contracts");
/**
 * Cursor IDE Integration implementation
 */
class CursorIntegration {
    constructor(ideInterface, commandExecutor) {
        this.name = 'cursor';
        this.version = '1.0.0';
        this.supportedCommands = [
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
        this.registeredCommands = new Map();
        this.ideInterface = ideInterface;
        this.commandExecutor = commandExecutor;
        this.initializeDefaultCommands();
    }
    /**
     * Check if Cursor is available
     */
    async isAvailable() {
        try {
            return await this.ideInterface.isCursorAvailable();
        }
        catch {
            return false;
        }
    }
    /**
     * Get Cursor version
     */
    async getVersion() {
        try {
            return await this.ideInterface.getCursorVersion();
        }
        catch {
            return null;
        }
    }
    /**
     * Register a slash command
     */
    registerSlashCommand(command) {
        this.registeredCommands.set(command.name, command);
    }
    /**
     * Unregister a slash command
     */
    unregisterSlashCommand(name) {
        this.registeredCommands.delete(name);
    }
    /**
     * Get a registered slash command
     */
    getSlashCommand(name) {
        return this.registeredCommands.get(name) || null;
    }
    /**
     * List all registered slash commands
     */
    listSlashCommands() {
        return Array.from(this.registeredCommands.values());
    }
    /**
     * Execute a slash command
     */
    async executeSlashCommand(name, args) {
        const command = this.getSlashCommand(name);
        if (!command) {
            throw new Error(`Unknown command: ${name}`);
        }
        // Get current context from IDE
        const context = {
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
                await this.showNotification(`Command "${name}" executed successfully`, presentation_contracts_1.NotificationType.SUCCESS);
                // If there's output, insert it at cursor position
                if (result.output) {
                    await this.insertText(result.output);
                }
            }
            else {
                // Show error notification
                await this.showNotification(`Command "${name}" failed: ${result.error}`, presentation_contracts_1.NotificationType.ERROR);
            }
        }
        catch (error) {
            // Show error notification
            await this.showNotification(`Command "${name}" failed: ${error instanceof Error ? error.message : 'Unknown error'}`, presentation_contracts_1.NotificationType.ERROR);
            throw error;
        }
    }
    /**
     * Show help for a specific slash command
     */
    showSlashCommandHelp(name) {
        const command = this.getSlashCommand(name);
        if (!command) {
            this.showNotification(`Command "${name}" not found`, presentation_contracts_1.NotificationType.ERROR);
            return;
        }
        const help = this.formatCommandHelp(command);
        this.showNotification(help, presentation_contracts_1.NotificationType.INFO);
    }
    /**
     * Show help for all available slash commands
     */
    showAllSlashCommands() {
        const commands = this.listSlashCommands();
        if (commands.length === 0) {
            this.showNotification('No commands available', presentation_contracts_1.NotificationType.INFO);
            return;
        }
        const help = this.formatAllCommandsHelp(commands);
        this.showNotification(help, presentation_contracts_1.NotificationType.INFO);
    }
    /**
     * Get current workspace from Cursor
     */
    async getCurrentWorkspace() {
        return await this.ideInterface.getCurrentWorkspace();
    }
    /**
     * Get current file from Cursor
     */
    async getCurrentFile() {
        return await this.ideInterface.getCurrentFile();
    }
    /**
     * Get current selection from Cursor
     */
    async getSelection() {
        return await this.ideInterface.getSelection();
    }
    /**
     * Get cursor position from Cursor
     */
    async getCursorPosition() {
        return await this.ideInterface.getCursorPosition();
    }
    /**
     * Insert text at cursor position
     */
    async insertText(text, position) {
        await this.ideInterface.insertText(text, position);
    }
    /**
     * Replace current selection with new text
     */
    async replaceSelection(text) {
        await this.ideInterface.replaceSelection(text);
    }
    /**
     * Show notification to user
     */
    async showNotification(message, type = presentation_contracts_1.NotificationType.INFO) {
        await this.ideInterface.showNotification(message, type);
    }
    /**
     * Create execute function for slash commands
     */
    createExecuteFunction(commandName) {
        return async (params) => {
            await this.executeSlashCommand(commandName, Object.keys(params));
        };
    }
    /**
     * Initialize default commands
     */
    initializeDefaultCommands() {
        // Research commands
        this.registerSlashCommand({
            name: 'research:questions',
            description: 'Generate research questions for a study',
            parameters: ['study (required)', 'topic (required)', 'count (optional)', 'format (optional)'],
            examples: [
                '/research:questions --study="user-interviews" --topic="e-commerce checkout"',
                '/research:questions --study="usability-test" --topic="mobile app" --count=10 --format="markdown"'
            ],
            execute: this.createExecuteFunction('research:questions')
        });
        this.registerSlashCommand({
            name: 'research:sources',
            description: 'Gather research sources and references',
            parameters: ['study (required)', 'keywords (required)', 'format (optional)', 'limit (optional)'],
            examples: [
                '/research:sources --study="user-interviews" --keywords="UX, usability, e-commerce"',
                '/research:sources --study="usability-test" --keywords="mobile, app, design" --limit=20'
            ],
            execute: this.createExecuteFunction('research:sources')
        });
        this.registerSlashCommand({
            name: 'research:summarize',
            description: 'Create a summary of research findings',
            parameters: ['study (required)', 'format (optional)', 'length (optional)'],
            examples: [
                '/research:summarize --study="user-interviews"',
                '/research:summarize --study="usability-test" --format="markdown" --length="brief"'
            ],
            execute: this.createExecuteFunction('research:summarize')
        });
        this.registerSlashCommand({
            name: 'research:interview',
            description: 'Process and format interview data',
            parameters: ['study (required)', 'participant (required)', 'format (optional)', 'template (optional)'],
            examples: [
                '/research:interview --study="user-interviews" --participant="P001"',
                '/research:interview --study="usability-test" --participant="P002" --template="standard"'
            ],
            execute: this.createExecuteFunction('research:interview')
        });
        this.registerSlashCommand({
            name: 'research:synthesize',
            description: 'Synthesize research insights and findings',
            parameters: ['study (required)', 'insights (required)', 'format (optional)', 'output (optional)'],
            examples: [
                '/research:synthesize --study="user-interviews" --insights="key-findings"',
                '/research:synthesize --study="usability-test" --insights="patterns" --format="report"'
            ],
            execute: this.createExecuteFunction('research:synthesize')
        });
        // Study commands
        this.registerSlashCommand({
            name: 'study:create',
            description: 'Create a new research study',
            parameters: ['name (required)', 'description (required)', 'template (optional)', 'format (optional)'],
            examples: [
                '/study:create --name="e-commerce-usability" --description="Usability study for checkout flow"',
                '/study:create --name="mobile-app-test" --description="Mobile app usability testing" --template="standard"'
            ],
            execute: this.createExecuteFunction('study:create')
        });
        this.registerSlashCommand({
            name: 'study:list',
            description: 'List all available studies',
            parameters: ['format (optional)', 'filter (optional)'],
            examples: [
                '/study:list',
                '/study:list --format="table" --filter="active"'
            ],
            execute: this.createExecuteFunction('study:list')
        });
        this.registerSlashCommand({
            name: 'study:show',
            description: 'Show details of a specific study',
            parameters: ['name (required)', 'format (optional)', 'details (optional)'],
            examples: [
                '/study:show --name="e-commerce-usability"',
                '/study:show --name="mobile-app-test" --format="detailed" --details'
            ],
            execute: this.createExecuteFunction('study:show')
        });
        this.registerSlashCommand({
            name: 'study:delete',
            description: 'Delete a research study',
            parameters: ['name (required)', 'confirm (optional)', 'force (optional)'],
            examples: [
                '/study:delete --name="old-study" --confirm',
                '/study:delete --name="test-study" --confirm --force'
            ],
            execute: this.createExecuteFunction('study:delete')
        });
    }
    /**
     * Format command help text
     */
    formatCommandHelp(command) {
        const examples = command.examples ? command.examples.map(e => `- ${e}`).join('\n') : 'No examples available';
        return `# ${command.name}\n\n${command.description}\n\n**Parameters:**\n${command.parameters.map(p => `- ${p}`).join('\n')}\n\n**Examples:**\n${examples}`;
    }
    /**
     * Format all commands help text
     */
    formatAllCommandsHelp(commands) {
        const commandList = commands.map(cmd => `- ${cmd.name}: ${cmd.description}`).join('\n');
        return `# Available Commands\n\n${commandList}\n\nUse \`/help <command>\` for detailed information about a specific command.`;
    }
}
exports.CursorIntegration = CursorIntegration;
//# sourceMappingURL=CursorIntegration.js.map