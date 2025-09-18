/**
 * Help System
 * 
 * Generates and formats help text for commands and the CLI application.
 */

import { ICommand } from '../contracts/presentation-contracts';

export class HelpSystem {
  generateCommandHelp(command: ICommand): string {
    let help = `\nCommand: ${command.name}\n`;
    help += `Description: ${command.description}\n`;
    
    if (command.usage) {
      help += `Usage: ${command.usage}\n`;
    }

    if (command.arguments && command.arguments.length > 0) {
      help += `\nArguments:\n`;
      command.arguments.forEach(arg => {
        help += `  ${arg.name}${arg.required ? ' (required)' : ' (optional)'}: ${arg.description}\n`;
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

  generateGeneralHelp(commands: ICommand[]): string {
    let help = `\nUX-Kit CLI - UX Research Toolkit\n`;
    help += `Version: 1.0.0\n`;
    help += `\nA lightweight TypeScript CLI toolkit for UX research inspired by GitHub's spec-kit.\n`;
    help += `\nAvailable Commands:\n`;

    commands.forEach(command => {
      help += `  ${command.name.padEnd(20)} ${command.description}\n`;
    });

    help += `\nFor more information about a specific command, use:\n`;
    help += `  uxkit <command> --help\n`;

    return help;
  }

  formatHelpText(title: string, description: string): string {
    let formatted = `\n${title}\n`;
    formatted += `${'='.repeat(title.length)}\n`;
    formatted += `${description}\n`;
    return formatted;
  }
}
