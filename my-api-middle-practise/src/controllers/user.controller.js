// src/controllers/auth.controller.js
import User from '../models/user.model.js';
import Company from '../models/company.model.js';
import Address from '../models/address.model.js';
import Uploads from '../models/uploads.model.js'
import RefreshToken from '../models/refreshToken.model.js';
import { encrypt, compare } from '../utils/handlePassword.js';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '../utils/handleJwt.js';
import { handleHttpError } from '../middleware/error.middleware.js';

const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3000";

// 1) POST /api/auth/register
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
    // Save the address
    // Check if the address exists
    let address = await Address.findOne({
      street: req.body.address.street,
      number: req.body.address.number,
      postal: req.body.address.postal,
      city: req.body.address.city,
      province: req.body.address.province
    });

    // If the address doesn't exists, we create it
    if (!address) {
      address = await Address.create(req.body.address);
    }
    
    // Create a user with the hash password
    const body = { ...req.body, password, address: address._id };
    const dataUser = await User.create(body);
    
    // Hide password in the response
    dataUser.set('password', undefined, { strict: false });
    
    // Generate token
    const accessToken = generateAccessToken(dataUser);
    const refreshToken = generateRefreshToken();
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

// 2) PUT /api/user/validation
export const emailValidation = async(req, res) => {
  try {
    const user = req.user;
    const code = req.body.verificationCode

    if(user.verificationCode == code) {
      const result = await User.findByIdAndUpdate(user._id, {status:"verified", verificationAttempts:3}, { new: true });
      res.status(201).json({ message: "Email validated" });
    } else {
      if(user.verificationAttempts == 0) {
        handleHttpError(res, 'TOO_MANY_REQUESTS', 429);
        return
      } else {
        const result = await User.findByIdAndUpdate(user._id, {$inc : {'verificationAttempts' : -1}}, { new: true });
        handleHttpError(res, 'INCORRECT_CODE', 400);
        return
      }
    }
    
  } catch (error) {
    handleHttpError(res, 'ERROR_VALIDATION_EMAIL', 409);
    return;
  }
}

// 3) POST /api/auth/login
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
        return res.status(401).json({ error: 'UNAUTHORIZED_CONNECTION' });
    }
    
    // Hide password in the response
    user.set('password', undefined, { strict: false });
    
    // Generate token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: getRefreshTokenExpiry(),
      createdByIp: req.ip
    });

    const data = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user
    };
    
    return res.status(201).send(data);

  } catch (err) {
    return res.status(401).json({ error: 'ERROR_LOGIN_USER' });
  }
};

// 4) PUT /api/user/register
export const onboardingPersonalData = async(req, res) => {
  try {
    const user = req.user;

    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, { new: true });

    res.status(200).json({ message: 'Personal data updated', content: updatedUser });
    
  } catch (error) {
    handleHttpError(res, 'ERROR_ONBOARDING_PERSONAL_DATA', 409);
    return;
  }
}

// 4) PUT /api/user/company
export const onboardingCompanyData = async(req, res) => {
  try {
    const user = req.user;
    const company = await Company.findOne({ cif:req.body.cif })
    
    if(company) { // company already exists
      const updatedUser = await User.findByIdAndUpdate(user._id, {company:company._id, role:"guest"}, { new: true });
      res.status(200).json({ message: 'User added to company', content: updatedUser });
    } else { // create the company
      if(req.body.isFreelance) { // Create company with user data
        const newCompany = await Company.create({owner:user._id, name:req.body.name, cif:user.nif, address:user.address, isFreelance:true})
        const updatedUser = await User.findByIdAndUpdate(user._id, {company:newCompany._id, role:"admin"}, { new: true });
        res.status(200).json({ message: 'Company data created in Freelance', content: {updatedUser, newCompany} });
      } else { // Create company with user as owner
        // Check address
        let address = await Address.findOne({
          street: req.body.address.street,
          number: req.body.address.number,
          postal: req.body.address.postal,
          city: req.body.address.city,
          province: req.body.address.province
        });
        if (!address) { address = await Address.create(req.body.address); }
        const newCompany = await Company.create({owner:user._id, name:req.body.name, cif:req.body.cif, address:address._id, isFreelance:false})
        const updatedUser = await User.findByIdAndUpdate(user._id, {company:newCompany._id, role:"admin"}, { new: true });
        res.status(200).json({ message: 'Company data created', content: {updatedUser, newCompany} });
      }
    }
    
  } catch (error) {
    handleHttpError(res, 'ERROR_ONBOARDING_COMPANY_DATA' + error, 409);
    return;
  }
}

// 5) PATCH /api/user/logo
export const addCompanyLogo = async(req, res) => {
  try {
    const user = req.user;
    if (!user.company) {
        return res.status(401).json({ error: 'NO_COMPANY_LINKED_TO_USER' });
    }

    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE_UPLOADED" });
    }

    const { filename, originalname, mimetype, size } = req.file;

    const fileData = await Uploads.create({
      filename,
      originalName: originalname,
      url: `${PUBLIC_URL}/uploads/${filename}`,
      mimetype,
      size
    });

    const updatedCompany = await Company.findByIdAndUpdate(user.company, {logo:filename}, { new: true });

    res.status(200).json({ message: 'Company logo uploaded', content: { updatedCompany, storage: fileData} });
    
  } catch (error) {
    handleHttpError(res, 'ERROR_UPLOADING_COMPANY_LOGO' + error, 409);
    return;
  }
}