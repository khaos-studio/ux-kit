/**
 * Use Case Tests for Research Commands Implementation (T005)
 * 
 * These tests define the expected behavior for research workflow commands
 * (questions, sources, summarize, interview, synthesize), following TDD principles.
 */

import { QuestionsCommand } from '../../src/commands/research/QuestionsCommand';
import { SourcesCommand } from '../../src/commands/research/SourcesCommand';
import { SummarizeCommand } from '../../src/commands/research/SummarizeCommand';
import { InterviewCommand } from '../../src/commands/research/InterviewCommand';
import { SynthesizeCommand } from '../../src/commands/research/SynthesizeCommand';
import { ResearchService } from '../../src/services/ResearchService';
import { FileGenerator } from '../../src/services/FileGenerator';
import { IFileSystemService } from '../../src/contracts/infrastructure-contracts';
import { IOutput } from '../../src/contracts/presentation-contracts';
import { join } from 'path';

// Mock implementations for testing
class MockFileSystemService implements IFileSystemService {
  private files: Map<string, string> = new Map();
  public directories: Set<string> = new Set();

  async createDirectory(path: string, recursive?: boolean): Promise<void> {
    this.directories.add(path);
  }

  async ensureDirectoryExists(path: string): Promise<void> {
    const parts = path.split('/');
    let currentPath = '';
    
    for (const part of parts) {
      if (part) {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        this.directories.add(currentPath);
      }
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    this.files.set(path, content);
  }

  async readFile(path: string): Promise<string> {
    return this.files.get(path) || '';
  }

  async deleteFile(path: string): Promise<void> {
    this.files.delete(path);
  }

  async deleteDirectory(path: string, recursive?: boolean): Promise<void> {
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    this.directories.delete(path);
    this.directories.delete(normalizedPath);
    
    const filesToDelete = Array.from(this.files.keys()).filter(file => 
      file.startsWith(path) || file.startsWith(normalizedPath)
    );
    filesToDelete.forEach(file => this.files.delete(file));
  }

  async pathExists(path: string): Promise<boolean> {
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    return this.files.has(path) || this.files.has(normalizedPath) || 
           this.directories.has(path) || this.directories.has(normalizedPath);
  }

  async isDirectory(path: string): Promise<boolean> {
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    return this.directories.has(path) || this.directories.has(normalizedPath);
  }

  async listFiles(path: string, extension?: string): Promise<string[]> {
    const allPaths = [...this.files.keys(), ...this.directories];
    return allPaths.filter(file => {
      const normalizedFile = file.startsWith('/') ? file.substring(1) : file;
      const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
      
      return normalizedFile.startsWith(normalizedPath) && 
             normalizedFile !== normalizedPath && 
             (!extension || normalizedFile.endsWith(extension));
    });
  }

  joinPaths(...paths: string[]): string {
    return join(...paths);
  }

  basename(path: string, ext?: string): string {
    const parts = path.split('/');
    const filename = parts[parts.length - 1] || '';
    return ext ? filename.replace(ext, '') : filename;
  }

  dirname(path: string): string {
    const parts = path.split('/');
    return parts.slice(0, -1).join('/');
  }

  clear(): void {
    this.files.clear();
    this.directories.clear();
  }
}

class MockOutput implements IOutput {
  private output: string[] = [];

  write(text: string): void {
    this.output.push(text);
  }

  writeln(text: string): void {
    this.output.push(text + '\n');
  }

  writeError(text: string): void {
    this.output.push('ERROR: ' + text);
  }

  writeErrorln(text: string): void {
    this.output.push('ERROR: ' + text + '\n');
  }

  success(message: string): void {
    this.output.push('SUCCESS: ' + message);
  }

  info(message: string): void {
    this.output.push('INFO: ' + message);
  }

  warn(message: string): void {
    this.output.push('WARN: ' + message);
  }

  error(message: string, error?: Error): void {
    this.output.push('ERROR: ' + message);
    if (error) {
      this.output.push('ERROR_DETAILS: ' + error.message);
    }
  }

  log(message: string): void {
    this.output.push('LOG: ' + message);
  }

  startSpinner(text: string): void {
    this.output.push('SPINNER_START: ' + text);
  }

  stopSpinner(text?: string, failed?: boolean): void {
    this.output.push('SPINNER_STOP: ' + (text || '') + (failed ? ' (FAILED)' : ''));
  }

  async prompt(question: string, type?: 'input' | 'confirm' | 'list', choices?: string[]): Promise<any> {
    this.output.push('PROMPT: ' + question);
    return 'mock-response';
  }

  table(data: Record<string, any>[]): void {
    this.output.push('TABLE: ' + JSON.stringify(data));
  }

  flush(): void {
    // Mock implementation - no actual flushing needed
  }

  clear(): void {
    this.output = [];
  }

  getOutput(): string[] {
    return this.output;
  }
}

describe('Research Commands Use Cases', () => {
  let mockFileSystem: MockFileSystemService;
  let mockOutput: MockOutput;
  let researchService: ResearchService;
  let fileGenerator: FileGenerator;
  let questionsCommand: QuestionsCommand;
  let sourcesCommand: SourcesCommand;
  let summarizeCommand: SummarizeCommand;
  let interviewCommand: InterviewCommand;
  let synthesizeCommand: SynthesizeCommand;
  let projectRoot: string;

  beforeEach(() => {
    projectRoot = '/test-project';
    mockFileSystem = new MockFileSystemService();
    mockOutput = new MockOutput();
    
    fileGenerator = new FileGenerator(mockFileSystem);
    researchService = new ResearchService(mockFileSystem, fileGenerator);
    
    questionsCommand = new QuestionsCommand(researchService, mockOutput);
    sourcesCommand = new SourcesCommand(researchService, mockOutput);
    summarizeCommand = new SummarizeCommand(researchService, mockOutput);
    interviewCommand = new InterviewCommand(researchService, mockOutput);
    synthesizeCommand = new SynthesizeCommand(researchService, mockOutput);
  });

  afterEach(() => {
    mockFileSystem.clear();
    mockOutput.clear();
  });

  describe('Given a UX-Kit initialized project with studies', () => {
    beforeEach(async () => {
      // Set up a test study
      const studyPath = join(projectRoot, '.uxkit', 'studies', '001-test-study');
      await mockFileSystem.ensureDirectoryExists(studyPath);
      await mockFileSystem.writeFile(join(studyPath, 'study-config.yaml'), `
name: Test Study
description: A test study for research commands
status: active
`);
    });

    describe('When generating research questions', () => {
      it('Then should create questions.md file with AI-generated questions', async () => {
        // Given: A project with a study
        // When: Generating research questions
        // Then: Should create questions.md with structured questions
        
        const result = await questionsCommand.execute(['How do users interact with our product?'], { 
          study: '001-test-study',
          projectRoot 
        });
        
        expect(result.success).toBe(true);
        expect(result.message).toContain('Questions generated successfully');
        
        const questionsPath = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'questions.md');
        expect(await mockFileSystem.pathExists(questionsPath)).toBe(true);
        
        const questionsContent = await mockFileSystem.readFile(questionsPath);
        expect(questionsContent).toContain('# Research Questions for Study: Test Study');
        expect(questionsContent).toContain('How do users interact with our product?');
        expect(questionsContent).toContain('## Core Questions');
      });

      it('Then should handle missing study gracefully', async () => {
        // Given: A project without the specified study
        // When: Generating research questions
        // Then: Should handle gracefully with appropriate error
        
        const result = await questionsCommand.execute(['Test prompt'], { 
          study: 'non-existent-study',
          projectRoot 
        });
        
        expect(result.success).toBe(false);
        expect(result.message).toContain('Study not found');
      });

      it('Then should validate required arguments', async () => {
        // Given: A questions command
        // When: Validating arguments
        // Then: Should validate required prompt argument
        
        const validation = await questionsCommand.validate([], { projectRoot });
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBeGreaterThan(0);
      });
    });

    describe('When collecting research sources', () => {
      it('Then should create sources.md file with collected sources', async () => {
        // Given: A project with a study
        // When: Collecting research sources
        // Then: Should create sources.md with source information
        
        const sources = [
          { title: 'User Research Report', url: 'https://example.com/report', type: 'web' },
          { title: 'Interview Notes', filePath: '/path/to/notes.md', type: 'file' }
        ];
        
        const result = await sourcesCommand.execute([], { 
          study: '001-test-study',
          sources: JSON.stringify(sources),
          projectRoot 
        });
        
        expect(result.success).toBe(true);
        expect(result.message).toContain('Sources collected successfully');
        
        const sourcesPath = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'sources.md');
        expect(await mockFileSystem.pathExists(sourcesPath)).toBe(true);
        
        const sourcesContent = await mockFileSystem.readFile(sourcesPath);
        expect(sourcesContent).toContain('# Research Sources for Study: Test Study');
        expect(sourcesContent).toContain('User Research Report');
        expect(sourcesContent).toContain('Interview Notes');
      });

      it('Then should handle auto-discovery of sources', async () => {
        // Given: A project with a study and existing files
        // When: Auto-discovering sources
        // Then: Should find and catalog relevant files
        
        // Create some test files
        await mockFileSystem.writeFile(join(projectRoot, 'research-notes.md'), '# Research Notes');
        await mockFileSystem.writeFile(join(projectRoot, 'user-feedback.txt'), 'User feedback content');
        
        const result = await sourcesCommand.execute([], { 
          study: '001-test-study',
          autoDiscover: true,
          projectRoot 
        });
        
        expect(result.success).toBe(true);
        
        const sourcesPath = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'sources.md');
        const sourcesContent = await mockFileSystem.readFile(sourcesPath);
        expect(sourcesContent).toContain('research-notes.md');
        expect(sourcesContent).toContain('user-feedback.txt');
      });
    });

    describe('When summarizing research sources', () => {
      beforeEach(async () => {
        // Set up a source to summarize
        const sourcesPath = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'sources.md');
        await mockFileSystem.writeFile(sourcesPath, `
# Research Sources for Study: Test Study

## Collected Sources
- **Source ID**: web-article-1
  - **Title**: User Research Report
  - **Type**: Web
  - **URL**: https://example.com/report
  - **Date Added**: 2024-01-18
  - **Summary Status**: Not Summarized
`);
      });

      it('Then should create summary file for specified source', async () => {
        // Given: A project with a study and sources
        // When: Summarizing a source
        // Then: Should create summary file with key takeaways
        
        const result = await summarizeCommand.execute(['web-article-1'], { 
          study: '001-test-study',
          projectRoot 
        });
        
        expect(result.success).toBe(true);
        expect(result.message).toContain('Summary generated successfully');
        
        const summaryPath = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'summaries', 'web-article-1-summary.md');
        expect(await mockFileSystem.pathExists(summaryPath)).toBe(true);
        
        const summaryContent = await mockFileSystem.readFile(summaryPath);
        expect(summaryContent).toContain('# Summary of: User Research Report');
        expect(summaryContent).toContain('## Key Takeaways');
        expect(summaryContent).toContain('## Detailed Summary');
      });

      it('Then should handle non-existent source gracefully', async () => {
        // Given: A project with a study
        // When: Summarizing non-existent source
        // Then: Should handle gracefully with appropriate error
        
        const result = await summarizeCommand.execute(['non-existent-source'], { 
          study: '001-test-study',
          projectRoot 
        });
        
        expect(result.success).toBe(false);
        expect(result.message).toContain('Source not found');
      });
    });

    describe('When processing interview transcripts', () => {
      it('Then should create formatted interview file', async () => {
        // Given: A project with a study
        // When: Processing interview transcript
        // Then: Should create formatted interview file
        
        const transcript = `
Interviewer: Tell me about your experience with our product.
Participant: I found it very intuitive and easy to use.
Interviewer: What was your favorite feature?
Participant: The dashboard was really helpful for tracking my progress.
`;
        
        const result = await interviewCommand.execute([transcript], { 
          study: '001-test-study',
          participant: 'P001',
          projectRoot 
        });
        
        expect(result.success).toBe(true);
        expect(result.message).toContain('Interview processed successfully');
        
        const interviewPath = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'interviews', 'P001-interview.md');
        expect(await mockFileSystem.pathExists(interviewPath)).toBe(true);
        
        const interviewContent = await mockFileSystem.readFile(interviewPath);
        expect(interviewContent).toContain('# Interview Transcript: P001');
        expect(interviewContent).toContain('## Key Themes');
        expect(interviewContent).toContain('## Formatted Transcript');
      });

      it('Then should handle missing participant ID', async () => {
        // Given: A project with a study
        // When: Processing interview without participant ID
        // Then: Should generate default participant ID
        
        const transcript = 'Test transcript content';
        
        const result = await interviewCommand.execute([transcript], { 
          study: '001-test-study',
          projectRoot 
        });
        
        expect(result.success).toBe(true);
        
        // Should create interview with generated participant ID
        const interviewsDir = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'interviews');
        const files = await mockFileSystem.listFiles(interviewsDir);
        expect(files.length).toBeGreaterThan(0);
      });
    });

    describe('When synthesizing research insights', () => {
      beforeEach(async () => {
        // Set up research artifacts for synthesis
        const questionsPath = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'questions.md');
        await mockFileSystem.writeFile(questionsPath, `
# Research Questions for Study: Test Study

## Core Questions
- How do users interact with our product?
- What are the main pain points?
`);

        const sourcesPath = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'sources.md');
        await mockFileSystem.writeFile(sourcesPath, `
# Research Sources for Study: Test Study

## Collected Sources
- **Source ID**: web-article-1
  - **Title**: User Research Report
  - **Type**: Web
  - **URL**: https://example.com/report
`);

        const summaryPath = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'summaries', 'web-article-1-summary.md');
        await mockFileSystem.ensureDirectoryExists(join(projectRoot, '.uxkit', 'studies', '001-test-study', 'summaries'));
        await mockFileSystem.writeFile(summaryPath, `
# Summary of: User Research Report

## Key Takeaways
- Users find the product intuitive
- Dashboard is the most valued feature
`);
      });

      it('Then should create insights.md with synthesized findings', async () => {
        // Given: A project with a study and research artifacts
        // When: Synthesizing insights
        // Then: Should create insights.md with key findings and recommendations
        
        const result = await synthesizeCommand.execute([], { 
          study: '001-test-study',
          projectRoot 
        });
        
        expect(result.success).toBe(true);
        expect(result.message).toContain('Insights synthesized successfully');
        
        const insightsPath = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'insights.md');
        expect(await mockFileSystem.pathExists(insightsPath)).toBe(true);
        
        const insightsContent = await mockFileSystem.readFile(insightsPath);
        expect(insightsContent).toContain('# Synthesized Insights for Study: Test Study');
        expect(insightsContent).toContain('## Key Findings');
        expect(insightsContent).toContain('## Recommendations');
        expect(insightsContent).toContain('## Next Steps');
      });

      it('Then should handle study with no artifacts gracefully', async () => {
        // Given: A project with a study but no research artifacts
        // When: Synthesizing insights
        // Then: Should handle gracefully with appropriate message
        
        const result = await synthesizeCommand.execute([], { 
          study: '001-test-study',
          projectRoot 
        });
        
        expect(result.success).toBe(true);
        expect(result.message).toContain('Insights synthesized successfully');
      });
    });
  });

  describe('When using ResearchService directly', () => {
    beforeEach(async () => {
      // Set up a test study
      const studyPath = join(projectRoot, '.uxkit', 'studies', '001-test-study');
      await mockFileSystem.ensureDirectoryExists(studyPath);
      await mockFileSystem.writeFile(join(studyPath, 'study-config.yaml'), `
name: Test Study
description: A test study
status: active
`);
    });

    it('Then should generate questions with AI integration', async () => {
      // Given: A ResearchService with a study
      // When: Generating questions
      // Then: Should use AI to generate structured questions
      
      const result = await researchService.generateQuestions('001-test-study', 'How do users feel about our product?', projectRoot);
      
      expect(result.success).toBe(true);
      expect(result.filePath).toContain('questions.md');
      
      const content = await mockFileSystem.readFile(result.filePath);
      expect(content).toContain('How do users feel about our product?');
    });

    it('Then should collect and organize sources', async () => {
      // Given: A ResearchService with a study
      // When: Collecting sources
      // Then: Should organize sources in structured format
      
      const sources = [
        { id: 'test-source-1', title: 'Test Source', url: 'https://example.com', type: 'web' as const }
      ];
      
      const result = await researchService.collectSources('001-test-study', sources, projectRoot);
      
      expect(result.success).toBe(true);
      expect(result.filePath).toContain('sources.md');
      
      const content = await mockFileSystem.readFile(result.filePath);
      expect(content).toContain('Test Source');
    });

    it('Then should summarize source content', async () => {
      // Given: A ResearchService with a study and source
      // When: Summarizing source
      // Then: Should create detailed summary with key takeaways
      
      // First create a source
      const sourcesPath = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'sources.md');
      await mockFileSystem.writeFile(sourcesPath, `
# Research Sources

## Collected Sources
- **Source ID**: test-source-1
  - **Title**: Test Article
  - **Type**: Web
  - **URL**: https://example.com
`);
      
      const result = await researchService.summarizeSource('001-test-study', 'test-source-1', projectRoot);
      
      expect(result.success).toBe(true);
      expect(result.filePath).toContain('test-source-1-summary.md');
      
      const content = await mockFileSystem.readFile(result.filePath);
      expect(content).toContain('Test Article');
      expect(content).toContain('Key Takeaways');
    });

    it('Then should process interview transcripts', async () => {
      // Given: A ResearchService with a study
      // When: Processing interview transcript
      // Then: Should format and structure interview content
      
      const transcript = 'Interviewer: How was your experience? Participant: It was great!';
      
      const result = await researchService.processInterview('001-test-study', transcript, 'P001', projectRoot);
      
      expect(result.success).toBe(true);
      expect(result.filePath).toContain('P001-interview.md');
      
      const content = await mockFileSystem.readFile(result.filePath);
      expect(content).toContain('P001');
      expect(content).toContain('Key Themes');
    });

    it('Then should synthesize all research artifacts', async () => {
      // Given: A ResearchService with a study and multiple artifacts
      // When: Synthesizing insights
      // Then: Should combine all research into comprehensive insights
      
      // Create some test artifacts
      const questionsPath = join(projectRoot, '.uxkit', 'studies', '001-test-study', 'questions.md');
      await mockFileSystem.writeFile(questionsPath, '# Questions\n- How do users feel?');
      
      const result = await researchService.synthesizeInsights('001-test-study', projectRoot);
      
      expect(result.success).toBe(true);
      expect(result.filePath).toContain('insights.md');
      
      const content = await mockFileSystem.readFile(result.filePath);
      expect(content).toContain('Key Findings');
      expect(content).toContain('Recommendations');
    });
  });
});
