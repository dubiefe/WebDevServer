import { Server } from 'socket.io';
import { authMiddleware } from './middleware/auth.middleware.js';
import User from '../models/user.model.js';

let io;

export function setupSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  io.use(authMiddleware);

  io.on('connection', async (socket) => {
    const userId = socket.user._id;
    const user = await User.findById(userId);
    const companyId = user.company.toString();

    socket.join(companyId);

    console.log('Connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket not initialized');
  return io;
}