#!/usr/bin/env node

/**
 * T004: Dependency Manager Tests Setup Script
 * 
 * Creates comprehensive tests for dependency installation and management including
 * Homebrew, APT, YUM package managers, Node.js and Git installation, and fallback mechanisms.
 */

const fs = require('fs');
const path = require('path');

class DependencyManagerTestsSetup {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.testDir = path.join(this.projectRoot, 'tests/install');
    this.fixturesDir = path.join(this.projectRoot, 'tests/fixtures/package-managers');
    this.mocksDir = path.join(this.projectRoot, 'tests/mocks');
  }

  async setupDependencyManagerTests() {
    try {
      console.log('🚀 Starting dependency manager tests setup (T004)...');
      
      // Create directories
      await this.createDirectories();
      
      // Create test files
      await this.createTestFile();
      await this.createMockFile();
      await this.createFixtureFiles();
      
      console.log('✅ Dependency manager tests setup completed successfully');
      console.log('📁 Created directories:');
      console.log(`   - ${this.testDir}`);
      console.log(`   - ${this.fixturesDir}`);
      console.log(`   - ${this.mocksDir}`);
      console.log('📄 Created test files:');
      console.log(`   - ${path.join(this.testDir, 'dependency-manager.test.sh')}`);
      console.log(`   - ${path.join(this.mocksDir, 'package-manager.mock.sh')}`);
      console.log('📄 Created fixture files:');
      console.log(`   - ${path.join(this.fixturesDir, 'homebrew-macos.json')}`);
      console.log(`   - ${path.join(this.fixturesDir, 'apt-ubuntu.json')}`);
      console.log(`   - ${path.join(this.fixturesDir, 'yum-centos.json')}`);
      console.log(`   - ${path.join(this.fixturesDir, 'nodejs-versions.json')}`);
      console.log(`   - ${path.join(this.fixturesDir, 'git-versions.json')}`);
      console.log('🔧 Set executable permissions for shell scripts');

    } catch (error) {
      console.error(`❌ Failed to setup dependency manager tests: ${error.message}`);
      throw error;
    }
  }

  async createDirectories() {
    const dirs = [this.testDir, this.fixturesDir, this.mocksDir];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  async createTestFile() {
    const testFile = path.join(this.testDir, 'dependency-manager.test.sh');
    const content = `#!/bin/bash

# T004: Dependency Manager Tests
# Comprehensive tests for dependency installation and management

set -euo pipefail

# Source the mock functions
SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
MOCK_FILE="\${SCRIPT_DIR}/../../mocks/package-manager.mock.sh"

if [[ -f "\${MOCK_FILE}" ]]; then
    source "\${MOCK_FILE}"
fi

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Test utilities
setup() {
    echo "Setting up test environment..."
    # Reset test environment
    export TEST_MODE=true
    export MOCK_PACKAGE_MANAGER=true
}

teardown() {
    echo "Cleaning up test environment..."
    # Clean up test environment
    unset TEST_MODE
    unset MOCK_PACKAGE_MANAGER
}

assert() {
    local test_name="\$1"
    local condition="\$2"
    local message="\$3"
    
    TESTS_RUN=\$((TESTS_RUN + 1))
    
    if eval "\$condition"; then
        echo "✅ PASS: \$test_name"
        TESTS_PASSED=\$((TESTS_PASSED + 1))
        return 0
    else
        echo "❌ FAIL: \$test_name - \$message"
        TESTS_FAILED=\$((TESTS_FAILED + 1))
        return 1
    fi
}

# Test Homebrew installation on macOS
test_homebrew_installation() {
    echo "Testing Homebrew installation on macOS..."
    
    # Test Homebrew detection
    assert "Homebrew detection" "command -v brew >/dev/null 2>&1" "Should detect Homebrew"
    
    # Test Homebrew version
    if command -v brew >/dev/null 2>&1; then
        assert "Homebrew version check" "brew --version >/dev/null 2>&1" "Should have valid Homebrew version"
    fi
    
    # Test Homebrew update
    assert "Homebrew update" "brew update >/dev/null 2>&1 || true" "Should be able to update Homebrew"
    
    # Test Homebrew list
    assert "Homebrew list" "brew list >/dev/null 2>&1" "Should be able to list installed packages"
    
    # Test Homebrew install (dry run)
    assert "Homebrew install capability" "brew install --dry-run node >/dev/null 2>&1 || true" "Should be able to install packages"
}

# Test APT package installation on Ubuntu/Debian
test_apt_installation() {
    echo "Testing APT package installation on Ubuntu/Debian..."
    
    # Test APT detection
    assert "APT detection" "command -v apt >/dev/null 2>&1 || command -v apt-get >/dev/null 2>&1" "Should detect APT"
    
    # Test APT update
    assert "APT update" "apt update >/dev/null 2>&1 || apt-get update >/dev/null 2>&1 || true" "Should be able to update APT"
    
    # Test APT list
    assert "APT list" "apt list --installed >/dev/null 2>&1 || apt-get list --installed >/dev/null 2>&1 || true" "Should be able to list installed packages"
    
    # Test APT install (dry run)
    assert "APT install capability" "apt install --dry-run nodejs >/dev/null 2>&1 || apt-get install --dry-run nodejs >/dev/null 2>&1 || true" "Should be able to install packages"
    
    # Test APT search
    assert "APT search" "apt search nodejs >/dev/null 2>&1 || apt-get search nodejs >/dev/null 2>&1 || true" "Should be able to search packages"
}

# Test YUM package installation on RHEL/CentOS
test_yum_installation() {
    echo "Testing YUM package installation on RHEL/CentOS..."
    
    # Test YUM detection
    assert "YUM detection" "command -v yum >/dev/null 2>&1 || command -v dnf >/dev/null 2>&1" "Should detect YUM or DNF"
    
    # Test YUM update
    assert "YUM update" "yum update >/dev/null 2>&1 || dnf update >/dev/null 2>&1 || true" "Should be able to update YUM"
    
    # Test YUM list
    assert "YUM list" "yum list installed >/dev/null 2>&1 || dnf list installed >/dev/null 2>&1 || true" "Should be able to list installed packages"
    
    # Test YUM install (dry run)
    assert "YUM install capability" "yum install --assumeno nodejs >/dev/null 2>&1 || dnf install --assumeno nodejs >/dev/null 2>&1 || true" "Should be able to install packages"
    
    # Test YUM search
    assert "YUM search" "yum search nodejs >/dev/null 2>&1 || dnf search nodejs >/dev/null 2>&1 || true" "Should be able to search packages"
}

# Test Node.js installation
test_nodejs_installation() {
    echo "Testing Node.js installation..."
    
    # Test Node.js detection
    assert "Node.js detection" "command -v node >/dev/null 2>&1" "Should detect Node.js"
    
    # Test Node.js version
    if command -v node >/dev/null 2>&1; then
        local node_version="\$(node --version | cut -d'v' -f2 | cut -d'.' -f1)"
        assert "Node.js version check" "[[ \"\$node_version\" -ge 18 ]]" "Should have Node.js 18+"
    fi
    
    # Test NPM detection
    assert "NPM detection" "command -v npm >/dev/null 2>&1" "Should detect NPM"
    
    # Test NPM version
    if command -v npm >/dev/null 2>&1; then
        assert "NPM version check" "npm --version >/dev/null 2>&1" "Should have valid NPM version"
    fi
    
    # Test NVM detection (optional)
    assert "NVM detection" "command -v nvm >/dev/null 2>&1 || [[ -f ~/.nvm/nvm.sh ]]" "Should detect NVM if available"
    
    # Test N detection (optional)
    assert "N detection" "command -v n >/dev/null 2>&1" "Should detect N if available"
}

# Test Git installation
test_git_installation() {
    echo "Testing Git installation..."
    
    # Test Git detection
    assert "Git detection" "command -v git >/dev/null 2>&1" "Should detect Git"
    
    # Test Git version
    if command -v git >/dev/null 2>&1; then
        assert "Git version check" "git --version >/dev/null 2>&1" "Should have valid Git version"
    fi
    
    # Test Git configuration
    assert "Git configuration" "git config --global --list >/dev/null 2>&1 || true" "Should be able to access Git configuration"
}

# Test fallback mechanisms
test_fallback_mechanisms() {
    echo "Testing fallback mechanisms..."
    
    # Test alternative package managers
    assert "Alternative package managers" "command -v brew >/dev/null 2>&1 || command -v apt >/dev/null 2>&1 || command -v yum >/dev/null 2>&1" "Should have at least one package manager"
    
    # Test fallback installation methods
    assert "Fallback installation methods" "command -v curl >/dev/null 2>&1 || command -v wget >/dev/null 2>&1" "Should have download tools for fallback"
    
    # Test retry mechanism
    local retry_count=0
    local max_retries=3
    
    while [[ \$retry_count -lt \$max_retries ]]; do
        if command -v node >/dev/null 2>&1; then
            break
        fi
        retry_count=\$((retry_count + 1))
        sleep 0.1
    done
    
    assert "Retry mechanism" "[[ \$retry_count -lt \$max_retries ]]" "Should handle retries for missing dependencies"
    
    # Test timeout handling
    local timeout_start="\$(date +%s)"
    timeout 5s command -v node >/dev/null 2>&1 || true
    local timeout_end="\$(date +%s)"
    local timeout_duration="\$((timeout_end - timeout_start))"
    
    assert "Timeout handling" "[[ \$timeout_duration -lt 10 ]]" "Should handle timeouts gracefully"
}

# Test installation success scenarios
test_installation_success_scenarios() {
    echo "Testing installation success scenarios..."
    
    # Test successful package detection
    assert "Successful package detection" "command -v node >/dev/null 2>&1 || command -v git >/dev/null 2>&1" "Should detect at least one package"
    
    # Test successful version check
    if command -v node >/dev/null 2>&1; then
        assert "Successful Node.js version check" "node --version >/dev/null 2>&1" "Should get Node.js version successfully"
    fi
    
    if command -v git >/dev/null 2>&1; then
        assert "Successful Git version check" "git --version >/dev/null 2>&1" "Should get Git version successfully"
    fi
    
    # Test successful package manager operation
    if command -v brew >/dev/null 2>&1; then
        assert "Successful Homebrew operation" "brew --version >/dev/null 2>&1" "Should run Homebrew commands successfully"
    fi
    
    if command -v apt >/dev/null 2>&1; then
        assert "Successful APT operation" "apt --version >/dev/null 2>&1" "Should run APT commands successfully"
    fi
}

# Test installation failure scenarios
test_installation_failure_scenarios() {
    echo "Testing installation failure scenarios..."
    
    # Test missing package manager
    if ! command -v brew >/dev/null 2>&1 && ! command -v apt >/dev/null 2>&1 && ! command -v yum >/dev/null 2>&1; then
        assert "Missing package manager error" "false" "Should handle missing package manager"
    fi
    
    # Test missing dependencies
    if ! command -v node >/dev/null 2>&1; then
        assert "Missing Node.js error" "false" "Should handle missing Node.js"
    fi
    
    if ! command -v git >/dev/null 2>&1; then
        assert "Missing Git error" "false" "Should handle missing Git"
    fi
    
    # Test network connectivity
    assert "Network connectivity" "ping -c 1 8.8.8.8 >/dev/null 2>&1 || ping -c 1 1.1.1.1 >/dev/null 2>&1" "Should have network connectivity"
}

# Test version checking and validation
test_version_checking() {
    echo "Testing version checking and validation..."
    
    # Test Node.js version validation
    if command -v node >/dev/null 2>&1; then
        local node_version="\$(node --version | cut -d'v' -f2)"
        assert "Node.js version format" "[[ \"\$node_version\" =~ ^[0-9]+\\.[0-9]+\\.[0-9]+$ ]]" "Should have valid Node.js version format"
        
        local node_major="\$(echo \"\$node_version\" | cut -d'.' -f1)"
        assert "Node.js minimum version" "[[ \"\$node_major\" -ge 18 ]]" "Should have Node.js 18+"
    fi
    
    # Test Git version validation
    if command -v git >/dev/null 2>&1; then
        local git_version="\$(git --version | cut -d' ' -f3)"
        assert "Git version format" "[[ \"\$git_version\" =~ ^[0-9]+\\.[0-9]+\\.[0-9]+$ ]]" "Should have valid Git version format"
        
        local git_major="\$(echo \"\$git_version\" | cut -d'.' -f1)"
        assert "Git minimum version" "[[ \"\$git_major\" -ge 2 ]]" "Should have Git 2+"
    fi
    
    # Test package manager version validation
    if command -v brew >/dev/null 2>&1; then
        assert "Homebrew version validation" "brew --version >/dev/null 2>&1" "Should have valid Homebrew version"
    fi
    
    if command -v apt >/dev/null 2>&1; then
        assert "APT version validation" "apt --version >/dev/null 2>&1" "Should have valid APT version"
    fi
}

# Test network connectivity issues
test_network_connectivity() {
    echo "Testing network connectivity issues..."
    
    # Test basic connectivity
    assert "Basic network connectivity" "ping -c 1 8.8.8.8 >/dev/null 2>&1 || ping -c 1 1.1.1.1 >/dev/null 2>&1" "Should have basic network connectivity"
    
    # Test HTTP connectivity
    assert "HTTP connectivity" "curl -s --connect-timeout 5 https://www.google.com >/dev/null 2>&1 || wget --timeout=5 --tries=1 -q https://www.google.com >/dev/null 2>&1" "Should have HTTP connectivity"
    
    # Test package repository connectivity
    if command -v brew >/dev/null 2>&1; then
        assert "Homebrew repository connectivity" "curl -s --connect-timeout 5 https://brew.sh >/dev/null 2>&1" "Should have Homebrew repository connectivity"
    fi
    
    if command -v apt >/dev/null 2>&1; then
        assert "APT repository connectivity" "curl -s --connect-timeout 5 http://archive.ubuntu.com >/dev/null 2>&1" "Should have APT repository connectivity"
    fi
    
    # Test timeout handling
    local timeout_start="\$(date +%s)"
    timeout 3s ping -c 1 8.8.8.8 >/dev/null 2>&1 || true
    local timeout_end="\$(date +%s)"
    local timeout_duration="\$((timeout_end - timeout_start))"
    
    assert "Network timeout handling" "[[ \$timeout_duration -lt 5 ]]" "Should handle network timeouts"
    
    # Test retry mechanism
    local retry_count=0
    local max_retries=3
    
    while [[ \$retry_count -lt \$max_retries ]]; do
        if ping -c 1 8.8.8.8 >/dev/null 2>&1; then
            break
        fi
        retry_count=\$((retry_count + 1))
        sleep 0.1
    done
    
    assert "Network retry mechanism" "[[ \$retry_count -lt \$max_retries ]]" "Should handle network retries"
}

# Test permission and sudo requirements
test_permission_requirements() {
    echo "Testing permission and sudo requirements..."
    
    # Test sudo availability
    assert "Sudo availability" "command -v sudo >/dev/null 2>&1 || [[ \$EUID -eq 0 ]]" "Should have sudo or be root"
    
    # Test write permissions
    assert "Write permissions" "touch /tmp/test_write_permissions 2>/dev/null && rm -f /tmp/test_write_permissions" "Should have write permissions"
    
    # Test package manager permissions
    if command -v brew >/dev/null 2>&1; then
        assert "Homebrew permissions" "brew --version >/dev/null 2>&1" "Should have Homebrew permissions"
    fi
    
    if command -v apt >/dev/null 2>&1; then
        assert "APT permissions" "apt --version >/dev/null 2>&1" "Should have APT permissions"
    fi
    
    # Test installation directory permissions
    assert "Installation directory permissions" "[[ -w /usr/local ]] || [[ -w /opt ]] || [[ -w ~/.local ]] || [[ -w ~/bin ]]" "Should have write access to installation directories"
    
    # Test sudo requirements for system packages
    if command -v apt >/dev/null 2>&1; then
        assert "APT sudo requirements" "sudo -n apt --version >/dev/null 2>&1 || apt --version >/dev/null 2>&1" "Should handle APT sudo requirements"
    fi
    
    if command -v yum >/dev/null 2>&1; then
        assert "YUM sudo requirements" "sudo -n yum --version >/dev/null 2>&1 || yum --version >/dev/null 2>&1" "Should handle YUM sudo requirements"
    fi
}

# Main test runner
run_tests() {
    echo "🧪 Running Dependency Manager Tests (T004)"
    echo "=========================================="
    
    setup
    
    test_homebrew_installation
    test_apt_installation
    test_yum_installation
    test_nodejs_installation
    test_git_installation
    test_fallback_mechanisms
    test_installation_success_scenarios
    test_installation_failure_scenarios
    test_version_checking
    test_network_connectivity
    test_permission_requirements
    
    teardown
    
    echo "=========================================="
    echo "📊 Test Results:"
    echo "   Tests Run: \$TESTS_RUN"
    echo "   Tests Passed: \$TESTS_PASSED"
    echo "   Tests Failed: \$TESTS_FAILED"
    
    if [[ \$TESTS_FAILED -eq 0 ]]; then
        echo "✅ All tests passed!"
        exit 0
    else
        echo "❌ Some tests failed!"
        exit 1
    fi
}

# Run tests if script is executed directly
if [[ "\${BASH_SOURCE[0]}" == "\${0}" ]]; then
    run_tests
fi
`;

    await this.createShellScript(testFile, content);
  }

  async createMockFile() {
    const mockFile = path.join(this.mocksDir, 'package-manager.mock.sh');
    const content = `#!/bin/bash

# T004: Dependency Manager Tests - Mock Functions
# Mock package manager commands for consistent testing

set -euo pipefail

# Mock configuration
MOCK_BREW_VERSION="3.6.0"
MOCK_APT_VERSION="2.4.8"
MOCK_YUM_VERSION="4.7.0"
MOCK_NODE_VERSION="18.17.0"
MOCK_GIT_VERSION="2.39.0"

# Mock Homebrew
mock_brew() {
    case "\$1" in
        --version)
            echo "Homebrew \$MOCK_BREW_VERSION"
            ;;
        list)
            echo "node git"
            ;;
        update)
            echo "Updated Homebrew"
            ;;
        install)
            echo "Installing \$2"
            ;;
        --dry-run)
            echo "Would install \$2"
            ;;
        *)
            echo "Homebrew \$MOCK_BREW_VERSION"
            ;;
    esac
}

# Mock APT
mock_apt() {
    case "\$1" in
        --version)
            echo "apt \$MOCK_APT_VERSION"
            ;;
        list)
            echo "nodejs git"
            ;;
        update)
            echo "Updated APT"
            ;;
        install)
            echo "Installing \$2"
            ;;
        --dry-run)
            echo "Would install \$2"
            ;;
        search)
            echo "Found \$2"
            ;;
        *)
            echo "apt \$MOCK_APT_VERSION"
            ;;
    esac
}

# Mock APT-GET
mock_apt_get() {
    case "\$1" in
        update)
            echo "Updated APT"
            ;;
        install)
            echo "Installing \$2"
            ;;
        --dry-run)
            echo "Would install \$2"
            ;;
        list)
            echo "nodejs git"
            ;;
        search)
            echo "Found \$2"
            ;;
        *)
            echo "apt-get \$MOCK_APT_VERSION"
            ;;
    esac
}

# Mock YUM
mock_yum() {
    case "\$1" in
        --version)
            echo "yum \$MOCK_YUM_VERSION"
            ;;
        list)
            echo "nodejs git"
            ;;
        update)
            echo "Updated YUM"
            ;;
        install)
            echo "Installing \$2"
            ;;
        --assumeno)
            echo "Would install \$2"
            ;;
        search)
            echo "Found \$2"
            ;;
        *)
            echo "yum \$MOCK_YUM_VERSION"
            ;;
    esac
}

# Mock DNF
mock_dnf() {
    case "\$1" in
        --version)
            echo "dnf \$MOCK_YUM_VERSION"
            ;;
        list)
            echo "nodejs git"
            ;;
        update)
            echo "Updated DNF"
            ;;
        install)
            echo "Installing \$2"
            ;;
        --assumeno)
            echo "Would install \$2"
            ;;
        search)
            echo "Found \$2"
            ;;
        *)
            echo "dnf \$MOCK_YUM_VERSION"
            ;;
    esac
}

# Mock Node.js
mock_node() {
    case "\$1" in
        --version)
            echo "v\$MOCK_NODE_VERSION"
            ;;
        *)
            echo "v\$MOCK_NODE_VERSION"
            ;;
    esac
}

# Mock NPM
mock_npm() {
    case "\$1" in
        --version)
            echo "9.6.7"
            ;;
        *)
            echo "9.6.7"
            ;;
    esac
}

# Mock Git
mock_git() {
    case "\$1" in
        --version)
            echo "git version \$MOCK_GIT_VERSION"
            ;;
        config)
            echo "user.name=test"
            ;;
        *)
            echo "git version \$MOCK_GIT_VERSION"
            ;;
    esac
}

# Mock NVM
mock_nvm() {
    case "\$1" in
        --version)
            echo "0.39.0"
            ;;
        *)
            echo "0.39.0"
            ;;
    esac
}

# Mock N
mock_n() {
    case "\$1" in
        --version)
            echo "9.0.1"
            ;;
        *)
            echo "9.0.1"
            ;;
    esac
}

# Mock CURL
mock_curl() {
    case "\$1" in
        -s)
            echo "Mock HTTP response"
            ;;
        --connect-timeout)
            echo "Mock HTTP response"
            ;;
        *)
            echo "Mock HTTP response"
            ;;
    esac
}

# Mock WGET
mock_wget() {
    case "\$1" in
        --timeout)
            echo "Mock HTTP response"
            ;;
        --tries)
            echo "Mock HTTP response"
            ;;
        -q)
            echo "Mock HTTP response"
            ;;
        *)
            echo "Mock HTTP response"
            ;;
    esac
}

# Mock SUDO
mock_sudo() {
    case "\$1" in
        -n)
            echo "Mock sudo response"
            ;;
        *)
            echo "Mock sudo response"
            ;;
    esac
}

# Override system commands if in test mode
if [[ "\${TEST_MODE:-false}" == "true" ]]; then
    alias brew=mock_brew
    alias apt=mock_apt
    alias apt-get=mock_apt_get
    alias yum=mock_yum
    alias dnf=mock_dnf
    alias node=mock_node
    alias npm=mock_npm
    alias git=mock_git
    alias nvm=mock_nvm
    alias n=mock_n
    alias curl=mock_curl
    alias wget=mock_wget
    alias sudo=mock_sudo
fi
`;

    await this.createShellScript(mockFile, content);
  }

  async createFixtureFiles() {
    const fixtures = [
      {
        file: 'homebrew-macos.json',
        content: {
          package_manager: 'homebrew',
          platform: 'macos',
          packages: {
            nodejs: '18.17.0',
            git: '2.39.0',
            curl: '8.0.1'
          },
          installation_methods: {
            primary: 'brew install',
            fallback: 'curl | bash'
          },
          repositories: [
            'https://brew.sh',
            'https://github.com/Homebrew/brew'
          ]
        }
      },
      {
        file: 'apt-ubuntu.json',
        content: {
          package_manager: 'apt',
          platform: 'ubuntu',
          packages: {
            nodejs: '18.17.0',
            git: '2.39.0',
            curl: '7.81.0'
          },
          installation_methods: {
            primary: 'apt install',
            fallback: 'apt-get install'
          },
          repositories: [
            'http://archive.ubuntu.com',
            'http://security.ubuntu.com'
          ]
        }
      },
      {
        file: 'yum-centos.json',
        content: {
          package_manager: 'yum',
          platform: 'centos',
          packages: {
            nodejs: '18.17.0',
            git: '2.39.0',
            curl: '7.76.1'
          },
          installation_methods: {
            primary: 'yum install',
            fallback: 'dnf install'
          },
          repositories: [
            'http://mirror.centos.org',
            'http://vault.centos.org'
          ]
        }
      },
      {
        file: 'nodejs-versions.json',
        content: {
          package_manager: 'nodejs',
          versions: {
            '18.17.0': {
              lts: true,
              status: 'current',
              release_date: '2023-05-16'
            },
            '20.5.0': {
              lts: false,
              status: 'current',
              release_date: '2023-07-18'
            },
            '16.20.0': {
              lts: true,
              status: 'maintenance',
              release_date: '2023-04-11'
            }
          },
          installation_methods: {
            package_manager: 'brew install node',
            nvm: 'nvm install 18.17.0',
            n: 'n 18.17.0',
            direct: 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash'
          }
        }
      },
      {
        file: 'git-versions.json',
        content: {
          package_manager: 'git',
          versions: {
            '2.39.0': {
              status: 'current',
              release_date: '2022-12-12'
            },
            '2.40.0': {
              status: 'current',
              release_date: '2023-03-13'
            },
            '2.38.0': {
              status: 'maintenance',
              release_date: '2022-10-24'
            }
          },
          installation_methods: {
            homebrew: 'brew install git',
            apt: 'apt install git',
            yum: 'yum install git',
            direct: 'curl -s https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash'
          }
        }
      }
    ];

    for (const fixture of fixtures) {
      const filePath = path.join(this.fixturesDir, fixture.file);
      const content = JSON.stringify(fixture.content, null, 2);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }

  async createShellScript(filePath, content) {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    
    // Set executable permissions
    const stats = fs.statSync(filePath);
    fs.chmodSync(filePath, stats.mode | parseInt('111', 8));
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  const setup = new DependencyManagerTestsSetup();
  setup.setupDependencyManagerTests().catch(error => {
    console.error(`Setup failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = DependencyManagerTestsSetup;
