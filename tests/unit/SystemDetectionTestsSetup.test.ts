/**
 * Unit tests for SystemDetectionTestsSetup class
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Mock fs module
jest.mock('fs');

describe('SystemDetectionTestsSetup', () => {
  const mockProjectRoot = '/mock/project/root';
  const mockTestDir = path.join(mockProjectRoot, 'tests/install');
  const mockFixturesDir = path.join(mockProjectRoot, 'tests/fixtures/system-info');
  const mockMocksDir = path.join(mockProjectRoot, 'tests/mocks');

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fs.existsSync to return false for directories that don't exist
    (fs.existsSync as jest.Mock).mockImplementation((filePath: unknown) => {
      return false;
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

  describe('setupSystemDetectionTests', () => {
    it('should create all necessary directories', async () => {
      // Mock fs.existsSync to return false for directories
      (fs.existsSync as jest.Mock).mockImplementation((filePath: unknown) => {
        return false;
      });

      // Mock fs.mkdirSync
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.writeFileSync
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.chmodSync
      (fs.chmodSync as jest.Mock).mockImplementation(() => {});

      // Run the actual setup using the Node.js script
      execSync('node scripts/setup-system-detection-tests.js', { 
        cwd: '/Users/k/Projects/ux-kit',
        stdio: 'pipe'
      });

      // Verify that mkdirSync was called for each directory
      expect(fs.mkdirSync).toHaveBeenCalledWith(mockTestDir, { recursive: true });
      expect(fs.mkdirSync).toHaveBeenCalledWith(mockFixturesDir, { recursive: true });
      expect(fs.mkdirSync).toHaveBeenCalledWith(mockMocksDir, { recursive: true });
    });

    it('should create all test files with correct content and permissions', async () => {
      // Mock fs.existsSync to return false for directories
      (fs.existsSync as jest.Mock).mockImplementation((filePath: unknown) => {
        return false;
      });

      // Mock fs.mkdirSync
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.writeFileSync
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.chmodSync
      (fs.chmodSync as jest.Mock).mockImplementation(() => {});

      // Run the actual setup using the Node.js script
      execSync('node scripts/setup-system-detection-tests.js', { 
        cwd: '/Users/k/Projects/ux-kit',
        stdio: 'pipe'
      });

      // Verify that writeFileSync was called for each test file
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(mockTestDir, 'system-detector.test.sh'),
        expect.any(String),
        'utf8'
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(mockMocksDir, 'system-detector.mock.sh'),
        expect.any(String),
        'utf8'
      );

      // Verify that chmodSync was called for each shell script
      expect(fs.chmodSync).toHaveBeenCalledTimes(2);
    });

    it('should create all fixture files with correct content', async () => {
      // Mock fs.existsSync to return false for directories
      (fs.existsSync as jest.Mock).mockImplementation((filePath: unknown) => {
        return false;
      });

      // Mock fs.mkdirSync
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.writeFileSync
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.chmodSync
      (fs.chmodSync as jest.Mock).mockImplementation(() => {});

      // Run the actual setup using the Node.js script
      execSync('node scripts/setup-system-detection-tests.js', { 
        cwd: '/Users/k/Projects/ux-kit',
        stdio: 'pipe'
      });

      // Verify that writeFileSync was called for each fixture file
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(mockFixturesDir, 'macos-x86_64.json'),
        expect.any(String),
        'utf8'
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(mockFixturesDir, 'macos-arm64.json'),
        expect.any(String),
        'utf8'
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(mockFixturesDir, 'ubuntu-x86_64.json'),
        expect.any(String),
        'utf8'
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(mockFixturesDir, 'centos-x86_64.json'),
        expect.any(String),
        'utf8'
      );
    });
  });

  describe('test file content', () => {
    it('should create system-detector.test.sh with expected functions', () => {
      // Run the actual setup using the Node.js script
      execSync('node scripts/setup-system-detection-tests.js', { 
        cwd: '/Users/k/Projects/ux-kit',
        stdio: 'pipe'
      });

      // Get the content written to system-detector.test.sh
      const testShCall = (fs.writeFileSync as jest.Mock).mock.calls.find(
        (call: unknown[]) => (call[0] as string).endsWith('system-detector.test.sh')
      );
      expect(testShCall).toBeDefined();
      
      const content = testShCall![1] as string;
      expect(content).toContain('#!/bin/bash');
      expect(content).toContain('test_os_detection()');
      expect(content).toContain('test_architecture_detection()');
      expect(content).toContain('test_package_manager_detection()');
      expect(content).toContain('test_dependency_checking()');
      expect(content).toContain('test_error_handling()');
      expect(content).toContain('test_edge_cases()');
      expect(content).toContain('test_cross_platform_compatibility()');
      expect(content).toContain('test_performance()');
      expect(content).toContain('test_reliability()');
      expect(content).toContain('run_tests()');
    });

    it('should create system-detector.mock.sh with expected functions', () => {
      // Run the actual setup using the Node.js script
      execSync('node scripts/setup-system-detection-tests.js', { 
        cwd: '/Users/k/Projects/ux-kit',
        stdio: 'pipe'
      });

      // Get the content written to system-detector.mock.sh
      const mockShCall = (fs.writeFileSync as jest.Mock).mock.calls.find(
        (call: unknown[]) => (call[0] as string).endsWith('system-detector.mock.sh')
      );
      expect(mockShCall).toBeDefined();
      
      const content = mockShCall![1] as string;
      expect(content).toContain('#!/bin/bash');
      expect(content).toContain('mock_uname()');
      expect(content).toContain('mock_which()');
      expect(content).toContain('mock_brew()');
      expect(content).toContain('mock_apt()');
      expect(content).toContain('mock_yum()');
      expect(content).toContain('mock_node()');
      expect(content).toContain('mock_git()');
      expect(content).toContain('mock_ssh()');
    });

    it('should create fixture files with correct JSON structure', () => {
      // Run the actual setup using the Node.js script
      execSync('node scripts/setup-system-detection-tests.js', { 
        cwd: '/Users/k/Projects/ux-kit',
        stdio: 'pipe'
      });

      // Get the content written to macos-x86_64.json
      const macosFixtureCall = (fs.writeFileSync as jest.Mock).mock.calls.find(
        (call: unknown[]) => (call[0] as string).endsWith('macos-x86_64.json')
      );
      expect(macosFixtureCall).toBeDefined();
      
      const content = macosFixtureCall![1] as string;
      const fixture = JSON.parse(content);
      expect(fixture).toHaveProperty('os');
      expect(fixture).toHaveProperty('architecture');
      expect(fixture).toHaveProperty('package_manager');
      expect(fixture).toHaveProperty('dependencies');
      expect(fixture).toHaveProperty('system_info');
      expect(fixture.os).toBe('macos');
      expect(fixture.architecture).toBe('x86_64');
      expect(fixture.package_manager).toBe('homebrew');
    });
  });

  describe('error handling', () => {
    it('should handle directory creation errors gracefully', async () => {
      // Mock fs.mkdirSync to throw an error
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {
        throw new Error('Permission denied');
      });

      // Run the actual setup using the Node.js script
      expect(() => {
        execSync('node scripts/setup-system-detection-tests.js', { 
          cwd: '/Users/k/Projects/ux-kit',
          stdio: 'pipe'
        });
      }).toThrow();
    });

    it('should handle file writing errors gracefully', async () => {
      // Mock fs.writeFileSync to throw an error
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Disk full');
      });

      // Run the actual setup using the Node.js script
      expect(() => {
        execSync('node scripts/setup-system-detection-tests.js', { 
          cwd: '/Users/k/Projects/ux-kit',
          stdio: 'pipe'
        });
      }).toThrow();
    });
  });
});
