/**
 * Validation Service
 *
 * Main validation service that orchestrates all validation operations.
 */
import { ValidationResult, ValidationRule } from './ValidationResult';
import { InputValidator } from './InputValidator';
import { ConfigValidator, UXKitConfig } from './ConfigValidator';
import { FileValidator } from './FileValidator';
export interface WorkflowInputs {
    studyName: string;
    studyId: string;
    command: string;
    config: UXKitConfig;
}
export interface StudyCreationInputs {
    name: string;
    id: string;
    description?: string;
}
export interface ResearchCommandInputs {
    command: string;
    studyId: string;
    options?: {
        count?: number;
        category?: string;
        [key: string]: any;
    };
}
export declare class ValidationService {
    private inputValidator;
    private configValidator;
    private fileValidator;
    constructor();
    /**
     * Validate complete UX-Kit workflow inputs
     */
    validateWorkflow(inputs: WorkflowInputs): ValidationResult;
    /**
     * Validate study creation inputs
     */
    validateStudyCreation(inputs: StudyCreationInputs | null | undefined): ValidationResult;
    /**
     * Validate research command inputs
     */
    validateResearchCommand(inputs: ResearchCommandInputs): ValidationResult;
    /**
     * Validate with custom rules
     */
    validateWithCustomRules(value: string, rules: Record<string, ValidationRule>): ValidationResult;
    /**
     * Validate file upload
     */
    validateFileUpload(filePath: string, allowedExtensions: string[], maxSizeBytes: number): Promise<ValidationResult>;
    /**
     * Validate template file
     */
    validateTemplateFile(content: string, requiredVariables?: string[]): ValidationResult;
    /**
     * Validate configuration file
     */
    validateConfigurationFile(filePath: string, content: string): ValidationResult;
    /**
     * Get input validator
     */
    getInputValidator(): InputValidator;
    /**
     * Get config validator
     */
    getConfigValidator(): ConfigValidator;
    /**
     * Get file validator
     */
    getFileValidator(): FileValidator;
}
