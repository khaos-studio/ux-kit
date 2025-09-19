# Research Specification: {{researchName}}

**Type**: {{researchType}}
**Study ID**: {{studyId}}
**Branch**: {{branchName}}
**Created**: {{createdDate}}
**Status**: {{status}}

## Research Objectives

{{researchObjectives}}

## Research Questions

### Primary Questions
{{#each primaryQuestions}}
- {{this}}
{{/each}}

### Secondary Questions
{{#each secondaryQuestions}}
- {{this}}
{{/each}}

## Methodology

### Research Methods
{{#each methods}}
- **{{this.name}}**: {{this.description}}
  - **Timeline**: {{this.timeline}}
  - **Participants**: {{this.participants}}
  - **Deliverables**: {{this.deliverables}}
{{/each}}

### Data Collection
- **Sources**: {{dataSources}}
- **Tools**: {{dataTools}}
- **Timeline**: {{dataTimeline}}

## Expected Outcomes

### Key Insights
{{#each expectedInsights}}
- {{this}}
{{/each}}

### Deliverables
{{#each deliverables}}
- **{{this.type}}**: {{this.description}}
  - **Format**: {{this.format}}
  - **Due Date**: {{this.dueDate}}
{{/each}}

## Timeline

| Phase | Description | Duration | Start Date | End Date |
|-------|-------------|----------|------------|----------|
{{#each timeline}}
| {{this.phase}} | {{this.description}} | {{this.duration}} | {{this.startDate}} | {{this.endDate}} |
{{/each}}

## Resources

### Team Members
{{#each team}}
- **{{this.name}}** ({{this.role}}): {{this.responsibilities}}
{{/each}}

### Tools and Materials
{{#each tools}}
- {{this}}
{{/each}}

### Budget Considerations
{{budgetNotes}}

## Success Criteria

{{#each successCriteria}}
- {{this}}
{{/each}}

## Risks and Mitigation

| Risk | Impact | Probability | Mitigation Strategy |
|------|---------|-------------|-------------------|
{{#each risks}}
| {{this.risk}} | {{this.impact}} | {{this.probability}} | {{this.mitigation}} |
{{/each}}

## Notes

{{notes}}

---

*This specification was generated using UX-Kit's research workflow. For more information, see the [UX-Kit documentation](https://ux-kit.dev).*

