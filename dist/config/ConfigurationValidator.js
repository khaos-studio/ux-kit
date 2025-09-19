"use strict";
/**
 * Configuration Validator for UX-Kit
 *
 * Validates configuration objects against the expected schema
 * and provides detailed error messages for invalid configurations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationValidator = void 0;
class ConfigurationValidator {
    /**
     * Validate a configuration object
     */
    validate(config) {
        const errors = [];
        // Validate top-level structure
        if (!config || typeof config !== 'object') {
            errors.push('Configuration must be an object');
            return { isValid: false, errors };
        }
        // Validate version
        if (!config.version) {
            errors.push('version is required');
        }
        else if (typeof config.version !== 'string') {
            errors.push('version must be a string');
        }
        // Validate templates
        if (!config.templates) {
            errors.push('templates is required');
        }
        else if (typeof config.templates !== 'object') {
            errors.push('templates must be an object');
        }
        else {
            this.validateTemplates(config.templates, errors);
        }
        // Validate output
        if (!config.output) {
            errors.push('output is required');
        }
        else if (typeof config.output !== 'object') {
            errors.push('output must be an object');
        }
        else {
            this.validateOutput(config.output, errors);
        }
        // Validate research
        if (!config.research) {
            errors.push('research is required');
        }
        else if (typeof config.research !== 'object') {
            errors.push('research must be an object');
        }
        else {
            this.validateResearch(config.research, errors);
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    /**
     * Validate templates configuration
     */
    validateTemplates(templates, errors) {
        if (!templates.directory) {
            errors.push('templates.directory is required');
        }
        else if (typeof templates.directory !== 'string') {
            errors.push('templates.directory must be a string');
        }
        if (!templates.format) {
            errors.push('templates.format is required');
        }
        else if (typeof templates.format !== 'string') {
            errors.push('templates.format must be a string');
        }
        else if (!['markdown'].includes(templates.format)) {
            errors.push('templates.format must be one of: markdown');
        }
    }
    /**
     * Validate output configuration
     */
    validateOutput(output, errors) {
        if (!output.directory) {
            errors.push('output.directory is required');
        }
        else if (typeof output.directory !== 'string') {
            errors.push('output.directory must be a string');
        }
        if (!output.format) {
            errors.push('output.format is required');
        }
        else if (typeof output.format !== 'string') {
            errors.push('output.format must be a string');
        }
        else if (!['markdown'].includes(output.format)) {
            errors.push('output.format must be one of: markdown');
        }
    }
    /**
     * Validate research configuration
     */
    validateResearch(research, errors) {
        if (!research.defaultStudy) {
            errors.push('research.defaultStudy is required');
        }
        else if (typeof research.defaultStudy !== 'string') {
            errors.push('research.defaultStudy must be a string');
        }
        if (research.autoSave === undefined) {
            errors.push('research.autoSave is required');
        }
        else if (typeof research.autoSave !== 'boolean') {
            errors.push('research.autoSave must be a boolean');
        }
    }
    /**
     * Validate a partial configuration update
     */
    validateUpdate(update) {
        const errors = [];
        if (!update || typeof update !== 'object') {
            errors.push('Update must be an object');
            return { isValid: false, errors };
        }
        // Validate templates update
        if (update.templates) {
            if (typeof update.templates !== 'object') {
                errors.push('templates must be an object');
            }
            else {
                this.validateTemplates(update.templates, errors);
            }
        }
        // Validate output update
        if (update.output) {
            if (typeof update.output !== 'object') {
                errors.push('output must be an object');
            }
            else {
                this.validateOutput(update.output, errors);
            }
        }
        // Validate research update
        if (update.research) {
            if (typeof update.research !== 'object') {
                errors.push('research must be an object');
            }
            else {
                this.validateResearch(update.research, errors);
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
exports.ConfigurationValidator = ConfigurationValidator;
//# sourceMappingURL=ConfigurationValidator.js.map