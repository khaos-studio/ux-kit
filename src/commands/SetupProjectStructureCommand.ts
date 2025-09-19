/**
 * T001: Setup Project Structure Command
 * 
 * Command to execute the project structure setup for remote installation system.
 */

import { Command } from 'commander';
import { ProjectStructureSetup } from '../scripts/ProjectStructureSetup';

export class SetupProjectStructureCommand {
  private command: Command;

  constructor() {
    this.command = new Command('setup-project-structure');
    this.setupCommand();
  }

  private setupCommand(): void {
    this.command
      .description('Set up the project structure for remote installation system (T001)')
      .option('-p, --project-root <path>', 'Project root directory', process.cwd())
      .action(async (options) => {
        try {
          console.log('🚀 Starting project structure setup (T001)...');
          
          const setup = new ProjectStructureSetup(options.projectRoot);
          await setup.setupProjectStructure();
          
          console.log('✅ Project structure setup completed successfully!');
          console.log('📁 Created directories:');
          console.log('   - scripts/install/');
          console.log('   - scripts/modules/');
          console.log('   - scripts/modules/package-managers/');
          console.log('   - scripts/utils/');
          console.log('   - tests/install/');
          console.log('   - docs/install/');
          console.log('');
          console.log('📄 Created placeholder files for all modules and utilities');
          console.log('🔧 All scripts have executable permissions');
          console.log('');
          console.log('Next steps:');
          console.log('   - Run T002: Utility Functions Setup');
          console.log('   - Run T003-T007: Test implementations (can be done in parallel)');
          
        } catch (error) {
          console.error('❌ Failed to setup project structure:', error);
          process.exit(1);
        }
      });
  }

  public getCommand(): Command {
    return this.command;
  }
}
