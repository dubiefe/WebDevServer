// src/server.js
import http from 'http';
import app from './app.js';
import dbConnect from './config/db.js';
import { setupSocket } from './socket/index.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await dbConnect();

  const server = http.createServer(app);

  // Websocket
  setupSocket(server);

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();