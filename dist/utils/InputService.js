"use strict";
/**
 * Input Service
 *
 * Provides interactive input capabilities for the CLI.
 * Uses Node.js readline for user input.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputService = void 0;
const readline = __importStar(require("readline"));
class InputService {
    constructor(output) {
        this.output = output;
    }
    /**
     * Prompt user for input with a question
     */
    async prompt(question, defaultValue) {
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
    async select(question, choices, defaultValue) {
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
    async confirm(question, defaultValue = true) {
        const defaultText = defaultValue ? 'Y/n' : 'y/N';
        const answer = await this.prompt(`${question} [${defaultText}]`);
        if (!answer) {
            return defaultValue;
        }
        const lowerAnswer = answer.toLowerCase();
        return lowerAnswer === 'y' || lowerAnswer === 'yes' || lowerAnswer === 'true';
    }
}
exports.InputService = InputService;
//# sourceMappingURL=InputService.js.map