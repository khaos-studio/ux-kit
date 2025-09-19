/**
 * Configuration Validator for UX-Kit
 *
 * Validates configuration objects against the expected schema
 * and provides detailed error messages for invalid configurations.
 */
import { PartialConfiguration } from './DefaultConfiguration';
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare class ConfigurationValidator {
    /**
     * Validate a configuration object
     */
    validate(config: any): ValidationResult;
    /**
     * Validate templates configuration
     */
    private validateTemplates;
    /**
     * Validate output configuration
     */
    private validateOutput;
    /**
     * Validate research configuration
     */
    private validateResearch;
    /**
     * Validate a partial configuration update
     */
    validateUpdate(update: PartialConfiguration): ValidationResult;
}
