/**
 * DirectoryStructureService - Handles creation of directory structures for Codex integration
 * 
 * This service creates the required directory structure for Codex integration
 * including services, contracts, tests, and templates directories.
 */

import * as fs from 'fs-extra';
import * as path from 'path';

export interface DirectoryCreationResult {
  success: boolean;
  errors: string[];
  createdDirectories: string[];
  skippedDirectories: string[];
}

export interface DirectoryInfo {
  path: string;
  exists: boolean;
  isDirectory: boolean;
  isWritable: boolean;
}

export class DirectoryStructureService {
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Creates the complete Codex integration directory structure
   */
  async createCodexDirectoryStructure(): Promise<DirectoryCreationResult> {
    const errors: string[] = [];
    const createdDirectories: string[] = [];
    const skippedDirectories: string[] = [];
    let success = true;

    const requiredDirectories = [
      'src/services/codex',
      'src/contracts/codex',
      'tests/unit/services/codex',
      'tests/integration/codex',
      'templates/codex-commands'
    ];

    try {
      // Create all required directories
      for (const dir of requiredDirectories) {
        const dirPath = path.join(this.projectRoot, dir);
        
        try {
          await this.createDirectoryIfNotExists(dirPath);
          createdDirectories.push(dir);
        } catch (error) {
          const errorMessage = `Failed to create directory ${dir}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMessage);
          success = false;
        }
      }

      // Add .gitkeep files to all created directories
      for (const dir of createdDirectories) {
        const dirPath = path.join(this.projectRoot, dir);
        const gitkeepPath = path.join(dirPath, '.gitkeep');
        
        try {
          await this.createGitkeepFile(gitkeepPath);
        } catch (error) {
          const errorMessage = `Failed to create .gitkeep file in ${dir}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMessage);
          success = false;
        }
      }

      return {
        success,
        errors,
        createdDirectories,
        skippedDirectories
      };
    } catch (error) {
      return {
        success: false,
        errors: [`Directory structure creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        createdDirectories,
        skippedDirectories
      };
    }
  }

  /**
   * Creates a directory if it doesn't exist
   */
  private async createDirectoryIfNotExists(dirPath: string): Promise<void> {
    try {
      if (!fs.existsSync(dirPath)) {
        await fs.ensureDir(dirPath);
      } else if (!fs.statSync(dirPath).isDirectory()) {
        throw new Error(`Path exists but is not a directory: ${dirPath}`);
      }
    } catch (error) {
      throw new Error(`Failed to create directory ${dirPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Creates a .gitkeep file in the specified directory
   */
  private async createGitkeepFile(gitkeepPath: string): Promise<void> {
    try {
      if (!fs.existsSync(gitkeepPath)) {
        await fs.writeFile(gitkeepPath, '# This file ensures the directory is tracked by git\n');
      }
    } catch (error) {
      throw new Error(`Failed to create .gitkeep file ${gitkeepPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verifies that all required directories exist and are accessible
   */
  async verifyDirectoryStructure(): Promise<DirectoryInfo[]> {
    const requiredDirectories = [
      'src/services/codex',
      'src/contracts/codex',
      'tests/unit/services/codex',
      'tests/integration/codex',
      'templates/codex-commands'
    ];

    const directoryInfo: DirectoryInfo[] = [];

    for (const dir of requiredDirectories) {
      const dirPath = path.join(this.projectRoot, dir);
      const info: DirectoryInfo = {
        path: dirPath,
        exists: false,
        isDirectory: false,
        isWritable: false
      };

      try {
        info.exists = fs.existsSync(dirPath);
        
        if (info.exists) {
          const stats = fs.statSync(dirPath);
          info.isDirectory = stats.isDirectory();
          
          if (info.isDirectory) {
            // Test if directory is writable
            try {
              const testFile = path.join(dirPath, 'test-write.tmp');
              fs.writeFileSync(testFile, 'test');
              fs.unlinkSync(testFile);
              info.isWritable = true;
            } catch {
              info.isWritable = false;
            }
          }
        }
      } catch (error) {
        // Directory info remains with default values
      }

      directoryInfo.push(info);
    }

    return directoryInfo;
  }

  /**
   * Checks if all required directories exist
   */
  async areAllDirectoriesCreated(): Promise<boolean> {
    const directoryInfo = await this.verifyDirectoryStructure();
    return directoryInfo.every(info => info.exists && info.isDirectory);
  }

  /**
   * Gets the status of directory creation
   */
  async getDirectoryStatus(): Promise<{
    allCreated: boolean;
    missingDirectories: string[];
    inaccessibleDirectories: string[];
  }> {
    const directoryInfo = await this.verifyDirectoryStructure();
    const missingDirectories: string[] = [];
    const inaccessibleDirectories: string[] = [];

    for (const info of directoryInfo) {
      if (!info.exists) {
        missingDirectories.push(info.path);
      } else if (!info.isDirectory) {
        inaccessibleDirectories.push(info.path);
      } else if (!info.isWritable) {
        inaccessibleDirectories.push(info.path);
      }
    }

    return {
      allCreated: missingDirectories.length === 0 && inaccessibleDirectories.length === 0,
      missingDirectories,
      inaccessibleDirectories
    };
  }

  /**
   * Creates a single directory with error handling
   */
  async createDirectory(dirPath: string): Promise<boolean> {
    try {
      await this.createDirectoryIfNotExists(dirPath);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Creates a .gitkeep file in a directory
   */
  async createGitkeep(dirPath: string): Promise<boolean> {
    try {
      const gitkeepPath = path.join(dirPath, '.gitkeep');
      await this.createGitkeepFile(gitkeepPath);
      return true;
    } catch (error) {
      return false;
    }
  }
}
