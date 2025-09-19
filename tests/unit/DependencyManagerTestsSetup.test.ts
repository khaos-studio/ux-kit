/**
 * T004: Dependency Manager Tests Setup - Unit Tests
 * 
 * Unit tests for the DependencyManagerTestsSetup class that creates
 * comprehensive tests for dependency installation and management.
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
jest.mock('fs');

describe('DependencyManagerTestsSetup', () => {
  const mockProjectRoot = '/mock/project/root';
  const mockTestDir = path.join(mockProjectRoot, 'tests/install');
  const mockFixturesDir = path.join(mockProjectRoot, 'tests/fixtures/package-managers');
  const mockMocksDir = path.join(mockProjectRoot, 'tests/mocks');

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fs.existsSync to return true for directories that are expected to exist
    (fs.existsSync as jest.Mock).mockImplementation((filePath: unknown) => {
      const p = filePath as string;
      return p.startsWith(mockTestDir) || p.startsWith(mockFixturesDir) || p.startsWith(mockMocksDir);
    });
    // Mock fs.statSync for directory checks and file stats
    (fs.statSync as jest.Mock).mockReturnValue({
      isDirectory: () => true,
      isFile: () => true,
      mode: 0o644, // Default mode for files
    });
    // Mock fs.writeFileSync and fs.chmodSync
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (fs.chmodSync as jest.Mock).mockImplementation(() => {});
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('setupDependencyManagerTests', () => {
    it('should create all necessary directories', async () => {
      const DependencyManagerTestsSetup = require('../../scripts/setup-dependency-manager-tests.js');
      const setup = new DependencyManagerTestsSetup(mockProjectRoot);
      
      await setup.setupDependencyManagerTests();
      
      expect(fs.mkdirSync).toHaveBeenCalledWith(mockTestDir, { recursive: true });
      expect(fs.mkdirSync).toHaveBeenCalledWith(mockFixturesDir, { recursive: true });
      expect(fs.mkdirSync).toHaveBeenCalledWith(mockMocksDir, { recursive: true });
    });

    it('should create all test files with correct content and permissions', async () => {
      const DependencyManagerTestsSetup = require('../../scripts/setup-dependency-manager-tests.js');
      const setup = new DependencyManagerTestsSetup(mockProjectRoot);
      
      await setup.setupDependencyManagerTests();
      
      // Check that test file was created
      const testFile = path.join(mockTestDir, 'dependency-manager.test.sh');
      expect(fs.writeFileSync).toHaveBeenCalledWith(testFile, expect.any(String), 'utf8');
      expect(fs.chmodSync).toHaveBeenCalledWith(testFile, expect.any(Number));
      
      // Check that mock file was created
      const mockFile = path.join(mockMocksDir, 'package-manager.mock.sh');
      expect(fs.writeFileSync).toHaveBeenCalledWith(mockFile, expect.any(String), 'utf8');
      expect(fs.chmodSync).toHaveBeenCalledWith(mockFile, expect.any(Number));
    });

    it('should create all fixture files with correct content', async () => {
      const DependencyManagerTestsSetup = require('../../scripts/setup-dependency-manager-tests.js');
      const setup = new DependencyManagerTestsSetup(mockProjectRoot);
      
      await setup.setupDependencyManagerTests();
      
      // Check that fixture files were created
      const fixtureFiles = [
        'homebrew-macos.json',
        'apt-ubuntu.json',
        'yum-centos.json',
        'nodejs-versions.json',
        'git-versions.json'
      ];
      
      fixtureFiles.forEach(fixtureFile => {
        const fixturePath = path.join(mockFixturesDir, fixtureFile);
        expect(fs.writeFileSync).toHaveBeenCalledWith(fixturePath, expect.any(String), 'utf8');
      });
    });
  });

  describe('test file content', () => {
    it('should create dependency-manager.test.sh with expected functions', () => {
      const DependencyManagerTestsSetup = require('../../scripts/setup-dependency-manager-tests.js');
      const setup = new DependencyManagerTestsSetup(mockProjectRoot);
      
      setup.setupDependencyManagerTests();
      
      const testFile = path.join(mockTestDir, 'dependency-manager.test.sh');
      const writeFileCalls = (fs.writeFileSync as jest.Mock).mock.calls;
      const testFileCall = writeFileCalls.find(call => call[0] === testFile);
      
      expect(testFileCall).toBeDefined();
      const content = testFileCall![1];
      
      expect(content).toContain('#!/bin/bash');
      expect(content).toContain('test_homebrew_installation()');
      expect(content).toContain('test_apt_installation()');
      expect(content).toContain('test_yum_installation()');
      expect(content).toContain('test_nodejs_installation()');
      expect(content).toContain('test_git_installation()');
      expect(content).toContain('test_fallback_mechanisms()');
      expect(content).toContain('test_installation_success_scenarios()');
      expect(content).toContain('test_installation_failure_scenarios()');
      expect(content).toContain('test_version_checking()');
      expect(content).toContain('test_network_connectivity()');
      expect(content).toContain('test_permission_requirements()');
    });

    it('should create package-manager.mock.sh with expected functions', () => {
      const DependencyManagerTestsSetup = require('../../scripts/setup-dependency-manager-tests.js');
      const setup = new DependencyManagerTestsSetup(mockProjectRoot);
      
      setup.setupDependencyManagerTests();
      
      const mockFile = path.join(mockMocksDir, 'package-manager.mock.sh');
      const writeFileCalls = (fs.writeFileSync as jest.Mock).mock.calls;
      const mockFileCall = writeFileCalls.find(call => call[0] === mockFile);
      
      expect(mockFileCall).toBeDefined();
      const content = mockFileCall![1];
      
      expect(content).toContain('#!/bin/bash');
      expect(content).toContain('mock_brew()');
      expect(content).toContain('mock_apt()');
      expect(content).toContain('mock_apt_get()');
      expect(content).toContain('mock_yum()');
      expect(content).toContain('mock_dnf()');
      expect(content).toContain('mock_node()');
      expect(content).toContain('mock_git()');
      expect(content).toContain('mock_curl()');
      expect(content).toContain('mock_wget()');
      expect(content).toContain('mock_sudo()');
    });

    it('should create fixture files with correct JSON structure', () => {
      const DependencyManagerTestsSetup = require('../../scripts/setup-dependency-manager-tests.js');
      const setup = new DependencyManagerTestsSetup(mockProjectRoot);
      
      setup.setupDependencyManagerTests();
      
      const homebrewFixture = path.join(mockFixturesDir, 'homebrew-macos.json');
      const writeFileCalls = (fs.writeFileSync as jest.Mock).mock.calls;
      const homebrewCall = writeFileCalls.find(call => call[0] === homebrewFixture);
      
      expect(homebrewCall).toBeDefined();
      const content = homebrewCall![1] as string;
      const fixtureData = JSON.parse(content);
      
      expect(fixtureData).toHaveProperty('package_manager', 'homebrew');
      expect(fixtureData).toHaveProperty('platform', 'macos');
      expect(fixtureData).toHaveProperty('packages');
      expect(fixtureData).toHaveProperty('installation_methods');
      expect(fixtureData).toHaveProperty('repositories');
    });
  });

  describe('error handling', () => {
    it('should handle directory creation errors gracefully', async () => {
      const DependencyManagerTestsSetup = require('../../scripts/setup-dependency-manager-tests.js');
      const setup = new DependencyManagerTestsSetup(mockProjectRoot);
      
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {
        throw new Error('Directory creation failed');
      });
      
      await expect(setup.setupDependencyManagerTests()).rejects.toThrow('Directory creation failed');
    });

    it('should handle file writing errors gracefully', async () => {
      const DependencyManagerTestsSetup = require('../../scripts/setup-dependency-manager-tests.js');
      const setup = new DependencyManagerTestsSetup(mockProjectRoot);
      
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File writing failed');
      });
      
      await expect(setup.setupDependencyManagerTests()).rejects.toThrow('File writing failed');
    });
  });
});
