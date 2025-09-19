"use strict";
/**
 * CLI Application
 *
 * Main CLI application class that manages command execution,
 * registration, and user interface interactions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIApplication = void 0;
const commander_1 = require("commander");
class CLIApplication {
    constructor() {
        this.commands = new Map();
        this.commander = new commander_1.Command();
        this.setupCommander();
    }
    setupCommander() {
        this.commander
            .name('uxkit')
            .description('UX-Kit CLI - UX Research Toolkit')
            .version('1.0.0');
    }
    registerCommand(command) {
        this.commands.set(command.name, command);
        const cmd = this.commander
            .command(command.name)
            .description(command.description);
        // Add command arguments and options
        command.arguments.forEach(arg => {
            if (arg.required) {
                cmd.argument(`<${arg.name}>`, arg.description);
            }
            else {
                cmd.argument(`[${arg.name}]`, arg.description);
            }
        });
        command.options.forEach(option => {
            let optionStr = option.aliases && option.aliases.length > 0
                ? `-${option.aliases[0]}, --${option.name}`
                : `--${option.name}`;
            // Add value placeholder for string options
            if (option.type === 'string') {
                optionStr += ` <${option.name}>`;
            }
            cmd.option(optionStr, option.description, option.defaultValue);
        });
        cmd.action(async (...args) => {
            try {
                // Commander.js passes the Command object as the last argument
                const cmdInstance = args[args.length - 1];
                const commandArgs = args.slice(0, -1);
                // Get parsed options using program.opts()
                const options = cmdInstance.opts();
                await command.execute(commandArgs, options);
            }
            catch (error) {
                if (this.errorOutput) {
                    this.errorOutput.writeErrorln(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
                throw error;
            }
        });
    }
    unregisterCommand(name) {
        this.commands.delete(name);
    }
    getCommand(name) {
        return this.commands.get(name) || null;
    }
    listCommands() {
        return Array.from(this.commands.values());
    }
    async execute(args) {
        try {
            // Commander expects full argv array starting with node and script path
            const fullArgs = ['node', 'uxkit', ...args];
            await this.commander.parseAsync(fullArgs);
            return { success: true, message: 'Command executed successfully' };
        }
        catch (error) {
            if (this.errorOutput) {
                this.errorOutput.writeErrorln(`Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
            return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
        }
    }
    showHelp() {
        if (this.output) {
            this.output.writeln(this.commander.help());
        }
        else {
            console.log(this.commander.help());
        }
    }
    showVersion() {
        const version = this.commander.version();
        if (this.output) {
            this.output.writeln(version || '1.0.0');
        }
        else {
            console.log(version || '1.0.0');
        }
    }
    setOutput(output) {
        this.output = output;
    }
    setErrorOutput(errorOutput) {
        this.errorOutput = errorOutput;
    }
    setLogger(logger) {
        this.logger = logger;
    }
    getCommanderInstance() {
        return this.commander;
    }
}
exports.CLIApplication = CLIApplication;
//# sourceMappingURL=CLIApplication.js.map