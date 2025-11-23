/**
 * Render template by replacing variables with actual data
 * Supports: {{name}}, {{age}}, {{relation}}, {{year}}, {{eventType}}
 */
export const renderTemplate = (template, data) => {
  let rendered = template;

  // Replace all variables
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    const value = data[key] !== null && data[key] !== undefined ? data[key] : '';
    rendered = rendered.replace(regex, value);
  });

  // Clean up any remaining unreplaced variables
  rendered = rendered.replace(/{{.*?}}/g, '');

  // Clean up extra spaces
  rendered = rendered.replace(/\s+/g, ' ').trim();

  return rendered;
};
