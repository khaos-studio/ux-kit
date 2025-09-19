/**
 * Unit tests for UtilityFunctionsSetup class
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Mock fs module
jest.mock('fs');

describe('UtilityFunctionsSetup', () => {
  const mockProjectRoot = '/mock/project/root';
  const mockUtilsDir = path.join(mockProjectRoot, 'scripts/utils');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('setupUtilityFunctions', () => {
    it('should create all utility files', async () => {
      // Mock fs.existsSync to return false for directories
      (fs.existsSync as jest.Mock).mockImplementation((filePath: unknown) => {
        if (filePath === mockUtilsDir) {
          return false;
        }
        return true;
      });

      // Mock fs.mkdirSync
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.writeFileSync
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.statSync
      (fs.statSync as jest.Mock).mockReturnValue({
        mode: 0o644
      });

      // Mock fs.chmodSync
      (fs.chmodSync as jest.Mock).mockImplementation(() => {});

      // Run the setup script
      execSync('node scripts/setup-utility-functions-simple.js', { 
        cwd: '/Users/k/Projects/ux-kit',
        stdio: 'pipe'
      });

      // Verify that writeFileSync was called for each utility file
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(mockUtilsDir, 'common.sh'),
        expect.any(String),
        'utf8'
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(mockUtilsDir, 'logger.sh'),
        expect.any(String),
        'utf8'
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(mockUtilsDir, 'error-handler.sh'),
        expect.any(String),
        'utf8'
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(mockUtilsDir, 'colors.sh'),
        expect.any(String),
        'utf8'
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(mockUtilsDir, 'filesystem.sh'),
        expect.any(String),
        'utf8'
      );
    });

    it('should set executable permissions on all files', async () => {
      // Mock fs.existsSync
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      // Mock fs.mkdirSync
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.writeFileSync
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.statSync to return a mode
      (fs.statSync as jest.Mock).mockReturnValue({
        mode: 0o644
      });

      // Mock fs.chmodSync
      (fs.chmodSync as jest.Mock).mockImplementation(() => {});

      // Run the setup script
      execSync('node scripts/setup-utility-functions-simple.js', { 
        cwd: '/Users/k/Projects/ux-kit',
        stdio: 'pipe'
      });

      // Verify that chmodSync was called for each file
      expect(fs.chmodSync).toHaveBeenCalledTimes(5);
    });

    it('should create directory if it does not exist', async () => {
      // Mock fs.existsSync to return false for the utils directory
      (fs.existsSync as jest.Mock).mockImplementation((filePath: unknown) => {
        if (filePath === mockUtilsDir) {
          return false;
        }
        return true;
      });

      // Mock fs.mkdirSync
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.writeFileSync
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.statSync
      (fs.statSync as jest.Mock).mockReturnValue({
        mode: 0o644
      });

      // Mock fs.chmodSync
      (fs.chmodSync as jest.Mock).mockImplementation(() => {});

      // Run the setup script
      execSync('node scripts/setup-utility-functions-simple.js', { 
        cwd: '/Users/k/Projects/ux-kit',
        stdio: 'pipe'
      });

      // Verify that mkdirSync was called with recursive option
      expect(fs.mkdirSync).toHaveBeenCalledWith(mockUtilsDir, { recursive: true });
    });
  });

  describe('utility file content', () => {
    it('should create common.sh with expected functions', async () => {
      // Mock fs.existsSync
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      // Mock fs.mkdirSync
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.writeFileSync
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.statSync
      (fs.statSync as jest.Mock).mockReturnValue({
        mode: 0o644
      });

      // Mock fs.chmodSync
      (fs.chmodSync as jest.Mock).mockImplementation(() => {});

      // Run the setup script
      execSync('node scripts/setup-utility-functions-simple.js', { 
        cwd: '/Users/k/Projects/ux-kit',
        stdio: 'pipe'
      });

      // Get the content written to common.sh
      const commonShCall = (fs.writeFileSync as jest.Mock).mock.calls.find(
        (call: unknown[]) => (call[0] as string).endsWith('common.sh')
      );
      expect(commonShCall).toBeDefined();
      
      const content = commonShCall![1] as string;
      expect(content).toContain('#!/bin/bash');
      expect(content).toContain('get_script_dir()');
      expect(content).toContain('validate_input()');
      expect(content).toContain('sanitize_path()');
      expect(content).toContain('check_dependencies()');
    });

    it('should create logger.sh with expected functions', async () => {
      // Mock fs.existsSync
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      // Mock fs.mkdirSync
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.writeFileSync
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.statSync
      (fs.statSync as jest.Mock).mockReturnValue({
        mode: 0o644
      });

      // Mock fs.chmodSync
      (fs.chmodSync as jest.Mock).mockImplementation(() => {});

      // Run the setup script
      execSync('node scripts/setup-utility-functions-simple.js', { 
        cwd: '/Users/k/Projects/ux-kit',
        stdio: 'pipe'
      });

      // Get the content written to logger.sh
      const loggerShCall = (fs.writeFileSync as jest.Mock).mock.calls.find(
        (call: unknown[]) => (call[0] as string).endsWith('logger.sh')
      );
      expect(loggerShCall).toBeDefined();
      
      const content = loggerShCall![1] as string;
      expect(content).toContain('#!/bin/bash');
      expect(content).toContain('log_info()');
      expect(content).toContain('log_error()');
      expect(content).toContain('log_warn()');
      expect(content).toContain('log_debug()');
      expect(content).toContain('set_log_level()');
    });

    it('should create error-handler.sh with expected functions', async () => {
      // Mock fs.existsSync
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      // Mock fs.mkdirSync
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.writeFileSync
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.statSync
      (fs.statSync as jest.Mock).mockReturnValue({
        mode: 0o644
      });

      // Mock fs.chmodSync
      (fs.chmodSync as jest.Mock).mockImplementation(() => {});

      // Run the setup script
      execSync('node scripts/setup-utility-functions-simple.js', { 
        cwd: '/Users/k/Projects/ux-kit',
        stdio: 'pipe'
      });

      // Get the content written to error-handler.sh
      const errorHandlerShCall = (fs.writeFileSync as jest.Mock).mock.calls.find(
        (call: unknown[]) => (call[0] as string).endsWith('error-handler.sh')
      );
      expect(errorHandlerShCall).toBeDefined();
      
      const content = errorHandlerShCall![1] as string;
      expect(content).toContain('#!/bin/bash');
      expect(content).toContain('cleanup()');
      expect(content).toContain('handle_error()');
      expect(content).toContain('rollback()');
      expect(content).toContain('setup_error_handling()');
    });

    it('should create colors.sh with expected functions', async () => {
      // Mock fs.existsSync
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      // Mock fs.mkdirSync
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.writeFileSync
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.statSync
      (fs.statSync as jest.Mock).mockReturnValue({
        mode: 0o644
      });

      // Mock fs.chmodSync
      (fs.chmodSync as jest.Mock).mockImplementation(() => {});

      // Run the setup script
      execSync('node scripts/setup-utility-functions-simple.js', { 
        cwd: '/Users/k/Projects/ux-kit',
        stdio: 'pipe'
      });

      // Get the content written to colors.sh
      const colorsShCall = (fs.writeFileSync as jest.Mock).mock.calls.find(
        (call: unknown[]) => (call[0] as string).endsWith('colors.sh')
      );
      expect(colorsShCall).toBeDefined();
      
      const content = colorsShCall![1] as string;
      expect(content).toContain('#!/bin/bash');
      expect(content).toContain('RED=');
      expect(content).toContain('GREEN=');
      expect(content).toContain('YELLOW=');
      expect(content).toContain('BLUE=');
      expect(content).toContain('NC=');
      expect(content).toContain('print_red()');
      expect(content).toContain('print_green()');
    });

    it('should create filesystem.sh with expected functions', async () => {
      // Mock fs.existsSync
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      // Mock fs.mkdirSync
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.writeFileSync
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      // Mock fs.statSync
      (fs.statSync as jest.Mock).mockReturnValue({
        mode: 0o644
      });

      // Mock fs.chmodSync
      (fs.chmodSync as jest.Mock).mockImplementation(() => {});

      // Run the setup script
      execSync('node scripts/setup-utility-functions-simple.js', { 
        cwd: '/Users/k/Projects/ux-kit',
        stdio: 'pipe'
      });

      // Get the content written to filesystem.sh
      const filesystemShCall = (fs.writeFileSync as jest.Mock).mock.calls.find(
        (call: unknown[]) => (call[0] as string).endsWith('filesystem.sh')
      );
      expect(filesystemShCall).toBeDefined();
      
      const content = filesystemShCall![1] as string;
      expect(content).toContain('#!/bin/bash');
      expect(content).toContain('ensure_directory_exists()');
      expect(content).toContain('create_file_with_content()');
      expect(content).toContain('backup_file()');
      expect(content).toContain('validate_path()');
      expect(content).toContain('safe_remove()');
    });
  });
});
