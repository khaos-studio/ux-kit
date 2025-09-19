/**
 * Init Command
 * 
 * Initializes UX-Kit in a project by creating the .uxkit/ directory structure.
 */

import { ICommand, CommandResult, ValidationResult } from '../contracts/presentation-contracts';
import { DirectoryService } from '../services/DirectoryService';
import { TemplateService } from '../services/TemplateService';
import { CursorCommandGenerator } from '../services/CursorCommandGenerator';
import { InputService } from '../utils/InputService';
import { IOutput } from '../contracts/presentation-contracts';
import { ICodexIntegration } from '../contracts/domain-contracts';
import { CodexConfiguration, CodexValidationResponse, CodexValidationResult } from '../contracts/domain-contracts';

export class InitCommand implements ICommand {
  readonly name = 'init';
  readonly description = 'Initialize UX-Kit in the current project';
  readonly usage = 'uxkit init [options]';
  readonly arguments = [];
  readonly options = [
    {
      name: 'aiAgent',
      description: 'AI agent provider to use (cursor, codex, custom)',
      type: 'string' as const,
      required: false,
      defaultValue: 'cursor',
      aliases: ['a']
    },
    {
      name: 'template',
      description: 'Template source to use',
      type: 'string' as const,
      required: false,
      defaultValue: 'default',
      aliases: ['t']
    }
  ];
  readonly examples = [
    {
      description: 'Initialize with default settings',
      command: 'uxkit init'
    },
    {
      description: 'Initialize with specific AI agent',
      command: 'uxkit init --aiAgent codex'
    }
  ];

  constructor(
    private directoryService: DirectoryService,
    private templateService: TemplateService,
    private cursorCommandGenerator: CursorCommandGenerator,
    private inputService: InputService,
    private output: IOutput,
    private codexIntegration?: ICodexIntegration
  ) {}

  async execute(args: string[], options: Record<string, any>): Promise<CommandResult> {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.output.writeErrorln(`Failed to initialize UX-Kit: ${errorMessage}`);
      
      return {
        success: false,
        message: `Failed to initialize UX-Kit: ${errorMessage}`,
        errors: [errorMessage]
      };
    }
  }

  async validate(args: string[], options: Record<string, any>): Promise<ValidationResult> {
    const errors: Array<{ field: string; message: string; value: any }> = [];

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
  private displayBanner(): void {
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
  private async setupWithProgress(projectRoot: string, aiAgent: string, template: string): Promise<void> {
    const steps = [
      { name: 'Creating .uxkit directory structure', action: () => this.directoryService.createUXKitStructure(projectRoot) },
      { name: 'Creating configuration file', action: () => this.directoryService.createConfigFile(projectRoot, { aiAgent }) },
      { name: 'Creating memory/principles.md', action: () => this.directoryService.createPrinciplesFile(projectRoot) },
      { name: 'Copying template files', action: () => this.templateService.copyTemplates(projectRoot, template) }
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (!step) continue;
      
      const progress = `[${i + 1}/${steps.length}]`;
      
      // Show progress with animation
      this.output.write(`${progress} ${step.name}...`);
      
      try {
        await step.action();
        this.output.writeln(` ✓`);
      } catch (error) {
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
  private async promptForAiAgent(): Promise<string> {
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
  private async handleIdeConfirmation(projectRoot: string, aiAgent: string): Promise<void> {
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
        } catch (error) {
          this.output.writeln(' ✗');
          this.output.writeErrorln(`Failed to generate Cursor commands: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        this.output.writeln(' ⚠');
        this.output.writeln('');
        this.output.writeln('⚠️  Cursor IDE not detected in PATH');
        this.output.writeln('  📝 You can still use UX-Kit CLI commands');
        this.output.writeln('  🔧 To enable Cursor integration, install Cursor and ensure it\'s in your PATH');
      }
    } else {
      this.output.writeln(`✓ Configured for AI agent: ${aiAgent}`);
    }
  }

  /**
   * Handle Codex initialization and setup
   */
  private async handleCodexInitialization(projectRoot: string): Promise<boolean> {
    if (!this.codexIntegration) {
      this.output.writeErrorln('Codex integration service not available');
      return false;
    }

    try {
      this.output.write('🔍 Checking Codex CLI availability...');
      
      // Validate Codex CLI
      const validationResponse = await this.codexIntegration.validate();
      
      if (validationResponse.result === CodexValidationResult.SUCCESS) {
        this.output.writeln(' ✓');
        this.output.write('⚙️  Initializing Codex integration...');
        
        // Initialize Codex with default configuration
        const codexConfig: CodexConfiguration = {
          enabled: true,
          ...(validationResponse.cliPath && { cliPath: validationResponse.cliPath }),
          validationEnabled: true,
          fallbackToCustom: true,
          templatePath: `${projectRoot}/.uxkit/templates/codex-commands`,
          timeout: 30000
        };
        
        await this.codexIntegration.initialize(codexConfig);
        this.output.writeln(' ✓');
        
        this.output.write('📝 Generating Codex command templates...');
        await this.codexIntegration.generateCommandTemplates();
        this.output.writeln(' ✓');
        
        this.output.writeln('');
        this.output.writeln('🎉 Codex integration ready!');
        this.output.writeln('  📁 Command templates available in .uxkit/templates/codex-commands/');
        this.output.writeln('  🚀 You can now use Codex commands for UX research');
        this.output.writeln(`  💡 Codex CLI version: ${validationResponse.version || 'Unknown'}`);
        
        // Get and display integration status
        const status = await this.codexIntegration.getStatus();
        this.output.writeln(`  📊 Integration status: ${status.status}`);
        
        return true;
      } else {
        this.output.writeln(' ✗');
        this.output.writeln('');
        this.output.writeErrorln(`Codex CLI validation failed: ${validationResponse.errorMessage || 'Unknown error'}`);
        
        if (validationResponse.suggestions && validationResponse.suggestions.length > 0) {
          this.output.writeln('Suggestions:');
          validationResponse.suggestions.forEach((suggestion, index) => {
            this.output.writeln(`  ${index + 1}. ${suggestion}`);
          });
        }
        
        this.output.writeln('');
        this.output.writeln('⚠️  Codex integration will be skipped');
        this.output.writeln('  📝 You can still use UX-Kit CLI commands');
        this.output.writeln('  🔧 To enable Codex integration, resolve the CLI issues above');
        
        return false;
      }
    } catch (error) {
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

  showHelp(): void {
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
