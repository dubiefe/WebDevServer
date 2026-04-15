// src/middleware/auth.middleware.js
import User from '../models/user.model.js';
import { emitUserVerified } from '../services/notification.service.js';
import { verifyAccessToken } from '../utils/handleJwt.js';

/**
 * Authentification Middleware
 * Check the JWT user token and add the user to a req.user
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Check authorization in header
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'NOT_TOKEN' });
    }
    
    // Extract token: "Bearer eyJhbG..." -> "eyJhbG..."
    const token = req.headers.authorization.split(' ').pop();
    
    // Check token
    const dataToken = await verifyAccessToken(token);
    
    if (!dataToken || !dataToken._id) {
        return res.status(401).json({ error: 'ERROR_ID_TOKEN' });
    }
    
    // Search for user and add it to the response
    const user = await User.findById(dataToken._id);
    
    if (!user) {
        return res.status(401).json({ error: 'USER_NOT_FOUND' });
    }
    
    // Event emitter
    emitUserVerified({
      user: user
    });

    // Add user in the request
    req.user = user;
    next();
    
  } catch (err) {
    return res.status(401).json({ error: 'NOT_SESSION' });
  }
};