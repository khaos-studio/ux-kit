"use strict";
/**
 * FileGenerator Service
 *
 * Handles the generation of research artifact files using templates
 * and AI integration for content creation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileGenerator = void 0;
const uuid_1 = require("uuid");
class FileGenerator {
    constructor(fileSystem) {
        this.fileSystem = fileSystem;
    }
    /**
     * Generate a questions.md file with AI-generated research questions
     */
    async generateQuestions(studyId, studyName, prompt, projectRoot) {
        try {
            const studyPath = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'studies', studyId);
            const questionsPath = this.fileSystem.joinPaths(studyPath, 'questions.md');
            // Generate questions using AI (mock implementation for now)
            const questions = this.generateQuestionsFromPrompt(prompt);
            const content = this.generateQuestionsContent(studyName, studyId, questions);
            await this.fileSystem.writeFile(questionsPath, content);
            return {
                success: true,
                filePath: questionsPath,
                message: 'Questions generated successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                filePath: '',
                message: 'Failed to generate questions',
                error: error.message
            };
        }
    }
    /**
     * Generate a sources.md file with collected research sources
     */
    async generateSources(studyId, studyName, sources, projectRoot) {
        try {
            const studyPath = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'studies', studyId);
            const sourcesPath = this.fileSystem.joinPaths(studyPath, 'sources.md');
            const content = this.generateSourcesContent(studyName, studyId, sources);
            await this.fileSystem.writeFile(sourcesPath, content);
            return {
                success: true,
                filePath: sourcesPath,
                message: 'Sources collected successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                filePath: '',
                message: 'Failed to collect sources',
                error: error.message
            };
        }
    }
    /**
     * Generate a summary file for a specific source
     */
    async generateSummary(studyId, sourceId, sourceTitle, sourceContent, projectRoot) {
        try {
            const studyPath = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'studies', studyId);
            const summariesDir = this.fileSystem.joinPaths(studyPath, 'summaries');
            await this.fileSystem.ensureDirectoryExists(summariesDir);
            const summaryPath = this.fileSystem.joinPaths(summariesDir, `${sourceId}-summary.md`);
            // Generate summary using AI (mock implementation for now)
            const summary = this.generateSummaryFromContent(sourceContent);
            const content = this.generateSummaryContent(sourceTitle, sourceId, studyId, summary);
            await this.fileSystem.writeFile(summaryPath, content);
            return {
                success: true,
                filePath: summaryPath,
                message: 'Summary generated successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                filePath: '',
                message: 'Failed to generate summary',
                error: error.message
            };
        }
    }
    /**
     * Generate an interview file from transcript
     */
    async generateInterview(studyId, participantId, transcript, projectRoot) {
        try {
            const studyPath = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'studies', studyId);
            const interviewsDir = this.fileSystem.joinPaths(studyPath, 'interviews');
            await this.fileSystem.ensureDirectoryExists(interviewsDir);
            const interviewPath = this.fileSystem.joinPaths(interviewsDir, `${participantId}-interview.md`);
            // Process transcript using AI (mock implementation for now)
            const processedInterview = this.processTranscript(transcript);
            const content = this.generateInterviewContent(participantId, studyId, processedInterview);
            await this.fileSystem.writeFile(interviewPath, content);
            return {
                success: true,
                filePath: interviewPath,
                message: 'Interview processed successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                filePath: '',
                message: 'Failed to process interview',
                error: error.message
            };
        }
    }
    /**
     * Generate insights.md file by synthesizing all research artifacts
     */
    async generateInsights(studyId, studyName, artifacts, projectRoot) {
        try {
            const studyPath = this.fileSystem.joinPaths(projectRoot, '.uxkit', 'studies', studyId);
            const insightsPath = this.fileSystem.joinPaths(studyPath, 'insights.md');
            // Synthesize insights using AI (mock implementation for now)
            const insights = this.synthesizeInsights(artifacts);
            const content = this.generateInsightsContent(studyName, studyId, insights);
            await this.fileSystem.writeFile(insightsPath, content);
            return {
                success: true,
                filePath: insightsPath,
                message: 'Insights synthesized successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                filePath: '',
                message: 'Failed to synthesize insights',
                error: error.message
            };
        }
    }
    /**
     * Auto-discover relevant files in the project
     */
    async autoDiscoverSources(projectRoot) {
        const sources = [];
        const extensions = ['.md', '.txt', '.pdf', '.doc', '.docx'];
        try {
            const files = await this.fileSystem.listFiles(projectRoot);
            for (const file of files) {
                const ext = this.getFileExtension(file);
                if (extensions.includes(ext)) {
                    const id = `file-${(0, uuid_1.v4)().substring(0, 8)}`;
                    const title = this.fileSystem.basename(file, ext);
                    sources.push({
                        id,
                        title,
                        type: 'file',
                        filePath: file,
                        dateAdded: new Date(),
                        summaryStatus: 'not_summarized'
                    });
                }
            }
        }
        catch (error) {
            // Ignore errors in auto-discovery
        }
        return sources;
    }
    // Private helper methods
    generateQuestionsFromPrompt(prompt) {
        // Mock AI implementation - in real implementation, this would call an AI service
        return [
            `What are the main user pain points related to: ${prompt}?`,
            `How do users currently solve problems related to: ${prompt}?`,
            `What would make the experience better for: ${prompt}?`,
            `What are the key success metrics for: ${prompt}?`
        ];
    }
    generateQuestionsContent(studyName, studyId, questions) {
        const date = new Date().toISOString().split('T')[0];
        let content = `# Research Questions for Study: ${studyName}\n\n`;
        content += `**Study ID**: ${studyId}\n`;
        content += `**Date**: ${date}\n`;
        content += `**AI Agent**: Mock AI Agent\n\n`;
        content += `## Core Questions\n\n`;
        questions.forEach((question, index) => {
            content += `- **Q${index + 1}**: ${question}\n`;
            content += `  - **Priority**: High\n`;
            content += `  - **Category**: User Research\n`;
            content += `  - **Status**: Open\n`;
            content += `  - **Context**: Generated from research prompt\n\n`;
        });
        content += `## Sub-Questions\n\n`;
        content += `*Additional questions will be added as research progresses*\n\n`;
        content += `## AI Generated Prompts\n\n`;
        content += `*Prompts used to generate these questions will be documented here*\n`;
        return content;
    }
    generateSourcesContent(studyName, studyId, sources) {
        const date = new Date().toISOString().split('T')[0];
        let content = `# Research Sources for Study: ${studyName}\n\n`;
        content += `**Study ID**: ${studyId}\n`;
        content += `**Date**: ${date}\n\n`;
        content += `## Collected Sources\n\n`;
        sources.forEach(source => {
            content += `- **Source ID**: ${source.id}\n`;
            content += `  - **Title**: ${source.title}\n`;
            content += `  - **Type**: ${source.type.charAt(0).toUpperCase() + source.type.slice(1)}\n`;
            if (source.url) {
                content += `  - **URL**: ${source.url}\n`;
            }
            if (source.filePath) {
                content += `  - **File Path**: ${source.filePath}\n`;
            }
            content += `  - **Date Added**: ${source.dateAdded?.toISOString().split('T')[0] || date}\n`;
            if (source.tags && source.tags.length > 0) {
                content += `  - **Tags**: ${source.tags.join(', ')}\n`;
            }
            content += `  - **Summary Status**: ${source.summaryStatus || 'Not Summarized'}\n\n`;
        });
        content += `## Auto-Discovered Sources\n\n`;
        content += `*Sources discovered automatically in the project will be listed here*\n`;
        return content;
    }
    generateSummaryFromContent(content) {
        // Mock AI implementation
        return {
            keyTakeaways: [
                'Key insight 1 from the source',
                'Key insight 2 from the source',
                'Key insight 3 from the source'
            ],
            detailedSummary: `This source provides valuable insights into the research topic. The content covers important aspects that are relevant to our study objectives. Key themes include user behavior patterns, pain points, and opportunities for improvement.`
        };
    }
    generateSummaryContent(sourceTitle, sourceId, studyId, summary) {
        const date = new Date().toISOString().split('T')[0];
        let content = `# Summary of: ${sourceTitle}\n\n`;
        content += `**Source ID**: ${sourceId}\n`;
        content += `**Study ID**: ${studyId}\n`;
        content += `**Date**: ${date}\n`;
        content += `**AI Agent**: Mock AI Agent\n\n`;
        content += `## Key Takeaways\n\n`;
        summary.keyTakeaways.forEach((takeaway) => {
            content += `- ${takeaway}\n`;
        });
        content += `\n## Detailed Summary\n\n`;
        content += `${summary.detailedSummary}\n\n`;
        content += `## Original Content Snippets\n\n`;
        content += `*Relevant excerpts from the original source will be included here*\n`;
        return content;
    }
    processTranscript(transcript) {
        // Mock AI implementation
        return {
            keyThemes: [
                'User Experience',
                'Product Features',
                'Pain Points',
                'Suggestions'
            ],
            formattedTranscript: transcript.replace(/\n/g, '\n\n')
        };
    }
    generateInterviewContent(participantId, studyId, interview) {
        const date = new Date().toISOString().split('T')[0];
        let content = `# Interview Transcript: ${participantId}\n\n`;
        content += `**Interview ID**: ${(0, uuid_1.v4)().substring(0, 8)}\n`;
        content += `**Study ID**: ${studyId}\n`;
        content += `**Date**: ${date}\n`;
        content += `**Participant**: ${participantId}\n`;
        content += `**Interviewer**: Research Team\n`;
        content += `**AI Agent**: Mock AI Agent\n\n`;
        content += `## Key Themes\n\n`;
        interview.keyThemes.forEach((theme) => {
            content += `- ${theme}\n`;
        });
        content += `\n## Formatted Transcript\n\n`;
        content += `${interview.formattedTranscript}\n\n`;
        content += `## Notes\n\n`;
        content += `*Additional notes and observations will be added here*\n`;
        return content;
    }
    synthesizeInsights(artifacts) {
        // Mock AI implementation
        return {
            keyFindings: [
                'Finding 1: Users value intuitive interfaces',
                'Finding 2: Performance is a key concern',
                'Finding 3: Mobile experience needs improvement'
            ],
            recommendations: [
                'Recommendation 1: Improve onboarding flow',
                'Recommendation 2: Optimize loading times',
                'Recommendation 3: Enhance mobile responsiveness'
            ],
            nextSteps: [
                'Next Step 1: Conduct usability testing',
                'Next Step 2: Implement performance monitoring',
                'Next Step 3: Design mobile-first interface'
            ]
        };
    }
    generateInsightsContent(studyName, studyId, insights) {
        const date = new Date().toISOString().split('T')[0];
        let content = `# Synthesized Insights for Study: ${studyName}\n\n`;
        content += `**Study ID**: ${studyId}\n`;
        content += `**Date**: ${date}\n`;
        content += `**AI Agent**: Mock AI Agent\n\n`;
        content += `## Key Findings\n\n`;
        insights.keyFindings.forEach((finding, index) => {
            content += `- **Finding ${index + 1}**: ${finding}\n`;
            content += `  - **Evidence**: Reference to sources/interviews\n`;
            content += `  - **Implications**: Impact on product/design\n\n`;
        });
        content += `## Recommendations\n\n`;
        insights.recommendations.forEach((recommendation) => {
            content += `- ${recommendation}\n`;
        });
        content += `\n## Next Steps\n\n`;
        insights.nextSteps.forEach((step) => {
            content += `- ${step}\n`;
        });
        return content;
    }
    getFileExtension(filename) {
        const lastDot = filename.lastIndexOf('.');
        return lastDot !== -1 ? filename.substring(lastDot) : '';
    }
}
exports.FileGenerator = FileGenerator;
//# sourceMappingURL=FileGenerator.js.map