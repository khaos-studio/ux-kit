#!/usr/bin/env node

/**
 * Simple test to verify Codex files are created in project root
 */

const fs = require('fs');
const path = require('path');

// Test the file generation logic
function testCodexFileGeneration() {
  console.log('🧪 Testing Codex file generation in project root...\n');
  
  const projectRoot = process.cwd();
  const codexConfigPath = path.join(projectRoot, 'codex.md');
  const codexDir = path.join(projectRoot, '.codex');
  const codexReadmePath = path.join(codexDir, 'README.md');
  
  // Generate codex.md content
  const codexConfig = `# Codex Configuration for UX-Kit

This file provides instructions for Codex v2 on how to work with UX-Kit research workflows.

## Project Overview

This is a UX research project using UX-Kit. UX-Kit is a toolkit for conducting user experience research with structured workflows for studies, interviews, and synthesis.

## Available Commands

You can help with the following UX research tasks:

### Study Management
- **Create Study**: "Create a new UX research study called [name]"
- **List Studies**: "Show me all the research studies in this project"
- **Study Details**: "Show me details about study [study-id]"

### Research Workflow
- **Generate Questions**: "Generate research questions for study [study-id] about [topic]"
- **Collect Sources**: "Help me collect research sources for study [study-id]"
- **Process Interview**: "Process this interview transcript for study [study-id]"
- **Synthesize Findings**: "Synthesize the research findings for study [study-id]"
- **Create Summary**: "Create a summary of study [study-id] findings"

### File Structure
- Studies are stored in \`.uxkit/studies/\`
- Each study has its own directory with configuration and data files
- Templates are available in \`.uxkit/templates/\`

## How to Help

When working with UX research tasks:

1. **Understand the Context**: Always consider the research goals and user needs
2. **Follow UX Best Practices**: Use established UX research methodologies
3. **Maintain Structure**: Keep research data organized and accessible
4. **Generate Quality Content**: Create clear, actionable research outputs

## Example Prompts

- "Create a new study about user onboarding experience"
- "Generate interview questions for understanding user pain points"
- "Help me synthesize findings from 5 user interviews"
- "Create a research summary for stakeholder presentation"

## File Locations

- Study data: \`.uxkit/studies/[study-id]/`
- Templates: \`.uxkit/templates/`
- Configuration: \`.uxkit/config.yaml`
- This file: \`codex.md\`

Remember: Always work within the UX-Kit structure and maintain the integrity of research data.
`;

  const readmeContent = `# Codex Integration for UX-Kit

This directory contains additional configuration for Codex v2 integration with UX-Kit.

## What's Here

- \`README.md\` - This file explaining the Codex integration
- Future configuration files may be added here

## How It Works

Codex v2 reads the \`codex.md\` file in the project root to understand how to help with UX research tasks. The main configuration is in that file, not in this directory.

## Getting Started

1. Make sure Codex v2 is installed and configured in your IDE
2. The \`codex.md\` file in the project root contains all the instructions
3. Use natural language prompts to ask Codex for help with UX research tasks

## Example Usage

- "Create a new UX research study about mobile app usability"
- "Generate interview questions for user feedback collection"
- "Help me synthesize findings from user interviews"

For more information, see the \`codex.md\` file in the project root.
`;

  try {
    // Create codex.md in project root
    fs.writeFileSync(codexConfigPath, codexConfig);
    console.log('✓ Created codex.md in project root');
    
    // Create .codex directory
    if (!fs.existsSync(codexDir)) {
      fs.mkdirSync(codexDir);
      console.log('✓ Created .codex directory');
    }
    
    // Create README in .codex directory
    fs.writeFileSync(codexReadmePath, readmeContent);
    console.log('✓ Created .codex/README.md');
    
    console.log('\n🎉 Codex v2 files created successfully!');
    console.log(`📄 Main config: ${codexConfigPath}`);
    console.log(`📁 Additional config: ${codexDir}`);
    
    return true;
  } catch (error) {
    console.error(`Failed to create Codex files: ${error.message}`);
    return false;
  }
}

// Run the test
const success = testCodexFileGeneration();

if (success) {
  console.log('\n✅ Test passed! Files should now be visible in your project root.');
} else {
  console.log('\n❌ Test failed!');
}
