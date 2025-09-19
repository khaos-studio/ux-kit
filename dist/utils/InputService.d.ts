/**
 * Input Service
 *
 * Provides interactive input capabilities for the CLI.
 * Uses Node.js readline for user input.
 */
import { IOutput } from '../contracts/presentation-contracts';
export interface Choice {
    value: string;
    label: string;
    description?: string;
}
export declare class InputService {
    private output;
    constructor(output: IOutput);
    /**
     * Prompt user for input with a question
     */
    prompt(question: string, defaultValue?: string): Promise<string>;
    /**
     * Prompt user to select from multiple choices
     */
    select(question: string, choices: Choice[], defaultValue?: string): Promise<string>;
    /**
     * Prompt for yes/no confirmation
     */
    confirm(question: string, defaultValue?: boolean): Promise<boolean>;
}
