/**
 * Infrastructure Layer Contracts
 * 
 * Simplified contracts for the infrastructure layer implementation.
 */

export interface IFileSystemService {
  createDirectory(path: string, recursive?: boolean): Promise<void>;
  ensureDirectoryExists(path: string): Promise<void>;
  writeFile(path: string, content: string): Promise<void>;
  readFile(path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
  deleteDirectory(path: string, recursive?: boolean): Promise<void>;
  pathExists(path: string): Promise<boolean>;
  isDirectory(path: string): Promise<boolean>;
  listFiles(path: string, extension?: string): Promise<string[]>;
  listDirectories(path: string): Promise<string[]>;
  joinPaths(...paths: string[]): string;
  basename(path: string, ext?: string): string;
  dirname(path: string): string;
}
