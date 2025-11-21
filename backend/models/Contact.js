import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Bug fix: Fast queries by user
  },
  name: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true,
    maxlength: [100, 'Name too long']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    // Bug fix: Flexible phone format (supports international)
    match: [/^\+?[\d\s\-()]+$/, 'Invalid phone number format']
  },
  relation: {
    type: String,
    enum: ['girlfriend', 'boyfriend', 'friend', 'family', 'colleague', 'other'],
    default: 'other'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes too long']
  },
  // Bug fix: Track sync for offline functionality
  lastSynced: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Bug fix: Compound index for efficient user queries
contactSchema.index({ userId: 1, createdAt: -1 });

// Bug fix: Prevent duplicate contacts for same user
contactSchema.index({ userId: 1, phone: 1 }, { unique: true });

export default mongoose.model('Contact', contactSchema);
