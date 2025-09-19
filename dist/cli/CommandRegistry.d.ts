/**
 * Command Registry
 *
 * Manages registration, storage, and retrieval of CLI commands.
 */
import { ICommand } from '../contracts/presentation-contracts';
export declare class CommandRegistry {
    private commands;
    register(command: ICommand): void;
    unregister(name: string): void;
    get(name: string): ICommand | undefined;
    has(name: string): boolean;
    list(): ICommand[];
    clear(): void;
    size(): number;
}
