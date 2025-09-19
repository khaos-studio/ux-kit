/**
 * Cursor Command Generator Service
 * 
 * Generates Cursor-specific command files (.cursor-commands/) based on UX-Kit functionality.
 * Creates spec-kit compatible Cursor commands for IDE integration.
 */

import { IFileSystemService } from '../contracts/infrastructure-contracts';

export interface CursorCommand {
  name: string;
  description: string;
  scripts: {
    sh?: string;
    ps?: string;
  };
  content: string;
}

export class CursorCommandGenerator {
  constructor(private fileSystem: IFileSystemService) {}

  /**
   * Generate all Cursor commands for the project
   */
  async generateCursorCommands(projectRoot: string): Promise<void> {
    // Try multiple possible Cursor command directory locations
    const possibleDirs = [
      '.cursor/commands',
      '.cursor',
      '.cursor-commands', 
      '.vscode'
    ];
    
    let cursorCommandsDir = '';
    for (const dir of possibleDirs) {
      const fullPath = this.fileSystem.joinPaths(projectRoot, dir);
      try {
        await this.fileSystem.ensureDirectoryExists(fullPath);
        cursorCommandsDir = fullPath;
        break;
      } catch (error) {
        // Try next directory
        continue;
      }
    }
    
    if (!cursorCommandsDir) {
      // Fallback to .cursor-commands
      cursorCommandsDir = this.fileSystem.joinPaths(projectRoot, '.cursor-commands');
      await this.fileSystem.ensureDirectoryExists(cursorCommandsDir);
    }
    
    // Generate individual command files
    await this.generateSpecifyCommand(cursorCommandsDir);
    await this.generateResearchCommand(cursorCommandsDir);
    await this.generateStudyCommand(cursorCommandsDir);
    await this.generateSynthesizeCommand(cursorCommandsDir);
    
    // Copy the spec-kit compatible specify command
    await this.copySpecifyTemplate(cursorCommandsDir);
  }

  /**
   * Generate the main specify command (similar to spec-kit)
   */
  private async generateSpecifyCommand(commandsDir: string): Promise<void> {
    const command: CursorCommand = {
      name: 'specify',
      description: 'Create or update the UX research specification from a natural language feature description.',
      scripts: {
        sh: 'scripts/bash/create-new-research.sh --json "{ARGS}"',
        ps: 'scripts/powershell/create-new-research.ps1 -Json "{ARGS}"'
      },
      content: `Given the research description provided as an argument, do this:

1. Run the script \`{SCRIPT}\` from repo root and parse its JSON output for BRANCH_NAME and SPEC_FILE. All file paths must be absolute.
2. Load \`.uxkit/templates/research-template.md\` to understand required sections.
3. Write the research specification to SPEC_FILE using the template structure, replacing placeholders with concrete details derived from the research description (arguments) while preserving section order and headings.
4. Report completion with branch name, spec file path, and readiness for the next phase.

Note: The script creates and checks out the new branch and initializes the spec file before writing.`
    };

    const filePath = this.fileSystem.joinPaths(commandsDir, 'specify.md');
    const content = this.formatCursorCommand(command);
    await this.fileSystem.writeFile(filePath, content);
  }

  /**
   * Generate research command for UX research workflows
   */
  private async generateResearchCommand(commandsDir: string): Promise<void> {
    const command: CursorCommand = {
      name: 'research',
      description: 'Generate research questions, sources, and summaries for UX research studies.',
      scripts: {
        sh: 'scripts/bash/research-workflow.sh --json "{ARGS}"',
        ps: 'scripts/powershell/research-workflow.ps1 -Json "{ARGS}"'
      },
      content: `Given the research topic and parameters provided as arguments, do this:

1. Parse the arguments to understand research type (questions, sources, summarize, interview, synthesize).
2. Run the appropriate script \`{SCRIPT}\` from repo root with the parsed parameters.
3. Load the relevant template from \`.uxkit/templates/\` based on research type.
4. Generate structured output using the template and provided context.
5. Save the output to the appropriate location in the study directory.

Supported research types:
- questions: Generate research questions for a study
- sources: Discover and compile research sources
- summarize: Create summaries of research materials
- interview: Process and format interview data
- synthesize: Combine insights from multiple sources`
    };

    const filePath = this.fileSystem.joinPaths(commandsDir, 'research.md');
    const content = this.formatCursorCommand(command);
    await this.fileSystem.writeFile(filePath, content);
  }

  /**
   * Generate study management command
   */
  private async generateStudyCommand(commandsDir: string): Promise<void> {
    const command: CursorCommand = {
      name: 'study',
      description: 'Create, manage, and organize UX research studies.',
      scripts: {
        sh: 'scripts/bash/study-management.sh --json "{ARGS}"',
        ps: 'scripts/powershell/study-management.ps1 -Json "{ARGS}"'
      },
      content: `Given the study management action and parameters provided as arguments, do this:

1. Parse the arguments to understand the action (create, list, show, delete).
2. Run the script \`{SCRIPT}\` from repo root with the parsed parameters.
3. For create actions, set up the study directory structure in \`.uxkit/studies/\`.
4. For list/show actions, read and format study information from existing directories.
5. For delete actions, safely remove study directories with confirmation.

Supported actions:
- create: Initialize a new research study with directory structure
- list: Display all available studies with metadata
- show: Show detailed information about a specific study
- delete: Remove a study and its associated files`
    };

    const filePath = this.fileSystem.joinPaths(commandsDir, 'study.md');
    const content = this.formatCursorCommand(command);
    await this.fileSystem.writeFile(filePath, content);
  }

  /**
   * Generate synthesize command for combining research insights
   */
  private async generateSynthesizeCommand(commandsDir: string): Promise<void> {
    const command: CursorCommand = {
      name: 'synthesize',
      description: 'Synthesize research insights from multiple sources into actionable findings.',
      scripts: {
        sh: 'scripts/bash/synthesize-insights.sh --json "{ARGS}"',
        ps: 'scripts/powershell/synthesize-insights.ps1 -Json "{ARGS}"'
      },
      content: `Given the synthesis parameters provided as arguments, do this:

1. Parse the arguments to understand study context and synthesis scope.
2. Run the script \`{SCRIPT}\` from repo root to gather all research artifacts.
3. Load all relevant research files (questions, sources, summaries, interviews).
4. Use the synthesis template from \`.uxkit/templates/synthesis-template.md\`.
5. Generate comprehensive insights by analyzing patterns across all sources.
6. Create actionable recommendations based on the synthesized findings.

The synthesis process combines:
- Research questions and their answers
- Source material summaries
- Interview insights and themes
- Quantitative data patterns
- Qualitative observation trends`
    };

    const filePath = this.fileSystem.joinPaths(commandsDir, 'synthesize.md');
    const content = this.formatCursorCommand(command);
    await this.fileSystem.writeFile(filePath, content);
  }

  /**
   * Format cursor command content with frontmatter
   */
  private formatCursorCommand(command: CursorCommand): string {
    const frontmatter = `---
description: ${command.description}
scripts:
${command.scripts.sh ? `  sh: ${command.scripts.sh}` : ''}
${command.scripts.ps ? `  ps: ${command.scripts.ps}` : ''}
---

`;
    
    return frontmatter + command.content;
  }

  /**
   * Copy the spec-kit compatible specify command template
   */
  private async copySpecifyTemplate(cursorCommandsDir: string): Promise<void> {
    // Read the specify template from templates/cursor-commands/
    const templatePath = this.fileSystem.joinPaths('templates', 'cursor-commands', 'specify.md');
    const destinationPath = this.fileSystem.joinPaths(cursorCommandsDir, 'specify.md');
    
    try {
      const templateContent = await this.fileSystem.readFile(templatePath);
      await this.fileSystem.writeFile(destinationPath, templateContent);
    } catch (error) {
      // If template doesn't exist, create a default one
      const defaultSpecifyCommand: CursorCommand = {
        name: 'specify',
        description: 'Create or update the feature specification from a natural language feature description.',
        scripts: {
          sh: 'scripts/bash/create-new-feature.sh --json "{ARGS}"',
          ps: 'scripts/powershell/create-new-feature.ps1 -Json "{ARGS}"'
        },
        content: `Given the feature description provided as an argument, do this:

1. Run the script \`{SCRIPT}\` from repo root and parse its JSON output for BRANCH_NAME and SPEC_FILE. All file paths must be absolute.
2. Load \`templates/spec-template.md\` to understand required sections.
3. Write the specification to SPEC_FILE using the template structure, replacing placeholders with concrete details derived from the feature description (arguments) while preserving section order and headings.
4. Report completion with branch name, spec file path, and readiness for the next phase.

Note: The script creates and checks out the new branch and initializes the spec file before writing.`
      };
      
      const content = this.formatCursorCommand(defaultSpecifyCommand);
      await this.fileSystem.writeFile(destinationPath, content);
    }
  }

  /**
   * Check if Cursor is available in the system
   */
  async isCursorAvailable(): Promise<boolean> {
    try {
      // Check if cursor command exists in PATH
      const result = await this.executeCommand('cursor --version');
      return result.success;
    } catch {
      return false;
    }
  }

  /**
   * Prompt user for IDE confirmation
   */
  async promptIdeConfirmation(): Promise<boolean> {
    // In a real implementation, this would use a CLI prompt library
    // For now, we'll assume Cursor is confirmed if available
    return await this.isCursorAvailable();
  }

  /**
   * Execute shell command (helper method)
   */
  private async executeCommand(command: string): Promise<{ success: boolean; output?: string; error?: string }> {
    try {
      // This would use child_process in a real implementation
      // For now, return a mock result
      return { success: true, output: 'cursor 0.1.0' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
