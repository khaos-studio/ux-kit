# Data Models: Remote Install Support

## System Information Model

### SystemInfo Interface
```typescript
interface SystemInfo {
  os: 'macos' | 'linux';
  distribution?: string;
  architecture: 'x86_64' | 'arm64';
  nodeVersion?: string;
  gitVersion?: string;
  sshAvailable: boolean;
  packageManager: 'homebrew' | 'apt' | 'yum' | 'none';
  shell: string;
  tempDir: string;
  installDir: string;
}
```

### System Detection Logic
```typescript
class SystemDetector {
  detectOS(): 'macos' | 'linux';
  detectArchitecture(): 'x86_64' | 'arm64';
  detectDistribution(): string | undefined;
  detectPackageManager(): 'homebrew' | 'apt' | 'yum' | 'none';
  checkNodeVersion(): string | undefined;
  checkGitVersion(): string | undefined;
  checkSSHAccess(): boolean;
  getShellInfo(): string;
  getTempDirectory(): string;
  getInstallDirectory(): string;
}
```

## Installation Options Model

### InstallOptions Interface
```typescript
interface InstallOptions {
  version: 'latest' | string;
  installPath: string;
  skipDependencies: boolean;
  skipVerification: boolean;
  verbose: boolean;
  force: boolean;
  dryRun: boolean;
}
```

### Installation Configuration
```typescript
interface InstallConfig {
  options: InstallOptions;
  system: SystemInfo;
  github: GitHubConfig;
  paths: PathConfig;
  security: SecurityConfig;
}

interface GitHubConfig {
  owner: string;
  repo: string;
  apiUrl: string;
  releasesUrl: string;
  sshUrl: string;
}

interface PathConfig {
  tempDir: string;
  installDir: string;
  configDir: string;
  binaryPath: string;
  symlinkPath: string;
}

interface SecurityConfig {
  verifyChecksums: boolean;
  verifySignatures: boolean;
  allowedHashes: string[];
  trustedKeys: string[];
}
```

## Release Information Model

### GitHubRelease Interface
```typescript
interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string;
  assets: GitHubAsset[];
}

interface GitHubAsset {
  id: number;
  name: string;
  label: string;
  content_type: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  uploader: GitHubUser;
}

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  type: string;
}
```

### Binary Information
```typescript
interface BinaryInfo {
  name: string;
  platform: string;
  architecture: string;
  downloadUrl: string;
  checksum: string;
  signature?: string;
  size: number;
  version: string;
}
```

## Error Handling Model

### Error Types
```typescript
enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',
  SSH_ERROR = 'SSH_ERROR',
  VERSION_ERROR = 'VERSION_ERROR',
  VERIFICATION_ERROR = 'VERIFICATION_ERROR',
  SYSTEM_ERROR = 'SYSTEM_ERROR'
}

interface InstallError {
  type: ErrorType;
  message: string;
  code: number;
  suggestion: string;
  recoverable: boolean;
  context: Record<string, any>;
}
```

### Error Recovery
```typescript
interface ErrorRecovery {
  canRetry: boolean;
  maxRetries: number;
  retryDelay: number;
  fallbackAction?: string;
  userAction?: string;
}
```

## Progress Tracking Model

### Installation Progress
```typescript
interface InstallProgress {
  phase: InstallPhase;
  step: string;
  progress: number; // 0-100
  message: string;
  startTime: Date;
  estimatedTime?: number;
}

enum InstallPhase {
  DETECTION = 'DETECTION',
  DEPENDENCIES = 'DEPENDENCIES',
  DOWNLOAD = 'DOWNLOAD',
  INSTALLATION = 'INSTALLATION',
  CONFIGURATION = 'CONFIGURATION',
  VERIFICATION = 'VERIFICATION',
  COMPLETE = 'COMPLETE'
}
```

### Logging Configuration
```typescript
interface LogConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'text' | 'json';
  output: 'console' | 'file' | 'both';
  filePath?: string;
  maxSize?: number;
  maxFiles?: number;
}
```

## Configuration Model

### User Configuration
```typescript
interface UserConfig {
  installPath: string;
  configPath: string;
  dataPath: string;
  logPath: string;
  version: string;
  autoUpdate: boolean;
  telemetry: boolean;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  editor: string;
  shell: string;
  language: string;
  notifications: boolean;
}
```

### Environment Variables
```typescript
interface EnvironmentConfig {
  UXKIT_HOME: string;
  UXKIT_CONFIG: string;
  UXKIT_DATA: string;
  UXKIT_LOG: string;
  PATH: string;
  NODE_PATH?: string;
  GIT_SSH_COMMAND?: string;
}
```

## Validation Model

### System Requirements
```typescript
interface SystemRequirements {
  minNodeVersion: string;
  minGitVersion: string;
  requiredCommands: string[];
  requiredPermissions: string[];
  diskSpace: number; // MB
  memory: number; // MB
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

interface ValidationError {
  requirement: string;
  current: string;
  required: string;
  message: string;
}

interface ValidationWarning {
  requirement: string;
  message: string;
  suggestion: string;
}
```

## State Management Model

### Installation State
```typescript
interface InstallState {
  status: 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentPhase: InstallPhase;
  progress: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  errors: InstallError[];
  warnings: string[];
  artifacts: InstallArtifact[];
}

interface InstallArtifact {
  name: string;
  path: string;
  type: 'binary' | 'config' | 'data' | 'log';
  size: number;
  checksum: string;
  created: Date;
}
```

### State Persistence
```typescript
interface StateManager {
  saveState(state: InstallState): void;
  loadState(): InstallState | null;
  clearState(): void;
  getStateHistory(): InstallState[];
}
```