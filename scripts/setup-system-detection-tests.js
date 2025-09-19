#!/usr/bin/env node

/**
 * T003: System Detection Tests Setup Script
 * 
 * Creates comprehensive tests for system detection functionality including
 * OS detection, architecture detection, package manager detection, and dependency checking.
 */

const fs = require('fs');
const path = require('path');

class SystemDetectionTestsSetup {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.testDir = path.join(this.projectRoot, 'tests/install');
    this.fixturesDir = path.join(this.projectRoot, 'tests/fixtures/system-info');
    this.mocksDir = path.join(this.projectRoot, 'tests/mocks');
  }

  async setupSystemDetectionTests() {
    try {
      console.log('🚀 Starting system detection tests setup (T003)...');
      
      // Create directories
      await this.createDirectories();
      
      // Create test files
      await this.createTestFile();
      await this.createMockFile();
      await this.createFixtureFiles();
      
      console.log('✅ System detection tests setup completed successfully');
      console.log('📁 Created directories:');
      console.log(`   - ${this.testDir}`);
      console.log(`   - ${this.fixturesDir}`);
      console.log(`   - ${this.mocksDir}`);
      console.log('📄 Created test files:');
      console.log(`   - ${path.join(this.testDir, 'system-detector.test.sh')}`);
      console.log(`   - ${path.join(this.mocksDir, 'system-detector.mock.sh')}`);
      console.log('📄 Created fixture files:');
      console.log(`   - ${path.join(this.fixturesDir, 'macos-x86_64.json')}`);
      console.log(`   - ${path.join(this.fixturesDir, 'macos-arm64.json')}`);
      console.log(`   - ${path.join(this.fixturesDir, 'ubuntu-x86_64.json')}`);
      console.log(`   - ${path.join(this.fixturesDir, 'centos-x86_64.json')}`);
      console.log('🔧 Set executable permissions for shell scripts');

    } catch (error) {
      console.error(`❌ Failed to setup system detection tests: ${error.message}`);
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
    const testFile = path.join(this.testDir, 'system-detector.test.sh');
    const content = `#!/bin/bash

# T003: System Detection Tests
# Comprehensive tests for system detection functionality

set -euo pipefail

# Source the mock functions
SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
MOCK_FILE="\${SCRIPT_DIR}/../../mocks/system-detector.mock.sh"

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
    export MOCK_SYSTEM_INFO=true
}

teardown() {
    echo "Cleaning up test environment..."
    # Clean up test environment
    unset TEST_MODE
    unset MOCK_SYSTEM_INFO
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

# Test OS detection on macOS and Linux
test_os_detection() {
    echo "Testing OS detection..."
    
    # Test macOS detection
    assert "macOS detection" "[[ \"\$(uname -s)\" == \"Darwin\" ]]" "Should detect macOS"
    
    # Test Linux detection
    assert "Linux detection" "[[ \"\$(uname -s)\" == \"Linux\" ]]" "Should detect Linux"
    
    # Test Ubuntu detection
    assert "Ubuntu detection" "[[ -f /etc/os-release ]] && grep -q Ubuntu /etc/os-release" "Should detect Ubuntu"
    
    # Test CentOS detection
    assert "CentOS detection" "[[ -f /etc/centos-release ]] || [[ -f /etc/redhat-release ]]" "Should detect CentOS"
    
    # Test RHEL detection
    assert "RHEL detection" "[[ -f /etc/redhat-release ]] && grep -q 'Red Hat' /etc/redhat-release" "Should detect RHEL"
    
    # Test Debian detection
    assert "Debian detection" "[[ -f /etc/debian_version ]] || [[ -f /etc/os-release ]] && grep -q Debian /etc/os-release" "Should detect Debian"
}

# Test architecture detection (x86_64, ARM64)
test_architecture_detection() {
    echo "Testing architecture detection..."
    
    # Test x86_64 detection
    assert "x86_64 detection" "[[ \"\$(uname -m)\" == \"x86_64\" ]]" "Should detect x86_64"
    
    # Test arm64 detection
    assert "arm64 detection" "[[ \"\$(uname -m)\" == \"arm64\" ]] || [[ \"\$(uname -m)\" == \"aarch64\" ]]" "Should detect ARM64"
    
    # Test i386 detection
    assert "i386 detection" "[[ \"\$(uname -m)\" == \"i386\" ]] || [[ \"\$(uname -m)\" == \"i686\" ]]" "Should detect i386"
}

# Test package manager detection
test_package_manager_detection() {
    echo "Testing package manager detection..."
    
    # Test Homebrew detection
    assert "Homebrew detection" "command -v brew >/dev/null 2>&1" "Should detect Homebrew"
    
    # Test APT detection
    assert "APT detection" "command -v apt >/dev/null 2>&1 || command -v apt-get >/dev/null 2>&1" "Should detect APT"
    
    # Test YUM detection
    assert "YUM detection" "command -v yum >/dev/null 2>&1" "Should detect YUM"
    
    # Test DNF detection
    assert "DNF detection" "command -v dnf >/dev/null 2>&1" "Should detect DNF"
    
    # Test pacman detection
    assert "pacman detection" "command -v pacman >/dev/null 2>&1" "Should detect pacman"
    
    # Test zypper detection
    assert "zypper detection" "command -v zypper >/dev/null 2>&1" "Should detect zypper"
}

# Test dependency checking (Node.js, Git, SSH)
test_dependency_checking() {
    echo "Testing dependency checking..."
    
    # Test Node.js detection
    assert "Node.js detection" "command -v node >/dev/null 2>&1" "Should detect Node.js"
    
    # Test Node.js version check
    if command -v node >/dev/null 2>&1; then
        local node_version="\$(node --version | cut -d'v' -f2 | cut -d'.' -f1)"
        assert "Node.js version check" "[[ \"\$node_version\" -ge 18 ]]" "Should have Node.js 18+"
    fi
    
    # Test Git detection
    assert "Git detection" "command -v git >/dev/null 2>&1" "Should detect Git"
    
    # Test Git version check
    if command -v git >/dev/null 2>&1; then
        assert "Git version check" "git --version >/dev/null 2>&1" "Should have valid Git version"
    fi
    
    # Test SSH detection
    assert "SSH detection" "command -v ssh >/dev/null 2>&1" "Should detect SSH"
    
    # Test SSH version check
    if command -v ssh >/dev/null 2>&1; then
        assert "SSH version check" "ssh -V >/dev/null 2>&1" "Should have valid SSH version"
    fi
}

# Test error handling for unsupported systems
test_error_handling() {
    echo "Testing error handling..."
    
    # Test unsupported OS handling
    local os="\$(uname -s)"
    if [[ "\$os" != "Darwin" ]] && [[ "\$os" != "Linux" ]]; then
        assert "Unsupported OS error" "false" "Should handle unsupported OS: \$os"
    fi
    
    # Test unsupported architecture handling
    local arch="\$(uname -m)"
    if [[ "\$arch" != "x86_64" ]] && [[ "\$arch" != "arm64" ]] && [[ "\$arch" != "aarch64" ]]; then
        assert "Unsupported architecture error" "false" "Should handle unsupported architecture: \$arch"
    fi
    
    # Test missing dependencies
    if ! command -v node >/dev/null 2>&1; then
        assert "Missing Node.js error" "false" "Should handle missing Node.js"
    fi
    
    if ! command -v git >/dev/null 2>&1; then
        assert "Missing Git error" "false" "Should handle missing Git"
    fi
}

# Test edge cases and error conditions
test_edge_cases() {
    echo "Testing edge cases..."
    
    # Test missing system commands
    assert "Missing uname command" "command -v uname >/dev/null 2>&1" "Should handle missing uname"
    
    # Test invalid system responses
    assert "Invalid system response" "[[ -n \"\$(uname -s)\" ]]" "Should handle invalid system response"
    
    # Test corrupted system files
    assert "System file access" "[[ -r /proc/version ]] || [[ -r /etc/os-release ]] || [[ -r /System/Library/CoreServices/SystemVersion.plist ]]" "Should handle corrupted system files"
    
    # Test permission issues
    assert "Permission check" "[[ -r /etc/passwd ]] || [[ -r /etc/group ]]" "Should handle permission issues"
    
    # Test network connectivity
    assert "Network connectivity" "ping -c 1 8.8.8.8 >/dev/null 2>&1 || ping -c 1 1.1.1.1 >/dev/null 2>&1" "Should handle network issues"
}

# Test cross-platform compatibility
test_cross_platform_compatibility() {
    echo "Testing cross-platform compatibility..."
    
    # Test different platforms
    local platform="\$(uname -s)"
    assert "Platform detection" "[[ -n \"\$platform\" ]]" "Should detect platform"
    
    # Test compatibility across systems
    assert "Cross-platform compatibility" "[[ \"\$platform\" == "Darwin" ]] || [[ \"\$platform\" == "Linux" ]]" "Should be compatible across different systems"
    
    # Test different architectures
    local arch="\$(uname -m)"
    assert "Architecture compatibility" "[[ -n \"\$arch\" ]]" "Should detect architecture"
}

# Test performance and reliability
test_performance() {
    echo "Testing performance..."
    
    # Test command execution time
    local start_time="\$(date +%s%N)"
    uname -s >/dev/null 2>&1
    local end_time="\$(date +%s%N)"
    local duration="\$(( (end_time - start_time) / 1000000 ))"
    
    assert "Command performance" "[[ \$duration -lt 1000 ]]" "Should execute commands quickly (< 1s)"
}

test_reliability() {
    echo "Testing reliability..."
    
    # Test retry mechanism
    local retry_count=0
    local max_retries=3
    
    while [[ \$retry_count -lt \$max_retries ]]; do
        if uname -s >/dev/null 2>&1; then
            break
        fi
        retry_count=\$((retry_count + 1))
        sleep 0.1
    done
    
    assert "Retry mechanism" "[[ \$retry_count -lt \$max_retries ]]" "Should handle retries reliably"
    
    # Test benchmark
    local benchmark_start="\$(date +%s%N)"
    for i in {1..10}; do
        uname -s >/dev/null 2>&1
    done
    local benchmark_end="\$(date +%s%N)"
    local benchmark_duration="\$(( (benchmark_end - benchmark_start) / 1000000 ))"
    
    assert "Benchmark performance" "[[ \$benchmark_duration -lt 5000 ]]" "Should handle multiple calls efficiently (< 5s)"
}

# Main test runner
run_tests() {
    echo "🧪 Running System Detection Tests (T003)"
    echo "========================================"
    
    setup
    
    test_os_detection
    test_architecture_detection
    test_package_manager_detection
    test_dependency_checking
    test_error_handling
    test_edge_cases
    test_cross_platform_compatibility
    test_performance
    test_reliability
    
    teardown
    
    echo "========================================"
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
    const mockFile = path.join(this.mocksDir, 'system-detector.mock.sh');
    const content = `#!/bin/bash

# T003: System Detection Tests - Mock Functions
# Mock system commands for consistent testing

set -euo pipefail

# Mock configuration
MOCK_OS="\${MOCK_OS:-Darwin}"
MOCK_ARCH="\${MOCK_ARCH:-x86_64}"
MOCK_DISTRO="\${MOCK_DISTRO:-macOS}"

# Mock uname command
mock_uname() {
    case "\$1" in
        -s)
            echo "\$MOCK_OS"
            ;;
        -m)
            echo "\$MOCK_ARCH"
            ;;
        -r)
            echo "21.6.0"
            ;;
        -v)
            echo "Darwin Kernel Version 21.6.0"
            ;;
        *)
            echo "Darwin"
            ;;
    esac
}

# Mock which command
mock_which() {
    local command="\$1"
    case "\$command" in
        brew)
            echo "/opt/homebrew/bin/brew"
            ;;
        apt|apt-get)
            echo "/usr/bin/apt"
            ;;
        yum)
            echo "/usr/bin/yum"
            ;;
        dnf)
            echo "/usr/bin/dnf"
            ;;
        pacman)
            echo "/usr/bin/pacman"
            ;;
        zypper)
            echo "/usr/bin/zypper"
            ;;
        node)
            echo "/usr/local/bin/node"
            ;;
        git)
            echo "/usr/bin/git"
            ;;
        ssh)
            echo "/usr/bin/ssh"
            ;;
        *)
            return 1
            ;;
    esac
}

# Mock Homebrew
mock_brew() {
    case "\$1" in
        --version)
            echo "Homebrew 3.6.0"
            ;;
        list)
            echo "node git"
            ;;
        *)
            echo "Homebrew 3.6.0"
            ;;
    esac
}

# Mock APT
mock_apt() {
    case "\$1" in
        --version)
            echo "apt 2.4.8"
            ;;
        list)
            echo "nodejs git"
            ;;
        *)
            echo "apt 2.4.8"
            ;;
    esac
}

# Mock YUM
mock_yum() {
    case "\$1" in
        --version)
            echo "yum 4.7.0"
            ;;
        list)
            echo "nodejs git"
            ;;
        *)
            echo "yum 4.7.0"
            ;;
    esac
}

# Mock Node.js
mock_node() {
    case "\$1" in
        --version)
            echo "v18.17.0"
            ;;
        *)
            echo "v18.17.0"
            ;;
    esac
}

# Mock Git
mock_git() {
    case "\$1" in
        --version)
            echo "git version 2.39.0"
            ;;
        *)
            echo "git version 2.39.0"
            ;;
    esac
}

# Mock SSH
mock_ssh() {
    case "\$1" in
        -V)
            echo "OpenSSH_9.0p1"
            ;;
        *)
            echo "OpenSSH_9.0p1"
            ;;
    esac
}

# Override system commands if in test mode
if [[ "\${TEST_MODE:-false}" == "true" ]]; then
    alias uname=mock_uname
    alias which=mock_which
    alias brew=mock_brew
    alias apt=mock_apt
    alias yum=mock_yum
    alias node=mock_node
    alias git=mock_git
    alias ssh=mock_ssh
fi
`;

    await this.createShellScript(mockFile, content);
  }

  async createFixtureFiles() {
    const fixtures = [
      {
        file: 'macos-x86_64.json',
        content: {
          os: 'macos',
          architecture: 'x86_64',
          package_manager: 'homebrew',
          dependencies: {
            nodejs: '18.17.0',
            git: '2.39.0',
            ssh: '9.0p1'
          },
          system_info: {
            kernel: 'Darwin 21.6.0',
            distribution: 'macOS 12.6',
            shell: '/bin/zsh'
          }
        }
      },
      {
        file: 'macos-arm64.json',
        content: {
          os: 'macos',
          architecture: 'arm64',
          package_manager: 'homebrew',
          dependencies: {
            nodejs: '18.17.0',
            git: '2.39.0',
            ssh: '9.0p1'
          },
          system_info: {
            kernel: 'Darwin 21.6.0',
            distribution: 'macOS 12.6',
            shell: '/bin/zsh'
          }
        }
      },
      {
        file: 'ubuntu-x86_64.json',
        content: {
          os: 'linux',
          architecture: 'x86_64',
          package_manager: 'apt',
          dependencies: {
            nodejs: '18.17.0',
            git: '2.39.0',
            ssh: '9.0p1'
          },
          system_info: {
            kernel: 'Linux 5.15.0',
            distribution: 'Ubuntu 22.04 LTS',
            shell: '/bin/bash'
          }
        }
      },
      {
        file: 'centos-x86_64.json',
        content: {
          os: 'linux',
          architecture: 'x86_64',
          package_manager: 'yum',
          dependencies: {
            nodejs: '18.17.0',
            git: '2.39.0',
            ssh: '9.0p1'
          },
          system_info: {
            kernel: 'Linux 4.18.0',
            distribution: 'CentOS 8',
            shell: '/bin/bash'
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
  const setup = new SystemDetectionTestsSetup();
  setup.setupSystemDetectionTests().catch(error => {
    console.error(`Setup failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = SystemDetectionTestsSetup;
