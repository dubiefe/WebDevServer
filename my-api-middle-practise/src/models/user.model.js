// src/models/user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'The email is required']
    },
    password: {
      type: String,
      required: [true, 'The password is required']
    },
  },
  {
    timestamps: true,   
    versionKey: false   
  }
);

const User = mongoose.model('User', userSchema);

export default User;