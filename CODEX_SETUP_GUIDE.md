# Codex AI Agent Setup Guide

This guide will help you set up and configure Codex AI agent integration with UX-Kit for enhanced research capabilities.

## Prerequisites

Before setting up Codex integration, ensure you have:

- Node.js 16+ installed
- UX-Kit CLI installed and working
- Codex CLI installed (see installation steps below)

## Step 1: Install Codex CLI

### Option A: Install via npm (Recommended)

```bash
# Install Codex CLI globally
npm install -g @codex/cli

# Verify installation
codex --version
```

### Option B: Install via package manager

```bash
# macOS with Homebrew
brew install codex-cli

# Linux with apt
sudo apt install codex-cli

# Windows with Chocolatey
choco install codex-cli
```

## Step 2: Initialize UX-Kit with Codex Support

```bash
# Initialize UX-Kit with Codex integration
uxkit init --codex

# Or initialize with multiple AI agents
uxkit init --codex --cursor --custom
```

This command will:
- Set up the UX-Kit directory structure
- Configure Codex integration
- Create necessary configuration files
- Validate the Codex CLI installation

## Step 3: Validate Installation

```bash
# Validate Codex CLI installation and configuration
uxkit codex-setup --validate
```

Expected output:
```
✅ Codex CLI validation successful
✅ Codex CLI version: 1.0.0
✅ Configuration file found
✅ API endpoint accessible
```

## Step 4: Configure Codex Settings

```bash
# Configure Codex settings interactively
uxkit codex-setup --configure
```

This will prompt you for:
- **API Endpoint**: Codex API endpoint URL (default: https://api.codex.com/v1)
- **API Key**: Your Codex API authentication key
- **Timeout**: Request timeout in milliseconds (default: 30000)
- **Retry Attempts**: Number of retry attempts for failed requests (default: 3)

### Manual Configuration

You can also manually edit the configuration file at `.uxkit/codex-config.json`:

```json
{
  "apiEndpoint": "https://api.codex.com/v1",
  "apiKey": "your-api-key-here",
  "timeout": 30000,
  "retryAttempts": 3,
  "enableLogging": true,
  "logLevel": "info"
}
```

## Step 5: Test Integration

```bash
# Test Codex integration with sample request
uxkit codex-setup --test
```

Expected output:
```
🧪 Testing Codex integration...
✅ Codex API connection successful
✅ Sample request completed in 1.2s
✅ Integration test passed
```

## Step 6: Use Codex in Research Workflows

Once configured, you can use Codex for enhanced research capabilities:

```bash
# Generate research questions with Codex
uxkit research:questions --study <study-id> --codex

# Synthesize research with Codex
uxkit research:synthesize --study <study-id> --codex

# Process interviews with Codex
uxkit research:interview --study <study-id> --transcript "transcript text" --codex
```

## Configuration Options

### API Settings

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| `apiEndpoint` | Codex API endpoint URL | `https://api.codex.com/v1` | Yes |
| `apiKey` | API authentication key | - | Yes |
| `timeout` | Request timeout (ms) | `30000` | No |
| `retryAttempts` | Retry attempts for failures | `3` | No |

### Performance Settings

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| `enableLogging` | Enable request logging | `true` | No |
| `logLevel` | Logging level (debug, info, warn, error) | `info` | No |
| `enableMetrics` | Enable performance metrics | `true` | No |

### Advanced Settings

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| `concurrentRequests` | Max concurrent requests | `5` | No |
| `rateLimitDelay` | Delay between requests (ms) | `100` | No |
| `enableCaching` | Enable response caching | `false` | No |

## Environment Variables

You can also configure Codex using environment variables:

```bash
# Set environment variables
export CODEX_API_ENDPOINT="https://api.codex.com/v1"
export CODEX_API_KEY="your-api-key-here"
export CODEX_TIMEOUT="30000"
export CODEX_RETRY_ATTEMPTS="3"
```

## Verification Commands

Use these commands to verify your setup:

```bash
# Check Codex CLI version
codex --version

# Validate UX-Kit Codex integration
uxkit codex-setup --validate

# Test Codex integration
uxkit codex-setup --test

# Show Codex configuration
uxkit codex-setup --show-config

# Show help for Codex commands
uxkit codex-setup --help
```

## Next Steps

After successful setup:

1. **Create your first study**: `uxkit study:create --name "My Research Study"`
2. **Generate questions**: `uxkit research:questions --study <study-id> --codex`
3. **Collect sources**: `uxkit research:sources --study <study-id>`
4. **Synthesize insights**: `uxkit research:synthesize --study <study-id> --codex`

## Support

If you encounter issues during setup:

1. Check the [Troubleshooting Guide](CODEX_TROUBLESHOOTING_GUIDE.md)
2. Run `uxkit codex-setup --validate` to diagnose issues
3. Check the logs in `.uxkit/logs/codex.log`
4. Contact support with error details

## Security Notes

- Keep your API key secure and never commit it to version control
- Use environment variables for sensitive configuration
- Regularly rotate your API keys
- Monitor your API usage and rate limits
