/**
 * T015: CodexConfigurationService - Use Case Tests
 * 
 * These tests define the expected behavior for the CodexConfigurationService
 * before implementing the actual service logic.
 */

import { CodexConfigurationService } from '../../src/services/codex/CodexConfigurationService';
import { IFileSystemService } from '../../src/contracts/infrastructure-contracts';
import { CodexConfiguration } from '../../src/contracts/domain-contracts';

// Mock the file system service
jest.mock('../../src/contracts/infrastructure-contracts');

describe('T015: CodexConfigurationService - Use Cases', () => {
  
  describe('Given a CodexConfigurationService', () => {
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

    describe('When loading configuration from file', () => {
      it('Then should load valid configuration successfully', async () => {
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

      it('Then should throw error when configuration file does not exist', async () => {
        // Given: Configuration file does not exist
        mockFileSystemService.fileExists.mockResolvedValue(false);

        // When: Loading configuration
        // Then: Should throw error
        await expect(codexConfigurationService.loadConfiguration('config/codex.json'))
          .rejects.toThrow('Configuration file not found');
      });

      it('Then should throw error when configuration file is invalid JSON', async () => {
        // Given: Configuration file with invalid JSON
        mockFileSystemService.fileExists.mockResolvedValue(true);
        mockFileSystemService.readFile.mockResolvedValue('invalid json content');

        // When: Loading configuration
        // Then: Should throw error
        await expect(codexConfigurationService.loadConfiguration('config/codex.json'))
          .rejects.toThrow('Invalid configuration file format');
      });

      it('Then should throw error when configuration is missing required fields', async () => {
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

      it('Then should handle file system errors gracefully', async () => {
        // Given: File system error
        mockFileSystemService.fileExists.mockRejectedValue(new Error('File system error'));

        // When: Loading configuration
        // Then: Should throw error
        await expect(codexConfigurationService.loadConfiguration('config/codex.json'))
          .rejects.toThrow('File system error');
      });
    });

    describe('When saving configuration to file', () => {
      it('Then should save valid configuration successfully', async () => {
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

      it('Then should create directory if it does not exist', async () => {
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

      it('Then should throw error when configuration is invalid', async () => {
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

      it('Then should handle file system errors gracefully', async () => {
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
    });

    describe('When validating configuration', () => {
      it('Then should return true for valid configuration', async () => {
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

      it('Then should return false for configuration with invalid timeout', async () => {
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

      it('Then should return false for configuration with invalid template path', async () => {
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

      it('Then should return false for configuration with invalid CLI path', async () => {
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

      it('Then should return true for configuration with optional CLI path', async () => {
        // Given: Configuration with optional CLI path
        const config: CodexConfiguration = {
          enabled: true,
          // cliPath is optional
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
    });

    describe('When getting default configuration', () => {
      it('Then should return valid default configuration', () => {
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

      it('Then should return configuration with sensible defaults', () => {
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
    });

    describe('When merging configurations', () => {
      it('Then should merge configurations with override values', () => {
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

      it('Then should preserve base values when override is empty', () => {
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

      it('Then should handle partial override correctly', () => {
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

      it('Then should handle undefined override values correctly', () => {
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
    });

    describe('When handling configuration workflow', () => {
      it('Then should complete full configuration workflow', async () => {
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

        // When: Completing full workflow
        const isValid = await codexConfigurationService.validateConfiguration(config);
        await codexConfigurationService.saveConfiguration(config, 'config/codex.json');

        // Then: Should complete successfully
        expect(isValid).toBe(true);
        expect(mockFileSystemService.writeFile).toHaveBeenCalled();
      });

      it('Then should handle configuration loading and merging workflow', async () => {
        // Given: Base configuration file and override
        const baseConfigContent = JSON.stringify({
          enabled: true,
          cliPath: '/usr/local/bin/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          templatePath: 'templates/codex',
          timeout: 5000
        });

        mockFileSystemService.fileExists.mockResolvedValue(true);
        mockFileSystemService.readFile.mockResolvedValue(baseConfigContent);

        const override = {
          timeout: 10000,
          enabled: false
        };

        // When: Loading and merging configurations
        const baseConfig = await codexConfigurationService.loadConfiguration('config/codex.json');
        const mergedConfig = codexConfigurationService.mergeConfigurations(baseConfig, override);

        // Then: Should merge correctly
        expect(mergedConfig.enabled).toBe(false);
        expect(mergedConfig.timeout).toBe(10000);
        expect(mergedConfig.cliPath).toBe('/usr/local/bin/codex');
      });

      it('Then should handle configuration validation errors gracefully', async () => {
        // Given: Invalid configuration
        const invalidConfig: CodexConfiguration = {
          enabled: true,
          cliPath: '/usr/local/bin/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          templatePath: '', // Invalid empty path
          timeout: 5000
        };

        // When: Validating invalid configuration
        const isValid = await codexConfigurationService.validateConfiguration(invalidConfig);

        // Then: Should return false
        expect(isValid).toBe(false);
      });
    });

    describe('When handling edge cases and error scenarios', () => {
      it('Then should handle malformed JSON gracefully', async () => {
        // Given: Configuration file with malformed JSON
        mockFileSystemService.fileExists.mockResolvedValue(true);
        mockFileSystemService.readFile.mockResolvedValue('{"enabled": true,}'); // Trailing comma

        // When: Loading configuration
        // Then: Should throw error
        await expect(codexConfigurationService.loadConfiguration('config/codex.json'))
          .rejects.toThrow('Invalid configuration file format');
      });

      it('Then should handle very large configuration files', async () => {
        // Given: Very large configuration file
        const largeConfig = {
          enabled: true,
          cliPath: '/usr/local/bin/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          templatePath: 'templates/codex',
          timeout: 5000,
          extraData: 'x'.repeat(10000) // Large extra data
        };

        mockFileSystemService.writeFile.mockResolvedValue();

        // When: Saving large configuration
        await codexConfigurationService.saveConfiguration(largeConfig as any, 'config/codex.json');

        // Then: Should handle large files
        expect(mockFileSystemService.writeFile).toHaveBeenCalled();
      });

      it('Then should handle special characters in file paths', async () => {
        // Given: Configuration with special characters in path
        const config: CodexConfiguration = {
          enabled: true,
          cliPath: '/usr/local/bin/codex',
          validationEnabled: true,
          fallbackToCustom: false,
          templatePath: 'templates/codex-v2',
          timeout: 5000
        };

        mockFileSystemService.writeFile.mockResolvedValue();

        // When: Saving configuration with special characters
        await codexConfigurationService.saveConfiguration(config, 'config/codex-v2.json');

        // Then: Should handle special characters
        expect(mockFileSystemService.writeFile).toHaveBeenCalledWith(
          'config/codex-v2.json',
          expect.any(String)
        );
      });
    });
  });
});
