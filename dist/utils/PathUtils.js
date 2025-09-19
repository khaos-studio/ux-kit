"use strict";
/**
 * Path Utilities
 *
 * Cross-platform path handling utilities for UX-Kit.
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
exports.PathUtils = void 0;
const path = __importStar(require("path"));
class PathUtils {
    /**
     * Join multiple path segments into a single path
     */
    static joinPaths(...paths) {
        return path.join(...paths);
    }
    /**
     * Extract the basename from a path
     */
    static basename(filePath, ext) {
        return path.basename(filePath, ext);
    }
    /**
     * Extract the directory name from a path
     */
    static dirname(filePath) {
        return path.dirname(filePath);
    }
    /**
     * Get the file extension from a path
     */
    static getExtension(filePath) {
        return path.extname(filePath);
    }
    /**
     * Check if a path is absolute
     */
    static isAbsolute(filePath) {
        return path.isAbsolute(filePath);
    }
    /**
     * Resolve a path to an absolute path
     */
    static resolve(...paths) {
        return path.resolve(...paths);
    }
    /**
     * Normalize a path by resolving '..' and '.' segments
     */
    static normalize(filePath) {
        return path.normalize(filePath);
    }
    /**
     * Get the relative path from one path to another
     */
    static relative(from, to) {
        return path.relative(from, to);
    }
}
exports.PathUtils = PathUtils;
//# sourceMappingURL=PathUtils.js.map