"use strict";
/**
 * Command Executor
 *
 * Handles execution of slash commands by delegating to appropriate
 * command handlers and managing command lifecycle.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandExecutor = void 0;
/**
 * Command Executor for handling slash command execution
 */
class CommandExecutor {
    constructor(researchService, studyService) {
        this.commandHandlers = new Map();
        this.researchService = researchService;
        this.studyService = studyService;
        this.initializeCommandHandlers();
    }
    /**
     * Execute a command with the given arguments and context
     */
    async execute(commandName, args, context) {
        const handler = this.commandHandlers.get(commandName);
        if (!handler) {
            throw new Error(`Unknown command: ${commandName}`);
        }
        try {
            return await handler(args, context);
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                metadata: { command: commandName, args, context }
            };
        }
    }
    /**
     * Register a command handler
     */
    registerHandler(commandName, handler) {
        this.commandHandlers.set(commandName, handler);
    }
    /**
     * Unregister a command handler
     */
    unregisterHandler(commandName) {
        this.commandHandlers.delete(commandName);
    }
    /**
     * Get list of available commands
     */
    getAvailableCommands() {
        return Array.from(this.commandHandlers.keys());
    }
    /**
     * Check if a command is available
     */
    hasCommand(commandName) {
        return this.commandHandlers.has(commandName);
    }
    /**
     * Initialize default command handlers
     */
    initializeCommandHandlers() {
        // Research commands
        this.registerHandler('research:questions', this.handleResearchQuestions.bind(this));
        this.registerHandler('research:sources', this.handleResearchSources.bind(this));
        this.registerHandler('research:summarize', this.handleResearchSummarize.bind(this));
        this.registerHandler('research:interview', this.handleResearchInterview.bind(this));
        this.registerHandler('research:synthesize', this.handleResearchSynthesize.bind(this));
        // Study commands
        this.registerHandler('study:create', this.handleStudyCreate.bind(this));
        this.registerHandler('study:list', this.handleStudyList.bind(this));
        this.registerHandler('study:show', this.handleStudyShow.bind(this));
        this.registerHandler('study:delete', this.handleStudyDelete.bind(this));
    }
    /**
     * Handle research:questions command
     */
    async handleResearchQuestions(args, context) {
        // Parse arguments
        const params = this.parseArguments(args);
        const study = params.study;
        const topic = params.topic || context.selection || 'Research questions';
        if (!study) {
            return {
                success: false,
                error: 'Required parameter: study'
            };
        }
        try {
            // Use the real ResearchService to generate questions
            const result = await this.researchService.generateQuestions(study, topic, context.workspace);
            if (result.success) {
                return {
                    success: true,
                    output: `Research questions generated for study "${study}":\n\nFile created: ${result.filePath}`,
                    metadata: { study, topic, filePath: result.filePath, workspace: context.workspace }
                };
            }
            else {
                return {
                    success: false,
                    error: result.message || 'Failed to generate research questions'
                };
            }
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
    /**
     * Handle research:sources command
     */
    async handleResearchSources(args, context) {
        const params = this.parseArguments(args);
        const study = params.study;
        const autoDiscover = params.autoDiscover === 'true' || params.autoDiscover === true;
        if (!study) {
            return {
                success: false,
                error: 'Required parameter: study'
            };
        }
        try {
            // Use the real ResearchService to collect sources
            const sources = []; // Empty sources array for now
            const result = await this.researchService.collectSources(study, sources, context.workspace, autoDiscover);
            if (result.success) {
                return {
                    success: true,
                    output: `Research sources collected for study "${study}":\n\nFile created: ${result.filePath}`,
                    metadata: { study, autoDiscover, filePath: result.filePath, workspace: context.workspace }
                };
            }
            else {
                return {
                    success: false,
                    error: result.message || 'Failed to collect research sources'
                };
            }
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
    /**
     * Handle research:summarize command
     */
    async handleResearchSummarize(args, context) {
        const params = this.parseArguments(args);
        const study = params.study;
        const format = params.format || 'markdown';
        const length = params.length || 'brief';
        if (!study) {
            return {
                success: false,
                error: 'Required parameter: study'
            };
        }
        // Generate research summary (mock implementation)
        const summary = this.generateResearchSummary(study, length);
        const output = this.formatSummary(summary, format);
        return {
            success: true,
            output: `Research summary created for study "${study}":\n\n${output}`,
            metadata: { study, format, length, workspace: context.workspace }
        };
    }
    /**
     * Handle research:interview command
     */
    async handleResearchInterview(args, context) {
        const params = this.parseArguments(args);
        const study = params.study;
        const participant = params.participant;
        const format = params.format || 'markdown';
        const template = params.template || 'standard';
        if (!study || !participant) {
            return {
                success: false,
                error: 'Required parameters: study and participant'
            };
        }
        // Process interview data (mock implementation)
        const interviewData = this.processInterviewData(study, participant, template);
        const output = this.formatInterviewData(interviewData, format);
        return {
            success: true,
            output: `Interview data processed for study "${study}", participant "${participant}":\n\n${output}`,
            metadata: { study, participant, format, template, workspace: context.workspace }
        };
    }
    /**
     * Handle research:synthesize command
     */
    async handleResearchSynthesize(args, context) {
        const params = this.parseArguments(args);
        const study = params.study;
        const insights = params.insights;
        const format = params.format || 'markdown';
        const output = params.output || 'report';
        if (!study || !insights) {
            return {
                success: false,
                error: 'Required parameters: study and insights'
            };
        }
        // Synthesize research insights (mock implementation)
        const synthesis = this.synthesizeResearchInsights(study, insights);
        const formattedOutput = this.formatSynthesis(synthesis, format);
        return {
            success: true,
            output: `Research synthesis completed for study "${study}" with insights "${insights}":\n\n${formattedOutput}`,
            metadata: { study, insights, format, output, workspace: context.workspace }
        };
    }
    /**
     * Handle study:create command
     */
    async handleStudyCreate(args, context) {
        const params = this.parseArguments(args);
        const name = params.name;
        const description = params.description || 'Research study';
        if (!name) {
            return {
                success: false,
                error: 'Required parameter: name'
            };
        }
        try {
            // Use the real StudyService to create a study
            const study = await this.studyService.createStudy(name, description, context.workspace);
            return {
                success: true,
                output: `Study "${name}" created successfully:\n\nID: ${study.id}\nDirectory: ${study.basePath}`,
                metadata: { name, description, studyId: study.id, directoryPath: study.basePath, workspace: context.workspace }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
    /**
     * Handle study:list command
     */
    async handleStudyList(args, context) {
        const params = this.parseArguments(args);
        const format = params.format || 'table';
        const filter = params.filter;
        // List studies (mock implementation)
        const studies = this.listStudies(filter);
        const output = this.formatStudyList(studies, format);
        return {
            success: true,
            output: `Studies listed:\n\n${output}`,
            metadata: { format, filter, count: studies.length, workspace: context.workspace }
        };
    }
    /**
     * Handle study:show command
     */
    async handleStudyShow(args, context) {
        const params = this.parseArguments(args);
        const name = params.name;
        const format = params.format || 'detailed';
        const details = params.details;
        if (!name) {
            return {
                success: false,
                error: 'Required parameter: name'
            };
        }
        // Show study details (mock implementation)
        const study = this.getStudy(name);
        if (!study) {
            return {
                success: false,
                error: `Study "${name}" not found`
            };
        }
        const output = this.formatStudyDetails(study, format, details);
        return {
            success: true,
            output: `Study details for "${name}":\n\n${output}`,
            metadata: { name, format, details, workspace: context.workspace }
        };
    }
    /**
     * Handle study:delete command
     */
    async handleStudyDelete(args, context) {
        const params = this.parseArguments(args);
        const name = params.name;
        const confirm = params.confirm;
        const force = params.force;
        if (!name) {
            return {
                success: false,
                error: 'Required parameter: name'
            };
        }
        if (!confirm && !force) {
            return {
                success: false,
                error: 'Deletion requires confirmation. Use --confirm or --force flag.'
            };
        }
        // Delete study (mock implementation)
        const deleted = this.deleteStudy(name, force);
        if (!deleted) {
            return {
                success: false,
                error: `Study "${name}" not found or could not be deleted`
            };
        }
        return {
            success: true,
            output: `Study "${name}" deleted successfully`,
            metadata: { name, confirmed: confirm, forced: force, workspace: context.workspace }
        };
    }
    /**
     * Parse command line arguments
     */
    parseArguments(args) {
        const params = {};
        for (const arg of args) {
            if (arg.startsWith('--')) {
                const [key, value] = arg.substring(2).split('=');
                if (key && value !== undefined) {
                    // Handle quoted values
                    params[key] = value.startsWith('"') && value.endsWith('"')
                        ? value.slice(1, -1)
                        : value;
                }
                else if (key) {
                    // Boolean flag
                    params[key] = true;
                }
            }
        }
        return params;
    }
    // Mock implementation methods
    generateResearchQuestions(topic, count) {
        const questions = [
            `How do users interact with ${topic}?`,
            `What are the main pain points in ${topic}?`,
            `How can we improve the user experience of ${topic}?`,
            `What are the key success factors for ${topic}?`,
            `How do users navigate through ${topic}?`
        ];
        return questions.slice(0, count);
    }
    formatQuestions(questions, format) {
        if (format === 'markdown') {
            return questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
        }
        return questions.join('\n');
    }
    generateResearchSources(keywords, limit) {
        const sources = [
            'Academic paper on UX research methodologies',
            'Industry report on user behavior patterns',
            'Case study on similar product implementations',
            'User interview transcripts and analysis',
            'Competitive analysis of market leaders'
        ];
        return sources.slice(0, limit);
    }
    formatSources(sources) {
        return sources.map((s, i) => `${i + 1}. ${s}`).join('\n');
    }
    generateResearchSummary(study, length) {
        return `Summary of ${study} research findings (${length} format):\n\nKey insights and recommendations based on user research data.`;
    }
    formatSummary(summary, format) {
        return summary;
    }
    processInterviewData(study, participant, template) {
        return {
            study,
            participant,
            template,
            data: 'Processed interview data'
        };
    }
    formatInterviewData(data, format) {
        return `Interview data for ${data.participant} in study ${data.study}`;
    }
    synthesizeResearchInsights(study, insights) {
        return {
            study,
            insights,
            synthesis: 'Synthesized research insights'
        };
    }
    formatSynthesis(synthesis, format) {
        return `Synthesis of ${synthesis.insights} for study ${synthesis.study}`;
    }
    createStudy(name, description, template) {
        return {
            name,
            description,
            template,
            createdAt: new Date().toISOString()
        };
    }
    formatStudy(study, format) {
        return `Study: ${study.name}\nDescription: ${study.description}\nCreated: ${study.createdAt}`;
    }
    listStudies(filter) {
        return [
            { name: 'user-interviews', description: 'User interview study', status: 'active' },
            { name: 'usability-test', description: 'Usability testing study', status: 'completed' }
        ];
    }
    formatStudyList(studies, format) {
        if (format === 'table') {
            return studies.map(s => `${s.name} | ${s.description} | ${s.status}`).join('\n');
        }
        return studies.map(s => `- ${s.name}: ${s.description}`).join('\n');
    }
    getStudy(name) {
        const studies = this.listStudies();
        return studies.find(s => s.name === name) || null;
    }
    formatStudyDetails(study, format, details) {
        return `Study: ${study.name}\nDescription: ${study.description}\nStatus: ${study.status}`;
    }
    deleteStudy(name, force) {
        // Mock implementation - always succeeds
        return true;
    }
}
exports.CommandExecutor = CommandExecutor;
//# sourceMappingURL=CommandExecutor.js.map