/**
 * Infrastructure Layer Contracts
 * 
 * These interfaces define the infrastructure layer contracts
 * for the UX-Kit system. They represent external concerns
 * such as AI agent integration, storage, and system services.
 */

import {
  ResearchStudy,
  ResearchQuestion,
  ResearchSource,
  ResearchSummary,
  Interview,
  ResearchInsight,
  ResearchContext,
  ResearchArtifact
} from './domain-contracts';

// ============================================================================
// AI Agent Contracts
// ============================================================================

export interface IAgent {
  readonly name: string;
  readonly version: string;
  readonly capabilities: AgentCapability[];
  
  generateQuestions(prompt: string, context: ResearchContext): Promise<ResearchQuestion[]>;
  summarizeContent(content: string, context: ResearchContext): Promise<ResearchSummary>;
  formatInterview(transcript: string, context: ResearchContext): Promise<Interview>;
  synthesizeInsights(artifacts: ResearchArtifact[], context: ResearchContext): Promise<ResearchInsight[]>;
  
  isAvailable(): Promise<boolean>;
  getStatus(): Promise<AgentStatus>;
}

export interface AgentCapability {
  readonly name: string;
  readonly description: string;
  readonly supportedTypes: string[];
  readonly maxInputSize: number;
  readonly maxOutputSize: number;
}

export interface AgentStatus {
  readonly isOnline: boolean;
  readonly responseTime: number;
  readonly lastChecked: Date;
  readonly error?: string;
}

export interface IAgentFactory {
  createAgent(provider: AIProvider, config: AgentConfig): IAgent;
  getSupportedProviders(): AIProvider[];
  validateConfig(provider: AIProvider, config: AgentConfig): ValidationResult;
}

export interface AgentConfig {
  readonly provider: AIProvider;
  readonly settings: Record<string, any>;
  readonly timeout: number;
  readonly retryAttempts: number;
  readonly apiKey?: string;
  readonly baseUrl?: string;
}

export enum AIProvider {
  CURSOR = 'cursor',
  CODEX = 'codex',
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  CUSTOM = 'custom'
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: ValidationError[];
}

export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code: string;
}

// ============================================================================
// Storage Contracts
// ============================================================================

export interface IArtifactRepository {
  // Study operations
  saveStudy(study: ResearchStudy): Promise<void>;
  getStudy(id: string): Promise<ResearchStudy | null>;
  listStudies(filters?: StudyFilters): Promise<ResearchStudy[]>;
  updateStudy(study: ResearchStudy): Promise<void>;
  deleteStudy(id: string): Promise<void>;
  
  // Question operations
  saveQuestions(questions: ResearchQuestion[]): Promise<void>;
  getQuestions(studyId: string): Promise<ResearchQuestion[]>;
  updateQuestion(question: ResearchQuestion): Promise<void>;
  deleteQuestion(id: string): Promise<void>;
  
  // Source operations
  saveSources(sources: ResearchSource[]): Promise<void>;
  getSources(studyId: string): Promise<ResearchSource[]>;
  getSource(id: string): Promise<ResearchSource | null>;
  updateSource(source: ResearchSource): Promise<void>;
  deleteSource(id: string): Promise<void>;
  
  // Summary operations
  saveSummary(summary: ResearchSummary): Promise<void>;
  getSummary(id: string): Promise<ResearchSummary | null>;
  getSummaries(sourceId: string): Promise<ResearchSummary[]>;
  updateSummary(summary: ResearchSummary): Promise<void>;
  deleteSummary(id: string): Promise<void>;
  
  // Interview operations
  saveInterview(interview: Interview): Promise<void>;
  getInterview(id: string): Promise<Interview | null>;
  getInterviews(studyId: string): Promise<Interview[]>;
  updateInterview(interview: Interview): Promise<void>;
  deleteInterview(id: string): Promise<void>;
  
  // Insight operations
  saveInsights(insights: ResearchInsight[]): Promise<void>;
  getInsights(studyId: string): Promise<ResearchInsight[]>;
  getInsight(id: string): Promise<ResearchInsight | null>;
  updateInsight(insight: ResearchInsight): Promise<void>;
  deleteInsight(id: string): Promise<void>;
}

export interface StudyFilters {
  readonly status?: string[];
  readonly priority?: string[];
  readonly tags?: string[];
  readonly owner?: string;
  readonly team?: string[];
  readonly dateRange?: DateRange;
}

export interface DateRange {
  readonly start: Date;
  readonly end: Date;
}

export interface IStorageProvider {
  readonly name: string;
  readonly type: StorageType;
  
  initialize(config: StorageConfig): Promise<void>;
  isAvailable(): Promise<boolean>;
  getStatus(): Promise<StorageStatus>;
}

export interface StorageConfig {
  readonly basePath: string;
  readonly format: StorageFormat;
  readonly compression: boolean;
  readonly encryption: boolean;
  readonly backup: boolean;
}

export enum StorageType {
  FILE_SYSTEM = 'file_system',
  DATABASE = 'database',
  CLOUD = 'cloud',
  MEMORY = 'memory'
}

export enum StorageFormat {
  MARKDOWN = 'markdown',
  JSON = 'json',
  YAML = 'yaml',
  BINARY = 'binary'
}

export interface StorageStatus {
  readonly isAvailable: boolean;
  readonly freeSpace: number;
  readonly totalSpace: number;
  readonly lastBackup?: Date;
  readonly error?: string;
}

// ============================================================================
// File System Contracts
// ============================================================================

export interface IFileSystemService {
  exists(path: string): Promise<boolean>;
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  createDirectory(path: string): Promise<void>;
  listDirectory(path: string): Promise<FileInfo[]>;
  getFileInfo(path: string): Promise<FileInfo>;
  copyFile(source: string, destination: string): Promise<void>;
  moveFile(source: string, destination: string): Promise<void>;
}

export interface FileInfo {
  readonly name: string;
  readonly path: string;
  readonly size: number;
  readonly isDirectory: boolean;
  readonly createdAt: Date;
  readonly modifiedAt: Date;
  readonly permissions: FilePermissions;
}

export interface FilePermissions {
  readonly readable: boolean;
  readonly writable: boolean;
  readonly executable: boolean;
}

// ============================================================================
// Configuration Contracts
// ============================================================================

export interface IConfigurationService {
  load(configPath: string): Promise<UXKitConfig>;
  save(config: UXKitConfig, configPath: string): Promise<void>;
  validate(config: UXKitConfig): ValidationResult;
  getDefaultConfig(): UXKitConfig;
  mergeConfigs(base: UXKitConfig, override: Partial<UXKitConfig>): UXKitConfig;
}

export interface UXKitConfig {
  readonly version: string;
  readonly aiAgent: AIConfig;
  readonly storage: StorageConfig;
  readonly research: ResearchConfig;
  readonly logging: LoggingConfig;
  readonly ui: UIConfig;
}

export interface AIConfig {
  readonly provider: AIProvider;
  readonly settings: Record<string, any>;
  readonly timeout: number;
  readonly retryAttempts: number;
  readonly apiKey?: string;
  readonly baseUrl?: string;
}

export interface ResearchConfig {
  readonly defaultTemplates: string[];
  readonly autoSave: boolean;
  readonly maxFileSize: number;
  readonly supportedFormats: string[];
  readonly backupRetention: number;
}

export interface LoggingConfig {
  readonly level: LogLevel;
  readonly format: LogFormat;
  readonly output: LogOutput;
  readonly retention: number;
  readonly maxFileSize: number;
}

export interface UIConfig {
  readonly theme: Theme;
  readonly language: string;
  readonly showProgress: boolean;
  readonly confirmActions: boolean;
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export enum LogFormat {
  JSON = 'json',
  TEXT = 'text'
}

export enum LogOutput {
  CONSOLE = 'console',
  FILE = 'file',
  BOTH = 'both'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

// ============================================================================
// Network Contracts
// ============================================================================

export interface INetworkService {
  get(url: string, options?: RequestOptions): Promise<Response>;
  post(url: string, data: any, options?: RequestOptions): Promise<Response>;
  put(url: string, data: any, options?: RequestOptions): Promise<Response>;
  delete(url: string, options?: RequestOptions): Promise<Response>;
  download(url: string, destination: string): Promise<void>;
  upload(filePath: string, url: string): Promise<void>;
}

export interface RequestOptions {
  readonly headers?: Record<string, string>;
  readonly timeout?: number;
  readonly retries?: number;
  readonly retryDelay?: number;
}

export interface Response {
  readonly status: number;
  readonly headers: Record<string, string>;
  readonly data: any;
  readonly success: boolean;
}

// ============================================================================
// Security Contracts
// ============================================================================

export interface ISecurityService {
  encrypt(data: string, key: string): Promise<string>;
  decrypt(encryptedData: string, key: string): Promise<string>;
  hash(data: string): Promise<string>;
  verifyHash(data: string, hash: string): Promise<boolean>;
  generateKey(): Promise<string>;
  validateApiKey(apiKey: string): Promise<boolean>;
}

export interface IValidationService {
  validateEmail(email: string): boolean;
  validateUrl(url: string): boolean;
  validateFilePath(path: string): boolean;
  validateUuid(uuid: string): boolean;
  sanitizeInput(input: string): string;
}

// ============================================================================
// System Services
// ============================================================================

export interface ISystemService {
  getPlatform(): Platform;
  getArchitecture(): string;
  getNodeVersion(): string;
  getMemoryUsage(): MemoryUsage;
  getCpuUsage(): Promise<number>;
  getUptime(): number;
}

export interface MemoryUsage {
  readonly total: number;
  readonly free: number;
  readonly used: number;
  readonly percentage: number;
}

export enum Platform {
  WINDOWS = 'windows',
  MACOS = 'macos',
  LINUX = 'linux',
  UNKNOWN = 'unknown'
}

// ============================================================================
// Template Contracts
// ============================================================================

export interface ITemplateService {
  getTemplate(name: string): Promise<string>;
  listTemplates(): Promise<TemplateInfo[]>;
  renderTemplate(template: string, data: Record<string, any>): Promise<string>;
  validateTemplate(template: string): ValidationResult;
}

export interface TemplateInfo {
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly version: string;
  readonly parameters: TemplateParameter[];
}

export interface TemplateParameter {
  readonly name: string;
  readonly type: string;
  readonly required: boolean;
  readonly description: string;
  readonly defaultValue?: any;
}

// ============================================================================
// Export Contracts
// ============================================================================

export interface IExportService {
  exportToMarkdown(study: ResearchStudy): Promise<string>;
  exportToJson(study: ResearchStudy): Promise<string>;
  exportToHtml(study: ResearchStudy): Promise<string>;
  exportToPdf(study: ResearchStudy): Promise<Buffer>;
  exportToZip(study: ResearchStudy): Promise<Buffer>;
}

export interface ExportOptions {
  readonly format: ExportFormat;
  readonly includeMetadata: boolean;
  readonly includeArtifacts: boolean;
  readonly template?: string;
  readonly outputPath?: string;
}

export enum ExportFormat {
  MARKDOWN = 'markdown',
  JSON = 'json',
  HTML = 'html',
  PDF = 'pdf',
  ZIP = 'zip'
}

// ============================================================================
// Backup Contracts
// ============================================================================

export interface IBackupService {
  createBackup(studyId: string): Promise<BackupInfo>;
  restoreBackup(backupId: string): Promise<void>;
  listBackups(studyId: string): Promise<BackupInfo[]>;
  deleteBackup(backupId: string): Promise<void>;
  scheduleBackup(studyId: string, schedule: BackupSchedule): Promise<void>;
}

export interface BackupInfo {
  readonly id: string;
  readonly studyId: string;
  readonly createdAt: Date;
  readonly size: number;
  readonly path: string;
  readonly checksum: string;
}

export interface BackupSchedule {
  readonly frequency: BackupFrequency;
  readonly time: string;
  readonly retention: number;
  readonly enabled: boolean;
}

export enum BackupFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}
