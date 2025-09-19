/**
 * Unit tests for DirectoryStructureService
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { DirectoryStructureService, DirectoryCreationResult, DirectoryInfo } from '../../../src/services/DirectoryStructureService';

// Mock fs-extra
jest.mock('fs-extra');

const mockFs = fs as jest.Mocked<typeof fs>;

describe('DirectoryStructureService', () => {
  let service: DirectoryStructureService;
  const mockProjectRoot = '/mock/project/root';

  beforeEach(() => {
    service = new DirectoryStructureService(mockProjectRoot);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should use provided project root', () => {
      const customRoot = '/custom/root';
      const customService = new DirectoryStructureService(customRoot);
      expect(customService).toBeInstanceOf(DirectoryStructureService);
    });

    it('should use current working directory as default', () => {
      const defaultService = new DirectoryStructureService();
      expect(defaultService).toBeInstanceOf(DirectoryStructureService);
    });
  });

  describe('createCodexDirectoryStructure', () => {
    beforeEach(() => {
      // Mock successful directory creation
      mockFs.existsSync.mockReturnValue(false);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true } as any);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);
    });

    it('should create all required directories successfully', async () => {
      const result = await service.createCodexDirectoryStructure();

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.createdDirectories).toHaveLength(5);
      expect(result.createdDirectories).toContain('src/services/codex');
      expect(result.createdDirectories).toContain('src/contracts/codex');
      expect(result.createdDirectories).toContain('tests/unit/services/codex');
      expect(result.createdDirectories).toContain('tests/integration/codex');
      expect(result.createdDirectories).toContain('templates/codex-commands');
    });

    it('should handle directory creation errors', async () => {
      (mockFs.ensureDir as any).mockRejectedValue(new Error('Permission denied'));

      const result = await service.createCodexDirectoryStructure();

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Failed to create directory');
    });

    it('should handle .gitkeep file creation errors', async () => {
      (mockFs.writeFile as any).mockRejectedValue(new Error('Write permission denied'));

      const result = await service.createCodexDirectoryStructure();

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Failed to create .gitkeep file');
    });

    it('should handle existing directories gracefully', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true } as any);

      const result = await service.createCodexDirectoryStructure();

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle non-directory conflicts', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ isDirectory: () => false } as any);

      const result = await service.createCodexDirectoryStructure();

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Path exists but is not a directory');
    });
  });

  describe('verifyDirectoryStructure', () => {
    it('should return directory info for all required directories', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true } as any);
      mockFs.writeFileSync.mockImplementation(() => {});
      mockFs.unlinkSync.mockImplementation(() => {});

      const result = await service.verifyDirectoryStructure();

      expect(result).toHaveLength(5);
      expect(result.every(info => info.exists && info.isDirectory && info.isWritable)).toBe(true);
    });

    it('should handle non-existent directories', async () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = await service.verifyDirectoryStructure();

      expect(result).toHaveLength(5);
      expect(result.every(info => !info.exists && !info.isDirectory && !info.isWritable)).toBe(true);
    });

    it('should handle non-directory paths', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ isDirectory: () => false } as any);

      const result = await service.verifyDirectoryStructure();

      expect(result).toHaveLength(5);
      expect(result.every(info => info.exists && !info.isDirectory && !info.isWritable)).toBe(true);
    });

    it('should handle non-writable directories', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true } as any);
      mockFs.writeFileSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const result = await service.verifyDirectoryStructure();

      expect(result).toHaveLength(5);
      expect(result.every(info => info.exists && info.isDirectory && !info.isWritable)).toBe(true);
    });
  });

  describe('areAllDirectoriesCreated', () => {
    it('should return true when all directories exist', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true } as any);
      mockFs.writeFileSync.mockImplementation(() => {});
      mockFs.unlinkSync.mockImplementation(() => {});

      const result = await service.areAllDirectoriesCreated();

      expect(result).toBe(true);
    });

    it('should return false when some directories are missing', async () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = await service.areAllDirectoriesCreated();

      expect(result).toBe(false);
    });
  });

  describe('getDirectoryStatus', () => {
    it('should return all created status when directories exist', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true } as any);
      mockFs.writeFileSync.mockImplementation(() => {});
      mockFs.unlinkSync.mockImplementation(() => {});

      const result = await service.getDirectoryStatus();

      expect(result.allCreated).toBe(true);
      expect(result.missingDirectories).toHaveLength(0);
      expect(result.inaccessibleDirectories).toHaveLength(0);
    });

    it('should return missing directories when they do not exist', async () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = await service.getDirectoryStatus();

      expect(result.allCreated).toBe(false);
      expect(result.missingDirectories).toHaveLength(5);
      expect(result.inaccessibleDirectories).toHaveLength(0);
    });

    it('should return inaccessible directories when they are not writable', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true } as any);
      mockFs.writeFileSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const result = await service.getDirectoryStatus();

      expect(result.allCreated).toBe(false);
      expect(result.missingDirectories).toHaveLength(0);
      expect(result.inaccessibleDirectories).toHaveLength(5);
    });
  });

  describe('createDirectory', () => {
    it('should return true when directory is created successfully', async () => {
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);

      const result = await service.createDirectory('/test/directory');

      expect(result).toBe(true);
      expect(mockFs.ensureDir).toHaveBeenCalledWith('/test/directory');
    });

    it('should return false when directory creation fails', async () => {
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.ensureDir as any).mockRejectedValue(new Error('Permission denied'));

      const result = await service.createDirectory('/test/directory');

      expect(result).toBe(false);
    });
  });

  describe('createGitkeep', () => {
    it('should return true when .gitkeep file is created successfully', async () => {
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      const result = await service.createGitkeep('/test/directory');

      expect(result).toBe(true);
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        '/test/directory/.gitkeep',
        '# This file ensures the directory is tracked by git\n'
      );
    });

    it('should return false when .gitkeep file creation fails', async () => {
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.writeFile as any).mockRejectedValue(new Error('Permission denied'));

      const result = await service.createGitkeep('/test/directory');

      expect(result).toBe(false);
    });
  });
});
