#!/usr/bin/env node
"use strict";
/**
 * UX-Kit CLI Entry Point
 *
 * This is the main entry point for the UX-Kit CLI application.
 * It provides a lightweight TypeScript CLI toolkit for UX research
 * inspired by GitHub's spec-kit.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const CLIApplication_1 = require("./cli/CLIApplication");
const InitCommand_1 = require("./commands/InitCommand");
const CreateStudyCommand_1 = require("./commands/study/CreateStudyCommand");
const ListStudiesCommand_1 = require("./commands/study/ListStudiesCommand");
const ShowStudyCommand_1 = require("./commands/study/ShowStudyCommand");
const DeleteStudyCommand_1 = require("./commands/study/DeleteStudyCommand");
const QuestionsCommand_1 = require("./commands/research/QuestionsCommand");
const SourcesCommand_1 = require("./commands/research/SourcesCommand");
const SynthesizeCommand_1 = require("./commands/research/SynthesizeCommand");
const SummarizeCommand_1 = require("./commands/research/SummarizeCommand");
const InterviewCommand_1 = require("./commands/research/InterviewCommand");
// Services
const DirectoryService_1 = require("./services/DirectoryService");
const TemplateService_1 = require("./services/TemplateService");
const StudyService_1 = require("./services/StudyService");
const ResearchService_1 = require("./services/ResearchService");
const FileGenerator_1 = require("./services/FileGenerator");
const CursorCommandGenerator_1 = require("./services/CursorCommandGenerator");
const FileSystemService_1 = require("./utils/FileSystemService");
const InputService_1 = require("./utils/InputService");
// Codex Integration Services
const CodexIntegration_1 = require("./services/codex/CodexIntegration");
const CodexValidator_1 = require("./services/codex/CodexValidator");
const CodexCommandGenerator_1 = require("./services/codex/CodexCommandGenerator");
const CodexCLIService_1 = require("./services/codex/CodexCLIService");
const CodexErrorHandler_1 = require("./services/codex/CodexErrorHandler");
const CLIExecutionService_1 = require("./services/CLIExecutionService");
// Simple console output implementation
class ConsoleOutput {
    write(text) {
        process.stdout.write(text);
    }
    writeln(text) {
        console.log(text);
    }
    writeError(text) {
        process.stderr.write(text);
    }
    writeErrorln(text) {
        console.error(text);
    }
    clear() {
        console.clear();
    }
    flush() {
        // No-op for console
    }
}
async function main() {
    try {
        // Create file system service
        const fileSystem = new FileSystemService_1.FileSystemService();
        // Create services with proper dependencies
        const output = new ConsoleOutput();
        const directoryService = new DirectoryService_1.DirectoryService(fileSystem);
        const templateService = new TemplateService_1.TemplateService(fileSystem);
        const studyService = new StudyService_1.StudyService(fileSystem);
        const fileGenerator = new FileGenerator_1.FileGenerator(fileSystem);
        const researchService = new ResearchService_1.ResearchService(fileSystem, fileGenerator);
        const cursorCommandGenerator = new CursorCommandGenerator_1.CursorCommandGenerator(fileSystem);
        const inputService = new InputService_1.InputService(output);
        // Create Codex integration services
        const cliExecutionService = new CLIExecutionService_1.CLIExecutionService();
        const codexCLIService = new CodexCLIService_1.CodexCLIService(cliExecutionService);
        const codexErrorHandler = new CodexErrorHandler_1.CodexErrorHandler();
        const codexValidator = new CodexValidator_1.CodexValidator(cliExecutionService);
        const codexCommandGenerator = new CodexCommandGenerator_1.CodexCommandGenerator(fileSystem);
        const codexIntegration = new CodexIntegration_1.CodexIntegration(codexValidator, codexCommandGenerator);
        // Create CLI application
        const cliApp = new CLIApplication_1.CLIApplication();
        cliApp.setOutput(output);
        cliApp.setErrorOutput(output);
        // Register commands
        cliApp.registerCommand(new InitCommand_1.InitCommand(directoryService, templateService, cursorCommandGenerator, inputService, output, codexIntegration));
        cliApp.registerCommand(new CreateStudyCommand_1.CreateStudyCommand(studyService, output));
        cliApp.registerCommand(new ListStudiesCommand_1.ListStudiesCommand(studyService, output));
        cliApp.registerCommand(new ShowStudyCommand_1.ShowStudyCommand(studyService, output));
        cliApp.registerCommand(new DeleteStudyCommand_1.DeleteStudyCommand(studyService, output));
        // Register research commands
        cliApp.registerCommand(new QuestionsCommand_1.QuestionsCommand(researchService, output));
        cliApp.registerCommand(new SourcesCommand_1.SourcesCommand(researchService, output));
        cliApp.registerCommand(new SynthesizeCommand_1.SynthesizeCommand(researchService, output));
        cliApp.registerCommand(new SummarizeCommand_1.SummarizeCommand(researchService, output));
        cliApp.registerCommand(new InterviewCommand_1.InterviewCommand(researchService, output));
        // Execute CLI with command line arguments
        const result = await cliApp.execute(process.argv.slice(2));
        if (!result.success) {
            process.exit(1);
        }
    }
    catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
}
// Run the CLI application
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map