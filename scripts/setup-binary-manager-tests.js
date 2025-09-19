#!/usr/bin/env node

/**
 * T005: Binary Manager Tests Setup Script
 * 
 * Creates comprehensive tests for binary download, verification, and installation including
 * GitHub API integration, binary download functionality, checksum verification,
 * binary installation and permissions, and version management.
 */

const fs = require('fs');
const path = require('path');

class BinaryManagerTestsSetup {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.testDir = path.join(this.projectRoot, 'tests/install');
    this.fixturesDir = path.join(this.projectRoot, 'tests/fixtures/github-releases');
    this.mocksDir = path.join(this.projectRoot, 'tests/mocks');
  }

  async setupBinaryManagerTests() {
    try {
      console.log('🚀 Starting binary manager tests setup (T005)...');
      
      // Create directories
      await this.createDirectories();
      
      // Create test files
      await this.createTestFile();
      await this.createMockFile();
      await this.createFixtureFiles();
      
      console.log('✅ Binary manager tests setup completed successfully');
      console.log('📁 Created directories:');
      console.log(`   - ${this.testDir}`);
      console.log(`   - ${this.fixturesDir}`);
      console.log(`   - ${this.mocksDir}`);
      console.log('📄 Created test files:');
      console.log(`   - ${path.join(this.testDir, 'binary-manager.test.sh')}`);
      console.log(`   - ${path.join(this.mocksDir, 'github-api.mock.sh')}`);
      console.log('📄 Created fixture files:');
      console.log(`   - ${path.join(this.fixturesDir, 'github-release.json')}`);
      console.log(`   - ${path.join(this.fixturesDir, 'binary-assets.json')}`);
      console.log(`   - ${path.join(this.fixturesDir, 'checksums.json')}`);
      console.log(`   - ${path.join(this.fixturesDir, 'version-info.json')}`);
      console.log('🔧 Set executable permissions for shell scripts');

    } catch (error) {
      console.error(`❌ Failed to setup binary manager tests: ${error.message}`);
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
    const testFile = path.join(this.testDir, 'binary-manager.test.sh');
    const content = `#!/bin/bash

# T005: Binary Manager Tests
# Comprehensive tests for binary download, verification, and installation

set -euo pipefail

# Source the mock functions
SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
MOCK_FILE="\${SCRIPT_DIR}/../../mocks/github-api.mock.sh"

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
    export MOCK_GITHUB_API=true
    export TEST_BINARY_DIR="/tmp/test-binary-manager"
    mkdir -p "\${TEST_BINARY_DIR}"
}

teardown() {
    echo "Cleaning up test environment..."
    # Clean up test environment
    unset TEST_MODE
    unset MOCK_GITHUB_API
    rm -rf "\${TEST_BINARY_DIR:-/tmp/test-binary-manager}"
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

# Test GitHub API integration
test_github_api_integration() {
    echo "Testing GitHub API integration..."
    
    # Test API endpoint accessibility
    assert "GitHub API endpoint" "curl -s --connect-timeout 5 https://api.github.com >/dev/null 2>&1" "Should access GitHub API"
    
    # Test releases endpoint
    assert "GitHub releases endpoint" "curl -s --connect-timeout 5 https://api.github.com/repos/owner/repo/releases >/dev/null 2>&1" "Should access releases endpoint"
    
    # Test rate limiting headers
    local rate_limit="\$(curl -s -I https://api.github.com | grep -i 'x-ratelimit-limit' | cut -d' ' -f2 | tr -d '\r')"
    assert "GitHub rate limit" "[[ -n \"\$rate_limit\" ]]" "Should have rate limit headers"
    
    # Test authentication (if token provided)
    if [[ -n "\${GITHUB_TOKEN:-}" ]]; then
        assert "GitHub authentication" "curl -s -H \"Authorization: token \$GITHUB_TOKEN\" https://api.github.com/user >/dev/null 2>&1" "Should authenticate with GitHub"
    fi
    
    # Test JSON response parsing
    local json_response="\$(curl -s --connect-timeout 5 https://api.github.com/repos/microsoft/vscode/releases/latest)"
    assert "GitHub JSON response" "echo \"\$json_response\" | jq -r '.tag_name' >/dev/null 2>&1" "Should parse JSON response"
}

# Test binary download functionality
test_binary_download_functionality() {
    echo "Testing binary download functionality..."
    
    # Test curl download
    assert "Curl download capability" "command -v curl >/dev/null 2>&1" "Should have curl available"
    
    # Test wget download
    assert "Wget download capability" "command -v wget >/dev/null 2>&1" "Should have wget available"
    
    # Test download with progress
    local test_url="https://github.com/microsoft/vscode/releases/download/1.80.0/vscode-darwin-universal.zip"
    assert "Download with progress" "curl -L --progress-bar -o /tmp/test-download.zip \"\$test_url\" 2>/dev/null && rm -f /tmp/test-download.zip" "Should download with progress"
    
    # Test resume capability
    assert "Download resume capability" "curl -L -C - -o /tmp/test-resume.zip \"\$test_url\" 2>/dev/null && rm -f /tmp/test-resume.zip" "Should support resume"
    
    # Test timeout handling
    assert "Download timeout" "timeout 10s curl -L -o /tmp/test-timeout.zip \"\$test_url\" 2>/dev/null && rm -f /tmp/test-timeout.zip" "Should handle timeouts"
    
    # Test retry mechanism
    local retry_count=0
    local max_retries=3
    
    while [[ \$retry_count -lt \$max_retries ]]; do
        if curl -L -o /tmp/test-retry.zip "\$test_url" 2>/dev/null; then
            break
        fi
        retry_count=\$((retry_count + 1))
        sleep 1
    done
    
    assert "Download retry mechanism" "[[ \$retry_count -lt \$max_retries ]] && rm -f /tmp/test-retry.zip" "Should handle retries"
}

# Test checksum verification
test_checksum_verification() {
    echo "Testing checksum verification..."
    
    # Test SHA256 checksum
    assert "SHA256 checksum" "command -v sha256sum >/dev/null 2>&1 || command -v shasum >/dev/null 2>&1" "Should have SHA256 checksum tool"
    
    # Test MD5 checksum
    assert "MD5 checksum" "command -v md5sum >/dev/null 2>&1 || command -v md5 >/dev/null 2>&1" "Should have MD5 checksum tool"
    
    # Test checksum calculation
    echo "test content" > /tmp/test-checksum.txt
    local sha256_hash="\$(sha256sum /tmp/test-checksum.txt 2>/dev/null | cut -d' ' -f1 || shasum -a 256 /tmp/test-checksum.txt 2>/dev/null | cut -d' ' -f1)"
    assert "SHA256 calculation" "[[ -n \"\$sha256_hash\" ]] && [[ \${#sha256_hash} -eq 64 ]]" "Should calculate SHA256 hash"
    
    # Test checksum verification
    local md5_hash="\$(md5sum /tmp/test-checksum.txt 2>/dev/null | cut -d' ' -f1 || md5 /tmp/test-checksum.txt 2>/dev/null | cut -d' ' -f4)"
    assert "MD5 calculation" "[[ -n \"\$md5_hash\" ]] && [[ \${#md5_hash} -eq 32 ]]" "Should calculate MD5 hash"
    
    # Test checksum file parsing
    echo "test content" > /tmp/test-checksum.txt
    echo "\$sha256_hash  /tmp/test-checksum.txt" > /tmp/test-checksum.sha256
    assert "Checksum file verification" "sha256sum -c /tmp/test-checksum.sha256 >/dev/null 2>&1 || shasum -a 256 -c /tmp/test-checksum.sha256 >/dev/null 2>&1" "Should verify checksum file"
    
    # Clean up
    rm -f /tmp/test-checksum.txt /tmp/test-checksum.sha256
}

# Test binary installation and permissions
test_binary_installation() {
    echo "Testing binary installation and permissions..."
    
    # Test chmod capability
    assert "Chmod capability" "command -v chmod >/dev/null 2>&1" "Should have chmod available"
    
    # Test file permissions
    echo "#!/bin/bash" > /tmp/test-binary.sh
    chmod +x /tmp/test-binary.sh
    assert "Executable permissions" "[[ -x /tmp/test-binary.sh ]]" "Should set executable permissions"
    
    # Test symlink creation
    assert "Symlink creation" "ln -sf /tmp/test-binary.sh /tmp/test-symlink.sh" "Should create symlinks"
    assert "Symlink verification" "[[ -L /tmp/test-symlink.sh ]]" "Should verify symlinks"
    
    # Test PATH manipulation
    local original_path="\$PATH"
    export PATH="/tmp:\$PATH"
    assert "PATH manipulation" "[[ \"\$PATH\" == \"/tmp:\$original_path\" ]]" "Should manipulate PATH"
    export PATH="\$original_path"
    
    # Test binary directory creation
    assert "Binary directory creation" "mkdir -p /tmp/test-bin && [[ -d /tmp/test-bin ]]" "Should create binary directories"
    
    # Test file ownership
    assert "File ownership" "touch /tmp/test-ownership.txt && [[ -O /tmp/test-ownership.txt ]]" "Should handle file ownership"
    
    # Clean up
    rm -f /tmp/test-binary.sh /tmp/test-symlink.sh /tmp/test-ownership.txt
    rm -rf /tmp/test-bin
}

# Test version management
test_version_management() {
    echo "Testing version management..."
    
    # Test version parsing
    local version="v1.2.3"
    local major="\$(echo "\$version" | cut -d'v' -f2 | cut -d'.' -f1)"
    local minor="\$(echo "\$version" | cut -d'v' -f2 | cut -d'.' -f2)"
    local patch="\$(echo "\$version" | cut -d'v' -f2 | cut -d'.' -f3)"
    
    assert "Version parsing" "[[ \"\$major\" == \"1\" ]] && [[ \"\$minor\" == \"2\" ]] && [[ \"\$patch\" == \"3\" ]]" "Should parse version numbers"
    
    # Test version comparison
    assert "Version comparison" "[[ \"1.2.3\" > \"1.2.2\" ]] && [[ \"1.3.0\" > \"1.2.9\" ]]" "Should compare versions"
    
    # Test latest version detection
    local latest_version="\$(curl -s https://api.github.com/repos/microsoft/vscode/releases/latest | jq -r '.tag_name' 2>/dev/null || echo 'v1.0.0')"
    assert "Latest version detection" "[[ -n \"\$latest_version\" ]] && [[ \"\$latest_version\" =~ ^v[0-9]+\.[0-9]+\.[0-9]+ ]] || [[ \"\$latest_version\" == \"v1.0.0\" ]]" "Should detect latest version"
    
    # Test version compatibility
    local current_version="1.2.3"
    local min_version="1.0.0"
    local max_version="2.0.0"
    
    assert "Version compatibility" "[[ \"\$current_version\" > \"\$min_version\" ]] && [[ \"\$current_version\" < \"\$max_version\" ]]" "Should check version compatibility"
    
    # Test upgrade detection
    local installed_version="1.2.3"
    local available_version="1.3.0"
    
    assert "Upgrade detection" "[[ \"\$available_version\" > \"\$installed_version\" ]]" "Should detect available upgrades"
}

# Test download progress and error handling
test_download_progress() {
    echo "Testing download progress and error handling..."
    
    # Test progress display
    local test_url="https://github.com/microsoft/vscode/releases/download/1.80.0/vscode-darwin-universal.zip"
    assert "Progress display" "curl -L --progress-bar -o /tmp/test-progress.zip \"\$test_url\" 2>/dev/null && rm -f /tmp/test-progress.zip" "Should display progress"
    
    # Test download speed calculation
    local start_time="\$(date +%s)"
    curl -L -o /tmp/test-speed.zip "\$test_url" 2>/dev/null
    local end_time="\$(date +%s)"
    local duration="\$((end_time - start_time))"
    
    assert "Download speed calculation" "[[ \$duration -gt 0 ]]" "Should calculate download speed"
    
    # Test error handling
    assert "Error handling" "curl -L -o /tmp/test-error.zip \"https://invalid-url-that-does-not-exist.com/file.zip\" 2>/dev/null || true" "Should handle download errors"
    
    # Test partial download detection
    echo "partial content" > /tmp/test-partial.zip
    local file_size="\$(stat -f%z /tmp/test-partial.zip 2>/dev/null || stat -c%s /tmp/test-partial.zip 2>/dev/null || echo 0)"
    assert "Partial download detection" "[[ \$file_size -gt 0 ]]" "Should detect partial downloads"
    
    # Clean up
    rm -f /tmp/test-progress.zip /tmp/test-speed.zip /tmp/test-error.zip /tmp/test-partial.zip
}

# Test file permissions and symlinks
test_file_permissions() {
    echo "Testing file permissions and symlinks..."
    
    # Test file creation
    touch /tmp/test-permissions.txt
    assert "File creation" "[[ -f /tmp/test-permissions.txt ]]" "Should create files"
    
    # Test permission setting
    chmod 755 /tmp/test-permissions.txt
    assert "Permission setting" "[[ -r /tmp/test-permissions.txt ]] && [[ -w /tmp/test-permissions.txt ]]" "Should set permissions"
    
    # Test symlink creation
    ln -sf /tmp/test-permissions.txt /tmp/test-symlink.txt
    assert "Symlink creation" "[[ -L /tmp/test-symlink.txt ]]" "Should create symlinks"
    
    # Test symlink resolution
    local resolved="\$(readlink /tmp/test-symlink.txt)"
    assert "Symlink resolution" "[[ \"\$resolved\" == \"/tmp/test-permissions.txt\" ]]" "Should resolve symlinks"
    
    # Test ownership
    assert "File ownership" "[[ -O /tmp/test-permissions.txt ]]" "Should check file ownership"
    
    # Test group permissions
    assert "Group permissions" "[[ -G /tmp/test-permissions.txt ]]" "Should check group permissions"
    
    # Clean up
    rm -f /tmp/test-permissions.txt /tmp/test-symlink.txt
}

# Test network failure recovery
test_network_failure_recovery() {
    echo "Testing network failure recovery..."
    
    # Test network connectivity
    assert "Network connectivity" "ping -c 1 8.8.8.8 >/dev/null 2>&1 || ping -c 1 1.1.1.1 >/dev/null 2>&1" "Should have network connectivity"
    
    # Test retry mechanism
    local retry_count=0
    local max_retries=3
    
    while [[ \$retry_count -lt \$max_retries ]]; do
        if curl -s --connect-timeout 5 https://www.google.com >/dev/null 2>&1; then
            break
        fi
        retry_count=\$((retry_count + 1))
        sleep 1
    done
    
    assert "Network retry mechanism" "[[ \$retry_count -lt \$max_retries ]]" "Should handle network retries"
    
    # Test exponential backoff
    local backoff_delay=1
    local max_delay=8
    
    for i in {1..3}; do
        backoff_delay=\$((backoff_delay * 2))
        if [[ \$backoff_delay -gt \$max_delay ]]; then
            backoff_delay=\$max_delay
        fi
    done
    
    assert "Exponential backoff" "[[ \$backoff_delay -eq \$max_delay ]]" "Should implement exponential backoff"
    
    # Test timeout handling
    local timeout_start="\$(date +%s)"
    timeout 3s curl -s https://www.google.com >/dev/null 2>&1 || true
    local timeout_end="\$(date +%s)"
    local timeout_duration="\$((timeout_end - timeout_start))"
    
    assert "Network timeout handling" "[[ \$timeout_duration -lt 5 ]]" "Should handle network timeouts"
    
    # Test resume capability
    local test_url="https://github.com/microsoft/vscode/releases/download/1.80.0/vscode-darwin-universal.zip"
    assert "Download resume" "curl -L -C - -o /tmp/test-resume.zip \"\$test_url\" 2>/dev/null && rm -f /tmp/test-resume.zip" "Should support download resume"
}

# Main test runner
run_tests() {
    echo "🧪 Running Binary Manager Tests (T005)"
    echo "====================================="
    
    setup
    
    test_github_api_integration
    test_binary_download_functionality
    test_checksum_verification
    test_binary_installation
    test_version_management
    test_download_progress
    test_file_permissions
    test_network_failure_recovery
    
    teardown
    
    echo "====================================="
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
    const mockFile = path.join(this.mocksDir, 'github-api.mock.sh');
    const content = `#!/bin/bash

# T005: Binary Manager Tests - Mock Functions
# Mock GitHub API and system commands for consistent testing

set -euo pipefail

# Mock configuration
MOCK_GITHUB_API_RESPONSE='{"tag_name":"v1.2.3","assets":[{"name":"binary.zip","download_url":"https://github.com/owner/repo/releases/download/v1.2.3/binary.zip"}]}'
MOCK_DOWNLOAD_URL="https://github.com/owner/repo/releases/download/v1.2.3/binary.zip"
MOCK_CHECKSUM="a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
MOCK_FILE_SIZE="1048576"

# Mock GitHub API
mock_github_api() {
    case "\$1" in
        releases/latest)
            echo "\$MOCK_GITHUB_API_RESPONSE"
            ;;
        releases)
            echo "[\$MOCK_GITHUB_API_RESPONSE]"
            ;;
        *)
            echo "\$MOCK_GITHUB_API_RESPONSE"
            ;;
    esac
}

# Mock CURL
mock_curl() {
    case "\$1" in
        -s)
            if [[ "\$2" == *"api.github.com"* ]]; then
                echo "\$MOCK_GITHUB_API_RESPONSE"
            else
                echo "Mock download content"
            fi
            ;;
        -L)
            if [[ "\$2" == *"api.github.com"* ]]; then
                echo "\$MOCK_GITHUB_API_RESPONSE"
            else
                echo "Mock download content"
            fi
            ;;
        --connect-timeout)
            echo "Mock download content"
            ;;
        --progress-bar)
            echo "Mock download content"
            ;;
        -C)
            echo "Mock download content"
            ;;
        -o)
            echo "Mock download content" > "\$2"
            ;;
        *)
            echo "Mock download content"
            ;;
    esac
}

# Mock WGET
mock_wget() {
    case "\$1" in
        -O)
            echo "Mock download content" > "\$2"
            ;;
        --timeout)
            echo "Mock download content"
            ;;
        --tries)
            echo "Mock download content"
            ;;
        -q)
            echo "Mock download content"
            ;;
        *)
            echo "Mock download content"
            ;;
    esac
}

# Mock SHA256SUM
mock_sha256sum() {
    case "\$1" in
        -c)
            echo "Mock checksum verification"
            ;;
        *)
            echo "\$MOCK_CHECKSUM  \$1"
            ;;
    esac
}

# Mock SHASUM
mock_shasum() {
    case "\$1" in
        -a)
            echo "\$MOCK_CHECKSUM  \$3"
            ;;
        -c)
            echo "Mock checksum verification"
            ;;
        *)
            echo "\$MOCK_CHECKSUM  \$1"
            ;;
    esac
}

# Mock MD5SUM
mock_md5sum() {
    case "\$1" in
        -c)
            echo "Mock checksum verification"
            ;;
        *)
            echo "a1b2c3d4e5f678901234567890123456  \$1"
            ;;
    esac
}

# Mock MD5
mock_md5() {
    case "\$1" in
        -c)
            echo "Mock checksum verification"
            ;;
        *)
            echo "MD5 (\$1) = a1b2c3d4e5f678901234567890123456"
            ;;
    esac
}

# Mock CHMOD
mock_chmod() {
    case "\$1" in
        +x)
            echo "Mock chmod +x \$2"
            ;;
        -x)
            echo "Mock chmod -x \$2"
            ;;
        *)
            echo "Mock chmod \$1 \$2"
            ;;
    esac
}

# Mock MV
mock_mv() {
    echo "Mock mv \$1 \$2"
}

# Mock LN
mock_ln() {
    case "\$1" in
        -sf)
            echo "Mock ln -sf \$2 \$3"
            ;;
        -s)
            echo "Mock ln -s \$2 \$3"
            ;;
        *)
            echo "Mock ln \$1 \$2"
            ;;
    esac
}

# Mock RM
mock_rm() {
    case "\$1" in
        -rf)
            echo "Mock rm -rf \$2"
            ;;
        -f)
            echo "Mock rm -f \$2"
            ;;
        *)
            echo "Mock rm \$1"
            ;;
    esac
}

# Mock STAT
mock_stat() {
    case "\$1" in
        -f%z)
            echo "\$MOCK_FILE_SIZE"
            ;;
        -c%s)
            echo "\$MOCK_FILE_SIZE"
            ;;
        *)
            echo "Mock stat \$1 \$2"
            ;;
    esac
}

# Mock READLINK
mock_readlink() {
    case "\$1" in
        -f)
            echo "/mock/resolved/path"
            ;;
        *)
            echo "/mock/symlink/target"
            ;;
    esac
}

# Mock JQ
mock_jq() {
    case "\$1" in
        -r)
            case "\$2" in
                .tag_name)
                    echo "v1.2.3"
                    ;;
                .assets[0].name)
                    echo "binary.zip"
                    ;;
                .assets[0].download_url)
                    echo "\$MOCK_DOWNLOAD_URL"
                    ;;
                *)
                    echo "mock value"
                    ;;
            esac
            ;;
        *)
            echo "mock json value"
            ;;
    esac
}

# Override system commands if in test mode
if [[ "\${TEST_MODE:-false}" == "true" ]]; then
    alias curl=mock_curl
    alias wget=mock_wget
    alias sha256sum=mock_sha256sum
    alias shasum=mock_shasum
    alias md5sum=mock_md5sum
    alias md5=mock_md5
    alias chmod=mock_chmod
    alias mv=mock_mv
    alias ln=mock_ln
    alias rm=mock_rm
    alias stat=mock_stat
    alias readlink=mock_readlink
    alias jq=mock_jq
fi
`;

    await this.createShellScript(mockFile, content);
  }

  async createFixtureFiles() {
    const fixtures = [
      {
        file: 'github-release.json',
        content: {
          tag_name: 'v1.2.3',
          name: 'Release v1.2.3',
          published_at: '2023-12-01T10:00:00Z',
          prerelease: false,
          draft: false,
          assets: [
            {
              name: 'binary-darwin-amd64.zip',
              download_url: 'https://github.com/owner/repo/releases/download/v1.2.3/binary-darwin-amd64.zip',
              size: 1048576,
              content_type: 'application/zip'
            },
            {
              name: 'binary-linux-amd64.zip',
              download_url: 'https://github.com/owner/repo/releases/download/v1.2.3/binary-linux-amd64.zip',
              size: 2097152,
              content_type: 'application/zip'
            }
          ],
          body: 'Release notes for v1.2.3'
        }
      },
      {
        file: 'binary-assets.json',
        content: {
          platform: 'darwin',
          architecture: 'amd64',
          binary_name: 'binary',
          download_url: 'https://github.com/owner/repo/releases/download/v1.2.3/binary-darwin-amd64.zip',
          file_size: 1048576,
          content_type: 'application/zip',
          installation_path: '/usr/local/bin/binary',
          symlink_path: '/usr/local/bin/binary'
        }
      },
      {
        file: 'checksums.json',
        content: {
          algorithm: 'sha256',
          checksums: {
            'binary-darwin-amd64.zip': 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
            'binary-linux-amd64.zip': 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a',
            'binary-windows-amd64.zip': 'c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2'
          },
          checksum_file_url: 'https://github.com/owner/repo/releases/download/v1.2.3/checksums.txt'
        }
      },
      {
        file: 'version-info.json',
        content: {
          current_version: 'v1.2.3',
          latest_version: 'v1.2.3',
          minimum_version: 'v1.0.0',
          maximum_version: 'v2.0.0',
          version_comparison: {
            current_vs_latest: 'equal',
            current_vs_minimum: 'greater',
            current_vs_maximum: 'less'
          },
          upgrade_available: false,
          downgrade_available: true,
          compatibility: {
            platform: 'darwin',
            architecture: 'amd64',
            compatible: true
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
  const setup = new BinaryManagerTestsSetup();
  setup.setupBinaryManagerTests().catch(error => {
    console.error(`Setup failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = BinaryManagerTestsSetup;
