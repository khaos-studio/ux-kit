/**
 * Study Service
 * 
 * Handles creation, management, and operations on research studies.
 */

import { IFileSystemService } from '../contracts/infrastructure-contracts';

export interface StudyMetadata {
  id: string;
  name: string;
  description?: string;
  basePath: string;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export class StudyService {
  constructor(private fileSystem: IFileSystemService) {}

  async createStudy(name: string, description: string = '', projectRoot: string): Promise<StudyMetadata> {
    const studyId = await this.generateStudyId(projectRoot, name);
    const studyPath = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'studies', studyId);
    
    // Create study directory
    await this.fileSystem.ensureDirectoryExists(studyPath);
    
    // Create subdirectories
    await this.fileSystem.ensureDirectoryExists(this.fileSystem.joinPaths(studyPath, 'summaries'));
    await this.fileSystem.ensureDirectoryExists(this.fileSystem.joinPaths(studyPath, 'interviews'));
    
    // Create study configuration
    await this.createStudyConfig(studyPath, studyId, name, description);
    
    // Create initial artifact files
    await this.createInitialArtifacts(studyPath, studyId, name);
    
    return {
      id: studyId,
      name,
      description,
      basePath: studyPath,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async listStudies(projectRoot: string): Promise<StudyMetadata[]> {
    const studiesDir = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'studies');
    
    if (!(await this.fileSystem.pathExists(studiesDir))) {
      return [];
    }
    
    const allPaths = await this.fileSystem.listDirectories(studiesDir);
    
    const studies: StudyMetadata[] = [];
    
    // Since listDirectories already returns only directories, we can use them directly
    const studyDirs = allPaths;
    
    for (const studyDir of studyDirs) {
      const studyId = this.fileSystem.basename(studyDir);
      const study = await this.getStudy(studyId, projectRoot);
      if (study) {
        studies.push(study);
      }
    }
    
    return studies.sort((a, b) => a.id.localeCompare(b.id));
  }

  async getStudy(studyId: string, projectRoot: string): Promise<StudyMetadata | undefined> {
    const studyPath = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'studies', studyId);
    
    if (!(await this.fileSystem.pathExists(studyPath))) {
      return undefined;
    }
    
    const configPath = this.fileSystem.joinPaths(studyPath, 'study-config.yaml');
    if (!(await this.fileSystem.pathExists(configPath))) {
      return undefined;
    }
    
    const configContent = await this.fileSystem.readFile(configPath);
    const config = this.parseYamlConfig(configContent);
    
    return {
      id: studyId,
      name: config.name || studyId,
      description: config.description,
      basePath: studyPath,
      createdAt: config.createdAt ? new Date(config.createdAt) : undefined,
      updatedAt: config.updatedAt ? new Date(config.updatedAt) : undefined
    };
  }

  async deleteStudy(studyId: string, projectRoot: string): Promise<void> {
    const studyPath = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'studies', studyId);
    
    if (!(await this.fileSystem.pathExists(studyPath))) {
      throw new Error(`Study not found: ${studyId}`);
    }
    
    await this.fileSystem.deleteDirectory(studyPath, true);
  }

  private async generateStudyId(projectRoot: string, name: string): Promise<string> {
    const studiesDir = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'studies');
    
    // If studies directory doesn't exist, this is the first study
    if (!(await this.fileSystem.pathExists(studiesDir))) {
      const numberPart = '001';
      const namePart = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      return `${numberPart}-${namePart}`;
    }
    
    // Get existing studies to determine next number
    const studies = await this.listStudies(projectRoot);
    const nextNumber = studies.length + 1;
    const numberPart = nextNumber.toString().padStart(3, '0');
    const namePart = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return `${numberPart}-${namePart}`;
  }

  private async createStudyConfig(studyPath: string, studyId: string, name: string, description: string): Promise<void> {
    const config = {
      version: '1.0.0',
      studyId,
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      aiAgent: {
        provider: 'cursor',
        settings: {}
      },
      research: {
        defaultTemplates: {
          questions: 'questions-template.md',
          sources: 'sources-template.md',
          summarize: 'summarize-template.md',
          interview: 'interview-template.md',
          synthesize: 'synthesis-template.md'
        }
      }
    };

    const yamlContent = this.convertToYaml(config);
    const configPath = this.fileSystem.joinPaths(studyPath, 'study-config.yaml');
    await this.fileSystem.writeFile(configPath, yamlContent);
  }

  private async createInitialArtifacts(studyPath: string, studyId: string, name: string): Promise<void> {
    // Create questions.md
    const questionsContent = `# Research Questions for Study: ${name}

**Study ID**: ${studyId}
**Date**: ${new Date().toISOString()}

## Core Questions
<!-- Add your research questions here -->

## Sub-Questions
<!-- Add sub-questions here -->

## AI Generated Prompts
<!-- AI-generated prompts will appear here -->
`;

    await this.fileSystem.writeFile(
      this.fileSystem.joinPaths(studyPath, 'questions.md'),
      questionsContent
    );

    // Create sources.md
    const sourcesContent = `# Research Sources for Study: ${name}

**Study ID**: ${studyId}
**Date**: ${new Date().toISOString()}

## Collected Sources
<!-- Add your research sources here -->

## Auto-Discovered Sources
<!-- Auto-discovered sources will appear here -->
`;

    await this.fileSystem.writeFile(
      this.fileSystem.joinPaths(studyPath, 'sources.md'),
      sourcesContent
    );

    // Create insights.md
    const insightsContent = `# Synthesized Insights for Study: ${name}

**Study ID**: ${studyId}
**Date**: ${new Date().toISOString()}

## Key Findings
<!-- Add your key findings here -->

## Recommendations
<!-- Add recommendations here -->

## Next Steps
<!-- Add next steps here -->
`;

    await this.fileSystem.writeFile(
      this.fileSystem.joinPaths(studyPath, 'insights.md'),
      insightsContent
    );
  }

  private convertToYaml(obj: any): string {
    // Simple YAML conversion for basic objects
    let yaml = '';
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        yaml += `${key}:\n`;
        for (const [subKey, subValue] of Object.entries(value)) {
          if (typeof subValue === 'object' && subValue !== null && !Array.isArray(subValue)) {
            yaml += `  ${subKey}:\n`;
            for (const [subSubKey, subSubValue] of Object.entries(subValue)) {
              yaml += `    ${subSubKey}: ${subSubValue}\n`;
            }
          } else {
            yaml += `  ${subKey}: ${subValue}\n`;
          }
        }
      } else {
        yaml += `${key}: ${value}\n`;
      }
    }
    
    return yaml;
  }

  private parseYamlConfig(yamlContent: string): any {
    // Simple YAML parsing for basic objects
    const config: any = {};
    const lines = yamlContent.split('\n');
    
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#')) {
        const trimmedLine = line.trim();
        if (trimmedLine.includes(':')) {
          const [key, ...valueParts] = trimmedLine.split(':');
          if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim();
            config[key.trim()] = value;
          }
        }
      }
    }
    
    return config;
  }
}
