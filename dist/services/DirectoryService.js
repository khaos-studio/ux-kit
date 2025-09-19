"use strict";
/**
 * Directory Service
 *
 * Handles creation and management of UX-Kit directory structure.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryService = void 0;
class DirectoryService {
    constructor(fileSystem) {
        this.fileSystem = fileSystem;
    }
    async createUXKitStructure(projectRoot) {
        const uxkitRoot = this.fileSystem.joinPaths(projectRoot, '.uxkit');
        // Create main .uxkit directory
        await this.fileSystem.ensureDirectoryExists(uxkitRoot);
        // Create subdirectories
        await this.fileSystem.ensureDirectoryExists(this.fileSystem.joinPaths(uxkitRoot, 'memory'));
        await this.fileSystem.ensureDirectoryExists(this.fileSystem.joinPaths(uxkitRoot, 'templates'));
        await this.fileSystem.ensureDirectoryExists(this.fileSystem.joinPaths(uxkitRoot, 'studies'));
    }
    async createConfigFile(projectRoot, options = {}) {
        const configPath = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'config.yaml');
        const config = {
            version: '1.0.0',
            aiAgent: {
                provider: options.aiAgent || 'cursor',
                settings: {}
            },
            storage: {
                basePath: './.uxkit/studies',
                format: 'markdown'
            },
            research: {
                defaultTemplates: {
                    questions: 'questions-template.md',
                    sources: 'sources-template.md',
                    summarize: 'summarize-template.md',
                    interview: 'interview-template.md',
                    synthesize: 'synthesis-template.md'
                },
                autoSave: true
            }
        };
        const yamlContent = this.convertToYaml(config);
        await this.fileSystem.writeFile(configPath, yamlContent);
    }
    async createPrinciplesFile(projectRoot) {
        const principlesPath = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'memory', 'principles.md');
        const principlesContent = `# UX-Kit Principles

## Spec-Driven Development
UX-Kit follows a specification-driven approach to UX research, ensuring that all research activities are guided by clear objectives and structured methodologies.

## AI Agent Integration
Leverage AI agents (Cursor, Codex, etc.) to enhance research workflows while maintaining human oversight and critical thinking.

## File-Based Approach
All research artifacts are stored as text files, making them easily accessible to AI agents and version control systems.

## Template-Driven Consistency
Use standardized templates to ensure consistent research outputs and facilitate AI agent understanding.

## Lightweight Implementation
Focus on essential functionality without complex data models or inference engines.
`;
        await this.fileSystem.writeFile(principlesPath, principlesContent);
    }
    async isUXKitInitialized(projectRoot) {
        const uxkitPath = this.fileSystem.joinPaths(projectRoot, '.uxkit');
        return await this.fileSystem.pathExists(uxkitPath);
    }
    convertToYaml(obj) {
        // Simple YAML conversion for basic objects
        let yaml = '';
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null) {
                yaml += `${key}:\n`;
                for (const [subKey, subValue] of Object.entries(value)) {
                    if (typeof subValue === 'object' && subValue !== null) {
                        yaml += `  ${subKey}:\n`;
                        for (const [subSubKey, subSubValue] of Object.entries(subValue)) {
                            yaml += `    ${subSubKey}: ${subSubValue}\n`;
                        }
                    }
                    else {
                        yaml += `  ${subKey}: ${subValue}\n`;
                    }
                }
            }
            else {
                yaml += `${key}: ${value}\n`;
            }
        }
        return yaml;
    }
}
exports.DirectoryService = DirectoryService;
//# sourceMappingURL=DirectoryService.js.map