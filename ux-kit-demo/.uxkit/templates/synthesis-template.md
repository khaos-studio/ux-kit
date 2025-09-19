# Synthesized Insights for Study: {{studyName}}

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
