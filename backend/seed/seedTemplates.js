import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import Template from '../models/Template.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Seed system templates into database
 */
const seedTemplates = async () => {
  try {
    // Connect to database
    await connectDB();

    // Read templates from JSON file
    const templatesPath = join(__dirname, 'templates.json');
    const templatesData = JSON.parse(readFileSync(templatesPath, 'utf-8'));

    // Delete existing system templates
    await Template.deleteMany({ isSystem: true });
    console.log('✅ Cleared existing system templates');

    // Insert new templates
    const templates = templatesData.map(t => ({ ...t, isSystem: true }));
    await Template.insertMany(templates);

    console.log(`✅ Seeded ${templates.length} system templates`);
    console.log('Categories:', [...new Set(templates.map(t => t.category))]);
    console.log('Event types:', [...new Set(templates.map(t => t.eventType))]);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding templates:', error);
    process.exit(1);
  }
};

seedTemplates();
