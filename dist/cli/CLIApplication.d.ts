/**
 * CLI Application
 *
 * Main CLI application class that manages command execution,
 * registration, and user interface interactions.
 */
import { Command } from 'commander';
import { ICommand } from '../contracts/presentation-contracts';
import { IOutput } from '../contracts/presentation-contracts';
import { ILogger } from '../contracts/presentation-contracts';
export declare class CLIApplication {
    private commander;
    private commands;
    private output?;
    private errorOutput?;
    private logger?;
    constructor();
    private setupCommander;
    registerCommand(command: ICommand): void;
    unregisterCommand(name: string): void;
    getCommand(name: string): ICommand | null;
    listCommands(): ICommand[];
    execute(args: string[]): Promise<any>;
    showHelp(): void;
    showVersion(): void;
    setOutput(output: IOutput): void;
    setErrorOutput(errorOutput: IOutput): void;
    setLogger(logger: ILogger): void;
    getCommanderInstance(): Command;
}
