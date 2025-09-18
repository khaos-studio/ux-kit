# UX-Kit CLI

A lightweight TypeScript CLI toolkit for UX research inspired by GitHub's spec-kit.

## Overview

UX-Kit provides structured research workflows through slash commands, AI agent integration, and file-based artifact management. The tool generates text files and scripts to support AI agent research workflows in IDEs.

## Installation

```bash
# Install globally
npm install -g @ux-kit/cli

# Or install locally in your project
npm install --save-dev @ux-kit/cli
```

## Quick Start

```bash
# Initialize UX-Kit in your project
uxkit init

# Create a research study
uxkit study create "User Onboarding Research"

# Generate research questions
uxkit research questions "How do users discover our product features?"

# Discover research sources
uxkit research sources --auto-discover

# Synthesize insights
uxkit research synthesize
```

## Features

- **Spec-Driven Research**: Create structured research specifications
- **AI Agent Integration**: Support for Cursor, Codex, and custom AI agents
- **File-Based Approach**: Simple text files and scripts, no complex databases
- **IDE Integration**: Slash commands for seamless workflow integration
- **Template System**: Structured templates for consistent research outputs

## Architecture

UX-Kit follows a simple layered architecture:
- **CLI Layer**: Command parsing, argument handling, and user interface
- **Service Layer**: File generation, template processing, and AI agent integration
- **Utility Layer**: File system operations, path handling, and cross-platform support

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

## License

MIT License - see [LICENSE](LICENSE) for details.
