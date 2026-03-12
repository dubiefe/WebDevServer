// src/controllers/auth.controller.js
import User from '../models/user.model.js';
import { encrypt, compare } from '../utils/handlePassword.js';
import { tokenSign } from '../utils/handleJWT.js';

/**
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    // Check if email exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ error: 'EMAIL_ALREADY_EXISTS' });
    }
    
    // Encrypt password
    const password = await encrypt(req.body.password)
    
    // Create a user with the hash password
    const body = { ...req.body, password };
    const dataUser = await User.create(body);
    
    // Hide password in the response
    dataUser.set('password', undefined, { strict: false });
    
    // Generate token
    const data = {
      token: tokenSign(dataUser),
      user: dataUser
    };
    
    return res.status(201).send(data);

  } catch (error) {
    return res.status(409).json({ error: 'ERROR_REGISTER_USER' });
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Search for the correct user
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'USER_NOT_EXISTS' });
    }
    
    // Compare passwords
    const hashPassword = user.password;
    const check = await compare(password, hashPassword);
    if (!check) {
        return res.status(401).json({ error: 'INVALID_PASSWORD' });
    }
    
    // Hide password in the response
    user.set('password', undefined, { strict: false });
    
    // Generate token and answer
    const data = {
      token: tokenSign(user._id),
      user
    };
    
    return res.send(data);

  } catch (err) {
    return res.status(401).json({ error: 'ERROR_LOGIN_USER' });
  }
};