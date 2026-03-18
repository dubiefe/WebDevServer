// src/controllers/auth.controller.js
import User from '../models/user.model.js';
import RefreshToken from '../models/refreshToken.model.js';
import { encrypt, compare } from '../utils/handlePassword.js';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '../utils/handleJwt.js';
import { handleHttpError } from '../middleware/error.middleware.js';

/**
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    // Check if email exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      handleHttpError(res, 'EMAIL_ALREADY_EXISTS', 409);
      return;
    }
    
    // Encrypt password
    const password = await encrypt(req.body.password)
    
    // Create a user with the hash password
    const body = { ...req.body, password };
    const dataUser = await User.create(body);
    
    // Hide password in the response
    dataUser.set('password', undefined, { strict: false });
    
    // Generate token
    const accessToken = generateAccessToken(dataUser);
    const refreshToken = generateRefreshToken();

    // Guardar refresh token en BD
    await RefreshToken.create({
      token: refreshToken,
      user: dataUser._id,
      expiresAt: getRefreshTokenExpiry(),
      createdByIp: req.ip
    });

    const data = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {email:dataUser.email, status:dataUser.status, role:dataUser.role}
    };
    
    return res.status(201).send(data);

  } catch (error) {
    handleHttpError(res, 'ERROR_REGISTER_USER' + error, 409);
    return;
  }
};

/**
 * POST /api/auth/login
 */
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     // Search for the correct user
//     const user = await User.findOne({ email });
//     if (!user) {
//         return res.status(404).json({ error: 'USER_NOT_EXISTS' });
//     }
    
//     // Compare passwords
//     const hashPassword = user.password;
//     const check = await compare(password, hashPassword);
//     if (!check) {
//         return res.status(401).json({ error: 'INVALID_PASSWORD' });
//     }
    
//     // Hide password in the response
//     user.set('password', undefined, { strict: false });
    
//     // Generate token and answer
//     const data = {
//       token: generateAcessToken(user._id),
//       user
//     };
    
//     return res.send(data);

//   } catch (err) {
//     return res.status(401).json({ error: 'ERROR_LOGIN_USER' });
//   }
// };