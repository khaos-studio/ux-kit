# Codex AI Agent Troubleshooting Guide

This guide helps you diagnose and resolve common issues with Codex AI agent integration in UX-Kit.

## Quick Diagnostics

Run these commands to quickly diagnose issues:

```bash
# Check Codex CLI installation
codex --version

# Validate UX-Kit Codex integration
uxkit codex-setup --validate

# Test Codex integration
uxkit codex-setup --test

# Show current configuration
uxkit codex-setup --show-config
```

## Common Issues and Solutions

### 1. Codex CLI Not Found

**Symptoms:**
- `Command not found: codex`
- `codex: command not found`
- `'codex' is not recognized as an internal or external command`

**Solutions:**

#### Install Codex CLI
```bash
# Install via npm (recommended)
npm install -g @codex/cli

# Verify installation
codex --version
```

#### Add to PATH
```bash
# Find Codex installation path
npm list -g @codex/cli

# Add to PATH (Linux/macOS)
export PATH="$PATH:/path/to/codex/bin"

# Add to PATH (Windows)
set PATH=%PATH%;C:\path\to\codex\bin
```

#### Verify Installation
```bash
# Check if Codex is in PATH
which codex  # Linux/macOS
where codex  # Windows

# Test Codex CLI
codex --help
```

### 2. Authentication Failed

**Symptoms:**
- `401 Unauthorized`
- `Invalid API key`
- `Authentication failed`
- `API key not found`

**Solutions:**

#### Verify API Key
```bash
# Check configuration
uxkit codex-setup --show-config

# Reconfigure API key
uxkit codex-setup --configure
```

#### Check API Key Format
- Ensure API key is correct and not expired
- Verify no extra spaces or characters
- Check if API key has required permissions

#### Regenerate API Key
1. Log into your Codex account
2. Navigate to API settings
3. Generate a new API key
4. Update configuration: `uxkit codex-setup --configure`

### 3. Connection Timeout

**Symptoms:**
- `Request timeout`
- `Connection timeout`
- `Network error`
- `ECONNRESET`

**Solutions:**

#### Check Internet Connection
```bash
# Test basic connectivity
ping api.codex.com

# Test HTTPS connectivity
curl -I https://api.codex.com/v1
```

#### Increase Timeout
```bash
# Update configuration with longer timeout
uxkit codex-setup --configure
# Set timeout to 60000 (60 seconds)
```

#### Check Firewall/Proxy
- Ensure firewall allows HTTPS connections to `api.codex.com`
- Configure proxy settings if behind corporate firewall
- Check if antivirus is blocking connections

### 4. Rate Limit Exceeded

**Symptoms:**
- `429 Too Many Requests`
- `Rate limit exceeded`
- `Quota exceeded`

**Solutions:**

#### Wait and Retry
```bash
# Wait a few minutes before retrying
# The system will automatically retry with exponential backoff
```

#### Check Rate Limits
```bash
# Check current usage
codex usage

# View rate limit information
codex limits
```

#### Optimize Requests
- Reduce concurrent requests
- Implement request batching
- Use caching when possible

### 5. Invalid Configuration

**Symptoms:**
- `Configuration error`
- `Invalid configuration file`
- `Missing required settings`

**Solutions:**

#### Reset Configuration
```bash
# Remove existing configuration
rm .uxkit/codex-config.json

# Reconfigure from scratch
uxkit codex-setup --configure
```

#### Validate Configuration
```bash
# Check configuration syntax
cat .uxkit/codex-config.json | jq .

# Validate configuration
uxkit codex-setup --validate
```

### 6. Permission Denied

**Symptoms:**
- `Permission denied`
- `Access forbidden`
- `Insufficient permissions`

**Solutions:**

#### Check File Permissions
```bash
# Check configuration file permissions
ls -la .uxkit/codex-config.json

# Fix permissions if needed
chmod 600 .uxkit/codex-config.json
```

#### Check API Key Permissions
- Verify API key has required scopes
- Check if API key is for correct environment (dev/prod)
- Ensure account has active subscription

### 7. Service Unavailable

**Symptoms:**
- `503 Service Unavailable`
- `Service temporarily unavailable`
- `Maintenance mode`

**Solutions:**

#### Check Service Status
```bash
# Check Codex service status
curl -I https://status.codex.com

# Check API endpoint
curl -I https://api.codex.com/v1/health
```

#### Wait and Retry
- Service may be temporarily down
- Check Codex status page for updates
- Retry after a few minutes

## Diagnostic Commands

### System Information
```bash
# Check system information
uname -a  # Linux/macOS
systeminfo  # Windows

# Check Node.js version
node --version

# Check npm version
npm --version
```

### Network Diagnostics
```bash
# Test DNS resolution
nslookup api.codex.com

# Test connectivity
telnet api.codex.com 443

# Check routing
traceroute api.codex.com  # Linux/macOS
tracert api.codex.com     # Windows
```

### Log Analysis
```bash
# Check UX-Kit logs
tail -f .uxkit/logs/uxkit.log

# Check Codex integration logs
tail -f .uxkit/logs/codex.log

# Check system logs
tail -f /var/log/syslog  # Linux
tail -f /var/log/system.log  # macOS
```

## Advanced Troubleshooting

### Enable Debug Mode
```bash
# Enable debug logging
export UXKIT_DEBUG=true
export CODEX_DEBUG=true

# Run with verbose output
uxkit codex-setup --validate --verbose
```

### Reset Everything
```bash
# Remove all UX-Kit configuration
rm -rf .uxkit/

# Remove Codex CLI
npm uninstall -g @codex/cli

# Reinstall and reconfigure
npm install -g @codex/cli
uxkit init --codex
```

### Check Dependencies
```bash
# Check installed packages
npm list -g

# Update packages
npm update -g @codex/cli
npm update -g @ux-kit/cli
```

## Error Codes Reference

| Error Code | Description | Solution |
|------------|-------------|----------|
| `CODEX_CLI_NOT_FOUND` | Codex CLI not installed | Install Codex CLI |
| `AUTHENTICATION_FAILED` | Invalid API key | Check and update API key |
| `CONNECTION_TIMEOUT` | Network timeout | Check connection, increase timeout |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait and retry, check limits |
| `INVALID_CONFIGURATION` | Configuration error | Reset and reconfigure |
| `PERMISSION_DENIED` | Access denied | Check permissions and API key |
| `SERVICE_UNAVAILABLE` | Service down | Check status, wait and retry |

## Getting Help

If you're still experiencing issues:

1. **Check the logs**: Look at `.uxkit/logs/codex.log` for detailed error information
2. **Run diagnostics**: Use `uxkit codex-setup --validate` to get detailed status
3. **Collect information**: Gather system info, error messages, and configuration
4. **Contact support**: Provide error details, logs, and system information

### Information to Include

When reporting issues, include:

- Operating system and version
- Node.js version
- UX-Kit version
- Codex CLI version
- Error messages (full text)
- Configuration (with sensitive data redacted)
- Log files (last 50 lines)
- Steps to reproduce the issue

### Support Channels

- **GitHub Issues**: [UX-Kit GitHub Repository](https://github.com/khaos-studio/ux-kit/issues)
- **Documentation**: [UX-Kit Documentation](https://docs.ux-kit.dev)
- **Community**: [UX-Kit Discord](https://discord.gg/ux-kit)

## Prevention Tips

To avoid common issues:

1. **Keep software updated**: Regularly update UX-Kit and Codex CLI
2. **Monitor API usage**: Check rate limits and quotas regularly
3. **Backup configuration**: Keep copies of working configurations
4. **Test regularly**: Run `uxkit codex-setup --test` periodically
5. **Monitor logs**: Check logs for warnings and errors
6. **Use environment variables**: For sensitive configuration data
