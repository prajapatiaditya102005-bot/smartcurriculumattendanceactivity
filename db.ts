import mongoose from 'mongoose';
import { ENV } from './env';

export const connectDB = async (): Promise<boolean> => {
  if (!ENV.MONGODB_URI) {
    console.log('ℹ️ MONGODB_URI not provided. Using persistent High-Performance In-Memory Data Store (Seeded).');
    return false;
  }

  try {
    await mongoose.connect(ENV.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully.');
    return true;
  } catch (error) {
    console.warn('⚠️ MongoDB Atlas connection error. Falling back to In-Memory Data Store.');
    return false;
  }
};
