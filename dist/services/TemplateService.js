"use strict";
/**
 * Template Service
 *
 * Handles copying and management of template files.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = void 0;
class TemplateService {
    constructor(fileSystem) {
        this.fileSystem = fileSystem;
    }
    async copyTemplates(projectRoot, _templateSource) {
        const templatesDir = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'templates');
        // Create template files
        await this.createQuestionsTemplate(templatesDir);
        await this.createSourcesTemplate(templatesDir);
        await this.createSummarizeTemplate(templatesDir);
        await this.createInterviewTemplate(templatesDir);
        await this.createSynthesisTemplate(templatesDir);
    }
    async createQuestionsTemplate(templatesDir) {
        const content = `# Research Questions for Study: {{studyName}}

**Study ID**: {{studyId}}
**Date**: {{generationDate}}
**AI Agent**: {{aiAgentName}}

## Core Questions
{{#each questions}}
- **Q{{@index}}**: {{this.question}}
  - **Priority**: {{this.priority}}
  - **Category**: {{this.category}}
  - **Status**: {{this.status}}
  - **Context**: {{this.context}}
{{/each}}

## Sub-Questions
{{#each subQuestions}}
- {{this}}
{{/each}}

## AI Generated Prompts
{{#each prompts}}
- {{this}}
{{/each}}
`;
        await this.fileSystem.writeFile(this.fileSystem.joinPaths(templatesDir, 'questions-template.md'), content);
    }
    async createSourcesTemplate(templatesDir) {
        const content = `# Research Sources for Study: {{studyName}}

**Study ID**: {{studyId}}
**Date**: {{generationDate}}

## Collected Sources
{{#each sources}}
- **Source ID**: {{this.id}}
  - **Title**: {{this.title}}
  - **Type**: {{this.type}}
  - **URL/Path**: {{this.url}}
  - **Date Added**: {{this.dateAdded}}
  - **Tags**: {{this.tags}}
  - **Summary Status**: {{this.summaryStatus}}
{{/each}}

## Auto-Discovered Sources
{{#each autoDiscovered}}
- **Source ID**: {{this.id}}
  - **Title**: {{this.title}}
  - **Type**: {{this.type}}
  - **URL/Path**: {{this.url}}
  - **Date Added**: {{this.dateAdded}}
  - **Tags**: {{this.tags}}
{{/each}}
`;
        await this.fileSystem.writeFile(this.fileSystem.joinPaths(templatesDir, 'sources-template.md'), content);
    }
    async createSummarizeTemplate(templatesDir) {
        const content = `# Summary of: {{sourceTitle}}

**Source ID**: {{sourceId}}
**Study ID**: {{studyId}}
**Date**: {{generationDate}}
**AI Agent**: {{aiAgentName}}

## Key Takeaways
{{#each keyTakeaways}}
- {{this}}
{{/each}}

## Detailed Summary
{{detailedSummary}}

## Original Content Snippets
{{#each originalSnippets}}
> {{this}}
{{/each}}
`;
        await this.fileSystem.writeFile(this.fileSystem.joinPaths(templatesDir, 'summarize-template.md'), content);
    }
    async createInterviewTemplate(templatesDir) {
        const content = `# Interview Transcript: {{participantId}}

**Interview ID**: {{interviewId}}
**Study ID**: {{studyId}}
**Date**: {{interviewDate}}
**Participant**: {{participantId}}
**Interviewer**: {{interviewerName}}
**AI Agent**: {{aiAgentName}}

## Key Themes
{{#each keyThemes}}
- {{this}}
{{/each}}

## Formatted Transcript
{{formattedTranscript}}

## Notes
{{notes}}
`;
        await this.fileSystem.writeFile(this.fileSystem.joinPaths(templatesDir, 'interview-template.md'), content);
    }
    async createSynthesisTemplate(templatesDir) {
        const content = `# Synthesized Insights for Study: {{studyName}}

**Study ID**: {{studyId}}
**Date**: {{generationDate}}
**AI Agent**: {{aiAgentName}}

## Key Findings
{{#each keyFindings}}
- **Finding {{@index}}**: {{this.description}}
  - **Evidence**: {{this.evidence}}
  - **Implications**: {{this.implications}}
{{/each}}

## Recommendations
{{#each recommendations}}
- {{this}}
{{/each}}

## Next Steps
{{#each nextSteps}}
- {{this}}
{{/each}}
`;
        await this.fileSystem.writeFile(this.fileSystem.joinPaths(templatesDir, 'synthesis-template.md'), content);
    }
}
exports.TemplateService = TemplateService;
//# sourceMappingURL=TemplateService.js.map