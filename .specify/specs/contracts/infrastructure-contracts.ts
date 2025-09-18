/**
 * Infrastructure Layer Contracts
 * 
 * This file defines the infrastructure layer interfaces and types for the UX-Kit TypeScript CLI.
 * The infrastructure layer handles external concerns like file system operations, AI agent
 * communication, and system integration, following clean architecture principles.
 * 
 * The infrastructure layer is inspired by GitHub's spec-kit approach for structured workflows.
 */

import {
  ResearchQuestion,
  ResearchSource,
  ResearchSummary,
  Interview,
  ResearchInsight,
  ResearchContext
} from './domain-contracts';

// ============================================================================
// AI Agent Interfaces
// ============================================================================

/**
 * Base interface for AI agents
 */
export interface IAIAgent {
  readonly name: string;
  readonly version: string;
  readonly capabilities: AIAgentCapabilities;
  
  generateQuestions(prompt: string, context: ResearchContext): Promise<ResearchQuestion[]>;
  discoverSources(query: string, context: ResearchContext): Promise<ResearchSource[]>;
  summarizeContent(content: string, context: ResearchContext): Promise<ResearchSummary>;
  formatInterview(transcript: string, context: ResearchContext): Promise<Interview>;
  synthesizeInsights(artifacts: string[], context: ResearchContext): Promise<ResearchInsight[]>;
  
  isAvailable(): Promise<boolean>;
  getStatus(): Promise<AIAgentStatus>;
  testConnection(): Promise<boolean>;
}

/**
 * AI agent capabilities
 */
export interface AIAgentCapabilities {
  readonly supportedOperations: string[];
  readonly maxContentLength: number;
  readonly maxResponseTime: number;
  readonly reliability: number;
  readonly costPerRequest?: number;
}

/**
 * AI agent status
 */
export interface AIAgentStatus {
  readonly available: boolean;
  readonly responseTime: number;
  readonly lastUsed: Date;
  readonly errorCount: number;
  readonly successRate: number;
}

/**
 * Cursor AI agent implementation
 */
export interface ICursorAgent extends IAIAgent {
  readonly name: 'cursor';
  readonly version: string;
  
  generateQuestions(prompt: string, context: ResearchContext): Promise<ResearchQuestion[]>;
  discoverSources(query: string, context: ResearchContext): Promise<ResearchSource[]>;
  summarizeContent(content: string, context: ResearchContext): Promise<ResearchSummary>;
  formatInterview(transcript: string, context: ResearchContext): Promise<Interview>;
  synthesizeInsights(artifacts: string[], context: ResearchContext): Promise<ResearchInsight[]>;
}

/**
 * Codex AI agent implementation
 */
export interface ICodexAgent extends IAIAgent {
  readonly name: 'codex';
  readonly version: string;
  
  generateQuestions(prompt: string, context: ResearchContext): Promise<ResearchQuestion[]>;
  discoverSources(query: string, context: ResearchContext): Promise<ResearchSource[]>;
  summarizeContent(content: string, context: ResearchContext): Promise<ResearchSummary>;
  formatInterview(transcript: string, context: ResearchContext): Promise<Interview>;
  synthesizeInsights(artifacts: string[], context: ResearchContext): Promise<ResearchInsight[]>;
}

/**
 * Custom AI agent implementation
 */
export interface ICustomAgent extends IAIAgent {
  readonly name: 'custom';
  readonly version: string;
  readonly endpoint: string;
  readonly apiKey?: string;
  
  generateQuestions(prompt: string, context: ResearchContext): Promise<ResearchQuestion[]>;
  discoverSources(query: string, context: ResearchContext): Promise<ResearchSource[]>;
  summarizeContent(content: string, context: ResearchContext): Promise<ResearchSummary>;
  formatInterview(transcript: string, context: ResearchContext): Promise<Interview>;
  synthesizeInsights(artifacts: string[], context: ResearchContext): Promise<ResearchInsight[]>;
}

// ============================================================================
// File System Interfaces
// ============================================================================

/**
 * File system service interface
 */
export interface IFileSystemService {
  createDirectory(path: string): Promise<void>;
  createFile(path: string, content: string): Promise<void>;
  readFile(path: string): Promise<string>;
  updateFile(path: string, content: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  isDirectory(path: string): Promise<boolean>;
  isFile(path: string): Promise<boolean>;
  listDirectory(path: string): Promise<string[]>;
  getFileStats(path: string): Promise<FileStats>;
  copyFile(source: string, destination: string): Promise<void>;
  moveFile(source: string, destination: string): Promise<void>;
  createSymlink(target: string, linkPath: string): Promise<void>;
}

/**
 * File statistics
 */
export interface FileStats {
  readonly size: number;
  readonly createdAt: Date;
  readonly modifiedAt: Date;
  readonly accessedAt: Date;
  readonly isDirectory: boolean;
  readonly isFile: boolean;
  readonly permissions: FilePermissions;
}

/**
 * File permissions
 */
export interface FilePermissions {
  readonly readable: boolean;
  readonly writable: boolean;
  readonly executable: boolean;
  readonly owner: string;
  readonly group: string;
  readonly mode: number;
}

/**
 * Path service interface
 */
export interface IPathService {
  join(...paths: string[]): string;
  resolve(path: string): string;
  dirname(path: string): string;
  basename(path: string, ext?: string): string;
  extname(path: string): string;
  isAbsolute(path: string): boolean;
  isRelative(path: string): boolean;
  normalize(path: string): string;
  relative(from: string, to: string): string;
  getHomeDirectory(): string;
  getCurrentDirectory(): string;
  getTempDirectory(): string;
}

// ============================================================================
// Template Engine Interfaces
// ============================================================================

/**
 * Template engine interface
 */
export interface ITemplateEngine {
  render(template: string, data: Record<string, any>): Promise<string>;
  renderFile(templatePath: string, data: Record<string, any>): Promise<string>;
  compile(template: string): Promise<CompiledTemplate>;
  validate(template: string): Promise<boolean>;
  getVariables(template: string): Promise<TemplateVariable[]>;
  registerHelper(name: string, helper: TemplateHelper): void;
  registerPartial(name: string, partial: string): void;
}

/**
 * Compiled template
 */
export interface CompiledTemplate {
  render(data: Record<string, any>): Promise<string>;
  getVariables(): TemplateVariable[];
  validate(data: Record<string, any>): Promise<boolean>;
}

/**
 * Template variable
 */
export interface TemplateVariable {
  readonly name: string;
  readonly type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  readonly required: boolean;
  readonly defaultValue?: any;
  readonly description: string;
}

/**
 * Template helper function
 */
export interface TemplateHelper {
  (context: any, ...args: any[]): any;
}

/**
 * Handlebars template engine implementation
 */
export interface IHandlebarsTemplateEngine extends ITemplateEngine {
  readonly name: 'handlebars';
  readonly version: string;
  
  render(template: string, data: Record<string, any>): Promise<string>;
  renderFile(templatePath: string, data: Record<string, any>): Promise<string>;
  compile(template: string): Promise<CompiledTemplate>;
  validate(template: string): Promise<boolean>;
  getVariables(template: string): Promise<TemplateVariable[]>;
  registerHelper(name: string, helper: TemplateHelper): void;
  registerPartial(name: string, partial: string): void;
}

// ============================================================================
// Configuration Interfaces
// ============================================================================

/**
 * Configuration service interface
 */
export interface IConfigurationService {
  load(): Promise<UXKitConfig>;
  save(config: UXKitConfig): Promise<void>;
  getValue(key: string): Promise<any>;
  setValue(key: string, value: any): Promise<void>;
  hasValue(key: string): Promise<boolean>;
  deleteValue(key: string): Promise<void>;
  reset(): Promise<void>;
  validate(config: UXKitConfig): Promise<boolean>;
  getConfigPath(): string;
  backup(): Promise<string>;
  restore(backupPath: string): Promise<void>;
}

/**
 * UX-Kit configuration
 */
export interface UXKitConfig {
  readonly version: string;
  readonly aiAgent: AIAgentConfig;
  readonly storage: StorageConfig;
  readonly research: ResearchConfig;
  readonly ui: UIConfig;
}

/**
 * AI agent configuration
 */
export interface AIAgentConfig {
  readonly provider: 'cursor' | 'codex' | 'custom';
  readonly settings: Record<string, any>;
  readonly timeout: number;
  readonly retries: number;
  readonly fallbackEnabled: boolean;
}

/**
 * Storage configuration
 */
export interface StorageConfig {
  readonly basePath: string;
  readonly format: 'markdown' | 'json' | 'yaml';
  readonly autoSave: boolean;
  readonly backup: boolean;
  readonly compression: boolean;
}

/**
 * Research configuration
 */
export interface ResearchConfig {
  readonly defaultTemplates: string[];
  readonly autoDiscovery: boolean;
  readonly qualityThreshold: number;
  readonly maxArtifacts: number;
  readonly retentionDays: number;
}

/**
 * UI configuration
 */
export interface UIConfig {
  readonly theme: 'light' | 'dark' | 'auto';
  readonly verbose: boolean;
  readonly progress: boolean;
  readonly colors: boolean;
  readonly animations: boolean;
}

// ============================================================================
// Logging Interfaces
// ============================================================================

/**
 * Logger interface
 */
export interface ILogger {
  debug(message: string, context?: Record<string, any>): void;
  info(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  error(message: string, context?: Record<string, any>): void;
  fatal(message: string, context?: Record<string, any>): void;
  setLevel(level: LogLevel): void;
  getLevel(): LogLevel;
  addTransport(transport: LogTransport): void;
  removeTransport(transport: LogTransport): void;
}

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

/**
 * Log transport interface
 */
export interface LogTransport {
  write(level: LogLevel, message: string, context?: Record<string, any>): void;
  flush(): Promise<void>;
  close(): Promise<void>;
}

/**
 * Console log transport
 */
export interface IConsoleLogTransport extends LogTransport {
  readonly name: 'console';
  readonly colors: boolean;
  readonly timestamps: boolean;
}

/**
 * File log transport
 */
export interface IFileLogTransport extends LogTransport {
  readonly name: 'file';
  readonly filePath: string;
  readonly maxSize: number;
  readonly maxFiles: number;
  readonly rotation: boolean;
}

// ============================================================================
// HTTP Client Interfaces
// ============================================================================

/**
 * HTTP client interface
 */
export interface IHttpClient {
  get(url: string, options?: HttpRequestOptions): Promise<HttpResponse>;
  post(url: string, data?: any, options?: HttpRequestOptions): Promise<HttpResponse>;
  put(url: string, data?: any, options?: HttpRequestOptions): Promise<HttpResponse>;
  delete(url: string, options?: HttpRequestOptions): Promise<HttpResponse>;
  patch(url: string, data?: any, options?: HttpRequestOptions): Promise<HttpResponse>;
  request(options: HttpRequestOptions): Promise<HttpResponse>;
}

/**
 * HTTP request options
 */
export interface HttpRequestOptions {
  readonly method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  readonly headers?: Record<string, string>;
  readonly timeout?: number;
  readonly retries?: number;
  readonly retryDelay?: number;
  readonly followRedirects?: boolean;
  readonly maxRedirects?: number;
  readonly validateSSL?: boolean;
  readonly proxy?: ProxyConfig;
}

/**
 * HTTP response
 */
export interface HttpResponse {
  readonly status: number;
  readonly statusText: string;
  readonly headers: Record<string, string>;
  readonly data: any;
  readonly url: string;
  readonly requestTime: number;
  readonly size: number;
}

/**
 * Proxy configuration
 */
export interface ProxyConfig {
  readonly host: string;
  readonly port: number;
  readonly username?: string;
  readonly password?: string;
  readonly protocol: 'http' | 'https' | 'socks4' | 'socks5';
}

// ============================================================================
// Cache Interfaces
// ============================================================================

/**
 * Cache interface
 */
export interface ICache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  keys(): Promise<string[]>;
  size(): Promise<number>;
  getStats(): Promise<CacheStats>;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  readonly hits: number;
  readonly misses: number;
  readonly size: number;
  readonly maxSize: number;
  readonly hitRate: number;
  readonly evictions: number;
}

/**
 * Memory cache implementation
 */
export interface IMemoryCache extends ICache {
  readonly name: 'memory';
  readonly maxSize: number;
  readonly defaultTTL: number;
}

/**
 * File cache implementation
 */
export interface IFileCache extends ICache {
  readonly name: 'file';
  readonly cacheDir: string;
  readonly maxSize: number;
  readonly defaultTTL: number;
}

// ============================================================================
// Validation Interfaces
// ============================================================================

/**
 * Validator interface
 */
export interface IValidator {
  validate<T>(data: T, schema: ValidationSchema): Promise<ValidationResult>;
  validateFile(path: string, schema: ValidationSchema): Promise<ValidationResult>;
  validateTemplate(template: string): Promise<ValidationResult>;
  validateConfig(config: any): Promise<ValidationResult>;
}

/**
 * Validation schema
 */
export interface ValidationSchema {
  readonly type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  readonly properties?: Record<string, ValidationSchema>;
  readonly items?: ValidationSchema;
  readonly required?: string[];
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly pattern?: string;
  readonly enum?: any[];
  readonly format?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: ValidationError[];
  readonly warnings: ValidationWarning[];
}

/**
 * Validation error
 */
export interface ValidationError {
  readonly path: string;
  readonly message: string;
  readonly code: string;
  readonly value: any;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  readonly path: string;
  readonly message: string;
  readonly code: string;
  readonly value: any;
}

// ============================================================================
// Infrastructure Exceptions
// ============================================================================

/**
 * Base class for infrastructure exceptions
 */
export abstract class InfrastructureException extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  
  constructor(
    message: string,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Exception thrown when AI agent operations fail
 */
export class AIAgentException extends InfrastructureException {
  readonly code = 'AI_AGENT_ERROR';
  readonly statusCode = 502;
  
  constructor(agent: string, operation: string, originalError: Error) {
    super(
      `AI agent '${agent}' failed during '${operation}': ${originalError.message}`,
      { agent, operation, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when file system operations fail
 */
export class FileSystemException extends InfrastructureException {
  readonly code = 'FILE_SYSTEM_ERROR';
  readonly statusCode = 500;
  
  constructor(operation: string, path: string, originalError: Error) {
    super(
      `File system operation '${operation}' failed for path '${path}': ${originalError.message}`,
      { operation, path, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when template operations fail
 */
export class TemplateException extends InfrastructureException {
  readonly code = 'TEMPLATE_ERROR';
  readonly statusCode = 500;
  
  constructor(operation: string, template: string, originalError: Error) {
    super(
      `Template operation '${operation}' failed for template '${template}': ${originalError.message}`,
      { operation, template, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when configuration operations fail
 */
export class ConfigurationException extends InfrastructureException {
  readonly code = 'CONFIGURATION_ERROR';
  readonly statusCode = 500;
  
  constructor(operation: string, key: string, originalError: Error) {
    super(
      `Configuration operation '${operation}' failed for key '${key}': ${originalError.message}`,
      { operation, key, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when HTTP operations fail
 */
export class HttpException extends InfrastructureException {
  readonly code = 'HTTP_ERROR';
  readonly statusCode = 500;
  
  constructor(operation: string, url: string, originalError: Error) {
    super(
      `HTTP operation '${operation}' failed for URL '${url}': ${originalError.message}`,
      { operation, url, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when cache operations fail
 */
export class CacheException extends InfrastructureException {
  readonly code = 'CACHE_ERROR';
  readonly statusCode = 500;
  
  constructor(operation: string, key: string, originalError: Error) {
    super(
      `Cache operation '${operation}' failed for key '${key}': ${originalError.message}`,
      { operation, key, originalError: originalError.message }
    );
  }
}

/**
 * Exception thrown when validation fails
 */
export class ValidationException extends InfrastructureException {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
  
  constructor(operation: string, errors: ValidationError[]) {
    super(
      `Validation failed for '${operation}': ${errors.map(e => e.message).join(', ')}`,
      { operation, errors }
    );
  }
}