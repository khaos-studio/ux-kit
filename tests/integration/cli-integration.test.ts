/**
 * CLI Integration Tests
 * 
 * Tests the actual command-line interface from a user's perspective.
 * These tests run the CLI commands as if a user was typing them in the terminal.
 */

import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);
const access = promisify(fs.access);

describe('CLI Integration Tests', () => {
  let testProjectRoot: string;
  let cliPath: string;

  beforeAll(() => {
    // Path to the compiled CLI
    cliPath = path.join(__dirname, '../../dist/index.js');
  });

  beforeEach(async () => {
    // Setup test environment
    testProjectRoot = path.join(__dirname, '../temp/cli-integration-test');
    await mkdir(testProjectRoot, { recursive: true });
  });

  afterEach(async () => {
    // Cleanup test environment
    try {
      await rmdir(testProjectRoot, { recursive: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  /**
   * Helper function to run CLI commands
   */
  async function runCLICommand(args: string[], cwd: string = testProjectRoot): Promise<{
    exitCode: number;
    stdout: string;
    stderr: string;
  }> {
    return new Promise((resolve) => {
      const child = spawn('node', [cliPath, ...args], {
        cwd,
        stdio: 'pipe'
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        resolve({
          exitCode: code || 0,
          stdout,
          stderr
        });
      });
    });
  }

  describe('CLI Help System', () => {
    it('should show help when no arguments provided', async () => {
      const result = await runCLICommand([]);
      
      expect(result.exitCode).toBe(1); // Commander.js returns 1 when no command provided
      expect(result.stdout).toContain('UX-Kit CLI - UX Research Toolkit');
      expect(result.stdout).toContain('Commands:');
      expect(result.stdout).toContain('init');
      expect(result.stdout).toContain('create');
      expect(result.stdout).toContain('list');
    });

    it('should show help with --help flag', async () => {
      const result = await runCLICommand(['--help']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('UX-Kit CLI - UX Research Toolkit');
      expect(result.stdout).toContain('Commands:');
    });

    it('should show version with --version flag', async () => {
      const result = await runCLICommand(['--version']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('1.0.0');
    });
  });

  describe('Init Command', () => {
    it('should initialize UX-Kit project successfully', async () => {
      const result = await runCLICommand(['init']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('UX-Kit initialized successfully');
      
      // Verify directory structure was created
      const uxkitDir = path.join(testProjectRoot, '.uxkit');
      await expect(access(uxkitDir)).resolves.not.toThrow();
      
      const studiesDir = path.join(uxkitDir, 'studies');
      await expect(access(studiesDir)).resolves.not.toThrow();
      
      const templatesDir = path.join(uxkitDir, 'templates');
      await expect(access(templatesDir)).resolves.not.toThrow();
      
      const memoryDir = path.join(uxkitDir, 'memory');
      await expect(access(memoryDir)).resolves.not.toThrow();
    });

    it('should initialize with custom AI agent', async () => {
      const result = await runCLICommand(['init', '--aiAgent', 'codex']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('UX-Kit initialized successfully');
      
      // Verify config file was created with correct AI agent
      const configPath = path.join(testProjectRoot, '.uxkit', 'config.yaml');
      const configContent = await readFile(configPath, 'utf8');
      expect(configContent).toContain('provider: codex');
    });

    it('should handle already initialized project', async () => {
      // Initialize first time
      await runCLICommand(['init']);
      
      // Try to initialize again
      const result = await runCLICommand(['init']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('UX-Kit already initialized');
    });
  });

  describe('Study Management Commands', () => {
    beforeEach(async () => {
      // Initialize UX-Kit before each test
      await runCLICommand(['init']);
    });

    it('should create a new study', async () => {
      const result = await runCLICommand(['create', 'Test Study']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Study created successfully');
      expect(result.stdout).toContain('Test Study');
      
      // Verify study directory was created
      const studiesDir = path.join(testProjectRoot, '.uxkit', 'studies');
      const studyDirs = await fs.promises.readdir(studiesDir);
      expect(studyDirs.length).toBe(1);
      expect(studyDirs[0]).toMatch(/^\d{3}-test-study$/);
    });

    it('should create study with description', async () => {
      const result = await runCLICommand(['create', 'Test Study', '--description', 'A test study for CLI integration']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Study created successfully');
      
      // Verify study info file contains description
      const studiesDir = path.join(testProjectRoot, '.uxkit', 'studies');
      const studyDirs = await fs.promises.readdir(studiesDir);
      expect(studyDirs.length).toBeGreaterThan(0);
      const studyDir = studyDirs[0];
      expect(studyDir).toBeDefined();
      const studyPath = path.join(studiesDir, studyDir!);
      const studyInfoPath = path.join(studyPath, 'study-info.json');
      
      const studyInfo = JSON.parse(await readFile(studyInfoPath, 'utf8'));
      expect(studyInfo.description).toBe('A test study for CLI integration');
    });

    it('should list studies', async () => {
      // Create a study first
      await runCLICommand(['create', 'Test Study']);
      
      const result = await runCLICommand(['list']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Research Studies:');
      expect(result.stdout).toContain('Test Study');
    });

    it('should show study details', async () => {
      // Create a study first
      const createResult = await runCLICommand(['create', 'Test Study']);
      const studyId = createResult.stdout.match(/ID: (\d{3}-[a-z-]+)/)?.[1];
      expect(studyId).toBeDefined();
      
      const result = await runCLICommand(['show', studyId!]);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Study Details:');
      expect(result.stdout).toContain('Test Study');
      expect(result.stdout).toContain(studyId!);
    });

    it('should delete a study', async () => {
      // Create a study first
      const createResult = await runCLICommand(['create', 'Test Study']);
      const studyId = createResult.stdout.match(/ID: (\d{3}-[a-z-]+)/)?.[1];
      expect(studyId).toBeDefined();
      
      // Delete the study
      const result = await runCLICommand(['delete', studyId!]);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Study deleted successfully');
      
      // Verify study directory was removed
      const studiesDir = path.join(testProjectRoot, '.uxkit', 'studies');
      const studyDirs = await fs.promises.readdir(studiesDir);
      expect(studyDirs.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid commands gracefully', async () => {
      const result = await runCLICommand(['invalid-command']);
      
      expect(result.exitCode).toBe(1);
      expect(result.stdout).toContain('UX-Kit CLI - UX Research Toolkit');
    });

    it('should handle missing study ID for show command', async () => {
      await runCLICommand(['init']);
      
      const result = await runCLICommand(['show']);
      
      expect(result.exitCode).toBe(1);
      expect(result.stdout).toContain('UX-Kit CLI - UX Research Toolkit');
    });

    it('should handle missing study ID for delete command', async () => {
      await runCLICommand(['init']);
      
      const result = await runCLICommand(['delete']);
      
      expect(result.exitCode).toBe(1);
      expect(result.stdout).toContain('UX-Kit CLI - UX Research Toolkit');
    });

    it('should handle non-existent study ID', async () => {
      await runCLICommand(['init']);
      
      const result = await runCLICommand(['show', '999-nonexistent']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Study not found');
    });
  });

  describe('Complete Workflow', () => {
    it('should support complete study lifecycle', async () => {
      // 1. Initialize UX-Kit
      const initResult = await runCLICommand(['init']);
      expect(initResult.exitCode).toBe(0);
      
      // 2. Create a study
      const createResult = await runCLICommand(['create', 'E-commerce Checkout Optimization', '--description', 'Research study for optimizing checkout flow']);
      expect(createResult.exitCode).toBe(0);
      
      const studyId = createResult.stdout.match(/ID: (\d{3}-[a-z-]+)/)?.[1];
      expect(studyId).toBeDefined();
      
      // 3. List studies
      const listResult = await runCLICommand(['list']);
      expect(listResult.exitCode).toBe(0);
      expect(listResult.stdout).toContain('E-commerce Checkout Optimization');
      
      // 4. Show study details
      const showResult = await runCLICommand(['show', studyId!]);
      expect(showResult.exitCode).toBe(0);
      expect(showResult.stdout).toContain('E-commerce Checkout Optimization');
      
      // 5. Delete the study
      const deleteResult = await runCLICommand(['delete', studyId!]);
      expect(deleteResult.exitCode).toBe(0);
      expect(deleteResult.stdout).toContain('Study deleted successfully');
      
      // 6. Verify study is gone
      const finalListResult = await runCLICommand(['list']);
      expect(finalListResult.exitCode).toBe(0);
      expect(finalListResult.stdout).not.toContain('E-commerce Checkout Optimization');
    });
  });

  describe('File System Integration', () => {
    it('should work with different working directories', async () => {
      // Create a subdirectory
      const subDir = path.join(testProjectRoot, 'subdir');
      await mkdir(subDir);
      
      // Initialize in subdirectory
      const result = await runCLICommand(['init'], subDir);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('UX-Kit initialized successfully');
      
      // Verify .uxkit was created in subdirectory
      const uxkitDir = path.join(subDir, '.uxkit');
      await expect(access(uxkitDir)).resolves.not.toThrow();
    });

    it('should handle file system permissions gracefully', async () => {
      // This test would need to be run with appropriate permissions
      // For now, just test that the CLI doesn't crash on file operations
      const result = await runCLICommand(['init']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('UX-Kit initialized successfully');
    });
  });
});
