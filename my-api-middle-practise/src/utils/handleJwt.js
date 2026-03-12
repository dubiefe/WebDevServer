// src/utils/handleJwt.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

/**
 * Generate a token JWT
 * @param {Object} user
 * @returns {string}
 */
export const tokenSign = (user) => {
  const sign = jwt.sign(
    {
      _id: user._id
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN
    }
  );
  return sign;
};

/**
 * Verify and decode a token
 * @param {string} tokenJwt
 * @returns {Object|null}
 */
export const verifyToken = (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET);
  } catch (err) {
    console.log('Error verifying token:', err.message);
    return null;
  }
};