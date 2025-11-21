import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name too long'],
    minlength: [2, 'Name too short']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    // Bug fix: Proper email validation regex
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'],
    index: true // Bug fix: Index for faster queries
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be 6+ characters'],
    select: false // Bug fix: Never return password by default
  },
  refreshToken: {
    type: String,
    select: false
  }
}, {
  timestamps: true // Auto createdAt/updatedAt
});

// Bug fix: Hash ONLY if password modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Bug fix: Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

export default mongoose.model('User', userSchema);
