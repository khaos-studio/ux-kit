/**
 * ResearchService
 * 
 * Orchestrates research workflow operations and coordinates between
 * file generation and study management.
 */

import { IFileSystemService } from '../contracts/infrastructure-contracts';
import { FileGenerator, GenerationResult, Source } from './FileGenerator';

export interface ResearchResult {
  success: boolean;
  filePath: string;
  message: string;
  error?: string | undefined;
}

export class ResearchService {
  constructor(
    private fileSystem: IFileSystemService,
    private fileGenerator: FileGenerator
  ) {}

  /**
   * Generate research questions for a study
   */
  async generateQuestions(
    studyId: string,
    prompt: string,
    projectRoot: string
  ): Promise<ResearchResult> {
    try {
      // Get study information
      const studyInfo = await this.getStudyInfo(studyId, projectRoot);
      if (!studyInfo) {
        return {
          success: false,
          filePath: '',
          message: 'Study not found',
          error: `Study ${studyId} does not exist`
        };
      }

      // Generate questions using FileGenerator
      const result = await this.fileGenerator.generateQuestions(
        studyId,
        studyInfo.name,
        prompt,
        projectRoot
      );

      return {
        success: result.success,
        filePath: result.filePath,
        message: result.message,
        error: result.error
      };
    } catch (error: any) {
      return {
        success: false,
        filePath: '',
        message: 'Failed to generate questions',
        error: error.message
      };
    }
  }

  /**
   * Collect and organize research sources
   */
  async collectSources(
    studyId: string,
    sources: Source[],
    projectRoot: string,
    autoDiscover: boolean = false
  ): Promise<ResearchResult> {
    try {
      // Get study information
      const studyInfo = await this.getStudyInfo(studyId, projectRoot);
      if (!studyInfo) {
        return {
          success: false,
          filePath: '',
          message: 'Study not found',
          error: `Study ${studyId} does not exist`
        };
      }

      let allSources = [...sources];

      // Auto-discover sources if requested
      if (autoDiscover) {
        const discoveredSources = await this.fileGenerator.autoDiscoverSources(projectRoot);
        allSources = [...allSources, ...discoveredSources];
      }

      // Generate sources file using FileGenerator
      const result = await this.fileGenerator.generateSources(
        studyId,
        studyInfo.name,
        allSources,
        projectRoot
      );

      return {
        success: result.success,
        filePath: result.filePath,
        message: result.message,
        error: result.error
      };
    } catch (error: any) {
      return {
        success: false,
        filePath: '',
        message: 'Failed to collect sources',
        error: error.message
      };
    }
  }

  /**
   * Summarize a specific research source
   */
  async summarizeSource(
    studyId: string,
    sourceId: string,
    projectRoot: string
  ): Promise<ResearchResult> {
    try {
      // Get study information
      const studyInfo = await this.getStudyInfo(studyId, projectRoot);
      if (!studyInfo) {
        return {
          success: false,
          filePath: '',
          message: 'Study not found',
          error: `Study ${studyId} does not exist`
        };
      }

      // Get source information from sources.md
      const sourceInfo = await this.getSourceInfo(studyId, sourceId, projectRoot);
      if (!sourceInfo) {
        return {
          success: false,
          filePath: '',
          message: 'Source not found',
          error: `Source ${sourceId} not found in study ${studyId}`
        };
      }

      // Get source content
      const sourceContent = await this.getSourceContent(sourceInfo, projectRoot);

      // Generate summary using FileGenerator
      const result = await this.fileGenerator.generateSummary(
        studyId,
        sourceId,
        sourceInfo.title,
        sourceContent,
        projectRoot
      );

      return {
        success: result.success,
        filePath: result.filePath,
        message: result.message,
        error: result.error
      };
    } catch (error: any) {
      return {
        success: false,
        filePath: '',
        message: 'Failed to summarize source',
        error: error.message
      };
    }
  }

  /**
   * Process an interview transcript
   */
  async processInterview(
    studyId: string,
    transcript: string,
    participantId: string,
    projectRoot: string
  ): Promise<ResearchResult> {
    try {
      // Get study information
      const studyInfo = await this.getStudyInfo(studyId, projectRoot);
      if (!studyInfo) {
        return {
          success: false,
          filePath: '',
          message: 'Study not found',
          error: `Study ${studyId} does not exist`
        };
      }

      // Generate interview file using FileGenerator
      const result = await this.fileGenerator.generateInterview(
        studyId,
        participantId,
        transcript,
        projectRoot
      );

      return {
        success: result.success,
        filePath: result.filePath,
        message: result.message,
        error: result.error
      };
    } catch (error: any) {
      return {
        success: false,
        filePath: '',
        message: 'Failed to process interview',
        error: error.message
      };
    }
  }

  /**
   * Synthesize insights from all research artifacts
   */
  async synthesizeInsights(
    studyId: string,
    projectRoot: string
  ): Promise<ResearchResult> {
    try {
      // Get study information
      const studyInfo = await this.getStudyInfo(studyId, projectRoot);
      if (!studyInfo) {
        return {
          success: false,
          filePath: '',
          message: 'Study not found',
          error: `Study ${studyId} does not exist`
        };
      }

      // Collect all research artifacts
      const artifacts = await this.collectResearchArtifacts(studyId, projectRoot);
      
      if (artifacts.length === 0) {
        return {
          success: true,
          filePath: '',
          message: 'No research artifacts found for synthesis'
        };
      }

      // Generate insights using FileGenerator
      const result = await this.fileGenerator.generateInsights(
        studyId,
        studyInfo.name,
        artifacts,
        projectRoot
      );

      return {
        success: result.success,
        filePath: result.filePath,
        message: result.message,
        error: result.error
      };
    } catch (error: any) {
      return {
        success: false,
        filePath: '',
        message: 'Failed to synthesize insights',
        error: error.message
      };
    }
  }

  // Private helper methods

  private async getStudyInfo(studyId: string, projectRoot: string): Promise<{ name: string; description?: string } | null> {
    try {
      const studyPath = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'studies', studyId);
      const configPath = this.fileSystem.joinPaths(studyPath, 'study-config.yaml');

      if (!(await this.fileSystem.pathExists(configPath))) {
        return null;
      }

      const configContent = await this.fileSystem.readFile(configPath);
      const config = this.parseYamlConfig(configContent);

      return {
        name: config.name || studyId,
        description: config.description
      };
    } catch (error) {
      return null;
    }
  }

  private async getSourceInfo(studyId: string, sourceId: string, projectRoot: string): Promise<{ title: string; type: string; url?: string; filePath?: string } | null> {
    try {
      const studyPath = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'studies', studyId);
      const sourcesPath = this.fileSystem.joinPaths(studyPath, 'sources.md');

      if (!(await this.fileSystem.pathExists(sourcesPath))) {
        return null;
      }

      const sourcesContent = await this.fileSystem.readFile(sourcesPath);
      
      // Parse source information from sources.md
      const lines = sourcesContent.split('\n');
      let currentSource: any = null;
      let foundSource = false;

      for (const line of lines) {
        if (line.includes(`**Source ID**: ${sourceId}`)) {
          foundSource = true;
          currentSource = { id: sourceId };
          continue;
        }

        if (foundSource && line.trim().startsWith('- **Source ID**:')) {
          // End of current source
          break;
        }

        if (foundSource && currentSource) {
          if (line.includes('**Title**:')) {
            const parts = line.split('**Title**:');
            if (parts[1]) currentSource.title = parts[1].trim();
          } else if (line.includes('**Type**:')) {
            const parts = line.split('**Type**:');
            if (parts[1]) currentSource.type = parts[1].trim().toLowerCase();
          } else if (line.includes('**URL**:')) {
            const parts = line.split('**URL**:');
            if (parts[1]) currentSource.url = parts[1].trim();
          } else if (line.includes('**File Path**:')) {
            const parts = line.split('**File Path**:');
            if (parts[1]) currentSource.filePath = parts[1].trim();
          }
        }
      }

      return foundSource && currentSource ? currentSource : null;
    } catch (error) {
      return null;
    }
  }

  private async getSourceContent(sourceInfo: any, projectRoot: string): Promise<string> {
    try {
      if (sourceInfo.filePath) {
        // Read from file
        const fullPath = sourceInfo.filePath.startsWith('/') 
          ? sourceInfo.filePath 
          : this.fileSystem.joinPaths(projectRoot, sourceInfo.filePath);
        
        if (await this.fileSystem.pathExists(fullPath)) {
          return await this.fileSystem.readFile(fullPath);
        }
      }

      if (sourceInfo.url) {
        // For web sources, return a placeholder
        return `Web source: ${sourceInfo.url}\n\nThis is a placeholder for web content. In a real implementation, this would fetch and process the actual web content.`;
      }

      return `Source: ${sourceInfo.title}\n\nThis is a placeholder for source content.`;
    } catch (error) {
      return `Error reading source content: ${error}`;
    }
  }

  private async collectResearchArtifacts(studyId: string, projectRoot: string): Promise<string[]> {
    const artifacts: string[] = [];
    const studyPath = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'studies', studyId);

    try {
      // Collect questions.md
      const questionsPath = this.fileSystem.joinPaths(studyPath, 'questions.md');
      if (await this.fileSystem.pathExists(questionsPath)) {
        const content = await this.fileSystem.readFile(questionsPath);
        artifacts.push(content);
      }

      // Collect sources.md
      const sourcesPath = this.fileSystem.joinPaths(studyPath, 'sources.md');
      if (await this.fileSystem.pathExists(sourcesPath)) {
        const content = await this.fileSystem.readFile(sourcesPath);
        artifacts.push(content);
      }

      // Collect summaries
      const summariesDir = this.fileSystem.joinPaths(studyPath, 'summaries');
      if (await this.fileSystem.pathExists(summariesDir)) {
        const summaryFiles = await this.fileSystem.listFiles(summariesDir, '.md');
        for (const file of summaryFiles) {
          const content = await this.fileSystem.readFile(file);
          artifacts.push(content);
        }
      }

      // Collect interviews
      const interviewsDir = this.fileSystem.joinPaths(studyPath, 'interviews');
      if (await this.fileSystem.pathExists(interviewsDir)) {
        const interviewFiles = await this.fileSystem.listFiles(interviewsDir, '.md');
        for (const file of interviewFiles) {
          const content = await this.fileSystem.readFile(file);
          artifacts.push(content);
        }
      }
    } catch (error) {
      // Ignore errors in artifact collection
    }

    return artifacts;
  }

  private parseYamlConfig(content: string): any {
    try {
      // Simple YAML parsing for basic config files
      const lines = content.split('\n');
      const config: any = {};

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes(':')) {
          const [key, ...valueParts] = trimmed.split(':');
          const value = valueParts.join(':').trim();
          if (key) {
            config[key.trim()] = value;
          }
        }
      }

      return config;
    } catch (error) {
      return {};
    }
  }
}
