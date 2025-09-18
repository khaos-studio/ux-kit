/**
 * Command Registry
 * 
 * Manages registration, storage, and retrieval of CLI commands.
 */

import { ICommand } from '../contracts/presentation-contracts';

export class CommandRegistry {
  private commands: Map<string, ICommand> = new Map();

  register(command: ICommand): void {
    this.commands.set(command.name, command);
  }

  unregister(name: string): void {
    this.commands.delete(name);
  }

  get(name: string): ICommand | undefined {
    return this.commands.get(name);
  }

  has(name: string): boolean {
    return this.commands.has(name);
  }

  list(): ICommand[] {
    return Array.from(this.commands.values());
  }

  clear(): void {
    this.commands.clear();
  }

  size(): number {
    return this.commands.size;
  }
}
