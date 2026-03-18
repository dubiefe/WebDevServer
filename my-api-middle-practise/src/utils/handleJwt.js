// src/utils/handleJwt.js
import jwt from 'jsonwebtoken';
import { randomBytes } from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS) || 7;

/**
 * Generate an access token JWT
 * @param {Object} user
 * @returns {string}
 */
export const generateAccessToken = (user) => {
  const sign = jwt.sign(
    {
      _id: user._id
    },
    JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES
    }
  );
  return sign;
};

/**
 * Generate a refresh token
 * Use crypto for an opaque token (not JWT)
 */
export const generateRefreshToken = () => {
  return randomBytes(64).toString('hex');
};

/**
 * Calculate the expiration date of the refresh token
 */
export const getRefreshTokenExpiry = () => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + REFRESH_TOKEN_DAYS);
  return expiry;
};

/**
 * Verify and decode a token
 * @param {string} tokenJwt
 * @returns {Object|null}
 */
export const verifyAccessToken = (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET);
  } catch (err) {
    console.log('Error verifying token:', err.message);
    return null;
  }
};