import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title too long']
  },
  type: {
    type: String,
    enum: ['birthday', 'anniversary', 'pet_birthday', 'other'],
    required: true
  },
  // Original date (for age calculation)
  originalDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  // Store month and day separately for recurring
  recurringMonth: {
    type: Number,
    min: 1,
    max: 12,
    required: true
  },
  recurringDay: {
    type: Number,
    min: 1,
    max: 31,
    required: true
  },
  isRecurring: {
    type: Boolean,
    default: true
  },
  // Cached next occurrence (calculated automatically)
  nextOccurrence: {
    type: Date,
    index: true // Bug fix: Fast queries for "today" and "upcoming"
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes too long']
  },
  lastSynced: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Bug fix: Compound indexes for efficient queries
eventSchema.index({ userId: 1, nextOccurrence: 1 });
eventSchema.index({ contactId: 1, type: 1 });

/**
 * Pre-save hook: Calculate next occurrence automatically
 * Handles leap year edge cases (Feb 29)
 */
/**
 * Pre-save hook: Calculate next occurrence automatically
 * Handles leap year edge cases (Feb 29)
 */
eventSchema.pre('save', function(next) {
  if (this.isModified('originalDate') || this.isModified('recurringMonth') || this.isModified('recurringDay')) {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to midnight for comparison
    
    const currentYear = now.getFullYear();
    
    // Helper: Check leap year
    const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    
    // Try this year first
    let nextDate = new Date(currentYear, this.recurringMonth - 1, this.recurringDay, 0, 0, 0, 0);
    
    // Bug fix: Handle Feb 29 on non-leap years (move to Feb 28)
    if (this.recurringMonth === 2 && this.recurringDay === 29 && !isLeapYear(currentYear)) {
      nextDate = new Date(currentYear, 1, 28, 0, 0, 0, 0);
    }
    
    // IMPORTANT: Only move to next year if date has PASSED (strictly less than now)
    // This means if it's today, keep it this year!
    if (nextDate < now) {
      nextDate = new Date(currentYear + 1, this.recurringMonth - 1, this.recurringDay, 0, 0, 0, 0);
      
      // Handle leap year for next year too
      if (this.recurringMonth === 2 && this.recurringDay === 29 && !isLeapYear(currentYear + 1)) {
        nextDate = new Date(currentYear + 1, 1, 28, 0, 0, 0, 0);
      }
    }
    
    this.nextOccurrence = nextDate;
    
    console.log('📅 Calculated nextOccurrence:', {
      month: this.recurringMonth,
      day: this.recurringDay,
      nextDate: nextDate,
      dateString: nextDate.toISOString()
    });
  }
  next();
});


export default mongoose.model('Event', eventSchema);
