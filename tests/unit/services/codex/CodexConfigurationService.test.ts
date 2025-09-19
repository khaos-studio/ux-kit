/**
 * Unit tests for CodexConfigurationService
 * 
 * These tests verify the CodexConfigurationService works correctly
 * and provide comprehensive coverage for all service methods.
 */

import { CodexConfigurationService } from '../../../../src/services/codex/CodexConfigurationService';
import { IFileSystemService } from '../../../../src/contracts/infrastructure-contracts';
import { CodexConfiguration } from '../../../../src/contracts/domain-contracts';

describe('CodexConfigurationService', () => {
  let codexConfigurationService: CodexConfigurationService;
  let mockFileSystemService: jest.Mocked<IFileSystemService>;

  beforeEach(() => {
    // Create mock file system service
    mockFileSystemService = {
      readFile: jest.fn(),
      writeFile: jest.fn(),
      fileExists: jest.fn(),
      directoryExists: jest.fn(),
      createDirectory: jest.fn(),
      listFiles: jest.fn(),
      deleteFile: jest.fn(),
      copyFile: jest.fn(),
      moveFile: jest.fn(),
      getFileStats: jest.fn()
    } as jest.Mocked<IFileSystemService>;

    // Create CodexConfigurationService instance
    codexConfigurationService = new CodexConfigurationService(mockFileSystemService);
  });

  describe('constructor', () => {
    it('should create instance with file system service', () => {
      expect(codexConfigurationService).toBeInstanceOf(CodexConfigurationService);
    });
  });

  describe('loadConfiguration', () => {
    it('should load valid configuration successfully', async () => {
      // Given: Valid configuration file exists
      const configContent = JSON.stringify({
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      });

      mockFileSystemService.fileExists.mockResolvedValue(true);
      mockFileSystemService.readFile.mockResolvedValue(configContent);

      // When: Loading configuration
      const config = await codexConfigurationService.loadConfiguration('config/codex.json');

      // Then: Should return valid configuration
      expect(config.enabled).toBe(true);
      expect(config.cliPath).toBe('/usr/local/bin/codex');
      expect(config.validationEnabled).toBe(true);
      expect(config.fallbackToCustom).toBe(false);
      expect(config.templatePath).toBe('templates/codex');
      expect(config.timeout).toBe(5000);
    });

    it('should throw error when configuration file does not exist', async () => {
      // Given: Configuration file does not exist
      mockFileSystemService.fileExists.mockResolvedValue(false);

      // When: Loading configuration
      // Then: Should throw error
      await expect(codexConfigurationService.loadConfiguration('config/codex.json'))
        .rejects.toThrow('Configuration file not found');
    });

    it('should throw error when configuration file is invalid JSON', async () => {
      // Given: Configuration file with invalid JSON
      mockFileSystemService.fileExists.mockResolvedValue(true);
      mockFileSystemService.readFile.mockResolvedValue('invalid json content');

      // When: Loading configuration
      // Then: Should throw error
      await expect(codexConfigurationService.loadConfiguration('config/codex.json'))
        .rejects.toThrow('Invalid configuration file format');
    });

    it('should throw error when configuration is missing required fields', async () => {
      // Given: Configuration file with missing required fields
      const invalidConfig = JSON.stringify({
        enabled: true
        // Missing required fields
      });

      mockFileSystemService.fileExists.mockResolvedValue(true);
      mockFileSystemService.readFile.mockResolvedValue(invalidConfig);

      // When: Loading configuration
      // Then: Should throw error
      await expect(codexConfigurationService.loadConfiguration('config/codex.json'))
        .rejects.toThrow('Invalid configuration');
    });

    it('should handle file system errors gracefully', async () => {
      // Given: File system error
      mockFileSystemService.fileExists.mockRejectedValue(new Error('File system error'));

      // When: Loading configuration
      // Then: Should throw error
      await expect(codexConfigurationService.loadConfiguration('config/codex.json'))
        .rejects.toThrow('File system error');
    });

    it('should handle read file errors gracefully', async () => {
      // Given: File exists but read fails
      mockFileSystemService.fileExists.mockResolvedValue(true);
      mockFileSystemService.readFile.mockRejectedValue(new Error('Read error'));

      // When: Loading configuration
      // Then: Should throw error
      await expect(codexConfigurationService.loadConfiguration('config/codex.json'))
        .rejects.toThrow('Read error');
    });
  });

  describe('saveConfiguration', () => {
    it('should save valid configuration successfully', async () => {
      // Given: Valid configuration
      const config: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      mockFileSystemService.writeFile.mockResolvedValue();

      // When: Saving configuration
      await codexConfigurationService.saveConfiguration(config, 'config/codex.json');

      // Then: Should save configuration
      expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
        'config/codex.json',
        JSON.stringify(config, null, 2)
      );
    });

    it('should create directory if it does not exist', async () => {
      // Given: Valid configuration and non-existent directory
      const config: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      mockFileSystemService.directoryExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockResolvedValue();
      mockFileSystemService.writeFile.mockResolvedValue();

      // When: Saving configuration
      await codexConfigurationService.saveConfiguration(config, 'config/codex.json');

      // Then: Should create directory and save configuration
      expect(mockFileSystemService.createDirectory).toHaveBeenCalledWith('config');
      expect(mockFileSystemService.writeFile).toHaveBeenCalled();
    });

    it('should not create directory if it already exists', async () => {
      // Given: Valid configuration and existing directory
      const config: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      mockFileSystemService.directoryExists.mockResolvedValue(true);
      mockFileSystemService.writeFile.mockResolvedValue();

      // When: Saving configuration
      await codexConfigurationService.saveConfiguration(config, 'config/codex.json');

      // Then: Should not create directory
      expect(mockFileSystemService.createDirectory).not.toHaveBeenCalled();
      expect(mockFileSystemService.writeFile).toHaveBeenCalled();
    });

    it('should throw error when configuration is invalid', async () => {
      // Given: Invalid configuration
      const invalidConfig = {
        enabled: true
        // Missing required fields
      } as any;

      // When: Saving configuration
      // Then: Should throw error
      await expect(codexConfigurationService.saveConfiguration(invalidConfig, 'config/codex.json'))
        .rejects.toThrow('Invalid configuration');
    });

    it('should handle file system errors gracefully', async () => {
      // Given: Valid configuration but file system error
      const config: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      mockFileSystemService.writeFile.mockRejectedValue(new Error('Write error'));

      // When: Saving configuration
      // Then: Should throw error
      await expect(codexConfigurationService.saveConfiguration(config, 'config/codex.json'))
        .rejects.toThrow('Write error');
    });

    it('should handle directory creation errors gracefully', async () => {
      // Given: Valid configuration but directory creation fails
      const config: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      mockFileSystemService.directoryExists.mockResolvedValue(false);
      mockFileSystemService.createDirectory.mockRejectedValue(new Error('Directory creation error'));

      // When: Saving configuration
      // Then: Should throw error
      await expect(codexConfigurationService.saveConfiguration(config, 'config/codex.json'))
        .rejects.toThrow('Directory creation error');
    });
  });

  describe('validateConfiguration', () => {
    it('should return true for valid configuration', async () => {
      // Given: Valid configuration
      const config: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      // When: Validating configuration
      const isValid = await codexConfigurationService.validateConfiguration(config);

      // Then: Should return true
      expect(isValid).toBe(true);
    });

    it('should return true for valid configuration without CLI path', async () => {
      // Given: Valid configuration without CLI path
      const config: CodexConfiguration = {
        enabled: true,
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      // When: Validating configuration
      const isValid = await codexConfigurationService.validateConfiguration(config);

      // Then: Should return true
      expect(isValid).toBe(true);
    });

    it('should return false for configuration with invalid timeout', async () => {
      // Given: Configuration with invalid timeout
      const config: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: -1000 // Invalid negative timeout
      };

      // When: Validating configuration
      const isValid = await codexConfigurationService.validateConfiguration(config);

      // Then: Should return false
      expect(isValid).toBe(false);
    });

    it('should return false for configuration with zero timeout', async () => {
      // Given: Configuration with zero timeout
      const config: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 0 // Invalid zero timeout
      };

      // When: Validating configuration
      const isValid = await codexConfigurationService.validateConfiguration(config);

      // Then: Should return false
      expect(isValid).toBe(false);
    });

    it('should return false for configuration with invalid template path', async () => {
      // Given: Configuration with invalid template path
      const config: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: '', // Invalid empty path
        timeout: 5000
      };

      // When: Validating configuration
      const isValid = await codexConfigurationService.validateConfiguration(config);

      // Then: Should return false
      expect(isValid).toBe(false);
    });

    it('should return false for configuration with invalid CLI path', async () => {
      // Given: Configuration with invalid CLI path
      const config: CodexConfiguration = {
        enabled: true,
        cliPath: '', // Invalid empty path
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      // When: Validating configuration
      const isValid = await codexConfigurationService.validateConfiguration(config);

      // Then: Should return false
      expect(isValid).toBe(false);
    });

    it('should return false for configuration with missing required fields', async () => {
      // Given: Configuration with missing required fields
      const config = {
        enabled: true
        // Missing required fields
      };

      // When: Validating configuration
      const isValid = await codexConfigurationService.validateConfiguration(config);

      // Then: Should return false
      expect(isValid).toBe(false);
    });

    it('should return false for null configuration', async () => {
      // Given: Null configuration
      // When: Validating configuration
      const isValid = await codexConfigurationService.validateConfiguration(null);

      // Then: Should return false
      expect(isValid).toBe(false);
    });

    it('should return false for non-object configuration', async () => {
      // Given: Non-object configuration
      // When: Validating configuration
      const isValid = await codexConfigurationService.validateConfiguration('invalid');

      // Then: Should return false
      expect(isValid).toBe(false);
    });

    it('should return false for configuration with wrong types', async () => {
      // Given: Configuration with wrong types
      const config = {
        enabled: 'true', // Should be boolean
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      // When: Validating configuration
      const isValid = await codexConfigurationService.validateConfiguration(config);

      // Then: Should return false
      expect(isValid).toBe(false);
    });
  });

  describe('getDefaultConfiguration', () => {
    it('should return valid default configuration', () => {
      // Given: Default configuration request
      // When: Getting default configuration
      const defaultConfig = codexConfigurationService.getDefaultConfiguration();

      // Then: Should return valid default configuration
      expect(defaultConfig.enabled).toBe(true);
      expect(defaultConfig.validationEnabled).toBe(true);
      expect(defaultConfig.fallbackToCustom).toBe(false);
      expect(defaultConfig.templatePath).toBe('.codex/templates');
      expect(defaultConfig.timeout).toBe(10000);
      expect(defaultConfig.cliPath).toBeUndefined(); // Optional field
    });

    it('should return configuration with sensible defaults', () => {
      // Given: Default configuration request
      // When: Getting default configuration
      const defaultConfig = codexConfigurationService.getDefaultConfiguration();

      // Then: Should have sensible defaults
      expect(defaultConfig.enabled).toBe(true);
      expect(defaultConfig.validationEnabled).toBe(true);
      expect(defaultConfig.fallbackToCustom).toBe(false);
      expect(defaultConfig.templatePath).toContain('codex');
      expect(defaultConfig.timeout).toBeGreaterThan(0);
    });

    it('should return consistent default configuration', () => {
      // Given: Multiple calls to get default configuration
      // When: Getting default configuration multiple times
      const config1 = codexConfigurationService.getDefaultConfiguration();
      const config2 = codexConfigurationService.getDefaultConfiguration();

      // Then: Should return consistent configuration
      expect(config1).toEqual(config2);
    });
  });

  describe('mergeConfigurations', () => {
    it('should merge configurations with override values', () => {
      // Given: Base configuration and override
      const baseConfig: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      const override = {
        enabled: false,
        timeout: 10000
      };

      // When: Merging configurations
      const mergedConfig = codexConfigurationService.mergeConfigurations(baseConfig, override);

      // Then: Should merge with override values
      expect(mergedConfig.enabled).toBe(false);
      expect(mergedConfig.timeout).toBe(10000);
      expect(mergedConfig.cliPath).toBe('/usr/local/bin/codex');
      expect(mergedConfig.validationEnabled).toBe(true);
      expect(mergedConfig.fallbackToCustom).toBe(false);
      expect(mergedConfig.templatePath).toBe('templates/codex');
    });

    it('should preserve base values when override is empty', () => {
      // Given: Base configuration and empty override
      const baseConfig: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      const override = {};

      // When: Merging configurations
      const mergedConfig = codexConfigurationService.mergeConfigurations(baseConfig, override);

      // Then: Should preserve base values
      expect(mergedConfig).toEqual(baseConfig);
    });

    it('should handle partial override correctly', () => {
      // Given: Base configuration and partial override
      const baseConfig: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      const override = {
        templatePath: 'custom/templates'
      };

      // When: Merging configurations
      const mergedConfig = codexConfigurationService.mergeConfigurations(baseConfig, override);

      // Then: Should override only specified values
      expect(mergedConfig.templatePath).toBe('custom/templates');
      expect(mergedConfig.enabled).toBe(true);
      expect(mergedConfig.cliPath).toBe('/usr/local/bin/codex');
      expect(mergedConfig.validationEnabled).toBe(true);
      expect(mergedConfig.fallbackToCustom).toBe(false);
      expect(mergedConfig.timeout).toBe(5000);
    });

    it('should handle undefined override values correctly', () => {
      // Given: Base configuration and override with undefined values
      const baseConfig: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      const override: Partial<CodexConfiguration> = {
        timeout: 15000
      };
      (override as any).cliPath = undefined;

      // When: Merging configurations
      const mergedConfig = codexConfigurationService.mergeConfigurations(baseConfig, override);

      // Then: Should handle undefined values correctly
      expect(mergedConfig.cliPath).toBeUndefined();
      expect(mergedConfig.timeout).toBe(15000);
      expect(mergedConfig.enabled).toBe(true);
      expect(mergedConfig.validationEnabled).toBe(true);
      expect(mergedConfig.fallbackToCustom).toBe(false);
      expect(mergedConfig.templatePath).toBe('templates/codex');
    });

    it('should handle base configuration without CLI path', () => {
      // Given: Base configuration without CLI path
      const baseConfig: CodexConfiguration = {
        enabled: true,
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      const override = {
        cliPath: '/custom/path/codex'
      };

      // When: Merging configurations
      const mergedConfig = codexConfigurationService.mergeConfigurations(baseConfig, override);

      // Then: Should handle CLI path correctly
      expect(mergedConfig.cliPath).toBe('/custom/path/codex');
      expect(mergedConfig.enabled).toBe(true);
      expect(mergedConfig.validationEnabled).toBe(true);
      expect(mergedConfig.fallbackToCustom).toBe(false);
      expect(mergedConfig.templatePath).toBe('templates/codex');
      expect(mergedConfig.timeout).toBe(5000);
    });

    it('should handle all override values', () => {
      // Given: Base configuration and complete override
      const baseConfig: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      const override: Partial<CodexConfiguration> = {
        enabled: false,
        cliPath: '/custom/codex',
        validationEnabled: false,
        fallbackToCustom: true,
        templatePath: 'custom/templates',
        timeout: 15000
      };

      // When: Merging configurations
      const mergedConfig = codexConfigurationService.mergeConfigurations(baseConfig, override);

      // Then: Should override all values
      expect(mergedConfig.enabled).toBe(false);
      expect(mergedConfig.cliPath).toBe('/custom/codex');
      expect(mergedConfig.validationEnabled).toBe(false);
      expect(mergedConfig.fallbackToCustom).toBe(true);
      expect(mergedConfig.templatePath).toBe('custom/templates');
      expect(mergedConfig.timeout).toBe(15000);
    });
  });

  describe('error handling', () => {
    it('should handle file system service errors consistently', async () => {
      // Given: File system service throws error
      mockFileSystemService.fileExists.mockRejectedValue(new Error('Service error'));

      // When: Loading configuration
      // Then: Should throw error
      await expect(codexConfigurationService.loadConfiguration('config/codex.json'))
        .rejects.toThrow('Service error');
    });

    it('should handle validation errors consistently', async () => {
      // Given: Invalid configuration
      const invalidConfig = {
        enabled: 'invalid' // Wrong type
      };

      // When: Validating configuration
      const isValid = await codexConfigurationService.validateConfiguration(invalidConfig);

      // Then: Should return false
      expect(isValid).toBe(false);
    });

    it('should handle JSON parsing errors gracefully', async () => {
      // Given: Configuration file with malformed JSON
      mockFileSystemService.fileExists.mockResolvedValue(true);
      mockFileSystemService.readFile.mockResolvedValue('{"enabled": true,}'); // Trailing comma

      // When: Loading configuration
      // Then: Should throw error
      await expect(codexConfigurationService.loadConfiguration('config/codex.json'))
        .rejects.toThrow('Invalid configuration file format');
    });
  });

  describe('integration with file system service', () => {
    it('should use file system service for all operations', async () => {
      // Given: Valid configuration
      const config: CodexConfiguration = {
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      };

      mockFileSystemService.directoryExists.mockResolvedValue(true);
      mockFileSystemService.writeFile.mockResolvedValue();

      // When: Saving configuration
      await codexConfigurationService.saveConfiguration(config, 'config/codex.json');

      // Then: Should use file system service
      expect(mockFileSystemService.directoryExists).toHaveBeenCalledWith('config');
      expect(mockFileSystemService.writeFile).toHaveBeenCalled();
    });

    it('should handle file system service method calls correctly', async () => {
      // Given: Configuration file exists
      const configContent = JSON.stringify({
        enabled: true,
        cliPath: '/usr/local/bin/codex',
        validationEnabled: true,
        fallbackToCustom: false,
        templatePath: 'templates/codex',
        timeout: 5000
      });

      mockFileSystemService.fileExists.mockResolvedValue(true);
      mockFileSystemService.readFile.mockResolvedValue(configContent);

      // When: Loading configuration
      await codexConfigurationService.loadConfiguration('config/codex.json');

      // Then: Should call file system service methods correctly
      expect(mockFileSystemService.fileExists).toHaveBeenCalledWith('config/codex.json');
      expect(mockFileSystemService.readFile).toHaveBeenCalledWith('config/codex.json');
    });
  });
});
