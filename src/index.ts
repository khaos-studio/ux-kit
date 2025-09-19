#!/usr/bin/env node

/**
 * UX-Kit CLI Entry Point
 * 
 * This is the main entry point for the UX-Kit CLI application.
 * It provides a lightweight TypeScript CLI toolkit for UX research
 * inspired by GitHub's spec-kit.
 */

import { CLIApplication } from './cli/CLIApplication';
import { InitCommand } from './commands/InitCommand';
import { CreateStudyCommand } from './commands/study/CreateStudyCommand';
import { ListStudiesCommand } from './commands/study/ListStudiesCommand';
import { ShowStudyCommand } from './commands/study/ShowStudyCommand';
import { DeleteStudyCommand } from './commands/study/DeleteStudyCommand';
import { QuestionsCommand } from './commands/research/QuestionsCommand';
import { SourcesCommand } from './commands/research/SourcesCommand';
import { SynthesizeCommand } from './commands/research/SynthesizeCommand';
import { SummarizeCommand } from './commands/research/SummarizeCommand';
import { InterviewCommand } from './commands/research/InterviewCommand';

// Services
import { DirectoryService } from './services/DirectoryService';
import { TemplateService } from './services/TemplateService';
import { StudyService } from './services/StudyService';
import { ResearchService } from './services/ResearchService';
import { FileGenerator } from './services/FileGenerator';
import { CursorCommandGenerator } from './services/CursorCommandGenerator';
import { FileSystemService } from './utils/FileSystemService';
import { InputService } from './utils/InputService';

// Codex Integration Services
import { CodexIntegration } from './services/codex/CodexIntegration';
import { CodexValidator } from './services/codex/CodexValidator';
import { CodexCommandGenerator } from './services/codex/CodexCommandGenerator';
import { CodexCLIService } from './services/codex/CodexCLIService';
import { CodexErrorHandler } from './services/codex/CodexErrorHandler';
import { CLIExecutionService } from './services/CLIExecutionService';

// Simple console output implementation
class ConsoleOutput {
  write(text: string): void {
    process.stdout.write(text);
  }

  writeln(text: string): void {
    console.log(text);
  }

  writeError(text: string): void {
    process.stderr.write(text);
  }

  writeErrorln(text: string): void {
    console.error(text);
  }

  clear(): void {
    console.clear();
  }

  flush(): void {
    // No-op for console
  }
}

async function main(): Promise<void> {
  try {
    // Create file system service
    const fileSystem = new FileSystemService();
    
    // Create services with proper dependencies
    const output = new ConsoleOutput();
    const directoryService = new DirectoryService(fileSystem);
    const templateService = new TemplateService(fileSystem);
    const studyService = new StudyService(fileSystem);
    const fileGenerator = new FileGenerator(fileSystem);
    const researchService = new ResearchService(fileSystem, fileGenerator);
    const cursorCommandGenerator = new CursorCommandGenerator(fileSystem);
    const inputService = new InputService(output);

    // Create Codex integration services
    const cliExecutionService = new CLIExecutionService();
    const codexCLIService = new CodexCLIService(cliExecutionService);
    const codexErrorHandler = new CodexErrorHandler();
    const codexValidator = new CodexValidator(cliExecutionService);
    const codexCommandGenerator = new CodexCommandGenerator(fileSystem);
    const codexIntegration = new CodexIntegration(codexValidator, codexCommandGenerator);

    // Create CLI application
    const cliApp = new CLIApplication();
    cliApp.setOutput(output);
    cliApp.setErrorOutput(output);

    // Register commands
    cliApp.registerCommand(new InitCommand(directoryService, templateService, cursorCommandGenerator, inputService, output, codexIntegration));
    cliApp.registerCommand(new CreateStudyCommand(studyService, output));
    cliApp.registerCommand(new ListStudiesCommand(studyService, output));
    cliApp.registerCommand(new ShowStudyCommand(studyService, output));
    cliApp.registerCommand(new DeleteStudyCommand(studyService, output));
    
    // Register research commands
    cliApp.registerCommand(new QuestionsCommand(researchService, output));
    cliApp.registerCommand(new SourcesCommand(researchService, output));
    cliApp.registerCommand(new SynthesizeCommand(researchService, output));
    cliApp.registerCommand(new SummarizeCommand(researchService, output));
    cliApp.registerCommand(new InterviewCommand(researchService, output));

    // Execute CLI with command line arguments
    const result = await cliApp.execute(process.argv.slice(2));
    
    if (!result.success) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

// Run the CLI application
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
