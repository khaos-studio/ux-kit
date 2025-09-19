/**
 * Unit tests for ProjectStructureSetup class
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import { ProjectStructureSetup } from '../../src/scripts/ProjectStructureSetup';

// Mock fs module
jest.mock('fs');

describe('ProjectStructureSetup', () => {
  let setup: ProjectStructureSetup;
  const mockProjectRoot = '/mock/project/root';

  beforeEach(() => {
    setup = new ProjectStructureSetup(mockProjectRoot);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with provided project root', () => {
      const customRoot = '/custom/root';
      const customSetup = new ProjectStructureSetup(customRoot);
      expect(customSetup).toBeInstanceOf(ProjectStructureSetup);
    });

    it('should initialize with current working directory if no root provided', () => {
      const defaultSetup = new ProjectStructureSetup();
      expect(defaultSetup).toBeInstanceOf(ProjectStructureSetup);
    });
  });

  describe('setupProjectStructure', () => {
    it('should call all setup methods in correct order', async () => {
      const createMainDirectoriesSpy = jest.spyOn(setup as any, 'createMainDirectories').mockResolvedValue(undefined);
      const createModuleFilesSpy = jest.spyOn(setup as any, 'createModuleFiles').mockResolvedValue(undefined);
      const createUtilityFilesSpy = jest.spyOn(setup as any, 'createUtilityFiles').mockResolvedValue(undefined);
      const createInstallScriptsSpy = jest.spyOn(setup as any, 'createInstallScripts').mockResolvedValue(undefined);

      await setup.setupProjectStructure();

      expect(createMainDirectoriesSpy).toHaveBeenCalledTimes(1);
      expect(createModuleFilesSpy).toHaveBeenCalledTimes(1);
      expect(createUtilityFilesSpy).toHaveBeenCalledTimes(1);
      expect(createInstallScriptsSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Setup failed');
      jest.spyOn(setup as any, 'createMainDirectories').mockRejectedValue(error);

      await expect(setup.setupProjectStructure()).rejects.toThrow('Setup failed');
    });
  });

  describe('createMainDirectories', () => {
    it('should create all required directories', async () => {
      const ensureDirectoryExistsSpy = jest.spyOn(setup as any, 'ensureDirectoryExists').mockResolvedValue(undefined);

      await (setup as any).createMainDirectories();

      expect(ensureDirectoryExistsSpy).toHaveBeenCalledTimes(6);
      expect(ensureDirectoryExistsSpy).toHaveBeenCalledWith(path.join(mockProjectRoot, 'scripts/install'));
      expect(ensureDirectoryExistsSpy).toHaveBeenCalledWith(path.join(mockProjectRoot, 'scripts/modules'));
      expect(ensureDirectoryExistsSpy).toHaveBeenCalledWith(path.join(mockProjectRoot, 'scripts/modules/package-managers'));
      expect(ensureDirectoryExistsSpy).toHaveBeenCalledWith(path.join(mockProjectRoot, 'scripts/utils'));
      expect(ensureDirectoryExistsSpy).toHaveBeenCalledWith(path.join(mockProjectRoot, 'tests/install'));
      expect(ensureDirectoryExistsSpy).toHaveBeenCalledWith(path.join(mockProjectRoot, 'docs/install'));
    });
  });

  describe('createModuleFiles', () => {
    it('should create all core module files', async () => {
      const createShellScriptSpy = jest.spyOn(setup as any, 'createShellScript').mockResolvedValue(undefined);

      await (setup as any).createModuleFiles();

      const expectedModules = [
        'system-detector.sh',
        'dependency-manager.sh',
        'github-manager.sh',
        'binary-manager.sh',
        'config-manager.sh',
        'security-manager.sh',
        'progress-tracker.sh'
      ];

      expectedModules.forEach(module => {
        expect(createShellScriptSpy).toHaveBeenCalledWith(
          path.join(mockProjectRoot, 'scripts/modules', module),
          expect.any(String)
        );
      });
    });

    it('should create package manager files', async () => {
      const createShellScriptSpy = jest.spyOn(setup as any, 'createShellScript').mockResolvedValue(undefined);

      await (setup as any).createModuleFiles();

      const expectedPackageManagers = ['homebrew.sh', 'apt.sh', 'yum.sh'];

      expectedPackageManagers.forEach(pm => {
        expect(createShellScriptSpy).toHaveBeenCalledWith(
          path.join(mockProjectRoot, 'scripts/modules/package-managers', pm),
          expect.any(String)
        );
      });
    });
  });

  describe('createUtilityFiles', () => {
    it('should create all utility files', async () => {
      const createShellScriptSpy = jest.spyOn(setup as any, 'createShellScript').mockResolvedValue(undefined);

      await (setup as any).createUtilityFiles();

      const expectedUtils = [
        'common.sh',
        'logger.sh',
        'error-handler.sh',
        'colors.sh',
        'filesystem.sh',
        'system-info.sh',
        'github-api.sh',
        'binary-utils.sh',
        'config-utils.sh',
        'security-utils.sh',
        'progress-utils.sh'
      ];

      expectedUtils.forEach(util => {
        expect(createShellScriptSpy).toHaveBeenCalledWith(
          path.join(mockProjectRoot, 'scripts/utils', util),
          expect.any(String)
        );
      });
    });
  });

  describe('createInstallScripts', () => {
    it('should create all install scripts', async () => {
      const createShellScriptSpy = jest.spyOn(setup as any, 'createShellScript').mockResolvedValue(undefined);

      await (setup as any).createInstallScripts();

      const expectedScripts = [
        'install.sh',
        'install-options.sh',
        'uninstall.sh',
        'update.sh'
      ];

      expectedScripts.forEach(script => {
        expect(createShellScriptSpy).toHaveBeenCalledWith(
          path.join(mockProjectRoot, 'scripts/install', script),
          expect.any(String)
        );
      });
    });
  });

  describe('ensureDirectoryExists', () => {
    it('should create directory if it does not exist', async () => {
      const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
      const mockMkdirSync = fs.mkdirSync as jest.MockedFunction<typeof fs.mkdirSync>;

      mockExistsSync.mockReturnValue(false);

      await (setup as any).ensureDirectoryExists('/test/directory');

      expect(mockExistsSync).toHaveBeenCalledWith('/test/directory');
      expect(mockMkdirSync).toHaveBeenCalledWith('/test/directory', { recursive: true });
    });

    it('should not create directory if it already exists', async () => {
      const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
      const mockMkdirSync = fs.mkdirSync as jest.MockedFunction<typeof fs.mkdirSync>;

      mockExistsSync.mockReturnValue(true);

      await (setup as any).ensureDirectoryExists('/test/directory');

      expect(mockExistsSync).toHaveBeenCalledWith('/test/directory');
      expect(mockMkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('createShellScript', () => {
    it('should create file with content and set executable permissions', async () => {
      const mockWriteFileSync = fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>;
      const mockStatSync = fs.statSync as jest.MockedFunction<typeof fs.statSync>;
      const mockChmodSync = fs.chmodSync as jest.MockedFunction<typeof fs.chmodSync>;

      const mockStats = { mode: 0o644 };
      mockStatSync.mockReturnValue(mockStats as any);

      await (setup as any).createShellScript('/test/script.sh', 'test content');

      expect(mockWriteFileSync).toHaveBeenCalledWith('/test/script.sh', 'test content', 'utf8');
      expect(mockStatSync).toHaveBeenCalledWith('/test/script.sh');
      expect(mockChmodSync).toHaveBeenCalledWith('/test/script.sh', 0o755);
    });
  });

  describe('template generation', () => {
    it('should generate correct module template', () => {
      const template = (setup as any).getModuleTemplate('test-module.sh');
      
      expect(template).toContain('#!/bin/bash');
      expect(template).toContain('# test-module.sh');
      expect(template).toContain('set -euo pipefail');
      expect(template).toContain('echo "Module test-module.sh loaded successfully"');
    });

    it('should generate correct package manager template', () => {
      const template = (setup as any).getPackageManagerTemplate('homebrew.sh');
      
      expect(template).toContain('#!/bin/bash');
      expect(template).toContain('# homebrew.sh - Package Manager Module');
      expect(template).toContain('set -euo pipefail');
      expect(template).toContain('echo "Package manager homebrew.sh module loaded successfully"');
    });

    it('should generate correct utility template', () => {
      const template = (setup as any).getUtilityTemplate('common.sh');
      
      expect(template).toContain('#!/bin/bash');
      expect(template).toContain('# common.sh - Utility Functions');
      expect(template).toContain('set -euo pipefail');
      expect(template).toContain('echo "Utility common.sh loaded successfully"');
    });

    it('should generate correct install script template', () => {
      const template = (setup as any).getInstallScriptTemplate('install.sh');
      
      expect(template).toContain('#!/bin/bash');
      expect(template).toContain('# UX-Kit Remote Installation Script');
      expect(template).toContain('set -euo pipefail');
      expect(template).toContain('echo "UX-Kit installation script loaded successfully"');
    });

    it('should generate correct non-install script template', () => {
      const template = (setup as any).getInstallScriptTemplate('uninstall.sh');
      
      expect(template).toContain('#!/bin/bash');
      expect(template).toContain('# uninstall.sh - UX-Kit uninstall Script');
      expect(template).toContain('set -euo pipefail');
      expect(template).toContain('echo "uninstall.sh script loaded successfully"');
    });
  });
});
