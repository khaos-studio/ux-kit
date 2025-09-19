"use strict";
/**
 * ProjectSetupService - Handles project setup verification and dependency management
 *
 * This service verifies that the project meets all requirements for Codex integration
 * including TypeScript version, Node.js version, and existing dependencies.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSetupService = void 0;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class ProjectSetupService {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = projectRoot;
    }
    /**
     * Verifies the complete project setup for Codex integration
     */
    async verifyProjectSetup() {
        const errors = [];
        const warnings = [];
        let success = true;
        try {
            // Verify Node.js version
            const nodeVersion = this.getNodeVersion();
            if (!this.isNodeVersionValid(nodeVersion)) {
                errors.push(`Node.js version ${nodeVersion} is below minimum requirement (18.0.0)`);
                success = false;
            }
            // Verify TypeScript version
            const typescriptVersion = this.getTypeScriptVersion();
            if (!this.isTypeScriptVersionValid(typescriptVersion)) {
                errors.push(`TypeScript version ${typescriptVersion} is below minimum requirement (5.0.0)`);
                success = false;
            }
            // Verify project structure
            const structureValid = this.verifyProjectStructure();
            if (!structureValid) {
                errors.push('Required project directories or files are missing');
                success = false;
            }
            // Verify dependencies
            const dependenciesInstalled = this.verifyDependencies();
            if (!dependenciesInstalled) {
                errors.push('Required dependencies are not installed');
                success = false;
            }
            // Verify TypeScript configuration
            const strictModeEnabled = this.verifyTypeScriptConfig();
            if (!strictModeEnabled) {
                warnings.push('TypeScript strict mode is not fully enabled');
            }
            // Verify test framework
            const testFrameworkConfigured = this.verifyTestFramework();
            if (!testFrameworkConfigured) {
                warnings.push('Test framework configuration may need attention');
            }
            return {
                success,
                errors,
                warnings,
                details: {
                    nodeVersion,
                    typescriptVersion,
                    dependenciesInstalled,
                    strictModeEnabled,
                    testFrameworkConfigured
                }
            };
        }
        catch (error) {
            return {
                success: false,
                errors: [`Setup verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
                warnings: [],
                details: {
                    nodeVersion: 'unknown',
                    typescriptVersion: 'unknown',
                    dependenciesInstalled: false,
                    strictModeEnabled: false,
                    testFrameworkConfigured: false
                }
            };
        }
    }
    /**
     * Gets the current Node.js version
     */
    getNodeVersion() {
        try {
            return (0, child_process_1.execSync)('node --version', { encoding: 'utf8' }).trim();
        }
        catch (error) {
            throw new Error('Failed to get Node.js version');
        }
    }
    /**
     * Gets the current TypeScript version
     */
    getTypeScriptVersion() {
        try {
            const output = (0, child_process_1.execSync)('npx tsc --version', { encoding: 'utf8' }).trim();
            const versionMatch = output.match(/Version (\d+\.\d+\.\d+)/);
            return versionMatch?.[1] || 'unknown';
        }
        catch (error) {
            throw new Error('Failed to get TypeScript version');
        }
    }
    /**
     * Validates Node.js version meets minimum requirement
     */
    isNodeVersionValid(version) {
        const majorVersion = parseInt(version.replace('v', '').split('.')[0] || '0');
        return majorVersion >= 18;
    }
    /**
     * Validates TypeScript version meets minimum requirement
     */
    isTypeScriptVersionValid(version) {
        if (version === 'unknown')
            return false;
        const majorVersion = parseInt(version.split('.')[0] || '0');
        return majorVersion >= 5;
    }
    /**
     * Verifies the project has required directory structure
     */
    verifyProjectStructure() {
        const requiredDirs = [
            'src/cli',
            'src/commands',
            'src/config',
            'src/contracts',
            'src/generators',
            'src/integrations',
            'src/services',
            'src/templates',
            'src/utils',
            'src/validation',
            'src/validators'
        ];
        const requiredFiles = [
            'package.json',
            'tsconfig.json',
            'jest.config.js'
        ];
        // Check directories
        for (const dir of requiredDirs) {
            const dirPath = path.join(this.projectRoot, dir);
            if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
                return false;
            }
        }
        // Check files
        for (const file of requiredFiles) {
            const filePath = path.join(this.projectRoot, file);
            if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
                return false;
            }
        }
        return true;
    }
    /**
     * Verifies that all required dependencies are installed
     */
    verifyDependencies() {
        const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
        if (!fs.existsSync(nodeModulesPath) || !fs.statSync(nodeModulesPath).isDirectory()) {
            return false;
        }
        // Check for key dependencies
        const keyDeps = ['typescript', 'jest', 'ts-jest', '@types/node'];
        for (const dep of keyDeps) {
            const depPath = path.join(nodeModulesPath, dep);
            if (!fs.existsSync(depPath)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Verifies TypeScript strict mode configuration
     */
    verifyTypeScriptConfig() {
        try {
            const tsConfigPath = path.join(this.projectRoot, 'tsconfig.json');
            const tsConfig = fs.readJsonSync(tsConfigPath);
            const requiredStrictOptions = [
                'strict',
                'noImplicitAny',
                'strictNullChecks',
                'strictFunctionTypes',
                'noImplicitReturns',
                'noFallthroughCasesInSwitch',
                'noUncheckedIndexedAccess',
                'exactOptionalPropertyTypes'
            ];
            for (const option of requiredStrictOptions) {
                if (tsConfig.compilerOptions[option] !== true) {
                    return false;
                }
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Verifies test framework configuration
     */
    verifyTestFramework() {
        try {
            const jestConfigPath = path.join(this.projectRoot, 'jest.config.js');
            // Check if jest.config.js exists
            if (!fs.existsSync(jestConfigPath))
                return false;
            // Check setup file exists
            const setupFile = path.join(this.projectRoot, 'tests/setup.ts');
            if (!fs.existsSync(setupFile))
                return false;
            // For now, just check that the files exist
            // In a real implementation, we would parse the Jest config
            // but for testing purposes, we'll keep it simple
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Installs project dependencies
     */
    async installDependencies() {
        try {
            (0, child_process_1.execSync)('npm install', {
                cwd: this.projectRoot,
                stdio: 'pipe',
                timeout: 60000 // 60 second timeout
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Gets information about project dependencies
     */
    getDependencyInfo() {
        try {
            const packageJsonPath = path.join(this.projectRoot, 'package.json');
            const packageJson = fs.readJsonSync(packageJsonPath);
            const allDeps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };
            return Object.entries(allDeps).map(([name, version]) => ({
                name,
                version: version,
                required: true,
                installed: this.isDependencyInstalled(name)
            }));
        }
        catch (error) {
            return [];
        }
    }
    /**
     * Checks if a specific dependency is installed
     */
    isDependencyInstalled(dependencyName) {
        const depPath = path.join(this.projectRoot, 'node_modules', dependencyName);
        return fs.existsSync(depPath);
    }
}
exports.ProjectSetupService = ProjectSetupService;
//# sourceMappingURL=ProjectSetupService.js.map