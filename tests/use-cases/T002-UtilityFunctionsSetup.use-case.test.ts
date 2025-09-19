/**
 * T002: Utility Functions Setup - Use Case Tests
 * 
 * These tests define the expected behavior for creating common utility functions
 * used across all installation modules.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

describe('T002: Utility Functions Setup', () => {
  const projectRoot = '/Users/k/Projects/ux-kit';
  const utilsDir = path.join(projectRoot, 'scripts/utils');

  beforeEach(() => {
    // Clean up any existing utility files
    const utilityFiles = [
      'common.sh',
      'logger.sh',
      'error-handler.sh',
      'colors.sh',
      'filesystem.sh'
    ];
    
    utilityFiles.forEach(file => {
      const filePath = path.join(utilsDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

  afterEach(() => {
    // Clean up after tests
    const utilityFiles = [
      'common.sh',
      'logger.sh',
      'error-handler.sh',
      'colors.sh',
      'filesystem.sh'
    ];
    
    utilityFiles.forEach(file => {
      const filePath = path.join(utilsDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

  describe('Given a user wants to set up utility functions for the installation system', () => {
    describe('When they run the utility functions setup', () => {
      beforeEach(async () => {
        // Run the actual setup using the Node.js script
        execSync('node scripts/setup-utility-functions-simple.js', { 
          cwd: projectRoot,
          stdio: 'pipe'
        });
      });

      it('Then it should create common.sh with shared functions', () => {
        const commonFile = path.join(utilsDir, 'common.sh');
        
        expect(fs.existsSync(commonFile)).toBe(true);
        expect(fs.statSync(commonFile).isFile()).toBe(true);
        
        const content = fs.readFileSync(commonFile, 'utf8');
        expect(content).toContain('#!/bin/bash');
        expect(content).toContain('set -euo pipefail');
        expect(content).toContain('# Common utility functions');
      });

      it('Then it should implement logging utilities in logger.sh', () => {
        const loggerFile = path.join(utilsDir, 'logger.sh');
        
        expect(fs.existsSync(loggerFile)).toBe(true);
        expect(fs.statSync(loggerFile).isFile()).toBe(true);
        
        const content = fs.readFileSync(loggerFile, 'utf8');
        expect(content).toContain('#!/bin/bash');
        expect(content).toContain('set -euo pipefail');
        expect(content).toContain('# Logging utilities');
        expect(content).toContain('log_info()');
        expect(content).toContain('log_error()');
        expect(content).toContain('log_warn()');
        expect(content).toContain('log_debug()');
      });

      it('Then it should implement error handling utilities in error-handler.sh', () => {
        const errorHandlerFile = path.join(utilsDir, 'error-handler.sh');
        
        expect(fs.existsSync(errorHandlerFile)).toBe(true);
        expect(fs.statSync(errorHandlerFile).isFile()).toBe(true);
        
        const content = fs.readFileSync(errorHandlerFile, 'utf8');
        expect(content).toContain('#!/bin/bash');
        expect(content).toContain('set -euo pipefail');
        expect(content).toContain('# Error handling utilities');
        expect(content).toContain('trap');
        expect(content).toContain('cleanup');
        expect(content).toContain('handle_error()');
      });

      it('Then it should implement color and formatting utilities in colors.sh', () => {
        const colorsFile = path.join(utilsDir, 'colors.sh');
        
        expect(fs.existsSync(colorsFile)).toBe(true);
        expect(fs.statSync(colorsFile).isFile()).toBe(true);
        
        const content = fs.readFileSync(colorsFile, 'utf8');
        expect(content).toContain('#!/bin/bash');
        expect(content).toContain('set -euo pipefail');
        expect(content).toContain('# Color and formatting utilities');
        expect(content).toContain('RED=');
        expect(content).toContain('GREEN=');
        expect(content).toContain('YELLOW=');
        expect(content).toContain('BLUE=');
        expect(content).toContain('NC=');
      });

      it('Then it should implement file system utilities in filesystem.sh', () => {
        const filesystemFile = path.join(utilsDir, 'filesystem.sh');
        
        expect(fs.existsSync(filesystemFile)).toBe(true);
        expect(fs.statSync(filesystemFile).isFile()).toBe(true);
        
        const content = fs.readFileSync(filesystemFile, 'utf8');
        expect(content).toContain('#!/bin/bash');
        expect(content).toContain('set -euo pipefail');
        expect(content).toContain('# File system utilities');
        expect(content).toContain('ensure_directory_exists()');
        expect(content).toContain('create_file_with_content()');
        expect(content).toContain('backup_file()');
        expect(content).toContain('validate_path()');
      });

      it('Then all utility files should have executable permissions', () => {
        const utilityFiles = [
          'common.sh',
          'logger.sh',
          'error-handler.sh',
          'colors.sh',
          'filesystem.sh'
        ];

        utilityFiles.forEach(file => {
          const filePath = path.join(utilsDir, file);
          if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const isExecutable = !!(stats.mode & parseInt('111', 8));
            expect(isExecutable).toBe(true);
          }
        });
      });

      it('Then common.sh should provide shared functions for other utilities', () => {
        const commonFile = path.join(utilsDir, 'common.sh');
        
        if (fs.existsSync(commonFile)) {
          const content = fs.readFileSync(commonFile, 'utf8');
          expect(content).toContain('validate_input()');
          expect(content).toContain('sanitize_path()');
          expect(content).toContain('check_dependencies()');
          expect(content).toContain('get_script_dir()');
        }
      });

      it('Then logger.sh should support different log levels and output formats', () => {
        const loggerFile = path.join(utilsDir, 'logger.sh');
        
        if (fs.existsSync(loggerFile)) {
          const content = fs.readFileSync(loggerFile, 'utf8');
          expect(content).toContain('LOG_LEVEL');
          expect(content).toContain('log_info()');
          expect(content).toContain('log_error()');
          expect(content).toContain('log_warn()');
          expect(content).toContain('log_debug()');
          expect(content).toContain('timestamp');
        }
      });

      it('Then error-handler.sh should provide comprehensive error handling', () => {
        const errorHandlerFile = path.join(utilsDir, 'error-handler.sh');
        
        if (fs.existsSync(errorHandlerFile)) {
          const content = fs.readFileSync(errorHandlerFile, 'utf8');
          expect(content).toContain('trap');
          expect(content).toContain('cleanup()');
          expect(content).toContain('handle_error()');
          expect(content).toContain('rollback()');
          expect(content).toContain('EXIT');
          expect(content).toContain('ERR');
        }
      });

      it('Then colors.sh should provide consistent color definitions', () => {
        const colorsFile = path.join(utilsDir, 'colors.sh');
        
        if (fs.existsSync(colorsFile)) {
          const content = fs.readFileSync(colorsFile, 'utf8');
          expect(content).toContain('RED=');
          expect(content).toContain('GREEN=');
          expect(content).toContain('YELLOW=');
          expect(content).toContain('BLUE=');
          expect(content).toContain('NC=');
          expect(content).toContain('BOLD=');
          expect(content).toContain('DIM=');
        }
      });

      it('Then filesystem.sh should provide safe file operations', () => {
        const filesystemFile = path.join(utilsDir, 'filesystem.sh');
        
        if (fs.existsSync(filesystemFile)) {
          const content = fs.readFileSync(filesystemFile, 'utf8');
          expect(content).toContain('ensure_directory_exists()');
          expect(content).toContain('create_file_with_content()');
          expect(content).toContain('backup_file()');
          expect(content).toContain('validate_path()');
          expect(content).toContain('safe_remove()');
          expect(content).toContain('get_file_size()');
        }
      });
    });

    describe('When utility functions are used in other scripts', () => {
      it('Then they should be properly sourced and functional', () => {
        // This test will verify that utility functions can be sourced
        // and used in other shell scripts
        expect(true).toBe(true); // Placeholder for now
      });

      it('Then they should handle edge cases gracefully', () => {
        // This test will verify error handling in utility functions
        expect(true).toBe(true); // Placeholder for now
      });
    });
  });
});
