"use strict";
/**
 * T001: Project Structure Setup
 *
 * Creates the directory structure and initial files for the remote installation system.
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
exports.ProjectStructureSetup = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ProjectStructureSetup {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = projectRoot;
    }
    /**
     * Creates the complete directory structure for the remote installation system
     */
    async setupProjectStructure() {
        try {
            // Create main directories
            await this.createMainDirectories();
            // Create module files
            await this.createModuleFiles();
            // Create utility files
            await this.createUtilityFiles();
            // Create install scripts
            await this.createInstallScripts();
            console.log('✅ Project structure setup completed successfully');
        }
        catch (error) {
            console.error('❌ Failed to setup project structure:', error);
            throw error;
        }
    }
    /**
     * Creates the main directory structure
     */
    async createMainDirectories() {
        const directories = [
            'scripts/install',
            'scripts/modules',
            'scripts/modules/package-managers',
            'scripts/utils',
            'tests/install',
            'docs/install'
        ];
        for (const dir of directories) {
            const fullPath = path.join(this.projectRoot, dir);
            await this.ensureDirectoryExists(fullPath);
        }
    }
    /**
     * Creates module files
     */
    async createModuleFiles() {
        const modulesDir = path.join(this.projectRoot, 'scripts/modules');
        const coreModules = [
            'system-detector.sh',
            'dependency-manager.sh',
            'github-manager.sh',
            'binary-manager.sh',
            'config-manager.sh',
            'security-manager.sh',
            'progress-tracker.sh'
        ];
        for (const module of coreModules) {
            const modulePath = path.join(modulesDir, module);
            await this.createShellScript(modulePath, this.getModuleTemplate(module));
        }
        // Create package manager modules
        const packageManagersDir = path.join(modulesDir, 'package-managers');
        const packageManagers = [
            'homebrew.sh',
            'apt.sh',
            'yum.sh'
        ];
        for (const pm of packageManagers) {
            const pmPath = path.join(packageManagersDir, pm);
            await this.createShellScript(pmPath, this.getPackageManagerTemplate(pm));
        }
    }
    /**
     * Creates utility files
     */
    async createUtilityFiles() {
        const utilsDir = path.join(this.projectRoot, 'scripts/utils');
        const utilityFiles = [
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
        for (const util of utilityFiles) {
            const utilPath = path.join(utilsDir, util);
            await this.createShellScript(utilPath, this.getUtilityTemplate(util));
        }
    }
    /**
     * Creates install scripts
     */
    async createInstallScripts() {
        const installDir = path.join(this.projectRoot, 'scripts/install');
        const installScripts = [
            'install.sh',
            'install-options.sh',
            'uninstall.sh',
            'update.sh'
        ];
        for (const script of installScripts) {
            const scriptPath = path.join(installDir, script);
            await this.createShellScript(scriptPath, this.getInstallScriptTemplate(script));
        }
    }
    /**
     * Ensures a directory exists, creating it if necessary
     */
    async ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
    /**
     * Creates a shell script with proper permissions
     */
    async createShellScript(filePath, content) {
        fs.writeFileSync(filePath, content, 'utf8');
        // Set executable permissions
        const stats = fs.statSync(filePath);
        fs.chmodSync(filePath, stats.mode | parseInt('111', 8));
    }
    /**
     * Gets template content for core modules
     */
    getModuleTemplate(moduleName) {
        const baseTemplate = `#!/bin/bash
# ${moduleName}
# Generated by ProjectStructureSetup

set -euo pipefail

# Source common utilities
SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
UTILS_DIR="\${SCRIPT_DIR}/../utils"

# Load common functions
if [[ -f "\${UTILS_DIR}/common.sh" ]]; then
    source "\${UTILS_DIR}/common.sh"
fi

# Module-specific functions will be implemented here
# This is a placeholder file created by the project structure setup

echo "Module ${moduleName} loaded successfully"
`;
        return baseTemplate;
    }
    /**
     * Gets template content for package manager modules
     */
    getPackageManagerTemplate(pmName) {
        return `#!/bin/bash
# ${pmName} - Package Manager Module
# Generated by ProjectStructureSetup

set -euo pipefail

# Source common utilities
SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
UTILS_DIR="\${SCRIPT_DIR}/../../utils"

# Load common functions
if [[ -f "\${UTILS_DIR}/common.sh" ]]; then
    source "\${UTILS_DIR}/common.sh"
fi

# ${pmName} specific functions will be implemented here
# This is a placeholder file created by the project structure setup

echo "Package manager ${pmName} module loaded successfully"
`;
    }
    /**
     * Gets template content for utility files
     */
    getUtilityTemplate(utilName) {
        return `#!/bin/bash
# ${utilName} - Utility Functions
# Generated by ProjectStructureSetup

set -euo pipefail

# ${utilName} utility functions will be implemented here
# This is a placeholder file created by the project structure setup

echo "Utility ${utilName} loaded successfully"
`;
    }
    /**
     * Gets template content for install scripts
     */
    getInstallScriptTemplate(scriptName) {
        if (scriptName === 'install.sh') {
            return `#!/bin/bash
# UX-Kit Remote Installation Script
# Generated by ProjectStructureSetup

set -euo pipefail

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="\${SCRIPT_DIR}/../.."

# Source common utilities
UTILS_DIR="\${SCRIPT_DIR}/../utils"
if [[ -f "\${UTILS_DIR}/common.sh" ]]; then
    source "\${UTILS_DIR}/common.sh"
fi

# Main installation logic will be implemented here
# This is a placeholder file created by the project structure setup

echo "UX-Kit installation script loaded successfully"
echo "Installation logic will be implemented in subsequent tasks"
`;
        }
        return `#!/bin/bash
# ${scriptName} - UX-Kit ${scriptName.replace('.sh', '').replace('-', ' ')} Script
# Generated by ProjectStructureSetup

set -euo pipefail

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="\${SCRIPT_DIR}/../.."

# Source common utilities
UTILS_DIR="\${SCRIPT_DIR}/../utils"
if [[ -f "\${UTILS_DIR}/common.sh" ]]; then
    source "\${UTILS_DIR}/common.sh"
fi

# ${scriptName} logic will be implemented here
# This is a placeholder file created by the project structure setup

echo "${scriptName} script loaded successfully"
`;
    }
}
exports.ProjectStructureSetup = ProjectStructureSetup;
//# sourceMappingURL=ProjectStructureSetup.js.map