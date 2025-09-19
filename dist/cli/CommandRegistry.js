"use strict";
/**
 * Command Registry
 *
 * Manages registration, storage, and retrieval of CLI commands.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandRegistry = void 0;
class CommandRegistry {
    constructor() {
        this.commands = new Map();
    }
    register(command) {
        this.commands.set(command.name, command);
    }
    unregister(name) {
        this.commands.delete(name);
    }
    get(name) {
        return this.commands.get(name);
    }
    has(name) {
        return this.commands.has(name);
    }
    list() {
        return Array.from(this.commands.values());
    }
    clear() {
        this.commands.clear();
    }
    size() {
        return this.commands.size;
    }
}
exports.CommandRegistry = CommandRegistry;
//# sourceMappingURL=CommandRegistry.js.map