/**
 * Input Service
 * 
 * Provides interactive input capabilities for the CLI.
 * Uses Node.js readline for user input.
 */

import * as readline from 'readline';
import { IOutput } from '../contracts/presentation-contracts';

export interface Choice {
  value: string;
  label: string;
  description?: string;
}

export class InputService {
  constructor(private output: IOutput) {}

  /**
   * Prompt user for input with a question
   */
  async prompt(question: string, defaultValue?: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      const promptText = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
      
      rl.question(promptText, (answer) => {
        rl.close();
        resolve(answer.trim() || defaultValue || '');
      });
    });
  }

  /**
   * Prompt user to select from multiple choices
   */
  async select(question: string, choices: Choice[], defaultValue?: string): Promise<string> {
    this.output.writeln(`\n${question}`);
    this.output.writeln('');
    
    choices.forEach((choice, index) => {
      const number = index + 1;
      const description = choice.description ? ` - ${choice.description}` : '';
      this.output.writeln(`  ${number}. ${choice.label}${description}`);
    });
    
    this.output.writeln('');
    
    const validChoices = choices.map((_, index) => (index + 1).toString());
    const defaultChoice = defaultValue ? choices.findIndex(c => c.value === defaultValue) + 1 : 1;
    
    while (true) {
      const answer = await this.prompt('Select an option', defaultChoice.toString());
      
      if (validChoices.includes(answer)) {
        const selectedIndex = parseInt(answer) - 1;
        const selectedChoice = choices[selectedIndex];
        if (selectedChoice) {
          this.output.writeln(`✓ Selected: ${selectedChoice.label}`);
          this.output.writeln('');
          return selectedChoice.value;
        }
      }
      
      this.output.writeErrorln('Invalid selection. Please enter a valid number.');
    }
  }

  /**
   * Prompt for yes/no confirmation
   */
  async confirm(question: string, defaultValue: boolean = true): Promise<boolean> {
    const defaultText = defaultValue ? 'Y/n' : 'y/N';
    const answer = await this.prompt(`${question} [${defaultText}]`);
    
    if (!answer) {
      return defaultValue;
    }
    
    const lowerAnswer = answer.toLowerCase();
    return lowerAnswer === 'y' || lowerAnswer === 'yes' || lowerAnswer === 'true';
  }
}
