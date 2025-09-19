/**
 * Help System
 *
 * Generates and formats help text for commands and the CLI application.
 */
import { ICommand } from '../contracts/presentation-contracts';
export declare class HelpSystem {
    generateCommandHelp(command: ICommand): string;
    generateGeneralHelp(commands: ICommand[]): string;
    formatHelpText(title: string, description: string): string;
}
