# Research Questions for Study: {{studyName}}

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
