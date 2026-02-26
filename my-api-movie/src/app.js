// src/app.js
import express from 'express'; // const express = require('express');
import routes from './routes/movies.routes.js';
import dbConnect from './config/db.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ mensage: 'API works fine' });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rutas de la API
app.use('/api/books', routes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await dbConnect();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();

export default app;