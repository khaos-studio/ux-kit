"use strict";
/**
 * Init Command
 *
 * Initializes UX-Kit in a project by creating the .uxkit/ directory structure.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitCommand = void 0;
class InitCommand {
    constructor(directoryService, templateService, cursorCommandGenerator, inputService, output, codexIntegration) {
        this.directoryService = directoryService;
        this.templateService = templateService;
        this.cursorCommandGenerator = cursorCommandGenerator;
        this.inputService = inputService;
        this.output = output;
        this.codexIntegration = codexIntegration;
        this.name = 'init';
        this.description = 'Initialize UX-Kit in the current project';
        this.usage = 'uxkit init [options]';
        this.arguments = [];
        this.options = [
            {
                name: 'aiAgent',
                description: 'AI agent provider to use (cursor, codex, custom)',
                type: 'string',
                required: false,
                aliases: ['a']
            },
            {
                name: 'template',
                description: 'Template source to use',
                type: 'string',
                required: false,
                defaultValue: 'default',
                aliases: ['t']
            }
        ];
        this.examples = [
            {
                description: 'Initialize with default settings',
                command: 'uxkit init'
            },
            {
                description: 'Initialize with specific AI agent',
                command: 'uxkit init --aiAgent codex'
            }
        ];
    }
    async execute(args, options) {
        try {
            const projectRoot = options.projectRoot || process.cwd();
            // Display ASCII art banner
            this.displayBanner();
            // Check if already initialized
            if (await this.directoryService.isUXKitInitialized(projectRoot)) {
                return {
                    success: true,
                    message: 'UX-Kit already initialized in this project'
                };
            }
            // Use provided AI agent or prompt for selection
            const aiAgent = options.aiAgent || await this.promptForAiAgent();
            // Enhanced setup process with better progress indicators
            await this.setupWithProgress(projectRoot, aiAgent, options.template || 'default');
            // IDE Confirmation and AI agent-specific setup
            await this.handleIdeConfirmation(projectRoot, aiAgent);
            // Handle Codex initialization if Codex is selected
            if (aiAgent === 'codex') {
                const codexSuccess = await this.handleCodexInitialization(projectRoot);
                if (!codexSuccess) {
                    return {
                        success: false,
                        message: 'UX-Kit initialization completed but Codex integration failed',
                        data: {
                            projectRoot,
                            aiAgent: aiAgent,
                            template: options.template || 'default',
                            codexIntegrationFailed: true
                        }
                    };
                }
            }
            this.output.writeln('');
            this.output.writeln('🎉 UX-Kit initialized successfully!');
            this.output.writeln('   Ready to start your UX research journey! 🚀');
            return {
                success: true,
                message: 'UX-Kit initialized successfully in this project',
                data: {
                    projectRoot,
                    aiAgent: aiAgent,
                    template: options.template || 'default'
                }
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            this.output.writeErrorln(`Failed to initialize UX-Kit: ${errorMessage}`);
            return {
                success: false,
                message: `Failed to initialize UX-Kit: ${errorMessage}`,
                errors: [errorMessage]
            };
        }
    }
    async validate(args, options) {
        const errors = [];
        // Validate AI agent option
        if (options.aiAgent && !['cursor', 'codex', 'custom'].includes(options.aiAgent)) {
            errors.push({
                field: 'aiAgent',
                message: 'AI agent must be one of: cursor, codex, custom',
                value: options.aiAgent
            });
        }
        // Validate template option
        if (options.template && typeof options.template !== 'string') {
            errors.push({
                field: 'template',
                message: 'Template must be a string',
                value: options.template
            });
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
    /**
     * Display ASCII art banner for UX-Kit
     */
    displayBanner() {
        // ANSI color codes
        const reset = '\x1b[0m';
        const brightBlue = '\x1b[94m';
        const brightCyan = '\x1b[96m';
        const brightGreen = '\x1b[92m';
        const brightYellow = '\x1b[93m';
        const brightMagenta = '\x1b[95m';
        const brightWhite = '\x1b[97m';
        const brightRed = '\x1b[91m';
        const banner = `
${brightCyan}UUUUUUUU     UUUUUUUUXXXXXXX       XXXXXXX     kkkkkkkk             iiii          tttt${reset}          
${brightCyan}U::::::U     U::::::UX:::::X       X:::::X     k::::::k            i::::i      ttt:::t${reset}          
${brightCyan}U::::::U     U::::::UX:::::X       X:::::X     k::::::k             iiii       t:::::t${reset}          
${brightCyan}UU:::::U     U:::::UUX::::::X     X::::::X     k::::::k                        t:::::t${reset}          
${brightCyan} U:::::U     U:::::U XXX:::::X   X:::::XXX      k:::::k    kkkkkkkiiiiiiittttttt:::::ttttttt${reset}    
${brightCyan} U:::::D     D:::::U    X:::::X X:::::X         k:::::k   k:::::k i:::::it:::::::::::::::::t${reset}    
${brightCyan} U:::::D     D:::::U     X:::::X:::::X          k:::::k  k:::::k   i::::it:::::::::::::::::t${reset}    
${brightCyan} U:::::D     D:::::U      X:::::::::X           k:::::k k:::::k    i::::itttttt:::::::tttttt${reset}    
${brightCyan} U:::::D     D:::::U      X:::::::::X           k::::::k:::::k     i::::i      t:::::t${reset}          
${brightCyan} U:::::D     D:::::U     X:::::X:::::X          k:::::::::::k      i::::i      t:::::t${reset}          
${brightCyan} U:::::D     D:::::U    X:::::X X:::::X         k:::::::::::k      i::::i      t:::::t${reset}          
${brightCyan} U::::::U   U::::::U XXX:::::X   X:::::XXX      k::::::k:::::k     i::::i      t:::::t    tttttt${reset}
${brightCyan} U:::::::UUU:::::::U X::::::X     X::::::X     k::::::k k:::::k   i::::::i     t::::::tttt:::::t${reset}
${brightCyan}  UU:::::::::::::UU  X:::::X       X:::::X     k::::::k  k:::::k  i::::::i     tt::::::::::::::t${reset}
${brightCyan}    UU:::::::::UU    X:::::X       X:::::X     k::::::k   k:::::k i::::::i       tt:::::::::::tt${reset}
${brightCyan}      UUUUUUUUU      XXXXXXX       XXXXXXX     kkkkkkkk    kkkkkkkiiiiiiii         ttttttttttt${reset}  

${brightMagenta}                    🎨 User Experience Research & Design Toolkit${reset}
`;
        this.output.writeln(banner);
    }
    /**
     * Enhanced setup process with progress indicators
     */
    async setupWithProgress(projectRoot, aiAgent, template) {
        const steps = [
            { name: 'Creating .uxkit directory structure', action: () => this.directoryService.createUXKitStructure(projectRoot) },
            { name: 'Creating configuration file', action: () => this.directoryService.createConfigFile(projectRoot, { aiAgent }) },
            { name: 'Creating memory/principles.md', action: () => this.directoryService.createPrinciplesFile(projectRoot) },
            { name: 'Copying template files', action: () => this.templateService.copyTemplates(projectRoot, template) }
        ];
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            if (!step)
                continue;
            const progress = `[${i + 1}/${steps.length}]`;
            // Show progress with animation
            this.output.write(`${progress} ${step.name}...`);
            try {
                await step.action();
                this.output.writeln(` ✓`);
            }
            catch (error) {
                this.output.writeln(` ✗`);
                throw error;
            }
            // Small delay for visual effect
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }
    /**
     * Interactive prompt for AI agent selection
     */
    async promptForAiAgent() {
        const choices = [
            {
                value: 'cursor',
                label: 'Cursor',
                description: 'Full IDE integration with Cursor commands (Recommended)'
            },
            {
                value: 'codex',
                label: 'Codex',
                description: 'OpenAI Codex integration'
            },
            {
                value: 'custom',
                label: 'Custom',
                description: 'Custom AI agent configuration'
            }
        ];
        return await this.inputService.select('🤖 AI Agent Configuration\nPlease select your preferred AI agent:', choices, 'cursor');
    }
    /**
     * Handle IDE confirmation and Cursor command generation
     */
    async handleIdeConfirmation(projectRoot, aiAgent) {
        // If AI agent is Cursor, confirm IDE and generate Cursor commands
        if (aiAgent === 'cursor') {
            this.output.write('🔍 Checking for Cursor IDE...');
            const isCursorAvailable = await this.cursorCommandGenerator.isCursorAvailable();
            if (isCursorAvailable) {
                this.output.writeln(' ✓');
                this.output.write('⚙️  Generating Cursor commands...');
                try {
                    await this.cursorCommandGenerator.generateCursorCommands(projectRoot);
                    this.output.writeln(' ✓');
                    this.output.writeln('');
                    this.output.writeln('🎉 Cursor integration ready!');
                    this.output.writeln('  📁 Commands available in .cursor/commands/ directory');
                    this.output.writeln('  🚀 You can now use /specify, /research, /study, and /synthesize commands in Cursor');
                    this.output.writeln('  💡 Tip: If commands don\'t appear, try restarting Cursor IDE');
                }
                catch (error) {
                    this.output.writeln(' ✗');
                    this.output.writeErrorln(`Failed to generate Cursor commands: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
            else {
                this.output.writeln(' ⚠');
                this.output.writeln('');
                this.output.writeln('⚠️  Cursor IDE not detected in PATH');
                this.output.writeln('  📝 You can still use UX-Kit CLI commands');
                this.output.writeln('  🔧 To enable Cursor integration, install Cursor and ensure it\'s in your PATH');
            }
        }
        else {
            this.output.writeln(`✓ Configured for AI agent: ${aiAgent}`);
        }
    }
    /**
     * Handle Codex initialization and setup
     */
    async handleCodexInitialization(projectRoot) {
        if (!this.codexIntegration) {
            this.output.writeErrorln('Codex integration service not available');
            return false;
        }
        try {
            this.output.write('⚙️  Initializing Codex v2 integration...');
            // Initialize Codex with configuration (no CLI validation needed for v2)
            const codexConfig = {
                enabled: true,
                validationEnabled: false, // No CLI validation needed for Codex v2
                fallbackToCustom: true,
                templatePath: projectRoot, // Set to project root for Codex v2
                timeout: 30000
            };
            await this.codexIntegration.initialize(codexConfig);
            this.output.writeln(' ✓');
            this.output.write('📝 Generating Codex configuration files...');
            await this.codexIntegration.generateCommandTemplates();
            this.output.writeln(' ✓');
            this.output.writeln('');
            this.output.writeln('🎉 Codex v2 integration ready!');
            this.output.writeln('  📄 Configuration file created: codex.md');
            this.output.writeln('  📁 Additional config in: .codex/');
            this.output.writeln('  🚀 You can now use natural language prompts with Codex for UX research');
            this.output.writeln('  💡 Note: Codex v2 works through IDE integration, not CLI commands');
            this.output.writeln('');
            this.output.writeln('💡 Example prompts to try:');
            this.output.writeln('  • "Create a new UX research study about user onboarding"');
            this.output.writeln('  • "Generate interview questions for understanding user pain points"');
            this.output.writeln('  • "Help me synthesize findings from user interviews"');
            return true;
        }
        catch (error) {
            this.output.writeln(' ✗');
            this.output.writeln('');
            this.output.writeErrorln(`Failed to initialize Codex integration: ${error instanceof Error ? error.message : 'Unknown error'}`);
            this.output.writeln('');
            this.output.writeln('⚠️  Codex integration will be skipped');
            this.output.writeln('  📝 You can still use UX-Kit CLI commands');
            this.output.writeln('  🔧 To enable Codex integration, check the error above');
            return false;
        }
    }
    showHelp() {
        this.output.writeln(`Usage: ${this.usage}`);
        this.output.writeln(`\n${this.description}`);
        this.output.writeln('\nOptions:');
        this.options.forEach(option => {
            const aliases = option.aliases ? `, -${option.aliases[0]}` : '';
            this.output.writeln(`  --${option.name}${aliases}    ${option.description}`);
        });
        this.output.writeln('\nExamples:');
        this.examples.forEach(example => {
            this.output.writeln(`  ${example.description}: ${example.command}`);
        });
    }
}
exports.InitCommand = InitCommand;
//# sourceMappingURL=InitCommand.js.map