// src/config/db.js
import mongoose from 'mongoose';

const dbConnect = async () => {
  const DB_URI = process.env.DB_URI;
  
  if (!DB_URI) {
    console.error('❌ DB_URI is not defined in .env');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(DB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Eventos de conexión
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Disconnected to MongoDB');
});

// Cerrar conexión al terminar la app
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 Connection to MongoDB closed');
  process.exit(0);
});

export default dbConnect;