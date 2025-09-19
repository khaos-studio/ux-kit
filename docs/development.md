# Development Guide

Complete guide for contributing to UX-Kit CLI development.

## Getting Started

### Prerequisites

- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org)
- **npm** - Comes with Node.js
- **Git** - [Download from git-scm.com](https://git-scm.com)
- **TypeScript** - Installed as dev dependency

### Development Setup

```bash
# Clone the repository
git clone https://github.com/khaos-studio/ux-kit.git
cd ux-kit

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

### Project Structure

```
ux-kit/
├── src/                    # TypeScript source code
│   ├── cli/               # CLI application layer
│   ├── commands/          # Command implementations
│   ├── services/          # Business logic services
│   ├── contracts/         # Type definitions and interfaces
│   ├── utils/             # Utility functions
│   ├── templates/         # Handlebars templates
│   └── index.ts           # Main entry point
├── tests/                 # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── use-cases/         # Use case tests
├── docs/                  # Documentation
├── demo/                  # Demo and examples
├── dist/                  # Compiled JavaScript (generated)
└── package.json           # Project configuration
```

## Architecture

### Layered Architecture

UX-Kit follows a clean layered architecture:

```
┌─────────────────────────────────────┐
│           CLI Layer                 │
│  Commands, Arguments, User Interface│
├─────────────────────────────────────┤
│          Service Layer              │
│  Business Logic, File Generation    │
├─────────────────────────────────────┤
│          Utility Layer              │
│  File System, Paths, Cross-Platform │
└─────────────────────────────────────┘
```

### Core Components

#### CLI Layer
- **`CLIApplication`** - Main application entry point
- **`CommandRegistry`** - Command registration and routing
- **`HelpSystem`** - Help generation and documentation
- **`ErrorHandler`** - Error handling and user feedback

#### Service Layer
- **`StudyService`** - Study management and CRUD operations
- **`TemplateService`** - Template processing and rendering
- **`FileService`** - File system operations and management
- **`AIAgentService`** - AI agent integration and configuration

#### Utility Layer
- **`PathUtils`** - Cross-platform path handling
- **`FileUtils`** - File system operations
- **`TemplateUtils`** - Handlebars template processing
- **`ValidationUtils`** - Input validation and sanitization

## Development Workflow

### Code Style

**TypeScript Configuration:**
- Strict mode enabled
- No implicit any
- Strict null checks
- No unused variables

**ESLint Configuration:**
- TypeScript ESLint rules
- Prettier integration
- Consistent code formatting

**File Naming:**
- PascalCase for classes: `StudyService.ts`
- camelCase for functions: `createStudy()`
- kebab-case for files: `study-service.ts`

### Testing

**Test Structure:**
```
tests/
├── unit/                  # Unit tests for individual components
├── integration/           # Integration tests for workflows
├── use-cases/            # Use case tests with realistic scenarios
└── setup.ts              # Test setup and configuration
```

**Running Tests:**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- StudyService.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="Study Management"
```

**Test Categories:**

#### Unit Tests
- Test individual components in isolation
- Mock dependencies and external services
- Focus on specific functionality
- Fast execution and reliable results

#### Integration Tests
- Test complete workflows end-to-end
- Use real file system operations
- Test command-line interface
- Verify cross-platform compatibility

#### Use Case Tests
- Test realistic user scenarios
- Use TDD approach with acceptance criteria
- Test complete research workflows
- Validate business requirements

### Building

**Build Process:**
```bash
# Build TypeScript to JavaScript
npm run build

# Build in watch mode for development
npm run build:watch

# Clean build directory
npm run clean

# Verify build output
node dist/index.js --help
```

**Build Output:**
- Compiled JavaScript in `dist/` directory
- Source maps for debugging
- Type definitions for TypeScript consumers
- Optimized for production use

## Contributing

### Pull Request Process

1. **Fork the repository** on GitHub
2. **Create a feature branch** from `main`
3. **Make your changes** following the code style
4. **Add tests** for new functionality
5. **Run tests** to ensure everything passes
6. **Submit a pull request** with a clear description

### Commit Messages

**Format:**
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Test additions or changes
- `chore` - Build process or auxiliary tool changes

**Examples:**
```
feat(study): add study deletion functionality

fix(template): resolve Handlebars template rendering issue

docs(readme): update installation instructions
```

### Code Review

**Review Checklist:**
- [ ] Code follows project style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or properly documented)
- [ ] Cross-platform compatibility maintained
- [ ] Error handling is comprehensive
- [ ] Performance considerations addressed

## Adding New Features

### Command Implementation

**1. Define Command Interface:**
```typescript
// src/contracts/application-contracts.ts
export interface ICommand {
  name: string;
  description: string;
  execute(args: string[], options: any): Promise<CommandResult>;
}
```

**2. Implement Command:**
```typescript
// src/commands/NewCommand.ts
export class NewCommand implements ICommand {
  name = 'new';
  description = 'Create new resource';

  async execute(args: string[], options: any): Promise<CommandResult> {
    // Implementation
  }
}
```

**3. Register Command:**
```typescript
// src/cli/CommandRegistry.ts
this.registerCommand(new NewCommand());
```

**4. Add Tests:**
```typescript
// tests/unit/commands/NewCommand.test.ts
describe('NewCommand', () => {
  it('should create new resource', async () => {
    // Test implementation
  });
});
```

### Service Implementation

**1. Define Service Interface:**
```typescript
// src/contracts/application-contracts.ts
export interface INewService {
  createResource(data: any): Promise<Resource>;
  getResource(id: string): Promise<Resource>;
}
```

**2. Implement Service:**
```typescript
// src/services/NewService.ts
export class NewService implements INewService {
  async createResource(data: any): Promise<Resource> {
    // Implementation
  }
}
```

**3. Add Dependency Injection:**
```typescript
// src/cli/CLIApplication.ts
constructor() {
  this.newService = new NewService();
}
```

### Template System

**1. Create Template:**
```handlebars
<!-- src/templates/new-template.md -->
# New Resource: {{name}}

**Description**: {{description}}
**Created**: {{date}}

## Details
{{#each details}}
- {{this}}
{{/each}}
```

**2. Register Template:**
```typescript
// src/services/TemplateService.ts
this.registerTemplate('new', 'new-template.md');
```

**3. Use Template:**
```typescript
const content = await this.templateService.render('new', data);
```

## Debugging

### Development Mode

**Enable Debug Logging:**
```bash
# Set debug environment variable
export DEBUG=uxkit:*

# Run with debug output
npm run build && node dist/index.js --verbose
```

**Debug Configuration:**
```typescript
// src/utils/Logger.ts
const isDebug = process.env.DEBUG?.includes('uxkit') || false;

if (isDebug) {
  console.log('Debug:', message);
}
```

### VS Code Configuration

**Launch Configuration (`.vscode/launch.json`):**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug UX-Kit",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/dist/index.js",
      "args": ["--help"],
      "preLaunchTask": "build",
      "console": "integratedTerminal"
    }
  ]
}
```

**Tasks Configuration (`.vscode/tasks.json`):**
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "build",
      "type": "npm",
      "script": "build",
      "group": "build"
    }
  ]
}
```

## Performance

### Optimization Guidelines

**File System Operations:**
- Use async/await for file operations
- Batch file operations when possible
- Implement proper error handling
- Use streaming for large files

**Memory Management:**
- Avoid loading large files into memory
- Use generators for large datasets
- Implement proper cleanup
- Monitor memory usage

**Template Processing:**
- Cache compiled templates
- Use efficient Handlebars helpers
- Minimize template complexity
- Optimize data structures

### Profiling

**Node.js Profiling:**
```bash
# Enable profiling
node --prof dist/index.js

# Analyze profile
node --prof-process isolate-*.log > profile.txt
```

**Memory Profiling:**
```bash
# Enable heap profiling
node --inspect dist/index.js

# Use Chrome DevTools
# Open chrome://inspect
```

## Deployment

### NPM Package

**Build for Production:**
```bash
# Clean and build
npm run clean
npm run build

# Run tests
npm test

# Publish to NPM
npm publish
```

**Package Configuration:**
```json
{
  "main": "dist/index.js",
  "bin": {
    "uxkit": "dist/index.js"
  },
  "files": [
    "dist/",
    "templates/",
    "README.md",
    "LICENSE"
  ]
}
```

### CI/CD

**GitHub Actions Workflow:**
```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
      - run: npm run lint
```

## Documentation

### Code Documentation

**JSDoc Comments:**
```typescript
/**
 * Creates a new research study with the specified parameters.
 * 
 * @param name - The name of the study
 * @param description - Optional description of the study
 * @param options - Additional options for study creation
 * @returns Promise that resolves to the created study
 * @throws {ValidationError} When required parameters are missing
 * @throws {FileSystemError} When directory creation fails
 */
async createStudy(name: string, description?: string, options?: StudyOptions): Promise<Study> {
  // Implementation
}
```

### API Documentation

**Generate Documentation:**
```bash
# Install TypeDoc
npm install -g typedoc

# Generate documentation
typedoc src/index.ts --out docs/api
```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check TypeScript errors
npx tsc --noEmit

# Check ESLint errors
npx eslint src/

# Clean and rebuild
npm run clean && npm run build
```

#### Test Failures
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- StudyService.test.ts

# Check test coverage
npm run test:coverage
```

#### Cross-Platform Issues
```bash
# Test on different platforms
# Use GitHub Actions or Docker

# Check path handling
npm test -- --testNamePattern="path"
```

### Getting Help

- Check existing [GitHub Issues](https://github.com/khaos-studio/ux-kit/issues)
- Review [Documentation](../README.md)
- Join our [Discord Community](https://discord.gg/ux-kit)
- Create a [GitHub Issue](https://github.com/khaos-studio/ux-kit/issues/new) for bugs

---

Ready to contribute? [Check out our GitHub repository →](https://github.com/khaos-studio/ux-kit)
