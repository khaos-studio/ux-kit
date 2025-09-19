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

export class CLIApplication {
  private commander: Command;
  private commands: Map<string, ICommand> = new Map();
  private output?: IOutput;
  private errorOutput?: IOutput;
  private logger?: ILogger;

  constructor() {
    this.commander = new Command();
    this.setupCommander();
  }

  private setupCommander(): void {
    this.commander
      .name('uxkit')
      .description('UX-Kit CLI - UX Research Toolkit')
      .version('1.0.0');
  }

  registerCommand(command: ICommand): void {
    this.commands.set(command.name, command);
    
    const cmd = this.commander
      .command(command.name)
      .description(command.description);

    // Add command arguments and options
    command.arguments.forEach(arg => {
      if (arg.required) {
        cmd.argument(`<${arg.name}>`, arg.description);
      } else {
        cmd.argument(`[${arg.name}]`, arg.description);
      }
    });

    command.options.forEach(option => {
      const optionStr = option.aliases && option.aliases.length > 0 
        ? `-${option.aliases[0]}, --${option.name}`
        : `--${option.name}`;
      
      cmd.option(optionStr, option.description, option.defaultValue);
    });

    cmd.action(async (...args) => {
      try {
        const options = args[args.length - 1];
        const commandArgs = args.slice(0, -1);
        
        await command.execute(commandArgs, options);
      } catch (error) {
        if (this.errorOutput) {
          this.errorOutput.writeErrorln(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        throw error;
      }
    });
  }

  unregisterCommand(name: string): void {
    this.commands.delete(name);
  }

  getCommand(name: string): ICommand | null {
    return this.commands.get(name) || null;
  }

  listCommands(): ICommand[] {
    return Array.from(this.commands.values());
  }

  async execute(args: string[]): Promise<any> {
    try {
      // Commander expects full argv array starting with node and script path
      const fullArgs = ['node', 'uxkit', ...args];
      await this.commander.parseAsync(fullArgs);
      return { success: true, message: 'Command executed successfully' };
    } catch (error) {
      if (this.errorOutput) {
        this.errorOutput.writeErrorln(`Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  showHelp(): void {
    if (this.output) {
      this.output.writeln(this.commander.help());
    } else {
      console.log(this.commander.help());
    }
  }

  showVersion(): void {
    const version = this.commander.version();
    if (this.output) {
      this.output.writeln(version || '1.0.0');
    } else {
      console.log(version || '1.0.0');
    }
  }

  setOutput(output: IOutput): void {
    this.output = output;
  }

  setErrorOutput(errorOutput: IOutput): void {
    this.errorOutput = errorOutput;
  }

  setLogger(logger: ILogger): void {
    this.logger = logger;
  }

  getCommanderInstance(): Command {
    return this.commander;
  }
}
