/**
 * T003: System Detection Tests - Use Case Tests
 * 
 * These tests define the expected behavior for system detection functionality
 * including OS detection, architecture detection, package manager detection,
 * and dependency checking.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

describe('T003: System Detection Tests', () => {
  const projectRoot = '/Users/k/Projects/ux-kit';
  const testDir = path.join(projectRoot, 'tests/install');
  const fixturesDir = path.join(projectRoot, 'tests/fixtures/system-info');
  const mocksDir = path.join(projectRoot, 'tests/mocks');

  beforeEach(() => {
    // Clean up before each test
    execSync(`rm -rf ${testDir} ${fixturesDir} ${mocksDir}`, { stdio: 'pipe' });
  });

  afterEach(() => {
    // Clean up after each test
    execSync(`rm -rf ${testDir} ${fixturesDir} ${mocksDir}`, { stdio: 'pipe' });
  });

  describe('Given a user wants to test system detection functionality', () => {
    describe('When they run the system detection tests', () => {
      beforeEach(async () => {
        // Run the actual setup using the Node.js script
        execSync('node scripts/setup-system-detection-tests.js', { 
          cwd: projectRoot,
          stdio: 'pipe'
        });
      });

      it('Then it should create system-detector.test.sh with comprehensive test coverage', () => {
        const testFile = path.join(testDir, 'system-detector.test.sh');
        
        expect(fs.existsSync(testFile)).toBe(true);
        expect(fs.statSync(testFile).isFile()).toBe(true);
        
        const content = fs.readFileSync(testFile, 'utf8');
        expect(content).toContain('#!/bin/bash');
        expect(content).toContain('test_os_detection()');
        expect(content).toContain('test_architecture_detection()');
        expect(content).toContain('test_package_manager_detection()');
        expect(content).toContain('test_dependency_checking()');
        expect(content).toContain('test_error_handling()');
        expect(content).toContain('test_cross_platform_compatibility()');
      });

      it('Then it should create test fixtures for different system configurations', () => {
        const macosFixture = path.join(fixturesDir, 'macos-x86_64.json');
        const macosArmFixture = path.join(fixturesDir, 'macos-arm64.json');
        const ubuntuFixture = path.join(fixturesDir, 'ubuntu-x86_64.json');
        const centosFixture = path.join(fixturesDir, 'centos-x86_64.json');
        
        expect(fs.existsSync(macosFixture)).toBe(true);
        expect(fs.existsSync(macosArmFixture)).toBe(true);
        expect(fs.existsSync(ubuntuFixture)).toBe(true);
        expect(fs.existsSync(centosFixture)).toBe(true);
        
        // Verify fixture content structure
        const macosContent = JSON.parse(fs.readFileSync(macosFixture, 'utf8'));
        expect(macosContent).toHaveProperty('os');
        expect(macosContent).toHaveProperty('architecture');
        expect(macosContent).toHaveProperty('package_manager');
        expect(macosContent).toHaveProperty('dependencies');
        expect(macosContent.os).toBe('macos');
        expect(macosContent.architecture).toBe('x86_64');
      });

      it('Then it should create mock system commands for consistent testing', () => {
        const mockFile = path.join(mocksDir, 'system-detector.mock.sh');
        
        expect(fs.existsSync(mockFile)).toBe(true);
        expect(fs.statSync(mockFile).isFile()).toBe(true);
        
        const content = fs.readFileSync(mockFile, 'utf8');
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

      it('Then it should test OS detection on macOS and Linux', () => {
        const testFile = path.join(testDir, 'system-detector.test.sh');
        const content = fs.readFileSync(testFile, 'utf8');
        
        expect(content).toContain('test_os_detection()');
        expect(content).toContain('macOS');
        expect(content).toContain('Linux');
        expect(content).toContain('Ubuntu');
        expect(content).toContain('CentOS');
        expect(content).toContain('RHEL');
        expect(content).toContain('Debian');
      });

      it('Then it should test architecture detection (x86_64, ARM64)', () => {
        const testFile = path.join(testDir, 'system-detector.test.sh');
        const content = fs.readFileSync(testFile, 'utf8');
        
        expect(content).toContain('test_architecture_detection()');
        expect(content).toContain('x86_64');
        expect(content).toContain('arm64');
        expect(content).toContain('aarch64');
        expect(content).toContain('i386');
        expect(content).toContain('i686');
      });

      it('Then it should test package manager detection', () => {
        const testFile = path.join(testDir, 'system-detector.test.sh');
        const content = fs.readFileSync(testFile, 'utf8');
        
        expect(content).toContain('test_package_manager_detection()');
        expect(content).toContain('Homebrew');
        expect(content).toContain('APT');
        expect(content).toContain('YUM');
        expect(content).toContain('DNF');
        expect(content).toContain('pacman');
        expect(content).toContain('zypper');
      });

      it('Then it should test dependency checking (Node.js, Git, SSH)', () => {
        const testFile = path.join(testDir, 'system-detector.test.sh');
        const content = fs.readFileSync(testFile, 'utf8');
        
        expect(content).toContain('test_dependency_checking()');
        expect(content).toContain('Node.js');
        expect(content).toContain('Git');
        expect(content).toContain('SSH');
        expect(content).toContain('version');
        expect(content).toContain('command -v');
      });

      it('Then it should test error handling for unsupported systems', () => {
        const testFile = path.join(testDir, 'system-detector.test.sh');
        const content = fs.readFileSync(testFile, 'utf8');
        
        expect(content).toContain('test_error_handling()');
        expect(content).toContain('unsupported');
        expect(content).toContain('error');
        expect(content).toContain('exit');
        expect(content).toContain('message');
      });

      it('Then it should test edge cases and error conditions', () => {
        const testFile = path.join(testDir, 'system-detector.test.sh');
        const content = fs.readFileSync(testFile, 'utf8');
        
        expect(content).toContain('test_edge_cases()');
        expect(content).toContain('missing');
        expect(content).toContain('invalid');
        expect(content).toContain('corrupted');
        expect(content).toContain('permission');
        expect(content).toContain('network');
      });

      it('Then it should test cross-platform compatibility', () => {
        const testFile = path.join(testDir, 'system-detector.test.sh');
        const content = fs.readFileSync(testFile, 'utf8');
        
        expect(content).toContain('test_cross_platform_compatibility()');
        expect(content).toContain('platform');
        expect(content).toContain('compatibility');
        expect(content).toContain('different');
        expect(content).toContain('systems');
      });

      it('Then it should test performance and reliability', () => {
        const testFile = path.join(testDir, 'system-detector.test.sh');
        const content = fs.readFileSync(testFile, 'utf8');
        
        expect(content).toContain('test_performance()');
        expect(content).toContain('test_reliability()');
        expect(content).toContain('retry');
        expect(content).toContain('benchmark');
      });
    });

    describe('When they run the system detection tests', () => {
      beforeEach(async () => {
        // Run the actual setup using the Node.js script
        execSync('node scripts/setup-system-detection-tests.js', { 
          cwd: projectRoot,
          stdio: 'pipe'
        });
      });

      it('Then the tests should be executable and runnable', () => {
        const testFile = path.join(testDir, 'system-detector.test.sh');
        const mockFile = path.join(mocksDir, 'system-detector.mock.sh');
        
        expect(fs.existsSync(testFile)).toBe(true);
        expect(fs.existsSync(mockFile)).toBe(true);
        
        // Check executable permissions
        const testStats = fs.statSync(testFile);
        const mockStats = fs.statSync(mockFile);
        
        expect(testStats.mode & parseInt('111', 8)).toBeTruthy();
        expect(mockStats.mode & parseInt('111', 8)).toBeTruthy();
      });

      it('Then the tests should provide clear output and reporting', () => {
        const testFile = path.join(testDir, 'system-detector.test.sh');
        const content = fs.readFileSync(testFile, 'utf8');
        
        expect(content).toContain('echo');
        expect(content).toContain('PASS');
        expect(content).toContain('FAIL');
        expect(content).toContain('test_');
        expect(content).toContain('assert');
        expect(content).toContain('Results');
      });

      it('Then the tests should handle test isolation and cleanup', () => {
        const testFile = path.join(testDir, 'system-detector.test.sh');
        const content = fs.readFileSync(testFile, 'utf8');
        
        expect(content).toContain('setup()');
        expect(content).toContain('teardown()');
        expect(content).toContain('teardown');
        expect(content).toContain('setup');
      });
    });
  });
});
