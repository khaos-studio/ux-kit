# Research Sources for Study: {{studyName}}

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
