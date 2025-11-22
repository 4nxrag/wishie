import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Template title is required'],
    trim: true,
    maxlength: [100, 'Title too long']
  },
  content: {
    type: String,
    required: [true, 'Template content is required'],
    maxlength: [1000, 'Content too long']
  },
  category: {
    type: String,
    enum: ['girlfriend', 'boyfriend', 'friend', 'family', 'colleague', 'funny', 'formal', 'general'],
    default: 'general'
  },
  eventType: {
    type: String,
    enum: ['birthday', 'anniversary', 'pet_birthday', 'other', 'all'],
    default: 'all'
  },
  // System templates cannot be deleted by users
  isSystem: {
    type: Boolean,
    default: false
  },
  // User-created custom templates
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Available variables: {{name}}, {{age}}, {{relation}}, {{year}}, {{eventType}}
  variables: [{
    type: String,
    enum: ['name', 'age', 'relation', 'year', 'eventType']
  }]
}, {
  timestamps: true
});

// Bug fix: Indexes for efficient filtering
templateSchema.index({ category: 1, eventType: 1, isSystem: 1 });
templateSchema.index({ userId: 1 });

export default mongoose.model('Template', templateSchema);
