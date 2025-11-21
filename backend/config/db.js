import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Bug fix: Mongoose 7+ doesn't need useNewUrlParser options
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Bug fix: Handle connection events properly
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting reconnect...');
    });

    // Bug fix: Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection FAILED:', error.message);
    process.exit(1);
  }
};

export default connectDB;
