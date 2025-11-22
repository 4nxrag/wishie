/**
 * Render template by replacing variables with actual data
 * Supports: {{name}}, {{age}}, {{relation}}, {{year}}, {{eventType}}
 * 
 * @param {String} template - Template string with variables
 * @param {Object} data - Data object with values
 * @returns {String} - Rendered message
 */
export const renderTemplate = (template, data) => {
  let rendered = template;

  // Replace all variables
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    const value = data[key] !== null && data[key] !== undefined ? data[key] : '';
    rendered = rendered.replace(regex, value);
  });

  // Bug fix: Clean up any remaining unreplaced variables
  rendered = rendered.replace(/{{.*?}}/g, '');

  // Bug fix: Clean up extra spaces
  rendered = rendered.replace(/\s+/g, ' ').trim();

  return rendered;
};

/**
 * Example usage:
 * 
 * const template = "Happy {{age}}th Birthday {{name}}! 🎂";
 * const data = { name: "Mom", age: 50 };
 * const message = renderTemplate(template, data);
 * // Result: "Happy 50th Birthday Mom! 🎂"
 */
