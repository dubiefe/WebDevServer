// src/utils/handlePassword.js
import bcryptjs from 'bcryptjs';

/**
 * Encrypt a password
 * @param {string} clearPassword
 * @returns {Promise<string>}
 */
export const encrypt = async (clearPassword) => {
  const hash = await bcryptjs.hash(clearPassword, 8);
  return hash;
};

/**
 * Compare a password with its hash
 * @param {string} clearPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export const compare = async (clearPassword, hashedPassword) => {
  const result = await bcryptjs.compare(clearPassword, hashedPassword);
  return result;
};