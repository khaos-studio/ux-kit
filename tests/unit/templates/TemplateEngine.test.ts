/**
 * Unit Tests for TemplateEngine
 */

import { TemplateEngine } from '../../../src/templates/TemplateEngine';

describe('TemplateEngine Unit Tests', () => {
  let templateEngine: TemplateEngine;

  beforeEach(() => {
    templateEngine = new TemplateEngine();
  });

  describe('Variable Substitution', () => {
    it('should substitute simple variables', async () => {
      const template = 'Hello {{name}}!';
      const variables = { name: 'World' };
      
      const result = await templateEngine.render(template, variables);
      
      expect(result).toBe('Hello World!');
    });

    it('should substitute multiple variables', async () => {
      const template = '{{greeting}} {{name}}, welcome to {{project}}!';
      const variables = { greeting: 'Hello', name: 'John', project: 'UX-Kit' };
      
      const result = await templateEngine.render(template, variables);
      
      expect(result).toBe('Hello John, welcome to UX-Kit!');
    });

    it('should handle nested object variables', async () => {
      const template = 'User: {{user.name}}, Email: {{user.email}}';
      const variables = { 
        user: { 
          name: 'John Doe', 
          email: 'john@example.com' 
        } 
      };
      
      const result = await templateEngine.render(template, variables);
      
      expect(result).toBe('User: John Doe, Email: john@example.com');
    });

    it('should handle missing variables gracefully', async () => {
      const template = 'Hello {{name}}, missing: {{missing}}';
      const variables = { name: 'John' };
      
      const result = await templateEngine.render(template, variables);
      
      expect(result).toBe('Hello John, missing: ');
    });
  });

  describe('Conditional Blocks', () => {
    it('should render if block when condition is true', async () => {
      const template = '{{#if show}}Content is shown{{/if}}';
      const variables = { show: true };
      
      const result = await templateEngine.render(template, variables);
      
      expect(result).toBe('Content is shown');
    });

    it('should not render if block when condition is false', async () => {
      const template = '{{#if show}}Content is shown{{/if}}';
      const variables = { show: false };
      
      const result = await templateEngine.render(template, variables);
      
      expect(result).toBe('');
    });

    it('should handle if-else blocks', async () => {
      const template = '{{#if show}}Content is shown{{else}}Content is hidden{{/if}}';
      const variables = { show: false };
      
      const result = await templateEngine.render(template, variables);
      
      expect(result).toBe('Content is hidden');
    });

    it('should handle nested variables in conditionals', async () => {
      const template = '{{#if user.loggedIn}}Welcome {{user.name}}{{else}}Please log in{{/if}}';
      const variables = { 
        user: { 
          loggedIn: true, 
          name: 'John' 
        } 
      };
      
      const result = await templateEngine.render(template, variables);
      
      expect(result).toBe('Welcome John');
    });
  });

  describe('Array Iteration', () => {
    it('should iterate over array items', async () => {
      const template = '{{#each items}}- {{this}}\n{{/each}}';
      const variables = { items: ['item1', 'item2', 'item3'] };
      
      const result = await templateEngine.render(template, variables);
      
      expect(result).toBe('- item1\n- item2\n- item3\n');
    });

    it('should handle empty arrays', async () => {
      const template = '{{#each items}}- {{this}}\n{{/each}}';
      const variables = { items: [] };
      
      const result = await templateEngine.render(template, variables);
      
      expect(result).toBe('');
    });

    it('should handle non-array values in each blocks', async () => {
      const template = '{{#each items}}- {{this}}\n{{/each}}';
      const variables = { items: 'not an array' };
      
      const result = await templateEngine.render(template, variables);
      
      expect(result).toBe('');
    });
  });

  describe('Partials', () => {
    it('should render template with partials', async () => {
      const template = '{{> header}}\nContent\n{{> footer}}';
      const partials = {
        header: 'Header Content',
        footer: 'Footer Content'
      };
      const variables = {};
      
      const result = await templateEngine.renderWithPartials(template, partials, variables);
      
      expect(result).toBe('Header Content\nContent\nFooter Content');
    });

    it('should handle missing partials', async () => {
      const template = '{{> header}}\nContent';
      const partials = {};
      const variables = {};
      
      const result = await templateEngine.renderWithPartials(template, partials, variables);
      
      expect(result).toBe('{{> header}}\nContent');
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid template syntax', async () => {
      const template = 'Invalid template with {{unclosed braces';
      const variables = {};
      
      await expect(templateEngine.render(template, variables))
        .rejects.toThrow('Template rendering failed');
    });

    it('should handle empty template', async () => {
      const template = '';
      const variables = { name: 'John' };
      
      const result = await templateEngine.render(template, variables);
      
      expect(result).toBe('');
    });

    it('should handle template with no variables', async () => {
      const template = 'This is a static template.';
      const variables = {};
      
      const result = await templateEngine.render(template, variables);
      
      expect(result).toBe('This is a static template.');
    });
  });
});
