// src/middleware/role.middleware.js

/**
 * Role Middleware - Amdin
 * Check if the user is admin
 */
export const adminRoleMiddleware = async (req, res, next) => {
  try {

    const user = req.user
   
    if(user.role != "admin") {
        return res.status(401).json({ error: 'UNAUTHORIZED_CONNECTION' });
    }

    next();
    
  } catch (err) {
    return res.status(401).json({ error: 'NOT_ROLE' });
  }
};