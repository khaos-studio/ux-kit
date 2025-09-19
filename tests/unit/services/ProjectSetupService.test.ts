/**
 * Unit tests for ProjectSetupService
 */

import { execSync } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ProjectSetupService, ProjectSetupResult, DependencyInfo } from '../../../src/services/ProjectSetupService';

// Mock dependencies
jest.mock('child_process');
jest.mock('fs-extra');

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('ProjectSetupService', () => {
  let service: ProjectSetupService;
  const mockProjectRoot = '/mock/project/root';

  beforeEach(() => {
    service = new ProjectSetupService(mockProjectRoot);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should use provided project root', () => {
      const customRoot = '/custom/root';
      const customService = new ProjectSetupService(customRoot);
      expect(customService).toBeInstanceOf(ProjectSetupService);
    });

    it('should use current working directory as default', () => {
      const defaultService = new ProjectSetupService();
      expect(defaultService).toBeInstanceOf(ProjectSetupService);
    });
  });

  describe('verifyProjectSetup', () => {
    beforeEach(() => {
      // Mock successful Node.js version check
      mockExecSync.mockImplementation((command: string) => {
        if (command === 'node --version') {
          return 'v20.19.0';
        }
        if (command === 'npx tsc --version') {
          return 'Version 5.3.3';
        }
        throw new Error('Unknown command');
      });

      // Mock file system operations
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true, isFile: () => true } as any);
      mockFs.readJsonSync.mockReturnValue({
        engines: { node: '>=18.0.0' },
        devDependencies: { typescript: '^5.0.0' },
        compilerOptions: {
          strict: true,
          noImplicitAny: true,
          strictNullChecks: true,
          strictFunctionTypes: true,
          noImplicitReturns: true,
          noFallthroughCasesInSwitch: true,
          noUncheckedIndexedAccess: true,
          exactOptionalPropertyTypes: true
        }
      });

      // Mock Jest config file existence
      mockFs.existsSync.mockImplementation((filePath: any) => {
        if (filePath === path.join(mockProjectRoot, 'jest.config.js')) {
          return true;
        }
        if (filePath === path.join(mockProjectRoot, 'tests/setup.ts')) {
          return true;
        }
        return true;
      });
    });

    it('should return success when all requirements are met', async () => {
      const result = await service.verifyProjectSetup();

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.details.nodeVersion).toBe('v20.19.0');
      expect(result.details.typescriptVersion).toBe('5.3.3');
      expect(result.details.dependenciesInstalled).toBe(true);
      expect(result.details.strictModeEnabled).toBe(true);
      expect(result.details.testFrameworkConfigured).toBe(true);
    });

    it('should return error when Node.js version is too low', async () => {
      mockExecSync.mockImplementation((command: string) => {
        if (command === 'node --version') {
          return 'v16.0.0';
        }
        if (command === 'npx tsc --version') {
          return 'Version 5.3.3';
        }
        throw new Error('Unknown command');
      });

      const result = await service.verifyProjectSetup();

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Node.js version v16.0.0 is below minimum requirement (18.0.0)');
    });

    it('should return error when TypeScript version is too low', async () => {
      mockExecSync.mockImplementation((command: string) => {
        if (command === 'node --version') {
          return 'v20.19.0';
        }
        if (command === 'npx tsc --version') {
          return 'Version 4.9.5';
        }
        throw new Error('Unknown command');
      });

      const result = await service.verifyProjectSetup();

      expect(result.success).toBe(false);
      expect(result.errors).toContain('TypeScript version 4.9.5 is below minimum requirement (5.0.0)');
    });

    it('should return error when project structure is invalid', async () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = await service.verifyProjectSetup();

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Required project directories or files are missing');
    });

    it('should return error when dependencies are not installed', async () => {
      mockFs.existsSync.mockImplementation((filePath: any) => {
        if (filePath.includes('node_modules')) {
          return false;
        }
        return true;
      });

      const result = await service.verifyProjectSetup();

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Required dependencies are not installed');
    });

    it('should return warning when TypeScript strict mode is not fully enabled', async () => {
      mockFs.readJsonSync.mockReturnValue({
        engines: { node: '>=18.0.0' },
        devDependencies: { typescript: '^5.0.0' },
        compilerOptions: {
          strict: false,
          noImplicitAny: true,
          strictNullChecks: true,
          strictFunctionTypes: true,
          noImplicitReturns: true,
          noFallthroughCasesInSwitch: true,
          noUncheckedIndexedAccess: true,
          exactOptionalPropertyTypes: true
        }
      });

      const result = await service.verifyProjectSetup();

      expect(result.success).toBe(true);
      expect(result.warnings).toContain('TypeScript strict mode is not fully enabled');
      expect(result.details.strictModeEnabled).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('Command failed');
      });

      const result = await service.verifyProjectSetup();

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Setup verification failed: Failed to get Node.js version');
    });
  });

  describe('installDependencies', () => {
    it('should return true when npm install succeeds', async () => {
      mockExecSync.mockImplementation(() => 'Success');

      const result = await service.installDependencies();

      expect(result).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith('npm install', {
        cwd: mockProjectRoot,
        stdio: 'pipe',
        timeout: 60000
      });
    });

    it('should return false when npm install fails', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('npm install failed');
      });

      const result = await service.installDependencies();

      expect(result).toBe(false);
    });
  });

  describe('getDependencyInfo', () => {
    it('should return dependency information', () => {
      mockFs.readJsonSync.mockReturnValue({
        dependencies: {
          'chalk': '^5.3.0',
          'commander': '^11.0.0'
        },
        devDependencies: {
          'typescript': '^5.0.0',
          'jest': '^29.0.0'
        }
      });

      mockFs.existsSync.mockImplementation((filePath: any) => {
        return filePath.includes('node_modules');
      });

      const result = service.getDependencyInfo();

      expect(result).toHaveLength(4);
      expect(result.find(dep => dep.name === 'chalk')).toEqual({
        name: 'chalk',
        version: '^5.3.0',
        required: true,
        installed: true
      });
    });

    it('should return empty array when package.json cannot be read', () => {
      mockFs.readJsonSync.mockImplementation(() => {
        throw new Error('Cannot read package.json');
      });

      const result = service.getDependencyInfo();

      expect(result).toEqual([]);
    });
  });

  describe('private methods', () => {
    describe('isNodeVersionValid', () => {
      it('should validate Node.js version correctly', () => {
        // Access private method through any type
        const serviceAny = service as any;
        
        expect(serviceAny.isNodeVersionValid('v18.0.0')).toBe(true);
        expect(serviceAny.isNodeVersionValid('v20.19.0')).toBe(true);
        expect(serviceAny.isNodeVersionValid('v16.0.0')).toBe(false);
        expect(serviceAny.isNodeVersionValid('v17.9.0')).toBe(false);
      });
    });

    describe('isTypeScriptVersionValid', () => {
      it('should validate TypeScript version correctly', () => {
        // Access private method through any type
        const serviceAny = service as any;
        
        expect(serviceAny.isTypeScriptVersionValid('5.0.0')).toBe(true);
        expect(serviceAny.isTypeScriptVersionValid('5.3.3')).toBe(true);
        expect(serviceAny.isTypeScriptVersionValid('4.9.5')).toBe(false);
        expect(serviceAny.isTypeScriptVersionValid('unknown')).toBe(false);
      });
    });
  });
});
