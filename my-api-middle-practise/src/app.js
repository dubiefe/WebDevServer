// src/app.js
import express from 'express'; // const express = require('express');
import routes from './routes/index.js';
import dbConnect from './config/db.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './docs/swagger.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Swagger doc
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Test route
app.get('/', (req, res) => {
  res.json({ mensage: 'API works fine' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api', routes);

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