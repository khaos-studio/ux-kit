/**
 * Script to create Codex integration directory structure
 * 
 * This script creates the required directory structure for Codex integration
 * and can be run as part of the build process or manually.
 */

import { DirectoryStructureService } from '../services/DirectoryStructureService';
import * as path from 'path';

async function createCodexDirectories(): Promise<void> {
  const projectRoot = process.cwd();
  const directoryService = new DirectoryStructureService(projectRoot);

  console.log('Creating Codex integration directory structure...');

  try {
    const result = await directoryService.createCodexDirectoryStructure();

    if (result.success) {
      console.log('✅ Successfully created Codex integration directories:');
      result.createdDirectories.forEach(dir => {
        console.log(`  - ${dir}`);
      });
    } else {
      console.error('❌ Failed to create some directories:');
      result.errors.forEach(error => {
        console.error(`  - ${error}`);
      });
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Unexpected error creating directories:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  createCodexDirectories().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { createCodexDirectories };
