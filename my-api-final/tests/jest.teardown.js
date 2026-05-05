import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.DB_URI);
    }

    await mongoose.connection.close();

  } catch (err) {
    console.error("Teardown error:", err);
  }
};