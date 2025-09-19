/**
 * TemplateEngine - Handles template rendering with variable substitution
 *
 * This class provides template rendering capabilities using Handlebars-style syntax
 * for variable substitution, conditionals, and iteration.
 */
export interface TemplateVariables {
    [key: string]: any;
}
export interface TemplatePartials {
    [key: string]: string;
}
export declare class TemplateEngine {
    /**
     * Renders a template with the provided variables
     * @param template The template string to render
     * @param variables The variables to substitute in the template
     * @returns The rendered template string
     */
    render(template: string, variables: TemplateVariables): Promise<string>;
    /**
     * Renders a template with partials and variables
     * @param template The template string to render
     * @param partials The partial templates to include
     * @param variables The variables to substitute in the template
     * @returns The rendered template string
     */
    renderWithPartials(template: string, partials: TemplatePartials, variables: TemplateVariables): Promise<string>;
    /**
     * Internal method to render template with variables
     * @param template The template string
     * @param variables The variables to substitute
     * @returns The rendered template string
     */
    private renderTemplate;
    /**
     * Gets the value of a variable from the variables object
     * @param variables The variables object
     * @param path The dot-notation path to the variable
     * @returns The variable value or empty string if not found
     */
    private getVariableValue;
    /**
     * Renders conditional blocks in the template
     * @param template The template string
     * @param variables The variables object
     * @returns The template with conditionals rendered
     */
    private renderConditionals;
    /**
     * Renders iteration blocks in the template
     * @param template The template string
     * @param variables The variables object
     * @returns The template with iterations rendered
     */
    private renderIterations;
    /**
     * Checks if template has unclosed braces
     * @param template The template string
     * @returns True if there are unclosed braces
     */
    private hasUnclosedBraces;
}
