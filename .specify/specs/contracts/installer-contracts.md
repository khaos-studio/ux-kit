# Installer Contracts

## Core Interfaces

### IInstaller Interface
```typescript
interface IInstaller {
  install(options: InstallOptions): Promise<InstallResult>;
  uninstall(): Promise<UninstallResult>;
  verify(): Promise<VerificationResult>;
  update(version: string): Promise<UpdateResult>;
}
```

### ISystemDetector Interface
```typescript
interface ISystemDetector {
  detectSystem(): Promise<SystemInfo>;
  validateRequirements(): Promise<ValidationResult>;
  checkDependencies(): Promise<DependencyStatus>;
}
```

### IDependencyManager Interface
```typescript
interface IDependencyManager {
  installDependencies(requirements: SystemRequirements): Promise<DependencyResult>;
  checkDependency(dependency: string): Promise<boolean>;
  installDependency(dependency: string): Promise<InstallResult>;
  updateDependency(dependency: string): Promise<UpdateResult>;
}
```

### IBinaryManager Interface
```typescript
interface IBinaryManager {
  downloadBinary(release: GitHubRelease, platform: string): Promise<BinaryInfo>;
  verifyBinary(binary: BinaryInfo): Promise<boolean>;
  installBinary(binary: BinaryInfo, path: string): Promise<InstallResult>;
  createSymlink(binaryPath: string, symlinkPath: string): Promise<boolean>;
}
```

### IConfigurationManager Interface
```typescript
interface IConfigurationManager {
  setupConfiguration(config: UserConfig): Promise<ConfigResult>;
  createEnvironmentVariables(env: EnvironmentConfig): Promise<boolean>;
  setupSSH(sshConfig: SSHConfig): Promise<SSHResult>;
  validateConfiguration(): Promise<ValidationResult>;
}
```

## Service Contracts

### IGitHubService Interface
```typescript
interface IGitHubService {
  getLatestRelease(): Promise<GitHubRelease>;
  getRelease(version: string): Promise<GitHubRelease>;
  downloadAsset(asset: GitHubAsset): Promise<Buffer>;
  verifyRelease(release: GitHubRelease): Promise<boolean>;
}
```

### IProgressReporter Interface
```typescript
interface IProgressReporter {
  reportProgress(progress: InstallProgress): void;
  reportError(error: InstallError): void;
  reportWarning(warning: string): void;
  reportSuccess(message: string): void;
}
```

### ILogger Interface
```typescript
interface ILogger {
  debug(message: string, context?: any): void;
  info(message: string, context?: any): void;
  warn(message: string, context?: any): void;
  error(message: string, context?: any): void;
}
```

## Error Handling Contracts

### IErrorHandler Interface
```typescript
interface IErrorHandler {
  handleError(error: InstallError): Promise<ErrorRecovery>;
  canRecover(error: InstallError): boolean;
  getRecoveryAction(error: InstallError): string;
  logError(error: InstallError): void;
}
```

### IRetryManager Interface
```typescript
interface IRetryManager {
  retry<T>(operation: () => Promise<T>, maxRetries: number): Promise<T>;
  shouldRetry(error: Error): boolean;
  getRetryDelay(attempt: number): number;
}
```

## Security Contracts

### ISecurityManager Interface
```typescript
interface ISecurityManager {
  verifyChecksum(file: string, expectedHash: string): Promise<boolean>;
  verifySignature(file: string, signature: string): Promise<boolean>;
  validateSSHKey(key: string): Promise<boolean>;
  sanitizeInput(input: string): string;
}
```

### ICryptographicService Interface
```typescript
interface ICryptographicService {
  generateChecksum(file: string, algorithm: string): Promise<string>;
  verifyChecksum(file: string, hash: string, algorithm: string): Promise<boolean>;
  generateSignature(data: string, key: string): Promise<string>;
  verifySignature(data: string, signature: string, key: string): Promise<boolean>;
}
```

## State Management Contracts

### IStateManager Interface
```typescript
interface IStateManager {
  saveState(state: InstallState): Promise<void>;
  loadState(): Promise<InstallState | null>;
  clearState(): Promise<void>;
  getStateHistory(): Promise<InstallState[]>;
}
```

### IProgressTracker Interface
```typescript
interface IProgressTracker {
  startTracking(): void;
  updateProgress(phase: InstallPhase, progress: number): void;
  completePhase(phase: InstallPhase): void;
  getProgress(): InstallProgress;
}
```

## Validation Contracts

### IValidator Interface
```typescript
interface IValidator {
  validateSystem(system: SystemInfo): Promise<ValidationResult>;
  validateOptions(options: InstallOptions): Promise<ValidationResult>;
  validateDependencies(dependencies: string[]): Promise<ValidationResult>;
  validatePermissions(): Promise<ValidationResult>;
}
```

### IRequirementChecker Interface
```typescript
interface IRequirementChecker {
  checkSystemRequirements(): Promise<boolean>;
  checkDependencyRequirements(): Promise<boolean>;
  checkPermissionRequirements(): Promise<boolean>;
  checkNetworkRequirements(): Promise<boolean>;
}
```

## File System Contracts

### IFileSystem Interface
```typescript
interface IFileSystem {
  createDirectory(path: string): Promise<boolean>;
  createFile(path: string, content: string): Promise<boolean>;
  copyFile(source: string, destination: string): Promise<boolean>;
  moveFile(source: string, destination: string): Promise<boolean>;
  deleteFile(path: string): Promise<boolean>;
  deleteDirectory(path: string): Promise<boolean>;
  exists(path: string): Promise<boolean>;
  isDirectory(path: string): Promise<boolean>;
  isFile(path: string): Promise<boolean>;
  getPermissions(path: string): Promise<string>;
  setPermissions(path: string, permissions: string): Promise<boolean>;
}
```

### IPathManager Interface
```typescript
interface IPathManager {
  getTempDirectory(): string;
  getInstallDirectory(): string;
  getConfigDirectory(): string;
  getDataDirectory(): string;
  getLogDirectory(): string;
  resolvePath(path: string): string;
  normalizePath(path: string): string;
  joinPaths(...paths: string[]): string;
}
```

## Network Contracts

### INetworkService Interface
```typescript
interface INetworkService {
  downloadFile(url: string, destination: string): Promise<boolean>;
  checkConnectivity(): Promise<boolean>;
  getDownloadProgress(): number;
  cancelDownload(): void;
}
```

### IHTTPClient Interface
```typescript
interface IHTTPClient {
  get(url: string, headers?: Record<string, string>): Promise<Response>;
  post(url: string, data: any, headers?: Record<string, string>): Promise<Response>;
  put(url: string, data: any, headers?: Record<string, string>): Promise<Response>;
  delete(url: string, headers?: Record<string, string>): Promise<Response>;
}
```

## Package Manager Contracts

### IPackageManager Interface
```typescript
interface IPackageManager {
  install(packageName: string): Promise<boolean>;
  update(packageName: string): Promise<boolean>;
  remove(packageName: string): Promise<boolean>;
  list(): Promise<string[]>;
  isInstalled(packageName: string): Promise<boolean>;
  getVersion(packageName: string): Promise<string>;
}
```

### IHomebrewManager Interface
```typescript
interface IHomebrewManager extends IPackageManager {
  installHomebrew(): Promise<boolean>;
  updateHomebrew(): Promise<boolean>;
  checkHomebrew(): Promise<boolean>;
}
```

### IAPTManager Interface
```typescript
interface IAPTManager extends IPackageManager {
  updatePackageList(): Promise<boolean>;
  upgradePackages(): Promise<boolean>;
  addRepository(repo: string): Promise<boolean>;
}
```

## Result Types

### InstallResult Interface
```typescript
interface InstallResult {
  success: boolean;
  message: string;
  artifacts: InstallArtifact[];
  errors: InstallError[];
  warnings: string[];
  duration: number;
}
```

### VerificationResult Interface
```typescript
interface VerificationResult {
  valid: boolean;
  checksum: boolean;
  signature: boolean;
  permissions: boolean;
  dependencies: boolean;
  errors: string[];
}
```

### UpdateResult Interface
```typescript
interface UpdateResult {
  success: boolean;
  previousVersion: string;
  newVersion: string;
  changes: string[];
  rollbackAvailable: boolean;
}
```
