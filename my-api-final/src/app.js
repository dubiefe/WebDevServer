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
  res.json({ message: 'API works fine' });
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

export default app;