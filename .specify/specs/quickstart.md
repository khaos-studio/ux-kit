# Quickstart Guide: Codex Support Integration

## Overview

This quickstart guide provides step-by-step instructions for implementing Codex support integration in UX-Kit CLI. The implementation follows the existing Cursor integration patterns and maintains backward compatibility.

## Prerequisites

- Node.js 18+ and npm/yarn
- TypeScript 5.0+
- Existing UX-Kit codebase
- OpenAI Codex CLI (optional, for validation)

## Implementation Steps

### Step 1: Update AI Agent Selection

#### 1.1 Modify InitCommand

Update the AI agent selection in `src/commands/InitCommand.ts`:

```typescript
// Add Codex to AI agent options
const AI_AGENT_OPTIONS = [
  { name: 'Cursor', value: 'cursor' },
  { name: 'Codex', value: 'codex' },
  { name: 'Custom', value: 'custom' }
];
```

#### 1.2 Add Codex Selection Logic

```typescript
private async handleAIAgentSelection(): Promise<string> {
  const { aiAgent } = await this.inputService.prompt({
    type: 'select',
    name: 'aiAgent',
    message: 'Select your AI agent:',
    choices: AI_AGENT_OPTIONS
  });

  if (aiAgent === 'codex') {
    await this.handleCodexInitialization();
  }

  return aiAgent;
}
```

### Step 2: Create Codex Validation Service

#### 2.1 Create CodexValidator

Create `src/services/CodexValidator.ts`:

```typescript
import { ICodexValidator, CodexValidationResponse } from '../contracts/domain-contracts';
import { ICLIExecutionService } from '../contracts/infrastructure-contracts';

export class CodexValidator implements ICodexValidator {
  constructor(private cliService: ICLIExecutionService) {}

  async validateCodexCLI(): Promise<CodexValidationResponse> {
    try {
      const isAvailable = await this.isCodexAvailable();
      if (!isAvailable) {
        return {
          result: 'CLI_NOT_FOUND',
          errorMessage: 'Codex CLI not found in PATH',
          suggestions: [
            'Install OpenAI Codex CLI',
            'Add Codex CLI to your PATH',
            'Use custom agent instead'
          ],
          timestamp: new Date()
        };
      }

      const version = await this.getCodexVersion();
      return {
        result: 'SUCCESS',
        cliPath: await this.getCodexPath(),
        version,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        result: 'UNKNOWN_ERROR',
        errorMessage: error.message,
        suggestions: ['Check Codex CLI installation'],
        timestamp: new Date()
      };
    }
  }

  async isCodexAvailable(): Promise<boolean> {
    return this.cliService.isCommandAvailable('codex');
  }

  async getCodexPath(): Promise<string | null> {
    // Implementation to find Codex CLI path
    return null;
  }

  async getCodexVersion(): Promise<string | null> {
    try {
      const result = await this.cliService.executeCommand('codex', ['--version']);
      return result.success ? result.stdout.trim() : null;
    } catch {
      return null;
    }
  }
}
```

### Step 3: Create Codex Command Generator

#### 3.1 Create CodexCommandGenerator

Create `src/services/CodexCommandGenerator.ts`:

```typescript
import { ICodexCommandGenerator, CodexCommandTemplate, CodexConfiguration } from '../contracts/domain-contracts';
import { IFileSystemService } from '../contracts/infrastructure-contracts';

export class CodexCommandGenerator implements ICodexCommandGenerator {
  constructor(private fileSystem: IFileSystemService) {}

  async generateTemplates(config: CodexConfiguration): Promise<void> {
    const templates = this.getDefaultTemplates();
    
    for (const template of templates) {
      await this.generateTemplateFile(template, config.templatePath);
    }
  }

  async getTemplate(name: string): Promise<CodexCommandTemplate | null> {
    const templates = this.getDefaultTemplates();
    return templates.find(t => t.name === name) || null;
  }

  async listTemplates(): Promise<readonly CodexCommandTemplate[]> {
    return this.getDefaultTemplates();
  }

  validateTemplate(template: CodexCommandTemplate): boolean {
    return !!(
      template.name &&
      template.description &&
      template.command &&
      template.parameters &&
      template.examples &&
      template.category
    );
  }

  private getDefaultTemplates(): readonly CodexCommandTemplate[] {
    return [
      {
        name: 'codex-research',
        description: 'Generate research questions using Codex',
        command: 'codex research --topic "{topic}" --format "{format}"',
        parameters: [
          {
            name: 'topic',
            type: 'string',
            required: true,
            description: 'Research topic'
          },
          {
            name: 'format',
            type: 'string',
            required: false,
            description: 'Output format',
            defaultValue: 'markdown'
          }
        ],
        examples: [
          'codex research --topic "user authentication"',
          'codex research --topic "mobile UX" --format "json"'
        ],
        category: 'research',
        version: '1.0.0'
      }
    ];
  }

  private async generateTemplateFile(template: CodexCommandTemplate, outputPath: string): Promise<void> {
    const content = this.formatTemplateAsMarkdown(template);
    const filePath = `${outputPath}/${template.name}.md`;
    
    await this.fileSystem.createDirectory(outputPath);
    await this.fileSystem.writeFile(filePath, content);
  }

  private formatTemplateAsMarkdown(template: CodexCommandTemplate): string {
    return `# ${template.name}

${template.description}

## Command

\`\`\`bash
${template.command}
\`\`\`

## Parameters

${template.parameters.map(param => 
  `- **${param.name}** (${param.type}${param.required ? ', required' : ''}): ${param.description}`
).join('\n')}

## Examples

${template.examples.map(example => `\`\`\`bash\n${example}\n\`\`\``).join('\n\n')}

## Category

${template.category}
`;
  }
}
```

## Testing the Implementation

### 1. Unit Tests

```bash
npm test -- --testPathPattern=Codex
```

### 2. Integration Tests

```bash
npm run test:integration -- --testNamePattern="Codex"
```

### 3. Manual Testing

```bash
# Test initialization with Codex
npm run build
./dist/cli/CLIApplication.js init

# Select "Codex" as AI agent
# Verify templates are generated
# Check error handling when Codex CLI is not available
```

## Deployment Checklist

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] Backward compatibility verified
- [ ] Performance requirements met
- [ ] Error handling tested
- [ ] Code review completed

## Next Steps

1. **Phase 2**: Implement advanced Codex features
2. **Phase 3**: Add Codex-specific configuration options
3. **Future**: Support for additional AI agents

## Support

For issues with Codex integration:
1. Check the troubleshooting section in README
2. Verify Codex CLI installation
3. Review error messages and suggestions
4. Use the `--verbose` flag for detailed logging