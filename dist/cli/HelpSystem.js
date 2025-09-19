"use strict";
/**
 * Help System
 *
 * Generates and formats help text for commands and the CLI application.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpSystem = void 0;
class HelpSystem {
    generateCommandHelp(command) {
        let help = `\nCommand: ${command.name}\n`;
        help += `Description: ${command.description}\n`;
        if (command.usage) {
            help += `Usage: ${command.usage}\n`;
        }
        if (command.arguments && command.arguments.length > 0) {
            help += `\nArguments:\n`;
            command.arguments.forEach(arg => {
                help += `  ${arg} (required)\n`;
            });
        }
        if (command.options && command.options.length > 0) {
            help += `\nOptions:\n`;
            command.options.forEach(option => {
                help += `  --${option.name}${option.aliases ? `, -${option.aliases[0]}` : ''}: ${option.description}\n`;
            });
        }
        if (command.examples && command.examples.length > 0) {
            help += `\nExamples:\n`;
            command.examples.forEach(example => {
                help += `  ${example.description}: ${example.command}\n`;
            });
        }
        return help;
    }
    generateGeneralHelp(commands) {
        let help = `\nUX-Kit CLI - UX Research Toolkit\n`;
        help += `Version: 1.0.0\n`;
        help += `\nA lightweight TypeScript CLI toolkit for UX research inspired by GitHub's spec-kit.\n`;
        help += `\nAvailable Commands:\n`;
        commands.forEach(command => {
            help += `  ${command.name.padEnd(20)} ${command.description}\n`;
        });
        help += `\nAI Agent Integration:\n`;
        help += `  --codex              Enable Codex AI agent integration\n`;
        help += `  --cursor             Enable Cursor IDE integration\n`;
        help += `  --custom             Enable custom AI agent integration\n`;
        help += `\nCodex Setup Commands:\n`;
        help += `  codex-setup --validate    Validate Codex CLI installation\n`;
        help += `  codex-setup --configure   Configure Codex settings\n`;
        help += `  codex-setup --test        Test Codex integration\n`;
        help += `\nFor more information about a specific command, use:\n`;
        help += `  uxkit <command> --help\n`;
        help += `\nDocumentation:\n`;
        help += `  CODEX_SETUP_GUIDE.md      Complete Codex setup guide\n`;
        help += `  CODEX_TROUBLESHOOTING_GUIDE.md  Troubleshooting guide\n`;
        return help;
    }
    formatHelpText(title, description) {
        let formatted = `\n${title}\n`;
        formatted += `${'='.repeat(title.length)}\n`;
        formatted += `${description}\n`;
        return formatted;
    }
}
exports.HelpSystem = HelpSystem;
//# sourceMappingURL=HelpSystem.js.map