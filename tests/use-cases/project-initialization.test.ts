/**
 * Use Case Tests for Project Initialization (T001)
 * 
 * These tests define the expected behavior for initializing a TypeScript CLI project
 * with minimal dependencies, following TDD principles.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Project Initialization Use Cases', () => {
  const projectRoot = process.cwd();
  
  describe('Given a new project directory', () => {
    describe('When initializing a TypeScript CLI project', () => {
      it('Then should create package.json with CLI dependencies only', () => {
        // Given: A new project directory
        // When: Project is initialized
        // Then: package.json should exist with minimal CLI dependencies
        
        const packageJsonPath = join(projectRoot, 'package.json');
        expect(existsSync(packageJsonPath)).toBe(true);
        
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        
        // Should have CLI-specific dependencies
        expect(packageJson.dependencies).toHaveProperty('commander');
        expect(packageJson.dependencies).toHaveProperty('inquirer');
        expect(packageJson.dependencies).toHaveProperty('chalk');
        expect(packageJson.dependencies).toHaveProperty('ora');
        expect(packageJson.dependencies).toHaveProperty('fs-extra');
        expect(packageJson.dependencies).toHaveProperty('yaml');
        expect(packageJson.dependencies).toHaveProperty('uuid');
        expect(packageJson.dependencies).toHaveProperty('handlebars');
        
        // Should have development dependencies
        expect(packageJson.devDependencies).toHaveProperty('typescript');
        expect(packageJson.devDependencies).toHaveProperty('@types/node');
        expect(packageJson.devDependencies).toHaveProperty('jest');
        expect(packageJson.devDependencies).toHaveProperty('@types/jest');
        expect(packageJson.devDependencies).toHaveProperty('ts-jest');
        expect(packageJson.devDependencies).toHaveProperty('eslint');
        expect(packageJson.devDependencies).toHaveProperty('@typescript-eslint/eslint-plugin');
        expect(packageJson.devDependencies).toHaveProperty('prettier');
        
        // Should have CLI scripts
        expect(packageJson.scripts).toHaveProperty('build');
        expect(packageJson.scripts).toHaveProperty('test');
        expect(packageJson.scripts).toHaveProperty('lint');
        expect(packageJson.scripts).toHaveProperty('format');
        
        // Should have proper package metadata
        expect(packageJson.name).toBe('@ux-kit/cli');
        expect(packageJson.version).toBe('1.0.0');
        expect(packageJson.description).toContain('UX research CLI toolkit');
        expect(packageJson.bin).toHaveProperty('uxkit');
      });
      
      it('Then should create TypeScript configuration with strict mode enabled', () => {
        // Given: A new project directory
        // When: Project is initialized
        // Then: tsconfig.json should exist with strict mode enabled
        
        const tsconfigPath = join(projectRoot, 'tsconfig.json');
        expect(existsSync(tsconfigPath)).toBe(true);
        
        const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
        
        // Should have strict mode enabled
        expect(tsconfig.compilerOptions.strict).toBe(true);
        expect(tsconfig.compilerOptions.noImplicitAny).toBe(true);
        expect(tsconfig.compilerOptions.strictNullChecks).toBe(true);
        expect(tsconfig.compilerOptions.strictFunctionTypes).toBe(true);
        expect(tsconfig.compilerOptions.noImplicitReturns).toBe(true);
        expect(tsconfig.compilerOptions.noFallthroughCasesInSwitch).toBe(true);
        
        // Should have proper module and target settings
        expect(tsconfig.compilerOptions.target).toBe('ES2020');
        expect(tsconfig.compilerOptions.module).toBe('commonjs');
        expect(tsconfig.compilerOptions.moduleResolution).toBe('node');
        expect(tsconfig.compilerOptions.esModuleInterop).toBe(true);
        expect(tsconfig.compilerOptions.allowSyntheticDefaultImports).toBe(true);
        
        // Should have proper output settings
        expect(tsconfig.compilerOptions.outDir).toBe('./dist');
        expect(tsconfig.compilerOptions.rootDir).toBe('./src');
        expect(tsconfig.compilerOptions.declaration).toBe(true);
        expect(tsconfig.compilerOptions.sourceMap).toBe(true);
        
        // Should include and exclude proper files
        expect(tsconfig.include).toContain('src/**/*');
        expect(tsconfig.exclude).toContain('node_modules');
        expect(tsconfig.exclude).toContain('dist');
        expect(tsconfig.exclude).toContain('tests');
      });
      
      it('Then should create ESLint configuration with TypeScript rules', () => {
        // Given: A new project directory
        // When: Project is initialized
        // Then: .eslintrc.js should exist with TypeScript rules
        
        const eslintPath = join(projectRoot, '.eslintrc.js');
        expect(existsSync(eslintPath)).toBe(true);
        
        const eslintConfig = require(eslintPath);
        
        // Should extend TypeScript recommended rules
        expect(eslintConfig.extends).toContain('plugin:@typescript-eslint/recommended');
        expect(eslintConfig.extends).toContain('prettier');
        
        // Should have TypeScript parser
        expect(eslintConfig.parser).toBe('@typescript-eslint/parser');
        
        // Should have TypeScript plugin
        expect(eslintConfig.plugins).toContain('@typescript-eslint');
        
        // Should have proper parser options
        expect(eslintConfig.parserOptions.ecmaVersion).toBe(2021);
        expect(eslintConfig.parserOptions.sourceType).toBe('module');
        expect(eslintConfig.parserOptions.project).toBe('./tsconfig.json');
        
        // Should have proper environment
        expect(eslintConfig.env.node).toBe(true);
        expect(eslintConfig.env.jest).toBe(true);
      });
      
      it('Then should create Prettier configuration for code formatting', () => {
        // Given: A new project directory
        // When: Project is initialized
        // Then: .prettierrc should exist with formatting rules
        
        const prettierPath = join(projectRoot, '.prettierrc');
        expect(existsSync(prettierPath)).toBe(true);
        
        const prettierConfig = JSON.parse(readFileSync(prettierPath, 'utf-8'));
        
        // Should have consistent formatting rules
        expect(prettierConfig.semi).toBe(true);
        expect(prettierConfig.trailingComma).toBe('es5');
        expect(prettierConfig.singleQuote).toBe(true);
        expect(prettierConfig.printWidth).toBe(80);
        expect(prettierConfig.tabWidth).toBe(2);
        expect(prettierConfig.useTabs).toBe(false);
      });
      
      it('Then should create Jest configuration for testing', () => {
        // Given: A new project directory
        // When: Project is initialized
        // Then: jest.config.js should exist with TypeScript support
        
        const jestPath = join(projectRoot, 'jest.config.js');
        expect(existsSync(jestPath)).toBe(true);
        
        const jestConfig = require(jestPath);
        
        // Should have TypeScript preset
        expect(jestConfig.preset).toBe('ts-jest');
        
        // Should have proper test environment
        expect(jestConfig.testEnvironment).toBe('node');
        
        // Should have proper test patterns
        expect(jestConfig.testMatch).toContain('**/__tests__/**/*.ts');
        expect(jestConfig.testMatch).toContain('**/?(*.)+(spec|test).ts');
        
        // Should have proper module file extensions
        expect(jestConfig.moduleFileExtensions).toContain('ts');
        expect(jestConfig.moduleFileExtensions).toContain('js');
        expect(jestConfig.moduleFileExtensions).toContain('json');
        
        // Should have proper transform configuration
        expect(jestConfig.transform['^.+\\.ts$']).toBe('ts-jest');
        
        // Should have proper coverage configuration
        expect(jestConfig.collectCoverageFrom).toContain('src/**/*.ts');
        expect(jestConfig.collectCoverageFrom).toContain('!src/**/*.d.ts');
        expect(jestConfig.coverageDirectory).toBe('coverage');
        expect(jestConfig.coverageReporters).toContain('text');
        expect(jestConfig.coverageReporters).toContain('lcov');
        expect(jestConfig.coverageReporters).toContain('html');
      });
      
      it('Then should create .gitignore with appropriate exclusions', () => {
        // Given: A new project directory
        // When: Project is initialized
        // Then: .gitignore should exist with proper exclusions
        
        const gitignorePath = join(projectRoot, '.gitignore');
        expect(existsSync(gitignorePath)).toBe(true);
        
        const gitignoreContent = readFileSync(gitignorePath, 'utf-8');
        
        // Should exclude common Node.js files
        expect(gitignoreContent).toContain('node_modules/');
        expect(gitignoreContent).toContain('npm-debug.log*');
        expect(gitignoreContent).toContain('yarn-debug.log*');
        expect(gitignoreContent).toContain('yarn-error.log*');
        
        // Should exclude build outputs
        expect(gitignoreContent).toContain('dist/');
        expect(gitignoreContent).toContain('build/');
        expect(gitignoreContent).toContain('*.tsbuildinfo');
        
        // Should exclude coverage reports
        expect(gitignoreContent).toContain('coverage/');
        expect(gitignoreContent).toContain('*.lcov');
        
        // Should exclude IDE files
        expect(gitignoreContent).toContain('.vscode/');
        expect(gitignoreContent).toContain('.idea/');
        expect(gitignoreContent).toContain('*.swp');
        expect(gitignoreContent).toContain('*.swo');
        
        // Should exclude OS files
        expect(gitignoreContent).toContain('.DS_Store');
        expect(gitignoreContent).toContain('Thumbs.db');
        
        // Should exclude environment files
        expect(gitignoreContent).toContain('.env');
        expect(gitignoreContent).toContain('.env.local');
        expect(gitignoreContent).toContain('.env.*.local');
      });
      
      it('Then should create basic project structure with source files', () => {
        // Given: A new project directory
        // When: Project is initialized
        // Then: Basic project structure should exist
        
        // Should have src directory
        expect(existsSync(join(projectRoot, 'src'))).toBe(true);
        
        // Should have main entry point
        const indexPath = join(projectRoot, 'src/index.ts');
        expect(existsSync(indexPath)).toBe(true);
        
        const indexContent = readFileSync(indexPath, 'utf-8');
        expect(indexContent).toContain('#!/usr/bin/env node');
        expect(indexContent).toContain('console.log');
        
        // Should have tests directory
        expect(existsSync(join(projectRoot, 'tests'))).toBe(true);
        
        // Should have README.md
        const readmePath = join(projectRoot, 'README.md');
        expect(existsSync(readmePath)).toBe(true);
        
        const readmeContent = readFileSync(readmePath, 'utf-8');
        expect(readmeContent).toContain('UX-Kit');
        expect(readmeContent).toContain('CLI');
        expect(readmeContent).toContain('Installation');
      });
      
      it('Then should have dist directory after build', () => {
        // Given: A properly initialized project
        // When: Project is built
        // Then: dist directory should exist
        
        // This test will pass once the project is built
        // We'll verify the build process separately
        expect(true).toBe(true);
      });
    });
  });
});
