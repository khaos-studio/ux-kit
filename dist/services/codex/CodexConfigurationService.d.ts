/**
 * CodexConfigurationService
 *
 * This service provides configuration management functionality for Codex,
 * implementing the IConfigurationService interface.
 */
import { IConfigurationService } from '../../contracts/infrastructure-contracts';
import { IFileSystemService } from '../../contracts/infrastructure-contracts';
import { CodexConfiguration } from '../../contracts/domain-contracts';
/**
 * Service for managing Codex configuration
 */
export declare class CodexConfigurationService implements IConfigurationService {
    private fileSystemService;
    constructor(fileSystemService: IFileSystemService);
    /**
     * Load configuration from file
     */
    loadConfiguration(filePath: string): Promise<CodexConfiguration>;
    /**
     * Save configuration to file
     */
    saveConfiguration(config: CodexConfiguration, filePath: string): Promise<void>;
    /**
     * Validate configuration
     */
    validateConfiguration(config: any): Promise<boolean>;
    /**
     * Get default configuration
     */
    getDefaultConfiguration(): CodexConfiguration;
    /**
     * Merge configurations
     */
    mergeConfigurations(base: CodexConfiguration, override: Partial<CodexConfiguration>): CodexConfiguration;
}
